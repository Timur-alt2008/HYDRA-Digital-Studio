import { L } from "../i18n";

export type Service = {
  id: "web" | "redesign" | "telegram" | "products";
  index: string;
  title: string;
  short: string;
  headline: string;
  intro: string;
  includes: string[];
  deliverables: string[];
  stack: string[];
  fits: string[];
};

/** The four heads of T-HYDRA. Nothing outside these four is offered. */
export const getServices = (): Service[] => [
  {
    id: "web",
    index: "01",
    title: L("Web Development", "Веб-разработка"),
    short: L("Websites built from scratch — landing pages to multi-page platforms and online stores.", "Сайты с нуля — от лендингов до многостраничных платформ и интернет-магазинов."),
    headline: L("From a blank page to a production website.", "От чистого листа до работающего сайта."),
    intro: L(
      "We design and engineer websites without templates: the structure, the interface and the code are made for one project and one audience. You get a fast, responsive, accessible site that is easy to grow.",
      "Мы проектируем и разрабатываем сайты без шаблонов: структура, интерфейс и код создаются под один проект и одну аудиторию. Вы получаете быстрый, адаптивный и доступный сайт, который легко развивать."
    ),
    includes: [L("Landing pages", "Лендинги"), L("Corporate websites", "Корпоративные сайты"), L("Multi-page websites", "Многостраничные сайты"), L("Online stores", "Интернет-магазины"), L("Individual web projects", "Индивидуальные веб-проекты"), L("Turnkey development", "Разработка под ключ")],
    deliverables: [L("Information architecture and wireframes", "Информационная архитектура и прототипы"), L("Interface design in the browser", "Дизайн интерфейса сразу в браузере"), L("Responsive front-end, 320px to wide screens", "Адаптивная вёрстка — от 320 px до широких экранов"), L("Forms, filters, booking and other working logic", "Формы, фильтры, запись и другая рабочая логика"), L("SEO basics: meta, structured data, sitemap", "База SEO: мета-теги, микроразметка, sitemap"), L("Deployment and handover", "Публикация и передача проекта")],
    stack: ["HTML · CSS · TypeScript", "React · Next.js · Vite", "Node.js", L("Playwright testing", "Тестирование в Playwright")],
    fits: [L("You are launching a product, service or company", "Вы запускаете продукт, услугу или компанию"), L("You need a site that converts, not a brochure", "Нужен сайт, который приводит клиентов, а не просто буклет"), L("You want a site you can extend later", "Хотите сайт, который можно расширять дальше")],
  },
  {
    id: "redesign",
    index: "02",
    title: L("Website Redesign", "Редизайн сайтов"),
    short: L("A complete rework of an existing site — design, structure, interface and technology.", "Полная переработка существующего сайта — дизайн, структура, интерфейс и технологии."),
    headline: L("Keep what works. Rebuild everything that doesn't.", "Оставить то, что работает. Пересобрать всё остальное."),
    intro: L(
      "Redesign starts with an audit, not with a mood board. We study how the current site is used, what slows it down and where visitors get lost — then rebuild the structure, interface and code around that.",
      "Редизайн начинается с аудита, а не с мудборда. Мы изучаем, как используется текущий сайт, что его тормозит и где теряются посетители, — и пересобираем структуру, интерфейс и код вокруг этого."
    ),
    includes: [L("Full visual redesign", "Полное обновление дизайна"), L("New structure and navigation", "Новая структура и навигация"), L("Interface improvements", "Улучшение интерфейсов"), L("Modernised functionality", "Модернизация функциональности"), L("Responsive adaptation", "Адаптация под все устройства"), L("Technical update and speed", "Техническое обновление и скорость")],
    deliverables: [L("UX and technical audit", "UX- и технический аудит"), L("New information architecture", "Новая информационная архитектура"), L("Redesigned interface and content blocks", "Новый интерфейс и контентные блоки"), L("Migration of existing content", "Перенос существующего контента"), L("Performance and accessibility fixes", "Исправления скорости и доступности"), L("Before / after comparison", "Сравнение «до / после»")],
    stack: [L("Audit with T-HYDRA Design Intelligence", "Аудит в T-HYDRA Design Intelligence"), "Lighthouse · Core Web Vitals", L("Modern front-end stack", "Современный фронтенд-стек"), L("Redirect and SEO safety", "Сохранение SEO и редиректы")],
    fits: [L("The site looks outdated or breaks on phones", "Сайт выглядит устаревшим или ломается на телефонах"), L("Visitors do not find what they need", "Посетители не находят нужное"), L("The code base is hard to change", "Код сложно менять")],
  },
  {
    id: "telegram",
    index: "03",
    title: L("Telegram Development", "Telegram-разработка"),
    short: L("Telegram bots and Mini Apps — orders, automation, user systems and integrations.", "Telegram-боты и Mini Apps — заказы, автоматизация, пользовательские системы и интеграции."),
    headline: L("Products that live where your customers already chat.", "Продукты там, где ваши клиенты уже общаются."),
    intro: L(
      "We build Telegram bots that take orders, answer and automate routine work, and Mini Apps — full web interfaces that open inside Telegram with the user's account already in place.",
      "Мы делаем Telegram-ботов, которые принимают заказы, отвечают и автоматизируют рутину, и Mini Apps — полноценные веб-интерфейсы, которые открываются прямо в Telegram с уже готовым аккаунтом пользователя."
    ),
    includes: [L("Telegram bots", "Telegram-боты"), "Telegram Mini Apps", L("Interactive Telegram interfaces", "Интерактивные Telegram-интерфейсы"), L("Ordering bots", "Боты для заказов"), L("Automation", "Автоматизация"), L("User systems and integrations", "Пользовательские системы и интеграции")],
    deliverables: [L("Conversation and screen flows", "Сценарии диалогов и экранов"), L("Bot logic, menus and inline keyboards", "Логика бота, меню и inline-клавиатуры"), L("Mini App interface on the Telegram WebApp SDK", "Интерфейс Mini App на Telegram WebApp SDK"), L("Admin tools and notifications", "Админ-инструменты и уведомления"), L("Database and integrations", "База данных и интеграции"), L("Hosting and launch", "Хостинг и запуск")],
    stack: ["Python · aiogram", "Node.js · TypeScript", "Telegram Bot API · Mini Apps SDK", "SQLite · PostgreSQL"],
    fits: [L("Your clients already message you in Telegram", "Клиенты уже пишут вам в Telegram"), L("You want orders or bookings without a separate app", "Нужны заказы или запись без отдельного приложения"), L("Routine requests take your team's time", "Рутинные запросы отнимают время команды")],
  },
  {
    id: "products",
    index: "04",
    title: L("Custom Digital Products", "Цифровые продукты"),
    short: L("Web applications, digital tools and non-standard interfaces built around one idea.", "Веб-приложения, цифровые инструменты и нестандартные интерфейсы вокруг одной идеи."),
    headline: L("When the idea does not fit a template.", "Когда идея не помещается в шаблон."),
    intro: L(
      "Some ideas need their own product: an internal tool, a calculator, a dashboard, a configurator or an interface nobody has built yet. We turn the idea into a working web product — scoped, designed, engineered and tested.",
      "Некоторым идеям нужен собственный продукт: внутренний инструмент, калькулятор, дашборд, конфигуратор или интерфейс, которого ещё никто не делал. Мы превращаем идею в работающий веб-продукт — продуманный, спроектированный, разработанный и протестированный."
    ),
    includes: [L("Custom web applications", "Индивидуальные веб-приложения"), L("Digital tools", "Цифровые инструменты"), L("Non-standard web interfaces", "Нестандартные веб-интерфейсы"), L("Individual functional solutions", "Индивидуальные функциональные решения"), L("Ideas built from zero", "Реализация идей с нуля")],
    deliverables: [L("Product scoping and user flows", "Продуктовый скоуп и пользовательские сценарии"), L("Prototype to validate the idea", "Прототип для проверки идеи"), L("Interface and data design", "Проектирование интерфейса и данных"), L("Front-end and back-end engineering", "Фронтенд- и бэкенд-разработка"), L("Automated tests", "Автотесты"), L("Documentation and handover", "Документация и передача")],
    stack: ["TypeScript · React", "Node.js · Python", "REST API · SQLite · PostgreSQL", "Playwright"],
    fits: [L("You have an idea and need it working", "Есть идея, и нужно, чтобы она заработала"), L("Spreadsheets and manual steps no longer scale", "Таблицы и ручные шаги больше не справляются"), L("You need a tool your team will actually use", "Нужен инструмент, которым команда действительно будет пользоваться")],
  },
];

/** What T-HYDRA explicitly does not offer — focus is part of the brand. */
export const getNotOffered = () => [L("SEO promotion", "SEO-продвижение"), L("Paid advertising", "Контекстная реклама"), L("Social media management", "SMM"), L("Video production", "Видеопродакшн"), L("Branding as a separate service", "Брендинг как отдельная услуга"), L("Native mobile apps", "Нативные мобильные приложения")];
