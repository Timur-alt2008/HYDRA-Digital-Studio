import React from "react";
import { SITE, contactMode, href } from "../config";
import { getFaq, getProcess } from "../data/content";
import { countBy, getCategories, getProjects, statusLabel, type Project } from "../data/projects";
import { getNotOffered, getServices } from "../data/services";
import { ServiceArt } from "../components/Art";
import { ContactForm, CtaBand, Faq, ModeNotice, ProjectMedia, ProjectTile, StatusTag } from "../components/Blocks";
import { Layout } from "../components/Layout";
import { Btn, Frame, Icon, Label, Phone, SectionHead, SplitTitle } from "../components/ui";
import { L } from "../i18n";

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
    [L("Focus", "Фокус"), L("Four services, done properly. Saying no to everything else is how we keep the quality of those four.", "Четыре услуги, сделанные как следует. Отказ от всего остального — это то, что сохраняет их качество.")],
    [L("Honesty", "Честность"), L("Demo projects are labelled as demos. Estimates are scoped. If something will not work, we say so early.", "Демо-проекты подписаны как демо. Оценки — с понятным объёмом. Если что-то не сработает, говорим об этом сразу.")],
    [L("Craft", "Мастерство"), L("Typography, motion and code get the same attention. Details are where users decide to trust a product.", "Типографика, анимация и код получают одинаковое внимание. Именно в деталях пользователь решает, доверять ли продукту.")],
    [L("Performance", "Скорость"), L("Fast on a mid-range phone, not only on our machines. Effects that cost speed must earn their place.", "Быстро на обычном телефоне, а не только на наших компьютерах. Эффекты, которые тормозят, должны заслужить своё место.")],
    [L("Accessibility", "Доступность"), L("Keyboard, screen readers, contrast and reduced motion are part of the definition of done.", "Клавиатура, скринридеры, контраст и уменьшенная анимация — часть критериев готовности.")],
    [L("Ownership", "Владение"), L("You own the code and the content. Everything is documented so any developer can continue the work.", "Код и контент принадлежат вам. Всё задокументировано, чтобы любой разработчик мог продолжить работу.")],
  ];
  const services = getServices();
  return (
    <Layout meta={{ path: "about/", title: L("About", "О студии"), description: L("HYDRA is an independent digital development studio. Our philosophy, approach, specialisation and values.", "HYDRA — независимая студия цифровой разработки. Философия, подход, специализация и ценности."), nav: "about" }}>
      <PageHead index={L("About", "О студии")} label={L("The studio", "Студия")} lines={[L("A studio", "Студия"), L("with one core.", "с одним ядром.")]} lead={L("HYDRA is an independent digital development studio. We take a product at any stage — an idea, a half-built prototype or a live site that needs a new life — and turn it into a fast, considered, working digital experience.", "HYDRA — независимая студия цифровой разработки. Мы берём продукт на любом этапе — идею, недоделанный прототип или живой сайт, которому нужна новая жизнь, — и превращаем его в быстрый, продуманный, работающий цифровой продукт.")} aside={<span className="label">{SITE.slogan}</span>} />

      <section className="section" data-theme="light" aria-labelledby="philo">
        <div className="wrap">
          <SectionHead index="01" label={L("Philosophy", "Философия")} title={<h2 id="philo" className="h2" data-reveal>{L("Think beyond", "Думать дальше")}<br />{L("the template", "шаблона")}</h2>} />
          <div className="p-body">
            <div className="p-body__label"><Label>{L("The name", "Название")}</Label></div>
            <div className="p-body__content prose lead" data-reveal>
              <p>{L("In the myth, the hydra grows two heads for every one that is cut off. We took the idea literally: one core — research, design and engineering working as one — and four heads, each a discipline that grows from that core.", "В мифе у гидры на месте каждой отрубленной головы вырастают две. Мы восприняли эту идею буквально: одно ядро — исследование, дизайн и разработка, работающие как единое целое, — и четыре головы, каждая из которых — направление, растущее из этого ядра.")}</p>
              <p>{L("A limitation in a brief is not a stop sign for us. It is the moment to look for the better solution, and then to build it properly.", "Ограничение в брифе для нас не знак «стоп». Это момент, чтобы найти лучшее решение — и затем сделать его как следует.")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" data-theme="dark" aria-labelledby="approach">
        <div className="wrap">
          <SectionHead index="02" label={L("Approach", "Подход")} title={<h2 id="approach" className="h2" data-reveal>{L("How we", "Как мы")}<br />{L("think", "думаем")}</h2>} />
          <div className="principles" style={{ marginTop: 0 }}>
            {[
              [L("Evidence", "Факты"), L("We study users, the existing product and strong references before drawing anything. Our Design Intelligence tool keeps that research systematic.", "Прежде чем рисовать, изучаем пользователей, текущий продукт и сильные референсы. Инструмент Design Intelligence делает это исследование системным.")],
              [L("Systems", "Системы"), L("We design systems — type, colour, grid, motion, components — instead of one-off pages. That is what keeps a product consistent as it grows.", "Мы проектируем системы — шрифты, цвет, сетку, анимацию, компоненты, — а не разовые страницы. Именно это сохраняет цельность продукта при росте.")],
              [L("Iteration", "Итерации"), L("Small releases, real content, early feedback. A working staging link beats a slide deck.", "Небольшие релизы, реальный контент, ранняя обратная связь. Рабочая тестовая ссылка лучше любой презентации.")],
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

      <section className="section" data-theme="ice" aria-labelledby="spec">
        <div className="wrap">
          <SectionHead index="03" label={L("Specialisation", "Специализация")} title={<h2 id="spec" className="h2" data-reveal>{L("Four heads", "Четыре головы")}</h2>} aside={<p>{L("Design, UI/UX and the visual concept are part of every one of them — not separate products.", "Дизайн, UI/UX и визуальная концепция входят в каждое из направлений, а не продаются отдельно.")}</p>} />
          <div className="spec">
            {services.map((s, i) => (
              <a className="spec__row" key={s.id} href={href(`services/#${s.id}`)} style={{ textDecoration: "none" }} data-reveal>
                <span className="index">{s.index}</span>
                <span className="spec__area">{s.title}</span>
                <span className="muted">{s.short}</span>
                <span className="chip">{i === 2 ? "Telegram" : i === 3 ? L("Products", "Продукты") : "Web"}</span>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 56, display: "grid", gap: 18 }}>
            <Label>{L("What we deliberately don't do", "Чем мы сознательно не занимаемся")}</Label>
            <ul className="not-list">{getNotOffered().map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section" data-theme="light" aria-labelledby="values">
        <div className="wrap">
          <SectionHead index="04" label={L("Values", "Ценности")} title={<h2 id="values" className="h2" data-reveal>{L("What we", "Чего мы")}<br />{L("hold to", "держимся")}</h2>} />
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
  const services = getServices();
  const startLabel = (id: string) => (id === "products" ? L("Start a product", "Начать продукт") : id === "telegram" ? L("Start a Telegram project", "Начать Telegram-проект") : id === "redesign" ? L("Start a redesign", "Начать редизайн") : L("Start a website", "Начать сайт"));
  return (
    <Layout meta={{ path: "services/", title: L("Services", "Услуги"), description: L("Web development, website redesign, Telegram bots and Mini Apps, custom digital products — what HYDRA builds and what you get.", "Веб-разработка, редизайн сайтов, Telegram-боты и Mini Apps, цифровые продукты — что делает HYDRA и что вы получаете."), nav: "services" }}>
      <PageHead index={L("Services", "Услуги")} label={L("Four heads", "Четыре головы")} lines={[L("Four", "Четыре"), L("services.", "направления.")]} lead={L("Everything HYDRA does fits into four directions. Each has its own process, deliverables and stack — and the same standard of design and engineering.", "Всё, что делает HYDRA, укладывается в четыре направления. У каждого свой процесс, результаты и стек — и единый стандарт дизайна и разработки.")} />
      <nav className="svc-nav wrap" aria-label={L("Services", "Услуги")} data-svc-nav data-theme="light">
        {services.map((s) => <a key={s.id} href={`#${s.id}`}>{s.index} {s.title}</a>)}
      </nav>
      {services.map((s, i) => (
        <section className="section" id={s.id} key={s.id} data-theme={i % 2 ? "ice" : "light"} aria-labelledby={`svc-${s.id}`}>
          <div className="wrap">
            <div className={`svc${i % 2 ? " svc--flip" : ""}`}>
              <div className="svc__intro">
                <span className="index">{s.index} — {s.title}</span>
                <h2 id={`svc-${s.id}`} className="h2" data-reveal>{s.headline}</h2>
                <p className="lead" data-reveal>{s.intro}</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Btn to={`start/?type=${s.id}`}>{startLabel(s.id)}</Btn>
                </div>
              </div>
              <div className="svc__visual"><div className="svc-art" data-reveal="clip"><ServiceArt id={s.id} /></div></div>
              <div className="svc__cols">
                {[[L("What we build", "Что делаем"), s.includes], [L("What you get", "Что вы получаете"), s.deliverables], [L("Typical stack", "Типичный стек"), s.stack]].map(([t, list]) => (
                  <div key={t as string} data-reveal>
                    <Label accent>{t as string}</Label>
                    <ul>{(list as string[]).map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                ))}
              </div>
              {s.id === "telegram" && (
                <div style={{ gridColumn: "1 / -1" }} data-reveal>
                  <Label>{L("Bot or Mini App?", "Бот или Mini App?")}</Label>
                  <div className="table-wrap">
                    <table className="compare" style={{ marginTop: 14 }}>
                      <thead><tr><th scope="col">&nbsp;</th><th scope="col">{L("Telegram bot", "Telegram-бот")}</th><th scope="col">Telegram Mini App</th></tr></thead>
                      <tbody>
                        <tr><th scope="row">{L("Interface", "Интерфейс")}</th><td>{L("Messages, buttons, inline keyboards", "Сообщения, кнопки, inline-клавиатуры")}</td><td>{L("A full web interface inside Telegram", "Полноценный веб-интерфейс внутри Telegram")}</td></tr>
                        <tr><th scope="row">{L("Best for", "Лучше всего для")}</th><td>{L("Orders, notifications, FAQ, automation", "Заказы, уведомления, FAQ, автоматизация")}</td><td>{L("Catalogues, booking, dashboards, complex forms", "Каталоги, запись, дашборды, сложные формы")}</td></tr>
                        <tr><th scope="row">{L("Built with", "Технологии")}</th><td>Bot API · aiogram / Node.js</td><td>Mini Apps SDK · React / TypeScript</td></tr>
                        <tr><th scope="row">{L("Often together", "Часто вместе")}</th><td colSpan={2}>{L("The bot launches the Mini App and sends notifications — the demo on our home page shows both.", "Бот запускает Mini App и присылает уведомления — демо на главной показывает оба варианта.")}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <div style={{ gridColumn: "1 / -1" }}>
                <Label>{L("A good fit when", "Подходит, если")}</Label>
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
  const projects = getProjects();
  return (
    <Layout meta={{ path: "projects/", title: L("Projects", "Проекты"), description: L("HYDRA portfolio: websites, redesigns, Telegram bots, Telegram Mini Apps and digital products. Demo projects and concepts are labelled.", "Портфолио HYDRA: сайты, редизайны, Telegram-боты, Telegram Mini Apps и цифровые продукты. Демо-проекты и концепты подписаны."), nav: "projects" }}>
      <PageHead index={L("Projects", "Проекты")} label={L("Portfolio", "Портфолио")} lines={[L("Selected", "Избранные"), L("work.", "работы.")]} lead={<>{L("Demo projects for fictional businesses, concepts and our own tools. Every project is labelled — ", "Демо-проекты для вымышленных компаний, концепты и собственные инструменты. Каждый проект подписан — ")}<strong>{statusLabel("Demo")}</strong>, <strong>{statusLabel("Concept")}</strong> {L("or", "или")} <strong>{statusLabel("Internal tool")}</strong>{L(" — and the code is real.", " — а код настоящий.")}</>} />
      <section className="section" data-theme="light">
        <div className="wrap">
          <div className="filters" role="group" aria-label={L("Filter projects", "Фильтр проектов")} data-filters>
            <button className="filter" type="button" aria-pressed="true" data-filter="all">{L("All", "Все")} <sup>{projects.length}</sup></button>
            {getCategories().map((c) => (
              <button className="filter" type="button" aria-pressed="false" data-filter={c.id} key={c.id}>{c.label} <sup>{countBy(c.id)}</sup></button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite" data-filter-status />
          <div className="project-grid" data-project-grid>
            {projects.map((p, i) => <ProjectTile p={p} i={i} key={p.slug} />)}
          </div>
        </div>
      </section>
      <CtaBand />
    </Layout>
  );
}

/* --------------------------------------------------------- Project detail */
export function ProjectDetail({ p, next }: { p: Project; next: Project }) {
  const cats = getCategories();
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
    <Layout meta={{ path: `projects/${p.slug}/`, title: `${p.title} — ${statusLabel(p.status)}`, description: p.summary, nav: "projects", jsonLd: [jsonLd] }}>
      <section className="p-hero" data-theme="dark">
        <div className="wrap">
          <a className="link-arrow" href={href("projects/")}><Icon name="back" /> {L("All projects", "Все проекты")}</a>
          <h1 className="p-hero__title" data-reveal>{p.title}</h1>
          <div className="facts">
            <div><Label>{L("Status", "Статус")}</Label><StatusTag status={p.status} /></div>
            <div><Label>{L("Category", "Категория")}</Label><span>{p.categories.map((c) => cats.find((x) => x.id === c)?.label).join(" · ")}</span></div>
            <div><Label>{L("Client", "Клиент")}</Label><span>{p.client}</span></div>
            <div><Label>{L("Year", "Год")}</Label><span>{p.year}</span></div>
          </div>
        </div>
      </section>
      <section data-theme="dark" className="p-cover-band">
        <div className="wrap">
          <div className="p-cover" style={{ ["--vt" as string]: `cover-${p.slug}` }}><ProjectMedia p={p} eager /></div>
          {(p.live || p.repo) && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
              {p.live && <Btn to={p.live} external icon="external">{L("Open live demo", "Открыть живое демо")}</Btn>}
              {p.repo && <Btn to={p.repo} external ghost icon="github">{L("Source on GitHub", "Код на GitHub")}</Btn>}
            </div>
          )}
        </div>
      </section>
      <section className="section" data-theme="light">
        <div className="wrap p-body">
          <div className="p-body__label"><Label accent>{L("Overview", "Обзор")}</Label></div>
          <div className="p-body__content"><p className="lead" data-reveal>{p.summary}</p></div>
          <div className="p-body__label"><Label accent>{L("Goal", "Цель")}</Label></div>
          <div className="p-body__content prose" data-reveal><p>{p.goal}</p></div>
          <div className="p-body__label"><Label accent>{L("Approach", "Подход")}</Label></div>
          <div className="p-body__content prose" data-reveal><p>{p.approach}</p></div>
          <div className="p-body__label"><Label accent>{L("What works", "Что работает")}</Label></div>
          <div className="p-body__content"><ul className="features">{p.features.map((f) => <li key={f}>{f}</li>)}</ul></div>
          <div className="p-body__label"><Label accent>{L("Stack", "Стек")}</Label></div>
          <div className="p-body__content" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{p.stack.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
        </div>
      </section>
      {(p.mobile || p.extra || p.before) && (
        <section className="section" data-theme="ice">
          <div className="wrap">
            <SectionHead index={L("Gallery", "Галерея")} label={p.before ? L("Before and after", "До и после") : L("Screens", "Экраны")} title={<h2 className="h2" data-reveal>{p.before ? "v1 → v2" : L("In detail", "Подробнее")}</h2>} />
            <div className="gallery">
              {p.before && (
                <div className="gallery__main" data-reveal="clip">
                  <Frame src={p.before.src} alt={`${p.title} — ${p.before.label}`} url={p.before.live} />
                  <p className="label" style={{ marginTop: 12 }}>{p.before.label} — {p.before.live && <a href={p.before.live} target="_blank" rel="noopener noreferrer">{L("open v1", "открыть v1")}</a>}</p>
                </div>
              )}
              {p.extra && p.extra.map((x) => (
                <div className="gallery__main" key={x.src} data-reveal="clip"><Frame src={x.src} alt={x.alt} width={1360} height={860} /></div>
              ))}
              {p.mobile && <div className="gallery__side" data-reveal><Phone src={p.mobile} alt={`${p.title} — ${L("mobile version", "мобильная версия")}`} /></div>}
            </div>
          </div>
        </section>
      )}
      <section data-theme="dark">
        <a className="next-project wrap" href={href(`projects/${next.slug}/`)}>
          <Label>{L("Next project", "Следующий проект")}</Label>
          <span className="next-project__title" style={{ display: "block", marginTop: 16 }}>{next.title} →</span>
        </a>
      </section>
    </Layout>
  );
}

/* ---------------------------------------------------------------- Process */
export function Process() {
  const process = getProcess();
  return (
    <Layout meta={{ path: "process/", title: L("Process", "Процесс"), description: L("How HYDRA builds: Idea → Research → Design → Development → Testing → Launch.", "Как работает HYDRA: Идея → Исследование → Дизайн → Разработка → Тестирование → Запуск."), nav: "process" }}>
      <PageHead index={L("Process", "Процесс")} label={L("Idea → Launch", "Идея → Запуск")} lines={[L("Six steps.", "Шесть шагов."), L("No surprises.", "Без сюрпризов.")]} lead={L("Every project moves through the same six stages. The depth changes with the scope — a landing page and a Mini App need different research — but the order never does.", "Каждый проект проходит одни и те же шесть этапов. Глубина зависит от объёма — лендингу и Mini App нужно разное исследование, — но порядок не меняется никогда.")} />
      <section className="section" data-theme="dark" style={{ paddingTop: 0 }}>
        <div className="wrap pinned" data-pinned>
          <div className="pinned__aside">
            <div className="pinned__sticky" aria-hidden="true">
              <span className="label">{L("Stage", "Этап")}</span>
              <span className="pinned__num" data-pinned-num>01</span>
              <span className="pinned__name" data-pinned-name>{process[0].title}</span>
              <div className="pinned__bar"><i data-pinned-bar /></div>
              <span className="label">{process.map((s) => s.title).join(" → ")}</span>
            </div>
          </div>
          <div className="pinned__steps">
            {process.map((s, i) => (
              <article className="pstep" key={s.id} data-step={i} data-title={s.title} aria-labelledby={`step-${s.id}`}>
                <span className="index">{String(i + 1).padStart(2, "0")} / 06</span>
                <h2 id={`step-${s.id}`} className="h2">{s.title}</h2>
                <h3>{s.lead}</h3>
                <p className="muted prose">{s.text}</p>
                <div>
                  <Label accent>{L("Output", "Результат")}</Label>
                  <ul style={{ marginTop: 12 }}>{s.output.map((o) => <li key={o}>{o}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section" data-theme="light">
        <div className="wrap">
          <SectionHead index="FAQ" label={L("About the process", "О процессе")} title={<h2 className="h2" data-reveal>{L("Before we start", "Перед стартом")}</h2>} />
          <Faq items={getFaq().slice(2, 6)} />
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
    <Layout meta={{ path: "contact/", title: L("Contact", "Контакты"), description: L("Start a conversation with HYDRA: send a short brief or use the step-by-step Project Builder.", "Начните разговор с HYDRA: отправьте короткий бриф или заполните пошаговый Project Builder."), nav: "contact" }}>
      <PageHead index={L("Contact", "Контакты")} label={L("Let's talk", "Давайте обсудим")} lines={[L("Tell us", "Расскажите"), L("everything.", "всё.")]} lead={L("A few sentences are enough to start. We answer with questions or a scoped proposal — never with a template.", "Для начала хватит пары предложений. В ответ пришлём вопросы или предложение с объёмом работ — никогда не шаблон.")} />
      <section className="section" data-theme="light">
        <div className="wrap contact">
          <div className="contact__info">
            {SITE.contactEmail && <div className="channel"><Label>Email</Label><a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></div>}
            {SITE.contactTelegram && <div className="channel"><Label>Telegram</Label><a href={`https://t.me/${SITE.contactTelegram}`} target="_blank" rel="noopener noreferrer">@{SITE.contactTelegram}</a></div>}
            <div className="channel"><Label>Project Builder</Label><a href={href("start/")}>{L("Step-by-step brief →", "Пошаговый бриф →")}</a></div>
            <div className="channel"><Label>{L("Code & demos", "Код и демо")}</Label><a href={SITE.github} target="_blank" rel="noopener noreferrer">github.com/Timur-alt2008 ↗</a></div>
            <div className="channel"><Label>{L("Working", "Формат")}</Label><span>{L("Remotely, worldwide", "Удалённо, по всему миру")}</span></div>
            {mode === "demo" && <p className="muted" style={{ fontSize: "0.9rem" }}>{L("The forms on this site run in demo mode for now: they prepare your brief so you can copy or download it.", "Формы на сайте пока работают в демо-режиме: они готовят ваш бриф, чтобы его можно было скопировать или скачать.")}</p>}
          </div>
          <div className="contact__form"><ContactForm /></div>
        </div>
      </section>
      <section className="section" data-theme="ice">
        <div className="wrap">
          <SectionHead index="FAQ" label={L("Before you write", "Перед тем как написать")} title={<h2 className="h2" data-reveal>{L("Quick answers", "Быстрые ответы")}</h2>} />
          <Faq items={getFaq().slice(0, 4)} />
        </div>
      </section>
    </Layout>
  );
}

/* --------------------------------------------------------- Project Builder */
export function Start() {
  const types: [string, string, string][] = [
    ["web", L("Website", "Сайт"), L("Landing, corporate, multi-page or store", "Лендинг, корпоративный, многостраничный или магазин")],
    ["redesign", L("Redesign", "Редизайн"), L("Rework an existing site", "Переработка существующего сайта")],
    ["bot", L("Telegram bot", "Telegram-бот"), L("Orders, automation, notifications", "Заказы, автоматизация, уведомления")],
    ["miniapp", "Mini App", L("A full interface inside Telegram", "Полноценный интерфейс в Telegram")],
    ["products", L("Custom product", "Цифровой продукт"), L("Web app, tool, dashboard", "Веб-приложение, инструмент, дашборд")],
    ["unsure", L("Not sure yet", "Пока не знаю"), L("Help me choose", "Помогите выбрать")],
  ];
  const steps = [L("Product", "Продукт"), L("Task", "Задача"), L("Features", "Функции"), L("Budget", "Бюджет"), L("Timeline", "Сроки"), L("Contacts", "Контакты")];
  return (
    <Layout meta={{ path: "start/", title: "Project Builder", description: L("Build your project brief in six steps: product type, goal, features, budget, timeline and contacts.", "Соберите бриф проекта за шесть шагов: тип продукта, задача, функции, бюджет, сроки и контакты."), nav: "start" }}>
      <section className="page-head" data-theme="dark" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}><span className="index">Project Builder</span><Label>{L("About 3 minutes", "Около 3 минут")}</Label></div>
          <SplitTitle as="h1" className="page-head__title" lines={[L("Build your", "Соберите"), L("brief.", "бриф.")]} accentLine={1} />
        </div>
      </section>
      <section className="section" data-theme="light">
        <div className="wrap">
          <form className="builder" data-builder noValidate data-mode={contactMode()} data-email={SITE.contactEmail} data-telegram={SITE.contactTelegram} data-endpoint={SITE.formEndpoint}>
            <ol className="builder__steps" aria-label={L("Steps", "Шаги")}>
              {steps.map((s, i) => <li key={s} data-step-label={i} className={i === 0 ? "is-current" : undefined}>{s}</li>)}
            </ol>
            <div className="builder__panel">
              <div className="builder__progress" aria-hidden="true"><i data-builder-progress /></div>
              <p className="label" data-builder-count aria-live="polite">{L("Step 1 of 6", "Шаг 1 из 6")}</p>

              <fieldset className="builder__step" data-step="0">
                <legend className="h3">{L("What are we building?", "Что создаём?")}</legend>
                <div className="tiles">
                  {types.map(([v, t, d], i) => (
                    <label className="tile" key={v}><input type="radio" name="type" value={v} required /><span><span className="index">{String(i + 1).padStart(2, "0")}</span><b>{t}</b><small>{d}</small></span></label>
                  ))}
                </div>
                <span className="field__error" data-error="type" aria-live="polite" />
              </fieldset>

              <fieldset className="builder__step" data-step="1" hidden>
                <legend className="h3">{L("What is the main task?", "Какая главная задача?")}</legend>
                <div className="choices">
                  {[L("Launch something new", "Запустить что-то новое"), L("Replace an outdated solution", "Заменить устаревшее решение"), L("Get more requests or orders", "Получать больше заявок и заказов"), L("Automate routine work", "Автоматизировать рутину"), L("Validate an idea", "Проверить идею"), L("Something else", "Другое")].map((t) => (
                    <label className="choice" key={t}><input type="radio" name="task" value={t} required /><span>{t}</span></label>
                  ))}
                </div>
                <span className="field__error" data-error="task" aria-live="polite" />
                <div className="field">
                  <label htmlFor="b-context">{L("In a few words: what exists now, who are the users?", "Коротко: что есть сейчас, кто пользователи?")} <span className="muted">{L("(optional)", "(необязательно)")}</span></label>
                  <textarea id="b-context" name="context" maxLength={2000} />
                </div>
                <div className="field">
                  <label htmlFor="b-url">{L("Current website or reference", "Текущий сайт или пример")} <span className="muted">{L("(optional)", "(необязательно)")}</span></label>
                  <input id="b-url" name="url" type="url" inputMode="url" placeholder="https://" maxLength={300} />
                  <span className="field__error" data-error="url" aria-live="polite" />
                </div>
              </fieldset>

              <fieldset className="builder__step" data-step="2" hidden>
                <legend className="h3">{L("Which features do you need?", "Какие функции нужны?")}</legend>
                <p className="muted">{L("Pick everything that applies. The list adapts to the product type.", "Отметьте всё подходящее. Список зависит от типа продукта.")}</p>
                <div className="choices" data-features />
                <span className="field__error" data-error="features" aria-live="polite" />
              </fieldset>

              <fieldset className="builder__step" data-step="3" hidden>
                <legend className="h3">{L("Approximate budget", "Примерный бюджет")}</legend>
                <div className="choices">
                  {[L("Under $500", "До $500"), "$500 – $1,500", "$1,500 – $5,000", "$5,000 – $15,000", "$15,000+", L("Not sure yet", "Пока не знаю")].map((t) => (
                    <label className="choice" key={t}><input type="radio" name="budget" value={t} required /><span>{t}</span></label>
                  ))}
                </div>
                <span className="field__error" data-error="budget" aria-live="polite" />
                <p className="muted">{L("The range only helps us suggest the right scope for a first release.", "Диапазон нужен только для того, чтобы предложить правильный объём первого релиза.")}</p>
              </fieldset>

              <fieldset className="builder__step" data-step="4" hidden>
                <legend className="h3">{L("When do you need it?", "Когда нужно?")}</legend>
                <div className="choices">
                  {[L("As soon as possible", "Как можно скорее"), L("Within a month", "В течение месяца"), L("In 2–3 months", "Через 2–3 месяца"), L("No fixed deadline", "Без жёсткого срока")].map((t) => (
                    <label className="choice" key={t}><input type="radio" name="timeline" value={t} required /><span>{t}</span></label>
                  ))}
                </div>
                <span className="field__error" data-error="timeline" aria-live="polite" />
              </fieldset>

              <fieldset className="builder__step" data-step="5" hidden>
                <legend className="h3">{L("How can we reach you?", "Как с вами связаться?")}</legend>
                <div className="form__row">
                  <div className="field"><label htmlFor="b-name">{L("Name", "Имя")}</label><input id="b-name" name="name" autoComplete="name" required minLength={2} maxLength={80} /><span className="field__error" data-error="name" aria-live="polite" /></div>
                  <div className="field"><label htmlFor="b-contact">{L("Email or Telegram", "Email или Telegram")}</label><input id="b-contact" name="contact" required maxLength={120} placeholder={L("you@company.com or @username", "you@company.com или @username")} /><span className="field__error" data-error="contact" aria-live="polite" /></div>
                </div>
                <div className="field"><label htmlFor="b-company">{L("Company or project name", "Компания или проект")} <span className="muted">{L("(optional)", "(необязательно)")}</span></label><input id="b-company" name="company" maxLength={120} /></div>
                <label className="check"><input type="checkbox" name="consent" required /> <span>{L("I agree that HYDRA may use these details to reply to my request.", "Я согласен, что HYDRA использует эти данные, чтобы ответить на запрос.")}</span></label>
                <span className="field__error" data-error="consent" aria-live="polite" />
                <div className="summary" data-summary />
                <ModeNotice />
              </fieldset>

              <div className="confirm" data-confirm hidden tabIndex={-1} />

              <div className="builder__nav" data-builder-nav>
                <button className="btn btn--ghost" type="button" data-prev disabled><span>{L("Back", "Назад")}</span></button>
                <button className="btn" type="button" data-next><span data-next-label>{L("Next", "Далее")}</span><Icon name="arrow" /></button>
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
    <Layout meta={{ path: "404.html", title: L("Page not found", "Страница не найдена"), description: L("This page does not exist.", "Такой страницы нет."), noindex: true }}>
      <section data-theme="dark">
        <div className="wrap nf">
          <span className="index">{L("Error 404", "Ошибка 404")}</span>
          <SplitTitle as="h1" className="page-head__title" lines={["Cut off.", "Grow back."]} accentLine={1} />
          <p className="lead muted">{L("This head is gone. The rest of HYDRA is still here.", "Этой головы больше нет. Остальная HYDRA на месте.")} <span lang="ru">Эта страница не найдена.</span></p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Btn to="">{L("Back to home", "На главную")}</Btn><Btn to="projects/" ghost>{L("See projects", "Проекты")}</Btn></div>
        </div>
      </section>
    </Layout>
  );
}
