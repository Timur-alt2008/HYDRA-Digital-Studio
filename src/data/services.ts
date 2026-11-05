export type Service = {
  id: "web" | "redesign" | "telegram" | "products";
  index: string;
  title: string;
  short: string;
  headline: string;
  intro: string;
  includes: string[];
  deliverables: string[];
  stack: string[];
  fits: string[];
};

/** The four heads of HYDRA. Nothing outside these four is offered. */
export const SERVICES: Service[] = [
  {
    id: "web",
    index: "01",
    title: "Web Development",
    short: "Websites built from scratch — landing pages to multi-page platforms and online stores.",
    headline: "From a blank page to a production website.",
    intro:
      "We design and engineer websites without templates: the structure, the interface and the code are made for one project and one audience. You get a fast, responsive, accessible site that is easy to grow.",
    includes: ["Landing pages", "Corporate websites", "Multi-page websites", "Online stores", "Individual web projects", "Turnkey development"],
    deliverables: ["Information architecture and wireframes", "Interface design in the browser", "Responsive front-end, 320px to wide screens", "Forms, filters, booking and other working logic", "SEO basics: meta, structured data, sitemap", "Deployment and handover"],
    stack: ["HTML · CSS · TypeScript", "React · Next.js · Vite", "Node.js", "Playwright testing"],
    fits: ["You are launching a product, service or company", "You need a site that converts, not a brochure", "You want a site you can extend later"],
  },
  {
    id: "redesign",
    index: "02",
    title: "Website Redesign",
    short: "A complete rework of an existing site — design, structure, interface and technology.",
    headline: "Keep what works. Rebuild everything that doesn't.",
    intro:
      "Redesign starts with an audit, not with a mood board. We study how the current site is used, what slows it down and where visitors get lost — then rebuild the structure, interface and code around that.",
    includes: ["Full visual redesign", "New structure and navigation", "Interface improvements", "Modernised functionality", "Responsive adaptation", "Technical update and speed"],
    deliverables: ["UX and technical audit", "New information architecture", "Redesigned interface and content blocks", "Migration of existing content", "Performance and accessibility fixes", "Before / after comparison"],
    stack: ["Audit with HYDRA Design Intelligence", "Lighthouse · Core Web Vitals", "Modern front-end stack", "Redirect and SEO safety"],
    fits: ["The site looks outdated or breaks on phones", "Visitors do not find what they need", "The code base is hard to change"],
  },
  {
    id: "telegram",
    index: "03",
    title: "Telegram Development",
    short: "Telegram bots and Mini Apps — orders, automation, user systems and integrations.",
    headline: "Products that live where your customers already chat.",
    intro:
      "We build Telegram bots that take orders, answer and automate routine work, and Mini Apps — full web interfaces that open inside Telegram with the user's account already in place.",
    includes: ["Telegram bots", "Telegram Mini Apps", "Interactive Telegram interfaces", "Ordering bots", "Automation", "User systems and integrations"],
    deliverables: ["Conversation and screen flows", "Bot logic, menus and inline keyboards", "Mini App interface on the Telegram WebApp SDK", "Admin tools and notifications", "Database and integrations", "Hosting and launch"],
    stack: ["Python · aiogram", "Node.js · TypeScript", "Telegram Bot API · Mini Apps SDK", "SQLite · PostgreSQL"],
    fits: ["Your clients already message you in Telegram", "You want orders or bookings without a separate app", "Routine requests take your team's time"],
  },
  {
    id: "products",
    index: "04",
    title: "Custom Digital Products",
    short: "Web applications, digital tools and non-standard interfaces built around one idea.",
    headline: "When the idea does not fit a template.",
    intro:
      "Some ideas need their own product: an internal tool, a calculator, a dashboard, a configurator or an interface nobody has built yet. We turn the idea into a working web product — scoped, designed, engineered and tested.",
    includes: ["Custom web applications", "Digital tools", "Non-standard web interfaces", "Individual functional solutions", "Ideas built from zero"],
    deliverables: ["Product scoping and user flows", "Prototype to validate the idea", "Interface and data design", "Front-end and back-end engineering", "Automated tests", "Documentation and handover"],
    stack: ["TypeScript · React", "Node.js · Python", "REST APIs · SQLite · PostgreSQL", "Playwright"],
    fits: ["You have an idea and need it working", "Spreadsheets and manual steps no longer scale", "You need a tool your team will actually use"],
  },
];

/** What HYDRA explicitly does not offer — focus is part of the brand. */
export const NOT_OFFERED = ["SEO promotion", "Paid advertising", "Social media management", "Video production", "Branding as a separate service", "Native mobile apps"];
