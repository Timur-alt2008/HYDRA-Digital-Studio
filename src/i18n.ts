/**
 * Minimal build-time i18n. The static build renders every page once per locale;
 * components call L(en, ru) and read the active locale set by the build script.
 */
export type Locale = "en" | "ru";
export const LOCALES: Locale[] = ["en", "ru"];

let current: Locale = "en";
export const setLocale = (l: Locale) => { current = l; };
export const locale = (): Locale => current;

/** Pick the string for the active locale. */
export const L = (en: string, ru: string): string => (current === "ru" ? ru : en);

/** URL prefix for a locale ("" for the default English site). */
export const localePrefix = (l: Locale = current) => (l === "ru" ? "ru/" : "");
