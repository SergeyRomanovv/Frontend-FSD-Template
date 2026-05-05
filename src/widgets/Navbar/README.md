# Navbar

Виджет верхней навигационной панели приложения.

## Внешний вид

```
[ App ] | [ Главная  О сайте  Админ панель ]  ────────  [ Выйти ]
```

- **App** — текстовый логотип, ссылка на главную страницу `/`
- **Навигационные ссылки** — активная ссылка подсвечивается акцентным цветом
- **Выйти** — кнопка очищает `user.authData` в Redux-стейте через `userActions.logout()`

## Ключевые файлы

| Файл | Назначение |
|---|---|
| `model/navbarLinks.ts` | Конфиг массива навигационных ссылок |
| `ui/Navbar.tsx` | Компонент-виджет |
| `ui/Navbar.module.scss` | Стили |

## Добавить ссылку

Открыть `model/navbarLinks.ts` и добавить объект в массив `navbarLinks`:

```ts
import { getRouteNews } from '@/shared/const/router';

{ path: getRouteNews(), labelKey: 'Новости' }
```

> Поле `labelKey` — ключ для `react-i18next` (`t(labelKey)`). Добавьте перевод в `public/locales/ru/translation.json` и `en/translation.json`.

## Поле `end` у ссылки

```ts
export interface NavbarLinkType {
    path: string;
    labelKey: string;
    end?: boolean; // передаётся в NavLink.end
}
```

`end: true` нужен только для корневого маршрута `/`, чтобы ссылка «Главная» не оставалась активной на всех остальных страницах.

## Props компонента

| Prop | Тип | Описание |
|---|---|---|
| `className` | `string?` | Дополнительный CSS-класс |

## Стили и токены

Все цвета берутся из CSS-переменных темы (`src/app/styles/themes/`):

| Переменная | Применение |
|---|---|
| `--navbar-height` | Высота (50px), используется также в `MainLayout` |
| `--light-bg-redesigned` | Фон |
| `--hint-redesigned` | Нижняя граница, разделитель |
| `--text-redesigned` | Цвет логотипа и ссылок |
| `--accent-redesigned` | Hover-состояние и активная ссылка |
| `--font-l` | Шрифт логотипа |

## Зависимости

- `AppLink` (`@/shared/ui/AppLink`) — `NavLink`-обёртка с поддержкой `activeClassName`
- `Button` (`@/shared/ui/Button`) — кнопка «Выйти»
- `userActions` (`@/entities/User`) — экшен `logout`
- `useAppDispatch` (`@/shared/lib/hooks/useAppDispatch`)
