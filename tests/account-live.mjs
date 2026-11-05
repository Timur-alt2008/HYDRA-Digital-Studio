// "My account" against a local mock of the Supabase API: client and studio (admin) in two browsers.
// Builds a copy of the site with SUPABASE_URL pointing at the mock (into a temp folder, /docs untouched).
import { chromium } from "playwright";
import { execSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { startMockSupabase } from "./mock-supabase.mjs";

const out = mkdtempSync(join(tmpdir(), "thydra-live-"));
execSync(`${process.env.TSX || "npx tsx"} scripts/build.tsx`, { stdio: "inherit", env: { ...process.env, OUT_DIR: out, SUPABASE_URL: "http://127.0.0.1:4336", SUPABASE_ANON_KEY: "test-anon", I18N_ALLOW_MISSING: "1" } });
process.env.SERVE_DIR = out;
const { startServer } = await import("../scripts/serve.mjs");
const site = await startServer(4335);
const api = startMockSupabase(4336, { admins: ["studio@example.com"] });
const B = "http://127.0.0.1:4335/HYDRA-Digital-Studio/";
const b = await chromium.launch();
const ok = []; const bad = [];
const check = (name, cond, info = "") => (cond ? ok : bad).push(name + (cond ? "" : " → " + info));
const page = async () => { const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); const p = await c.newPage(); await p.route(/fonts\./, (r) => r.abort()); const errs = []; p.on("pageerror", (e) => errs.push(String(e))); return { p, errs }; };
const signUp = async (p, name, email) => {
  await p.goto(B + "account/");
  await p.click('[data-auth-tab="signup"]');
  await p.fill("#su-name", name); await p.fill("#su-email", email); await p.fill("#su-password", "long-password-1");
  await p.check("[data-signup] input[name=consent]"); await p.click("[data-signup] button[type=submit]");
  await p.waitForSelector("[data-dash]:not([hidden])", { timeout: 8000 });
};

const client = await page();
check("live: no demo notice", !(await (await client.p.goto(B + "account/"), client.p.isVisible("[data-account-demo]"))));
await signUp(client.p, "Live Client", "client@example.com");
check("live: signed up", (await client.p.textContent("[data-dash-email]")) === "client@example.com");
check("live: no studio tab for a client", await client.p.isHidden('[data-dash-tab="studio"]'));
await client.p.goto(B + "contact/");
await client.p.fill("#cf-message", "Please build a site for our bakery with online orders.");
await client.p.check("[data-contact-form] input[name=consent]");
await client.p.click("[data-contact-form] button[type=submit]");
await client.p.waitForSelector("[data-contact-form] .account-note");
check("live: confirmation says the studio can see it", (await client.p.textContent("[data-contact-form] [data-confirm]")).includes("studio can see it"));

const studio = await page();
await signUp(studio.p, "Studio", "studio@example.com");
await studio.p.waitForSelector('[data-dash-tab="studio"]:not([hidden])');
await studio.p.click('[data-dash-tab="studio"]');
check("live: studio sees the client's request", (await studio.p.locator('[data-list="studio"] .req').count()) === 1);
const r = studio.p.locator('[data-list="studio"] .req').first();
await r.locator("select").selectOption("done");
await r.locator('input[name="note"]').fill("Done — the site is live.");
await r.locator("button[type=submit]").click();
await studio.p.waitForFunction(() => document.querySelector('[data-list="studio"] .req-status--done'));

await client.p.goto(B + "account/");
await client.p.waitForFunction(() => document.querySelector('[data-count="closed"]')?.textContent === "1");
await client.p.click('[data-dash-tab="closed"]');
check("live: client sees it completed with the note", (await client.p.textContent('[data-list="closed"] .req')).includes("Done — the site is live."));
// a client cannot change statuses even by calling the API directly
const forged = await client.p.evaluate(async () => {
  const s = JSON.parse(localStorage.getItem("thydra-session"));
  const list = await (await fetch("http://127.0.0.1:4336/rest/v1/requests", { headers: { apikey: "test-anon", Authorization: "Bearer " + s.access_token } })).json();
  await fetch("http://127.0.0.1:4336/rest/v1/requests?id=eq." + list[0].id, { method: "PATCH", headers: { apikey: "test-anon", Authorization: "Bearer " + s.access_token, "Content-Type": "application/json" }, body: JSON.stringify({ status: "declined" }) });
  return (await (await fetch("http://127.0.0.1:4336/rest/v1/requests", { headers: { apikey: "test-anon", Authorization: "Bearer " + s.access_token } })).json())[0].status;
});
check("live: client cannot change status", forged === "done", forged);
await client.p.click("[data-signout]");
await client.p.fill("#si-email", "client@example.com"); await client.p.fill("#si-password", "nope-nope-1");
await client.p.click("[data-signin] button[type=submit]");
await client.p.waitForFunction(() => (document.querySelector("[data-signin] [data-form-error]")?.textContent || "").includes("Wrong"));
check("live: wrong password message", true);
check("live: no page errors", client.errs.length + studio.errs.length === 0, [...client.errs, ...studio.errs].join("; "));
console.log(ok.map((x) => "✓ " + x).join("\n")); console.log(bad.map((x) => "✗ " + x).join("\n"));
console.log(`${ok.length} passed, ${bad.length} failed`);
await b.close(); site.close(); api.close();
process.exit(bad.length ? 1 : 0);
