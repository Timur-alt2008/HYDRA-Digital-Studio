import { type Locale, localePrefix } from "./i18n";

/**
 * Site-wide configuration. Everything that differs between environments lives here.
 * Values can be overridden at build time with environment variables (see .env.example).
 */
const env = (key: string, fallback: string): string => {
  const v = typeof process !== "undefined" ? process.env[key] : undefined;
  return v === undefined ? fallback : v;
};

export const SITE = {
  name: "T-HYDRA",
  legalName: "T-HYDRA Digital Studio",
  tagline: "We build digital experiences.",
  slogan: "Think beyond. Build without limits.",
  description:
    "T-HYDRA is an independent digital development studio: websites from scratch, website redesign, Telegram bots and Mini Apps, and custom digital products — from first idea to launch.",
  /** Public origin, without trailing slash. */
  origin: env("SITE_ORIGIN", "https://timur-alt2008.github.io"),
  /** Path prefix the site is served from (GitHub Pages project site). Must start and end with "/". */
  base: env("BASE_PATH", "/HYDRA-Digital-Studio/"),
  locale: "en",
  year: 2026,
  github: "https://github.com/Timur-alt2008",
  /**
   * Where enquiries go. Leave empty until a real inbox exists:
   *  - FORM_ENDPOINT: any JSON-accepting form backend (e.g. Formspree, a serverless function);
   *  - CONTACT_EMAIL: opens the visitor's mail app with the brief pre-filled;
   *  - CONTACT_TELEGRAM: a Telegram username without "@".
   * When all three are empty the forms run in clearly labelled demo mode:
   * the brief is validated and can be copied or downloaded, nothing is sent.
   */
  formEndpoint: env("FORM_ENDPOINT", ""),
  contactEmail: env("CONTACT_EMAIL", ""),
  contactTelegram: env("CONTACT_TELEGRAM", ""),
  /**
   * Accounts ("My account": sign-up, sign-in, the visitor's requests and their status).
   * With a Supabase project configured (see setup/ACCOUNTS-SETUP.md) accounts are real and requests from
   * signed-in visitors reach the studio. Both values are public by design (row-level security protects the data).
   * Empty → clearly labelled demo mode: accounts and requests live only in the visitor's browser.
   */
  /** Experimental copy: hide it from search engines so it never competes with the main site. */
  lab: env("LAB", "0") === "1", // main site; the T-HYDRA-Lab copy builds with LAB=1
  supabaseUrl: env("SUPABASE_URL", ""),
  supabaseAnonKey: env("SUPABASE_ANON_KEY", ""),
} as const;

/** Build an internal page URL that respects the base path and the active locale. */
export const href = (path = ""): string => {
  const clean = path.replace(/^\/+/, "");
  return SITE.base + localePrefix() + clean;
};

/** URL of a static asset (images, CSS, JS) — never localised. */
export const asset = (path: string): string => SITE.base + path.replace(/^\/+/, "");

/** URL of the same page in another locale. */
export const hrefFor = (l: Locale, path = ""): string => SITE.base + localePrefix(l) + path.replace(/^\/+/, "");

/** Absolute URL (for canonical / Open Graph). */
export const absolute = (path = ""): string => SITE.origin + href(path);
export const absoluteFor = (l: Locale, path = ""): string => SITE.origin + hrefFor(l, path);
export const absoluteAsset = (path: string): string => SITE.origin + asset(path);

export const contactMode = (): "endpoint" | "email" | "telegram" | "demo" =>
  SITE.formEndpoint ? "endpoint" : SITE.contactEmail ? "email" : SITE.contactTelegram ? "telegram" : "demo";

export const accountMode = (): "live" | "demo" => (SITE.supabaseUrl && SITE.supabaseAnonKey ? "live" : "demo");
