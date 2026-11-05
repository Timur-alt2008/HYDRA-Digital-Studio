import { chromium } from "playwright";
import { startServer } from "../scripts/serve.mjs";
const server = await startServer(4329);
const [,, path = "", w = "1440", h = "900", out = "/tmp/s.png", full = "0"] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h } });
const errs = [];
p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
p.on("pageerror", (e) => errs.push(String(e)));
await p.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
await p.goto(`http://127.0.0.1:4329/HYDRA-Digital-Studio/${path}`, { waitUntil: "load" });
if (full === "1") { for (let y = 0; y < 30000; y += 700) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(60); } await p.evaluate(() => scrollTo(0, 0)); }
await p.waitForTimeout(1600);
await p.screenshot({ path: out, fullPage: full === "1" });
console.log("errors:", errs.filter(e => !/fonts/.test(e)), "overflow:", await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
await b.close(); server.close();
