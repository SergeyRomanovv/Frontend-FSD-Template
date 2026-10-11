# Proposal

## Why

The `openspec/config.yaml` context block — injected into every generated
artifact — misdescribes the project. OpenLore auto-detection left
`Architecture: unknown`, a thin `Tech stack: node-typescript, React, Jest`, a
generic `Key patterns: Component-based UI`, and a noisy raw domain list.
Every future `/opsx-propose` run therefore plans against an inaccurate
picture of the template instead of its real methodology and stack.

## What Changes

- Rewrite the user-curated `context:` block of `openspec/config.yaml` to
  describe the project accurately:
  - **Methodology**: Feature-Sliced Design — six layers (shared, entities,
    features, widgets, pages, app), one-way dependency direction, slice
    public APIs (`index.ts`), `@/...` alias imports.
  - **Tech stack** (grounded in `package.json`): React 19 + TypeScript 5.9,
    React Router 7, Redux Toolkit + RTK Query + react-redux,
    `@headlessui/react`, react-i18next (ru/en), axios, SCSS modules with
    design tokens from `src/app/styles`, Webpack 5 (babel, svgr,
    fork-ts-checker, bundle-analyzer), Jest 29 + Testing Library + happy-dom,
    ESLint 9 flat config + Prettier + Stylelint, Husky + lint-staged.
  - **Verification entry points**: `lint:ts`, `lint:scss`, `test:unit`,
    `build:prod`.
- Replace `Architecture: unknown` with the FSD description and drop the raw
  auto-detected domain list and the generic pattern line from the curated
  context (the domain inventory stays maintained in the openlore-managed
  footer and `rag-manifest.json`).
- Leave the `rules:`, `operations:`, and the openlore-managed footer block
  untouched.

## Capabilities

### New Capabilities
- `openspec-config`: governs what the OpenSpec project configuration must
  declare about the project — methodology, tech stack, and verification
  tooling — so generated artifacts are grounded in an accurate picture.

### Modified Capabilities
- None — no existing capability's requirements change.

## Impact

- Files: `openspec/config.yaml` (curated `context:` block only).
- No application code (`src/`), no dependencies, no externally observable
  behavior — OpenSpec meta-configuration only.
- Downstream: higher-quality generated artifacts and accurate project
  framing for every future propose/apply session.
