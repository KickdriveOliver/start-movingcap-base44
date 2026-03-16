# Quick Task 005: Improve Motion Calculator — Summary

## Result: Completed

## Changes

### 1. New "System Overhead" parameter (`Calculator.jsx`)
- Added `processTimeMs: 10` to params state (default 10ms)
- New input field in section "3. S-Curve Motion Parameters" with ±10% buttons
- Minimum enforced at 5ms on blur
- Label: "System Overhead (ms)" with description about TCP/IP, EtherCAT, internal processing delays

### 2. Three-value time display in Motion Analysis
- **Movement**: Pure trajectory time (formerly "One-way")
- **One-way***: Movement time + System Overhead
- **Cycle**: 2× One-way time
- Footnote: "* One-way = Movement + System Overhead"

### 3. Peak force usage (renamed)
- `calculator_force_usage` → `calculator_peak_force_usage` in all 4 languages
- Display text now reads "Peak force usage: XX%" (EN), "Spitzenkraftnutzung: XX%" (DE), etc.

### 4. Continuous force usage (new metric)
- Calculates average force over the full one-way time (movement + idle process time)
- Uses trapezoidal numerical integration over trajectory acceleration data
- Compares average force against `nom_force_n` from product specs
- Shows percentage as a validation check (green ≤100%, amber >100%)
- Only displayed when a product with `nom_force_n` is selected

### Files Modified
- `src/pages/Calculator.jsx` — State, UI, validation logic
- `src/components/i18n/translations.jsx` — 8 new keys + 1 renamed key in all 4 languages (EN, DE, IT, FR)

### Verification
- Build: Clean (0 errors)
- All 8 new translation keys confirmed present in all 4 language blocks
- Old `calculator_force_usage` key fully removed
