import React from "react";
import { SITE, absolute, href } from "../config";
import { BrandMark, Btn, Icon } from "./ui";

export type PageMeta = {
  path: string; // e.g. "" or "about/"
  title: string;
  description: string;
  nav?: "home" | "services" | "projects" | "process" | "about" | "contact" | "start";
  headerTheme?: "dark" | "light";
  jsonLd?: object[];
  noindex?: boolean;
};

export const NAV: { id: NonNullable<PageMeta["nav"]>; label: string; path: string }[] = [
  { id: "services", label: "Services", path: "services/" },
  { id: "projects", label: "Projects", path: "projects/" },
  { id: "process", label: "Process", path: "process/" },
  { id: "about", label: "About", path: "about/" },
  { id: "contact", label: "Contact", path: "contact/" },
];

function Header({ current, theme }: { current?: string; theme: "dark" | "light" }) {
  return (
    <>
      <header className="site-header" data-header-theme={theme}>
        <div className="wrap site-header__inner">
          <a className="brand" href={href("")} aria-label="HYDRA — home">
            <BrandMark className="brand__mark" />
            <span>HYDRA</span>
          </a>
          <nav className="nav" aria-label="Main">
            <ul className="nav__links">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={href(n.path)} aria-current={current === n.id ? "page" : undefined}>{n.label}</a>
                </li>
              ))}
            </ul>
            <Btn to="start/" small>Start a project</Btn>
            <button className="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">
              <span className="menu-toggle__bars" aria-hidden="true" />
              <span className="menu-toggle__text">Menu</span>
            </button>
          </nav>
        </div>
      </header>
      <div className="mobile-menu" id="mobile-menu" aria-label="Menu" role="dialog" aria-modal="true" hidden>
        <ol>
          {[{ id: "home", label: "Home", path: "" }, ...NAV, { id: "start", label: "Start a project", path: "start/" }].map((n, i) => (
            <li key={n.id}>
              <a href={href(n.path)} style={{ ["--i" as string]: i }} aria-current={current === n.id ? "page" : undefined}>{n.label}</a>
            </li>
          ))}
        </ol>
        <div className="mobile-menu__foot">
          <span className="label">{SITE.slogan}</span>
          <a className="link-arrow" href={SITE.github} target="_blank" rel="noopener noreferrer">Code on GitHub <Icon name="external" /></a>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer" data-theme="dark">
      <div className="wrap">
        <div className="site-footer__grid">
          <div className="site-footer__intro">
            <a className="brand" href={href("")}><BrandMark className="brand__mark" /><span>HYDRA</span></a>
            <p className="muted" style={{ maxWidth: "38ch" }}>{SITE.description}</p>
            <div><Btn to="start/">Start a project</Btn></div>
          </div>
          <div className="site-footer__col" style={{ gridColumnStart: "auto" }}>
            <span className="label">Studio</span>
            <ul>
              <li><a href={href("about/")}>About</a></li>
              <li><a href={href("process/")}>Process</a></li>
              <li><a href={href("projects/")}>Projects</a></li>
              <li><a href={href("contact/")}>Contact</a></li>
            </ul>
          </div>
          <div className="site-footer__col">
            <span className="label">Services</span>
            <ul>
              <li><a href={href("services/#web")}>Web Development</a></li>
              <li><a href={href("services/#redesign")}>Website Redesign</a></li>
              <li><a href={href("services/#telegram")}>Telegram Development</a></li>
              <li><a href={href("services/#products")}>Custom Digital Products</a></li>
            </ul>
          </div>
          <div className="site-footer__col">
            <span className="label">Elsewhere</span>
            <ul>
              <li><a href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href={href("projects/design-intelligence/")}>Design Intelligence</a></li>
              <li><a href={href("start/")}>Project Builder</a></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__mark" aria-hidden="true">HYDRA</div>
        <div className="site-footer__bottom">
          <span className="label">© {SITE.year} {SITE.legalName}</span>
          <span className="label">{SITE.slogan}</span>
          <span className="label">Portfolio projects are labelled Demo or Concept</span>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ meta, children }: { meta: PageMeta; children: React.ReactNode }) {
  const canonical = absolute(meta.path);
  const fullTitle = meta.path === "" ? `${SITE.name} — ${meta.title}` : `${meta.title} — ${SITE.name}`;
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    alternateName: SITE.name,
    url: absolute(""),
    logo: absolute("favicon.svg"),
    slogan: SITE.slogan,
    description: SITE.description,
    knowsAbout: ["Web development", "Website redesign", "Telegram bots", "Telegram Mini Apps", "Custom web applications"],
    sameAs: [SITE.github],
  };
  const ld = [org, ...(meta.jsonLd || [])];
  return (
    <html lang={SITE.locale} className="no-js">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{fullTitle}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonical} />
        {meta.noindex && <meta name="robots" content="noindex" />}
        <meta name="theme-color" content="#0b0f0e" />
        <meta name="color-scheme" content="dark light" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE.legalName} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={absolute("og.png")} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href={href("favicon.svg")} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={href("apple-touch-icon.png")} />
        <link rel="manifest" href={href("site.webmanifest")} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=JetBrains+Mono:wght@400;500&display=swap" />
        <link rel="stylesheet" href={href("assets/main.css")} />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.replace('no-js','js')" }} />
        <script type="module" src={href("assets/main.js")} />
        {ld.map((o, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o).replace(/</g, "\\u003c") }} />
        ))}
      </head>
      <body data-page={meta.nav || "other"} data-base={href("")}>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header current={meta.nav} theme={meta.headerTheme || "dark"} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
