# Internationalization Specification

## Purpose

Localization of the template UI with `react-i18next`: translation keys per
locale (`en`, `ru`), a language switcher feature, and a translation-aware
test helper.

## Requirements

### Requirement: Translated UI text
User-facing text SHALL be rendered through `useTranslation().t(...)` with
translation keys; display literals SHALL NOT be embedded in components.

#### Scenario: Page heading
- **WHEN** `MainPage` renders with the `ru` locale active
- **THEN** the heading displays the `ru` dictionary value for its key, and switching to `en` re-renders it with the `en` value

### Requirement: Locale dictionaries and namespaces
Each supported locale (`en`, `ru`) SHALL provide its own dictionary tree.
Namespaced translations (for example the `about` page namespace) SHALL be
requested via `useTranslation('<namespace>')`.

#### Scenario: Namespaced translation
- **WHEN** `AboutPage` renders
- **THEN** it reads keys from the `about` namespace of the active locale

### Requirement: Language switching
The `LangSwitcher` feature SHALL toggle the active language between `ru` and
`en` through `i18n.changeLanguage`, and SHALL support a `short` label mode.

#### Scenario: Switch language
- **WHEN** the user clicks the language switcher while `ru` is active
- **THEN** the active language becomes `en` and translated text re-renders

### Requirement: Translation-aware tests
Component tests SHALL render through `renderWithTranslation`
(`src/shared/lib/tests`), which wraps the component in `I18nextProvider` with
the test i18n instance.

#### Scenario: Testing a translated component
- **WHEN** a component using `t()` is tested
- **THEN** it is rendered via `renderWithTranslation` so keys resolve
