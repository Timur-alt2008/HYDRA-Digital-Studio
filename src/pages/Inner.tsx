import React from "react";
import { SITE, contactMode, href } from "../config";
import { FAQ, PROCESS } from "../data/content";
import { CATEGORIES, PROJECTS, countBy, type Project } from "../data/projects";
import { NOT_OFFERED, SERVICES } from "../data/services";
import { ServiceArt } from "../components/Art";
import { ContactForm, CtaBand, Faq, ModeNotice, ProjectMedia, ProjectTile, StatusTag } from "../components/Blocks";
import { Layout } from "../components/Layout";
import { Btn, Frame, Icon, Label, Phone, SectionHead, SplitTitle } from "../components/ui";

function PageHead({ index, label, lines, lead, aside }: { index: string; label: string; lines: string[]; lead: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="page-head" data-theme="dark">
      <div className="wrap">
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <span className="index">{index}</span>
          <Label>{label}</Label>
        </div>
        <SplitTitle as="h1" className="page-head__title" lines={lines} accentLine={lines.length - 1} />
        <div className="page-head__row">
          <div className="page-head__aside">{aside}</div>
          <div className="page-head__lead lead" data-reveal>{lead}</div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ About */
export function About() {
  const values = [
    ["Focus", "Four services, done properly. Saying no to everything else is how we keep the quality of those four."],
    ["Honesty", "Demo projects are labelled as demos. Estimates are scoped. If something will not work, we say so early."],
    ["Craft", "Typography, motion and code get the same attention. Details are where users decide to trust a product."],
    ["Performance", "Fast on a mid-range phone, not only on our machines. Effects that cost speed must earn their place."],
    ["Accessibility", "Keyboard, screen readers, contrast and reduced motion are part of the definition of done."],
    ["Ownership", "You own the code and the content. Everything is documented so any developer can continue the work."],
  ];
  return (
    <Layout meta={{ path: "about/", title: "About", description: "HYDRA is an independent digital development studio. Our philosophy, approach, specialisation and values.", nav: "about" }}>
      <PageHead index="About" label="The studio" lines={["A studio", "with one core."]} lead={<>HYDRA is an independent digital development studio. We take a product at any stage — an idea, a half-built prototype or a live site that needs a new life — and turn it into a fast, considered, working digital experience.</>} aside={<span className="label">{SITE.slogan}</span>} />

      <section className="section" data-theme="light" aria-labelledby="philo">
        <div className="wrap">
          <SectionHead index="01" label="Philosophy" title={<h2 id="philo" className="h2" data-reveal>Think beyond<br />the template</h2>} />
          <div className="p-body">
            <div className="p-body__label"><Label>The name</Label></div>
            <div className="p-body__content prose lead" data-reveal>
              <p>In the myth, the hydra grows two heads for every one that is cut off. We took the idea literally: one core — research, design and engineering working as one — and four heads, each a discipline that grows from that core.</p>
              <p>A limitation in a brief is not a stop sign for us. It is the moment to look for the better solution, and then to build it properly.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" data-theme="dark" aria-labelledby="approach">
        <div className="wrap">
          <SectionHead index="02" label="Approach" title={<h2 id="approach" className="h2" data-reveal>How we<br />think</h2>} />
          <div className="principles" style={{ marginTop: 0 }}>
            {[
              ["Evidence", "We study users, the existing product and strong references before drawing anything. Our Design Intelligence tool keeps that research systematic."],
              ["Systems", "We design systems — type, colour, grid, motion, components — instead of one-off pages. That is what keeps a product consistent as it grows."],
              ["Iteration", "Small releases, real content, early feedback. A working staging link beats a slide deck."],
            ].map(([t, d], i) => (
              <div className="principle" key={t} data-reveal style={{ ["--i" as string]: i }}>
                <span className="index">{String(i + 1).padStart(2, "0")}</span>
                <h3>{t}</h3>
                <p className="muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" data-theme="light" aria-labelledby="spec">
        <div className="wrap">
          <SectionHead index="03" label="Specialisation" title={<h2 id="spec" className="h2" data-reveal>Four heads</h2>} aside={<p>Design, UI/UX and the visual concept are part of every one of them — not separate products.</p>} />
          <div className="spec">
            {SERVICES.map((s, i) => (
              <a className="spec__row" key={s.id} href={href(`services/#${s.id}`)} style={{ textDecoration: "none" }} data-reveal>
                <span className="index">{s.index}</span>
                <span className="spec__area">{s.title}</span>
                <span className="muted">{s.short}</span>
                <span className="chip">{i === 2 ? "Telegram" : i === 3 ? "Products" : "Web"}</span>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 56, display: "grid", gap: 18 }}>
            <Label>What we deliberately don't do</Label>
            <ul className="not-list">{NOT_OFFERED.map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section" data-theme="dark" aria-labelledby="values">
        <div className="wrap">
          <SectionHead index="04" label="Values" title={<h2 id="values" className="h2" data-reveal>What we<br />hold to</h2>} />
          <div className="values">
            {values.map(([t, d], i) => (
              <div className="value" key={t} data-reveal style={{ ["--i" as string]: i % 2 }}>
                <span className="index">{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{t}</h3><p className="muted">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </Layout>
  );
}

/* --------------------------------------------------------------- Services */
export function Services() {
  return (
    <Layout meta={{ path: "services/", title: "Services", description: "Web development, website redesign, Telegram bots and Mini Apps, custom digital products — what HYDRA builds and what you get.", nav: "services" }}>
      <PageHead index="Services" label="Four heads" lines={["Four", "services."]} lead={<>Everything HYDRA does fits into four directions. Each has its own process, deliverables and stack — and the same standard of design and engineering.</>} />
      <nav className="svc-nav wrap" aria-label="Services" data-svc-nav data-theme="dark">
        {SERVICES.map((s) => <a key={s.id} href={`#${s.id}`}>{s.index} {s.title}</a>)}
      </nav>
      {SERVICES.map((s, i) => (
        <section className="section" id={s.id} key={s.id} data-theme={i % 2 ? "dark" : "light"} aria-labelledby={`svc-${s.id}`}>
          <div className="wrap">
            <div className={`svc${i % 2 ? " svc--flip" : ""}`}>
              <div className="svc__intro">
                <span className="index">{s.index} — {s.title}</span>
                <h2 id={`svc-${s.id}`} className="h2" data-reveal>{s.headline}</h2>
                <p className="lead" data-reveal>{s.intro}</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Btn to={`start/?type=${s.id}`}>Start a {s.id === "products" ? "product" : s.id === "telegram" ? "Telegram project" : s.id === "redesign" ? "redesign" : "website"}</Btn>
                </div>
              </div>
              <div className="svc__visual"><div className="svc-art" data-reveal="clip"><ServiceArt id={s.id} /></div></div>
              <div className="svc__cols">
                {[["What we build", s.includes], ["What you get", s.deliverables], ["Typical stack", s.stack]].map(([t, list]) => (
                  <div key={t as string} data-reveal>
                    <Label accent>{t as string}</Label>
                    <ul>{(list as string[]).map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                ))}
              </div>
              {s.id === "telegram" && (
                <div style={{ gridColumn: "1 / -1" }} data-reveal>
                  <Label>Bot or Mini App?</Label>
                  <table className="compare" style={{ marginTop: 14 }}>
                    <thead><tr><th scope="col">&nbsp;</th><th scope="col">Telegram bot</th><th scope="col">Telegram Mini App</th></tr></thead>
                    <tbody>
                      <tr><th scope="row">Interface</th><td>Messages, buttons, inline keyboards</td><td>A full web interface inside Telegram</td></tr>
                      <tr><th scope="row">Best for</th><td>Orders, notifications, FAQ, automation</td><td>Catalogues, booking, dashboards, complex forms</td></tr>
                      <tr><th scope="row">Built with</th><td>Bot API · aiogram / Node.js</td><td>Mini Apps SDK · React / TypeScript</td></tr>
                      <tr><th scope="row">Often together</th><td colSpan={2}>The bot launches the Mini App and sends notifications — the demo on our home page shows both.</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
              <div style={{ gridColumn: "1 / -1" }}>
                <Label>A good fit when</Label>
                <ul className="features" style={{ marginTop: 14 }}>{s.fits.map((f) => <li key={f}>{f}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>
      ))}
      <CtaBand />
    </Layout>
  );
}

/* --------------------------------------------------------------- Projects */
export function Projects() {
  return (
    <Layout meta={{ path: "projects/", title: "Projects", description: "HYDRA portfolio: websites, redesigns, Telegram bots, Telegram Mini Apps and digital products. Demo projects and concepts are labelled.", nav: "projects" }}>
      <PageHead index="Projects" label="Portfolio" lines={["Selected", "work."]} lead={<>Demo projects for fictional businesses, concepts and our own tools. Every project is labelled — <strong>Demo</strong>, <strong>Concept</strong> or <strong>Internal tool</strong> — and the code is real.</>} />
      <section className="section" data-theme="dark" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="filters" role="group" aria-label="Filter projects" data-filters>
            <button className="filter" type="button" aria-pressed="true" data-filter="all">All <sup>{PROJECTS.length}</sup></button>
            {CATEGORIES.map((c) => (
              <button className="filter" type="button" aria-pressed="false" data-filter={c.id} key={c.id}>{c.label} <sup>{countBy(c.id)}</sup></button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite" data-filter-status />
          <div className="project-grid" data-project-grid>
            {PROJECTS.map((p, i) => <ProjectTile p={p} i={i} key={p.slug} />)}
          </div>
        </div>
      </section>
      <CtaBand />
    </Layout>
  );
}

/* --------------------------------------------------------- Project detail */
export function ProjectDetail({ p, next }: { p: Project; next: Project }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.summary,
    dateCreated: String(p.year),
    creator: { "@type": "Organization", name: SITE.legalName },
    ...(p.live ? { url: p.live } : {}),
    keywords: p.stack.join(", "),
  };
  return (
    <Layout meta={{ path: `projects/${p.slug}/`, title: `${p.title} — ${p.status}`, description: p.summary, nav: "projects", jsonLd: [jsonLd] }}>
      <section className="p-hero" data-theme="dark">
        <div className="wrap">
          <a className="link-arrow" href={href("projects/")}><Icon name="back" /> All projects</a>
          <h1 className="p-hero__title" data-reveal>{p.title}</h1>
          <div className="facts">
            <div><Label>Status</Label><StatusTag status={p.status} /></div>
            <div><Label>Category</Label><span>{p.categories.map((c) => CATEGORIES.find((x) => x.id === c)?.label).join(" · ")}</span></div>
            <div><Label>Client</Label><span>{p.client}</span></div>
            <div><Label>Year</Label><span>{p.year}</span></div>
          </div>
        </div>
      </section>
      <section data-theme="dark">
        <div className="wrap">
          <div className="p-cover" style={{ ["--vt" as string]: `cover-${p.slug}` }}><ProjectMedia p={p} eager /></div>
          {(p.live || p.repo) && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
              {p.live && <Btn to={p.live} external icon="external">Open live demo</Btn>}
              {p.repo && <Btn to={p.repo} external ghost icon="github">Source on GitHub</Btn>}
            </div>
          )}
        </div>
      </section>
      <section className="section" data-theme="dark">
        <div className="wrap p-body">
          <div className="p-body__label"><Label accent>Overview</Label></div>
          <div className="p-body__content"><p className="lead" data-reveal>{p.summary}</p></div>
          <div className="p-body__label"><Label accent>Goal</Label></div>
          <div className="p-body__content prose" data-reveal><p>{p.goal}</p></div>
          <div className="p-body__label"><Label accent>Approach</Label></div>
          <div className="p-body__content prose" data-reveal><p>{p.approach}</p></div>
          <div className="p-body__label"><Label accent>What works</Label></div>
          <div className="p-body__content"><ul className="features">{p.features.map((f) => <li key={f}>{f}</li>)}</ul></div>
          <div className="p-body__label"><Label accent>Stack</Label></div>
          <div className="p-body__content" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{p.stack.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
        </div>
      </section>
      {(p.mobile || p.extra || p.before) && (
        <section className="section" data-theme="light">
          <div className="wrap">
            <SectionHead index="Gallery" label={p.before ? "Before and after" : "Screens"} title={<h2 className="h2" data-reveal>{p.before ? "v1 → v2" : "In detail"}</h2>} />
            <div className="gallery">
              {p.before && (
                <div className="gallery__main" data-reveal="clip">
                  <Frame src={p.before.src} alt={`${p.title} — ${p.before.label}`} url={p.before.live} />
                  <p className="label" style={{ marginTop: 12 }}>{p.before.label} — {p.before.live && <a href={p.before.live} target="_blank" rel="noopener noreferrer">open v1</a>}</p>
                </div>
              )}
              {p.extra && p.extra.map((x) => (
                <div className="gallery__main" key={x.src} data-reveal="clip"><Frame src={x.src} alt={x.alt} width={1360} height={860} /></div>
              ))}
              {p.mobile && <div className="gallery__side" data-reveal><Phone src={p.mobile} alt={`${p.title} — mobile version`} /></div>}
            </div>
          </div>
        </section>
      )}
      <section data-theme="dark">
        <a className="next-project wrap" href={href(`projects/${next.slug}/`)}>
          <Label>Next project</Label>
          <span className="next-project__title" style={{ display: "block", marginTop: 16 }}>{next.title} →</span>
        </a>
      </section>
    </Layout>
  );
}

/* ---------------------------------------------------------------- Process */
export function Process() {
  return (
    <Layout meta={{ path: "process/", title: "Process", description: "How HYDRA builds: Idea → Research → Design → Development → Testing → Launch.", nav: "process" }}>
      <PageHead index="Process" label="Idea → Launch" lines={["Six steps.", "No surprises."]} lead={<>Every project moves through the same six stages. The depth changes with the scope — a landing page and a Mini App need different research — but the order never does.</>} />
      <section className="section" data-theme="dark" style={{ paddingTop: 0 }}>
        <div className="wrap pinned" data-pinned>
          <div className="pinned__aside">
            <div className="pinned__sticky" aria-hidden="true">
              <span className="label">Stage</span>
              <span className="pinned__num" data-pinned-num>01</span>
              <span className="pinned__name" data-pinned-name>{PROCESS[0].title}</span>
              <div className="pinned__bar"><i data-pinned-bar /></div>
              <span className="label">Idea → Research → Design → Development → Testing → Launch</span>
            </div>
          </div>
          <div className="pinned__steps">
            {PROCESS.map((s, i) => (
              <article className="pstep" key={s.id} data-step={i} data-title={s.title} aria-labelledby={`step-${s.id}`}>
                <span className="index">{String(i + 1).padStart(2, "0")} / 06</span>
                <h2 id={`step-${s.id}`} className="h2">{s.title}</h2>
                <h3>{s.lead}</h3>
                <p className="muted prose">{s.text}</p>
                <div>
                  <Label accent>Output</Label>
                  <ul style={{ marginTop: 12 }}>{s.output.map((o) => <li key={o}>{o}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section" data-theme="light">
        <div className="wrap">
          <SectionHead index="FAQ" label="About the process" title={<h2 className="h2" data-reveal>Before we start</h2>} />
          <Faq items={FAQ.slice(2, 6)} />
        </div>
      </section>
      <CtaBand />
    </Layout>
  );
}

/* ---------------------------------------------------------------- Contact */
export function Contact() {
  const mode = contactMode();
  return (
    <Layout meta={{ path: "contact/", title: "Contact", description: "Start a conversation with HYDRA: send a short brief or use the step-by-step Project Builder.", nav: "contact" }}>
      <PageHead index="Contact" label="Let's talk" lines={["Tell us", "everything."]} lead={<>A few sentences are enough to start. We answer with questions or a scoped proposal — never with a template.</>} />
      <section className="section" data-theme="light" style={{ paddingTop: "clamp(56px, 8vw, 120px)" }}>
        <div className="wrap contact">
          <div className="contact__info">
            {SITE.contactEmail && <div className="channel"><Label>Email</Label><a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></div>}
            {SITE.contactTelegram && <div className="channel"><Label>Telegram</Label><a href={`https://t.me/${SITE.contactTelegram}`} target="_blank" rel="noopener noreferrer">@{SITE.contactTelegram}</a></div>}
            <div className="channel"><Label>Project Builder</Label><a href={href("start/")}>Step-by-step brief →</a></div>
            <div className="channel"><Label>Code & demos</Label><a href={SITE.github} target="_blank" rel="noopener noreferrer">github.com/Timur-alt2008 ↗</a></div>
            <div className="channel"><Label>Working</Label><span>Remotely, worldwide</span></div>
            {mode === "demo" && <p className="muted" style={{ fontSize: "0.9rem" }}>The forms on this site run in demo mode for now: they prepare your brief so you can copy or download it.</p>}
          </div>
          <div className="contact__form"><ContactForm /></div>
        </div>
      </section>
      <section className="section" data-theme="dark">
        <div className="wrap">
          <SectionHead index="FAQ" label="Before you write" title={<h2 className="h2" data-reveal>Quick answers</h2>} />
          <Faq items={FAQ.slice(0, 4)} />
        </div>
      </section>
    </Layout>
  );
}

/* --------------------------------------------------------- Project Builder */
const TYPES = [
  ["web", "Website", "Landing, corporate, multi-page or store"],
  ["redesign", "Redesign", "Rework an existing site"],
  ["bot", "Telegram bot", "Orders, automation, notifications"],
  ["miniapp", "Mini App", "A full interface inside Telegram"],
  ["products", "Custom product", "Web app, tool, dashboard"],
  ["unsure", "Not sure yet", "Help me choose"],
] as const;

export function Start() {
  return (
    <Layout meta={{ path: "start/", title: "Project Builder", description: "Build your project brief in six steps: product type, goal, features, budget, timeline and contacts.", nav: "start" }}>
      <section className="page-head" data-theme="dark" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}><span className="index">Project Builder</span><Label>About 3 minutes</Label></div>
          <SplitTitle as="h1" className="page-head__title" lines={["Build your", "brief."]} accentLine={1} />
        </div>
      </section>
      <section className="section" data-theme="dark" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <form className="builder" data-builder noValidate data-mode={contactMode()} data-email={SITE.contactEmail} data-telegram={SITE.contactTelegram} data-endpoint={SITE.formEndpoint}>
            <ol className="builder__steps" aria-label="Steps">
              {["Product", "Task", "Features", "Budget", "Timeline", "Contacts"].map((s, i) => <li key={s} data-step-label={i} className={i === 0 ? "is-current" : undefined}>{s}</li>)}
            </ol>
            <div className="builder__panel">
              <div className="builder__progress" aria-hidden="true"><i data-builder-progress /></div>
              <p className="label" data-builder-count aria-live="polite">Step 1 of 6</p>

              <fieldset className="builder__step" data-step="0">
                <legend className="h3">What are we building?</legend>
                <div className="tiles">
                  {TYPES.map(([v, t, d], i) => (
                    <label className="tile" key={v}><input type="radio" name="type" value={v} required /><span><span className="index">{String(i + 1).padStart(2, "0")}</span><b>{t}</b><small>{d}</small></span></label>
                  ))}
                </div>
                <span className="field__error" data-error="type" aria-live="polite" />
              </fieldset>

              <fieldset className="builder__step" data-step="1" hidden>
                <legend className="h3">What is the main task?</legend>
                <div className="choices">
                  {["Launch something new", "Replace an outdated solution", "Get more requests or orders", "Automate routine work", "Validate an idea", "Something else"].map((t) => (
                    <label className="choice" key={t}><input type="radio" name="task" value={t} required /><span>{t}</span></label>
                  ))}
                </div>
                <span className="field__error" data-error="task" aria-live="polite" />
                <div className="field">
                  <label htmlFor="b-context">In a few words: what exists now, who are the users? <span className="muted">(optional)</span></label>
                  <textarea id="b-context" name="context" maxLength={2000} />
                </div>
                <div className="field">
                  <label htmlFor="b-url">Current website or reference <span className="muted">(optional)</span></label>
                  <input id="b-url" name="url" type="url" inputMode="url" placeholder="https://" maxLength={300} />
                  <span className="field__error" data-error="url" aria-live="polite" />
                </div>
              </fieldset>

              <fieldset className="builder__step" data-step="2" hidden>
                <legend className="h3">Which features do you need?</legend>
                <p className="muted">Pick everything that applies. The list adapts to the product type.</p>
                <div className="choices" data-features />
                <span className="field__error" data-error="features" aria-live="polite" />
              </fieldset>

              <fieldset className="builder__step" data-step="3" hidden>
                <legend className="h3">Approximate budget</legend>
                <div className="choices">
                  {["Under $500", "$500 – $1,500", "$1,500 – $5,000", "$5,000 – $15,000", "$15,000+", "Not sure yet"].map((t) => (
                    <label className="choice" key={t}><input type="radio" name="budget" value={t} required /><span>{t}</span></label>
                  ))}
                </div>
                <span className="field__error" data-error="budget" aria-live="polite" />
                <p className="muted">The range only helps us suggest the right scope for a first release.</p>
              </fieldset>

              <fieldset className="builder__step" data-step="4" hidden>
                <legend className="h3">When do you need it?</legend>
                <div className="choices">
                  {["As soon as possible", "Within a month", "In 2–3 months", "No fixed deadline"].map((t) => (
                    <label className="choice" key={t}><input type="radio" name="timeline" value={t} required /><span>{t}</span></label>
                  ))}
                </div>
                <span className="field__error" data-error="timeline" aria-live="polite" />
              </fieldset>

              <fieldset className="builder__step" data-step="5" hidden>
                <legend className="h3">How can we reach you?</legend>
                <div className="form__row">
                  <div className="field"><label htmlFor="b-name">Name</label><input id="b-name" name="name" autoComplete="name" required minLength={2} maxLength={80} /><span className="field__error" data-error="name" aria-live="polite" /></div>
                  <div className="field"><label htmlFor="b-contact">Email or Telegram</label><input id="b-contact" name="contact" required maxLength={120} placeholder="you@company.com or @username" /><span className="field__error" data-error="contact" aria-live="polite" /></div>
                </div>
                <div className="field"><label htmlFor="b-company">Company or project name <span className="muted">(optional)</span></label><input id="b-company" name="company" maxLength={120} /></div>
                <label className="check"><input type="checkbox" name="consent" required /> <span>I agree that HYDRA may use these details to reply to my request.</span></label>
                <span className="field__error" data-error="consent" aria-live="polite" />
                <div className="summary" data-summary />
                <ModeNotice />
              </fieldset>

              <div className="confirm" data-confirm hidden tabIndex={-1} />

              <div className="builder__nav" data-builder-nav>
                <button className="btn btn--ghost" type="button" data-prev disabled><span>Back</span></button>
                <button className="btn" type="button" data-next><span data-next-label>Next</span><Icon name="arrow" /></button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}

/* -------------------------------------------------------------------- 404 */
export function NotFound() {
  return (
    <Layout meta={{ path: "404.html", title: "Page not found", description: "This page does not exist.", noindex: true }}>
      <section data-theme="dark">
        <div className="wrap nf">
          <span className="index">Error 404</span>
          <SplitTitle as="h1" className="page-head__title" lines={["Cut off.", "Grow back."]} accentLine={1} />
          <p className="lead muted">This head is gone. The rest of HYDRA is still here.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Btn to="">Back to home</Btn><Btn to="projects/" ghost>See projects</Btn></div>
        </div>
      </section>
    </Layout>
  );
}

export { PROJECTS };
