// Smoke test for every non-English locale: interactive parts speak the page language,
// the language switch keeps the current page, and no English UI text is left on the page.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { startServer } from "../scripts/serve.mjs";

const src = JSON.parse(readFileSync("src/i18n-dict/_source.json", "utf8"));
const dicts = Object.fromEntries(["uk", "de", "pl"].map((l) => [l, JSON.parse(readFileSync(`src/i18n-dict/${l}.json`, "utf8"))]));
const tr = (l, en, sec) => {
  const pick = (d) => (sec ? d[sec][en] : d.site[en] ?? d.client[en]);
  return l === "ru" ? pick(src) : pick(dicts[l]);
};
// English UI strings that are expected to differ in translation (used to spot leftovers)
const englishUi = (l) => new Set([...Object.keys(src.site), ...Object.keys(src.client)].filter((k) => k.trim().length > 3 && /[a-z]{3}/i.test(k) && tr(l, k) && tr(l, k).trim() !== k.trim()));

const s = await startServer(4332);
const B = "http://127.0.0.1:4332/HYDRA-Digital-Studio/";
const b = await chromium.launch();
const ok = []; const bad = [];
const check = (name, cond, info = "") => (cond ? ok : bad).push(name + (cond ? "" : " → " + info));
const pages = ["", "about/", "services/", "projects/", "process/", "contact/", "start/", "projects/barber-atelier/", "projects/design-intelligence/"];

for (const l of ["ru", "uk", "de", "pl"]) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.route(/fonts\./, (r) => r.abort());
  const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  const L = `${B}${l}/`;

  await p.goto(L);
  check(`${l}: html lang`, (await p.getAttribute("html", "lang")) === l);
  await p.click('[data-q="book"]'); await p.waitForTimeout(900);
  const chat = await p.textContent("[data-tg-chat]");
  check(`${l}: telegram bot replies in page language`, chat.includes(tr(l, "Which session?")), chat.slice(-80));
  await p.click('[data-tg-tab="app"]');
  check(`${l}: mini app in page language`, (await p.textContent("[data-mini]")).includes(tr(l, "Book a session", "client")));
  await p.click("[data-contact-form] button[type=submit]");
  check(`${l}: contact errors`, (await p.textContent("[data-contact-form]")).includes(tr(l, "Please enter your name.")));
  await p.fill("#cf-name", "Test"); await p.fill("#cf-contact", "@test_user"); await p.fill("#cf-message", "A website for a small studio with online booking, please.");
  await p.check("[data-contact-form] input[name=consent]");
  await p.click("[data-contact-form] button[type=submit]");
  const conf = await p.textContent("[data-contact-form] [data-confirm]");
  check(`${l}: brief in page language`, conf.includes(tr(l, "Brief ready")) && conf.includes(tr(l, "Message")), conf.slice(0, 120));

  await p.goto(L + "start/");
  check(`${l}: builder counter`, (await p.textContent("[data-builder-count]")).includes(tr(l, "Step 1 of 6")));
  await p.click("[data-next]");
  check(`${l}: builder validation`, (await p.textContent('[data-error="type"]')).includes(tr(l, "Choose one option.")));
  await p.click('.tile:has(input[value="bot"])'); await p.click("[data-next]");
  await p.click('.choice:has(input[name="task"]) >> nth=0'); await p.click("[data-next]");
  check(`${l}: builder features`, (await p.textContent("[data-features]")).includes(tr(l, "Order taking")));
  await p.click("[data-next]");
  const counter = await p.textContent("[data-builder-count]");
  check(`${l}: builder counter template`, counter.trim() === tr(l, "Step {n} of {total}").replace("{n}", "3").replace("{total}", "6") || !/\{/.test(counter), counter);

  await p.goto(L + "projects/");
  await p.click('[data-filter="bots"]'); await p.waitForTimeout(400);
  const st = await p.textContent("[data-filter-status]");
  check(`${l}: filter status`, st.startsWith(tr(l, "Projects shown: {n}").split("{n}")[0]), st);

  await p.goto(L + "services/");
  await p.click(".site-header .lang summary");
  await p.click('.site-header [data-lang-link="en"]');
  await p.waitForLoadState("load");
  check(`${l}: switch → EN keeps page`, p.url().endsWith("/HYDRA-Digital-Studio/services/"), p.url());

  const eng = englishUi(l);
  for (const path of pages) {
    await p.goto(L + path);
    // tags (.chip) and technology names stay English on purpose
    const texts = await p.evaluate(() => {
      const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) { const t = w.currentNode.textContent.trim(); if (t && !w.currentNode.parentElement.closest("script,style,svg title,.chip,.tech-groups,.marquee")) out.push(t); }
      return [...new Set(out)];
    });
    const left = texts.filter((t) => eng.has(t));
    if (left.length) bad.push(`${l}: English left on /${l}/${path}: ${left.slice(0, 6).join(" | ")}`);
  }
  check(`${l}: no page errors`, errs.length === 0, errs.join("; "));
  await p.close();
}
console.log(ok.map((x) => "✓ " + x).join("\n")); console.log(bad.map((x) => "✗ " + x).join("\n"));
console.log(`${ok.length} passed, ${bad.length} failed`);
await b.close(); s.close();
process.exit(bad.length ? 1 : 0);
