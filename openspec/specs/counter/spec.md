# Counter Specification

## Purpose

Demo entity of the template: a Redux slice owning a numeric counter state and
a UI component that displays the value and dispatches increment/decrement
actions. It demonstrates the canonical FSD entity structure (model / ui /
public API index).

## Requirements

### Requirement: Counter state transitions
The Counter slice SHALL keep a numeric `value` in state and SHALL apply pure
transitions: the increment action increases the value by one, the decrement
action decreases it by one (below zero allowed).

- **Implementation**: `counterSlice::src/entities/Counter/model/slice/counterSlice.ts`

#### Scenario: Increment
- **GIVEN** the counter value is 5
- **WHEN** the increment action is dispatched
- **THEN** the value becomes 6

#### Scenario: Decrement below zero
- **GIVEN** the counter value is 0
- **WHEN** the decrement action is dispatched
- **THEN** the value becomes -1

### Requirement: Unknown actions leave counter state intact
The Counter reducer SHALL return the same state for actions it does not
handle.

- **Implementation**: `counterSlice::src/entities/Counter/model/slice/counterSlice.ts`

#### Scenario: Unrelated action
- **GIVEN** the counter value is 3
- **WHEN** an unrelated action is dispatched
- **THEN** the value stays 3

### Requirement: Counter value selection
The current value SHALL be exposed through selectors from the entity's public
API.

- **Implementation**: `getCounterValue::src/entities/Counter/model/selectors/getCounterValue/getCounterValue.ts`

#### Scenario: Read the value
- **GIVEN** the store holds counter value 10
- **WHEN** the counter value selector is read
- **THEN** it returns 10

### Requirement: Counter UI display and controls
The Counter component SHALL display the current value and SHALL dispatch
increment and decrement actions from its controls.

- **Implementation**: `Counter::src/entities/Counter/ui/Counter.tsx`

#### Scenario: Display the value
- **GIVEN** the counter value is 10
- **WHEN** the Counter component renders
- **THEN** 10 is displayed

#### Scenario: Increment control
- **WHEN** the increment control is activated
- **THEN** the increment action is dispatched and the displayed value increases by 1
