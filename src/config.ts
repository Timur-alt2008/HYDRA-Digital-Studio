/**
 * Site-wide configuration. Everything that differs between environments lives here.
 * Values can be overridden at build time with environment variables (see .env.example).
 */
const env = (key: string, fallback: string): string => {
  const v = typeof process !== "undefined" ? process.env[key] : undefined;
  return v === undefined ? fallback : v;
};

export const SITE = {
  name: "HYDRA",
  legalName: "HYDRA Digital Studio",
  tagline: "We build digital experiences.",
  slogan: "Think beyond. Build without limits.",
  description:
    "HYDRA is an independent digital development studio: websites from scratch, website redesign, Telegram bots and Mini Apps, and custom digital products — from first idea to launch.",
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
} as const;

/** Build an internal URL that respects the base path. */
export const href = (path = ""): string => {
  const clean = path.replace(/^\/+/, "");
  return SITE.base + clean;
};

/** Absolute URL (for canonical / Open Graph). */
export const absolute = (path = ""): string => SITE.origin + href(path);

export const contactMode = (): "endpoint" | "email" | "telegram" | "demo" =>
  SITE.formEndpoint ? "endpoint" : SITE.contactEmail ? "email" : SITE.contactTelegram ? "telegram" : "demo";
