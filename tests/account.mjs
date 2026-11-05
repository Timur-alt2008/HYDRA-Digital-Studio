// End-to-end test of "My account" in demo mode (browser storage): sign-up, saving requests from
// both forms, active/completed tabs, studio simulation, sign-out / sign-in, error messages.
import { chromium } from "playwright";
import { startServer } from "../scripts/serve.mjs";

const lang = process.argv[2] || "";            // "" (English) or e.g. "ru/"
const s = await startServer(4334);
const B = `http://127.0.0.1:4334/HYDRA-Digital-Studio/${lang}`;
const b = await chromium.launch();
const ok = []; const bad = [];
const check = (name, cond, info = "") => (cond ? ok : bad).push(name + (cond ? "" : " → " + info));

for (const [w, h] of [[1280, 900], [390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.route(/fonts\./, (r) => r.abort());
  const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  const tag = `${w}px`;

  await p.goto(B + "account/");
  check(`${tag}: auth shown, dashboard hidden`, await p.isVisible("[data-auth]") && !(await p.isVisible("[data-dash]")));
  check(`${tag}: demo notice`, await p.isVisible("[data-account-demo]"));
  await p.click('[data-auth-tab="signup"]');
  await p.click("[data-signup] button[type=submit]");
  check(`${tag}: sign-up validation`, (await p.locator("[data-signup] .field.is-invalid").count()) === 3);
  await p.fill("#su-name", "Test Client"); await p.fill("#su-email", "client@example.com"); await p.fill("#su-password", "short");
  await p.check("[data-signup] input[name=consent]");
  await p.click("[data-signup] button[type=submit]");
  check(`${tag}: short password rejected`, await p.isVisible("[data-signup] .field.is-invalid #su-password"));
  await p.fill("#su-password", "correct-horse-1");
  await p.click("[data-signup] button[type=submit]");
  await p.waitForSelector("[data-dash]:not([hidden])", { timeout: 8000 });
  check(`${tag}: signed in after sign-up`, (await p.textContent("[data-dash-email]")) === "client@example.com");
  check(`${tag}: empty active list`, await p.isVisible('[data-list="active"] .req-empty'));
  check(`${tag}: header shows the user`, await p.locator("[data-account-link].is-signed").count() === 1);

  // request from the contact form (prefilled with the account)
  await p.goto(B + "contact/");
  await p.waitForTimeout(300);
  check(`${tag}: contact form prefilled`, (await p.inputValue("#cf-name")) === "Test Client" && (await p.inputValue("#cf-contact")) === "client@example.com");
  await p.fill("#cf-message", "We need a booking website for a small yoga studio.");
  await p.check("[data-contact-form] input[name=consent]");
  await p.click("[data-contact-form] button[type=submit]");
  await p.waitForSelector("[data-contact-form] .account-note");
  check(`${tag}: confirm says saved to account`, await p.locator("[data-contact-form] .account-note a").count() === 1);

  // request from the Project Builder
  await p.goto(B + "start/");
  await p.click('.tile:has(input[value="bot"])'); await p.click("[data-next]");
  await p.click('.choice:has(input[name="task"]) >> nth=0'); await p.click("[data-next]");
  await p.click('[data-features] .choice >> nth=0'); await p.click("[data-next]");
  await p.click('.choice:has(input[name="budget"]) >> nth=1'); await p.click("[data-next]");
  await p.click('.choice:has(input[name="timeline"]) >> nth=1'); await p.click("[data-next]");
  check(`${tag}: builder prefilled`, (await p.inputValue("#b-contact")) === "client@example.com");
  await p.check("[data-builder] input[name=consent]");
  await p.click("[data-next]");
  await p.waitForSelector("[data-builder] .account-note");

  await p.goto(B + "account/");
  await p.waitForSelector("[data-dash]:not([hidden])");
  check(`${tag}: two active requests`, (await p.locator('[data-list="active"] .req').count()) === 2, String(await p.locator('[data-list="active"] .req').count()));
  check(`${tag}: counters`, (await p.textContent('[data-count="active"]')) === "2" && (await p.textContent('[data-count="closed"]')) === "0");
  check(`${tag}: no studio controls by default`, (await p.locator("[data-studio-form]").count()) === 0);

  // studio simulation: complete one request with a note
  await p.check("[data-studio-sim]");
  await p.waitForSelector("[data-studio-form]");
  const first = p.locator('[data-list="active"] .req').first();
  await first.locator("select").selectOption("done");
  await first.locator('input[name="note"]').fill("Launched — see the link in your email.");
  await first.locator("button[type=submit]").click();
  await p.waitForFunction(() => document.querySelector('[data-count="closed"]')?.textContent === "1");
  await p.click('[data-dash-tab="closed"]');
  check(`${tag}: completed tab has the request`, (await p.locator('[data-list="closed"] .req-status--done').count()) === 1);
  check(`${tag}: studio note visible`, (await p.textContent('[data-list="closed"] .req__note')).includes("Launched"));
  check(`${tag}: active now 1`, (await p.locator('[data-list="active"] .req').count()) === 1);

  // sign out / wrong password / sign in
  await p.click("[data-signout]");
  await p.waitForSelector("[data-auth]:not([hidden])");
  await p.fill("#si-email", "client@example.com"); await p.fill("#si-password", "wrong-password");
  await p.click("[data-signin] button[type=submit]");
  await p.waitForFunction(() => (document.querySelector("[data-signin] [data-form-error]")?.textContent || "").length > 0);
  check(`${tag}: wrong password message`, true);
  await p.fill("#si-password", "correct-horse-1");
  await p.click("[data-signin] button[type=submit]");
  await p.waitForSelector("[data-dash]:not([hidden])");
  check(`${tag}: requests kept after sign-in`, (await p.textContent('[data-count="closed"]')) === "1");
  // duplicate sign-up
  await p.click("[data-signout]");
  await p.click('[data-auth-tab="signup"]');
  await p.fill("#su-name", "Someone"); await p.fill("#su-email", "client@example.com"); await p.fill("#su-password", "another-pass-2");
  await p.check("[data-signup] input[name=consent]");
  await p.click("[data-signup] button[type=submit]");
  await p.waitForFunction(() => (document.querySelector("[data-signup] [data-form-error]")?.textContent || "").length > 0);
  check(`${tag}: duplicate email rejected`, true);
  // passwords are never stored in clear text
  const stored = await p.evaluate(() => localStorage.getItem("thydra-demo-accounts") || "");
  check(`${tag}: password not stored in clear text`, !stored.includes("correct-horse-1") && stored.includes("hash"));
  check(`${tag}: no horizontal overflow`, await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  check(`${tag}: no page errors`, errs.length === 0, errs.join("; "));
  await ctx.close();
}
console.log(ok.map((x) => "✓ " + x).join("\n")); console.log(bad.map((x) => "✗ " + x).join("\n"));
console.log(`${ok.length} passed, ${bad.length} failed`);
await b.close(); s.close();
process.exit(bad.length ? 1 : 0);
