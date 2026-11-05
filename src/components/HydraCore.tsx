import React from "react";
import { href } from "../config";
import { getServices } from "../data/services";
import { L } from "../i18n";

/** Head anchor positions inside the 600×640 viewBox. */
export const HEADS = [
  { x: 96, y: 176, side: "left" },
  { x: 230, y: 66, side: "left" },
  { x: 372, y: 70, side: "right" },
  { x: 450, y: 206, side: "right" },
] as const;
export const CORE = { x: 300, y: 590 };
const short = (id: string) => ({ web: L("Web", "Веб"), redesign: L("Redesign", "Редизайн"), telegram: "Telegram", products: L("Products", "Продукты") } as Record<string, string>)[id];

export const neckPath = (hx: number, hy: number, cx = CORE.x, cy = CORE.y) =>
  `M ${cx} ${cy} C ${cx} ${cy - 190}, ${hx} ${hy + 230}, ${hx} ${hy + 22}`;

/**
 * The brand diagram: one core feeding four heads (the four services).
 * Static SVG that works without JavaScript; the client script adds the
 * draw-in, the data pulses and the pointer-following necks.
 */
export function HydraCore() {
  return (
    <div className="core" data-core>
      <svg viewBox="0 0 600 640" role="group" aria-label={L("T-HYDRA: one core, four heads — Web Development, Website Redesign, Telegram Development, Custom Digital Products", "T-HYDRA: одно ядро, четыре головы — веб-разработка, редизайн, Telegram-разработка, цифровые продукты")}>
        <g aria-hidden="true">
          {HEADS.map((h, i) => (
            <path key={`n${i}`} className="neck" data-neck={i} d={neckPath(h.x, h.y)} style={{ ["--n" as string]: i }} />
          ))}
          {HEADS.map((h, i) => (
            <path key={`f${i}`} className="neck-flow" data-flow={i} d={neckPath(h.x, h.y)} style={{ ["--n" as string]: i }} />
          ))}
          <circle className="core__ring" cx={CORE.x} cy={CORE.y} r="18" />
          <circle className="core__glow" cx={CORE.x} cy={CORE.y} r="46" />
          <circle className="core__body" cx={CORE.x} cy={CORE.y} r="12" />
          <text className="core__label" x={CORE.x + 24} y={CORE.y + 4}>{L("ONE CORE", "ОДНО ЯДРО")}</text>
        </g>
        {getServices().map((s, i) => {
          const h = HEADS[i];
          const left = h.side === "left";
          const tx = left ? h.x - 30 : h.x + 30;
          return (
            <a key={s.id} className="head" href={href(`services/#${s.id}`)} data-head={i} aria-label={`${s.index} ${s.title}`} style={{ ["--n" as string]: i }}>
              <g data-head-g={i} transform={`translate(0 0)`}>
                <circle className="head__ring" cx={h.x} cy={h.y} r="22" />
                <circle className="head__dot" cx={h.x} cy={h.y} r="5" />
                <text className="head__index" x={tx} y={h.y - 8} textAnchor={left ? "end" : "start"}>{s.index}</text>
                <text className="head__label" x={tx} y={h.y + 14} textAnchor={left ? "end" : "start"}>{short(s.id)}</text>
              </g>
            </a>
          );
        })}
      </svg>
    </div>
  );
}
