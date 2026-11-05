/* HYDRA — client behaviour. Progressive enhancement only: every page works without JS. */
import { initBuilder, initContactForms } from "./forms";
import { initTelegram } from "./telegram";
import { t as tr } from "./lang";

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
export const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------- header */
function initHeader() {
  const header = $(".site-header");
  if (!header) return;
  let lastY = window.scrollY;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    const menuOpen = document.documentElement.classList.contains("menu-open");
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (!menuOpen && goingDown && y > 240 && !header.contains(document.activeElement)) header.classList.add("is-hidden");
    else if (goingUp || y < 240) header.classList.remove("is-hidden");
    lastY = y;
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"));
  update();

  // Contrast-adaptive header: pick the theme of the section currently under it.
  const sections = $$("[data-theme]").filter((s) => !s.closest(".site-header") && !s.closest(".mobile-menu"));
  const pick = () => {
    const probeY = 36;
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= probeY && r.bottom > probeY) {
        header.dataset.headerTheme = s.getAttribute("data-theme") || "dark";
        return;
      }
    }
  };
  window.addEventListener("scroll", () => requestAnimationFrame(pick), { passive: true });
  window.addEventListener("resize", pick);
  pick();
}

/* ----------------------------------------------------------- mobile menu */
function initMenu() {
  const btn = $<HTMLButtonElement>(".menu-toggle");
  const menu = $("#mobile-menu");
  if (!btn || !menu) return;
  menu.hidden = false;
  menu.setAttribute("aria-hidden", "true");
  menu.inert = true;
  const label = $(".menu-toggle__text", btn);
  const setOpen = (open: boolean) => {
    btn.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menu.inert = !open;
    document.documentElement.classList.toggle("menu-open", open);
    if (label) label.textContent = open ? tr("Close", "Закрыть") : tr("Menu", "Меню");
    if (open) $<HTMLAnchorElement>("a", menu)?.focus({ preventScroll: true });
  };
  btn.addEventListener("click", () => setOpen(btn.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) { setOpen(false); btn.focus(); }
    if (e.key === "Tab" && menu.classList.contains("is-open")) {
      // focus trap: menu links + toggle button
      const items = [btn, ...$$<HTMLElement>("a", menu)];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  window.matchMedia("(min-width: 1081px)").addEventListener("change", (m) => { if (m.matches) setOpen(false); });
}

/* ---------------------------------------------------------------- reveal */
function initReveal() {
  const targets = $$("[data-reveal], [data-split], [data-reveal-group], [data-core]");
  if (reduceMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-in"));
    return;
  }
  // Chrome applies a target's own clip-path to the intersection rect, so clip-revealed
  // elements are observed through their parent and revealed when the parent enters.
  const owners = new Map<Element, Element[]>();
  targets.forEach((t) => {
    const watch = t.getAttribute("data-reveal") === "clip" && t.parentElement ? t.parentElement : t;
    owners.set(watch, [...(owners.get(watch) || []), t]);
  });
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (owners.get(e.target) || [e.target]).forEach((t) => t.classList.add("is-in"));
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  owners.forEach((_, w) => io.observe(w));
  // Safety net: anything already in view after load becomes visible even if IO is slow.
  window.addEventListener("load", () => setTimeout(() => targets.forEach((t) => { const r = t.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) t.classList.add("is-in"); }), 400));
}

/* ------------------------------------------------------------ hydra core */
function initCore() {
  const core = $("[data-core]");
  if (!core) return;
  const svg = $<SVGSVGElement>("svg", core)!;
  const necks = $$<SVGPathElement>("[data-neck]", core);
  const flows = $$<SVGPathElement>("[data-flow]", core);
  const groups = $$<SVGGElement>("[data-head-g]", core);
  const heads = $$<SVGAElement>(".head", core);
  const base = [
    { x: 96, y: 176 }, { x: 230, y: 66 }, { x: 372, y: 70 }, { x: 450, y: 206 },
  ];
  const C = { x: 300, y: 590 };
  const path = (hx: number, hy: number) => `M ${C.x} ${C.y} C ${C.x} ${C.y - 190}, ${hx} ${hy + 230}, ${hx} ${hy + 22}`;
  necks.forEach((n) => { const len = n.getTotalLength(); n.style.setProperty("--len", String(Math.ceil(len))); });
  flows.forEach((f) => f.style.setProperty("--len", "0"));

  // Highlight the matching service row / head pair.
  const rows = $$("[data-head-row]");
  const activate = (i: number | null) => {
    heads.forEach((h, k) => h.classList.toggle("is-active", k === i));
    necks.forEach((n, k) => n.classList.toggle("is-active", k === i));
  };
  heads.forEach((h, i) => { h.addEventListener("mouseenter", () => activate(i)); h.addEventListener("focus", () => activate(i)); h.addEventListener("mouseleave", () => activate(null)); h.addEventListener("blur", () => activate(null)); });
  rows.forEach((r, i) => { r.addEventListener("mouseenter", () => activate(i)); r.addEventListener("mouseleave", () => activate(null)); });

  if (reduceMotion() || !window.matchMedia("(pointer: fine)").matches) return;

  // Necks lean towards the pointer: a spring per head, recomputed only while moving.
  const off = base.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 }));
  let raf = 0;
  let active = false;
  const step = () => {
    let moving = false;
    off.forEach((o, i) => {
      o.vx = (o.vx + (o.tx - o.x) * 0.06) * 0.82;
      o.vy = (o.vy + (o.ty - o.y) * 0.06) * 0.82;
      o.x += o.vx; o.y += o.vy;
      if (Math.abs(o.vx) + Math.abs(o.vy) > 0.02 || Math.abs(o.tx - o.x) > 0.1) moving = true;
      const hx = base[i].x + o.x, hy = base[i].y + o.y;
      groups[i].setAttribute("transform", `translate(${o.x.toFixed(2)} ${o.y.toFixed(2)})`);
      const d = path(hx, hy);
      necks[i].setAttribute("d", d);
      flows[i].setAttribute("d", d);
    });
    raf = moving || active ? requestAnimationFrame(step) : 0;
  };
  const onMove = (e: PointerEvent) => {
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 600;
    const py = ((e.clientY - r.top) / r.height) * 640;
    base.forEach((b, i) => {
      const dx = px - b.x, dy = py - b.y;
      const dist = Math.hypot(dx, dy) || 1;
      const pull = Math.min(26, 2600 / dist);
      off[i].tx = (dx / dist) * pull;
      off[i].ty = (dy / dist) * pull;
    });
    if (!raf) raf = requestAnimationFrame(step);
  };
  const hero = core.closest("section") || document.body;
  hero.addEventListener("pointerenter", () => { active = true; if (!raf) raf = requestAnimationFrame(step); });
  hero.addEventListener("pointermove", onMove as EventListener, { passive: true });
  hero.addEventListener("pointerleave", () => { active = false; off.forEach((o) => { o.tx = 0; o.ty = 0; }); if (!raf) raf = requestAnimationFrame(step); });
}

/* ------------------------------------------------------- project filters */
function initFilters() {
  const bar = $("[data-filters]");
  const grid = $("[data-project-grid]");
  if (!bar || !grid) return;
  const tiles = $$<HTMLElement>(".ptile", grid);
  const status = $("[data-filter-status]");
  const buttons = $$<HTMLButtonElement>("[data-filter]", bar);
  const apply = (cat: string, animate = true) => {
    if (!buttons.some((b) => b.dataset.filter === cat)) cat = "all";
    const first = new Map(tiles.map((t) => [t, t.getBoundingClientRect()]));
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === cat)));
    let shown = 0;
    tiles.forEach((t) => {
      const ok = cat === "all" || (t.dataset.cats || "").split(" ").includes(cat);
      t.hidden = !ok;
      if (ok) { shown++; t.classList.add("is-in"); }
    });
    if (status) status.textContent = tr(`${shown} project${shown === 1 ? "" : "s"} shown`, `Показано проектов: ${shown}`);
    if (animate && !reduceMotion()) {
      // FLIP: animate tiles from their old position to the new one
      tiles.filter((t) => !t.hidden).forEach((t) => {
        const a = first.get(t)!;
        const b = t.getBoundingClientRect();
        if (a.width === 0) { t.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: "cubic-bezier(.2,.8,.2,1)" }); return; }
        const dx = a.left - b.left, dy = a.top - b.top;
        if (Math.abs(dx) + Math.abs(dy) > 1) t.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 600, easing: "cubic-bezier(.2,.8,.2,1)" });
      });
    }
  };
  buttons.forEach((b) => b.addEventListener("click", () => {
    const cat = b.dataset.filter || "all";
    history.replaceState(null, "", cat === "all" ? location.pathname : `#${cat}`);
    apply(cat);
  }));
  apply(location.hash.slice(1) || "all", false);
  window.addEventListener("hashchange", () => apply(location.hash.slice(1) || "all"));
}

/* --------------------------------------------------------- before / after */
function initBeforeAfter() {
  const root = $("[data-ba]");
  if (!root) return;
  const stage = $("[data-ba-stage]", root)!;
  const range = $<HTMLInputElement>("[data-ba-range]", root)!;
  const before = $<HTMLImageElement>("[data-ba-before]", root)!;
  const after = $<HTMLImageElement>("[data-ba-after]", root)!;
  const link = $<HTMLAnchorElement>("[data-ba-link]", root);
  const set = (v: number) => stage.style.setProperty("--pos", `${v}%`);
  range.addEventListener("input", () => set(Number(range.value)));
  set(Number(range.value));
  const tabs = $$<HTMLButtonElement>("[data-ba-pair]", root);
  const select = (btn: HTMLButtonElement, focus = false) => {
    tabs.forEach((t) => { const on = t === btn; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
    before.src = btn.dataset.before!; after.src = btn.dataset.after!;
    before.alt = `${btn.dataset.title} — ${stage?.dataset.labelBefore || "first version"}`; after.alt = `${btn.dataset.title} — ${stage?.dataset.labelAfter || "redesigned version"}`;
    if (link) link.href = btn.dataset.link!;
    if (focus) btn.focus();
    if (!reduceMotion()) {
      let v = 85; const target = 50;
      const tick = () => { v += (target - v) * 0.12; set(v); range.value = String(Math.round(v)); if (Math.abs(v - target) > 0.3) requestAnimationFrame(tick); else { set(target); range.value = String(target); } };
      requestAnimationFrame(tick);
    }
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); select(tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length], true); }
    });
  });
}

/* ---------------------------------------------------------- process page */
function initPinned() {
  const root = $("[data-pinned]");
  if (!root) return;
  const steps = $$<HTMLElement>("[data-step]", root);
  const num = $("[data-pinned-num]", root);
  const name = $("[data-pinned-name]", root);
  const bar = $("[data-pinned-bar]", root);
  const setCurrent = (i: number) => {
    steps.forEach((s, k) => s.classList.toggle("is-current", k === i));
    if (num) num.textContent = String(i + 1).padStart(2, "0");
    if (name) name.textContent = steps[i].dataset.title || "";
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setCurrent(Number((e.target as HTMLElement).dataset.step)); });
  }, { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach((s) => io.observe(s));
  setCurrent(0);
  const progress = () => {
    const r = root.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.5 - r.top) / r.height));
    bar?.style.setProperty("--progress", p.toFixed(3));
  };
  window.addEventListener("scroll", () => requestAnimationFrame(progress), { passive: true });
  progress();
}

/* ------------------------------------------------------- services sub-nav */
function initServiceNav() {
  const nav = $("[data-svc-nav]");
  if (!nav) return;
  const links = $$<HTMLAnchorElement>("a", nav);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  links.forEach((l) => { const t = document.querySelector(l.getAttribute("href")!); if (t) io.observe(t); });
}

/* ------------------------------------------------- accordion (one open) */
function initFaq() {
  $$<HTMLDetailsElement>(".faq details").forEach((d, _, all) => {
    d.addEventListener("toggle", () => { if (d.open) all.forEach((o) => { if (o !== d && o.parentElement === d.parentElement) o.open = false; }); });
  });
}

function boot() {
  initHeader();
  initMenu();
  initReveal();
  initCore();
  initFilters();
  initBeforeAfter();
  initPinned();
  initServiceNav();
  initFaq();
  initTelegram();
  initContactForms();
  initBuilder();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
