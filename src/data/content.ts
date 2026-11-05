export const PROCESS = [
  {
    id: "idea",
    title: "Idea",
    lead: "We start with your goal, not with a layout.",
    text: "A short call or a filled Project Builder. We clarify what success looks like, who the users are, what already exists and what the constraints are.",
    output: ["Project goal in one sentence", "Scope of the first release", "Questions and risks"],
  },
  {
    id: "research",
    title: "Research",
    lead: "Evidence before pixels.",
    text: "We study your current product, your competitors and strong references with HYDRA Design Intelligence — keeping techniques that fit and rejecting the rest.",
    output: ["Reference library with scored ideas", "UX and technical audit (for redesigns)", "Content and feature map"],
  },
  {
    id: "design",
    title: "Design",
    lead: "Structure first, style second.",
    text: "Information architecture and key flows come first, then the visual system: typography, colour, grid and motion — designed directly for the browser.",
    output: ["Sitemap and user flows", "Visual system and key screens", "Motion principles"],
  },
  {
    id: "development",
    title: "Development",
    lead: "Clean, typed, maintainable code.",
    text: "We build in small, reviewable steps with real content. Data is centralised, components are reusable, and every interactive element works with a keyboard.",
    output: ["Working staging version", "Reusable components", "Integrations and admin tools"],
  },
  {
    id: "testing",
    title: "Testing",
    lead: "Nine screen sizes, every link, every form.",
    text: "Automated browser tests check pages, links, forms and menus from 360px phones to 1920px monitors, plus performance and accessibility checks.",
    output: ["Playwright test report", "Performance and accessibility pass", "Fix list closed"],
  },
  {
    id: "launch",
    title: "Launch",
    lead: "Launch is the beginning.",
    text: "Deployment, domain, analytics if you need it, documentation and a handover session. After launch we stay available for the next iteration.",
    output: ["Production deployment", "Documentation and access", "Plan for the next iteration"],
  },
];

export const CAPABILITIES = [
  { area: "Interfaces", detail: "Semantic HTML, modern CSS (grid, container queries, view transitions), TypeScript, React", tag: "Front-end" },
  { area: "Motion", detail: "CSS and SVG animation, scroll-driven reveals, GSAP when a timeline needs it — always with reduced-motion fallbacks", tag: "Motion" },
  { area: "Applications", detail: "Next.js, React + Vite, routing, state, forms and validation, API integration", tag: "Web apps" },
  { area: "Back-end", detail: "Node.js, Python, REST APIs, SQLite and PostgreSQL, auth and admin tools", tag: "Server" },
  { area: "Telegram", detail: "Bots on aiogram and the Bot API, Mini Apps on the WebApp SDK, payments-ready architecture", tag: "Telegram" },
  { area: "Quality", detail: "Playwright end-to-end tests on nine viewports, linting, Lighthouse and accessibility checks", tag: "QA" },
  { area: "Performance", detail: "Static generation where possible, image optimisation, lazy loading, font strategy", tag: "Speed" },
  { area: "Research", detail: "Our own Design Intelligence tool for references, design tokens and motion analysis", tag: "R&D" },
];

export const TECHNOLOGIES = {
  "Front-end": ["HTML", "CSS", "TypeScript", "React", "Next.js", "Vite"],
  Motion: ["CSS animation", "SVG", "View Transitions", "GSAP", "Motion"],
  "Back-end": ["Node.js", "Python", "Fastify", "REST", "SQLite", "PostgreSQL", "Prisma"],
  Telegram: ["Bot API", "aiogram", "Mini Apps SDK"],
  Quality: ["Playwright", "pytest", "Lighthouse", "axe"],
};

export const FAQ = [
  { q: "What exactly does HYDRA do?", a: "Four things: websites from scratch, redesign of existing websites, Telegram bots and Mini Apps, and custom digital products such as web tools and dashboards. Design and UI/UX are part of every project." },
  { q: "What don't you do?", a: "We don't sell SEO promotion, advertising, social media management, video production, standalone branding or native mobile apps. We prefer to be excellent at four things." },
  { q: "Can you take over a project that someone else started?", a: "Yes. HYDRA can join at any stage — an idea, a half-built product or a live site that needs a redesign. We start with an audit of what exists." },
  { q: "Which projects in the portfolio are real clients?", a: "The portfolio shows our own demo projects and concepts. Every one of them is labelled Demo, Concept or Internal tool, and the businesses inside the demos are fictional. The code is real and published on GitHub." },
  { q: "How do you estimate price and timeline?", a: "After the Project Builder or a short call we send a scoped proposal with a fixed first release. The budget range you pick in the builder helps us suggest the right scope." },
  { q: "Will I be able to edit the site myself?", a: "Yes, if you need it. We can connect a CMS or build a simple admin, and we hand over documentation for everything we build." },
  { q: "Do you work with international clients?", a: "Yes. HYDRA works remotely; the whole process — calls, files and reviews — runs online." },
];
