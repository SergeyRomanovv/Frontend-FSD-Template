# Router

Маршрутизация построена на **React Router v7 Data Router API** (`createBrowserRouter` + `RouterProvider`).

## Ключевые файлы

| Файл | Назначение |
|---|---|
| `config/routeConfig.tsx` | Декларативный конфиг маршрутов (`AppRouteObject[]`) |
| `config/router.tsx` | `buildRouteObjects` + `createBrowserRouter` → экспортирует `router` |
| `ui/RequireAuth.tsx` | Guard-компонент: проверяет auth и роли, редиректит |

## Архитектура

Корневой маршрут — компонент `App` (layout: Navbar + Sidebar + `Outlet`).
Все страницы — дочерние с route-level **lazy loading**.

```
RouterProvider(router)
└── App (layout)
    ├── /             → MainPage (lazy)
    ├── /about        → AboutPage (lazy)
    ├── /admin        → RequireAuth [MANAGER | ADMIN]
    │                     └── AdminPanelPage (lazy)
    ├── /forbidden    → ForbiddenPage
    └── *             → NotFoundPage
```

## Тип маршрута — AppRouteObject

```ts
interface AppRouteObject extends Omit<NonIndexRouteObject, 'children'> {
    roles?: UserRole[];        // роли → buildRouteObjects оборачивает в RequireAuth
    children?: AppRouteObject[];
}
```

## Добавить публичный маршрут

1. Добавить хелпер пути в `src/shared/const/router.ts`:
```ts
export const getRouteNews = () => '/news';
```

2. Добавить маршрут в `routeConfig.tsx`:
```tsx
{
    path: getRouteNews(),
    lazy: async () => {
        const { default: Component } = await import('@/pages/NewsPage/ui/NewsPage');
        return { Component };
    },
},
```

## Добавить защищённый маршрут

Тот же подход, но с полем `roles`:

```tsx
{
    path: getRouteDashboard(),
    roles: [UserRole.ADMIN],
    lazy: async () => {
        const { default: Component } = await import('@/pages/DashboardPage/ui/DashboardPage');
        return { Component };
    },
},
```

`buildRouteObjects` автоматически преобразует в:

```
route: element = <RequireAuth roles={[ADMIN]}><Outlet /></RequireAuth>
  └── index: lazy → DashboardPage chunk
```

Чанк загружается **только после** успешной проверки роли.

## RequireAuth

| Ситуация | Поведение |
|---|---|
| Нет авторизации (`authData = undefined`) | Редирект → `/` |
| Нет нужной роли | Редирект → `/forbidden` |
| Всё ок | Рендер `children` (`<Outlet />`) |

## Тестирование

Для интеграционных тестов роутинга используй `routerRender` из `componentRender`:

```tsx
import { routerRender } from '@/shared/lib/tests/componentRender/componentRender';

// Публичный маршрут
routerRender(getRouteAbout());

// Защищённый маршрут с нужной ролью
routerRender(getRouteAdmin(), {
    initialState: {
        user: { authData: { id: '1', username: 'admin', roles: [UserRole.ADMIN] } },
    },
});
```

`routerRender` использует `createMemoryRouter(buildRouteObjects(routeConfig))` —
тот же реальный конфиг, что и в production.
