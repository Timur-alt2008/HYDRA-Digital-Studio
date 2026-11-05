// Generates public/og.png (1200×630) and public/apple-touch-icon.png (180×180) with Playwright.
// Run once after changing the brand: npm run assets
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const icon = readFileSync("public/favicon.svg", "utf8");
const og = `<!doctype html><html><head><style>
  html,body{margin:0;width:1200px;height:630px;background:#0b0f0e;color:#ece8df;font-family:Archivo,"Inter",system-ui,sans-serif;overflow:hidden}
  .wrap{position:absolute;inset:56px 64px;display:flex;flex-direction:column;justify-content:space-between}
  .top{display:flex;justify-content:space-between;font:500 18px "JetBrains Mono",monospace;letter-spacing:.1em;text-transform:uppercase;color:#929b95}
  .top b{color:#ff4f1f;font-weight:500}
  h1{margin:0;font-size:132px;line-height:.86;font-weight:900;letter-spacing:-.045em;text-transform:uppercase}
  h1 span{color:#ff4f1f}
  .foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(236,232,223,.18);padding-top:20px;font:500 18px "JetBrains Mono",monospace;letter-spacing:.08em;color:#929b95;text-transform:uppercase}
  .brand{display:flex;gap:14px;align-items:center;color:#ece8df;font:900 26px Archivo,Inter,sans-serif;letter-spacing:.16em}
  .brand svg{width:40px;height:40px}
  svg.core{position:absolute;right:60px;top:118px;width:360px;height:380px;opacity:.9}
</style></head><body>
<svg class="core" viewBox="0 0 600 640"><g fill="none" stroke="rgba(236,232,223,.35)" stroke-width="2">
<path d="M300 590 C300 400,96 406,96 198"/><path d="M300 590 C300 400,230 296,230 88"/><path d="M300 590 C300 400,372 300,372 92"/><path d="M300 590 C300 400,470 430,470 222"/></g>
<g fill="#0b0f0e" stroke="#ff4f1f" stroke-width="2"><circle cx="96" cy="176" r="22"/><circle cx="230" cy="66" r="22"/><circle cx="372" cy="70" r="22"/><circle cx="470" cy="200" r="22"/></g>
<rect x="289" y="579" width="22" height="22" fill="#ff4f1f"/></svg>
<div class="wrap">
  <div class="top"><b>We build digital experiences</b><span>Web · Redesign · Telegram · Products</span></div>
  <h1>One core.<br><span>Four heads.</span></h1>
  <div class="foot"><span class="brand">${icon.replace('<rect width="32" height="32" fill="#0b0f0e"/>', "")}HYDRA</span><span>Think beyond. Build without limits.</span></div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(og, { waitUntil: "load" });
await page.screenshot({ path: "public/og.png" });
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(`<html><body style="margin:0;background:#0b0f0e">${icon.replace("<svg ", '<svg width="180" height="180" ')}</body></html>`);
await page.screenshot({ path: "public/apple-touch-icon.png" });
await browser.close();
console.log("✓ public/og.png, public/apple-touch-icon.png");
