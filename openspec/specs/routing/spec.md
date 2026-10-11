# Routing Specification

## Purpose

Single source of truth for application routing in the FSD template: the route
table, lazy page loading, and role-based access control. The router lives in
the `app` layer (`src/app/providers/router`) and composes pages, widgets, and
entities from lower layers.

## Requirements

### Requirement: Central route table
All application routes SHALL be declared in a single `routeConfig` array of
`AppRouteObject` entries (`src/app/providers/router/config/routeConfig.tsx`).
Adding, changing, or removing a route SHALL be done only in this table.

#### Scenario: Add a new page route
- **WHEN** a developer adds a new page
- **THEN** a new entry is appended to `routeConfig` pointing at the page component, and no other routing registration exists

### Requirement: Route path helpers
Route paths SHALL be exposed as getter helpers (for example `getRouteMain()`,
`getRouteAdmin()`) from `src/shared/const/router`. Application code SHALL
navigate via these helpers instead of hard-coded path strings.

#### Scenario: Navigate by helper
- **WHEN** code needs the admin route path
- **THEN** it calls `getRouteAdmin()` and no literal `/admin` string is used

### Requirement: Role-based route protection
A route whose entry declares `roles` SHALL be treated as protected: the route
builder SHALL wrap its element in `RequireAuth` with the declared roles. The
presence of `roles` is the only protection flag; a separate `authOnly` flag
SHALL NOT be used.

#### Scenario: Protected route declared
- **WHEN** `routeConfig` contains an entry with `roles: [UserRole.MANAGER, UserRole.ADMIN]`
- **THEN** `buildRouteObjects` wraps that route in `RequireAuth` with those roles

### Requirement: Unauthenticated redirect
The router SHALL redirect an unauthenticated user opening a protected route to
the main route, replacing history and carrying the original location in
navigation state.

#### Scenario: Anonymous opens protected route
- **WHEN** `getUserAuthData` returns no user and the user opens a route with `roles`
- **THEN** the app navigates to `getRouteMain()` with `state.from` set to the denied location and `replace` semantics

### Requirement: Insufficient-role redirect
The router SHALL redirect an authenticated user who lacks every declared role
to the forbidden page.

#### Scenario: User without required role
- **WHEN** a user with neither `MANAGER` nor `ADMIN` role opens the admin route
- **THEN** the app navigates to `getRouteForbidden()`

### Requirement: Error and not-found fallbacks
Unknown paths SHALL render `NotFoundPage`; render-time errors in the route
tree SHALL render `ErrorPage` via the root `errorElement`.

#### Scenario: Unknown URL
- **WHEN** the user opens a path absent from `routeConfig`
- **THEN** `NotFoundPage` renders

### Requirement: Lazy page loading
Page components SHALL be loaded lazily via dynamic import in their route
entries.

#### Scenario: First visit to a page
- **WHEN** the user first navigates to a page route
- **THEN** a network request for that page's chunk is issued and the page content renders after the chunk resolves
