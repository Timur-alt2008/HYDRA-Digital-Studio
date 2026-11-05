import React from "react";
import { SITE, asset, contactMode, href } from "../config";
import { getFaq, getTechnologies } from "../data/content";
import { getCategories, getProjects, statusLabel, type Project } from "../data/projects";
import { L } from "../i18n";
import { ProjectArt } from "./Art";
import { Btn, Frame, Icon, Label } from "./ui";

export function ProjectMedia({ p, eager }: { p: Project; eager?: boolean }) {
  const big = p.cover?.startsWith("hdi");
  if (p.cover) return <Frame src={p.cover} alt={`${p.title} — ${L("screenshot", "скриншот")}`} url={p.live || p.repo} eager={eager} width={big ? 1360 : 800} height={big ? 860 : 500} />;
  return <div className="art"><ProjectArt kind={p.art || ""} accent={p.accent} title={p.title} /></div>;
}

export function StatusTag({ status }: { status: Project["status"] }) {
  return <span className={`status status--${status.split(" ")[0]}`}>{statusLabel(status)}</span>;
}

export function ProjectTile({ p, i }: { p: Project; i: number }) {
  const cats = getCategories();
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
        {p.categories.map((c) => <span className="chip" key={c}>{cats.find((x) => x.id === c)?.label}</span>)}
        <span className="chip">{p.year}</span>
      </div>
    </a>
  );
}

export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((t, i) => <span className="marquee__item" key={i}>{t}</span>)}
        {items.map((t, i) => <span className="marquee__item" key={`d${i}`}>{t}</span>)}
      </div>
    </div>
  );
}

export function TechList() {
  const tech = getTechnologies();
  return (
    <>
      <Marquee items={Object.values(tech).flat().slice(0, 14)} />
      <div className="wrap">
        <div className="tech-groups">
          {Object.entries(tech).map(([group, items], i) => (
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
      <div className="tabs" role="tablist" aria-label={L("Telegram demo view", "Режим Telegram-демо")}>
        <button role="tab" id="tg-tab-bot" aria-selected="true" aria-controls="tg-panel-bot" data-tg-tab="bot">{L("Bot", "Бот")}</button>
        <button role="tab" id="tg-tab-app" aria-selected="false" aria-controls="tg-panel-app" data-tg-tab="app" tabIndex={-1}>Mini App</button>
      </div>
      <div className="device">
        <div className="device__screen">
          <div className="tg-bar">
            <div className="tg-bar__avatar" aria-hidden="true">H</div>
            <div>
              <div className="tg-bar__name">{L("Studio Booking (demo)", "Запись в студию (демо)")}</div>
              <div className="tg-bar__sub" data-tg-sub>{L("bot", "бот")}</div>
            </div>
          </div>
          <div id="tg-panel-bot" role="tabpanel" aria-labelledby="tg-tab-bot" style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <div className="tg-chat" data-tg-chat aria-live="polite">
              <div className="msg msg--bot">{L("Hi! I'm a demo booking bot. Pick an option below 👇", "Привет! Я демо-бот для записи. Выберите вариант ниже 👇")}<time>12:00</time></div>
            </div>
            <div className="tg-keys" data-tg-keys>
              <button type="button" data-q="services">{L("What can you do?", "Что ты умеешь?")}</button>
              <button type="button" data-q="book">{L("Book a session", "Записаться")}</button>
              <button type="button" data-q="hours">{L("Opening hours", "Часы работы")}</button>
              <button type="button" data-q="human">{L("Talk to a human", "Связаться с человеком")}</button>
              <button type="button" className="wide" data-q="app">{L("Open Mini App ↗", "Открыть Mini App ↗")}</button>
            </div>
          </div>
          <div id="tg-panel-app" role="tabpanel" aria-labelledby="tg-tab-app" hidden style={{ flexDirection: "column", flex: 1, minHeight: 0 }}>
            <div className="mini" data-mini />
            <button className="mini__main" type="button" data-mini-main disabled>{L("Choose a service", "Выберите услугу")}</button>
          </div>
        </div>
      </div>
      <span className="label">{L("Interactive demo · fictional studio · nothing is sent", "Интерактивное демо · вымышленная студия · ничего не отправляется")}</span>
    </div>
  );
}

export function BeforeAfter() {
  const pairs = getProjects().filter((p) => p.before && p.cover);
  const first = pairs[0];
  return (
    <div className="ba" data-ba>
      <div className="ba__controls">
        <div className="tabs" role="tablist" aria-label={L("Redesign examples", "Примеры редизайна")}>
          {pairs.map((p, i) => (
            <button key={p.slug} role="tab" aria-selected={i === 0} tabIndex={i === 0 ? 0 : -1} data-ba-pair={i} data-before={asset(`img/projects/${p.before!.src}.webp`)} data-after={asset(`img/projects/${p.cover}.webp`)} data-title={p.title} data-link={href(`projects/${p.slug}/`)}>
              {p.title.split(" ")[0]}
            </button>
          ))}
        </div>
        <a className="link-arrow" href={href(`projects/${first.slug}/`)} data-ba-link>{L("Open the case", "Открыть кейс")} <Icon name="arrow" /></a>
      </div>
      <div className="ba__stage" data-ba-stage data-label-before={L("first version", "первая версия")} data-label-after={L("redesigned version", "версия после редизайна")}>
        <img className="ba__before" src={asset(`img/projects/${first.before!.src}.webp`)} alt={`${first.title} — ${L("first version", "первая версия")}`} width={800} height={500} loading="lazy" data-ba-before />
        <img className="ba__after" src={asset(`img/projects/${first.cover}.webp`)} alt={`${first.title} — ${L("redesigned version", "версия после редизайна")}`} width={800} height={500} loading="lazy" data-ba-after />
        <span className="ba__tag ba__tag--before">{L("Before · v1", "До · v1")}</span>
        <span className="ba__tag ba__tag--after">{L("After · v2", "После · v2")}</span>
        <input className="ba__range" type="range" min="0" max="100" defaultValue="50" aria-label={L("Drag to compare the first version with the redesign", "Перетащите, чтобы сравнить первую версию с редизайном")} data-ba-range />
        <span className="ba__handle" aria-hidden="true" />
      </div>
      <p className="label">{L("Our own redesigns of earlier demo projects — both versions are live on GitHub Pages.", "Наши собственные редизайны ранних демо-проектов — обе версии опубликованы на GitHub Pages.")}</p>
    </div>
  );
}

export function Faq({ items }: { items?: { q: string; a: string }[] }) {
  const list = items || getFaq();
  return (
    <div className="faq">
      {list.map((f, i) => (
        <details key={i} data-reveal style={{ ["--i" as string]: i % 3 }}>
          <summary>{f.q}<i aria-hidden="true" /></summary>
          <div className="faq__body"><div><p>{f.a}</p></div></div>
        </details>
      ))}
    </div>
  );
}

export function ModeNotice() {
  if (contactMode() !== "demo") return null;
  return (
    <p className="notice">
      {L("Demo mode: this form validates and prepares your brief, which you can copy or download. Sending is switched off until the studio inbox is connected.", "Демо-режим: форма проверяет данные и готовит бриф, который можно скопировать или скачать. Отправка включится после подключения почты студии.")}
    </p>
  );
}

/** Short collaboration form used on the home and contact pages. Behaviour in client/forms.ts. */
export function ContactForm({ compact }: { compact?: boolean }) {
  const types = [L("Website", "Сайт"), L("Redesign", "Редизайн"), L("Telegram bot", "Telegram-бот"), "Mini App", L("Custom product", "Цифровой продукт"), L("Not sure yet", "Пока не знаю")];
  return (
    <form className="form" data-contact-form noValidate data-mode={contactMode()} data-email={SITE.contactEmail} data-telegram={SITE.contactTelegram} data-endpoint={SITE.formEndpoint}>
      <div className="form__row">
        <div className="field">
          <label htmlFor="cf-name">{L("Your name", "Ваше имя")}</label>
          <input id="cf-name" name="name" autoComplete="name" required minLength={2} maxLength={80} />
          <span className="field__error" aria-live="polite" />
        </div>
        <div className="field">
          <label htmlFor="cf-contact">{L("Email or Telegram", "Email или Telegram")}</label>
          <input id="cf-contact" name="contact" required maxLength={120} placeholder={L("you@company.com or @username", "you@company.com или @username")} autoComplete="email" />
          <span className="field__error" aria-live="polite" />
        </div>
      </div>
      <fieldset className="field">
        <legend>{L("What do you need?", "Что нужно?")}</legend>
        <div className="choices">
          {types.map((t, i) => (
            <label className="choice" key={t}><input type="radio" name="type" value={t} defaultChecked={i === 0} /><span>{t}</span></label>
          ))}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor="cf-message">{L("Tell us about the project", "Расскажите о проекте")}</label>
        <textarea id="cf-message" name="message" required minLength={20} maxLength={3000} placeholder={compact ? L("Goal, current situation, deadline…", "Цель, что есть сейчас, сроки…") : L("What are you building, for whom, what exists already, and when do you need it?", "Что вы создаёте, для кого, что уже есть и когда нужно?")} />
        <span className="field__error" aria-live="polite" />
      </div>
      <label className="check"><input type="checkbox" name="consent" required /> <span>{L("I agree that HYDRA may use these details to reply to my request. Nothing is shared with third parties.", "Я согласен, что HYDRA использует эти данные, чтобы ответить на запрос. Третьим лицам ничего не передаётся.")}</span></label>
      <span className="field__error" data-consent-error aria-live="polite" />
      <ModeNotice />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <button className="btn" type="submit"><span>{L("Send request", "Отправить заявку")}</span><Icon name="arrow" /></button>
        <a className="link-arrow" href={href("start/")}>{L("Prefer a guided brief? Project Builder", "Нужен подробный бриф? Project Builder")} <Icon name="arrow" /></a>
      </div>
      <div className="confirm" data-confirm hidden tabIndex={-1} />
    </form>
  );
}

export function CtaBand() {
  return (
    <section className="section" data-theme="dark">
      <div className="wrap cta-band">
        <Label accent>{L("Next step", "Следующий шаг")}</Label>
        <p className="cta-band__title"><a href={href("start/")}>{L("Start a", "Начать")}<br />{L("project", "проект")} <span className="accent">→</span></a></p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Btn to="start/">{L("Open the Project Builder", "Открыть Project Builder")}</Btn>
          <Btn to="contact/" ghost>{L("Write to us", "Написать нам")}</Btn>
        </div>
      </div>
    </section>
  );
}
