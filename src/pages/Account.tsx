import React from "react";
import { accountMode } from "../config";
import { Layout } from "../components/Layout";
import { Btn, Icon, Label, SplitTitle } from "../components/ui";
import { L } from "../i18n";

/**
 * "My account": sign in / create an account, then the visitor's requests split into active and completed.
 * The page is a server-rendered shell; behaviour lives in client/account.ts and client/account-store.ts.
 */
export function Account() {
  const demo = accountMode() === "demo";
  return (
    <Layout meta={{ path: "account/", title: L("My account", "Личный кабинет"), description: L("Sign in to T-HYDRA to follow your requests: what is new, in progress and completed.", "Войдите в T-HYDRA, чтобы следить за своими заявками: новые, в работе и выполненные."), nav: "account", noindex: true }}>
      <section className="page-head" data-theme="dark">
        <div className="wrap">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}><span className="index">{L("Account", "Аккаунт")}</span><Label>{L("Your requests in one place", "Ваши заявки в одном месте")}</Label></div>
          <SplitTitle as="h1" className="page-head__title" lines={[L("My", "Личный"), L("account.", "кабинет.")]} accentLine={1} />
          <div className="page-head__row">
            <div className="page-head__aside" />
            <p className="page-head__lead lead" data-reveal>{L("Create an account once — every brief you send while signed in is saved here, and you can see its status: new, in review, in progress or completed.", "Создайте аккаунт один раз — каждый бриф, отправленный после входа, сохраняется здесь, и вы видите его статус: новая, на рассмотрении, в работе или выполнена.")}</p>
          </div>
        </div>
      </section>

      <section className="section" data-theme="light">
        <div className="wrap account" data-account data-mode={accountMode()}>
          {demo && (
            <p className="notice" data-account-demo>
              {L("Demo mode: accounts and requests are stored only in this browser. Real accounts switch on when the studio database is connected.", "Демо-режим: аккаунты и заявки хранятся только в этом браузере. Настоящие аккаунты включатся после подключения базы данных студии.")}
            </p>
          )}
          <noscript><p className="notice">{L("My account needs JavaScript.", "Для личного кабинета нужен JavaScript.")}</p></noscript>

          {/* ------------------------------------------------ sign in / sign up */}
          <div className="auth" data-auth hidden>
            <div className="tabs" role="tablist" aria-label={L("Account", "Аккаунт")}>
              <button role="tab" id="tab-signin" aria-selected="true" aria-controls="panel-signin" data-auth-tab="signin" type="button">{L("Sign in", "Войти")}</button>
              <button role="tab" id="tab-signup" aria-selected="false" aria-controls="panel-signup" data-auth-tab="signup" type="button" tabIndex={-1}>{L("Create account", "Регистрация")}</button>
            </div>

            <form className="form auth__form" id="panel-signin" role="tabpanel" aria-labelledby="tab-signin" data-signin noValidate>
              <h2 className="h3">{L("Welcome back", "С возвращением")}</h2>
              <div className="field">
                <label htmlFor="si-email">Email</label>
                <input id="si-email" name="email" type="email" autoComplete="email" required maxLength={120} />
                <span className="field__error" aria-live="polite" />
              </div>
              <div className="field">
                <label htmlFor="si-password">{L("Password", "Пароль")}</label>
                <input id="si-password" name="password" type="password" autoComplete="current-password" required maxLength={128} />
                <span className="field__error" aria-live="polite" />
              </div>
              <p className="field__error" data-form-error aria-live="polite" />
              <button className="btn" type="submit"><span>{L("Sign in", "Войти")}</span><Icon name="arrow" /></button>
              <p className="muted auth__switch">{L("No account yet?", "Ещё нет аккаунта?")} <button type="button" className="link-arrow" data-auth-go="signup">{L("Create one", "Зарегистрируйтесь")}</button></p>
            </form>

            <form className="form auth__form" id="panel-signup" role="tabpanel" aria-labelledby="tab-signup" data-signup noValidate hidden>
              <h2 className="h3">{L("Create your account", "Создайте аккаунт")}</h2>
              <div className="field">
                <label htmlFor="su-name">{L("Name", "Имя")}</label>
                <input id="su-name" name="name" autoComplete="name" required minLength={2} maxLength={80} />
                <span className="field__error" aria-live="polite" />
              </div>
              <div className="field">
                <label htmlFor="su-email">Email</label>
                <input id="su-email" name="email" type="email" autoComplete="email" required maxLength={120} />
                <span className="field__error" aria-live="polite" />
              </div>
              <div className="field">
                <label htmlFor="su-password">{L("Password", "Пароль")} <span className="muted">{L("(at least 8 characters)", "(не меньше 8 символов)")}</span></label>
                <input id="su-password" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} />
                <span className="field__error" aria-live="polite" />
              </div>
              <label className="check"><input type="checkbox" name="consent" required /> <span>{L("I agree that T-HYDRA stores my name, email and requests to process them.", "Я согласен, что T-HYDRA хранит моё имя, email и заявки, чтобы их обрабатывать.")}</span></label>
              <span className="field__error" data-consent-error aria-live="polite" />
              <p className="field__error" data-form-error aria-live="polite" />
              <button className="btn" type="submit"><span>{L("Create account", "Зарегистрироваться")}</span><Icon name="arrow" /></button>
              <p className="muted auth__switch">{L("Already have an account?", "Уже есть аккаунт?")} <button type="button" className="link-arrow" data-auth-go="signin">{L("Sign in", "Войти")}</button></p>
            </form>
            <div className="confirm" data-auth-confirm hidden tabIndex={-1} />
          </div>

          {/* ------------------------------------------------ dashboard */}
          <div className="dash" data-dash hidden>
            <div className="dash__head">
              <div className="dash__who">
                <span className="dash__avatar" aria-hidden="true" data-dash-initial>T</span>
                <div>
                  <p className="h3" data-dash-name />
                  <p className="muted" data-dash-email />
                </div>
              </div>
              <div className="dash__actions">
                <Btn to="start/" small>{L("New request", "Новая заявка")}</Btn>
                <button className="btn btn--ghost btn--small" type="button" data-signout><span>{L("Sign out", "Выйти")}</span></button>
              </div>
            </div>

            <div className="dash__stats" data-dash-stats />

            <div className="tabs" role="tablist" aria-label={L("Requests", "Заявки")} data-dash-tabs>
              <button role="tab" id="tab-active" aria-selected="true" aria-controls="list-active" data-dash-tab="active" type="button">{L("Active", "Активные")} <sup data-count="active">0</sup></button>
              <button role="tab" id="tab-closed" aria-selected="false" aria-controls="list-closed" data-dash-tab="closed" type="button" tabIndex={-1}>{L("Completed", "Выполненные")} <sup data-count="closed">0</sup></button>
              <button role="tab" id="tab-studio" aria-selected="false" aria-controls="list-studio" data-dash-tab="studio" type="button" tabIndex={-1} hidden>{L("All requests (studio)", "Все заявки (студия)")} <sup data-count="studio">0</sup></button>
            </div>
            <div className="req-list" id="list-active" role="tabpanel" aria-labelledby="tab-active" data-list="active" />
            <div className="req-list" id="list-closed" role="tabpanel" aria-labelledby="tab-closed" data-list="closed" hidden />
            <div className="req-list" id="list-studio" role="tabpanel" aria-labelledby="tab-studio" data-list="studio" hidden />

            {demo && (
              <label className="check studio-sim">
                <input type="checkbox" data-studio-sim />
                <span><b>{L("Studio simulation (demo)", "Режим студии (демо)")}</b> — {L("change the status of your requests here to see how a request moves to “Completed”. With the real database only the studio can do this.", "меняйте статусы своих заявок, чтобы увидеть, как заявка переходит в «Выполненные». С настоящей базой это может делать только студия.")}</span>
              </label>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
