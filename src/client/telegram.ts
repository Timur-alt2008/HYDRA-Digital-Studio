/* Interactive Telegram demo: a scripted bot + a Mini App booking flow. Nothing leaves the browser. */

import { t } from "./lang";

type Answer = { text: string; keys?: [string, string][] };

const now = () => new Date().toTimeString().slice(0, 5);
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

const SERVICES = [
  { id: "call", name: t("Intro call", "Знакомство"), meta: t("30 min · free", "30 мин · бесплатно") },
  { id: "review", name: t("Website review", "Разбор сайта"), meta: t("60 min", "60 мин") },
  { id: "workshop", name: t("Product workshop", "Продуктовый воркшоп"), meta: t("90 min", "90 мин") },
];
const DAY_IDS = ["today", "tomorrow", "friday"] as const;
const DAY_LABEL: Record<string, string> = { today: t("Today", "Сегодня"), tomorrow: t("Tomorrow", "Завтра"), friday: t("Friday", "Пятница") };
const SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];

const K_BOOK: [string, string] = ["book", t("Book a session", "Записаться")];
const K_WHAT: [string, string] = ["services", t("What can you do?", "Что ты умеешь?")];
const K_APP: [string, string] = ["app", t("Open Mini App ↗", "Открыть Mini App ↗")];
const ANSWERS: Record<string, Answer> = {
  services: { text: t("I can show what a booking bot does:\n• book a session\n• answer common questions\n• hand you over to a person\n• open a Mini App for complex steps", "Я покажу, что умеет бот для записи:\n• записать на сессию\n• ответить на частые вопросы\n• передать разговор человеку\n• открыть Mini App для сложных шагов"), keys: [K_BOOK, K_APP] },
  book: { text: t("Which session?", "На какую сессию?"), keys: SERVICES.map((s) => [`svc:${s.id}`, s.name] as [string, string]) },
  hours: { text: t("Mon–Fri · 10:00–19:00\nReplies within one working day.", "Пн–Пт · 10:00–19:00\nОтвечаем в течение рабочего дня."), keys: [K_BOOK, K_WHAT] },
  human: { text: t("In a real bot this would notify a manager and pass the conversation on. In this demo nobody is on the other side 🙂", "В настоящем боте здесь бы уведомился менеджер и подхватил разговор. В демо на той стороне никого нет 🙂"), keys: [K_BOOK, K_WHAT] },
};

export function initTelegram() {
  const root = document.querySelector<HTMLElement>("[data-tg]");
  if (!root) return;
  const chat = root.querySelector<HTMLElement>("[data-tg-chat]")!;
  const keys = root.querySelector<HTMLElement>("[data-tg-keys]")!;
  const sub = root.querySelector<HTMLElement>("[data-tg-sub]")!;
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-tg-tab]"));
  const panelBot = root.querySelector<HTMLElement>("#tg-panel-bot")!;
  const panelApp = root.querySelector<HTMLElement>("#tg-panel-app")!;
  const mini = root.querySelector<HTMLElement>("[data-mini]")!;
  const main = root.querySelector<HTMLButtonElement>("[data-mini-main]")!;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = { service: "", day: "tomorrow", slot: "", done: false };
  let busy = false;

  const push = (text: string, who: "bot" | "me", typing = false) => {
    const el = document.createElement("div");
    el.className = `msg msg--${who}${typing ? " msg--typing" : ""}`;
    el.innerHTML = `${esc(text)}${typing ? "" : `<time>${now()}</time>`}`;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
    return el;
  };
  const setKeys = (list: [string, string][]) => {
    keys.innerHTML = list.map(([q, t], i) => `<button type="button" data-q="${esc(q)}"${list.length % 2 && i === list.length - 1 ? ' class="wide"' : ""}>${esc(t)}</button>`).join("");
  };
  const reply = (a: Answer) => {
    busy = true;
    sub.textContent = t("typing…", "печатает…");
    const tp = push(t("typing…", "печатает…"), "bot", true);
    setTimeout(() => {
      tp.remove();
      push(a.text, "bot");
      sub.textContent = t("bot", "бот");
      if (a.keys) setKeys(a.keys);
      busy = false;
    }, reduce ? 0 : 650);
  };

  const showTab = (id: "bot" | "app", focus = false) => {
    tabs.forEach((tb) => { const on = tb.dataset.tgTab === id; tb.setAttribute("aria-selected", String(on)); tb.tabIndex = on ? 0 : -1; if (on && focus) tb.focus(); });
    panelBot.hidden = id !== "bot";
    panelApp.hidden = id !== "app";
    panelApp.style.display = id === "app" ? "flex" : "none";
    sub.textContent = id === "app" ? "mini app" : t("bot", "бот");
    if (id === "app") renderMini();
  };
  tabs.forEach((tb, i) => {
    tb.addEventListener("click", () => showTab(tb.dataset.tgTab as "bot" | "app"));
    tb.addEventListener("keydown", (e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); showTab(tabs[(i + 1) % 2].dataset.tgTab as "bot" | "app", true); } });
  });

  keys.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-q]");
    if (!b || busy) return;
    const q = b.dataset.q!;
    push(b.textContent || "", "me");
    if (q === "app") { setTimeout(() => showTab("app"), reduce ? 0 : 300); return; }
    if (q.startsWith("svc:")) {
      const s = SERVICES.find((x) => x.id === q.slice(4))!;
      state.service = s.id;
      reply({ text: `${s.name} — ${s.meta}.\n${t("Pick a time:", "Выберите время:")}`, keys: SLOTS.slice(1, 5).map((x) => [`slot:${x}`, `${DAY_LABEL.tomorrow} ${x}`] as [string, string]) });
      return;
    }
    if (q.startsWith("slot:")) {
      state.slot = q.slice(5); state.day = "tomorrow";
      const s = SERVICES.find((x) => x.id === state.service)!;
      reply({ text: `✅ ${t("Booked (demo)", "Записано (демо)")}: ${s.name}\n${DAY_LABEL[state.day]}, ${state.slot}\n${t("I'll remind you an hour before.", "Напомню за час до начала.")}`, keys: [K_WHAT, K_APP] });
      return;
    }
    reply(ANSWERS[q] || ANSWERS.services);
  });

  function renderMini() {
    if (state.done) {
      const s = SERVICES.find((x) => x.id === state.service)!;
      mini.innerHTML = `<div class="mini__done"><div class="mini__check" aria-hidden="true">✓</div><b>${t("Booked", "Записано")}</b><span>${esc(s.name)} · ${esc(DAY_LABEL[state.day])} ${esc(state.slot)}</span><small>${t("Demo — nothing was sent. The bot posted a confirmation in the chat.", "Демо — ничего не отправлено. Бот прислал подтверждение в чат.")}</small></div>`;
      main.textContent = t("Book another session", "Записаться ещё раз");
      main.disabled = false;
      return;
    }
    mini.innerHTML = `
      <h4>${t("Book a session", "Запись на сессию")}</h4>
      <div class="mini__list" role="group" aria-label="${t("Service", "Услуга")}">${SERVICES.map((s) => `<button type="button" class="mini__opt" data-svc="${s.id}" aria-pressed="${state.service === s.id}"><span>${esc(s.name)}</span><span class="mini__meta">${esc(s.meta)}</span></button>`).join("")}</div>
      <div class="mini__list" role="group" aria-label="${t("Day", "День")}" style="grid-template-columns:repeat(3,1fr)">${DAY_IDS.map((d) => `<button type="button" class="mini__slot" data-day="${d}" aria-pressed="${state.day === d}">${DAY_LABEL[d]}</button>`).join("")}</div>
      <div class="mini__slots" role="group" aria-label="${t("Time", "Время")}">${SLOTS.map((x, i) => `<button type="button" class="mini__slot" data-slot="${x}" aria-pressed="${state.slot === x}" ${(state.day === "today" && i < 3) || (state.day === "friday" && i === 4) ? "disabled" : ""}>${x}</button>`).join("")}</div>`;
    const ready = state.service && state.slot;
    main.disabled = !ready;
    main.textContent = ready ? `${t("Book", "Записаться")} · ${DAY_LABEL[state.day]} ${state.slot}` : state.service ? t("Choose a time", "Выберите время") : t("Choose a service", "Выберите услугу");
  }
  mini.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>("button");
    if (!b || b.disabled) return;
    if (b.dataset.svc) state.service = b.dataset.svc;
    if (b.dataset.day) { state.day = b.dataset.day; state.slot = ""; }
    if (b.dataset.slot) state.slot = b.dataset.slot;
    renderMini();
    const again = mini.querySelector<HTMLButtonElement>(b.dataset.svc ? `[data-svc="${b.dataset.svc}"]` : b.dataset.day ? `[data-day="${b.dataset.day}"]` : `[data-slot="${b.dataset.slot}"]`);
    again?.focus();
  });
  main.addEventListener("click", () => {
    if (state.done) { state.done = false; state.slot = ""; renderMini(); return; }
    if (!state.service || !state.slot) return;
    state.done = true;
    const s = SERVICES.find((x) => x.id === state.service)!;
    push(`✅ ${t("Booked via Mini App (demo)", "Запись через Mini App (демо)")}: ${s.name}\n${DAY_LABEL[state.day]}, ${state.slot}`, "bot");
    renderMini();
  });
}
