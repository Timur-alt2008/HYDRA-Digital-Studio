// Tiny static server that mimics GitHub Pages: serves /docs under the base path, 404.html fallback.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const BASE = process.env.BASE_PATH || "/HYDRA-Digital-Studio/";
const PORT = Number(process.env.PORT || 4321);
const ROOT = "docs";
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json" };

export function startServer(port = PORT) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    if (url.pathname === "/" || url.pathname === BASE.slice(0, -1)) { res.writeHead(302, { Location: BASE }); return res.end(); }
    if (!url.pathname.startsWith(BASE)) { res.writeHead(404); return res.end("Not under base path"); }
    let rel = normalize(decodeURIComponent(url.pathname.slice(BASE.length))).replace(/^(\.\.[/\\])+/, "");
    let file = join(ROOT, rel);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!existsSync(file)) {
      res.writeHead(404, { "Content-Type": TYPES[".html"] });
      return res.end(readFileSync(join(ROOT, "404.html")));
    }
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await startServer();
  console.log(`HYDRA → http://127.0.0.1:${PORT}${BASE}`);
}
