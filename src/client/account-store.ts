/* Accounts and requests.
   Two interchangeable backends behind one interface:
   - live: Supabase (Auth + PostgREST with row-level security), configured with SUPABASE_URL / SUPABASE_ANON_KEY;
   - demo: everything stays in this browser's localStorage (clearly labelled on the page). Passwords are never stored,
     only a PBKDF2 hash with a random salt.
   The studio changes request statuses: in live mode through the studio view (allowed by RLS for admins only),
   in demo mode through a labelled "studio simulation" switch on the account page. */

export type Status = "new" | "in_review" | "in_progress" | "done" | "declined";
export const ACTIVE: Status[] = ["new", "in_review", "in_progress"];
export const CLOSED: Status[] = ["done", "declined"];
export const STATUSES: Status[] = [...ACTIVE, ...CLOSED];

export type User = { id: string; email: string; name: string };
export type RequestRecord = {
  id: string;
  ref: string;
  kind: "brief" | "message";
  product: string;
  summary: string;
  brief: Record<string, string>;
  status: Status;
  studio_note: string | null;
  created_at: string;
  updated_at: string;
  user_email?: string;
};
export type NewRequest = Pick<RequestRecord, "ref" | "kind" | "product" | "summary" | "brief">;
export type AuthResult = { ok: true; user: User } | { ok: true; confirm: true } | { ok: false; error: AuthError };
export type AuthError = "exists" | "invalid" | "weak" | "network" | "unknown" | "unconfirmed";

export interface Store {
  mode: "live" | "demo";
  current(): Promise<User | null>;
  signUp(name: string, email: string, password: string): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  list(): Promise<RequestRecord[]>;
  add(r: NewRequest): Promise<RequestRecord | null>;
  isAdmin(): Promise<boolean>;
  listAll(): Promise<RequestRecord[]>;
  setStatus(id: string, status: Status, note: string | null): Promise<boolean>;
}

const now = () => new Date().toISOString();
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));
const read = <T,>(k: string, fallback: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } };
const drop = (k: string) => { try { localStorage.removeItem(k); } catch { /* ignore */ } };

/* ---------------------------------------------------------------- demo */
type DemoDb = { users: Record<string, { id: string; name: string; salt: string; hash: string }>; requests: Record<string, RequestRecord[]> };
const DEMO_DB = "thydra-demo-accounts";
const DEMO_SESSION = "thydra-demo-session";

const b64 = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf instanceof Uint8Array ? buf : new Uint8Array(buf))));
async function hashPassword(password: string, saltB64?: string) {
  const salt = saltB64 ? Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0)) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" }, key, 256);
  return { salt: b64(salt), hash: b64(bits) };
}

export function demoStore(): Store {
  const db = (): DemoDb => read<DemoDb>(DEMO_DB, { users: {}, requests: {} });
  const session = () => read<{ email: string } | null>(DEMO_SESSION, null);
  const userOf = (email: string): User | null => { const u = db().users[email]; return u ? { id: u.id, email, name: u.name } : null; };
  return {
    mode: "demo",
    async current() { const s = session(); return s ? userOf(s.email) : null; },
    async signUp(name, email, password) {
      email = email.trim().toLowerCase();
      const d = db();
      if (d.users[email]) return { ok: false, error: "exists" };
      const { salt, hash } = await hashPassword(password);
      d.users[email] = { id: uid(), name: name.trim(), salt, hash };
      d.requests[email] = d.requests[email] || [];
      write(DEMO_DB, d); write(DEMO_SESSION, { email });
      return { ok: true, user: userOf(email)! };
    },
    async signIn(email, password) {
      email = email.trim().toLowerCase();
      const u = db().users[email];
      if (!u) return { ok: false, error: "invalid" };
      const { hash } = await hashPassword(password, u.salt);
      if (hash !== u.hash) return { ok: false, error: "invalid" };
      write(DEMO_SESSION, { email });
      return { ok: true, user: userOf(email)! };
    },
    async signOut() { drop(DEMO_SESSION); },
    async list() { const s = session(); return s ? [...(db().requests[s.email] || [])].sort((a, b) => b.created_at.localeCompare(a.created_at)) : []; },
    async add(r) {
      const s = session(); if (!s) return null;
      const d = db();
      const rec: RequestRecord = { ...r, id: uid(), status: "new", studio_note: null, created_at: now(), updated_at: now() };
      (d.requests[s.email] = d.requests[s.email] || []).push(rec);
      write(DEMO_DB, d);
      return rec;
    },
    // In demo mode the "studio" can only act on this browser's own requests (simulation switch on the page).
    async isAdmin() { return false; },
    async listAll() { return this.list(); },
    async setStatus(id, status, note) {
      const s = session(); if (!s) return false;
      const d = db(); const rec = (d.requests[s.email] || []).find((x) => x.id === id);
      if (!rec) return false;
      rec.status = status; rec.studio_note = note; rec.updated_at = now();
      write(DEMO_DB, d); return true;
    },
  };
}

/* ---------------------------------------------------------------- live (Supabase) */
type Session = { access_token: string; refresh_token: string; expires_at: number; user: { id: string; email: string; user_metadata?: { name?: string } } };
const LIVE_SESSION = "thydra-session";

export function liveStore(url: string, key: string): Store {
  const base = url.replace(/\/+$/, "");
  const toUser = (u: Session["user"]): User => ({ id: u.id, email: u.email, name: u.user_metadata?.name || u.email.split("@")[0] });
  const save = (s: Session) => write(LIVE_SESSION, s);
  const fromToken = (j: { access_token: string; refresh_token: string; expires_in: number; user: Session["user"] }): Session =>
    ({ access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Math.floor(Date.now() / 1000) + (j.expires_in || 3600), user: j.user });

  async function call(path: string, init: RequestInit = {}, token?: string) {
    const headers: Record<string, string> = { apikey: key, "Content-Type": "application/json", ...(init.headers as Record<string, string> || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(base + path, { ...init, headers });
  }
  async function session(): Promise<Session | null> {
    const s = read<Session | null>(LIVE_SESSION, null);
    if (!s) return null;
    if (s.expires_at - 60 > Date.now() / 1000) return s;
    try {
      const r = await call("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: s.refresh_token }) });
      if (!r.ok) { drop(LIVE_SESSION); return null; }
      const fresh = fromToken(await r.json()); save(fresh); return fresh;
    } catch { return s; }
  }
  const errorOf = (status: number, body: { msg?: string; error_description?: string; message?: string; error_code?: string }): AuthError => {
    const m = `${body.error_code || ""} ${body.msg || ""} ${body.error_description || ""} ${body.message || ""}`.toLowerCase();
    if (m.includes("already") || m.includes("exists")) return "exists";
    if (m.includes("not confirmed") || m.includes("email_not_confirmed")) return "unconfirmed";
    if (m.includes("password") && (m.includes("weak") || m.includes("least") || m.includes("short"))) return "weak";
    if (status === 400 || status === 401 || m.includes("invalid")) return "invalid";
    return "unknown";
  };

  return {
    mode: "live",
    async current() {
      // back from the confirmation e-mail: #access_token=…&refresh_token=…&expires_in=…
      if (location.hash.includes("access_token=")) {
        const h = new URLSearchParams(location.hash.slice(1));
        history.replaceState(null, "", location.pathname + location.search);
        try {
          const r = await call("/auth/v1/user", {}, h.get("access_token")!);
          if (r.ok) save(fromToken({ access_token: h.get("access_token")!, refresh_token: h.get("refresh_token") || "", expires_in: Number(h.get("expires_in") || 3600), user: await r.json() }));
        } catch { /* fall through to the stored session */ }
      }
      const s = await session(); return s ? toUser(s.user) : null;
    },
    async signUp(name, email, password) {
      try {
        const back = encodeURIComponent(location.origin + accountUrl());
        const r = await call(`/auth/v1/signup?redirect_to=${back}`, { method: "POST", body: JSON.stringify({ email: email.trim(), password, data: { name: name.trim() } }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) return { ok: false, error: errorOf(r.status, j) };
        if (j.access_token) { const s = fromToken(j); save(s); return { ok: true, user: toUser(s.user) }; }
        // Supabase returns a user without identities for an already registered e-mail
        if (j.identities && j.identities.length === 0) return { ok: false, error: "exists" };
        return { ok: true, confirm: true };
      } catch { return { ok: false, error: "network" }; }
    },
    async signIn(email, password) {
      try {
        const r = await call("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email: email.trim(), password }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) return { ok: false, error: errorOf(r.status, j) };
        const s = fromToken(j); save(s); return { ok: true, user: toUser(s.user) };
      } catch { return { ok: false, error: "network" }; }
    },
    async signOut() {
      const s = read<Session | null>(LIVE_SESSION, null);
      drop(LIVE_SESSION);
      if (s) { try { await call("/auth/v1/logout", { method: "POST" }, s.access_token); } catch { /* offline is fine */ } }
    },
    async list() {
      const s = await session(); if (!s) return [];
      const r = await call(`/rest/v1/requests?select=*&user_id=eq.${s.user.id}&order=created_at.desc`, {}, s.access_token);
      return r.ok ? r.json() : [];
    },
    async add(req) {
      const s = await session(); if (!s) return null;
      const r = await call("/rest/v1/requests", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(req) }, s.access_token);
      if (!r.ok) return null;
      const rows = await r.json(); return rows[0] || null;
    },
    async isAdmin() {
      const s = await session(); if (!s) return false;
      const r = await call("/rest/v1/rpc/is_admin", { method: "POST", body: "{}" }, s.access_token);
      return r.ok ? (await r.json()) === true : false;
    },
    async listAll() {
      const s = await session(); if (!s) return [];
      const r = await call("/rest/v1/requests?select=*&order=created_at.desc", {}, s.access_token);
      return r.ok ? r.json() : [];
    },
    async setStatus(id, status, note) {
      const s = await session(); if (!s) return false;
      const r = await call(`/rest/v1/requests?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status, studio_note: note }) }, s.access_token);
      return r.ok;
    },
  };
}

/** The store configured for this page (data attributes are written by the build). */
let cached: Store | null = null;
export function store(): Store {
  if (cached) return cached;
  const b = document.body.dataset;
  cached = b.sbUrl && b.sbKey ? liveStore(b.sbUrl, b.sbKey) : demoStore();
  return cached;
}
export const accountUrl = () => document.body.dataset.accountUrl || "account/";
