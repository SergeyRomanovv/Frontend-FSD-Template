# Architecture Specification

## Purpose

The structural rules of the Frontend-FSD-Template: Feature-Sliced Design
layers, the allowed dependency direction, and the machine-enforced
invariants declared in `.openlore/architecture.json`.

## Requirements

### Requirement: FSD layer set
The source tree SHALL be organized into the Feature-Sliced Design layers
`app`, `pages`, `widgets`, `features`, `entities`, `shared`, each rooted at
`src/<layer>`.

#### Scenario: Locate a module
- **WHEN** a module is added to the project
- **THEN** it lives under one of the six layer directories

### Requirement: Layer dependency direction
A module in a higher layer MAY import from lower layers; a module in a lower
layer SHALL NOT import from a higher layer (order from top: app → pages →
widgets → features → entities → shared).

#### Scenario: Widget imports a shared primitive
- **WHEN** a widget imports `Button` from `@/shared/ui`
- **THEN** the dependency is allowed

#### Scenario: Shared imports an entity
- **WHEN** a module under `src/shared` imports from `src/entities`
- **THEN** the architecture invariants scan reports a violation

### Requirement: No import cycles
Import cycles between modules SHALL be treated as refactor candidates and
reported by the circular-dependency rule.

#### Scenario: Cycle detection
- **WHEN** module A imports module B and module B imports module A
- **THEN** the circular rule flags the pair

### Requirement: Public API of slices
Cross-slice imports SHALL go through the slice's public API (`index.ts`);
deep imports into slice internals SHALL be avoided.

#### Scenario: Import an entity
- **WHEN** a widget needs the user's roles
- **THEN** it imports from `@/entities/User`, not from the slice internals
