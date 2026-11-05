import React from "react";
import { SITE, absolute, absoluteAsset, absoluteFor, asset, href, hrefFor } from "../config";
import { L, locale, type Locale } from "../i18n";
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

export const getNav = (): { id: NonNullable<PageMeta["nav"]>; label: string; path: string }[] => [
  { id: "services", label: L("Services", "Услуги"), path: "services/" },
  { id: "projects", label: L("Projects", "Проекты"), path: "projects/" },
  { id: "process", label: L("Process", "Процесс"), path: "process/" },
  { id: "about", label: L("About", "О студии"), path: "about/" },
  { id: "contact", label: L("Contact", "Контакты"), path: "contact/" },
];

export const siteDescription = () =>
  L(
    "HYDRA is an independent digital development studio: websites from scratch, website redesign, Telegram bots and Mini Apps, and custom digital products — from first idea to launch.",
    "HYDRA — независимая студия цифровой разработки: сайты с нуля, редизайн сайтов, Telegram-боты и Mini Apps, цифровые продукты — от идеи до запуска."
  );

function LangSwitch({ path }: { path: string }) {
  const cur = locale();
  return (
    <div className="lang" role="group" aria-label={L("Language", "Язык")}>
      {(["en", "ru"] as Locale[]).map((l) => (
        <a key={l} href={hrefFor(l, path)} hrefLang={l} lang={l} aria-current={l === cur ? "true" : undefined} data-lang-link={l}>
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}

function Header({ current, theme, path }: { current?: string; theme: "dark" | "light"; path: string }) {
  const nav = getNav();
  return (
    <>
      <header className="site-header" data-header-theme={theme}>
        <div className="wrap site-header__inner">
          <a className="brand" href={href("")} aria-label={L("HYDRA — home", "HYDRA — на главную")}>
            <BrandMark className="brand__mark" />
            <span>HYDRA</span>
          </a>
          <nav className="nav" aria-label={L("Main", "Основное меню")}>
            <ul className="nav__links">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={href(n.path)} aria-current={current === n.id ? "page" : undefined}>{n.label}</a>
                </li>
              ))}
            </ul>
            <LangSwitch path={path} />
            <Btn to="start/" small>{L("Start a project", "Начать проект")}</Btn>
            <button className="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">
              <span className="menu-toggle__bars" aria-hidden="true" />
              <span className="menu-toggle__text">{L("Menu", "Меню")}</span>
            </button>
          </nav>
        </div>
      </header>
      <div className="mobile-menu" id="mobile-menu" aria-label={L("Menu", "Меню")} role="dialog" aria-modal="true" hidden>
        <ol>
          {[{ id: "home", label: L("Home", "Главная"), path: "" }, ...nav, { id: "start", label: L("Start a project", "Начать проект"), path: "start/" }].map((n, i) => (
            <li key={n.id}>
              <a href={href(n.path)} style={{ ["--i" as string]: i }} aria-current={current === n.id ? "page" : undefined}>{n.label}</a>
            </li>
          ))}
        </ol>
        <div className="mobile-menu__foot">
          <LangSwitch path={path} />
          <span className="label">{SITE.slogan}</span>
          <a className="link-arrow" href={SITE.github} target="_blank" rel="noopener noreferrer">{L("Code on GitHub", "Код на GitHub")} <Icon name="external" /></a>
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
            <p className="muted" style={{ maxWidth: "38ch" }}>{siteDescription()}</p>
            <div><Btn to="start/">{L("Start a project", "Начать проект")}</Btn></div>
          </div>
          <div className="site-footer__col">
            <span className="label">{L("Studio", "Студия")}</span>
            <ul>
              <li><a href={href("about/")}>{L("About", "О студии")}</a></li>
              <li><a href={href("process/")}>{L("Process", "Процесс")}</a></li>
              <li><a href={href("projects/")}>{L("Projects", "Проекты")}</a></li>
              <li><a href={href("contact/")}>{L("Contact", "Контакты")}</a></li>
            </ul>
          </div>
          <div className="site-footer__col">
            <span className="label">{L("Services", "Услуги")}</span>
            <ul>
              <li><a href={href("services/#web")}>{L("Web Development", "Веб-разработка")}</a></li>
              <li><a href={href("services/#redesign")}>{L("Website Redesign", "Редизайн сайтов")}</a></li>
              <li><a href={href("services/#telegram")}>{L("Telegram Development", "Telegram-разработка")}</a></li>
              <li><a href={href("services/#products")}>{L("Custom Digital Products", "Цифровые продукты")}</a></li>
            </ul>
          </div>
          <div className="site-footer__col">
            <span className="label">{L("Elsewhere", "Ещё")}</span>
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
          <span className="label">{L("Portfolio projects are labelled Demo or Concept", "Проекты портфолио подписаны: Демо или Концепт")}</span>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ meta, children }: { meta: PageMeta; children: React.ReactNode }) {
  const lang = locale();
  const canonical = absolute(meta.path);
  const fullTitle = meta.path === "" ? `${SITE.name} — ${meta.title}` : `${meta.title} — ${SITE.name}`;
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    alternateName: SITE.name,
    url: absoluteFor("en", ""),
    logo: absoluteAsset("favicon.svg"),
    slogan: SITE.slogan,
    description: siteDescription(),
    knowsAbout: ["Web development", "Website redesign", "Telegram bots", "Telegram Mini Apps", "Custom web applications"],
    sameAs: [SITE.github],
  };
  const ld = [org, ...(meta.jsonLd || [])];
  const v = process.env.BUILD_ID || "dev";
  return (
    <html lang={lang} className="no-js">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{fullTitle}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonical} />
        {!meta.noindex && <link rel="alternate" hrefLang="en" href={absoluteFor("en", meta.path)} />}
        {!meta.noindex && <link rel="alternate" hrefLang="ru" href={absoluteFor("ru", meta.path)} />}
        {!meta.noindex && <link rel="alternate" hrefLang="x-default" href={absoluteFor("en", meta.path)} />}
        {meta.noindex && <meta name="robots" content="noindex" />}
        <meta name="theme-color" content="#111722" />
        <meta name="color-scheme" content="light dark" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE.legalName} />
        <meta property="og:locale" content={lang === "ru" ? "ru_RU" : "en_US"} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={absoluteAsset("og.png")} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href={asset("favicon.svg")} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={asset("apple-touch-icon.png")} />
        <link rel="manifest" href={asset("site.webmanifest")} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&subset=latin,cyrillic&display=swap" />
        <link rel="stylesheet" href={asset(`assets/main.css?v=${v}`)} />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.replace('no-js','js')" }} />
        <script type="module" src={asset(`assets/main.js?v=${v}`)} />
        {ld.map((o, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o).replace(/</g, "\\u003c") }} />
        ))}
      </head>
      <body data-page={meta.nav || "other"} data-base={href("")}>
        <a className="skip-link" href="#main">{L("Skip to content", "Перейти к содержимому")}</a>
        <Header current={meta.nav} theme={meta.headerTheme || "dark"} path={meta.path} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
