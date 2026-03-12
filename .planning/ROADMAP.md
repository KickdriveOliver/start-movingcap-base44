# Roadmap: MovingCap Static Site

## Overview

This migration takes the existing MovingCap React SPA from the Base44 platform to a self-contained static site in 3 phases. Phase 1 removes all platform dependencies so the app builds and runs standalone. Phase 2 localizes external assets, restructures routes, and cleans up i18n. Phase 3 adds PWA offline support, configures deployment, and produces the final deliverable.

## Phases

- [x] **Phase 1: Platform Decoupling** - Remove all Base44 dependencies so the app builds and runs standalone
- [x] **Phase 2: Asset Localization & Route Restructuring** - Localize all external images, convert to hash routing, clean up i18n
- [ ] **Phase 3: Build, PWA & Deployment** - Add PWA support, configure subfolder deployment, create build instructions

## Phase Details

### Phase 1: Platform Decoupling
**Goal**: App builds with `vite build` and runs in browser with zero Base44 dependencies
**Depends on**: Nothing (first phase)
**Requirements**: PLAT-01, PLAT-02, PLAT-03, PLAT-04, PLAT-05, PLAT-06, PLAT-07
**Success Criteria** (what must be TRUE):
  1. `npm run build` completes without errors (no @base44/* imports)
  2. `npm run dev` serves the app and all pages render correctly
  3. No references to `@base44/sdk`, `base44.auth`, `base44.appLogs`, or `base44.integrations` in source code
  4. Unused dependencies (three, react-leaflet, moment, etc.) are removed from `package.json`
  5. Dead pages (`Home.jsx`, `TranslationExport.jsx`) are removed and not routable
**Plans**: 3 plans

Plans:
- [x] 01-01: Remove @base44/vite-plugin and SDK, fix vite.config.js and build
- [x] 01-02: Strip AuthContext, NavigationTracker, VisualEditAgent, app-params, PageNotFound auth
- [x] 01-03: Remove unused dependencies and dead pages, verify clean build

### Phase 2: Asset Localization & Route Restructuring
**Goal**: All images are local, routes use hash routing, i18n files are cleaned up
**Depends on**: Phase 1
**Requirements**: ASSET-01, ASSET-02, ASSET-03, ASSET-04, ROUTE-01, ROUTE-02, ROUTE-03, I18N-01, I18N-02
**Success Criteria** (what must be TRUE):
  1. All product images load from `src/assets/images/` — no Supabase or CDN URLs remain
  2. `grep -r "supabase.co\|fullmo.de" src/` returns zero results
  3. App uses `HashRouter` and all pages are accessible via hash URLs (#/products, #/calculator, etc.)
  4. Product detail pages use path segments (#/product/turntrack) instead of query params
  5. Translation files use `.js` extension and all imports are updated
**Plans**: 3 plans

Plans:
- [x] 02-01: Download all external images and update product data / page references
- [x] 02-02: Convert to HashRouter and restructure product detail routing
- [x] 02-03: Rename i18n files and update imports

### Phase 3: Build, PWA & Deployment
**Goal**: Build output is a deployable static site with PWA offline support
**Depends on**: Phase 2
**Requirements**: BUILD-01, BUILD-02, BUILD-03, BUILD-04, BUILD-05
**Success Criteria** (what must be TRUE):
  1. Vite config uses standard `resolve.alias` for `@/` paths (no @base44/vite-plugin)
  2. Build output works when served from a subfolder (configurable `base` option)
  3. PWA manifest is generated and service worker precaches all assets
  4. App works offline after first load (tested via DevTools Network offline mode)
  5. Build instructions / Makefile exist and are accurate — new developer can deploy in <5 minutes
**Plans**: 3 plans

Plans:
- [ ] 03-01: Finalize Vite config with path aliases and subfolder base
- [ ] 03-02: Add vite-plugin-pwa with manifest and service worker
- [ ] 03-03: Create Makefile, README build instructions, and validate deployment

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Platform Decoupling | 3/3 | Complete | 2026-03-12 |
| 2. Asset Localization & Routing | 3/3 | Complete | 2026-03-12 |
| 3. Build, PWA & Deployment | 0/3 | Not started | - |

---
*Roadmap created: 2026-03-12*
*Last updated: 2026-03-12 after Phase 2 execution*
