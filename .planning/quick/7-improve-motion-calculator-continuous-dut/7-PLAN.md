# Quick Task 007: Improve motion calculator continuous duty with ED duty cycle

## Goal
Update the calculator-supported product specs and continuous-duty validation so the reported percentage uses an ED-adjusted nominal-force baseline over one-way time, then confirm the new spec and messaging are consistently available in EN, DE, IT, and FR.

## Tasks

### 1. Add ED duty-cycle product specs and surface them where technical specs are shown
- Files: `src/components/data/products.jsx`, `src/pages/ProductDetail.jsx`, `src/pages/Calculator.jsx`, `src/components/i18n/translations.jsx`
- Action: Add `duty_cycle_ED` to the relevant calculator-supported product `technical_specs` entries alongside `nom_force_n` and `loss_force_n`. Render the ED percentage anywhere those technical specs are explicitly shown in the product detail and calculator product summary panels, and add the required translation key(s) for the ED label and any short helper copy in all four locales.
- Verify: Each calculator-supported product with `technical_specs` exposes `duty_cycle_ED` in data and shows the translated ED value in both technical-spec UIs without fallback text.
- Done: Relevant products have ED values in their specs, and users can see the ED rating in the same places they already see nominal force.

### 2. Rework continuous-duty validation to use the ED-adjusted nominal-force baseline over one-way time
- Files: `src/pages/Calculator.jsx`
- Action: Keep the existing numerator model as the integral of `(max(abs(acceleration force), loss_force_n))^2` over movement time only. Update the denominator baseline from `nom_force_n^2 * oneWayTime` to `nom_force_n^2 * oneWayTime * (duty_cycle_ED / 100)`, using the existing one-way time definition of movement time plus process time. Ensure the continuous-duty percentage and warning/success state are computed from that ED-adjusted baseline and only run when the required specs are present.
- Verify: A calculator-supported product with `duty_cycle_ED < 100` produces a higher continuous-duty percentage than before for the same trajectory, while process time still affects only the denominator via one-way time.
- Done: Continuous-duty validation reflects ED-limited nominal-force capacity instead of assuming 100% nominal-force availability across the full 10-minute duty cycle.

### 3. Review translation coverage and validate the project
- Files: `src/components/i18n/translations.jsx`
- Action: Audit the continuous-duty and ED-related translation keys across EN, DE, IT, and FR so the calculator and product-detail views have complete copy coverage with no missing keys. Finish by running the project validation step.
- Verify: `npm run build` completes successfully, and switching through all four languages leaves no missing-key or fallback-label regressions for the updated calculator/product-spec strings.
- Done: The repository builds cleanly and the new ED-driven behavior is covered by localized UI copy in all supported languages.
