# HYDRA — design concept

## 1. Idea: one core, four heads

HYDRA does four things: **Web Development, Website Redesign, Telegram Development and Custom Digital Products**.
The brand turns that focus into its main metaphor. A hydra has one body and several heads, and grows new
ones when a head is cut off. For the studio this means:

- **one core** — research, design and engineering working as one team on one code base;
- **four heads** — the four services, each growing from that core;
- **regrowth** — a limitation in a brief is a prompt for a better solution, not a stop sign.

The metaphor becomes the hero diagram on the home page: four curved necks rise from a vermilion core to four
heads labelled 01–04. Each head is a link to its service, pulses of light travel from the core to the heads,
and on desktop the necks lean towards the pointer. The same diagram is the logo mark, the favicon, the Open Graph
image and the 404 page ("Cut off. Grow back.").

## 2. Research → decisions

The direction came from HYDRA Design Intelligence (separate repository). Six public sites were analysed:
Lusion (creative development), Locomotive (agency), Linear (SaaS), darkroom.engineering (development studio),
Brittany Chiang (developer portfolio) and telegram.org (Telegram product). An e-commerce reference was attempted
and skipped; that run exposed a bug in the robots.txt wildcard parser, which was fixed and covered by a test.

| Technique (seen on) | Decision | Where in HYDRA |
| --- | --- | --- |
| Poster-scale display type (darkroom, Locomotive) | Implemented | Hero, page titles, CTA band, footer mark |
| Monospace technical labels (darkroom, Linear, Lusion) | Implemented | Indices 01–04, labels, form steps |
| Square geometry, 0 px radius (Locomotive, darkroom) | Implemented | Buttons, frames, chips, inputs |
| Scroll reveals with one shared motion vocabulary (4 sites) | Implemented | `data-reveal`, split-line headings, clip reveals |
| Product UI as the hero visual (Linear) | Adapted | Interactive Telegram bot + Mini App demo instead of a picture |
| Sticky storytelling (darkroom, Linear) | Implemented | Process page: pinned stage number + progress bar |
| Contrast-adaptive header (blend modes on 2 sites) | Adapted | Header reads the theme of the section beneath it (no blend-mode artefacts) |
| Reduced-motion support (4 of 6) | Implemented everywhere | CSS + JS, tested |
| Accessibility baseline (Brittany Chiang) | Implemented | Skip link, landmarks, focus states, keyboard demos |
| Inertia smooth scrolling (Lenis on 2 sites) | Rejected | Native scrolling is more accessible and costs nothing |
| WebGL 3D hero (Lusion) | Inspiration only | Too heavy for the value; the SVG core carries the brand idea |
| Custom cursor | Rejected | Usability cost |
| Glass panels everywhere | Rejected — glass only where content scrolls beneath | Overused trend, readability |

Nothing was copied: no layouts, assets or code from references — only techniques, rebuilt in HYDRA's own system.

## 3. Visual system

- **Colour (v2 — "white, soft blue, deep navy").** Light surfaces dominate: soft white `#F4F6FA` and ice
  `#E9EEF6`, with light blue `#DCE5F2` for tints. Deep navy `#111722` (with `#172033`, `#1F2B42`, `#27364D`)
  carries the contrast sections, hero, page heads and footer. Soft blue `#7298D8` is the only accent — buttons'
  arrow badges, links, indices, graphics, interactive states, glossy gradient type — never long text. Small blue
  text on light uses `#4A6FB0` (AA); muted text is `#536783` on light and `#A9BBD6` on dark.
- **Gloss, carefully.** Dark sections get soft radial blue light spots; light sections stay clean with very soft
  shadows. Glass (blur) is used only where content scrolls beneath: the scrolled header, sticky service nav,
  before/after tags and handle, the contact card on dark. Large accent words use a blue gradient "reflection".
  No neon outlines, no flashing.
- **Type.** Manrope 700 for headings (sentence case, tight tracking), Inter for text, JetBrains Mono for labels and
  indices. All three include Cyrillic, so the Russian version uses the same system.
- **Shape.** Pill buttons with a round arrow badge (navy pill on light, white pill on dark), 12–28 px radii on
  cards, fields and frames, pill chips, filters and choices.
- **Grid.** 12 columns, asymmetric placements (8/4, 5/7, offset project tiles), generous section rhythm
  `clamp(88px, 13vw, 200px)`.
- **Components.** Head rows (services as an index, not cards), spec sheet table, browser frames for real
  screenshots, phone frames, before/after slider, pinned process, project builder tiles.

## 4. Motion principles

1. Motion explains structure: the core feeds the heads, lines draw in, the process bar fills.
2. One easing (`cubic-bezier(.22,.8,.24,1)`) and slow, soft durations (280 / 700 / 1200 ms); reveals fade, rise and un-blur.
3. Transform, opacity, filter and clip-path only — no layout animation.
4. Page-to-page: cross-document View Transitions (no JS router).
5. `prefers-reduced-motion: reduce` switches everything off; content never depends on animation (no-JS safe).

## 5. Engineering decisions

- Pages are React + TypeScript components rendered to static HTML at build time (`react-dom/server`).
  Visitors download **no framework**: a 24 KB (9 KB gzipped) TypeScript bundle adds behaviour progressively.
- Content lives in `src/data` (services, projects, process, FAQ, capabilities), so pages never hard-code it.
- GitHub Pages hosting from `/docs`; base path configurable with `BASE_PATH`.
- Forms run in three delivery modes (endpoint, email, Telegram) and a labelled demo mode when no inbox is configured.
- Quality gate: `npm test` runs Playwright on 9 viewports for every page plus interaction tests.

## 6. Honesty rules applied

- Every portfolio item is labelled **Demo**, **Concept** or **Internal tool**; the businesses in the demos are fictional.
- No invented history, team size, clients, awards or numbers.
- Services outside the four directions are listed as *not offered*.
