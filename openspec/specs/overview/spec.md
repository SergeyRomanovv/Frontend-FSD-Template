# Overview Specification

## Purpose

Bird's-eye view of the Frontend-FSD-Template: what the template ships and
which capability specs govern each area.

## Requirements

### Requirement: Template application surface
The template SHALL provide a demo application: a main layout with navbar and
sidebar, pages (main, about, admin panel, forbidden, not found), theme
switching, language switching (ru/en), and the counter demo entity.

#### Scenario: First launch
- **WHEN** the app starts
- **THEN** the main page renders inside the layout with navigation, theme and language switching available

### Requirement: Capability spec map
Each capability area SHALL be governed by a capability spec in
`openspec/specs/`: routing, auth, state-store, ui-kit, i18n, architecture,
and per-domain specs for widgets, pages, and shared primitives.

#### Scenario: Find the governing spec
- **WHEN** a change touches route protection
- **THEN** the routing spec is the source of truth for its requirements
