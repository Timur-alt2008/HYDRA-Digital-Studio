# HYDRA Digital Studio

**One core. Four heads.** — the website of HYDRA, an independent digital development studio:
web development, website redesign, Telegram bots & Mini Apps and custom digital products.

**Live site:** https://timur-alt2008.github.io/HYDRA-Digital-Studio/

Research tool used to design it: [HYDRA Design Intelligence](https://github.com/Timur-alt2008/HYDRA-Design-Intelligence)

> Portfolio items on the site are real, published code. Demo projects for fictional businesses are labelled
> **Demo**, ideas are labelled **Concept**, our own tool is labelled **Internal tool**.

## What's inside

| Page | Highlights |
| --- | --- |
| Home | Interactive "one core, four heads" diagram, services index, manifesto, selected work, spec sheet, Telegram bot + Mini App demo, before/after slider, process, stack, FAQ, collaboration form |
| Services | Four services, each with its own composition, deliverables, stack and a bot-vs-Mini-App comparison |
| Projects | 12 projects, filters (Websites · Redesign · Telegram Bots · Telegram Mini Apps · Digital Products) with URL state and FLIP animation, a page per project |
| Process | Idea → Research → Design → Development → Testing → Launch with a pinned stage counter |
| About | Philosophy, approach, specialisation, what we don't do, values |
| Contact | Validated form, channels, FAQ |
| Project Builder | 6-step brief: type → task → features (adaptive) → budget → timeline → contacts, validation, summary, draft saved in the browser, confirmation with brief ID, copy/download |

Also: View Transitions between pages, contrast-adaptive header, mobile menu with focus trap, reduced-motion and
no-JS support, Open Graph, JSON-LD, sitemap, robots.txt, 404 page.

## Stack

- **React 19 + TypeScript** components rendered to static HTML at build time (no client framework shipped)
- **Vanilla TypeScript** client bundle (24 KB, 9 KB gzipped) built with **esbuild**
- Hand-written CSS design system (Manrope + Inter + JetBrains Mono; grey scale `#0B0B0B → #FFFFFF` + one colour, electric blue `#3550D0`)
- **Bilingual**: English at the root, Russian under `/ru/`, EN/RU switcher on every page, `hreflang` + bilingual sitemap
- **Playwright** end-to-end tests on 9 viewports

```
src/
  config.ts            site settings: base path, contact channels (env overridable)
  data/                services, projects, process, FAQ, capabilities — single source of truth
  components/          Layout, UI kit, HydraCore diagram, blocks, vector art
  pages/               Home + inner pages (About, Services, Projects, ProjectDetail, Process, Contact, Start, 404)
  i18n.ts              locale switch for the build: L("English", "Русский")
  client/              main.ts (header, menu, reveals, core, filters, before/after, process), telegram.ts, forms.ts
  styles/main.css      design tokens + components
scripts/build.tsx      static build → /docs (GitHub Pages)
scripts/serve.mjs      local server that mimics GitHub Pages (base path + 404)
scripts/assets.mjs     regenerates og.png and apple-touch-icon.png
tests/e2e.mjs          Playwright QA suite → tests/report.json
tests/ru-smoke.mjs     Russian locale: interactive parts, language switch, untranslated-text scan
design/                design concept and research decisions
docs/                  production build (served by GitHub Pages)
```

## Run it

Requirements: Node.js 20+.

```bash
npm install
npx playwright install chromium   # only for tests
npm run dev                       # build + serve at http://127.0.0.1:4321/HYDRA-Digital-Studio/
npm test                          # Playwright QA on 9 viewports
npm run typecheck
```

### Connecting the forms

The contact form and the Project Builder work without a backend. Configure **one** delivery channel in
`.env` (see `.env.example`) and rebuild:

| Variable | Effect |
| --- | --- |
| `FORM_ENDPOINT` | POSTs the brief as JSON (Formspree, a serverless function, your API) |
| `CONTACT_EMAIL` | Opens the visitor's mail app with the brief filled in; shows the address on Contact |
| `CONTACT_TELEGRAM` | Copies the brief and opens `t.me/<username>` |

With none set, the forms run in a clearly labelled **demo mode**: they validate, generate a brief ID and let the
visitor copy or download the brief. Nothing is sent.

### Deploying

`npm run build` writes the site to `/docs`. GitHub Pages → *Deploy from a branch* → `main` / `docs`.
For another host or a custom domain set `SITE_ORIGIN` and `BASE_PATH=/` before building.

## Быстрый старт (RU)

1. Установите Node.js 20+ (nodejs.org, версия LTS).
2. В Терминале в папке проекта: `npm install`, затем `npm run dev`.
3. Откройте http://127.0.0.1:4321/HYDRA-Digital-Studio/
4. Чтобы формы отправлялись вам, скопируйте `.env.example` в `.env`, впишите почту или Telegram и выполните `npm run build`.

## License

Code: MIT. Screenshots of demo projects belong to their respective demo repositories by the same author.
