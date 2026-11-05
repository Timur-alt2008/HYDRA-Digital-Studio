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
process.env.BUILD_ID = Date.now().toString(36); // cache-busting for CSS/JS on GitHub Pages
const { SITE, absoluteAsset, absoluteFor } = await import("../src/config");
const { LOCALES, setLocale, localePrefix, missing } = await import("../src/i18n");
const { getProjects } = await import("../src/data/projects");
const { Home } = await import("../src/pages/Home");
const { About, Contact, NotFound, Process, ProjectDetail, Projects, Services, Start } = await import("../src/pages/Inner");
const { Account } = await import("../src/pages/Account");

const OUT = process.env.OUT_DIR || "docs";
const t0 = Date.now();

type Route = { path: string; el: () => React.ReactElement; priority: number; sitemap?: false };
const projects = getProjects();
const routes: Route[] = [
  { path: "", el: () => <Home />, priority: 1 },
  { path: "services/", el: () => <Services />, priority: 0.9 },
  { path: "projects/", el: () => <Projects />, priority: 0.9 },
  { path: "process/", el: () => <Process />, priority: 0.7 },
  { path: "about/", el: () => <About />, priority: 0.7 },
  { path: "contact/", el: () => <Contact />, priority: 0.8 },
  { path: "start/", el: () => <Start />, priority: 0.8 },
  { path: "account/", el: () => <Account />, priority: 0.3, sitemap: false },
  ...projects.map((p, i) => ({
    path: `projects/${p.slug}/`,
    // data is re-read inside the locale so titles/texts are translated
    el: () => { const ps = getProjects(); return <ProjectDetail p={ps[i]} next={ps[(i + 1) % ps.length]} />; },
    priority: 0.6,
  })),
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
let pages = 0;
for (const l of LOCALES) {
  setLocale(l);
  for (const r of routes) {
    write(`${localePrefix(l)}${r.path}index.html`, "<!doctype html>" + renderToStaticMarkup(r.el()));
    pages++;
  }
}
setLocale("en");
write("404.html", "<!doctype html>" + renderToStaticMarkup(<NotFound />));
if (missing.size) {
  console.error(`✗ ${missing.size} untranslated strings:\n` + [...missing].slice(0, 40).map((m) => "  " + m).join("\n"));
  if (!process.env.I18N_ALLOW_MISSING) process.exit(1);
}

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
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${LOCALES.flatMap((l) => routes.filter((r) => r.sitemap !== false).map((r) => `  <url><loc>${absoluteFor(l, r.path)}</loc><lastmod>${today}</lastmod><priority>${r.priority}</priority>${LOCALES.map((x) => `<xhtml:link rel="alternate" hreflang="${x}" href="${absoluteFor(x, r.path)}"/>`).join("")}</url>`)).join("\n")}\n</urlset>\n`);
write("robots.txt", SITE.lab ? "User-agent: *\nDisallow: /\n" : `User-agent: *\nAllow: /\n\nSitemap: ${absoluteAsset("sitemap.xml")}\n`);
write("site.webmanifest", JSON.stringify({ name: SITE.legalName, short_name: SITE.name, start_url: SITE.base, display: "standalone", background_color: "#0b0720", theme_color: "#0b0720", icons: [{ src: `${SITE.base}favicon.svg`, sizes: "any", type: "image/svg+xml" }, { src: `${SITE.base}apple-touch-icon.png`, sizes: "180x180", type: "image/png" }] }, null, 2));

console.log(`✓ built ${pages + 1} pages into /${OUT} in ${Date.now() - t0} ms (base ${SITE.base})`);
