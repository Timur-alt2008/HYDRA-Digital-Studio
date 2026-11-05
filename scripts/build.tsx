/**
 * Static build: renders every page with React on the server (no client React runtime),
 * bundles the TypeScript client with esbuild and writes a GitHub-Pages-ready site to /docs.
 */
import { build as esbuild, transform } from "esbuild";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Load .env (if present) before the site config is evaluated. Existing env vars win.
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const { SITE, absolute } = await import("../src/config");
const { PROJECTS } = await import("../src/data/projects");
const { Home } = await import("../src/pages/Home");
const { About, Contact, NotFound, Process, ProjectDetail, Projects, Services, Start } = await import("../src/pages/Inner");

const OUT = "docs";
const t0 = Date.now();

type Route = { path: string; file: string; el: React.ReactElement; priority: number };
const routes: Route[] = [
  { path: "", file: "index.html", el: <Home />, priority: 1 },
  { path: "services/", file: "services/index.html", el: <Services />, priority: 0.9 },
  { path: "projects/", file: "projects/index.html", el: <Projects />, priority: 0.9 },
  { path: "process/", file: "process/index.html", el: <Process />, priority: 0.7 },
  { path: "about/", file: "about/index.html", el: <About />, priority: 0.7 },
  { path: "contact/", file: "contact/index.html", el: <Contact />, priority: 0.8 },
  { path: "start/", file: "start/index.html", el: <Start />, priority: 0.8 },
  ...PROJECTS.map((p, i) => ({ path: `projects/${p.slug}/`, file: `projects/${p.slug}/index.html`, el: <ProjectDetail p={p} next={PROJECTS[(i + 1) % PROJECTS.length]} />, priority: 0.6 })),
];

// 1. clean output (keep a custom domain file if present)
const cname = existsSync(join(OUT, "CNAME")) ? readFileSync(join(OUT, "CNAME"), "utf8") : null;
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "assets"), { recursive: true });
if (cname) writeFileSync(join(OUT, "CNAME"), cname);

// 2. static assets
cpSync("public", OUT, { recursive: true });
writeFileSync(join(OUT, ".nojekyll"), "");

// 3. pages
const write = (file: string, html: string) => {
  const target = join(OUT, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
};
for (const r of routes) write(r.file, "<!doctype html>" + renderToStaticMarkup(r.el));
write("404.html", "<!doctype html>" + renderToStaticMarkup(<NotFound />));

// 4. client bundle + styles
await esbuild({
  entryPoints: ["src/client/main.ts"],
  bundle: true,
  minify: true,
  format: "esm",
  target: ["es2020", "safari15"],
  outfile: join(OUT, "assets/main.js"),
  legalComments: "none",
  logLevel: "warning",
});
const css = await transform(readFileSync("src/styles/main.css", "utf8"), { loader: "css", minify: true, target: ["chrome100", "safari15", "firefox100"] });
writeFileSync(join(OUT, "assets/main.css"), css.code);

// 5. SEO files
const today = new Date().toISOString().slice(0, 10);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${absolute(r.path)}</loc><lastmod>${today}</lastmod><priority>${r.priority}</priority></url>`).join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${absolute("sitemap.xml")}\n`);
write("site.webmanifest", JSON.stringify({ name: SITE.legalName, short_name: SITE.name, start_url: SITE.base, display: "standalone", background_color: "#0b0f0e", theme_color: "#0b0f0e", icons: [{ src: `${SITE.base}favicon.svg`, sizes: "any", type: "image/svg+xml" }, { src: `${SITE.base}apple-touch-icon.png`, sizes: "180x180", type: "image/png" }] }, null, 2));

console.log(`✓ built ${routes.length + 1} pages into /${OUT} in ${Date.now() - t0} ms (base ${SITE.base})`);
