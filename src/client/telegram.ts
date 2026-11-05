/* Interactive Telegram demo: a scripted bot + a Mini App booking flow. Nothing leaves the browser. */

type Answer = { text: string; keys?: [string, string][] };

const now = () => new Date().toTimeString().slice(0, 5);
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

const SERVICES = [
  { id: "call", name: "Intro call", meta: "30 min · free" },
  { id: "review", name: "Website review", meta: "60 min" },
  { id: "workshop", name: "Product workshop", meta: "90 min" },
];
const DAYS = ["Today", "Tomorrow", "Friday"];
const SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];

const ANSWERS: Record<string, Answer> = {
  services: { text: "I can show what a booking bot does:\n• book a session\n• answer common questions\n• hand you over to a person\n• open a Mini App for complex steps", keys: [["book", "Book a session"], ["app", "Open Mini App ↗"]] },
  book: { text: "Which session?", keys: SERVICES.map((s) => [`svc:${s.id}`, s.name] as [string, string]) },
  hours: { text: "Mon–Fri · 10:00–19:00\nReplies within one working day.", keys: [["book", "Book a session"], ["services", "What can you do?"]] },
  human: { text: "In a real bot this would notify a manager and pass the conversation on. In this demo nobody is on the other side 🙂", keys: [["book", "Book a session"], ["services", "What can you do?"]] },
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

  const state = { service: "", day: DAYS[1], slot: "", done: false };
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
    sub.textContent = "typing…";
    const t = push("typing…", "bot", true);
    setTimeout(() => {
      t.remove();
      push(a.text, "bot");
      sub.textContent = "bot";
      if (a.keys) setKeys(a.keys);
      busy = false;
    }, reduce ? 0 : 650);
  };

  const showTab = (id: "bot" | "app", focus = false) => {
    tabs.forEach((t) => { const on = t.dataset.tgTab === id; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
    panelBot.hidden = id !== "bot";
    panelApp.hidden = id !== "app";
    panelApp.style.display = id === "app" ? "flex" : "none";
    sub.textContent = id === "app" ? "mini app" : "bot";
    if (id === "app") renderMini();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => showTab(t.dataset.tgTab as "bot" | "app"));
    t.addEventListener("keydown", (e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); showTab(tabs[(i + 1) % 2].dataset.tgTab as "bot" | "app", true); } });
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
      reply({ text: `${s.name} — ${s.meta}.\nPick a time:`, keys: SLOTS.slice(1, 5).map((t) => [`slot:${t}`, `Tomorrow ${t}`] as [string, string]) });
      return;
    }
    if (q.startsWith("slot:")) {
      state.slot = q.slice(5); state.day = "Tomorrow";
      const s = SERVICES.find((x) => x.id === state.service)!;
      reply({ text: `✅ Booked (demo): ${s.name}\n${state.day}, ${state.slot}\nI'll remind you an hour before.`, keys: [["services", "What can you do?"], ["app", "Open Mini App ↗"]] });
      return;
    }
    reply(ANSWERS[q] || ANSWERS.services);
  });

  function renderMini() {
    if (state.done) {
      const s = SERVICES.find((x) => x.id === state.service)!;
      mini.innerHTML = `<div class="mini__done"><div class="mini__check" aria-hidden="true">✓</div><b>Booked</b><span>${esc(s.name)} · ${esc(state.day)} ${esc(state.slot)}</span><small>Demo — nothing was sent. The bot posted a confirmation in the chat.</small></div>`;
      main.textContent = "Book another session";
      main.disabled = false;
      return;
    }
    mini.innerHTML = `
      <h4>Book a session</h4>
      <div class="mini__list" role="group" aria-label="Service">${SERVICES.map((s) => `<button type="button" class="mini__opt" data-svc="${s.id}" aria-pressed="${state.service === s.id}"><span>${esc(s.name)}</span><span style="color:#6b7280">${esc(s.meta)}</span></button>`).join("")}</div>
      <div class="mini__list" role="group" aria-label="Day" style="grid-template-columns:repeat(3,1fr)">${DAYS.map((d) => `<button type="button" class="mini__slot" data-day="${d}" aria-pressed="${state.day === d}">${d}</button>`).join("")}</div>
      <div class="mini__slots" role="group" aria-label="Time">${SLOTS.map((t, i) => `<button type="button" class="mini__slot" data-slot="${t}" aria-pressed="${state.slot === t}" ${(state.day === "Today" && i < 3) || (state.day === "Friday" && i === 4) ? "disabled" : ""}>${t}</button>`).join("")}</div>`;
    const ready = state.service && state.slot;
    main.disabled = !ready;
    main.textContent = ready ? `Book · ${state.day} ${state.slot}` : state.service ? "Choose a time" : "Choose a service";
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
    push(`✅ Booked via Mini App (demo): ${s.name}\n${state.day}, ${state.slot}`, "bot");
    renderMini();
  });
}
