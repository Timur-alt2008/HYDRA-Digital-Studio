import { L } from "../i18n";

export const getProcess = () => [
  {
    id: "idea",
    title: L("Idea", "Идея"),
    lead: L("We start with your goal, not with a layout.", "Начинаем с вашей цели, а не с макета."),
    text: L("A short call or a filled Project Builder. We clarify what success looks like, who the users are, what already exists and what the constraints are.", "Короткий созвон или заполненный Project Builder. Уточняем, что считать успехом, кто пользователи, что уже есть и какие ограничения."),
    output: [L("Project goal in one sentence", "Цель проекта в одном предложении"), L("Scope of the first release", "Объём первого релиза"), L("Questions and risks", "Вопросы и риски")],
  },
  {
    id: "research",
    title: L("Research", "Исследование"),
    lead: L("Evidence before pixels.", "Сначала факты, потом пиксели."),
    text: L("We study your current product, your competitors and strong references with HYDRA Design Intelligence — keeping techniques that fit and rejecting the rest.", "Изучаем ваш текущий продукт, конкурентов и сильные референсы в HYDRA Design Intelligence — оставляем подходящие приёмы и отсеиваем остальное."),
    output: [L("Reference library with scored ideas", "Библиотека референсов с оценёнными идеями"), L("UX and technical audit (for redesigns)", "UX- и технический аудит (для редизайна)"), L("Content and feature map", "Карта контента и функций")],
  },
  {
    id: "design",
    title: L("Design", "Дизайн"),
    lead: L("Structure first, style second.", "Сначала структура, потом стиль."),
    text: L("Information architecture and key flows come first, then the visual system: typography, colour, grid and motion — designed directly for the browser.", "Сначала информационная архитектура и ключевые сценарии, затем визуальная система: типографика, цвет, сетка и анимация — сразу для браузера."),
    output: [L("Sitemap and user flows", "Карта сайта и пользовательские сценарии"), L("Visual system and key screens", "Визуальная система и ключевые экраны"), L("Motion principles", "Принципы анимации")],
  },
  {
    id: "development",
    title: L("Development", "Разработка"),
    lead: L("Clean, typed, maintainable code.", "Чистый, типизированный, поддерживаемый код."),
    text: L("We build in small, reviewable steps with real content. Data is centralised, components are reusable, and every interactive element works with a keyboard.", "Разрабатываем небольшими проверяемыми шагами на реальном контенте. Данные централизованы, компоненты переиспользуются, а каждый интерактивный элемент работает с клавиатуры."),
    output: [L("Working staging version", "Рабочая тестовая версия"), L("Reusable components", "Переиспользуемые компоненты"), L("Integrations and admin tools", "Интеграции и админ-инструменты")],
  },
  {
    id: "testing",
    title: L("Testing", "Тестирование"),
    lead: L("Nine screen sizes, every link, every form.", "Девять размеров экрана, каждая ссылка, каждая форма."),
    text: L("Automated browser tests check pages, links, forms and menus from 360px phones to 1920px monitors, plus performance and accessibility checks.", "Автотесты в браузере проверяют страницы, ссылки, формы и меню — от телефонов 360 px до мониторов 1920 px, плюс скорость и доступность."),
    output: [L("Playwright test report", "Отчёт Playwright"), L("Performance and accessibility pass", "Проверка скорости и доступности"), L("Fix list closed", "Закрытый список исправлений")],
  },
  {
    id: "launch",
    title: L("Launch", "Запуск"),
    lead: L("Launch is the beginning.", "Запуск — это только начало."),
    text: L("Deployment, domain, analytics if you need it, documentation and a handover session. After launch we stay available for the next iteration.", "Публикация, домен, аналитика при необходимости, документация и передача проекта. После запуска остаёмся на связи для следующей итерации."),
    output: [L("Production deployment", "Публикация в продакшн"), L("Documentation and access", "Документация и доступы"), L("Plan for the next iteration", "План следующей итерации")],
  },
];

export const getCapabilities = () => [
  { area: L("Interfaces", "Интерфейсы"), detail: L("Semantic HTML, modern CSS (grid, container queries, view transitions), TypeScript, React", "Семантический HTML, современный CSS (grid, container queries, view transitions), TypeScript, React"), tag: "Front-end" },
  { area: L("Motion", "Анимация"), detail: L("CSS and SVG animation, scroll-driven reveals, GSAP when a timeline needs it — always with reduced-motion fallbacks", "CSS- и SVG-анимация, появление при прокрутке, GSAP там, где нужен таймлайн, — всегда с режимом уменьшенной анимации"), tag: "Motion" },
  { area: L("Applications", "Приложения"), detail: L("Next.js, React + Vite, routing, state, forms and validation, API integration", "Next.js, React + Vite, роутинг, состояние, формы и валидация, интеграция API"), tag: "Web apps" },
  { area: L("Back-end", "Бэкенд"), detail: L("Node.js, Python, REST APIs, SQLite and PostgreSQL, auth and admin tools", "Node.js, Python, REST API, SQLite и PostgreSQL, авторизация и админки"), tag: L("Server", "Сервер") },
  { area: "Telegram", detail: L("Bots on aiogram and the Bot API, Mini Apps on the WebApp SDK, payments-ready architecture", "Боты на aiogram и Bot API, Mini Apps на WebApp SDK, архитектура с учётом платежей"), tag: "Telegram" },
  { area: L("Quality", "Качество"), detail: L("Playwright end-to-end tests on nine viewports, linting, Lighthouse and accessibility checks", "E2E-тесты Playwright на девяти разрешениях, линтинг, Lighthouse и проверки доступности"), tag: "QA" },
  { area: L("Performance", "Скорость"), detail: L("Static generation where possible, image optimisation, lazy loading, font strategy", "Статическая генерация, где возможно, оптимизация изображений, ленивая загрузка, стратегия шрифтов"), tag: L("Speed", "Скорость") },
  { area: L("Research", "Исследования"), detail: L("Our own Design Intelligence tool for references, design tokens and motion analysis", "Собственный инструмент Design Intelligence для референсов, дизайн-токенов и анализа анимаций"), tag: "R&D" },
];

export const getTechnologies = (): Record<string, string[]> => ({
  "Front-end": ["HTML", "CSS", "TypeScript", "React", "Next.js", "Vite"],
  [L("Motion", "Анимация")]: ["CSS animation", "SVG", "View Transitions", "GSAP", "Motion"],
  [L("Back-end", "Бэкенд")]: ["Node.js", "Python", "Fastify", "REST", "SQLite", "PostgreSQL", "Prisma"],
  Telegram: ["Bot API", "aiogram", "Mini Apps SDK"],
  [L("Quality", "Качество")]: ["Playwright", "pytest", "Lighthouse", "axe"],
});

export const getFaq = () => [
  { q: L("What exactly does HYDRA do?", "Чем именно занимается HYDRA?"), a: L("Four things: websites from scratch, redesign of existing websites, Telegram bots and Mini Apps, and custom digital products such as web tools and dashboards. Design and UI/UX are part of every project.", "Четырьмя вещами: сайты с нуля, редизайн существующих сайтов, Telegram-боты и Mini Apps, а также цифровые продукты — веб-инструменты и дашборды. Дизайн и UI/UX входят в каждый проект.") },
  { q: L("What don't you do?", "Чем вы не занимаетесь?"), a: L("We don't sell SEO promotion, advertising, social media management, video production, standalone branding or native mobile apps. We prefer to be excellent at four things.", "Мы не продаём SEO-продвижение, рекламу, SMM, видеопродакшн, брендинг отдельной услугой и нативные мобильные приложения. Нам важнее быть отличными в четырёх направлениях.") },
  { q: L("Can you take over a project that someone else started?", "Можете подхватить проект, который начал кто-то другой?"), a: L("Yes. HYDRA can join at any stage — an idea, a half-built product or a live site that needs a redesign. We start with an audit of what exists.", "Да. HYDRA подключается на любом этапе — идея, недоделанный продукт или работающий сайт, которому нужен редизайн. Начинаем с аудита того, что есть.") },
  { q: L("Which projects in the portfolio are real clients?", "Какие проекты в портфолио — реальные клиенты?"), a: L("The portfolio shows our own demo projects and concepts. Every one of them is labelled Demo, Concept or Internal tool, and the businesses inside the demos are fictional. The code is real and published on GitHub.", "В портфолио — наши собственные демо-проекты и концепты. Каждый подписан: «Демо», «Концепт» или «Внутренний инструмент», а компании внутри демо вымышленные. Код настоящий и опубликован на GitHub.") },
  { q: L("How do you estimate price and timeline?", "Как вы оцениваете стоимость и сроки?"), a: L("After the Project Builder or a short call we send a scoped proposal with a fixed first release. The budget range you pick in the builder helps us suggest the right scope.", "После Project Builder или короткого созвона присылаем предложение с чётким объёмом первого релиза. Диапазон бюджета, выбранный в форме, помогает предложить правильный объём.") },
  { q: L("Will I be able to edit the site myself?", "Смогу ли я сам редактировать сайт?"), a: L("Yes, if you need it. We can connect a CMS or build a simple admin, and we hand over documentation for everything we build.", "Да, если нужно. Подключим CMS или сделаем простую админку и передадим документацию по всему, что сделали.") },
  { q: L("Do you work with international clients?", "Работаете с клиентами из других стран?"), a: L("Yes. HYDRA works remotely; the whole process — calls, files and reviews — runs online.", "Да. HYDRA работает удалённо: созвоны, файлы и согласования — всё онлайн.") },
];
