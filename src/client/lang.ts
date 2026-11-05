/** Client-side locale helper: the page language is set at build time on <html lang>.
 *  English and Russian are inline; Ukrainian, German and Polish come from a JSON
 *  dictionary the build embeds in the page (#hydra-i18n), keyed by the English text. */
let dict: Record<string, string> | null | undefined;
const lang = () => document.documentElement.lang;
const getDict = () => {
  if (dict === undefined) {
    const el = document.getElementById("hydra-i18n");
    try { dict = el ? JSON.parse(el.textContent || "{}") : null; } catch { dict = null; }
  }
  return dict;
};
export const isRu = () => lang() === "ru";
export const t = (en: string, ru: string, vars?: Record<string, string | number>) => {
  const l = lang();
  let s = l === "ru" ? ru : l === "en" ? en : getDict()?.[en] ?? en;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
};
