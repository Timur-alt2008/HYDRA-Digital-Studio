/** Client-side locale helper: the page language is set at build time on <html lang>. */
export const isRu = () => document.documentElement.lang === "ru";
export const t = (en: string, ru: string) => (isRu() ? ru : en);
