# Requirements: MovingCap Static Site

**Defined:** 2026-03-12
**Core Value:** The product catalog and motion calculator must work flawlessly as a fully offline-capable static site with zero external service dependencies.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Platform Decoupling

- [ ] **PLAT-01**: Remove `@base44/sdk` and `@base44/vite-plugin` from dependencies and Vite config
- [ ] **PLAT-02**: Strip `AuthContext.jsx` and all auth flow — replace with direct rendering (no auth gate)
- [ ] **PLAT-03**: Remove `NavigationTracker.jsx` (platform logging) and `VisualEditAgent.jsx` (platform editor)
- [ ] **PLAT-04**: Remove `app-params.js` (reads base44 app_id, token, server_url from URL params)
- [ ] **PLAT-05**: Remove `PageNotFound.jsx` auth query — replace with static 404 page
- [ ] **PLAT-06**: Remove unused dependencies (three, react-leaflet, react-quill, moment, lodash, canvas-confetti, react-hot-toast, @hello-pangea/dnd, react-markdown, next-themes, @tanstack/react-query)
- [ ] **PLAT-07**: Remove dead pages (`Home.jsx`, `TranslationExport.jsx`) and their route entries

### Asset Localization

- [ ] **ASSET-01**: Download all product images from Supabase storage to `src/assets/images/`
- [ ] **ASSET-02**: Download all Landing page images from external URLs to `src/assets/images/`
- [ ] **ASSET-03**: Update all image references in `products.jsx` and page components to use local paths
- [ ] **ASSET-04**: Verify no remaining external asset URLs (supabase.co, fullmo.de) in source code

### Route Restructuring

- [ ] **ROUTE-01**: Convert from `BrowserRouter` to `HashRouter` for Apache-compatible routing
- [ ] **ROUTE-02**: Convert ProductDetail from `?series=` query params to hash-based routes (`#/product/turntrack`)
- [ ] **ROUTE-03**: Update all internal links and `createPageUrl()` utility for hash routing

### i18n Cleanup

- [ ] **I18N-01**: Rename `.json.jsx` translation files to `.js` (remove misleading extension)
- [ ] **I18N-02**: Update all import paths for renamed translation files

### Build & Deployment

- [ ] **BUILD-01**: Replace `@base44/vite-plugin` config in `vite.config.js` with standard Vite setup (path aliases, env vars)
- [ ] **BUILD-02**: Configure Vite `base` option for subfolder deployment (relative asset paths)
- [ ] **BUILD-03**: Add PWA support via `vite-plugin-pwa` (manifest, service worker, offline precaching)
- [ ] **BUILD-04**: Create build instructions / Makefile with clear deployment documentation
- [ ] **BUILD-05**: Verify build output works from local folder (open index.html directly in browser)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### SEO & Performance

- **SEO-01**: Add meta tags and Open Graph data per page
- **I18N-03**: Per-language pre-rendered HTML for multilingual SEO
- **PERF-01**: Bundle analysis and tree-shaking optimization

### Quality

- **TEST-01**: Add E2E tests for critical paths (product catalog, calculator, language switching)
- **A11Y-01**: Accessibility audit and remediation

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Server-side rendering (SSR) | SEO not needed; SPA + hash routing chosen for simplicity |
| Pre-rendered static HTML per route | Dropped in favor of SPA approach — eliminates SSR/hydration complexity |
| Authentication / user accounts | Public site, auth was never enforced on Base44 |
| Database / API backend | All data is static JS, no server-side data needed |
| CMS / admin panel | Product data maintained directly in source code |
| Real-time features (LLM, email, SMS) | Platform integrations were exported but never used by any page |
| Search engine optimization | Not a priority for this industrial product catalog migration |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PLAT-01 | Phase 1 | Pending |
| PLAT-02 | Phase 1 | Pending |
| PLAT-03 | Phase 1 | Pending |
| PLAT-04 | Phase 1 | Pending |
| PLAT-05 | Phase 1 | Pending |
| PLAT-06 | Phase 1 | Pending |
| PLAT-07 | Phase 1 | Pending |
| ASSET-01 | Phase 2 | Pending |
| ASSET-02 | Phase 2 | Pending |
| ASSET-03 | Phase 2 | Pending |
| ASSET-04 | Phase 2 | Pending |
| ROUTE-01 | Phase 2 | Pending |
| ROUTE-02 | Phase 2 | Pending |
| ROUTE-03 | Phase 2 | Pending |
| I18N-01 | Phase 2 | Pending |
| I18N-02 | Phase 2 | Pending |
| BUILD-01 | Phase 3 | Pending |
| BUILD-02 | Phase 3 | Pending |
| BUILD-03 | Phase 3 | Pending |
| BUILD-04 | Phase 3 | Pending |
| BUILD-05 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-12*
*Last updated: 2026-03-12 after initialization*
