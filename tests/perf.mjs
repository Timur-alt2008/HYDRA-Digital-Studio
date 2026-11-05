// Lab performance check: FCP, LCP, CLS, transferred bytes and DOM size for key pages (mobile + desktop).
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { startServer } from "../scripts/serve.mjs";

const PORT = 4401, BASE = "/HYDRA-Digital-Studio/";
const server = await startServer(PORT);
const browser = await chromium.launch();
const rows = [];
for (const [label, vp, throttle] of [["mobile", { width: 390, height: 844 }, true], ["desktop", { width: 1440, height: 900 }, false]]) {
  for (const path of ["", "projects/", "start/", "projects/coffee-house/"]) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    if (process.env.OFFLINE) await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
    const cdp = await ctx.newCDPSession(page);
    if (throttle) {
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    let bytes = 0;
    page.on("response", async (r) => { try { bytes += (await r.body()).length; } catch {} });
    await page.addInitScript(() => {
      window.__lcp = 0; window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(`http://127.0.0.1:${PORT}${BASE}${path}`, { waitUntil: "load" });
    await page.waitForTimeout(2500);
    const m = await page.evaluate(() => ({
      fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime || 0,
      lcp: window.__lcp, cls: window.__cls, dom: document.getElementsByTagName("*").length,
    }));
    rows.push({ view: label, page: "/" + path, fcp_ms: Math.round(m.fcp), lcp_ms: Math.round(m.lcp), cls: +m.cls.toFixed(3), kb: Math.round(bytes / 1024), dom: m.dom });
    await ctx.close();
  }
}
await browser.close(); server.close();
console.table(rows);
writeFileSync("tests/perf.json", JSON.stringify({ date: new Date().toISOString(), note: "Local lab run; mobile = 4x CPU slowdown + 1.6 Mbps / 150 ms. Google Fonts blocked when OFFLINE=1.", rows }, null, 2));
