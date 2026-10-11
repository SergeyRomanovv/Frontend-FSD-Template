# openspec-config Specification

## Purpose

Govern the OpenSpec project configuration so its curated context block
always describes the project's methodology, tech stack, and verification
tooling accurately for artifact generation.

## Requirements

### Requirement: Context declares methodology
The curated `context:` block of `openspec/config.yaml` SHALL name the
project's methodology — Feature-Sliced Design with its six layers and
one-way dependency direction — and SHALL NOT leave the architecture
described as unknown.

#### Scenario: Read the methodology from config
- **WHEN** a generated artifact or a new session reads the config context
- **THEN** it finds Feature-Sliced Design, the layer order shared→app, and the dependency rule without consulting other files

### Requirement: Context declares tech stack
The curated context SHALL declare the current tech stack categories — UI
framework, language, routing, state management, UI primitive base, i18n,
styling approach, bundler, and test tooling — with values grounded in
`package.json`.

#### Scenario: Stack question answered from context
- **WHEN** an artifact generator asks which state-management or styling approach the project uses
- **THEN** the answer is present in the context block and matches package.json

#### Scenario: Stack drift detection
- **WHEN** a dependency change alters a declared stack category
- **THEN** updating the context block is part of that change

### Requirement: Context declares verification entry points
The curated context SHALL name the base verification commands
(`lint:ts`, `lint:scss`, `test:unit`, `build:prod`) so generated tasks
reference real entry points.

#### Scenario: Task references a real command
- **WHEN** a generated `tasks.md` prescribes verification
- **THEN** every command it names exists in the `scripts` section of `package.json`

### Requirement: Auto-generated noise stays out of the curated block
Raw auto-detected inventories (domain lists, generic pattern lines) SHALL
NOT be merged into the curated context; they SHALL remain confined to the
openlore-managed sections of the config.

#### Scenario: Regenerate via openlore
- **WHEN** openlore rewrites its managed footer
- **THEN** the curated context block keeps its methodology and stack text unchanged
