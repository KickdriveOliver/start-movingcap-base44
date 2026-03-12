# Codebase Concerns

**Analysis Date:** 2026-03-12

## Tech Debt

**Duplicate Date Libraries:**
- Issue: Both `date-fns` and `moment` are dependencies
- Why: Likely added incrementally without consolidation
- Impact: Bundle size bloat (~70KB for moment), inconsistent date handling
- Fix approach: Pick one (date-fns recommended — lighter, tree-shakeable) and migrate

**Empty/Stub Pages:**
- Issue: `Home.jsx` is an empty div, `TranslationExport.jsx` is an empty file
- Why: Auto-generated stubs or planned features never implemented
- Impact: Dead routes accessible via URL, confusing for developers
- Fix approach: Remove from `pages.config.js` or implement

**Inline Translations in Legal Pages:**
- Issue: `Impressum.jsx` and `Datenschutz.jsx` define their own inline translations objects instead of using the i18n system
- Why: Long legal text may have been added separately from the main translation workflow
- Impact: Two translation patterns to maintain — central i18n files AND inline objects
- Fix approach: Migrate inline translations to central `src/components/i18n/` files

**Feature Fallback Complexity:**
- Issue: Multi-layer fallback for product features duplicated across 3 files (Landing, Products, ProductDetail)
- Why: Evolved to handle products with and without `feature_keys`
- Impact: Logic duplication, risk of inconsistency when updating
- Fix approach: Extract shared `getProductFeatures(product, t)` helper into `products.jsx`

**Mixed File Extensions Pattern:**
- Issue: Translation files use `.json.jsx` extension (e.g., `en.json.jsx`) — misleading since they export JS objects, not JSON
- Why: Likely evolved from a JSON-based translation approach
- Impact: Confusing file naming, IDE may apply wrong syntax highlighting
- Fix approach: Rename to `.js` or `.jsx`

## Known Bugs

**No known user-facing bugs identified during static analysis.**

## Security Considerations

**Auth Token in URL:**
- Risk: `access_token` passed via URL query parameter can leak via referrer headers, browser history, server logs
- Current mitigation: Token is removed from URL immediately (`removeFromUrl: true` in `app-params.js`)
- Recommendations: Consider using `#hash` fragments or POST-based token exchange instead

**No CSRF Protection:**
- Risk: API calls via Base44 SDK may be vulnerable if platform doesn't handle CSRF
- Current mitigation: Relies on Base44 platform's own CSRF protections
- Recommendations: Verify Base44 SDK handles this; add custom headers if needed

**No Content Security Policy:**
- Risk: XSS vulnerabilities — inline scripts, external image sources
- Current mitigation: None visible in `index.html`
- Recommendations: Add CSP meta tag or HTTP headers

**External Resources Not Integrity-Checked:**
- Risk: Product images loaded from external domains (Supabase, fullmo.de) without SRI
- Current mitigation: None
- Recommendations: Consider self-hosting critical images or adding integrity checks

## Performance Bottlenecks

**Large Translation Files:**
- Problem: All 4 language translation files (~1100 lines each) are imported synchronously
- Measurement: ~4400 lines of translation data loaded on every page load
- Cause: Static imports in `useTranslations.jsx` — all languages loaded regardless of selection
- Improvement path: Dynamic import for non-active languages, or code-split per language

**Calculator Page Size (1081 lines):**
- Problem: Largest file in the codebase with complex inline calculations
- Measurement: ~1081 lines, likely >30KB source
- Cause: Physics engine, UI, and visualization in one file
- Improvement path: Extract calculation logic into separate module, lazy-load the Recharts dependency

**shadcn/ui Component Count:**
- Problem: ~50 shadcn/ui component files, most possibly unused
- Measurement: ~50 files in `src/components/ui/`
- Cause: Generated via shadcn CLI without pruning
- Improvement path: Audit usage and remove unused components (Vite tree-shaking should minimize impact)

**No Code Splitting:**
- Problem: All pages bundled together (no lazy loading)
- Cause: Direct imports in `pages.config.js`
- Improvement path: Use `React.lazy()` for page components, especially Calculator

## Fragile Areas

**`pages.config.js` (Auto-Generated):**
- Why fragile: File is marked as auto-generated, but manually edited values (`mainPage`) can be overwritten
- Common failures: Unknown — depends on base44 platform tooling behavior
- Safe modification: Only change `mainPage` value
- Test coverage: None

**Product Feature Fallback Logic:**
- Why fragile: Complex multi-tier fallback duplicated in 3 files
- Common failures: Features not showing if `feature_keys` naming changes
- Safe modification: Update all 3 files simultaneously (Landing, Products, ProductDetail)
- Test coverage: None

**Translation Key Consistency:**
- Why fragile: ~200+ keys must be synchronized across 4 language files
- Common failures: Missing keys in one language fall back silently to English or raw key
- Safe modification: Add keys to ALL 4 files at once
- Test coverage: None — could add automated key-sync validation

## Scaling Limits

**Translation System:**
- Current capacity: ~200 keys × 4 languages
- Limit: Static files become unwieldy at ~500+ keys
- Symptoms at limit: Slow IDE performance, merge conflicts on multi-person teams
- Scaling path: Switch to i18next or similar with namespaced JSON files

## Dependencies at Risk

**`react-quill` ^2.0.0:**
- Risk: Package appears imported but no WYSIWYG editor visible in pages — potentially unused
- Impact: Adds to bundle size unnecessarily
- Migration plan: Audit usage, remove if unused

**`moment` ^2.30.1:**
- Risk: Large, legacy library — `date-fns` already present as alternative
- Impact: Bundle bloat (~70KB gzipped)
- Migration plan: Replace moment usage with date-fns equivalents

**`three` ^0.171.0:**
- Risk: Very large 3D library — no confirmed usage in current page code
- Impact: Significant bundle size if not tree-shaken
- Migration plan: Audit usage, remove if unused

**`@base44/sdk` ^0.8.0:**
- Risk: Platform-specific SDK, no public documentation visible — vendor lock-in
- Impact: Entire app depends on this SDK for auth, data, and integrations
- Migration plan: N/A — core platform dependency

## Missing Critical Features

**No Testing Infrastructure:**
- Impact: No automated quality assurance, regression risk on every change
- Recommendation: Add Vitest, prioritize Calculator physics tests

**No Error Boundaries:**
- Impact: Unhandled JS errors crash the entire app
- Recommendation: Add React Error Boundary at Layout level

**No Production Build Optimization Audit:**
- Impact: Potentially large bundles from unused libraries
- Recommendation: Run `npx vite-bundle-visualizer` to audit bundle

---

*Concerns analysis: 2026-03-12*
*Review quarterly or before major changes*
