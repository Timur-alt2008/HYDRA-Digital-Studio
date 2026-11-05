/* "My account" page + header account button + saving requests from the forms. */
import { ACTIVE, CLOSED, STATUSES, accountUrl, store, type AuthError, type NewRequest, type RequestRecord, type Status, type User } from "./account-store";
import { t } from "./lang";

const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const statusLabel = (s: Status) => ({
  new: t("New", "Новая"),
  in_review: t("In review", "На рассмотрении"),
  in_progress: t("In progress", "В работе"),
  done: t("Completed", "Выполнена"),
  declined: t("Declined", "Отклонена"),
}[s]);

const authMessage = (e: AuthError) => ({
  exists: t("An account with this email already exists. Sign in instead.", "Аккаунт с таким email уже есть. Войдите в него."),
  invalid: t("Wrong email or password.", "Неверный email или пароль."),
  weak: t("The password is too weak — use at least 8 characters.", "Слишком простой пароль — нужно не меньше 8 символов."),
  network: t("No connection to the server. Check the internet and try again.", "Нет связи с сервером. Проверьте интернет и попробуйте ещё раз."),
  unconfirmed: t("Confirm your email first — open the link we sent you.", "Сначала подтвердите email — откройте ссылку из письма."),
  unknown: t("Something went wrong. Please try again.", "Что-то пошло не так. Попробуйте ещё раз."),
}[e]);

const fmtDate = (iso: string) => {
  try { return new Intl.DateTimeFormat(document.documentElement.lang, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)); }
  catch { return iso.slice(0, 16).replace("T", " "); }
};
const firstName = (u: User) => u.name.split(/\s+/)[0] || u.email;

/* ---------------------------------------------------------- header button */
export async function initAccountLink() {
  const link = document.querySelector<HTMLAnchorElement>("[data-account-link]");
  if (!link) return;
  const user = await store().current().catch(() => null);
  const label = link.querySelector<HTMLElement>("[data-account-label]")!;
  if (user) {
    link.classList.add("is-signed");
    label.textContent = firstName(user);
    link.setAttribute("aria-label", t("My account", "Личный кабинет") + ": " + user.name);
  } else {
    link.classList.remove("is-signed");
    label.textContent = t("Sign in", "Войти");
    link.setAttribute("aria-label", t("Sign in to your account", "Войти в личный кабинет"));
  }
}

/* --------------------------------------------- forms → save to the account */
export type SaveResult = { saved: boolean; live: boolean; signedIn: boolean };
export async function saveToAccount(req: NewRequest): Promise<SaveResult> {
  const s = store();
  const user = await s.current().catch(() => null);
  if (!user) return { saved: false, live: s.mode === "live", signedIn: false };
  const rec = await s.add(req).catch(() => null);
  return { saved: !!rec, live: s.mode === "live", signedIn: true };
}
export function accountNoteHtml(r: SaveResult) {
  const url = esc(accountUrl());
  if (r.saved) return `<p class="account-note"><b>${esc(t("Saved to your account.", "Сохранено в вашем кабинете."))}</b> ${esc(t("You can follow its status there.", "Там можно следить за статусом."))} <a class="link-arrow" href="${url}">${esc(t("Open my account", "Открыть кабинет"))} →</a></p>`;
  if (r.signedIn) return `<p class="account-note">${esc(t("We couldn't save this request to your account. Copy the brief to keep it.", "Не удалось сохранить заявку в кабинете. Скопируйте бриф, чтобы не потерять его."))}</p>`;
  return `<p class="account-note">${esc(t("Want to follow the status of your requests?", "Хотите следить за статусом заявок?"))} <a class="link-arrow" href="${url}">${esc(t("Sign in or create an account", "Войдите или зарегистрируйтесь"))} →</a></p>`;
}
/** Pre-fill name and contact in a form for a signed-in visitor. */
export async function prefillFromAccount(form: HTMLFormElement) {
  const user = await store().current().catch(() => null);
  if (!user) return;
  const set = (n: string, v: string) => { const el = form.elements.namedItem(n) as HTMLInputElement | null; if (el && !el.value) el.value = v; };
  set("name", user.name); set("contact", user.email);
}

/* ------------------------------------------------------------ account page */
export function initAccountPage() {
  const root = document.querySelector<HTMLElement>("[data-account]");
  if (!root) return;
  const s = store();
  const auth = root.querySelector<HTMLElement>("[data-auth]")!;
  const dash = root.querySelector<HTMLElement>("[data-dash]")!;
  const signin = root.querySelector<HTMLFormElement>("[data-signin]")!;
  const signup = root.querySelector<HTMLFormElement>("[data-signup]")!;
  const authConfirm = root.querySelector<HTMLElement>("[data-auth-confirm]")!;
  let isAdmin = false;
  let simulate = false;

  /* -- tabs helper (roving tabindex, arrow keys) */
  const tabs = (container: HTMLElement, onSelect: (id: string) => void) => {
    const btns = [...container.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const select = (b: HTMLButtonElement, focus = false) => {
      btns.forEach((x) => { const on = x === b; x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1; });
      if (focus) b.focus();
      onSelect(b.dataset.authTab || b.dataset.dashTab || "");
    };
    btns.forEach((b, i) => {
      b.addEventListener("click", () => select(b));
      b.addEventListener("keydown", (e) => {
        const vis = btns.filter((x) => !x.hidden); const k = vis.indexOf(b);
        if (e.key === "ArrowRight") { e.preventDefault(); select(vis[(k + 1) % vis.length], true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); select(vis[(k - 1 + vis.length) % vis.length], true); }
      });
      void i;
    });
    return (id: string) => { const b = btns.find((x) => (x.dataset.authTab || x.dataset.dashTab) === id); if (b) select(b); };
  };

  const showAuthTab = tabs(auth.querySelector(".tabs")!, (id) => {
    signin.hidden = id !== "signin"; signup.hidden = id !== "signup"; authConfirm.hidden = true;
  });
  root.querySelectorAll<HTMLButtonElement>("[data-auth-go]").forEach((b) => b.addEventListener("click", () => {
    showAuthTab(b.dataset.authGo!);
    (b.dataset.authGo === "signup" ? signup : signin).querySelector<HTMLInputElement>("input")?.focus();
  }));

  /* -- field validation */
  const setErr = (input: HTMLInputElement, msg: string) => {
    const field = input.closest(".field"); field?.classList.toggle("is-invalid", !!msg);
    input.setAttribute("aria-invalid", String(!!msg));
    const e = field?.querySelector(".field__error"); if (e) e.textContent = msg;
    return !msg;
  };
  const val = (f: HTMLFormElement, n: string) => (f.elements.namedItem(n) as HTMLInputElement);
  const busy = (f: HTMLFormElement, on: boolean) => { const b = f.querySelector<HTMLButtonElement>('button[type="submit"]')!; b.disabled = on; f.setAttribute("aria-busy", String(on)); };

  signin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = val(signin, "email"), pw = val(signin, "password");
    const ok = [setErr(email, EMAIL.test(email.value.trim()) ? "" : t("Enter a valid email.", "Укажите корректный email.")), setErr(pw, pw.value ? "" : t("Enter your password.", "Введите пароль."))].every(Boolean);
    const formErr = signin.querySelector("[data-form-error]")!; formErr.textContent = "";
    if (!ok) { signin.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); return; }
    busy(signin, true);
    const r = await s.signIn(email.value, pw.value);
    busy(signin, false);
    if (!r.ok) { formErr.textContent = authMessage(r.error); return; }
    signin.reset(); await render();
  });

  signup.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = val(signup, "name"), email = val(signup, "email"), pw = val(signup, "password"), consent = val(signup, "consent");
    const ok = [
      setErr(name, name.value.trim().length >= 2 ? "" : t("Please enter your name.", "Введите имя.")),
      setErr(email, EMAIL.test(email.value.trim()) ? "" : t("Enter a valid email.", "Укажите корректный email.")),
      setErr(pw, pw.value.length >= 8 ? "" : t("At least 8 characters.", "Не меньше 8 символов.")),
    ].every(Boolean);
    const cErr = signup.querySelector("[data-consent-error]")!; cErr.textContent = consent.checked ? "" : t("Please confirm to create the account.", "Подтвердите согласие, чтобы создать аккаунт.");
    const formErr = signup.querySelector("[data-form-error]")!; formErr.textContent = "";
    if (!ok || !consent.checked) { signup.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); return; }
    busy(signup, true);
    const r = await s.signUp(name.value, email.value, pw.value);
    busy(signup, false);
    if (!r.ok) { formErr.textContent = authMessage(r.error); return; }
    if ("confirm" in r) {
      signup.hidden = true;
      authConfirm.hidden = false;
      authConfirm.innerHTML = `<span class="label label--accent">${esc(t("Almost done", "Почти готово"))}</span><p class="h3">${esc(t("Check your inbox", "Проверьте почту"))}</p><p>${esc(t("We sent a confirmation link to", "Мы отправили ссылку для подтверждения на"))} <b>${esc(email.value.trim())}</b>. ${esc(t("Open it, then sign in.", "Откройте её, а затем войдите."))}</p>`;
      authConfirm.focus();
      return;
    }
    signup.reset(); await render();
  });

  root.querySelector("[data-signout]")!.addEventListener("click", async () => { await s.signOut(); await render(); initAccountLink(); });

  /* -- dashboard */
  let showList: (id: string) => void = () => {};
  showList = tabs(root.querySelector("[data-dash-tabs]")!, (id) => {
    root.querySelectorAll<HTMLElement>("[data-list]").forEach((l) => (l.hidden = l.dataset.list !== id));
  });
  const sim = root.querySelector<HTMLInputElement>("[data-studio-sim]");
  sim?.addEventListener("change", () => { simulate = sim.checked; render(); });

  const card = (r: RequestRecord, controls: boolean) => {
    const details = Object.entries(r.brief || {}).filter(([, v]) => v).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
    const steps = ACTIVE.concat("done" as Status);
    const idx = r.status === "declined" ? -1 : steps.indexOf(r.status);
    return `<article class="req req--${r.status}" data-req="${esc(r.id)}">
      <header class="req__head">
        <span class="req__ref">${esc(r.ref)}</span>
        <span class="req-status req-status--${r.status}">${esc(statusLabel(r.status))}</span>
      </header>
      <h3 class="req__title">${esc(r.product || t("Request", "Заявка"))}</h3>
      ${r.summary ? `<p class="req__summary">${esc(r.summary)}</p>` : ""}
      ${r.status !== "declined" ? `<ol class="req__track" aria-label="${esc(t("Progress", "Прогресс"))}">${steps.map((st, i) => `<li class="${i <= idx ? "is-on" : ""}${i === idx ? " is-current" : ""}">${esc(statusLabel(st))}</li>`).join("")}</ol>` : ""}
      ${r.studio_note ? `<div class="req__note"><span class="label">${esc(t("Studio note", "Комментарий студии"))}</span><p>${esc(r.studio_note)}</p></div>` : ""}
      <p class="req__meta">${esc(t("Sent", "Отправлена"))} ${esc(fmtDate(r.created_at))}${r.updated_at && r.updated_at !== r.created_at ? ` · ${esc(t("updated", "обновлена"))} ${esc(fmtDate(r.updated_at))}` : ""}${r.user_email ? ` · ${esc(r.user_email)}` : ""}</p>
      ${details ? `<details class="req__details"><summary>${esc(t("Brief details", "Подробности брифа"))}</summary><div class="summary"><dl>${details}</dl></div></details>` : ""}
      ${controls ? `<form class="req__studio" data-studio-form>
        <span class="label label--accent">${esc(t("Studio", "Студия"))}</span>
        <label><span class="sr-only">${esc(t("Status", "Статус"))}</span><select name="status">${STATUSES.map((st) => `<option value="${st}"${st === r.status ? " selected" : ""}>${esc(statusLabel(st))}</option>`).join("")}</select></label>
        <label class="req__studio-note"><span class="sr-only">${esc(t("Note for the client", "Комментарий для клиента"))}</span><input name="note" maxlength="500" placeholder="${esc(t("Note for the client (optional)", "Комментарий для клиента (необязательно)"))}" value="${esc(r.studio_note || "")}"></label>
        <button class="btn btn--small" type="submit"><span>${esc(t("Save", "Сохранить"))}</span></button>
      </form>` : ""}
    </article>`;
  };

  const empty = (kind: "active" | "closed") => `<div class="req-empty"><p class="h3">${esc(kind === "active" ? t("No active requests", "Активных заявок нет") : t("Nothing completed yet", "Выполненных пока нет"))}</p><p class="muted">${esc(kind === "active" ? t("Send a brief while signed in and it will appear here.", "Отправьте бриф, находясь в аккаунте, — он появится здесь.") : t("Requests the studio has completed or closed will move here.", "Сюда переместятся заявки, которые студия выполнила или закрыла."))}</p>${kind === "active" ? `<a class="btn btn--small" href="${esc((document.body.dataset.base || "") + "start/")}"><span>${esc(t("Open the Project Builder", "Открыть Project Builder"))}</span></a>` : ""}</div>`;

  const bindStudio = (list: HTMLElement) => {
    list.querySelectorAll<HTMLFormElement>("[data-studio-form]").forEach((f) => f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = f.closest<HTMLElement>("[data-req]")!.dataset.req!;
      const status = (f.elements.namedItem("status") as HTMLSelectElement).value as Status;
      const note = (f.elements.namedItem("note") as HTMLInputElement).value.trim() || null;
      const btn = f.querySelector("button")!; btn.disabled = true;
      await s.setStatus(id, status, note);
      await render();
    }));
  };

  async function render() {
    const user = await s.current().catch(() => null);
    auth.hidden = !!user; dash.hidden = !user;
    initAccountLink();
    if (!user) { showAuthTab("signin"); return; }
    root.querySelector("[data-dash-name]")!.textContent = t("Hello, {name}", "Здравствуйте, {name}", { name: firstName(user) });
    root.querySelector("[data-dash-email]")!.textContent = user.email;
    root.querySelector("[data-dash-initial]")!.textContent = (user.name || user.email).trim().charAt(0).toUpperCase();

    const mine = await s.list().catch(() => []);
    const active = mine.filter((r) => ACTIVE.includes(r.status));
    const closed = mine.filter((r) => CLOSED.includes(r.status));
    const controls = s.mode === "demo" && simulate;
    const listA = root.querySelector<HTMLElement>('[data-list="active"]')!;
    const listC = root.querySelector<HTMLElement>('[data-list="closed"]')!;
    listA.innerHTML = active.length ? active.map((r) => card(r, controls)).join("") : empty("active");
    listC.innerHTML = closed.length ? closed.map((r) => card(r, controls)).join("") : empty("closed");
    root.querySelector('[data-count="active"]')!.textContent = String(active.length);
    root.querySelector('[data-count="closed"]')!.textContent = String(closed.length);
    root.querySelector("[data-dash-stats]")!.innerHTML = [
      [t("All requests", "Всего заявок"), mine.length],
      [t("In progress", "В работе"), active.length],
      [t("Completed", "Выполнено"), mine.filter((r) => r.status === "done").length],
    ].map(([k, v]) => `<div><span class="label">${esc(String(k))}</span><b>${v}</b></div>`).join("");
    bindStudio(listA); bindStudio(listC);

    // studio view (live mode, admins only — enforced by row-level security on the server)
    isAdmin = s.mode === "live" ? await s.isAdmin().catch(() => false) : false;
    const tabStudio = root.querySelector<HTMLButtonElement>('[data-dash-tab="studio"]')!;
    tabStudio.hidden = !isAdmin;
    if (isAdmin) {
      const all = await s.listAll().catch(() => []);
      const listS = root.querySelector<HTMLElement>('[data-list="studio"]')!;
      listS.innerHTML = all.length ? all.map((r) => card(r, true)).join("") : `<div class="req-empty"><p class="muted">${esc(t("No requests yet.", "Заявок пока нет."))}</p></div>`;
      root.querySelector('[data-count="studio"]')!.textContent = String(all.filter((r) => ACTIVE.includes(r.status)).length);
      bindStudio(listS);
    }
  }

  render().then(() => {
    const h = location.hash.replace("#", "");
    if (h === "closed" || h === "active") showList(h);
  });
}
