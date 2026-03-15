# Quick Task Plan

- **Task ID:** 001
- **Date:** 2026-03-15
- **Description:** Fix homepage `Learn More` buttons resolving to `/product/undefined`.

## Tasks

1. **Fix route slug source in landing cards**
   - **Files:** `src/pages/Landing.jsx`
   - **Action:** Replace the link parameter from `item.id` to a stable product slug derived from local static product data.
   - **Verify:** Clicking each homepage `Learn More` button navigates to `/product/<valid-slug>` and no longer to `/product/undefined`.
   - **Done:** Yes

2. **Validate with build**
   - **Files:** project build
   - **Action:** Run `npm run build` to ensure no regressions from the change.
   - **Verify:** Build succeeds.
   - **Done:** Yes

3. **Document quick task completion**
   - **Files:** `.planning/quick/001-fix-homepage-learn-more-links/SUMMARY.md`, `.planning/STATE.md`
   - **Action:** Write summary and add entry to Quick Tasks Completed table.
   - **Verify:** Summary exists and state table updated.
   - **Done:** Yes
