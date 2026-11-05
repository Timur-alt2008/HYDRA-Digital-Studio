import React from "react";
import { SITE, contactMode, href } from "../config";
import { FAQ, TECHNOLOGIES } from "../data/content";
import { CATEGORIES, PROJECTS, type Project } from "../data/projects";
import { ProjectArt } from "./Art";
import { Btn, Frame, Icon, Label } from "./ui";

export function ProjectMedia({ p, eager }: { p: Project; eager?: boolean }) {
  if (p.cover) return <Frame src={p.cover} alt={`${p.title} — screenshot of the home page`} url={p.live || p.repo} eager={eager} width={p.cover.startsWith("hdi") ? 1360 : 800} height={p.cover.startsWith("hdi") ? 860 : 500} />;
  return <div className="art"><ProjectArt kind={p.art || ""} accent={p.accent} title={p.title} /></div>;
}

export function StatusTag({ status }: { status: Project["status"] }) {
  return <span className={`status status--${status.split(" ")[0]}`}>{status}</span>;
}

export function ProjectTile({ p, i }: { p: Project; i: number }) {
  return (
    <a className="ptile" href={href(`projects/${p.slug}/`)} data-cats={p.categories.join(" ")} data-reveal style={{ ["--i" as string]: i % 2 }}>
      <div className="p-cover" style={{ ["--vt" as string]: `cover-${p.slug}` }}>
        <ProjectMedia p={p} />
      </div>
      <div className="ptile__head">
        <h3 className="ptile__title">{p.title}</h3>
        <StatusTag status={p.status} />
      </div>
      <div className="ptile__cats">
        {p.categories.map((c) => <span className="chip" key={c}>{CATEGORIES.find((x) => x.id === c)?.label}</span>)}
        <span className="chip">{p.year}</span>
      </div>
    </a>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = items.map((t, i) => <span className="marquee__item" key={i}>{t}</span>);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">{row}{items.map((t, i) => <span className="marquee__item" key={`d${i}`}>{t}</span>)}</div>
    </div>
  );
}

export function TechList() {
  return (
    <>
      <Marquee items={Object.values(TECHNOLOGIES).flat().slice(0, 14)} />
      <div className="wrap">
        <div className="tech-groups">
          {Object.entries(TECHNOLOGIES).map(([group, items], i) => (
            <div key={group} data-reveal style={{ ["--i" as string]: i }}>
              <Label accent>{group}</Label>
              <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** Interactive Telegram demo. Server-rendered shell, behaviour in client/telegram.ts. */
export function TelegramDemo() {
  return (
    <div className="tg__demo" data-tg>
      <div className="tabs" role="tablist" aria-label="Telegram demo view">
        <button role="tab" id="tg-tab-bot" aria-selected="true" aria-controls="tg-panel-bot" data-tg-tab="bot">Bot</button>
        <button role="tab" id="tg-tab-app" aria-selected="false" aria-controls="tg-panel-app" data-tg-tab="app" tabIndex={-1}>Mini App</button>
      </div>
      <div className="device">
        <div className="device__screen">
          <div className="tg-bar">
            <div className="tg-bar__avatar" aria-hidden="true">H</div>
            <div>
              <div className="tg-bar__name">Studio Booking (demo)</div>
              <div className="tg-bar__sub" data-tg-sub>bot</div>
            </div>
          </div>
          <div id="tg-panel-bot" role="tabpanel" aria-labelledby="tg-tab-bot" style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <div className="tg-chat" data-tg-chat aria-live="polite">
              <div className="msg msg--bot">Hi! I'm a demo booking bot. Pick an option below 👇<time>12:00</time></div>
            </div>
            <div className="tg-keys" data-tg-keys>
              <button type="button" data-q="services">What can you do?</button>
              <button type="button" data-q="book">Book a session</button>
              <button type="button" data-q="hours">Opening hours</button>
              <button type="button" data-q="human">Talk to a human</button>
              <button type="button" className="wide" data-q="app">Open Mini App ↗</button>
            </div>
          </div>
          <div id="tg-panel-app" role="tabpanel" aria-labelledby="tg-tab-app" hidden style={{ flexDirection: "column", flex: 1, minHeight: 0 }}>
            <div className="mini" data-mini />
            <button className="mini__main" type="button" data-mini-main disabled>Choose a service</button>
          </div>
        </div>
      </div>
      <span className="label">Interactive demo · fictional studio · nothing is sent</span>
    </div>
  );
}

const PAIRS = PROJECTS.filter((p) => p.before && p.cover);

export function BeforeAfter() {
  const first = PAIRS[0];
  return (
    <div className="ba" data-ba>
      <div className="ba__controls">
        <div className="tabs" role="tablist" aria-label="Redesign examples">
          {PAIRS.map((p, i) => (
            <button key={p.slug} role="tab" aria-selected={i === 0} tabIndex={i === 0 ? 0 : -1} data-ba-pair={i} data-before={href(`img/projects/${p.before!.src}.webp`)} data-after={href(`img/projects/${p.cover}.webp`)} data-title={p.title} data-link={href(`projects/${p.slug}/`)}>
              {p.title.split(" ")[0]}
            </button>
          ))}
        </div>
        <a className="link-arrow" href={href(`projects/${first.slug}/`)} data-ba-link>Open the case <Icon name="arrow" /></a>
      </div>
      <div className="ba__stage" data-ba-stage>
        <img className="ba__before" src={href(`img/projects/${first.before!.src}.webp`)} alt={`${first.title} — first version`} width={800} height={500} loading="lazy" data-ba-before />
        <img className="ba__after" src={href(`img/projects/${first.cover}.webp`)} alt={`${first.title} — redesigned version`} width={800} height={500} loading="lazy" data-ba-after />
        <span className="ba__tag ba__tag--before">Before · v1</span>
        <span className="ba__tag ba__tag--after">After · v2</span>
        <input className="ba__range" type="range" min="0" max="100" defaultValue="50" aria-label="Drag to compare the first version with the redesign" data-ba-range />
        <span className="ba__handle" aria-hidden="true" />
      </div>
      <p className="label">Our own redesigns of earlier demo projects — both versions are live on GitHub Pages.</p>
    </div>
  );
}

export function Faq({ items = FAQ }: { items?: typeof FAQ }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={i} data-reveal style={{ ["--i" as string]: i % 3 }}>
          <summary>{f.q}<i aria-hidden="true" /></summary>
          <div className="faq__body"><div><p>{f.a}</p></div></div>
        </details>
      ))}
    </div>
  );
}

export function ModeNotice() {
  const mode = contactMode();
  if (mode !== "demo") return null;
  return (
    <p className="notice">
      Demo mode: this form validates and prepares your brief, which you can copy or download. Sending is switched off until the studio inbox is connected.
    </p>
  );
}

/** Short collaboration form used on the home and contact pages. Behaviour in client/forms.ts. */
export function ContactForm({ compact }: { compact?: boolean }) {
  return (
    <form className="form" data-contact-form noValidate data-mode={contactMode()} data-email={SITE.contactEmail} data-telegram={SITE.contactTelegram} data-endpoint={SITE.formEndpoint}>
      <div className="form__row">
        <div className="field">
          <label htmlFor="cf-name">Your name</label>
          <input id="cf-name" name="name" autoComplete="name" required minLength={2} maxLength={80} />
          <span className="field__error" aria-live="polite" />
        </div>
        <div className="field">
          <label htmlFor="cf-contact">Email or Telegram</label>
          <input id="cf-contact" name="contact" required maxLength={120} placeholder="you@company.com or @username" autoComplete="email" />
          <span className="field__error" aria-live="polite" />
        </div>
      </div>
      <fieldset className="field">
        <legend>What do you need?</legend>
        <div className="choices">
          {["Website", "Redesign", "Telegram bot", "Mini App", "Custom product", "Not sure yet"].map((t, i) => (
            <label className="choice" key={t}><input type="radio" name="type" value={t} defaultChecked={i === 0} /><span>{t}</span></label>
          ))}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor="cf-message">Tell us about the project</label>
        <textarea id="cf-message" name="message" required minLength={20} maxLength={3000} placeholder={compact ? "Goal, current situation, deadline…" : "What are you building, for whom, what exists already, and when do you need it?"} />
        <span className="field__error" aria-live="polite" />
      </div>
      <label className="check"><input type="checkbox" name="consent" required /> <span>I agree that HYDRA may use these details to reply to my request. Nothing is shared with third parties.</span></label>
      <span className="field__error" data-consent-error aria-live="polite" />
      <ModeNotice />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <button className="btn" type="submit"><span>Send request</span><Icon name="arrow" /></button>
        <a className="link-arrow" href={href("start/")}>Prefer a guided brief? Project Builder <Icon name="arrow" /></a>
      </div>
      <div className="confirm" data-confirm hidden tabIndex={-1} />
    </form>
  );
}

export function CtaBand() {
  return (
    <section className="section" data-theme="dark">
      <div className="wrap cta-band">
        <Label accent>Next step</Label>
        <p className="cta-band__title"><a href={href("start/")}>Start a<br />project <span className="accent">→</span></a></p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Btn to="start/">Open the Project Builder</Btn>
          <Btn to="contact/" ghost>Write to us</Btn>
        </div>
      </div>
    </section>
  );
}
