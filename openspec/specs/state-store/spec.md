# State Store Specification

## Purpose

Redux Toolkit state management for the FSD template: the `StoreProvider` in
the `app` layer, the shared slice/selector builders, and the single RTK Query
base API that all endpoint sets inject into.

## Requirements

### Requirement: Store provider
The application SHALL be wrapped in `StoreProvider`
(`src/app/providers/StoreProvider`), which accepts `children` and an optional
`initialState` preloaded state.

- **Implementation**: `StoreProvider::src/app/providers/StoreProvider/ui/StoreProvider.tsx`

#### Scenario: App bootstrap
- **WHEN** the app starts
- **THEN** the component tree renders inside `StoreProvider` with the configured root reducer

#### Scenario: Tests preload state
- **WHEN** `StoreProvider` renders with an `initialState` that fills a slice
- **THEN** reading that slice's selector on first render returns the preloaded value

### Requirement: Single base API
There SHALL be exactly one RTK Query `createApi` instance (`rtkApi` in
`src/shared/api/rtkApi.ts`). Feature and entity API sets SHALL extend it via
`rtkApi.injectEndpoints` (as `userApi` does), never by calling `createApi` a
second time.

- **Implementation**: `rtkApi::src/shared/api/rtkApi.ts`

#### Scenario: New endpoint set
- **WHEN** an entity needs server endpoints
- **THEN** they are added via `rtkApi.injectEndpoints` in the entity's `api` folder

### Requirement: API reducer registration
The root reducer and middleware SHALL include `rtkApi.reducer` under its
`reducerPath`, and the state schema (`StateSchema`) SHALL declare that key.

- **Implementation**: `rootReducer::src/app/providers/StoreProvider/config/store.ts`

#### Scenario: Store assembly
- **WHEN** the store is created
- **THEN** `[rtkApi.reducerPath]: rtkApi.reducer` is present and the RTK Query middleware is concatenated

### Requirement: Shared slice and selector builders
Slices and selectors across layers SHALL be built with the shared helpers
`buildSlice` and `buildSelector` from `src/shared/lib/store`.

- **Implementation**: `buildSelector::src/shared/lib/store/buildSelector.ts`

#### Scenario: Creating an entity slice
- **WHEN** a new entity adds local state
- **THEN** its slice is created with `buildSlice` and its state is read through `buildSelector`-wrapped selectors
