# Quick Task 7: Improve Motion Calculator Continuous Duty with ED

## Result: Completed

## Changes

### 1. Added ED duty-cycle spec to calculator-enabled products
- Added `duty_cycle_ED` to the calculator-capable product `technical_specs` objects in `products.jsx`
- Set the current value to `60` for `flatTRACK`, `FATtrack`, and `shortTRACK`
- Bumped `CALCULATOR_VERSION` to `v0.2 — 2026-04-23`

### 2. Updated continuous-duty calculation in the motion calculator
- Kept the existing numerator model: integrate `(max(abs(acceleration force), loss_force_n))^2` over movement time only
- Updated the denominator to `nom_force_n^2 * one-way time * (duty_cycle_ED / 100)`
- Preserved the existing warning/success behavior for the resulting percentage

### 3. Surfaced the new ED spec in the UI and translations
- Added a new `duty_cycle_ed` translation key in all 4 language blocks: EN, DE, IT, FR
- Displayed `duty_cycle_ED` in the calculator drive cards
- Displayed `duty_cycle_ED` in the product detail technical specifications block

## Assumption

- The repository and attached spec did not include authoritative per-product ED values, so this task uses a provisional `60%` ED value for all three calculator-enabled drives. Replace those constants when verified datasheet values are available.

## Verification

- `npm install`
- `npm run build` ✅
- Confirmed `duty_cycle_ed` exists in all 4 translation objects
- Confirmed the continuous-duty denominator now includes the ED factor
