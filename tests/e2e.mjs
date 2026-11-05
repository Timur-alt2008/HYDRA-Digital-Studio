/**
 * End-to-end QA for the built site (/docs) with Playwright + Chromium.
 *  - every page × 9 viewports: no JS errors, no horizontal overflow, images load, one <h1>
 *  - every internal link and asset resolves
 *  - menu, filters, before/after, Telegram demo, FAQ, contact form, Project Builder, 404
 *  - reduced-motion mode renders content without animations
 * Usage: npm run build && npm test     (OFFLINE=1 blocks Google Fonts for sandboxed runs)
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { startServer } from "../scripts/serve.mjs";

const PORT = 4400;
const BASE = process.env.BASE_PATH || "/HYDRA-Digital-Studio/";
const ORIGIN = `http://127.0.0.1:${PORT}`;
const VIEWPORTS = [[1920, 1080], [1440, 900], [1280, 800], [1024, 768], [768, 1024], [430, 932], [390, 844], [375, 812], [360, 800]];
const sitemap = readFileSync("docs/sitemap.xml", "utf8");
const PAGES = [...sitemap.matchAll(/<loc>[^<]*?\/HYDRA-Digital-Studio\/([^<]*)<\/loc>/g)].map((m) => m[1]);

const results = [];
let failures = 0;
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  if (!ok) { failures++; console.log(`  ✗ ${name} ${detail}`); }
};

const server = await startServer(PORT);
const browser = await chromium.launch();
const newPage = async (vp = [1440, 900], opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: vp[0], height: vp[1] }, ...opts });
  const page = await ctx.newPage();
  page.__errors = [];
  page.on("pageerror", (e) => page.__errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g|ERR_FAILED|net::/.test(m.text())) page.__errors.push(m.text()); });
  if (process.env.OFFLINE) await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  return page;
};
const go = (page, path) => page.goto(ORIGIN + BASE + path, { waitUntil: "load" });
const scrollAll = async (page) => {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    scrollTo(0, 0);
  });
};

console.log(`Testing ${PAGES.length} pages × ${VIEWPORTS.length} viewports`);

// 1. every page at every viewport
for (const vp of VIEWPORTS) {
  const page = await newPage(vp);
  for (const path of PAGES) {
    const res = await go(page, path);
    check(`${vp.join("×")} /${path} status`, res.status() === 200, String(res.status()));
    await scrollAll(page);
    await page.waitForTimeout(250);
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      h1: document.querySelectorAll("h1").length,
      brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content || "",
    }));
    check(`${vp.join("×")} /${path} no horizontal overflow`, info.overflow <= 1, `overflow ${info.overflow}px`);
    check(`${vp.join("×")} /${path} exactly one h1`, info.h1 === 1, `h1=${info.h1}`);
    check(`${vp.join("×")} /${path} images load`, info.brokenImgs.length === 0, info.brokenImgs.join(", "));
    if (vp[0] === 1440) check(`/${path} title + description`, info.title.length > 5 && info.desc.length > 40, info.title);
    check(`${vp.join("×")} /${path} no JS errors`, page.__errors.length === 0, page.__errors.join(" | "));
    page.__errors.length = 0;
  }
  await page.context().close();
}

// 2. links and assets
{
  const page = await newPage();
  const urls = new Set();
  for (const path of PAGES) {
    await go(page, path);
    (await page.evaluate(() => [...document.querySelectorAll("a[href], img[src], link[href], script[src]")].map((e) => new URL(e.getAttribute("href") || e.getAttribute("src"), location.href).href))).forEach((u) => urls.add(u.split("#")[0]));
  }
  const internal = [...urls].filter((u) => u.startsWith(ORIGIN));
  for (const u of internal) {
    const r = await page.request.get(u);
    check(`link ${u.replace(ORIGIN, "")}`, r.status() === 200, String(r.status()));
  }
  const external = [...urls].filter((u) => u.startsWith("http") && !u.startsWith(ORIGIN) && !/fonts\.g/.test(u));
  console.log(`  · ${internal.length} internal URLs checked, ${external.length} external links found (not fetched offline)`);
  writeFileSync("tests/external-links.txt", external.sort().join("\n") + "\n");
  const nf = await page.request.get(ORIGIN + BASE + "does-not-exist/");
  check("404 page served for unknown URL", nf.status() === 404 && (await nf.text()).includes("Cut off."));
  await page.context().close();
}

// 3. mobile menu
{
  const page = await newPage([390, 844]);
  await go(page, "");
  const btn = page.locator(".menu-toggle");
  await btn.click();
  await page.waitForTimeout(700);
  check("menu opens", (await btn.getAttribute("aria-expanded")) === "true" && (await page.locator("#mobile-menu").evaluate((m) => m.classList.contains("is-open"))));
  check("menu link focused", await page.evaluate(() => document.activeElement?.closest("#mobile-menu") !== null));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  check("menu closes with Escape", (await btn.getAttribute("aria-expanded")) === "false");
  await btn.click(); await page.waitForTimeout(700);
  await page.locator("#mobile-menu a", { hasText: "Projects" }).click();
  await page.waitForURL(/projects\/$/);
  check("menu navigates", page.url().endsWith("/projects/"));
  await page.context().close();
}

// 4. desktop header nav + view transitions do not break navigation
{
  const page = await newPage();
  await go(page, "");
  for (const label of ["Services", "Projects", "Process", "About", "Contact"]) {
    await page.locator(".nav__links a", { hasText: label }).click();
    await page.waitForLoadState("load");
    check(`nav → ${label}`, (await page.locator(`.nav__links a[aria-current="page"]`).textContent()) === label);
  }
  check("header nav no errors", page.__errors.length === 0, page.__errors.join(" | "));
  await page.context().close();
}

// 5. project filters
{
  const page = await newPage();
  await go(page, "projects/");
  const visible = () => page.locator(".ptile:not([hidden])").count();
  const total = await visible();
  for (const [cat, label] of [["bots", "Telegram Bots"], ["mini-apps", "Telegram Mini Apps"], ["redesign", "Redesign"], ["products", "Digital Products"], ["websites", "Websites"]]) {
    await page.locator(`[data-filter="${cat}"]`).click();
    await page.waitForTimeout(150);
    const n = await visible();
    const expected = Number((await page.locator(`[data-filter="${cat}"] sup`).textContent()).trim());
    check(`filter ${label}`, n === expected && n > 0, `${n} vs ${expected}`);
    check(`filter ${label} updates URL`, page.url().endsWith(`#${cat}`));
  }
  await page.locator('[data-filter="all"]').click();
  check("filter All restores", (await visible()) === total);
  await go(page, "projects/#bots");
  check("filter from URL hash", (await visible()) === 2);
  await page.locator(".ptile:not([hidden])").first().click();
  await page.waitForLoadState("load");
  check("tile opens project page", /projects\/[a-z-]+\/$/.test(page.url()));
  await page.context().close();
}

// 6. before / after + telegram + FAQ on the home page
{
  const page = await newPage();
  await go(page, "");
  const stage = page.locator("[data-ba-stage]");
  await stage.scrollIntoViewIfNeeded();
  const range = page.locator("[data-ba-range]");
  await range.focus();
  for (let i = 0; i < 10; i++) await page.keyboard.press("ArrowRight");
  const pos = await stage.evaluate((s) => s.style.getPropertyValue("--pos"));
  check("before/after keyboard control", parseFloat(pos) > 50, pos);
  const box = await stage.boundingBox();
  await page.mouse.click(box.x + box.width * 0.2, box.y + box.height / 2);
  const pos2 = await stage.evaluate((s) => parseFloat(s.style.getPropertyValue("--pos")));
  check("before/after pointer control", pos2 < 35, String(pos2));
  await page.locator('[data-ba-pair="1"]').click();
  await page.waitForTimeout(100);
  check("before/after switches pair", (await page.locator("[data-ba-after]").getAttribute("src")).includes("procoffee"));

  const chat = page.locator("[data-tg-chat]");
  await page.locator('[data-tg-keys] button[data-q="book"]').click();
  await page.waitForTimeout(900);
  await page.locator('[data-tg-keys] button[data-q^="svc:"]').first().click();
  await page.waitForTimeout(900);
  await page.locator('[data-tg-keys] button[data-q^="slot:"]').first().click();
  await page.waitForTimeout(900);
  check("telegram bot booking flow", (await chat.textContent()).includes("Booked (demo)"));
  await page.locator('[data-tg-tab="app"]').click();
  await page.locator(".mini__opt").nth(1).click();
  await page.locator('.mini__slot[data-slot="16:00"]').click();
  const main = page.locator("[data-mini-main]");
  check("mini app enables main button", !(await main.isDisabled()) && (await main.textContent()).includes("16:00"));
  await main.click();
  check("mini app confirmation", (await page.locator("[data-mini]").textContent()).includes("Booked"));
  await page.locator('[data-tg-tab="bot"]').click();
  check("mini app posts to chat", (await chat.textContent()).includes("Booked via Mini App"));

  const faq = page.locator(".faq details");
  await faq.nth(0).locator("summary").click();
  await faq.nth(1).locator("summary").click();
  check("FAQ opens one at a time", (await faq.nth(1).getAttribute("open")) !== null && (await faq.nth(0).getAttribute("open")) === null);
  check("home interactions no errors", page.__errors.length === 0, page.__errors.join(" | "));
  await page.context().close();
}

// 7. contact form
{
  const page = await newPage([390, 844]);
  await go(page, "contact/");
  const form = page.locator("[data-contact-form]");
  await form.locator('button[type="submit"]').click();
  check("contact form blocks empty submit", (await form.locator(".field.is-invalid").count()) === 3);
  await form.locator("#cf-name").fill("Test Client");
  await form.locator("#cf-contact").fill("not-a-contact");
  await form.locator("#cf-message").fill("We need a website for our new architecture bureau.");
  await form.locator('button[type="submit"]').click();
  check("contact form rejects invalid contact", (await form.locator("#cf-contact").getAttribute("aria-invalid")) === "true");
  await form.locator("#cf-contact").fill("@test_client");
  await form.locator('input[name="consent"]').check();
  await form.locator('label.choice:has-text("Telegram bot")').click();
  await form.locator('button[type="submit"]').click();
  await page.waitForTimeout(300);
  const confirm = form.locator("[data-confirm]");
  check("contact form confirmation", await confirm.isVisible() && /HY-\d{6}-[A-Z0-9]{4}/.test(await confirm.textContent()));
  check("contact form brief content", (await confirm.textContent()).includes("Telegram bot") && (await confirm.textContent()).includes("Demo mode"));
  const [download] = await Promise.all([page.waitForEvent("download"), confirm.locator("[data-download]").click()]);
  check("brief download", /HY-.*\.txt$/.test(download.suggestedFilename()));
  await page.context().close();
}

// 8. project builder
{
  const page = await newPage([1280, 800]);
  await go(page, "start/?type=telegram");
  const next = page.locator("[data-next]");
  check("builder preselects type from URL", await page.locator('input[name="type"][value="bot"]').isChecked());
  await page.locator('input[name="type"][value="miniapp"]').check({ force: true });
  await next.click();
  check("builder step 2", (await page.locator("[data-builder-count]").textContent()) === "Step 2 of 6");
  await next.click();
  check("builder validates step 2", (await page.locator('[data-error="task"]').textContent()).length > 0);
  await page.locator('label.choice:has-text("Launch something new")').click();
  await page.locator("#b-url").fill("not a url");
  await next.click();
  check("builder validates URL", (await page.locator('[data-error="url"]').textContent()).length > 0);
  await page.locator("#b-url").fill("https://example.com");
  await next.click();
  check("builder features adapt to type", (await page.locator("[data-features]").textContent()).includes("Telegram login"));
  await next.click();
  check("builder requires a feature", (await page.locator('[data-error="features"]').textContent()).length > 0);
  await page.locator('label.choice:has-text("Booking")').click();
  await page.locator('label.choice:has-text("Payments")').click();
  await next.click();
  await page.locator('label.choice:has-text("$1,500 – $5,000")').click();
  await next.click();
  await page.locator('label.choice:has-text("Within a month")').click();
  await next.click();
  check("builder last step shows summary", (await page.locator("[data-summary]").textContent()).includes("Telegram Mini App"));
  check("builder button label", (await page.locator("[data-next-label]").textContent()) === "Send brief");
  await page.locator("#b-name").fill("Alex");
  await page.locator("#b-contact").fill("alex@example.com");
  await next.click();
  check("builder requires consent", (await page.locator('[data-error="consent"]').textContent()).length > 0);
  await page.locator('fieldset[data-step="5"] input[name="consent"]').check();
  await next.click();
  await page.waitForTimeout(300);
  const conf = page.locator("[data-builder] [data-confirm]");
  check("builder confirmation", await conf.isVisible() && (await conf.textContent()).includes("Booking, Payments"));
  check("builder no errors", page.__errors.length === 0, page.__errors.join(" | "));
  // draft persistence
  await go(page, "start/");
  await page.locator('input[name="type"][value="web"]').check({ force: true });
  await page.reload();
  check("builder restores draft", await page.locator('input[name="type"][value="web"]').isChecked());
  await page.context().close();
}

// 9. reduced motion + no-JS rendering
{
  const page = await newPage([1440, 900], { reducedMotion: "reduce" });
  await go(page, "");
  await page.waitForTimeout(300);
  const visible = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].every((e) => getComputedStyle(e).opacity === "1"));
  check("reduced motion: content visible without animation", visible);
  const flow = await page.evaluate(() => getComputedStyle(document.querySelector(".neck-flow")).display);
  check("reduced motion: data pulses disabled", flow === "none");
  await page.context().close();
  const nojs = await newPage([1440, 900], { javaScriptEnabled: false });
  await go(nojs, "");
  const op = await nojs.evaluate(() => getComputedStyle(document.querySelector("[data-reveal]")).opacity);
  check("no-JS: content visible", op === "1");
  await go(nojs, "projects/");
  check("no-JS: all projects listed", (await nojs.locator(".ptile").count()) === 12);
  await nojs.context().close();
}

await browser.close();
server.close();
const passed = results.filter((r) => r.ok).length;
writeFileSync("tests/report.json", JSON.stringify({ date: new Date().toISOString(), pages: PAGES.length, viewports: VIEWPORTS, passed, failed: failures, results }, null, 2));
console.log(`\n${passed} passed, ${failures} failed — report: tests/report.json`);
process.exit(failures ? 1 : 0);
