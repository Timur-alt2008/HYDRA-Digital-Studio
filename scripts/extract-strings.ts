// Collects every L(en, ru) / t(en, ru) / tr(en, ru) pair from the source with the TypeScript AST.
// Output: src/i18n-dict/_source.json  { site: {en: ru}, client: {en: ru} }
import ts from "typescript";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(p) ? [p] : []; });
const out: { site: Record<string, string>; client: Record<string, string> } = { site: {}, client: {} };
const nonLiteral: string[] = [];
const text = (n: ts.Node): string | null => {
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
  return null;
};
for (const file of walk("src")) {
  const src = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const isClient = file.includes("/client/");
  const visit = (n: ts.Node) => {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && ["L", "t", "tr"].includes(n.expression.text) && n.arguments.length >= 2) {
      const en = text(n.arguments[0]); const ru = text(n.arguments[1]);
      if (en !== null && ru !== null) (isClient ? out.client : out.site)[en] = ru;
      else nonLiteral.push(`${file}:${src.getLineAndCharacterOfPosition(n.getStart()).line + 1} ${n.getText().slice(0, 90)}`);
    }
    ts.forEachChild(n, visit);
  };
  visit(src);
}
writeFileSync("src/i18n-dict/_source.json", JSON.stringify(out, null, 1));
console.log(`site: ${Object.keys(out.site).length}, client: ${Object.keys(out.client).length}`);
if (nonLiteral.length) console.log("template / non-literal calls:\n" + nonLiteral.join("\n"));
