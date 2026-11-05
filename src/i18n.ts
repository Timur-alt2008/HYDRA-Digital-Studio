/**
 * Build-time i18n. The static build renders every page once per locale.
 * Components call L(en, ru); English and Russian live inline in the code,
 * Ukrainian, German and Polish come from src/i18n-dict/<locale>.json, keyed by
 * the English string. A missing translation fails the build (see scripts/build.tsx).
 */
import uk from "./i18n-dict/uk.json";
import de from "./i18n-dict/de.json";
import pl from "./i18n-dict/pl.json";

export type Locale = "en" | "ru" | "uk" | "de" | "pl";
export const LOCALES: Locale[] = ["en", "uk", "ru", "de", "pl"];
export const LOCALE_INFO: Record<Locale, { label: string; name: string; og: string }> = {
  en: { label: "EN", name: "English", og: "en_US" },
  uk: { label: "UA", name: "Українська", og: "uk_UA" },
  ru: { label: "RU", name: "Русский", og: "ru_RU" },
  de: { label: "DE", name: "Deutsch", og: "de_DE" },
  pl: { label: "PL", name: "Polski", og: "pl_PL" },
};
type Dict = { site: Record<string, string>; client: Record<string, string> };
const DICTS: Partial<Record<Locale, Dict>> = { uk, de, pl } as Partial<Record<Locale, Dict>>;

let current: Locale = "en";
export const setLocale = (l: Locale) => { current = l; };
export const locale = (): Locale => current;

/** Strings that had no translation during this build — reported by the build script. */
export const missing = new Set<string>();

/** Pick the string for the active locale. */
export const L = (en: string, ru: string): string => {
  if (current === "en") return en;
  if (current === "ru") return ru;
  const hit = DICTS[current]?.site[en];
  if (hit === undefined) { missing.add(`${current}: ${en}`); return en; }
  return hit;
};

/** Client-side strings for the active locale (embedded into the page for uk/de/pl). */
export const clientDict = (): Record<string, string> | null => (current === "en" || current === "ru" ? null : DICTS[current]?.client || null);

/** URL prefix for a locale ("" for the default English site). */
export const localePrefix = (l: Locale = current) => (l === "en" ? "" : `${l}/`);
