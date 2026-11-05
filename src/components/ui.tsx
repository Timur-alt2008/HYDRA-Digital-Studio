import React from "react";
import { href } from "../config";

type IconName = "arrow" | "arrow-up-right" | "external" | "github" | "telegram" | "copy" | "download" | "check" | "mail" | "back";

export function Icon({ name, title }: { name: IconName; title?: string }) {
  const p = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": title ? undefined : true, role: title ? "img" : undefined } as const;
  switch (name) {
    case "arrow":
      return <svg {...p}>{title && <title>{title}</title>}<path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="square" /></svg>;
    case "back":
      return <svg {...p}><path d="M20 12H5M11 6l-6 6 6 6" strokeLinecap="square" /></svg>;
    case "arrow-up-right":
      return <svg {...p}><path d="M7 17 17 7M8 7h9v9" strokeLinecap="square" /></svg>;
    case "external":
      return <svg {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" strokeLinecap="square" /></svg>;
    case "github":
      return <svg {...p} fill="currentColor" stroke="none"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" /></svg>;
    case "telegram":
      return <svg {...p} fill="currentColor" stroke="none"><path d="M21.4 4.3 2.9 11.4c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.6ZM9.5 14.1l8.7-5.5c.4-.3.8-.1.5.2l-7.2 6.5-.3 3.1-1.7-4.3Z" /></svg>;
    case "copy":
      return <svg {...p}><rect x="8" y="8" width="12" height="12" /><path d="M16 8V4H4v12h4" /></svg>;
    case "download":
      return <svg {...p}><path d="M12 4v11M7 10l5 5 5-5M4 20h16" strokeLinecap="square" /></svg>;
    case "check":
      return <svg {...p}><path d="m5 12 4.5 4.5L19 7" strokeLinecap="square" /></svg>;
    case "mail":
      return <svg {...p}><rect x="3" y="5" width="18" height="14" /><path d="m3 6 9 7 9-7" /></svg>;
  }
}

export function BrandMark({ className }: { className?: string }) {
  // One core, four heads.
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 28V18M16 18C16 13 6 13 5 5M16 18c0-5-4-8-3.5-14M16 18c0-5 4-8 3.5-14M16 18c0-5 10-5 11-13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      <rect x="13" y="25" width="6" height="6" fill="#ff4f1f" />
    </svg>
  );
}

export function Label({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return <span className={accent ? "label label--accent" : "label"}>{children}</span>;
}

/** Headline whose lines are revealed one by one. Lines are explicit so breaks are designed, not accidental. */
export function SplitTitle({ as: Tag = "h2", lines, className, accentLine, id }: { as?: "h1" | "h2"; lines: string[]; className?: string; accentLine?: number; id?: string }) {
  return (
    <Tag className={className} id={id} data-split aria-label={lines.join(" ")}>
      {lines.map((l, i) => (
        <span className="split-line" aria-hidden="true" key={i} style={{ ["--l" as string]: i }}>
          <span className={i === accentLine ? "accent" : undefined}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

export function SectionHead({ index, label, title, aside }: { index: string; label: string; title: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="section-head">
      <div className="section-head__meta">
        <span className="index">{index}</span>
        <Label>{label}</Label>
      </div>
      <div className="section-head__title">{title}</div>
      {aside && <div className="section-head__aside">{aside}</div>}
    </div>
  );
}

export function Btn({ to, children, ghost, small, external, icon = "arrow", id }: { to: string; children: React.ReactNode; ghost?: boolean; small?: boolean; external?: boolean; icon?: IconName | null; id?: string }) {
  const cls = ["btn", ghost && "btn--ghost", small && "btn--small"].filter(Boolean).join(" ");
  const target = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a className={cls} href={external ? to : href(to)} id={id} {...target}>
      <span>{children}</span>
      {icon && <Icon name={icon} />}
    </a>
  );
}

export function Frame({ src, alt, url, eager, width = 800, height = 500 }: { src: string; alt: string; url?: string; eager?: boolean; width?: number; height?: number }) {
  return (
    <div className="frame">
      <div className="frame__bar" aria-hidden="true">
        <span className="frame__dots"><i /><i /><i /></span>
        <span className="frame__url">{url ? url.replace(/^https?:\/\//, "") : ""}</span>
      </div>
      <img src={href(`img/projects/${src}.webp`)} alt={alt} width={width} height={height} loading={eager ? "eager" : "lazy"} decoding="async" />
    </div>
  );
}

export function Phone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="phone">
      <img src={href(`img/projects/${src}.webp`)} alt={alt} width={394} height={854} loading="lazy" decoding="async" />
    </div>
  );
}
