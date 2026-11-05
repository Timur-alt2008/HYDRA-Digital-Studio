export type Category = "websites" | "redesign" | "bots" | "mini-apps" | "products";
export type Status = "Demo" | "Concept" | "Internal tool";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "websites", label: "Websites" },
  { id: "redesign", label: "Redesign" },
  { id: "bots", label: "Telegram Bots" },
  { id: "mini-apps", label: "Telegram Mini Apps" },
  { id: "products", label: "Digital Products" },
];

export type Project = {
  slug: string;
  title: string;
  client: string;
  categories: Category[];
  status: Status;
  year: number;
  summary: string;
  goal: string;
  approach: string;
  features: string[];
  stack: string[];
  /** Image keys in /img/projects (webp). */
  cover?: string;
  mobile?: string;
  extra?: { src: string; alt: string }[];
  /** Generated SVG cover for projects without screenshots. */
  art?: "bot-music" | "bot-market" | "miniapp-market" | "miniapp-booking";
  live?: string;
  repo?: string;
  before?: { src: string; label: string; live?: string };
  accent: string;
  featured?: boolean;
};

const GH = "https://timur-alt2008.github.io/";
const REPO = "https://github.com/Timur-alt2008/";

/**
 * Every project here is real work published on GitHub, or a concept described as such.
 * The businesses inside the demos are fictional, which is why their status is "Demo".
 */
export const PROJECTS: Project[] = [
  {
    slug: "barber-atelier",
    title: "Barber Atelier",
    client: "EXAMPLE — fictional barbershop",
    categories: ["websites", "redesign"],
    status: "Demo",
    year: 2026,
    summary: "A barbershop website built like an issue of a men's magazine: cover, manifesto, price list, profiles, lookbook and a booking ticket.",
    goal: "Replace the first, template-like version of the barbershop site with a concept that has its own voice and a booking flow people finish.",
    approach: "We treated the site as an editorial object — paper, ink and bottle green, monochrome photography, condensed and expanded Archivo with Instrument Serif and IBM Plex Mono — and turned every section into a page of the issue.",
    features: ["Interactive price list with a floating photo preview", "Expanding barber panels that pre-fill the booking", "Pinned horizontal lookbook with a keyboard- and swipe-friendly lightbox", "Booking ticket: service, barber, date, time slots, validation and a live summary (demo mode)", "Live opening status and weekly hours chart", "Reduced-motion support"],
    stack: ["HTML", "CSS", "Vanilla JavaScript", "No build step"],
    cover: "probarbershop",
    live: GH + "ProBarbershop-ForExample-For-my-Portfolio/",
    repo: REPO + "ProBarbershop-ForExample-For-my-Portfolio",
    before: { src: "barbershop-v1", label: "First version", live: GH + "EXAMPLE-Barbershop-for-Portfolio/" },
    accent: "#2f5d46",
    featured: true,
  },
  {
    slug: "coffee-house",
    title: "Coffee House & Bakery",
    client: "Example — fictional coffee house in Podil, Kyiv",
    categories: ["websites", "redesign"],
    status: "Demo",
    year: 2026,
    summary: "A five-page website for a European-style coffee house built around the idea of “coffee in your hands”.",
    goal: "Rebuild the original single-page coffee site into a full multi-page experience with a menu, story, gallery and table booking.",
    approach: "Warm rounded shapes, a barista's handwritten notes and a milk-to-chocolate palette, combined with genuinely useful interactions: a menu with search and deep links, and booking on a floor plan.",
    features: ["“Anatomy of a cup” — layers of espresso, water, milk and foam in real ratios", "Menu: 9 categories, 38 items, accessible tabs and search", "Table booking on a floor plan with capacity and time slots", "Live open/closed status and breakfast timer based on Kyiv time", "Gallery with filters and a lightbox", "Schema.org markup, sitemap and Open Graph"],
    stack: ["HTML", "CSS", "Vanilla JavaScript", "WebP/AVIF srcset"],
    cover: "procoffee",
    mobile: "procoffee-m",
    live: GH + "ProCoffee-For-Example-For-my-Portfolio/",
    repo: REPO + "ProCoffee-For-Example-For-my-Portfolio",
    before: { src: "coffee-v1", label: "First version", live: GH + "Example-coffee-for-Portfolio/" },
    accent: "#9a6a3a",
    featured: true,
  },
  {
    slug: "fitness-club",
    title: "Fitness Club Platform",
    client: "Example — fictional fitness club",
    categories: ["websites"],
    status: "Demo",
    year: 2026,
    summary: "A multi-page fitness club website with schedule, coaches, memberships, a member account and booking with live spot counts.",
    goal: "Show that a static site can behave like a real product: bookings, memberships and an account that respect business rules.",
    approach: "Hash routing and ES modules without a build step, plus a demo API layer that simulates latency, server-side validation, “fully booked” errors and double-submit protection.",
    features: ["Program explorer, 7-day schedule with filters and spots left", "Membership finder quiz, comparison table and promo codes", "Member account: freeze, cancellations, history (demo data)", "Demo API with idempotency keys and cancellation rules", "BMI and calorie calculators", "OpenStreetMap contact map"],
    stack: ["HTML", "CSS", "JavaScript (ES modules)", "Hash router", "JSON-LD"],
    cover: "fitness",
    mobile: "fitness-m",
    live: GH + "Fitness-For-Example-For-my-Portfolio/",
    repo: REPO + "Fitness-For-Example-For-my-Portfolio",
    accent: "#c8f04a",
    featured: true,
  },
  {
    slug: "cinema",
    title: "Cinema — Thriller & Horror",
    client: "Cinema Example — fictional cinema",
    categories: ["websites"],
    status: "Demo",
    year: 2026,
    summary: "A cinema website with films, showtimes, interactive seat selection, test checkout and e-tickets.",
    goal: "Design a dark, cinematic experience where buying a ticket stays effortless — on desktop and on a phone.",
    approach: "A psychological-thriller aesthetic with SVG posters and interiors, and a booking engine that generates showtimes, prices and seat occupancy.",
    features: ["17 films with filters, search and sorting", "Interactive seating plan with VIP seats and a 10-minute hold", "Checkout with promo codes and test payment", "E-ticket with QR code, SVG download and .ics calendar file", "Account with orders, refunds and favourites", "Dedicated mobile seat-map layout"],
    stack: ["HTML", "CSS", "JavaScript (ES modules)", "SVG"],
    cover: "cinema",
    mobile: "cinema-m",
    live: GH + "Cinema-For-Example-For-my-Portfolio/",
    repo: REPO + "Cinema-For-Example-For-my-Portfolio",
    accent: "#8e2a2a",
    featured: true,
  },
  {
    slug: "auto-service",
    title: "Auto Service",
    client: "Example Auto Service — fictional car service",
    categories: ["websites", "redesign"],
    status: "Demo",
    year: 2026,
    summary: "A dark premium car-service website rebuilt in React + TypeScript + Vite, with services, gallery, process timeline and booking.",
    goal: "Move the first static version to a component-based React code base and raise the visual level to “premium”.",
    approach: "React + TypeScript components, parallax hero, a service catalogue with detail windows, filtered gallery and a booking form — all demo data clearly labelled.",
    features: ["10 services with detail windows", "Gallery with filters and full-screen viewer", "Process timeline and animated counters", "Booking form with validation", "Contacts with a schematic map", "Static build published to GitHub Pages"],
    stack: ["React", "TypeScript", "Vite", "Node.js"],
    cover: "autoservice-v2",
    live: GH + "AutoServise-For-Example-For-my-Portfolio/",
    repo: REPO + "AutoServise-For-Example-For-my-Portfolio",
    before: { src: "autoservice-v1", label: "First version", live: GH + "example-auto-service-for-portfolio/" },
    accent: "#e2722f",
  },
  {
    slug: "premium-automotive",
    title: "Premium Automotive",
    client: "Example — fictional detailing studio and supercar rental",
    categories: ["websites"],
    status: "Demo",
    year: 2026,
    summary: "A multi-page site for a detailing studio with a rental collection of 14 real supercars and luxury cars.",
    goal: "Combine two businesses — detailing and rentals — in one coherent, fast catalogue with working booking logic.",
    approach: "A catalogue with URL-synced filters, car pages with spec readouts, a date-range booking calculator and a paint-layer diagram for detailing services.",
    features: ["Catalogue filters: brand, body, price range, power, seats", "Rental booking with live price, discounts and validation", "17 detailing services and 3 packages with comparison", "Before/after slider with mouse, touch and keyboard", "Page transitions and masked headline reveals", "Everything off for prefers-reduced-motion"],
    stack: ["HTML", "CSS", "JavaScript", "Node build scripts", "Playwright"],
    cover: "automotive",
    live: GH + "Example-Premium-Automotive-For-my-Portfolio/",
    repo: REPO + "Example-Premium-Automotive-For-my-Portfolio",
    accent: "#c9b98f",
  },
  {
    slug: "beauty-salon",
    title: "Quiet-Luxury Beauty Salon",
    client: "Beauty Example — fictional salon",
    categories: ["websites"],
    status: "Demo",
    year: 2026,
    summary: "A calm, editorial salon website with a service explorer, specialists' availability, booking and gift cards.",
    goal: "Make booking a beauty appointment feel as considered as the service itself.",
    approach: "Soft serif typography and arched imagery, with a booking flow that goes service → specialist → slot → details and ends with a calendar file.",
    features: ["Service menu with filters, search and a “visit plan” total", "Specialists with a 7-day availability strip", "Booking with add-ons, promo code and .ics file", "My visits with the 24-hour cancellation rule", "Gift cards with live preview", "Responsive from 320px, keyboard accessible"],
    stack: ["HTML", "CSS", "JavaScript (ES modules)"],
    cover: "beauty",
    live: GH + "Beauty-For-Example-For-my-Portfolio/",
    repo: REPO + "Beauty-For-Example-For-my-Portfolio",
    accent: "#8b6b53",
  },
  {
    slug: "design-intelligence",
    title: "HYDRA Design Intelligence",
    client: "HYDRA — our own research tool",
    categories: ["products"],
    status: "Internal tool",
    year: 2026,
    summary: "A website research system: it analyses public sites, extracts design and motion techniques, scores them for HYDRA and keeps a searchable reference library.",
    goal: "Research before pixels: collect proven techniques systematically, filter out other companies' business models and turn the rest into concrete design recommendations.",
    approach: "Python + Playwright open a site in four viewports, an in-page probe reads tokens, typography, components and motion, and a scoring engine sorts every idea into High priority, Inspiration or Rejected. A local web app manages the library.",
    features: ["URL validation with SSRF protection and robots.txt checks", "Desktop, laptop, tablet and mobile screenshots", "Design tokens, fonts, components and motion detection", "Six scores per idea and a design review checklist", "Library with search, filters, tags, notes and statuses", "Recommendation engine that generated this site's direction"],
    stack: ["Python", "Playwright", "Chromium", "Vanilla JS UI", "pytest"],
    cover: "hdi-recs",
    extra: [{ src: "hdi-ideas", alt: "Idea report: six scores, six answers and the design review checklist" }],
    repo: REPO + "HYDRA-Design-Intelligence",
    accent: "#ff4f1f",
    featured: true,
  },
  {
    slug: "booking-mini-app",
    title: "Booking Mini App",
    client: "Interface demo — fictional studio",
    categories: ["mini-apps"],
    status: "Demo",
    year: 2026,
    summary: "A Telegram Mini App interface for booking a time slot, with a working bot conversation beside it. Try it on the home page.",
    goal: "Show how a booking flow feels when it opens inside Telegram instead of a separate website.",
    approach: "Mini App screens follow Telegram's interface conventions — a main button, compact lists and the user's theme — while the bot handles reminders and quick actions.",
    features: ["Bot conversation with quick replies", "Service and slot selection", "Main-button confirmation pattern", "Booking summary returned to the chat"],
    stack: ["TypeScript", "Telegram Mini Apps SDK (target)", "Telegram Bot API (target)"],
    art: "miniapp-booking",
    accent: "#2aa3d9",
  },
  {
    slug: "music-recognition-bot",
    title: "Music Recognition Bot",
    client: "Concept",
    categories: ["bots"],
    status: "Concept",
    year: 2026,
    summary: "A Telegram bot that recognises a song from a voice message or audio clip and keeps a short history of what you found.",
    goal: "Shazam-style recognition without leaving the chat, with protection against spam.",
    approach: "aiogram handlers for voice and audio, a recognition service behind a clean interface, SQLite for each user's last 10 tracks and rate limiting.",
    features: ["Voice and audio file recognition", "History of the last 10 tracks", "Anti-spam rate limiting", "Inline buttons for sharing a result"],
    stack: ["Python", "aiogram", "SQLite"],
    art: "bot-music",
    accent: "#7a5cff",
  },
  {
    slug: "marketplace-bot",
    title: "Services Marketplace Bot",
    client: "Concept",
    categories: ["bots"],
    status: "Concept",
    year: 2026,
    summary: "A Telegram bot where customers post requests and service providers respond — orders, responses and notifications in one chat.",
    goal: "Connect customers and providers without a separate website or app.",
    approach: "aiogram with a relational schema and Alembic migrations; orders and deals have separate statuses so the logic stays clear.",
    features: ["Order creation with categories", "Provider responses and selection", "Status notifications", "Migrations with Alembic"],
    stack: ["Python", "aiogram", "SQLite", "Alembic"],
    art: "bot-market",
    accent: "#ff9f1c",
  },
  {
    slug: "hydra-marketplace",
    title: "HYDRA Marketplace Mini App",
    client: "Concept",
    categories: ["mini-apps"],
    status: "Concept",
    year: 2026,
    summary: "A services marketplace that runs as a full Telegram Mini App — the bot only launches it and sends notifications.",
    goal: "Give the marketplace a real interface inside Telegram: catalogue, orders, profiles and admin.",
    approach: "A monorepo with web, admin, API and shared packages; React + TypeScript + Vite on the client, Fastify and PostgreSQL with Prisma on the server. Payments stay behind a flag until later stages.",
    features: ["Mini App client with Telegram auth", "Separate order and deal statuses", "Admin panel", "Payment steps behind a feature flag"],
    stack: ["React", "TypeScript", "Vite", "Fastify", "PostgreSQL", "Prisma"],
    art: "miniapp-market",
    accent: "#00c2a8",
  },
];

export const countBy = (cat: Category) => PROJECTS.filter((p) => p.categories.includes(cat)).length;
