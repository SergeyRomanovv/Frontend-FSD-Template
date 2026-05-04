# Frontend FSD Template

Стартовый шаблон frontend-приложения на React + TypeScript, построенный по методологии **Feature-Sliced Design (FSD)**.

## Стек

-   **React 19** + **TypeScript 5**
-   **Webpack 5** (dev/prod конфиги вынесены в `config/build/`)
-   **Redux Toolkit** + **RTK Query**
-   **React Router DOM v7** (Data Router API: `createBrowserRouter`, `RouterProvider`, route-level lazy)
-   **@headlessui/react** — доступные headless-компоненты для построения UI
-   **i18n** (`react-i18next`, два языка: EN / RU)
-   **ESLint 9** (flat config) + **Stylelint** + **Prettier**
-   **Jest** + **Testing Library** (с HTML-отчётом)
-   **Husky** + **lint-staged** (pre-commit хуки)

## Структура (FSD)

```
src/
├── app/          # Провайдеры (Store, Theme, ErrorBoundary), роутинг, глобальные стили
├── pages/        # MainPage, AboutPage, AdminPanelPage, ForbiddenPage, NotFoundPage
├── widgets/      # Navbar, Sidebar, Page, ErrorPage
├── features/     # ThemeSwitcher, LangSwitcher, UI (scroll position)
├── entities/     # User (auth skeleton), Counter (demo)
└── shared/       # api, config, const, layouts, lib, ui-kit
```

## Демонстрационные модули

| Модуль | Что показывает |
|---|---|
| `entities/Counter` | `buildSlice`, `buildSelector`, динамический reducer, тесты |
| `entities/User` | auth-скелет: `initAuthData` (заготовка), `RequireAuth`, роли (`UserRole`) |
| `features/ThemeSwitcher` | переключение темы |
| `features/LangSwitcher` | переключение языка i18n |
| `pages/AdminPanelPage` | защищённый маршрут (`roles: [ADMIN, MANAGER]`) |

## Shared UI-kit

`Button` · `Input` · `Text` · `Icon` · `AppLink` · `Loader` · `Skeleton` · `Stack` (Flex / HStack / VStack)

## Роутинг и доступ

-   Публичные маршруты: `/`, `/about`, `/forbidden`, `*`
-   Защищённый маршрут: `/admin` (требуются роли `ADMIN` или `MANAGER`)
-   Guard `RequireAuth` — редирект на `/` без авторизации, на `/forbidden` без нужной роли
-   Подробнее: [`src/app/providers/router/README.md`](src/app/providers/router/README.md)

## Быстрый старт

```bash
npm install
npm run start
```

Адрес по умолчанию: `http://localhost:3000`

API URL настраивается через переменную окружения `--env apiUrl=http://...` при запуске webpack,
либо через дефолт в `webpack.config.ts` (`http://localhost:8000` в dev, `/api` в prod).

## Скрипты

| Команда | Описание |
|---|---|
| `npm run start` | dev-сервер на порту 3000 |
| `npm run build:dev` | dev-сборка |
| `npm run build:prod` | prod-сборка |
| `npm run lint:ts` | проверка TS/TSX |
| `npm run lint:ts:fix` | автоисправление TS/TSX |
| `npm run lint:scss` | проверка SCSS |
| `npm run test:unit` | unit-тесты |

## Проверка качества

```bash
npm run lint:ts && npm run test:unit && npm run build:prod
```
