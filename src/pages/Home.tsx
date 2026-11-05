import React from "react";
import { SITE, href } from "../config";
import { getCapabilities, getProcess } from "../data/content";
import { getCategories, getProjects } from "../data/projects";
import { getServices } from "../data/services";
import { BeforeAfter, ContactForm, Faq, ProjectMedia, StatusTag, TechList, TelegramDemo } from "../components/Blocks";
import { HydraCore } from "../components/HydraCore";
import { Layout, siteDescription } from "../components/Layout";
import { Btn, Icon, Label, SectionHead, SplitTitle } from "../components/ui";
import { L } from "../i18n";

export function Home() {
  const projects = getProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const cats = getCategories();
  return (
    <Layout
      meta={{
        path: "",
        title: L("Independent digital development studio", "Независимая студия цифровой разработки"),
        description: siteDescription(),
        nav: "home",
        jsonLd: [{ "@context": "https://schema.org", "@type": "WebSite", name: SITE.legalName, url: SITE.origin + SITE.base }],
      }}
    >
      {/* 01 — hero */}
      <section className="hero" data-theme="dark" aria-labelledby="hero-title">
        <div className="wrap hero__grid">
          <div className="hero__top">
            <Label accent>We build digital experiences</Label>
            <Label>{L("Web · Redesign · Telegram · Products", "Веб · Редизайн · Telegram · Продукты")}</Label>
          </div>
          <SplitTitle as="h1" id="hero-title" className="hero__title" lines={[L("One core.", "Одно ядро."), L("Four heads.", "Четыре головы.")]} accentLine={1} />
          <div className="hero__intro">
            <p className="lead" data-reveal>
              {L("HYDRA designs and builds ", "HYDRA проектирует и разрабатывает ")}
              <strong>{L("websites", "сайты")}</strong>
              {L(", ", ", ")}
              <strong>{L("redesigns", "делает редизайн")}</strong>
              {L(" existing ones, ships ", " существующих, запускает ")}
              <strong>{L("Telegram bots & Mini Apps", "Telegram-ботов и Mini Apps")}</strong>
              {L(" and engineers ", " и создаёт ")}
              <strong>{L("custom digital products", "цифровые продукты")}</strong>
              {L(" — from the first idea to launch.", " — от первой идеи до запуска.")}
            </p>
            <div className="hero__ctas" data-reveal style={{ ["--i" as string]: 1 }}>
              <Btn to="start/">{L("Start a project", "Начать проект")}</Btn>
              <Btn to="projects/" ghost icon={null}>{L("See the work", "Смотреть работы")}</Btn>
            </div>
          </div>
          <div className="hero__core"><HydraCore /></div>
          <div className="hero__foot">
            <span className="label">{SITE.slogan}</span>
            <span className="label">{L("Scroll ↓", "Листайте ↓")}</span>
          </div>
        </div>
      </section>

      {/* 02 — the four heads */}
      <section className="section" data-theme="light" id="services">
        <div className="wrap">
          <SectionHead index="01 — 04" label={L("What we do", "Что мы делаем")} title={<SplitTitle className="h2" lines={[L("Four heads.", "Четыре головы."), L("One standard.", "Один стандарт.")]} />} aside={<p>{L("We don't do everything. We do four things — and design, UI/UX and engineering are part of each of them.", "Мы не делаем всё подряд. Мы делаем четыре вещи — и дизайн, UI/UX и инженерия входят в каждую из них.")}</p>} />
          <div className="heads">
            {getServices().map((s, i) => (
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
      <section className="section" data-theme="ice" aria-labelledby="brand-title">
        <div className="wrap">
          <SectionHead index={L("Manifesto", "Манифест")} label={L("Why HYDRA", "Почему HYDRA")} title={<h2 id="brand-title" className="sr-only">{L("Why HYDRA", "Почему HYDRA")}</h2>} />
          <p className="manifesto" data-reveal>
            {L("The hydra grows a new head for every one you cut. We work the same way: ", "У гидры на месте каждой отрубленной головы вырастает новая. Мы работаем так же: ")}
            <em>{L("every limit", "каждое ограничение")}</em>
            {L(" is a prompt for a better solution — researched, designed and engineered by ", " — повод найти лучшее решение, исследованное, спроектированное и разработанное ")}
            <em>{L("one core", "одним ядром")}</em>.
          </p>
          <div className="principles">
            {[
              ["01", L("Research before pixels", "Сначала исследование, потом пиксели"), L("Every project starts with evidence: your users, your current product and the best references, analysed with our own Design Intelligence tool.", "Каждый проект начинается с фактов: ваши пользователи, текущий продукт и лучшие референсы, проанализированные нашим инструментом Design Intelligence.")],
              ["02", L("Engineering is design", "Инженерия — это тоже дизайн"), L("Speed, accessibility and clean code are design decisions. A beautiful interface that breaks on a phone is not finished.", "Скорость, доступность и чистый код — это дизайнерские решения. Красивый интерфейс, который ломается на телефоне, не закончен.")],
              ["03", L("Launch is the beginning", "Запуск — это начало"), L("We build products that can grow: typed, documented, tested — ready for the next head.", "Мы делаем продукты, которые могут расти: типизированные, задокументированные, протестированные — готовые к следующей голове.")],
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
      <section className="section" data-theme="light" aria-labelledby="work-title">
        <div className="wrap">
          <SectionHead index={L("Selected work", "Избранные работы")} label={L("Demo projects & tools", "Демо-проекты и инструменты")} title={<h2 id="work-title" className="h2" data-reveal>{L("Work that", "Работы, которые")}<br />{L("proves the craft", "показывают уровень")}</h2>} aside={<p>{L("Our portfolio is honest: demo projects for fictional businesses, concepts and our own tools — each labelled, each with real code.", "Наше портфолио честное: демо-проекты для вымышленных компаний, концепты и собственные инструменты — каждый подписан, у каждого настоящий код.")}</p>} />
          <div className="work-list">
            {featured.map((p, i) => (
              <article className="work-item" key={p.slug}>
                <a className="work-item__media p-cover" href={href(`projects/${p.slug}/`)} aria-label={`${p.title} — ${L("open case", "открыть кейс")}`} data-reveal="clip" style={{ ["--vt" as string]: `cover-${p.slug}` }}>
                  <ProjectMedia p={p} />
                </a>
                <div className="work-item__meta" data-reveal style={{ ["--i" as string]: 1 }}>
                  <span className="index">{String(i + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}</span>
                  <h3 className="work-item__title"><a href={href(`projects/${p.slug}/`)}>{p.title}</a></h3>
                  <p className="muted">{p.summary}</p>
                  <div className="work-item__facts">
                    <StatusTag status={p.status} />
                    {p.categories.map((c) => <span className="chip" key={c}>{cats.find((x) => x.id === c)?.label}</span>)}
                  </div>
                  <a className="link-arrow" href={href(`projects/${p.slug}/`)}>{L("View case", "Смотреть кейс")} <Icon name="arrow" /></a>
                </div>
              </article>
            ))}
          </div>
          <div style={{ marginTop: "clamp(56px, 8vw, 120px)" }}><Btn to="projects/" ghost>{L("All projects", "Все проекты")} ({projects.length})</Btn></div>
        </div>
      </section>

      {/* 05 — capabilities */}
      <section className="section" data-theme="ice" aria-labelledby="cap-title">
        <div className="wrap">
          <SectionHead index={L("Capabilities", "Возможности")} label={L("Development", "Разработка")} title={<h2 id="cap-title" className="h2" data-reveal>{L("Spec sheet", "Спецификация")}</h2>} aside={<p>{L("What sits behind every project: the disciplines and tools we use, with no buzzwords attached.", "Что стоит за каждым проектом: дисциплины и инструменты, без модных слов.")}</p>} />
          <div className="spec">
            {getCapabilities().map((c, i) => (
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
            <span className="index">03 — {L("Telegram Development", "Telegram-разработка")}</span>
            <h2 id="tg-title" className="h2" data-reveal>{L("Your product,", "Ваш продукт —")}<br />{L("inside the chat", "прямо в чате")}</h2>
            <p className="lead muted" data-reveal>{L("Bots answer, take orders and automate routine. Mini Apps open full interfaces inside Telegram — with the user's account already in place. Try both on the right.", "Боты отвечают, принимают заказы и автоматизируют рутину. Mini Apps открывают полноценные интерфейсы прямо в Telegram — с готовым аккаунтом пользователя. Попробуйте оба варианта справа.")}</p>
            <ul className="features" style={{ gridTemplateColumns: "1fr" }}>
              <li>{L("Ordering and booking bots with inline keyboards", "Боты для заказов и записи с inline-клавиатурами")}</li>
              <li>{L("Mini Apps built on the Telegram WebApp SDK", "Mini Apps на Telegram WebApp SDK")}</li>
              <li>{L("Notifications, admin tools and integrations", "Уведомления, админ-инструменты и интеграции")}</li>
            </ul>
            <div><Btn to="services/#telegram" ghost>{L("Telegram development", "Telegram-разработка")}</Btn></div>
          </div>
          <TelegramDemo />
        </div>
      </section>

      {/* 07 — before / after */}
      <section className="section" data-theme="light" aria-labelledby="ba-title">
        <div className="wrap">
          <SectionHead index={L("02 — Redesign", "02 — Редизайн")} label={L("Before / after", "До / после")} title={<h2 id="ba-title" className="h2" data-reveal>{L("Same brief.", "Тот же бриф.")}<br />{L("New standard.", "Новый стандарт.")}</h2>} aside={<p>{L("Drag the handle to compare the first and the redesigned versions of our own demo projects.", "Перетащите ползунок, чтобы сравнить первую и обновлённую версии наших демо-проектов.")}</p>} />
          <BeforeAfter />
        </div>
      </section>

      {/* 08 — process */}
      <section className="section" data-theme="dark" aria-labelledby="process-title">
        <div className="wrap">
          <SectionHead index={L("Process", "Процесс")} label={L("How a project moves", "Как движется проект")} title={<h2 id="process-title" className="h2" data-reveal>{L("Idea → Launch", "Идея → Запуск")}</h2>} aside={<a className="link-arrow" href={href("process/")}>{L("The full process", "Весь процесс")} <Icon name="arrow" /></a>} />
          <ol className="process-strip" data-reveal-group>
            {getProcess().map((s, i) => (
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
      <section className="section section--tight" data-theme="light" aria-labelledby="tech-title">
        <div className="wrap"><SectionHead index={L("Stack", "Стек")} label={L("Technologies", "Технологии")} title={<h2 id="tech-title" className="h2" data-reveal>{L("Tools, not trends", "Инструменты, а не тренды")}</h2>} /></div>
        <TechList />
      </section>

      {/* 10 — FAQ */}
      <section className="section" data-theme="ice" aria-labelledby="faq-title">
        <div className="wrap">
          <SectionHead index="FAQ" label={L("Questions", "Вопросы")} title={<h2 id="faq-title" className="h2" data-reveal>{L("Good questions", "Хорошие вопросы")}</h2>} />
          <Faq />
        </div>
      </section>

      {/* 11 — collaboration */}
      <section className="section" data-theme="dark" aria-labelledby="form-title" id="contact">
        <div className="wrap contact">
          <div className="contact__info">
            <span className="index">{L("Collaboration", "Сотрудничество")}</span>
            <h2 id="form-title" className="h2" data-reveal>{L("Tell us", "Расскажите,")}<br />{L("what to build", "что создать")}</h2>
            <p className="muted">{L("Short brief here, or a detailed one in the Project Builder. We reply with questions or a scoped proposal.", "Короткий бриф — здесь, подробный — в Project Builder. В ответ пришлём вопросы или предложение с объёмом работ.")}</p>
          </div>
          <div className="contact__form"><ContactForm compact /></div>
        </div>
      </section>
    </Layout>
  );
}
