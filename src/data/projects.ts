import { L } from "../i18n";

export type Category = "websites" | "redesign" | "bots" | "mini-apps" | "products";
export type Status = "Demo" | "Concept" | "Internal tool";

export const getCategories = (): { id: Category; label: string }[] => [
  { id: "websites", label: L("Websites", "Сайты") },
  { id: "redesign", label: L("Redesign", "Редизайн") },
  { id: "bots", label: L("Telegram Bots", "Telegram-боты") },
  { id: "mini-apps", label: "Telegram Mini Apps" },
  { id: "products", label: L("Digital Products", "Цифровые продукты") },
];

export const statusLabel = (s: Status) => (s === "Demo" ? L("Demo", "Демо") : s === "Concept" ? L("Concept", "Концепт") : L("Internal tool", "Внутренний инструмент"));

export type Project = {
  slug: string;
  title: string;
  client: string;
  categories: Category[];
  status: Status;
  year: number;
  summary: string;
  goal: string;
  approach: string;
  features: string[];
  stack: string[];
  cover?: string;
  mobile?: string;
  extra?: { src: string; alt: string }[];
  art?: "bot-music" | "bot-market" | "miniapp-market" | "miniapp-booking";
  live?: string;
  repo?: string;
  before?: { src: string; label: string; live?: string };
  accent: string;
  featured?: boolean;
};

const GH = "https://timur-alt2008.github.io/";
const REPO = "https://github.com/Timur-alt2008/";

/**
 * Every project here is real work published on GitHub, or a concept described as such.
 * The businesses inside the demos are fictional, which is why their status is "Demo".
 */
export const getProjects = (): Project[] => [
  {
    slug: "barber-atelier",
    title: "Barber Atelier",
    client: L("EXAMPLE — fictional barbershop", "EXAMPLE — вымышленный барбершоп"),
    categories: ["websites", "redesign"],
    status: "Demo",
    year: 2026,
    summary: L("A barbershop website built like an issue of a men's magazine: cover, manifesto, price list, profiles, lookbook and a booking ticket.", "Сайт барбершопа, собранный как номер мужского журнала: обложка, манифест, прайс, профили мастеров, лукбук и билет записи."),
    goal: L("Replace the first, template-like version of the barbershop site with a concept that has its own voice and a booking flow people finish.", "Заменить первую, шаблонную версию сайта на концепцию со своим характером и записью, которую люди доводят до конца."),
    approach: L("We treated the site as an editorial object — paper, ink and bottle green, monochrome photography, condensed and expanded type with a serif and a mono — and turned every section into a page of the issue.", "Мы отнеслись к сайту как к журналу: бумага, чернила и бутылочно-зелёный, монохромные фото, узкий и широкий гротеск с антиквой и моноширинным, — каждая секция стала страницей номера."),
    features: [L("Interactive price list with a floating photo preview", "Интерактивный прайс с плавающим превью фото"), L("Expanding barber panels that pre-fill the booking", "Раскрывающиеся карточки мастеров, которые заполняют запись"), L("Pinned horizontal lookbook with a keyboard- and swipe-friendly lightbox", "Закреплённый горизонтальный лукбук с лайтбоксом для клавиатуры и свайпа"), L("Booking ticket: service, barber, date, time slots, validation and a live summary (demo mode)", "Билет записи: услуга, мастер, дата, слоты, валидация и итог (демо-режим)"), L("Live opening status and weekly hours chart", "Живой статус «открыто/закрыто» и график работы"), L("Reduced-motion support", "Поддержка режима уменьшенной анимации")],
    stack: ["HTML", "CSS", "Vanilla JavaScript", L("No build step", "Без сборки")],
    cover: "probarbershop",
    live: GH + "ProBarbershop-ForExample-For-my-Portfolio/",
    repo: REPO + "ProBarbershop-ForExample-For-my-Portfolio",
    before: { src: "barbershop-v1", label: L("First version", "Первая версия"), live: GH + "EXAMPLE-Barbershop-for-Portfolio/" },
    accent: "#2f5d46",
    featured: true,
  },
  {
    slug: "coffee-house",
    title: L("Coffee House & Bakery", "Кофейня и пекарня"),
    client: L("Example — fictional coffee house in Podil, Kyiv", "Example — вымышленная кофейня на Подоле, Киев"),
    categories: ["websites", "redesign"],
    status: "Demo",
    year: 2026,
    summary: L("A five-page website for a European-style coffee house built around the idea of “coffee in your hands”.", "Пятистраничный сайт европейской кофейни вокруг идеи «кофе в ваших руках»."),
    goal: L("Rebuild the original single-page coffee site into a full multi-page experience with a menu, story, gallery and table booking.", "Превратить первый одностраничный сайт кофейни в полноценный многостраничный: меню, история, галерея и бронь столика."),
    approach: L("Warm rounded shapes, a barista's handwritten notes and a milk-to-chocolate palette, combined with genuinely useful interactions: a menu with search and deep links, and booking on a floor plan.", "Тёплые скруглённые формы, рукописные заметки бариста и палитра от молока до шоколада — вместе с действительно полезными функциями: меню с поиском и прямыми ссылками и бронь по плану зала."),
    features: [L("“Anatomy of a cup” — layers of espresso, water, milk and foam in real ratios", "«Анатомия чашки» — слои эспрессо, воды, молока и пены в реальных пропорциях"), L("Menu: 9 categories, 38 items, accessible tabs and search", "Меню: 9 категорий, 38 позиций, доступные вкладки и поиск"), L("Table booking on a floor plan with capacity and time slots", "Бронь столика по плану зала с вместимостью и слотами"), L("Live open/closed status and breakfast timer based on Kyiv time", "Живой статус работы и таймер завтраков по киевскому времени"), L("Gallery with filters and a lightbox", "Галерея с фильтрами и лайтбоксом"), L("Schema.org markup, sitemap and Open Graph", "Микроразметка Schema.org, sitemap и Open Graph")],
    stack: ["HTML", "CSS", "Vanilla JavaScript", "WebP/AVIF srcset"],
    cover: "procoffee",
    mobile: "procoffee-m",
    live: GH + "ProCoffee-For-Example-For-my-Portfolio/",
    repo: REPO + "ProCoffee-For-Example-For-my-Portfolio",
    before: { src: "coffee-v1", label: L("First version", "Первая версия"), live: GH + "Example-coffee-for-Portfolio/" },
    accent: "#9a6a3a",
    featured: true,
  },
  {
    slug: "fitness-club",
    title: L("Fitness Club Platform", "Платформа фитнес-клуба"),
    client: L("Example — fictional fitness club", "Example — вымышленный фитнес-клуб"),
    categories: ["websites"],
    status: "Demo",
    year: 2026,
    summary: L("A multi-page fitness club website with schedule, coaches, memberships, a member account and booking with live spot counts.", "Многостраничный сайт фитнес-клуба: расписание, тренеры, абонементы, личный кабинет и запись с живым счётчиком мест."),
    goal: L("Show that a static site can behave like a real product: bookings, memberships and an account that respect business rules.", "Показать, что статический сайт может вести себя как настоящий продукт: запись, абонементы и кабинет с бизнес-правилами."),
    approach: L("Hash routing and ES modules without a build step, plus a demo API layer that simulates latency, server-side validation, “fully booked” errors and double-submit protection.", "Hash-роутинг и ES-модули без сборки плюс демо-API, которое имитирует задержки, серверную валидацию, ошибки «мест нет» и защиту от двойной отправки."),
    features: [L("Program explorer, 7-day schedule with filters and spots left", "Обзор программ, расписание на 7 дней с фильтрами и остатком мест"), L("Membership finder quiz, comparison table and promo codes", "Квиз подбора абонемента, таблица сравнения и промокоды"), L("Member account: freeze, cancellations, history (demo data)", "Личный кабинет: заморозка, отмены, история (демо-данные)"), L("Demo API with idempotency keys and cancellation rules", "Демо-API с ключами идемпотентности и правилами отмены"), L("BMI and calorie calculators", "Калькуляторы ИМТ и калорий"), L("OpenStreetMap contact map", "Карта OpenStreetMap в контактах")],
    stack: ["HTML", "CSS", "JavaScript (ES modules)", "Hash router", "JSON-LD"],
    cover: "fitness",
    mobile: "fitness-m",
    live: GH + "Fitness-For-Example-For-my-Portfolio/",
    repo: REPO + "Fitness-For-Example-For-my-Portfolio",
    accent: "#c8f04a",
    featured: true,
  },
  {
    slug: "cinema",
    title: L("Cinema — Thriller & Horror", "Кинотеатр — триллеры и хорроры"),
    client: L("Cinema Example — fictional cinema", "Cinema Example — вымышленный кинотеатр"),
    categories: ["websites"],
    status: "Demo",
    year: 2026,
    summary: L("A cinema website with films, showtimes, interactive seat selection, test checkout and e-tickets.", "Сайт кинотеатра: фильмы, сеансы, интерактивный выбор мест, тестовая оплата и электронные билеты."),
    goal: L("Design a dark, cinematic experience where buying a ticket stays effortless — on desktop and on a phone.", "Сделать тёмный кинематографичный опыт, в котором купить билет по-прежнему легко — на компьютере и на телефоне."),
    approach: L("A psychological-thriller aesthetic with SVG posters and interiors, and a booking engine that generates showtimes, prices and seat occupancy.", "Эстетика психологического триллера с SVG-постерами и интерьерами и движок бронирования, который генерирует сеансы, цены и занятость мест."),
    features: [L("17 films with filters, search and sorting", "17 фильмов с фильтрами, поиском и сортировкой"), L("Interactive seating plan with VIP seats and a 10-minute hold", "Интерактивная схема зала с VIP-местами и бронью на 10 минут"), L("Checkout with promo codes and test payment", "Оформление с промокодами и тестовой оплатой"), L("E-ticket with QR code, SVG download and .ics calendar file", "Электронный билет с QR-кодом, SVG и файлом календаря .ics"), L("Account with orders, refunds and favourites", "Кабинет с заказами, возвратами и избранным"), L("Dedicated mobile seat-map layout", "Отдельная мобильная схема зала")],
    stack: ["HTML", "CSS", "JavaScript (ES modules)", "SVG"],
    cover: "cinema",
    mobile: "cinema-m",
    live: GH + "Cinema-For-Example-For-my-Portfolio/",
    repo: REPO + "Cinema-For-Example-For-my-Portfolio",
    accent: "#8e2a2a",
    featured: true,
  },
  {
    slug: "auto-service",
    title: L("Auto Service", "Автосервис"),
    client: L("Example Auto Service — fictional car service", "Example Auto Service — вымышленный автосервис"),
    categories: ["websites", "redesign"],
    status: "Demo",
    year: 2026,
    summary: L("A dark premium car-service website rebuilt in React + TypeScript + Vite, with services, gallery, process timeline and booking.", "Тёмный премиальный сайт автосервиса, пересобранный на React + TypeScript + Vite: услуги, галерея, этапы работ и запись."),
    goal: L("Move the first static version to a component-based React code base and raise the visual level to “premium”.", "Перенести первую статическую версию на компонентный React и поднять визуальный уровень до «премиума»."),
    approach: L("React + TypeScript components, parallax hero, a service catalogue with detail windows, filtered gallery and a booking form — all demo data clearly labelled.", "Компоненты на React + TypeScript, параллакс на первом экране, каталог услуг с подробными окнами, галерея с фильтрами и форма записи — все демо-данные подписаны."),
    features: [L("10 services with detail windows", "10 услуг с подробными окнами"), L("Gallery with filters and full-screen viewer", "Галерея с фильтрами и полноэкранным просмотром"), L("Process timeline and animated counters", "Шкала процесса и анимированные счётчики"), L("Booking form with validation", "Форма записи с валидацией"), L("Contacts with a schematic map", "Контакты со схемой проезда"), L("Static build published to GitHub Pages", "Статическая сборка на GitHub Pages")],
    stack: ["React", "TypeScript", "Vite", "Node.js"],
    cover: "autoservice-v2",
    live: GH + "AutoServise-For-Example-For-my-Portfolio/",
    repo: REPO + "AutoServise-For-Example-For-my-Portfolio",
    before: { src: "autoservice-v1", label: L("First version", "Первая версия"), live: GH + "example-auto-service-for-portfolio/" },
    accent: "#e2722f",
  },
  {
    slug: "premium-automotive",
    title: L("Premium Automotive", "Премиум-автостудия"),
    client: L("Example — fictional detailing studio and supercar rental", "Example — вымышленная детейлинг-студия и прокат суперкаров"),
    categories: ["websites"],
    status: "Demo",
    year: 2026,
    summary: L("A multi-page site for a detailing studio with a rental collection of 14 real supercars and luxury cars.", "Многостраничный сайт детейлинг-студии с коллекцией из 14 реальных суперкаров и люксовых авто для аренды."),
    goal: L("Combine two businesses — detailing and rentals — in one coherent, fast catalogue with working booking logic.", "Объединить два бизнеса — детейлинг и аренду — в одном понятном, быстром каталоге с рабочей логикой бронирования."),
    approach: L("A catalogue with URL-synced filters, car pages with spec readouts, a date-range booking calculator and a paint-layer diagram for detailing services.", "Каталог с фильтрами, синхронизированными с URL, страницы авто с характеристиками, калькулятор аренды по датам и схема слоёв ЛКП для детейлинга."),
    features: [L("Catalogue filters: brand, body, price range, power, seats", "Фильтры каталога: марка, кузов, цена, мощность, места"), L("Rental booking with live price, discounts and validation", "Бронирование с живой ценой, скидками и валидацией"), L("17 detailing services and 3 packages with comparison", "17 услуг детейлинга и 3 пакета со сравнением"), L("Before/after slider with mouse, touch and keyboard", "Слайдер «до/после» для мыши, тача и клавиатуры"), L("Page transitions and masked headline reveals", "Переходы между страницами и маски заголовков"), L("Everything off for prefers-reduced-motion", "Всё отключается при уменьшенной анимации")],
    stack: ["HTML", "CSS", "JavaScript", "Node build scripts", "Playwright"],
    cover: "automotive",
    live: GH + "Example-Premium-Automotive-For-my-Portfolio/",
    repo: REPO + "Example-Premium-Automotive-For-my-Portfolio",
    accent: "#c9b98f",
  },
  {
    slug: "beauty-salon",
    title: L("Quiet-Luxury Beauty Salon", "Салон красоты в стиле quiet luxury"),
    client: L("Beauty Example — fictional salon", "Beauty Example — вымышленный салон"),
    categories: ["websites"],
    status: "Demo",
    year: 2026,
    summary: L("A calm, editorial salon website with a service explorer, specialists' availability, booking and gift cards.", "Спокойный редакционный сайт салона: каталог услуг, расписание мастеров, запись и подарочные сертификаты."),
    goal: L("Make booking a beauty appointment feel as considered as the service itself.", "Сделать запись в салон такой же продуманной, как сама услуга."),
    approach: L("Soft serif typography and arched imagery, with a booking flow that goes service → specialist → slot → details and ends with a calendar file.", "Мягкая антиква и арочные изображения, а запись идёт по шагам: услуга → мастер → время → данные и заканчивается файлом календаря."),
    features: [L("Service menu with filters, search and a “visit plan” total", "Меню услуг с фильтрами, поиском и итогом «плана визита»"), L("Specialists with a 7-day availability strip", "Мастера с полосой доступности на 7 дней"), L("Booking with add-ons, promo code and .ics file", "Запись с доп. услугами, промокодом и файлом .ics"), L("My visits with the 24-hour cancellation rule", "«Мои визиты» с правилом отмены за 24 часа"), L("Gift cards with live preview", "Подарочные сертификаты с живым превью"), L("Responsive from 320px, keyboard accessible", "Адаптив от 320 px, управление с клавиатуры")],
    stack: ["HTML", "CSS", "JavaScript (ES modules)"],
    cover: "beauty",
    live: GH + "Beauty-For-Example-For-my-Portfolio/",
    repo: REPO + "Beauty-For-Example-For-my-Portfolio",
    accent: "#8b6b53",
  },
  {
    slug: "design-intelligence",
    title: "HYDRA Design Intelligence",
    client: L("HYDRA — our own research tool", "HYDRA — наш собственный инструмент исследования"),
    categories: ["products"],
    status: "Internal tool",
    year: 2026,
    summary: L("A website research system: it analyses public sites, extracts design and motion techniques, scores them for HYDRA and keeps a searchable reference library.", "Система исследования сайтов: анализирует публичные сайты, извлекает дизайнерские приёмы и анимации, оценивает их для HYDRA и хранит библиотеку референсов с поиском."),
    goal: L("Research before pixels: collect proven techniques systematically, filter out other companies' business models and turn the rest into concrete design recommendations.", "Сначала исследование, потом пиксели: системно собирать проверенные приёмы, отсеивать чужие бизнес-модели и превращать остальное в конкретные дизайн-рекомендации."),
    approach: L("Python + Playwright open a site in four viewports, an in-page probe reads tokens, typography, components and motion, and a scoring engine sorts every idea into High priority, Inspiration or Rejected. A local web app manages the library.", "Python + Playwright открывают сайт в четырёх разрешениях, встроенный зонд считывает цвета, типографику, компоненты и анимации, а система оценки раскладывает каждую идею на «Высокий приоритет», «Вдохновение» или «Отклонено». Библиотекой управляет локальное веб-приложение."),
    features: [L("URL validation with SSRF protection and robots.txt checks", "Проверка URL, защита от SSRF и учёт robots.txt"), L("Desktop, laptop, tablet and mobile screenshots", "Скриншоты для десктопа, ноутбука, планшета и телефона"), L("Design tokens, fonts, components and motion detection", "Определение цветов, шрифтов, компонентов и анимаций"), L("Six scores per idea and a design review checklist", "Шесть оценок для каждой идеи и чек-лист дизайн-ревью"), L("Library with search, filters, tags, notes and statuses", "Библиотека с поиском, фильтрами, тегами, заметками и статусами"), L("Recommendation engine that generated this site's direction", "Движок рекомендаций, который задал направление этого сайта")],
    stack: ["Python", "Playwright", "Chromium", "Vanilla JS UI", "pytest"],
    cover: "hdi-recs",
    extra: [{ src: "hdi-ideas", alt: L("Idea report: six scores, six answers and the design review checklist", "Отчёт по идее: шесть оценок, шесть ответов и чек-лист дизайн-ревью") }],
    repo: REPO + "HYDRA-Design-Intelligence",
    accent: "#3d58df",
    featured: true,
  },
  {
    slug: "booking-mini-app",
    title: "Booking Mini App",
    client: L("Interface demo — fictional studio", "Демо интерфейса — вымышленная студия"),
    categories: ["mini-apps"],
    status: "Demo",
    year: 2026,
    summary: L("A Telegram Mini App interface for booking a time slot, with a working bot conversation beside it. Try it on the home page.", "Интерфейс Telegram Mini App для записи на время и рядом — работающий диалог с ботом. Попробуйте на главной странице."),
    goal: L("Show how a booking flow feels when it opens inside Telegram instead of a separate website.", "Показать, каково записываться, когда всё открывается прямо в Telegram, а не на отдельном сайте."),
    approach: L("Mini App screens follow Telegram's interface conventions — a main button, compact lists and the user's theme — while the bot handles reminders and quick actions.", "Экраны Mini App следуют правилам интерфейса Telegram — главная кнопка, компактные списки, тема пользователя, — а бот отвечает за напоминания и быстрые действия."),
    features: [L("Bot conversation with quick replies", "Диалог с ботом и быстрые ответы"), L("Service and slot selection", "Выбор услуги и времени"), L("Main-button confirmation pattern", "Подтверждение главной кнопкой"), L("Booking summary returned to the chat", "Итог записи приходит в чат")],
    stack: ["TypeScript", L("Telegram Mini Apps SDK (target)", "Telegram Mini Apps SDK (целевой)"), L("Telegram Bot API (target)", "Telegram Bot API (целевой)")],
    art: "miniapp-booking",
    accent: "#3d58df",
  },
  {
    slug: "music-recognition-bot",
    title: L("Music Recognition Bot", "Бот распознавания музыки"),
    client: L("Concept", "Концепт"),
    categories: ["bots"],
    status: "Concept",
    year: 2026,
    summary: L("A Telegram bot that recognises a song from a voice message or audio clip and keeps a short history of what you found.", "Telegram-бот, который узнаёт песню по голосовому или аудио и хранит короткую историю найденного."),
    goal: L("Shazam-style recognition without leaving the chat, with protection against spam.", "Распознавание в духе Shazam, не выходя из чата, с защитой от спама."),
    approach: L("aiogram handlers for voice and audio, a recognition service behind a clean interface, SQLite for each user's last 10 tracks and rate limiting.", "Обработчики aiogram для голосовых и аудио, сервис распознавания за чистым интерфейсом, SQLite для 10 последних треков пользователя и ограничение частоты запросов."),
    features: [L("Voice and audio file recognition", "Распознавание голосовых и аудиофайлов"), L("History of the last 10 tracks", "История последних 10 треков"), L("Anti-spam rate limiting", "Антиспам-ограничение"), L("Inline buttons for sharing a result", "Inline-кнопки, чтобы поделиться результатом")],
    stack: ["Python", "aiogram", "SQLite"],
    art: "bot-music",
    accent: "#8fa9e0",
  },
  {
    slug: "marketplace-bot",
    title: L("Services Marketplace Bot", "Бот-маркетплейс услуг"),
    client: L("Concept", "Концепт"),
    categories: ["bots"],
    status: "Concept",
    year: 2026,
    summary: L("A Telegram bot where customers post requests and service providers respond — orders, responses and notifications in one chat.", "Telegram-бот, где заказчики публикуют запросы, а исполнители откликаются, — заказы, отклики и уведомления в одном чате."),
    goal: L("Connect customers and providers without a separate website or app.", "Связать заказчиков и исполнителей без отдельного сайта или приложения."),
    approach: L("aiogram with a relational schema and Alembic migrations; orders and deals have separate statuses so the logic stays clear.", "aiogram с реляционной схемой и миграциями Alembic; у заказов и сделок раздельные статусы, чтобы логика оставалась понятной."),
    features: [L("Order creation with categories", "Создание заказов по категориям"), L("Provider responses and selection", "Отклики исполнителей и выбор"), L("Status notifications", "Уведомления о статусах"), L("Migrations with Alembic", "Миграции через Alembic")],
    stack: ["Python", "aiogram", "SQLite", "Alembic"],
    art: "bot-market",
    accent: "#a1a3ad",
  },
  {
    slug: "hydra-marketplace",
    title: "HYDRA Marketplace Mini App",
    client: L("Concept", "Концепт"),
    categories: ["mini-apps"],
    status: "Concept",
    year: 2026,
    summary: L("A services marketplace that runs as a full Telegram Mini App — the bot only launches it and sends notifications.", "Маркетплейс услуг в виде полноценного Telegram Mini App — бот только запускает его и присылает уведомления."),
    goal: L("Give the marketplace a real interface inside Telegram: catalogue, orders, profiles and admin.", "Дать маркетплейсу настоящий интерфейс внутри Telegram: каталог, заказы, профили и админку."),
    approach: L("A monorepo with web, admin, API and shared packages; React + TypeScript + Vite on the client, Fastify and PostgreSQL with Prisma on the server. Payments stay behind a flag until later stages.", "Монорепозиторий с пакетами web, admin, api и shared; на клиенте React + TypeScript + Vite, на сервере Fastify и PostgreSQL с Prisma. Платежи закрыты флагом до поздних этапов."),
    features: [L("Mini App client with Telegram auth", "Клиент Mini App с авторизацией Telegram"), L("Separate order and deal statuses", "Раздельные статусы заказа и сделки"), L("Admin panel", "Админ-панель"), L("Payment steps behind a feature flag", "Платёжные шаги за feature-флагом")],
    stack: ["React", "TypeScript", "Vite", "Fastify", "PostgreSQL", "Prisma"],
    art: "miniapp-market",
    accent: "#5a80c4",
  },
];

export const countBy = (cat: Category) => getProjects().filter((p) => p.categories.includes(cat)).length;
