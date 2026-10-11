# UI Kit Specification

## Purpose

The shared UI primitives of the template (`src/shared/ui`): styling-aware,
composable building blocks that all upper layers reuse instead of re-creating
markup.

## Requirements

### Requirement: Primitive inventory
The shared layer SHALL provide at least these primitives: `Button`, `Input`,
`Icon`, `AppLink`, `Text`, `Loader`, `Skeleton`, and the stack family
(`Flex`, `HStack`, `VStack`).

- **Implementation**: `Button::src/shared/ui/Button/Button.tsx`

#### Scenario: Composing a form
- **WHEN** a feature builds a form
- **THEN** it composes `Input` and `Button` from the shared UI kit instead of raw elements

### Requirement: Variant-driven styling
Primitives with visual variants (`Button` variant/color/size, `Text`
variant/align/size/bold) SHALL expose them as props; styles SHALL come from
colocated `*.module.scss` files and project design tokens.

- **Implementation**: `Text::src/shared/ui/Text/Text.tsx`

#### Scenario: Button variants
- **WHEN** `<Button variant="clear">` renders
- **THEN** the class from `Button.module.scss` is applied without inline magic values

### Requirement: Ref and className forwarding
Interactive primitives (for example `Button`) SHALL forward refs and accept an
optional `className` for consumer-side layout adjustments.

- **Implementation**: `Button::src/shared/ui/Button/Button.tsx`

#### Scenario: Ref access
- **WHEN** a consumer attaches a ref to `Button`
- **THEN** `ref.current` points to the rendered button DOM node

### Requirement: Accessible interactive components
New interactive primitives SHALL be built on `@headlessui/react` so
accessibility semantics come from the library, with template styles layered
on top.

- **Implementation**: `Input::src/shared/ui/Input/Input.tsx`

#### Scenario: Adding a dropdown
- **WHEN** a dropdown primitive is added to the kit
- **THEN** it renders a `@headlessui/react` component and keyboard focus handling is provided by that component

### Requirement: Layout via stack primitives
Layout composition SHALL use the stack primitives (`Flex`/`HStack`/`VStack`)
with gap/align props instead of ad-hoc wrapper elements.

- **Implementation**: `Flex::src/shared/ui/Stack/Flex/Flex.tsx`

#### Scenario: Row layout
- **WHEN** components need horizontal placement
- **THEN** they are wrapped in `HStack` with a gap prop
