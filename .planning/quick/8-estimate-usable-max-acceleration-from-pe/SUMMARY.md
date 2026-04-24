# Quick Task 8: Estimate usable max acceleration from peak and nominal force

## Result: Completed

## Changes

### 1. Updated the helper acceleration model
- Changed the calculator helper acceleration in `Calculator.jsx` so it no longer derives directly from peak force alone.
- The estimated available force is now calculated as the mean of `max_force_n` and `nom_force_n` when nominal force is available.
- Generic mode still falls back to the entered peak force if no nominal-force value exists.

### 2. Revised calculator wording
- Renamed the visible helper label from a strict physical limit to an estimated usable acceleration.
- Added a short explanation under the helper value to clarify that the estimate is intended for standard S-curve motion and uses the mean of peak and nominal force when available.
- Updated the force input label to match the meaning of `max_force_n` as peak force.

### 3. Updated translations
- Revised the relevant calculator labels in EN, DE, IT, and FR.
- Added a new explanation key for the estimated acceleration helper in all four languages.

### 4. Preserved ED as internal-only
- No ED value was reintroduced into visible calculator or product-detail UI.
- Existing `duty_cycle_ED` usage remains internal to the continuous-duty calculation only.

## Verification

- `npm run build` ✅
- Build completed successfully after the acceleration-model and translation changes.

## Notes

- VS Code type diagnostics still show pre-existing JS/TS analysis noise in this repo, but the production build passes.
