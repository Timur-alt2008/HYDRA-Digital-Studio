import React from "react";
import { SITE, href } from "../config";
import { CAPABILITIES, PROCESS } from "../data/content";
import { CATEGORIES, PROJECTS } from "../data/projects";
import { SERVICES } from "../data/services";
import { BeforeAfter, ContactForm, Faq, ProjectMedia, StatusTag, TechList, TelegramDemo } from "../components/Blocks";
import { HydraCore } from "../components/HydraCore";
import { Layout } from "../components/Layout";
import { Btn, Icon, Label, SectionHead, SplitTitle } from "../components/ui";

export function Home() {
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 4);
  return (
    <Layout
      meta={{
        path: "",
        title: "Independent digital development studio",
        description: SITE.description,
        nav: "home",
        jsonLd: [{ "@context": "https://schema.org", "@type": "WebSite", name: SITE.legalName, url: SITE.origin + SITE.base }],
      }}
    >
      {/* 01 — hero */}
      <section className="hero" data-theme="dark" aria-labelledby="hero-title">
        <div className="wrap hero__grid">
          <div className="hero__top">
            <Label accent>We build digital experiences</Label>
            <Label>Web · Redesign · Telegram · Products</Label>
          </div>
          <SplitTitle as="h1" id="hero-title" className="hero__title" lines={["One core.", "Four heads."]} accentLine={1} />
          <div className="hero__intro">
            <p className="lead" data-reveal>
              HYDRA designs and builds <strong>websites</strong>, <strong>redesigns</strong> existing ones, ships <strong>Telegram bots &amp; Mini Apps</strong> and engineers <strong>custom digital products</strong> — from the first idea to launch.
            </p>
            <div className="hero__ctas" data-reveal style={{ ["--i" as string]: 1 }}>
              <Btn to="start/">Start a project</Btn>
              <Btn to="projects/" ghost icon={null}>See the work</Btn>
            </div>
          </div>
          <div className="hero__core"><HydraCore /></div>
          <div className="hero__foot">
            <span className="label">{SITE.slogan}</span>
            <span className="label">Scroll ↓</span>
          </div>
        </div>
      </section>

      {/* 02 — the four heads */}
      <section className="section" data-theme="dark" id="services">
        <div className="wrap">
          <SectionHead index="01 — 04" label="What we do" title={<SplitTitle className="h2" lines={["Four heads.", "One standard."]} />} aside={<p>We don't do everything. We do four things — and design, UI/UX and engineering are part of each of them.</p>} />
          <div className="heads">
            {SERVICES.map((s, i) => (
              <a className="head-row" href={href(`services/#${s.id}`)} key={s.id} data-reveal style={{ ["--i" as string]: i }} data-head-row={i}>
                <span className="index">{s.index}</span>
                <span className="head-row__title">{s.title}</span>
                <span className="head-row__desc muted">{s.short}</span>
                <span className="head-row__arrow" aria-hidden="true"><Icon name="arrow-up-right" /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — brand */}
      <section className="section" data-theme="light" aria-labelledby="brand-title">
        <div className="wrap">
          <SectionHead index="Manifesto" label="Why HYDRA" title={<h2 id="brand-title" className="sr-only">Why HYDRA</h2>} />
          <p className="manifesto" data-reveal>
            The hydra grows a new head for every one you cut. We work the same way: <em>every limit</em> is a prompt for a better solution — researched, designed and engineered by <em>one core</em>.
          </p>
          <div className="principles">
            {[
              ["01", "Research before pixels", "Every project starts with evidence: your users, your current product and the best references, analysed with our own Design Intelligence tool."],
              ["02", "Engineering is design", "Speed, accessibility and clean code are design decisions. A beautiful interface that breaks on a phone is not finished."],
              ["03", "Launch is the beginning", "We build products that can grow: typed, documented, tested — ready for the next head."],
            ].map(([n, t, d], i) => (
              <div className="principle" key={n} data-reveal style={{ ["--i" as string]: i }}>
                <span className="index">{n}</span>
                <h3>{t}</h3>
                <p className="muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — selected work */}
      <section className="section" data-theme="dark" aria-labelledby="work-title">
        <div className="wrap">
          <SectionHead index="Selected work" label="Demo projects & tools" title={<h2 id="work-title" className="h2" data-reveal>Work that<br />proves the craft</h2>} aside={<p>Our portfolio is honest: demo projects for fictional businesses, concepts and our own tools — each labelled, each with real code.</p>} />
          <div className="work-list">
            {featured.map((p, i) => (
              <article className="work-item" key={p.slug}>
                <a className="work-item__media p-cover" href={href(`projects/${p.slug}/`)} aria-label={`${p.title} — open case`} data-reveal="clip" style={{ ["--vt" as string]: `cover-${p.slug}` }}>
                  <ProjectMedia p={p} />
                </a>
                <div className="work-item__meta" data-reveal style={{ ["--i" as string]: 1 }}>
                  <span className="index">{String(i + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}</span>
                  <h3 className="work-item__title"><a href={href(`projects/${p.slug}/`)}>{p.title}</a></h3>
                  <p className="muted">{p.summary}</p>
                  <div className="work-item__facts">
                    <StatusTag status={p.status} />
                    {p.categories.map((c) => <span className="chip" key={c}>{CATEGORIES.find((x) => x.id === c)?.label}</span>)}
                  </div>
                  <a className="link-arrow" href={href(`projects/${p.slug}/`)}>View case <Icon name="arrow" /></a>
                </div>
              </article>
            ))}
          </div>
          <div style={{ marginTop: "clamp(56px, 8vw, 120px)" }}><Btn to="projects/" ghost>All projects ({PROJECTS.length})</Btn></div>
        </div>
      </section>

      {/* 05 — capabilities */}
      <section className="section" data-theme="light" aria-labelledby="cap-title">
        <div className="wrap">
          <SectionHead index="Capabilities" label="Development" title={<h2 id="cap-title" className="h2" data-reveal>Spec sheet</h2>} aside={<p>What sits behind every project: the disciplines and tools we use, with no buzzwords attached.</p>} />
          <div className="spec">
            {CAPABILITIES.map((c, i) => (
              <div className="spec__row" key={c.area} data-reveal style={{ ["--i" as string]: i % 4 }}>
                <span className="index">{String(i + 1).padStart(2, "0")}</span>
                <span className="spec__area">{c.area}</span>
                <span className="muted">{c.detail}</span>
                <span className="chip">{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — telegram */}
      <section className="section" data-theme="dark" aria-labelledby="tg-title" id="telegram">
        <div className="wrap tg">
          <div className="tg__text">
            <span className="index">03 — Telegram Development</span>
            <h2 id="tg-title" className="h2" data-reveal>Your product,<br />inside the chat</h2>
            <p className="lead muted" data-reveal>Bots answer, take orders and automate routine. Mini Apps open full interfaces inside Telegram — with the user's account already in place. Try both on the right.</p>
            <ul className="features" style={{ gridTemplateColumns: "1fr" }}>
              <li>Ordering and booking bots with inline keyboards</li>
              <li>Mini Apps built on the Telegram WebApp SDK</li>
              <li>Notifications, admin tools and integrations</li>
            </ul>
            <div><Btn to="services/#telegram" ghost>Telegram development</Btn></div>
          </div>
          <TelegramDemo />
        </div>
      </section>

      {/* 07 — before / after */}
      <section className="section" data-theme="light" aria-labelledby="ba-title">
        <div className="wrap">
          <SectionHead index="02 — Redesign" label="Before / after" title={<h2 id="ba-title" className="h2" data-reveal>Same brief.<br />New standard.</h2>} aside={<p>Drag the handle to compare the first and the redesigned versions of our own demo projects.</p>} />
          <BeforeAfter />
        </div>
      </section>

      {/* 08 — process */}
      <section className="section" data-theme="dark" aria-labelledby="process-title">
        <div className="wrap">
          <SectionHead index="Process" label="How a project moves" title={<h2 id="process-title" className="h2" data-reveal>Idea → Launch</h2>} aside={<a className="link-arrow" href={href("process/")}>The full process <Icon name="arrow" /></a>} />
          <ol className="process-strip" data-reveal-group>
            {PROCESS.map((s, i) => (
              <li key={s.id} style={{ ["--i" as string]: i }}>
                <span className="index">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p className="muted" style={{ fontSize: "0.95rem" }}>{s.lead}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 09 — technologies */}
      <section className="section section--tight" data-theme="dark" aria-labelledby="tech-title">
        <div className="wrap"><SectionHead index="Stack" label="Technologies" title={<h2 id="tech-title" className="h2" data-reveal>Tools, not trends</h2>} /></div>
        <TechList />
      </section>

      {/* 10 — FAQ */}
      <section className="section" data-theme="light" aria-labelledby="faq-title">
        <div className="wrap">
          <SectionHead index="FAQ" label="Questions" title={<h2 id="faq-title" className="h2" data-reveal>Good questions</h2>} />
          <Faq />
        </div>
      </section>

      {/* 11 — collaboration */}
      <section className="section" data-theme="dark" aria-labelledby="form-title" id="contact">
        <div className="wrap contact">
          <div className="contact__info">
            <span className="index">Collaboration</span>
            <h2 id="form-title" className="h2" data-reveal>Tell us<br />what to build</h2>
            <p className="muted">Short brief here, or a detailed one in the Project Builder. We reply with questions or a scoped proposal.</p>
          </div>
          <div className="contact__form"><ContactForm compact /></div>
        </div>
      </section>
    </Layout>
  );
}
