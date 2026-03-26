# Frontend FSD Template

Минимальный шаблон frontend-приложения на React + TypeScript по FSD.

## Что внутри

-   React 18 + TypeScript
-   Webpack (dev/prod)
-   Redux Toolkit + RTK Query
-   i18n (`react-i18next`)
-   ESLint + Stylelint
-   Unit-тесты (Jest + Testing Library) с HTML-отчётом

## Текущая структура (укороченно)

-   `src/app` — app-level провайдеры, роутинг, store
-   `src/pages` — `MainPage`, `AboutPage`, `AdminPanelPage`, `ForbiddenPage`, `NotFoundPage`
-   `src/widgets` — `Navbar`, `SideBar`, `Page`, `ErrorPage`
-   `src/features` — `ThemeSwitcher`, `LangSwitcher`, `UI`
-   `src/entities` — `User`, `Counter`
-   `src/shared` — общие `api`, `config`, `const`, `layouts`, `lib`, `ui`

## Доступные скрипты

-   `npm run start` — запуск webpack dev server
-   `npm run start:dev` — alias для `npm run start`
-   `npm run build:dev` — dev-сборка
-   `npm run build:prod` — prod-сборка
-   `npm run lint:ts` — проверка TS/TSX
-   `npm run lint:ts:fix` — автоисправление TS/TSX
-   `npm run lint:scss` — проверка SCSS
-   `npm run lint:scss:fix` — автоисправление SCSS
-   `npm run test:unit` — unit-тесты

## Быстрый старт

```bash
npm install
npm run start:dev
```

## Проверка качества

```bash
npm run lint:ts
npm run test:unit
npm run build:prod
```

## Роутинг и доступ

-   Публичные маршруты: `/`, `/about`
-   Защищённый маршрут: `/admin` (требуются роли `MANAGER` или `ADMIN`)
-   При отсутствии роли/доступа используется редирект на `/forbidden`

## Что удалено относительно исходного учебного проекта

-   CI/CD конфиги, Vite, Storybook, Cypress, Loki, json-server, генераторные scripts
-   Доменные модули, не относящиеся к template-ядру
