// Smoke test of the Russian locale: interactive pieces speak Russian, language switch keeps the page.
import { chromium } from "playwright";
import { startServer } from "../scripts/serve.mjs";
const s = await startServer(4332);
const B = "http://127.0.0.1:4332/HYDRA-Digital-Studio/";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.route(/fonts\./, (r) => r.abort());
const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
const ok = []; const bad = [];
const check = (name, cond, info = "") => (cond ? ok : bad).push(name + (cond ? "" : " → " + info));

await p.goto(B + "ru/");
check("html lang ru", (await p.getAttribute("html", "lang")) === "ru");
await p.click('[data-q="book"]'); await p.waitForTimeout(900);
const chat = await p.textContent("[data-tg-chat]");
check("telegram bot replies in Russian", /На какую сессию/.test(chat), chat.slice(-80));
await p.click('[data-tg-tab="app"]');
check("mini app in Russian", /Запись на сессию/.test(await p.textContent("[data-mini]")));
await p.click("[data-contact-form] button[type=submit]");
check("contact errors in Russian", /Введите имя/.test(await p.textContent("[data-contact-form]")));
await p.fill("#cf-name", "Тест"); await p.fill("#cf-contact", "@test_user"); await p.fill("#cf-message", "Нужен сайт для небольшой студии, с записью онлайн.");
await p.check("[data-contact-form] input[name=consent]");
await p.click("[data-contact-form] button[type=submit]");
const conf = await p.textContent("[data-contact-form] [data-confirm]");
check("contact brief in Russian", /Бриф готов/.test(conf) && /Сообщение/.test(conf), conf.slice(0, 120));

await p.goto(B + "ru/start/");
check("builder counter RU", /Шаг 1 из 6/.test(await p.textContent("[data-builder-count]")));
await p.click("[data-next]");
check("builder validation RU", /Выберите вариант/.test(await p.textContent('[data-error="type"]')));
await p.click('.tile:has(input[value="bot"])'); await p.click("[data-next]");
await p.click('.choice:has(input[name="task"]) >> nth=0'); await p.click("[data-next]");
check("builder features RU", /Приём заказов/.test(await p.textContent("[data-features]")));

await p.goto(B + "ru/projects/");
await p.click('[data-filter="bots"]'); await p.waitForTimeout(400);
check("filter status RU", /Показано проектов/.test(await p.textContent("[data-filter-status]")));

await p.goto(B + "ru/services/");
await p.click('[data-lang-link="en"] >> visible=true');
await p.waitForLoadState("load");
check("switch RU→EN keeps page", p.url().endsWith("/HYDRA-Digital-Studio/services/"), p.url());

// visible-text scan for untranslated English on RU pages
const pages = ["", "about/", "services/", "projects/", "process/", "contact/", "start/", "projects/barber-atelier/", "projects/design-intelligence/"];
const allow = /^(HYDRA|Mini Apps?|Telegram|Web|Project Builder|GitHub|Design Intelligence|FAQ|UI\/UX|v1|v2|EN|RU|Email|Bot API.*|Mini Apps SDK.*|We build digital experiences|Think beyond\. Build without limits\.|Scroll ↓|Cut off\.|Grow back\.|Barber Atelier|Barber|Telegram Mini Apps|github\.com\/Timur-alt2008 ↗)$/i;
// technology names in service stacks are product names, not copy
const techLine = /^[A-Za-z0-9 .\/+#·-]+$/;
for (const path of pages) {
  await p.goto(B + "ru/" + path);
  const texts = await p.evaluate(() => {
    const out = []; const w = document.createTreeWalker(document.querySelector("main") || document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { const t = w.currentNode.textContent.trim(); const el = w.currentNode.parentElement; if (t && /[a-z]{4,}/i.test(t) && !/[а-яё]/i.test(t) && !el.closest("code,pre,svg,.chip,.frame__url,.tech-groups,.marquee,.ptile__title,.p-hero__title,.next-project,.spec,.label") ) out.push(t); }
    return [...new Set(out)];
  });
  const left = texts.filter((t) => !allow.test(t) && !(path === "services/" && techLine.test(t)));
  if (left.length) bad.push(`english on /ru/${path}: ${left.slice(0, 8).join(" | ")}`);
}
check("no page errors", errs.length === 0, errs.join("; "));
console.log(ok.map((x) => "✓ " + x).join("\n")); console.log(bad.map((x) => "✗ " + x).join("\n"));
console.log(`${ok.length} passed, ${bad.length} failed`);
await b.close(); s.close();
process.exit(bad.length ? 1 : 0);
