# OpenLore: фактура установки и план переноса на SberOS

> Составлено 2026-10-19 по реальной установке от 2026-10-11 (машина horo134pc,
> Linux, nvm). Все команды и пути ниже — фактически выполненные и проверенные.
> Документ самодостаточен: можно перенести на корпоративный ноутбук и идти по плану.

---

## Часть 1. Фактура: что, где и для чего выполнялось

### 1.1. Среда и версии (эталон)

| Компонент | Версия | Примечание |
|---|---|---|
| Node.js | v24.21.0 | через nvm; минимум openlore — **Node ≥ 22.19** (нужен `node:sqlite`) |
| npm | 11.19.0 | |
| openlore | 3.3.1 | npm-пакет `openlore` |
| openspec | 1.14.1 | смежный инструмент (спеки) |
| ОС агента | Qwen Code CLI | Claude Code НЕ установлен (проверено) |

### 1.2. Пакет и источник

- Пакет: `openlore` (автор Clay Good, репозиторий **github.com/clay-good/openlore**, MIT).
  Это НЕ продукт Fission-AI (OpenSpec) — независимый проект, «inaugural plugin»
  экосистемы OpenSpec.
- Назначение: персистентная архитектурная память для AI-агентов — статический
  анализ кодовой базы, BM25-индекс, orient() (контекст по задаче), спеки
  `openspec/specs/*.md`, ADR (`record_decision`), детект дрейфа код↔спеки.
- Документация: README + `docs/agent-setup.md`, `docs/architecture-invariants.md`,
  `docs/OPENSPEC-INTEGRATION.md` в репозитории.

### 1.3. Установка CLI (выполнено)

```bash
npm install -g openlore        # 292 пакета, ~47 c
which openlore
# → ~/.nvm/versions/node/v24.21.0/bin/openlore  (путь зависит от версии node!)
openlore --version             # 3.3.1
```

⚠️ Нюанс, воспроизведённый на нашей машине: npm предупредил о **заблокированных
install-скриптах** 25 нативных пакетов (tree-sitter-грамматики, onnxruntime,
sharp, postinstall самого openlore — механизм allowScripts). CLI при этом
работал корректно (базовый функционал). Если на SberOS `--ignore-scripts`
принудителен — базовые команды ожидаются рабочими, но проверить `openlore
doctor` и `openlore analyze` обязательно. Нативные модули могут потребовать
`node-gyp`/компилятор при отсутствии prebuilds.

### 1.4. Предпросмотр и выбор scope

```bash
cd <repo> && openlore install --dry-run
```
Показал: surface `agents-md`; ПОПЫТКА бы создать `~/.claude.json`,
`~/.claude/settings.json` (hooks ориентации), `~/.claude/CLAUDE.md` и блок в
`AGENTS.md`. Claude Code на машине нет → выбран флаг:

```bash
openlore install --repo-only
```
**Зачем:** не плодить конфиги несуществующего агента и не менять user-scope
(по умолчанию install прописывает себя во все будущие git-репозитории).

### 1.5. Что создал `openlore install --repo-only` в проекте

| Путь | Что | Коммитится? |
|---|---|---|
| `AGENTS.md` | managed-блок OpenLore (инструкция вызывать `orient()` до работы с незнакомым модулем; Epistemic Lease) + секция Architectural decisions (протокол `record_decision` и разблокировка gated-коммитов) | да |
| `.openlore/` | индекс+анализ: `call-graph.db` (SQLite), `repo-structure.json`, `dependency-graph.json`, `llm-context.json`, `ui-inventory.json`, `refactor-priorities.json`, `analysis/CODEBASE.md`, `ARCHITECTURE.md`, `SUMMARY.md`, `dependencies.mermaid`, BM25-индексы. Реальный размер: **3,1 МБ** на репо из 164 файлов, строится ~1–8 c | нет (gitignore) |
| `.openlore/config.json` | конфиг проекта (projectType, openspecPath, generation.model) | нет (gitignore) |
| `.openlore/architecture.json` | машинные архитектурные инварианты (правила слоёв) | **да** (исключение из gitignore) |
| `.husky/pre-commit` | APPEND decisions-гейта: `node .../openlore/cli decisions --gate` по абсолютному пути + sentinel-файл `.git/OPENLORE_GATE_RAN`. **Не блокирует** коммиты | да |
| `.husky/post-commit` | детектор обхода `--no-verify` (проверяет sentinel) | да |
| `.gitignore` | сам добавил `.openlore/`; мы уточнили до `.openlore/*` + `!.openlore/architecture.json` | да |

Точная правка gitignore (иначе командные правила не попадут в репозиторий):

```gitignore
# openlore analysis artifacts (index is rebuildable; architecture rules are shared)
.openlore/*
!.openlore/architecture.json
```

### 1.6. Привязка Qwen Code (вручную — Qwen не входит в автоопределение)

OpenLore автоопределяет: Claude Code, Cursor, Cline, Continue, Pi, AGENTS.md.
Qwen Code — нет → MCP-сервер регистрируется руками в `~/.qwen/settings.json`:

```json
"mcpServers": {
  "openlore": {
    "command": "openlore",
    "args": ["mcp"]
  }
}
```

- Пресет по умолчанию `substrate` = **15 инструментов** (orient, search_code,
  blast_radius, verify_claim, prepare_spec_generation, ...).
- `--preset full` = 76, `--preset navigation` = 10 (минимум).
- Регистрация глобальная → MCP виден во всех проектах, но **индекс строится
  в каждом репо отдельно** (`openlore install` или `openlore analyze`).

Проверка: перезапуск сессии Qwen Code → `/mcp` → openlore в списке.

### 1.7. Архитектурные инварианты (FSD)

`.openlore/architecture.json` — формат: 8 видов правил верхнего уровня
(`layers`, `forbidden`, `allowedOnly`, `required`, `circular`, `reachable`,
`orphan`, `moreUnstable`); пути — префиксы каталогов; в `layers` **порядок
ключей сверху вниз** = разрешённое направление зависимостей. Наш файл:

```json
{
  "layers": {
    "app": ["src/app"],
    "pages": ["src/pages"],
    "widgets": ["src/widgets"],
    "features": ["src/features"],
    "entities": ["src/entities"],
    "shared": ["src/shared"]
  },
  "circular": [
    { "scope": "src", "reason": "FSD template: import cycles between modules are refactor candidates" }
  ]
}
```

### 1.8. LLM-провайдер (для generate/verify) — вся история поиска

Требуется ТОЛЬКО для `openlore generate` / `verify` / `drift --use-llm`.
orient/search/audit/mapping — работают **без ключей и без сети**.

Факты, установленные экспериментально (важно для повторной установки):

1. `OPENAI_BASE_URL` openlore **игнорирует** (OpenAI SDK конвенция не работает).
2. `llm.apiBase` в `.openlore/config.json` **игнорируется по дизайн-безопасности**
   для не-loopback адресов: коммитимый файл репозитория не может выбирать, куда
   уходит ключ оператора (защита от эксфильтрации на чужом клоне). Loopback
   (localhost-прокси) разрешён.
3. Рабочая пара env (файл `core/services/repo-config-trust.js`,
   `llm-service.js`): **`OPENAI_COMPAT_API_KEY` + `OPENAI_COMPAT_BASE_URL`**
   (альтернативы по коду: ANTHROPIC_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY).
4. Флаг `--api-base` в health-check doctor не применялся — не полагаться на
   doctor при отладке endpoint'а; верифицировать прямым curl или `--preview`.

Реализовано на нашей машине (~/.bashrc, ключ не дублируется — читается живьём
из настроек Qwen Code):

```bash
_ZAI_KEY=$(node -e "try{console.log(JSON.parse(require('fs').readFileSync(process.env.HOME+'/.qwen/settings.json','utf8')).env.ZAI_API_KEY||'')}catch(e){}" 2>/dev/null)
[ -n "$_ZAI_KEY" ] && export OPENAI_COMPAT_API_KEY="$_ZAI_KEY" && export OPENAI_API_KEY="$_ZAI_KEY"
unset _ZAI_KEY
export OPENAI_COMPAT_BASE_URL=https://api.z.ai/api/coding/paas/v4
```
Плюс в `.openlore/config.json`: `"generation": { "model": "GLM-5.2", ... }`.
Проверка: `openlore doctor` → `✓ LLM connection openai-compat · …`.

### 1.9. Верификация установки (команды контроля)

```bash
openlore --version          # версия CLI
openlore doctor             # конфиг, индекс, парсинг, wiring, LLM (опц.)
openlore status             # состояние индекса, отстал ли от рабочего дерева
openlore features           # какие opt-in фичи активны
openlore analyze            # (пере)строить индекс; --force / --reanalyze
openlore audit              # покрытие спеков, hub-гэпы, сироты
openlore drift              # разошёлся ли код со спеками
openlore enforce            # advisory-гейт: FSD-инварианты + форма сценариев
```
Через MCP (в сессии агента): `orient "<задача>"` — эталонная smoke-проверка.

### 1.10. Что работает БЕЗ сети и БЕЗ ключей (важно для ИБ)

- `openlore analyze` — статический анализ, локально.
- `orient` / `search` — BM25-индекс, локально (SQLite в `.openlore/`).
- `audit` / `drift` (без --use-llm) / `mapping refresh` / `enforce` / `test` — локально.
- Сеть нужна только: установка (npm), LLM-фичи (generate/verify/--use-llm),
  опционально `embed --local` (модель ~23 МБ скачивается один раз при первом
  запуске; сама установка openlore модель НЕ качает).

---

## Часть 2. Специфика SberOS / корпоративных ограничений — карта рисков

SberOS — Linux-подобная ОС с mandatory-безопасностью. Ниже — типовые
корпоративные ограничения; на конкретном ноутбуке проверить по чек-листу
этапа 0. Не выдумываю: что не проверено — помечено «проверить».

| Риск | Симптом | Митигация |
|---|---|---|
| Прокси с MITM-сертификатами | npm: `UNABLE_TO_VERIFY_LEAF_SIGNATURE` / `SELF_SIGNED_CERT_IN_CHAIN` | корпоративный CA в `npm config set cafile=...`; `HTTPS_PROXY`/`HTTP_PROXY`/`NO_PROXY` |
| Закрытый npm registry | таймауты registry.npmjs.org | корпоративный mirror (Nexus/Artifactory): `npm config set registry https://<mirror>/...` |
| Блокировка install-скриптов / --ignore-scripts | предупреждения allowScripts (мы видели и у себя) | базовый функционал работает; после установки прогнать `doctor`+`analyze`; при проблемах с нативными модулями — компилятор/gyp или разрешение скриптов через ИБ |
| Старый системный Node (<22.19) | `node:sqlite` недоступен / openlore падает | локальный Node из официального tarball в `$HOME` (без root), PATH в своём окружении |
| Запрет правки ~/.bashrc / управляемый профиль | env не применяются | положить `OPENAI_COMPAT_*` в `env` блока `~/.qwen/settings.json` (env сессии Qwen Code наследуется; на нашей машине так живёт ключ ZAI) — .bashrc не нужен |
| Запрет внешних LLM-API | 401/403/таймаут к api.z.ai | НЕ настраивать провайдер: orient/audit/drift работают полностью локально; generate/verify просто недоступны |
| Телеметрия | требования ИБ | `export DO_NOT_TRACK=1` (стандартная переменная; для openlore не проверено отдельно — проверить `openlore --help`/config на секцию telemetry; у OpenSpec: `openspec config set telemetry.enabled false`) |
| Политика git-хуков (нельзя менять pre-commit) | ИБ/команда запрещает модификацию хуков | «минимальный вариант» установки — см. этап 4B: без гейтов |
| Недоверенные репозитории / sandbox HOME | ограничения записи | всё ставится в `$HOME` (nvm/npm prefix) и в каталог проекта — root не нужен |

---

## Часть 3. План установки на SberOS (пошаговый)

### Этап 0 — разведка среды (10 мин, ничего не ставим)

```bash
node -v                  # нужно >= 22.19; ниже — см. Этап 1A
npm -v
npm config get registry  # какой registry используется
git --version
echo "$HTTPS_PROXY $HTTP_PROXY $NO_PROXY"   # прокси задан?
# сеть до registry:
curl -sSI --max-time 10 "$(npm config get registry)" | head -3
# проверка сертификатов через npm:
npm ping 2>&1 | tail -2
```
Заодно выяснить у ИБ/админов: разрешён ли корпоративный npm-mirror, есть ли
корпоративный CA-файл, разрешена ли правка `~/.bashrc`, разрешены ли изменения
git-хуков в целевом репозитории.

### Этап 1 — Node.js (если системный < 22.19)

**1A (без root):** скачать официальный tarball (x64/arm64 по железу), распаковать в `~/node`,
прописать PATH в своём окружении. **1Б:** если корпоративный mirror содержит
nodejs — ставить оттуда. Проверка: `node -e "require('node:sqlite'); console.log('sqlite ok')"`.

### Этап 2 — установка openlore CLI

```bash
npm install -g openlore
openlore --version
```
Если registry закрыт: запросить у ИБ публикацию пакета `openlore` в корпоративный
mirror (список зависимостей возьмётся npm автоматически). Если полностью offline —
вариант «перенос каталога»: на этой машине
`~/.nvm/versions/node/v24.21.0/lib/node_modules/openlore` + пересоздать symlink
`bin/openlore` (грязный путь, применять только если mirror невозможен; версия
node должна совпадать мажорно).

Чек-поинт: `openlore --help` отвечает, `openlore doctor` в пустом каталоге не падает.

### Этап 3 — Qwen Code + MCP + env

1. Установить Qwen Code (тот же вопрос registry — решается вместе с этапом 2).
2. `~/.qwen/settings.json` — добавить (глобально, по нашей практике):

```json
"mcpServers": {
  "openlore": { "command": "openlore", "args": ["mcp"] }
}
```
Если `openlore` не на PATH у spawn'а MCP — указать абсолютный путь к бинарнику.
3. Провайдер LLM (если внешние LLM разрешены и нужны generate/verify).
   Приоритет для корпоративной среды — **не трогать .bashrc**, а положить в тот же
   `settings.json`:

```json
"env": {
  "OPENAI_COMPAT_API_KEY": "<ключ>",
  "OPENAI_COMPAT_BASE_URL": "<OpenAI-совместимый endpoint>",
  "DO_NOT_TRACK": "1"
}
```
Помнить из фактуры: пара именно `OPENAI_COMPAT_*`; `OPENAI_BASE_URL` не работает;
`llm.apiBase` в конфиге репо игнорируется (кроме loopback) — на этом строить
интеграцию с корпоративным LLM-шлюзом (loopback-прокси на localhost как
разрешённый вариант: `llm.apiBase: "http://localhost:PORT"` допустим из репо-конфига).

### Этап 4 — целевой репозиторий

**4A. Стандартный вариант (как у нас):**

```bash
cd <repo>
openlore install --dry-run     # ревью изменений ДО записи
openlore install --repo-only   # AGENTS.md-блок, индекс, gitignore
```
Затем вручную: `.gitignore` → `.openlore/*` + `!.openlore/architecture.json`;
перенести/создать `.openlore/architecture.json` (правила слоёв проекта);
`openlore doctor`; `openlore analyze`.

**4B. Минимальный вариант (жёсткая политика ИБ: нельзя трогать git-хуки):**
не запускать `install` вообще. Вместо этого:
1. руками добавить в `AGENTS.md` managed-блок с инструкцией orient
   (скопировать из этого репозитория — блок между `<!-- BEGIN OPENLORE -->` и
   `<!-- END OPENLORE -->`);
2. `openlore analyze` — построит `.openlore/` без wiring'а хуков;
3. gitignore добавить самому.
   Решения-гейт и record_decision-протокол при этом не подключаются — осознанно.

### Этап 5 — приёмочные проверки

```bash
openlore doctor               # зелёный (LLM-строка — по обстоятельствам)
openlore status               # индекс свежий
openlore orient --json "test task"   # возвращает функции/файлы
```
В сессии Qwen Code (после перезапуска): `/mcp` → openlore; попросить агента
вызвать orient. Для репо со спеками: `openlore mapping refresh && openlore audit`.

### Этап 6 — откат (полностью удаляемый)

```bash
npm rm -g openlore                                   # CLI
# ~/.qwen/settings.json: удалить блок mcpServers.openlore (+ env, если добавляли)
cd <repo> && rm -rf .openlore                        # индекс (пересобираем)
# AGENTS.md: удалить managed-блок OpenLore и секцию decisions-инструкций
# .husky/pre-commit: убрать блок openlore-decisions-hook; rm .husky/post-commit
# .gitignore: убрать строки openlore
```

### Чек-лист для заявки в ИБ (коротко)

- `openlore` — MIT, open-source (github.com/clay-good/openlore), установка
  только в $HOME, root не нужен.
- Базовый режим полностью офлайн: статический анализ + локальный SQLite-индекс
  (`.openlore/`, ~3 МБ на ~170 файлов); исходники наружу не отправляются.
- Сеть опциональна: только LLM-фичи (generate/verify) по явно настроенному
  endpoint; без настройки — недоступны.
- Изменения в репозитории: `AGENTS.md` (инструкции агенту), gitignore,
  опционально git-хуки (можно полностью отключить — вариант 4B).
- Телеметрия: `DO_NOT_TRACK=1` (+ проверить конфиг).

---

## Приложение: смежные артефакты этой установки (для полноты картины)

- OpenSpec CLI 1.14.1: глобально + скиллы/команды `~/.qwen/skills/openspec-*`,
  `~/.qwen/commands/opsx-*.md`; проект: `openspec/` (31 strict-спек,
  change-архив `openspec/changes/archive/`). Полный цикл propose→apply→archive
  отработан 2026-10-12 (change `enrich-openspec-context`).
- Ветка-носитель всей инфраструктуры знаний: `openspec+openlore`
  (коммиты ba5bd5d → … → dc68e5d).
