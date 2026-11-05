import React from "react";
import { L } from "../i18n";

/* Original vector artwork for projects without screenshots and for the service pages.
   Everything is drawn from primitives — no stock imagery, no third-party assets. */

const Bubble = ({ x, y, w, h, me, lines = 2 }: { x: number; y: number; w: number; h: number; me?: boolean; lines?: number }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="14" fill={me ? "#5524a8" : "#160d33"} />
    {Array.from({ length: lines }).map((_, i) => (
      <rect key={i} x={x + 14} y={y + 14 + i * 14} width={(w - 28) * (i === lines - 1 ? 0.6 : 1)} height="6" rx="3" fill={me ? "#d1b8ff" : "#6b5a8e"} />
    ))}
  </g>
);

function PhoneShell({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <g>
      <rect x="290" y="40" width="220" height="420" rx="34" fill="#0b0720" stroke="#25134d" />
      <rect x="300" y="50" width="200" height="400" rx="26" fill="#0b0720" />
      <rect x="300" y="50" width="200" height="56" rx="26" fill="#120a2b" />
      <rect x="300" y="80" width="200" height="26" fill="#120a2b" />
      <circle cx="326" cy="80" r="13" fill={accent} />
      <rect x="346" y="72" width="70" height="7" rx="3" fill="#f2e9ff" />
      <rect x="346" y="84" width="44" height="5" rx="2.5" fill="#a08fc4" />
      {children}
    </g>
  );
}

export function ProjectArt({ kind, accent, title }: { kind: string; accent: string; title: string }) {
  const bg = (
    <>
      <rect width="800" height="500" fill="#160d33" />
      <g stroke="rgba(255,255,255,0.06)">
        {Array.from({ length: 16 }).map((_, i) => <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />)}
        {Array.from({ length: 10 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />)}
      </g>
    </>
  );
  let body: React.ReactNode = null;
  if (kind === "bot-music") {
    body = (
      <>
        <PhoneShell accent={accent}>
          <Bubble x={312} y={120} w={140} h={44} />
          <g>
            <rect x={380} y={176} width={108} height={40} rx="14" fill="#5524a8" />
            {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={392 + i * 6} y={196 - [6, 10, 14, 8, 16, 12, 6, 14, 10, 4, 12, 8, 14, 6][i] / 2} width="3" height={[6, 10, 14, 8, 16, 12, 6, 14, 10, 4, 12, 8, 14, 6][i]} fill="#d1b8ff" />)}
          </g>
          <rect x={312} y={228} width={160} height={110} rx="14" fill="#160d33" />
          <rect x={324} y={240} width={60} height={60} fill={accent} />
          <circle cx={354} cy={270} r="16" fill="#0b0720" /><circle cx={354} cy={270} r="4" fill={accent} />
          <rect x={392} y={246} width={68} height="7" rx="3" fill="#f2e9ff" />
          <rect x={392} y={260} width={48} height="6" rx="3" fill="#6b5a8e" />
          <rect x={324} y={310} width={136} height="18" rx="6" fill="#25134d" />
          <Bubble x={312} y={350} w={120} h={30} lines={1} />
        </PhoneShell>
        <g fill="none" stroke={accent} strokeWidth="2">
          <circle cx="160" cy="250" r="40" /><circle cx="160" cy="250" r="72" opacity="0.6" /><circle cx="160" cy="250" r="104" opacity="0.3" /><circle cx="160" cy="250" r="136" opacity="0.15" />
        </g>
        <rect x="150" y="240" width="20" height="20" fill={accent} />
      </>
    );
  } else if (kind === "bot-market") {
    body = (
      <>
        <PhoneShell accent={accent}>
          <Bubble x={312} y={120} w={150} h={58} lines={3} />
          <g>
            {["New request", "My orders", "Responses", "Profile"].map((t, i) => (
              <g key={t}><rect x={312 + (i % 2) * 90} y={192 + Math.floor(i / 2) * 40} width={86} height={34} rx="8" fill="#25134d" /><rect x={326 + (i % 2) * 90} y={206 + Math.floor(i / 2) * 40} width={56} height="6" rx="3" fill="#d1b8ff" /></g>
            ))}
          </g>
          <Bubble x={360} y={290} w={128} h={44} me />
          <Bubble x={312} y={346} w={150} h={58} lines={3} />
        </PhoneShell>
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${70 + i * 18} ${120 + i * 70})`}>
              <rect width="180" height="56" fill="#160d33" stroke="rgba(255,255,255,0.25)" />
              <rect x="14" y="14" width="28" height="28" fill={i === 1 ? accent : "#25134d"} stroke={accent} />
              <rect x="54" y="18" width="90" height="7" fill="#f2e9ff" /><rect x="54" y="32" width="60" height="6" fill="#6b5a8e" />
            </g>
          ))}
          <path d="M250 175 C 275 175, 270 240, 300 240" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="6 6" />
        </g>
      </>
    );
  } else if (kind === "miniapp-market" || kind === "miniapp-booking") {
    const booking = kind === "miniapp-booking";
    body = (
      <>
        <PhoneShell accent={accent}>
          <rect x="300" y="106" width="200" height="344" fill="#f3f4f6" />
          <rect x="312" y="120" width="100" height="10" rx="3" fill="#111" />
          {booking ? (
            <>
              {[0, 1, 2].map((i) => <g key={i}><rect x="312" y={142 + i * 44} width="176" height="36" rx="10" fill="#fff" stroke={i === 0 ? accent : "#e3e5e8"} strokeWidth={i === 0 ? 2 : 1} /><rect x="324" y={156 + i * 44} width="80" height="7" rx="3" fill="#333" /><rect x="440" y={156 + i * 44} width="36" height="7" rx="3" fill="#999" /></g>)}
              {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={312 + (i % 3) * 60} y={284 + Math.floor(i / 3) * 34} width="54" height="28" rx="8" fill={i === 4 ? accent : "#fff"} stroke="#e3e5e8" />)}
            </>
          ) : (
            <>
              {[0, 1, 2, 3].map((i) => <g key={i}><rect x={312 + (i % 2) * 90} y={142 + Math.floor(i / 2) * 110} width="84" height="100" rx="10" fill="#fff" stroke="#e3e5e8" /><rect x={320 + (i % 2) * 90} y={150 + Math.floor(i / 2) * 110} width="68" height="48" rx="6" fill={i === 0 ? accent : "#dfe3e8"} /><rect x={320 + (i % 2) * 90} y={208 + Math.floor(i / 2) * 110} width="56" height="6" rx="3" fill="#333" /><rect x={320 + (i % 2) * 90} y={220 + Math.floor(i / 2) * 110} width="36" height="6" rx="3" fill="#999" /></g>)}
            </>
          )}
          <rect x="312" y="400" width="176" height="36" rx="10" fill={accent} />
          <rect x="360" y="415" width="80" height="7" rx="3" fill="#fff" />
        </PhoneShell>
        <g fill="none" stroke="rgba(255,255,255,0.5)">
          <rect x="70" y="140" width="160" height="220" stroke={accent} strokeWidth="2" />
          <line x1="70" y1="180" x2="230" y2="180" />
          <text x="84" y="166" fill="#f2e9ff" stroke="none" style={{ font: "500 12px monospace" }}>{booking ? "slots.json" : "api / orders"}</text>
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="86" y={196 + i * 30} width={[120, 90, 110, 70, 100][i]} height="8" fill="rgba(255,255,255,0.35)" stroke="none" />)}
          <path d="M230 250 H 290" stroke={accent} strokeWidth="2" strokeDasharray="5 5" />
        </g>
      </>
    );
  }
  return (
    <svg viewBox="0 0 800 500" role="img" aria-label={`${title} — ${L("illustration", "иллюстрация")}`} preserveAspectRatio="xMidYMid slice">
      {bg}
      {body}
      <text x="40" y="460" fill="#a08fc4" style={{ font: "500 13px 'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>{L("CONCEPT ILLUSTRATION", "КОНЦЕПТ-ИЛЛЮСТРАЦИЯ")}</text>
    </svg>
  );
}

/** Service visuals: each head of HYDRA gets its own composition. */
export function ServiceArt({ id }: { id: string }) {
  if (id === "web") {
    return (
      <svg viewBox="0 0 400 400" aria-hidden="true">
        <rect className="bx" x="40" y="60" width="300" height="230" />
        <line className="ln" x1="40" y1="84" x2="340" y2="84" />
        <rect className="fl" x="60" y="104" width="120" height="16" />
        <rect className="bx" x="60" y="132" width="180" height="8" /><rect className="bx" x="60" y="148" width="140" height="8" />
        <rect className="bx" x="60" y="180" width="80" height="90" /><rect className="bx" x="150" y="180" width="80" height="90" /><rect className="bx" x="240" y="180" width="80" height="90" />
        <rect className="bx" x="80" y="110" width="290" height="230" style={{ opacity: 0.35 }} />
        <path className="hl" d="M40 360 H340" />
        <text x="40" y="384">320</text><text x="300" y="384">1920 PX</text>
        <text x="40" y="44">{L("01 / FROM SCRATCH", "01 / С НУЛЯ")}</text>
      </svg>
    );
  }
  if (id === "redesign") {
    return (
      <svg viewBox="0 0 400 400" aria-hidden="true">
        <g transform="rotate(-4 160 200)"><rect className="bx" x="40" y="80" width="200" height="240" style={{ opacity: 0.5 }} /><rect className="ln" x="56" y="100" width="168" height="40" /><rect className="ln" x="56" y="150" width="168" height="12" /><rect className="ln" x="56" y="170" width="120" height="12" /><rect className="ln" x="56" y="200" width="80" height="80" /><rect className="ln" x="144" y="200" width="80" height="80" /></g>
        <rect className="bx" x="160" y="70" width="200" height="260" />
        <rect className="fl" x="176" y="90" width="110" height="34" />
        <rect className="bx" x="176" y="136" width="168" height="8" /><rect className="bx" x="176" y="152" width="120" height="8" />
        <rect className="bx" x="176" y="184" width="168" height="126" />
        <path className="hl" d="M160 40 V360" />
        <text x="40" y="44">{L("BEFORE", "ДО")}</text><text x="300" y="44">{L("AFTER", "ПОСЛЕ")}</text>
        <text x="40" y="384">{L("02 / AUDIT → REBUILD", "02 / АУДИТ → ПЕРЕСБОРКА")}</text>
      </svg>
    );
  }
  if (id === "telegram") {
    return (
      <svg viewBox="0 0 400 400" aria-hidden="true">
        <rect className="bx" x="120" y="30" width="160" height="320" rx="24" />
        <rect className="bx" x="136" y="70" width="96" height="30" rx="10" /><rect className="fl" x="168" y="112" width="96" height="30" rx="10" /><rect className="bx" x="136" y="154" width="110" height="44" rx="10" />
        <rect className="bx" x="136" y="260" width="62" height="26" rx="6" /><rect className="bx" x="202" y="260" width="62" height="26" rx="6" /><rect className="bx" x="136" y="292" width="128" height="26" rx="6" />
        <path className="hl" d="M280 120 C 340 120, 340 220, 380 220" /><path className="hl" d="M120 230 C 60 230, 60 300, 20 300" />
        <text x="292" y="240">BOT API</text><text x="20" y="320">MINI APP</text>
        <text x="120" y="384">{L("03 / WHERE USERS ALREADY ARE", "03 / ТАМ, ГДЕ УЖЕ ЕСТЬ КЛИЕНТЫ")}</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true">
      {[[80, 80], [320, 90], [70, 300], [330, 310], [200, 40], [200, 360]].map(([x, y], i) => <path key={i} className="ln" d={`M200 200 L${x} ${y}`} />)}
      {[[80, 80], [320, 90], [70, 300], [330, 310], [200, 40], [200, 360]].map(([x, y], i) => <rect key={`b${i}`} className="bx" x={x - 18} y={y - 14} width="36" height="28" />)}
      <rect className="fl" x="176" y="176" width="48" height="48" />
      <circle className="hl" cx="200" cy="200" r="70" />
      <text x="20" y="384">{L("04 / ONE IDEA → ONE PRODUCT", "04 / ОДНА ИДЕЯ → ОДИН ПРОДУКТ")}</text>
    </svg>
  );
}
