# Quick Task 005: Improve Motion Calculator

## Task
Enhance the motion calculator with:
1. New "System Overhead" (process time) parameter
2. Three-value time display (Movement / One-way / Cycle)
3. Rename "Force usage" → "Peak force usage" + add "Continuous force usage" metric

## Changes

### 1. translations.jsx (all 4 languages: EN, DE, IT, FR)
- Rename `calculator_force_usage` → `calculator_peak_force_usage`
- Add keys: `calculator_process_time_label`, `calculator_process_time_desc`, `calculator_movement_time`, `calculator_continuous_force_usage`, `calculator_continuous_force_exceeds`, `calculator_continuous_force_ok`, `calculator_process_time_note`

### 2. Calculator.jsx
- Add `processTimeMs: 10` to params state
- Add process time input UI in section 3
- Compute `oneWayTime = movementTime + processTimeMs/1000`
- Update badges to show: Movement | One-way* | Cycle
- Compute average force over one-way time for continuous duty check
- Add continuous force validation when product has `nom_force_n`
- Rename force check label to "Peak force usage"

## Verification
- All 4 languages render correctly
- Process time min 5ms enforced
- Continuous force % calculated correctly
