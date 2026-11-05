/* Contact form + Project Builder: validation, brief generation and delivery.
   Delivery depends on configuration (see src/config.ts):
   endpoint → POST JSON · email → mail app · telegram → copy + open chat · demo → copy / download only. */

import { t } from "./lang";

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
const toText = (id: string, brief: Brief) => [`${t("HYDRA project brief", "Бриф проекта HYDRA")} ${id}`, "", ...Object.entries(brief).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join("\n");

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
      return { ok: true, note: t("Your brief has been sent. We'll reply within one working day.", "Бриф отправлен. Ответим в течение рабочего дня.") };
    } catch {
      return { ok: false, note: t("We couldn't send the brief right now. Please copy or download it and try again later.", "Сейчас не удалось отправить бриф. Скопируйте или скачайте его и попробуйте позже.") };
    } finally { clearTimeout(timer); }
  }
  if (mode === "email") {
    const url = `mailto:${form.dataset.email}?subject=${encodeURIComponent(`${t("Project brief", "Бриф проекта")} ${id}`)}&body=${encodeURIComponent(text.slice(0, 1800))}`;
    window.location.href = url;
    return { ok: true, note: t("Your mail app should open with the brief filled in — press send there. If nothing opened, copy the brief below.", "Должна открыться почта с заполненным брифом — нажмите «Отправить» там. Если ничего не открылось, скопируйте бриф ниже.") };
  }
  if (mode === "telegram") {
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard may be blocked */ }
    window.open(`https://t.me/${form.dataset.telegram}`, "_blank", "noopener");
    return { ok: true, note: t("The brief is copied. Paste it into the Telegram chat that just opened.", "Бриф скопирован. Вставьте его в открывшийся чат Telegram.") };
  }
  return { ok: true, note: t("Demo mode: nothing was sent. Your brief is ready below — copy or download it.", "Демо-режим: ничего не отправлено. Бриф готов ниже — скопируйте или скачайте его.") };
}

function showConfirm(box: HTMLElement, id: string, brief: Brief, note: string, ok: boolean) {
  const text = toText(id, brief);
  box.hidden = false;
  box.innerHTML = `
    <span class="label label--accent">${ok ? t("Brief ready", "Бриф готов") : t("Not sent", "Не отправлено")}</span>
    <p class="confirm__id">${esc(id)}</p>
    <p>${esc(note)}</p>
    <div class="summary"><dl>${Object.entries(brief).filter(([, v]) => v).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl></div>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <button type="button" class="btn btn--small" data-copy><span>${t("Copy brief", "Скопировать бриф")}</span></button>
      <button type="button" class="btn btn--ghost btn--small" data-download><span>${t("Download .txt", "Скачать .txt")}</span></button>
    </div>
    <span class="label" data-copy-status aria-live="polite"></span>`;
  box.querySelector("[data-copy]")!.addEventListener("click", async () => {
    const status = box.querySelector("[data-copy-status]")!;
    try { await navigator.clipboard.writeText(text); status.textContent = t("Copied to clipboard.", "Скопировано в буфер обмена."); }
    catch { status.textContent = t("Copy is blocked by the browser — use Download instead.", "Браузер запретил копирование — воспользуйтесь скачиванием."); }
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
        [name, name.value.trim().length < 2 ? t("Please enter your name.", "Введите имя.") : ""],
        [contact, !contact.value.trim() ? t("How should we reply?", "Куда вам ответить?") : !validContact(contact.value) ? t("Enter an email or a Telegram @username.", "Укажите email или Telegram @username.") : ""],
        [message, message.value.trim().length < 20 ? t("A couple of sentences, please (20+ characters).", "Пару предложений, пожалуйста (от 20 символов).") : ""],
      ];
      checks.forEach(([el, msg]) => { setError(el, msg); if (msg) ok = false; });
      const cErr = form.querySelector("[data-consent-error]");
      if (cErr) cErr.textContent = consent.checked ? "" : t("Please confirm so we can reply.", "Подтвердите согласие, чтобы мы могли ответить.");
      if (!consent.checked) ok = false;
      return ok;
    };
    form.addEventListener("input", (e) => {
      const tg = e.target as HTMLElement;
      if (tg.closest(".field.is-invalid")) validate();
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) { (form.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus(); return; }
      const data = new FormData(form);
      const brief: Brief = {
        [K.name]: String(data.get("name")).trim(),
        [K.contact]: String(data.get("contact")).trim(),
        [K.need]: String(data.get("type") || ""),
        [K.message]: String(data.get("message")).trim(),
        [K.source]: t("Contact form", "Форма обратной связи"),
      };
      const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
      btn.disabled = true;
      const id = briefId();
      const res = await deliver(form, id, brief);
      showConfirm(form.querySelector<HTMLElement>("[data-confirm]")!, id, brief, res.note, res.ok);
      btn.disabled = false;
      if (res.ok) btn.querySelector("span")!.textContent = t("Send another", "Отправить ещё");
    });
  });
}

/* --------------------------------------------------------- project builder */
const FEATURES: Record<string, string[]> = {
  web: [t("Responsive design", "Адаптивный дизайн"), t("Multi-page structure", "Многостраничная структура"), t("Online store or catalogue", "Интернет-магазин или каталог"), t("Booking or order form", "Форма записи или заказа"), t("Blog or news", "Блог или новости"), t("CMS to edit content", "CMS для редактирования контента"), t("Several languages", "Несколько языков"), t("Animations and interactions", "Анимации и интерактив"), t("Analytics setup", "Подключение аналитики"), t("Integrations (CRM, payments)", "Интеграции (CRM, оплата)")],
  redesign: [t("New visual design", "Новый визуальный дизайн"), t("New structure and navigation", "Новая структура и навигация"), t("Content migration", "Перенос контента"), t("Speed optimisation", "Ускорение сайта"), t("Accessibility fixes", "Исправление доступности"), t("Keep existing URLs and SEO", "Сохранить текущие адреса и позиции"), t("CMS to edit content", "CMS для редактирования контента"), t("New features", "Новые функции")],
  bot: [t("Order taking", "Приём заказов"), t("Booking", "Запись"), t("Answers to common questions", "Ответы на частые вопросы"), t("Notifications", "Уведомления"), t("Payments in Telegram", "Оплата в Telegram"), t("Admin panel", "Админ-панель"), t("Broadcasts", "Рассылки"), t("CRM or Google Sheets integration", "Интеграция с CRM или Google Таблицами"), t("Several languages", "Несколько языков")],
  miniapp: [t("Catalogue", "Каталог"), t("Booking", "Запись"), t("Cart and checkout", "Корзина и оформление заказа"), t("User profiles", "Профили пользователей"), t("Telegram login", "Вход через Telegram"), t("Payments", "Оплата"), t("Admin panel", "Админ-панель"), t("Notifications through the bot", "Уведомления через бота")],
  products: [t("Dashboard", "Дашборд"), t("User accounts", "Личные кабинеты"), t("Roles and permissions", "Роли и права доступа"), t("Data import / export", "Импорт и экспорт данных"), t("Integrations and API", "Интеграции и API"), t("Reports", "Отчёты"), t("Admin panel", "Админ-панель"), t("Real-time updates", "Обновления в реальном времени")],
  unsure: [t("Website", "Сайт"), t("Telegram bot", "Telegram-бот"), "Mini App", t("Online payments", "Онлайн-оплата"), t("Admin panel", "Админ-панель"), t("Integrations", "Интеграции"), t("Help me decide", "Помогите решить")],
};
const TYPE_LABEL: Record<string, string> = { web: t("Website", "Сайт"), redesign: t("Redesign", "Редизайн"), bot: t("Telegram bot", "Telegram-бот"), miniapp: "Telegram Mini App", products: t("Custom digital product", "Цифровой продукт"), unsure: t("Not sure yet", "Пока не знаю") };
/** Brief field labels (the brief is written in the page language). */
const K = {
  product: t("Product", "Продукт"), task: t("Main task", "Главная задача"), context: t("Context", "Контекст"), url: t("Current site / reference", "Текущий сайт / пример"),
  features: t("Features", "Функции"), budget: t("Budget", "Бюджет"), timeline: t("Timeline", "Сроки"), name: t("Name", "Имя"), contact: t("Contact", "Контакт"),
  company: t("Company", "Компания"), need: t("Need", "Задача"), message: t("Message", "Сообщение"), source: t("Source", "Источник"),
};
const DRAFT_KEY = `hydra-builder-draft-${document.documentElement.lang || "en"}`;

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
    [K.product]: TYPE_LABEL[val("type")] || "",
    [K.task]: val("task"),
    [K.context]: val("context"),
    [K.url]: val("url"),
    [K.features]: checkedFeatures().join(", "),
    [K.budget]: val("budget"),
    [K.timeline]: val("timeline"),
    [K.name]: val("name"),
    [K.contact]: val("contact"),
    [K.company]: val("company"),
  });

  const validateStep = (i: number): boolean => {
    const need = (name: string, msg: string) => { const ok = !!val(name); err(name, ok ? "" : msg); return ok; };
    switch (i) {
      case 0: return need("type", t("Choose one option.", "Выберите вариант."));
      case 1: {
        let ok = need("task", t("Choose the main task.", "Выберите главную задачу."));
        const url = val("url");
        if (url && !/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(url)) { err("url", t("Enter a full address starting with https://", "Укажите полный адрес, начиная с https://")); ok = false; } else err("url", "");
        return ok;
      }
      case 2: { const ok = checkedFeatures().length > 0; err("features", ok ? "" : t("Pick at least one feature (or “Help me decide”).", "Выберите хотя бы одну функцию (или «Помогите решить»).")); return ok; }
      case 3: return need("budget", t("Choose a range — “Not sure yet” is fine.", "Выберите диапазон — «Пока не знаю» тоже подойдёт."));
      case 4: return need("timeline", t("Choose a timeline.", "Выберите сроки."));
      case 5: {
        let ok = true;
        const name = val("name"), contact = val("contact");
        err("name", name.length >= 2 ? "" : t("Please enter your name.", "Введите имя.")); if (name.length < 2) ok = false;
        const cOk = validContact(contact); err("contact", cOk ? "" : t("Enter an email or a Telegram @username.", "Укажите email или Telegram @username.")); if (!cOk) ok = false;
        const consent = (form.elements.namedItem("consent") as HTMLInputElement).checked;
        const ce = form.querySelector('[data-error="consent"]'); if (ce) ce.textContent = consent ? "" : t("Please confirm so we can reply.", "Подтвердите согласие, чтобы мы могли ответить.");
        return ok && consent;
      }
    }
    return true;
  };

  const renderSummary = () => {
    const b = collect();
    summary.innerHTML = `<dl>${Object.entries(b).filter(([k, v]) => v && ![K.name, K.contact, K.company].includes(k)).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`;
  };

  const save = () => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...collect(), _features: checkedFeatures(), _step: current, _raw: { type: val("type"), task: val("task"), budget: val("budget"), timeline: val("timeline"), context: val("context"), url: val("url"), name: val("name"), contact: val("contact"), company: val("company") } })); } catch { /* storage unavailable */ } };
  const restore = () => {
    let d: any = null;
    try { d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch { d = null; }
    const params = new URLSearchParams(location.search);
    const typeParam = ({ web: "web", redesign: "redesign", telegram: "bot", products: "products" } as Record<string, string>)[params.get("type") || ""];
    const setRadio = (name: string, v?: string) => { if (!v) return; const el = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${CSS.escape(v)}"]`); if (el) el.checked = true; };
    if (d && d._raw) {
      setRadio("type", d._raw.type); setRadio("task", d._raw.task); setRadio("budget", d._raw.budget); setRadio("timeline", d._raw.timeline);
      (["context", "url", "name", "contact", "company"] as const).forEach((n) => { const el = form.elements.namedItem(n) as HTMLInputElement; if (el && d._raw[n]) el.value = d._raw[n]; });
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
    nextLabel.textContent = current === steps.length - 1 ? t("Send brief", "Отправить бриф") : t("Next", "Далее");
    count.textContent = t(`Step ${current + 1} of ${steps.length}`, `Шаг ${current + 1} из ${steps.length}`);
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
    const tg = e.target as HTMLInputElement;
    if (tg.name === "type") renderFeatures();
    save();
  });
  form.addEventListener("input", save);
  prev.addEventListener("click", () => go(current - 1));
  form.addEventListener("submit", (e) => { e.preventDefault(); next.click(); });
  next.addEventListener("click", async () => {
    if (!validateStep(current)) { (steps[current].querySelector('[aria-invalid="true"], input:not([type=hidden])') as HTMLElement | null)?.focus(); return; }
    if (current < steps.length - 1) { go(current + 1); return; }
    next.disabled = true;
    const brief = { ...collect(), [K.source]: "Project Builder" };
    const id = briefId();
    const res = await deliver(form, id, brief);
    steps.forEach((s) => (s.hidden = true));
    form.querySelector<HTMLElement>("[data-builder-nav]")!.hidden = true;
    labels.forEach((l) => { l.classList.remove("is-current"); l.classList.add("is-done"); });
    count.textContent = t("Done", "Готово");
    progress.style.setProperty("--p", "1");
    showConfirm(confirm, id, brief, res.note, res.ok);
    if (res.ok) { try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ } }
  });

  restore();
  go(0, false);
}
