// Generates public/og.png (1200×630) and public/apple-touch-icon.png (180×180) with Playwright.
// Run once after changing the brand: npm run assets
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const icon = readFileSync("public/favicon.svg", "utf8");
const mark = icon.replace(/<rect width="32" height="32" rx="8" fill="url\(#g\)"\/>/, "");
const og = `<!doctype html><html><head><style>
  html,body{margin:0;width:1200px;height:630px;color:#f2e9ff;font-family:"Manrope","Inter Display","Inter",system-ui,sans-serif;overflow:hidden;
    background:radial-gradient(40% 60% at 76% 45%,rgba(122,63,216,.38),transparent 70%),radial-gradient(40% 40% at 0% 100%,rgba(122,63,216,.14),transparent 70%),linear-gradient(180deg,#0b0720,#0b0720)}
  .wrap{position:absolute;inset:56px 64px;display:flex;flex-direction:column;justify-content:space-between}
  .top{display:flex;justify-content:space-between;font:500 17px "DejaVu Sans Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:#a08fc4}
  .top b{color:#7a3fd8;font-weight:500}
  h1{margin:0;font-size:124px;line-height:.98;font-weight:700;letter-spacing:-.04em}
  h1 span{background:linear-gradient(100deg,#9d71e8,#7a3fd8 55%,#7d4ee0);-webkit-background-clip:text;background-clip:text;color:transparent}
  .foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.16);padding-top:20px;font:500 17px "DejaVu Sans Mono",monospace;letter-spacing:.1em;color:#a08fc4;text-transform:uppercase}
  .brand{display:flex;gap:14px;align-items:center;color:#fff;font:800 26px "Inter Display",Inter,sans-serif;letter-spacing:.2em}
  .brand svg{width:40px;height:40px}
  svg.core{position:absolute;right:70px;top:110px;width:360px;height:384px}
</style></head><body>
<svg class="core" viewBox="0 0 600 640"><defs><filter id="b" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="14"/></filter></defs>
<g fill="none" stroke="rgba(255,255,255,.32)" stroke-width="2" stroke-linecap="round">
<path d="M300 590 C300 400,96 406,96 198"/><path d="M300 590 C300 400,230 296,230 88"/><path d="M300 590 C300 400,372 300,372 92"/><path d="M300 590 C300 400,450 436,450 228"/></g>
<g fill="rgba(26,26,26,.9)" stroke="#7a3fd8" stroke-width="2"><circle cx="96" cy="176" r="22"/><circle cx="230" cy="66" r="22"/><circle cx="372" cy="70" r="22"/><circle cx="450" cy="206" r="22"/></g>
<g fill="#fff"><circle cx="96" cy="176" r="5"/><circle cx="230" cy="66" r="5"/><circle cx="372" cy="70" r="5"/><circle cx="450" cy="206" r="5"/></g>
<circle cx="300" cy="590" r="46" fill="#7a3fd8" opacity=".55" filter="url(#b)"/><circle cx="300" cy="590" r="12" fill="#fff"/></svg>
<div class="wrap">
  <div class="top"><b>We build digital experiences</b><span>Web · Redesign · Telegram · Products</span></div>
  <h1>One core.<br><span>Four heads.</span></h1>
  <div class="foot"><span class="brand">${mark}HYDRA</span><span>Think beyond. Build without limits.</span></div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(og, { waitUntil: "load" });
await page.screenshot({ path: "public/og.png" });
await page.setViewportSize({ width: 180, height: 180 });
// iOS rounds the icon itself, so the touch icon is full-bleed.
await page.setContent(`<html><body style="margin:0;background:#0b0720">${icon.replace('rx="8"', 'rx="0"').replace("<svg ", '<svg width="180" height="180" ')}</body></html>`);
await page.screenshot({ path: "public/apple-touch-icon.png" });
await browser.close();
console.log("✓ public/og.png, public/apple-touch-icon.png");
