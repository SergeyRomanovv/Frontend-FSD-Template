# AGENT RULES

## 1) Коммуникация

-   Общение с пользователем — на русском языке.
-   Пояснения должны быть короткими, понятными и по делу.
-   Перед существенными архитектурными или инфраструктурными изменениями сначала согласовывать объём и цель с пользователем.

## 2) Цель проекта

-   Поддерживать репозиторий как переиспользуемый Frontend Template на базе Feature-Sliced Design.
-   Развивать текущую архитектуру эволюционно, без необоснованных переписываний.

## 3) Архитектура (FSD)

-   Соблюдать слои: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.
-   Соблюдать направление зависимостей между слоями.
-   Доменную логику держать в `entities/features`; `widgets/pages` использовать как слои композиции.

## 4) Импорты и Public API

-   Использовать alias-импорты `@/...`.
-   Предпочитать импорт через публичный API слайсов (`index.ts`), где он предусмотрен.
-   Избегать лишних deep-import; если нужен — делать осознанно и единообразно.

## 5) Переиспользование прежде всего

-   Перед созданием нового компонента/хука/сервиса/селектора проверять, нет ли уже подходящей реализации.
-   Не дублировать логику и UI-примитивы.

## 6) Роутинг, доступ и store

-   Центр роутинга: `src/app/providers/router/config/routeConfig.tsx`.
-   Защита маршрутов — через поле `roles` в `AppRouteObject`; `buildRouteObjects` автоматически оборачивает в `RequireAuth`.
-   `authOnly` как флаг не используется — наличие `roles` уже означает защищённый маршрут.
-   Поддерживать текущий паттерн Redux Toolkit / RTK Query в store.
-   Новые API подключать через тот же подход (`rtkApi` + `injectEndpoints`).

## 7) Данные и типизация

-   DTO/контракты API хранить рядом с API-слоем.
-   Доменные типы хранить в owning-слайсах.
-   UI должен работать с доменными моделями, а не с сырыми DTO.

## 8) Стили и UI-консистентность

-   UI-компоненты строить на базе **`@headlessui/react`** — он обеспечивает доступность (a11y) из коробки и не навязывает стили.
-   В первую очередь переиспользовать токены/переменные из `src/app/styles`.
-   Избегать magic numbers, если есть подходящие проектные переменные.
-   Стили компонентов хранить рядом (`*.module.scss`) и придерживаться текущего подхода к именованию/структуре.

## 9) Проверка работоспособности перед завершением

-   Проверять не только стиль кода, но и фактическую работоспособность изменений.
-   Базовая обязательная проверка состоит из:
    1. `npm run lint:ts`
    2. `npm run test:unit`
    3. `npm run build:prod`
-   Разрешается запускать базовую проверку одной цепочкой:
    -   `npm run lint:ts && npm run test:unit && npm run build:prod`
-   Фактическую визуальную проверку интерфейса проводить через MCP browser tooling (например, `chrome-devtools`) при изменениях UI/верстки/роутинга.
-   Полную расширенную проверку (доп. сценарии, расширенный smoke/e2e и т.п.) запускать только после запроса и получения разрешения пользователя.

<!-- BEGIN OPENLORE (managed — edits inside this block will be overwritten) -->
<!-- openlore-fingerprint: f5e6039ff6662e0c -->
This project uses OpenLore for persistent architectural memory.

Call `orient "<task description>"` (via the openlore MCP server, or
`npx openlore orient --json`) **before touching a module you have not yet read in
this session**, and when a task spans several modules. It returns the relevant
functions, callers, spec sections, and insertion points in one structural lookup
instead of file-by-file rediscovery.

Skip it for work you are already inside: repeated edits to a file you have read
this session do not need re-orientation. Reach for it again when the task moves
to unfamiliar code.

OpenLore prefixes tool responses with a brief, factual freshness note (the
Epistemic Lease) once your cached context has aged or the repo has moved since
your last `orient()`. It is informational — re-`orient()` if you are relying on
cached cross-module structure; otherwise carry on.

For the MCP setup, ensure `openlore mcp` is configured as an MCP server.
See https://github.com/clay-good/OpenLore for details.

Wired MCP surface: `substrate`. This guidance is written for that surface; re-run `openlore install --preset <name>` to change it and regenerate these instructions.
<!-- END OPENLORE -->

<!-- openlore-decisions-instructions -->
## Architectural decisions

When making a significant design choice, call `record_decision` **before** writing the code.

Significant choices: data structure, library/dependency, API contract, auth strategy,
module boundary, database schema, caching approach, error handling pattern.

```
record_decision({
  title: "Use JWTs for stateless auth",
  rationale: "Avoids session store in infra",
  consequences: "Tokens can't be revoked early",
  affectedFiles: ["src/auth/middleware.ts"],
  supersedes: "a1b2c3d4"  // 8-char ID of prior decision being reversed
})
```

Decisions are consolidated in the background immediately after `record_decision` is called — the pre-commit gate reads the already-consolidated store and adds no LLM latency.

**Performance note**: if you skip `record_decision`, the gate detects unrecorded source changes at commit time and triggers a slow LLM extraction on the *next* commit (~10-30s). Calling `record_decision` proactively keeps every commit instant.

## When git commit is blocked by the decisions gate

If `git commit` fails and the output is JSON with `"gated": true`, do NOT retry silently.
Check the `reason` field and act accordingly:

**`reason: "verified"` — decisions await review:**
Present each decision to the user:
> "The commit is blocked — I found N architectural decision(s) to validate:
> 1. **[id]** Title — rationale
Do you approve? (yes/no)"
For each approval call `approve_decision`, for rejections call `reject_decision`.
Then run `openlore decisions --sync` and retry `git commit`.

**`reason: "approved_not_synced"` — decisions approved but not written to specs:**
Run `openlore decisions --sync` then retry `git commit`. Do not skip this step.

**`reason: "drafts_pending_consolidation"` — drafts were recorded but not yet consolidated:**
Present to the user:
> "N decision draft(s) were recorded but never consolidated. Run consolidation now? (~10-30s)"
If yes: run `openlore decisions --consolidate --gate` and handle the result.
If no: retry with `git commit --no-verify` to skip the gate.

**`reason: "no_decisions_recorded"` — source files staged but nothing recorded:**
Present to the user:
> "Source files are staged but no architectural decisions were recorded. Run fallback extraction to check for undocumented decisions? (~10-30s)"
If yes: run `openlore decisions --consolidate --gate` and handle the result.
If no: retry with `git commit --no-verify` to skip the gate.
<!-- end-openlore-decisions-instructions -->
