# Quick Task 008: Estimate usable max acceleration from peak and nominal force

## Goal

Replace the current max-acceleration helper value so it no longer assumes `max_force_n` is fully available during a normal S-curve move. Use the mean of `max_force_n` and `nom_force_n` as the estimated available force at the acceleration peak, and update calculator wording to present this as an estimate instead of a hard physical limit.

## Tasks

1. Update the calculator acceleration helper logic in `src/pages/Calculator.jsx`
   - Action: Calculate the helper acceleration from the average of peak and nominal force when nominal force is available; otherwise fall back to the entered peak force.
   - Verify: The helper result no longer derives directly from peak force alone for calculator-enabled products.
   - Done: The auto-apply acceleration value follows the new estimate.

2. Update visible calculator wording and translations
   - Action: Rename the displayed helper label from a physical limit to an estimated usable acceleration and add a short explanation that reflects the new force assumption. Update the peak-force input label to match the meaning of `max_force_n`.
   - Verify: EN, DE, IT, and FR contain the updated label and explanation keys used by the calculator.
   - Done: The calculator UI no longer presents the helper value as a strict physical limit.

3. Validate and document
   - Action: Run the build, write `SUMMARY.md`, and add this quick task to `STATE.md`.
   - Verify: `npm run build` succeeds.
   - Done: Quick-task artifacts and state tracking are complete.