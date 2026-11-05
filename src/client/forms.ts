/* Contact form + Project Builder: validation, brief generation and delivery.
   Delivery depends on configuration (see src/config.ts):
   endpoint → POST JSON · email → mail app · telegram → copy + open chat · demo → copy / download only. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TG = /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

type Mode = "endpoint" | "email" | "telegram" | "demo";
type Brief = Record<string, string>;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const briefId = () => {
  const d = new Date();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HY-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${rnd}`;
};
const toText = (id: string, brief: Brief) => [`HYDRA project brief ${id}`, "", ...Object.entries(brief).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join("\n");

function validContact(v: string) { return EMAIL.test(v.trim()) || TG.test(v.trim()); }

function setError(field: Element | null, msg: string) {
  const wrap = field?.closest(".field") || null;
  const err = wrap?.querySelector(".field__error");
  wrap?.classList.toggle("is-invalid", !!msg);
  if (err) err.textContent = msg;
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setAttribute("aria-invalid", String(!!msg));
}

async function deliver(form: HTMLElement, id: string, brief: Brief): Promise<{ ok: boolean; note: string }> {
  const mode = (form.dataset.mode || "demo") as Mode;
  const text = toText(id, brief);
  if (mode === "endpoint") {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    try {
      const res = await fetch(form.dataset.endpoint!, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ id, ...brief }), signal: ctrl.signal });
      if (!res.ok) throw new Error(String(res.status));
      return { ok: true, note: "Your brief has been sent. We'll reply within one working day." };
    } catch {
      return { ok: false, note: "We couldn't send the brief right now. Please copy or download it and try again later." };
    } finally { clearTimeout(timer); }
  }
  if (mode === "email") {
    const url = `mailto:${form.dataset.email}?subject=${encodeURIComponent(`Project brief ${id}`)}&body=${encodeURIComponent(text.slice(0, 1800))}`;
    window.location.href = url;
    return { ok: true, note: "Your mail app should open with the brief filled in — press send there. If nothing opened, copy the brief below." };
  }
  if (mode === "telegram") {
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard may be blocked */ }
    window.open(`https://t.me/${form.dataset.telegram}`, "_blank", "noopener");
    return { ok: true, note: "The brief is copied. Paste it into the Telegram chat that just opened." };
  }
  return { ok: true, note: "Demo mode: nothing was sent. Your brief is ready below — copy or download it." };
}

function showConfirm(box: HTMLElement, id: string, brief: Brief, note: string, ok: boolean) {
  const text = toText(id, brief);
  box.hidden = false;
  box.innerHTML = `
    <span class="label label--accent">${ok ? "Brief ready" : "Not sent"}</span>
    <p class="confirm__id">${esc(id)}</p>
    <p>${esc(note)}</p>
    <div class="summary"><dl>${Object.entries(brief).filter(([, v]) => v).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl></div>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <button type="button" class="btn btn--small" data-copy><span>Copy brief</span></button>
      <button type="button" class="btn btn--ghost btn--small" data-download><span>Download .txt</span></button>
    </div>
    <span class="label" data-copy-status aria-live="polite"></span>`;
  box.querySelector("[data-copy]")!.addEventListener("click", async () => {
    const status = box.querySelector("[data-copy-status]")!;
    try { await navigator.clipboard.writeText(text); status.textContent = "Copied to clipboard."; }
    catch { status.textContent = "Copy is blocked by the browser — use Download instead."; }
  });
  box.querySelector("[data-download]")!.addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${id}.txt` });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  box.focus({ preventScroll: true });
  box.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
}

/* ------------------------------------------------------------ contact form */
export function initContactForms() {
  document.querySelectorAll<HTMLFormElement>("[data-contact-form]").forEach((form) => {
    const f = (n: string) => form.elements.namedItem(n) as HTMLInputElement | null;
    const validate = () => {
      let ok = true;
      const name = f("name")!, contact = f("contact")!, message = form.elements.namedItem("message") as HTMLTextAreaElement, consent = f("consent")!;
      const checks: [Element, string][] = [
        [name, name.value.trim().length < 2 ? "Please enter your name." : ""],
        [contact, !contact.value.trim() ? "How should we reply?" : !validContact(contact.value) ? "Enter an email or a Telegram @username." : ""],
        [message, message.value.trim().length < 20 ? "A couple of sentences, please (20+ characters)." : ""],
      ];
      checks.forEach(([el, msg]) => { setError(el, msg); if (msg) ok = false; });
      const cErr = form.querySelector("[data-consent-error]");
      if (cErr) cErr.textContent = consent.checked ? "" : "Please confirm so we can reply.";
      if (!consent.checked) ok = false;
      return ok;
    };
    form.addEventListener("input", (e) => {
      const t = e.target as HTMLElement;
      if (t.closest(".field.is-invalid")) validate();
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) { (form.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus(); return; }
      const data = new FormData(form);
      const brief: Brief = {
        Name: String(data.get("name")).trim(),
        Contact: String(data.get("contact")).trim(),
        Need: String(data.get("type") || ""),
        Message: String(data.get("message")).trim(),
        Source: "Contact form",
      };
      const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
      btn.disabled = true;
      const id = briefId();
      const res = await deliver(form, id, brief);
      showConfirm(form.querySelector<HTMLElement>("[data-confirm]")!, id, brief, res.note, res.ok);
      btn.disabled = false;
      if (res.ok) btn.querySelector("span")!.textContent = "Send another";
    });
  });
}

/* --------------------------------------------------------- project builder */
const FEATURES: Record<string, string[]> = {
  web: ["Responsive design", "Multi-page structure", "Online store or catalogue", "Booking or order form", "Blog or news", "CMS to edit content", "Several languages", "Animations and interactions", "Analytics setup", "Integrations (CRM, payments)"],
  redesign: ["New visual design", "New structure and navigation", "Content migration", "Speed optimisation", "Accessibility fixes", "Keep existing URLs and SEO", "CMS to edit content", "New features"],
  bot: ["Order taking", "Booking", "Answers to common questions", "Notifications", "Payments in Telegram", "Admin panel", "Broadcasts", "CRM or Google Sheets integration", "Several languages"],
  miniapp: ["Catalogue", "Booking", "Cart and checkout", "User profiles", "Telegram login", "Payments", "Admin panel", "Notifications through the bot"],
  products: ["Dashboard", "User accounts", "Roles and permissions", "Data import / export", "Integrations and API", "Reports", "Admin panel", "Real-time updates"],
  unsure: ["Website", "Telegram bot", "Mini App", "Online payments", "Admin panel", "Integrations", "Help me decide"],
};
const TYPE_LABEL: Record<string, string> = { web: "Website", redesign: "Redesign", bot: "Telegram bot", miniapp: "Telegram Mini App", products: "Custom digital product", unsure: "Not sure yet" };
const DRAFT_KEY = "hydra-builder-draft";

export function initBuilder() {
  const form = document.querySelector<HTMLFormElement>("[data-builder]");
  if (!form) return;
  const steps = Array.from(form.querySelectorAll<HTMLElement>("[data-step]"));
  const labels = Array.from(form.querySelectorAll<HTMLElement>("[data-step-label]"));
  const prev = form.querySelector<HTMLButtonElement>("[data-prev]")!;
  const next = form.querySelector<HTMLButtonElement>("[data-next]")!;
  const nextLabel = form.querySelector<HTMLElement>("[data-next-label]")!;
  const count = form.querySelector<HTMLElement>("[data-builder-count]")!;
  const progress = form.querySelector<HTMLElement>("[data-builder-progress]")!;
  const featuresBox = form.querySelector<HTMLElement>("[data-features]")!;
  const summary = form.querySelector<HTMLElement>("[data-summary]")!;
  const confirm = form.querySelector<HTMLElement>("[data-confirm]")!;
  let current = 0;

  const val = (name: string) => {
    const el = form.elements.namedItem(name);
    if (el instanceof RadioNodeList) return el.value;
    return (el as HTMLInputElement | null)?.value?.trim() || "";
  };
  const checkedFeatures = () => Array.from(form.querySelectorAll<HTMLInputElement>('input[name="features"]:checked')).map((i) => i.value);
  const err = (name: string, msg: string) => { const e = form.querySelector(`[data-error="${name}"]`); if (e) e.textContent = msg; const input = form.elements.namedItem(name); if (input instanceof HTMLInputElement) setError(input, msg); };

  const renderFeatures = () => {
    const type = val("type") || "unsure";
    const keep = new Set(checkedFeatures());
    featuresBox.innerHTML = (FEATURES[type] || FEATURES.unsure).map((f) => `<label class="choice"><input type="checkbox" name="features" value="${esc(f)}" ${keep.has(f) ? "checked" : ""}><span>${esc(f)}</span></label>`).join("");
  };

  const collect = (): Brief => ({
    "Product": TYPE_LABEL[val("type")] || "",
    "Main task": val("task"),
    "Context": val("context"),
    "Current site / reference": val("url"),
    "Features": checkedFeatures().join(", "),
    "Budget": val("budget"),
    "Timeline": val("timeline"),
    "Name": val("name"),
    "Contact": val("contact"),
    "Company": val("company"),
  });

  const validateStep = (i: number): boolean => {
    const need = (name: string, msg: string) => { const ok = !!val(name); err(name, ok ? "" : msg); return ok; };
    switch (i) {
      case 0: return need("type", "Choose one option.");
      case 1: {
        let ok = need("task", "Choose the main task.");
        const url = val("url");
        if (url && !/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(url)) { err("url", "Enter a full address starting with https://"); ok = false; } else err("url", "");
        return ok;
      }
      case 2: { const ok = checkedFeatures().length > 0; err("features", ok ? "" : "Pick at least one feature (or “Help me decide”)."); return ok; }
      case 3: return need("budget", "Choose a range — “Not sure yet” is fine.");
      case 4: return need("timeline", "Choose a timeline.");
      case 5: {
        let ok = true;
        const name = val("name"), contact = val("contact");
        err("name", name.length >= 2 ? "" : "Please enter your name."); if (name.length < 2) ok = false;
        const cOk = validContact(contact); err("contact", cOk ? "" : "Enter an email or a Telegram @username."); if (!cOk) ok = false;
        const consent = (form.elements.namedItem("consent") as HTMLInputElement).checked;
        const ce = form.querySelector('[data-error="consent"]'); if (ce) ce.textContent = consent ? "" : "Please confirm so we can reply.";
        return ok && consent;
      }
    }
    return true;
  };

  const renderSummary = () => {
    const b = collect();
    summary.innerHTML = `<dl>${Object.entries(b).filter(([k, v]) => v && !["Name", "Contact", "Company"].includes(k)).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`;
  };

  const save = () => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...collect(), _features: checkedFeatures(), _step: current, _raw: { type: val("type"), task: val("task"), budget: val("budget"), timeline: val("timeline") } })); } catch { /* storage unavailable */ } };
  const restore = () => {
    let d: any = null;
    try { d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch { d = null; }
    const params = new URLSearchParams(location.search);
    const typeParam = ({ web: "web", redesign: "redesign", telegram: "bot", products: "products" } as Record<string, string>)[params.get("type") || ""];
    const setRadio = (name: string, v?: string) => { if (!v) return; const el = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${CSS.escape(v)}"]`); if (el) el.checked = true; };
    if (d && d._raw) {
      setRadio("type", d._raw.type); setRadio("task", d._raw.task); setRadio("budget", d._raw.budget); setRadio("timeline", d._raw.timeline);
      (["context", "url", "name", "contact", "company"] as const).forEach((n) => { const el = form.elements.namedItem(n) as HTMLInputElement; const key = { context: "Context", url: "Current site / reference", name: "Name", contact: "Contact", company: "Company" }[n]; if (el && d[key]) el.value = d[key]; });
    }
    if (typeParam) setRadio("type", typeParam);
    renderFeatures();
    if (d && Array.isArray(d._features)) d._features.forEach((f: string) => { const el = featuresBox.querySelector<HTMLInputElement>(`input[value="${CSS.escape(f)}"]`); if (el) el.checked = true; });
  };

  const go = (i: number, focus = true) => {
    current = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((s, k) => (s.hidden = k !== current));
    labels.forEach((l, k) => { l.classList.toggle("is-current", k === current); l.classList.toggle("is-done", k < current); });
    prev.disabled = current === 0;
    nextLabel.textContent = current === steps.length - 1 ? "Send brief" : "Next";
    count.textContent = `Step ${current + 1} of ${steps.length}`;
    progress.style.setProperty("--p", String((current + 1) / steps.length));
    if (current === 2) renderFeatures();
    if (current === steps.length - 1) renderSummary();
    if (focus) {
      const legend = steps[current].querySelector<HTMLElement>("legend");
      legend?.setAttribute("tabindex", "-1");
      legend?.focus({ preventScroll: true });
      const top = form.getBoundingClientRect().top + scrollY - 120;
      if (scrollY > top) window.scrollTo({ top, behavior: "auto" });
    }
  };

  form.addEventListener("change", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === "type") renderFeatures();
    save();
  });
  form.addEventListener("input", save);
  prev.addEventListener("click", () => go(current - 1));
  form.addEventListener("submit", (e) => { e.preventDefault(); next.click(); });
  next.addEventListener("click", async () => {
    if (!validateStep(current)) { (steps[current].querySelector('[aria-invalid="true"], input:not([type=hidden])') as HTMLElement | null)?.focus(); return; }
    if (current < steps.length - 1) { go(current + 1); return; }
    next.disabled = true;
    const brief = { ...collect(), Source: "Project Builder" };
    const id = briefId();
    const res = await deliver(form, id, brief);
    steps.forEach((s) => (s.hidden = true));
    form.querySelector<HTMLElement>("[data-builder-nav]")!.hidden = true;
    labels.forEach((l) => { l.classList.remove("is-current"); l.classList.add("is-done"); });
    count.textContent = "Done";
    progress.style.setProperty("--p", "1");
    showConfirm(confirm, id, brief, res.note, res.ok);
    if (res.ok) { try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ } }
  });

  restore();
  go(0, false);
}
