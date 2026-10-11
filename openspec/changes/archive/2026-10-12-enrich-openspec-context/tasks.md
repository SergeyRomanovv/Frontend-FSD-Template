# Tasks

## 1. Rewrite the curated context block

- [x] 1.1 Replace the `context:` block in `openspec/config.yaml` with the curated text: methodology (Feature-Sliced Design, six layers shared→app, one-way dependency direction, slice public APIs, `@/...` aliases), tech stack categories grounded in `package.json` (React 19 + TypeScript, React Router 7, Redux Toolkit + RTK Query, @headlessui/react, react-i18next ru/en, axios, SCSS modules + design tokens, Webpack 5, Jest 29 + Testing Library + happy-dom, ESLint 9 + Prettier + Stylelint, Husky + lint-staged), and the verification entry points (`lint:ts`, `lint:scss`, `test:unit`, `build:prod`). Verify: a fresh `openspec instructions <artifact> --change <any> --json` shows the new context and the block stays under ~40 lines.
- [x] 1.2 Remove the auto-detection leftovers from the curated block (`Architecture: unknown`, the thin `Tech stack:` line, the raw `Domains:` list, `Key patterns:`) while leaving the `openlore:` footer untouched. Verify: no `unknown` or `Domains:` lines between `context:` and `rules:`; the footer block is still present.

## 2. Validation

- [x] 2.1 Config validity: run `openspec doctor` and `openspec context --json`. Verify: both exit 0 and the root still resolves to the repo.
- [x] 2.2 Regression chain: run `npm run lint:ts && npm run test:unit && npm run build:prod` (config-only change — the chain must stay green). Verify: all three commands pass.
