# Authentication & User Specification

## Purpose

The current user (profile and roles) as an FSD entity (`src/entities/User`):
domain types, memoized selectors, the slice, and the `initAuthData` bootstrap
service. The template keeps this entity minimal — auth state lives in memory
and is fetched on application start, without persistence or a separate
initialization flag.

## Requirements

### Requirement: Public entity API
The User entity SHALL export its whole surface through
`src/entities/User/index.ts`: `getUserAuthData`, `getUserRoles`,
`isUserAdmin`, `isUserManager`, `userReducer`, `userActions`, the
`User`/`UserSchema` types, `UserRole`, and `initAuthData`. Consumers SHALL
import from this public API only.

- **Implementation**: `getUserRoles::src/entities/User/index.ts`

#### Scenario: Widget consumes user roles
- **WHEN** a widget needs to know whether the user is an admin
- **THEN** it imports `isUserAdmin` from `@/entities/User` (the public entry)

### Requirement: Auth data initialization
The app SHALL dispatch `initAuthData` (a `createAsyncThunk`) on start. On
fulfillment the user slice SHALL store the fetched `User` as auth data.

- **Implementation**: `initAuthData::src/entities/User/model/services/initAuthData.ts`

#### Scenario: Successful initialization
- **WHEN** `initAuthData` fulfills with a `User`
- **THEN** `getUserAuthData` returns that user afterwards

#### Scenario: Failed initialization
- **WHEN** `initAuthData` rejects
- **THEN** `getUserAuthData` keeps returning nothing and protected routes treat the user as unauthenticated

### Requirement: Role selectors
Role checks (`isUserAdmin`, `isUserManager`) SHALL be memoized selectors
derived from `getUserRoles` via `createSelector`.

- **Implementation**: `isUserAdmin::src/entities/User/model/selectors/roleSelectors.ts`

#### Scenario: Role check
- **WHEN** the store holds roles `[UserRole.USER]`
- **THEN** `isUserAdmin` selects `false` without recomputation on unrelated state updates

### Requirement: User data via RTK Query
The profile fetch used by `initAuthData` SHALL go through `userApi`, created
with `rtkApi.injectEndpoints` in the entity's `api` folder, and SHALL surface
the domain `User` type to consumers.

- **Implementation**: `getUserDataByIdQuery::src/entities/User/api/userApi.ts`

#### Scenario: Fetching the profile
- **WHEN** `initAuthData` runs
- **THEN** the request is issued by the RTK Query endpoint declared in `src/entities/User/api/userApi.ts`

### Requirement: In-memory session scope
The entity SHALL NOT persist auth state to storage and SHALL NOT track a
separate initialized flag in the slice; initialization re-runs per application
session.

- **Implementation**: `userSlice::src/entities/User/model/slice/userSlice.ts`

#### Scenario: Page reload
- **WHEN** the user reloads the app
- **THEN** auth data is empty until `initAuthData` completes again
