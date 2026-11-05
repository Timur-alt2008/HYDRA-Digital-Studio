// Minimal in-memory stand-in for the parts of the Supabase API the site uses (Auth + PostgREST),
// with the same access rules as supabase/schema.sql: own rows only, status changes by admins only.
import http from "node:http";
import { randomUUID } from "node:crypto";

export function startMockSupabase(port, { admins = [] } = {}) {
  const users = new Map();      // email -> { id, email, password, name }
  const tokens = new Map();     // token -> email
  const rows = [];
  const issue = (u) => { const t = randomUUID(); tokens.set(t, u.email); return { access_token: t, refresh_token: randomUUID(), expires_in: 3600, user: { id: u.id, email: u.email, user_metadata: { name: u.name } } }; };
  const who = (req) => { const t = (req.headers.authorization || "").replace("Bearer ", ""); const e = tokens.get(t); return e ? users.get(e) : null; };
  const isAdmin = (u) => !!u && admins.includes(u.email);
  const send = (res, code, body) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(body === undefined ? "" : JSON.stringify(body)); };
  const srv = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "apikey, authorization, content-type, prefer");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
    if (req.method === "OPTIONS") return send(res, 204);
    if (req.headers.apikey !== "test-anon") return send(res, 401, { message: "Invalid API key" });
    let raw = ""; for await (const c of req) raw += c;
    const body = raw ? JSON.parse(raw) : {};
    const url = new URL(req.url, "http://x");
    const p = url.pathname;
    if (p === "/auth/v1/signup" && req.method === "POST") {
      if (users.has(body.email)) return send(res, 200, { id: randomUUID(), identities: [] });   // what Supabase does
      if ((body.password || "").length < 8) return send(res, 422, { error_code: "weak_password", msg: "Password should be at least 8 characters" });
      const u = { id: randomUUID(), email: body.email, password: body.password, name: body.data?.name || "" };
      users.set(u.email, u); return send(res, 200, issue(u));
    }
    if (p === "/auth/v1/token") {
      if (url.searchParams.get("grant_type") === "password") {
        const u = users.get(body.email);
        if (!u || u.password !== body.password) return send(res, 400, { error_code: "invalid_credentials", msg: "Invalid login credentials" });
        return send(res, 200, issue(u));
      }
      return send(res, 400, { msg: "invalid refresh" });
    }
    if (p === "/auth/v1/logout") return send(res, 204);
    const u = who(req);
    if (p === "/rest/v1/rpc/is_admin") return send(res, 200, isAdmin(u));
    if (p === "/rest/v1/requests") {
      if (!u) return send(res, 401, { message: "JWT required" });
      if (req.method === "GET") {
        let out = rows.filter((r) => r.user_id === u.id || isAdmin(u));
        const uid = url.searchParams.get("user_id"); if (uid) out = out.filter((r) => r.user_id === uid.replace("eq.", ""));
        return send(res, 200, [...out].sort((a, b) => b.created_at.localeCompare(a.created_at)));
      }
      if (req.method === "POST") {
        if (body.status && body.status !== "new") return send(res, 403, { message: "new row violates row-level security policy" });
        const now = new Date().toISOString();
        const r = { id: randomUUID(), user_id: u.id, user_email: u.email, status: "new", studio_note: null, created_at: now, updated_at: now, ...body };
        rows.push(r); return send(res, 201, [r]);
      }
      if (req.method === "PATCH") {
        if (!isAdmin(u)) return send(res, 200, []);   // RLS: silently matches no rows
        const id = (url.searchParams.get("id") || "").replace("eq.", "");
        const r = rows.find((x) => x.id === id); if (r) Object.assign(r, body, { updated_at: new Date().toISOString() });
        return send(res, 204);
      }
    }
    send(res, 404, { message: "not found" });
  });
  srv.listen(port);
  return srv;
}
