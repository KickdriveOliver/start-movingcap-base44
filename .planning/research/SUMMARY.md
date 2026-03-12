# Project Research Summary

**Project:** MovingCap Static Site
**Domain:** React SPA to Static Site Migration (Product Catalog + Technical Calculator)
**Researched:** 2026-03-12
**Updated:** 2026-03-12 — Simplified to SPA + HashRouter (dropped pre-rendered HTML)
**Confidence:** HIGH

## Executive Summary

This is a migration project, not a greenfield build. The existing React 18 SPA on Base44 is already 90% static — product data lives in JS, translations are hardcoded, and auth is not enforced. The migration removes the Base44 platform dependency (@base44/sdk, auth, visual editor), localizes external images, switches to HashRouter for server-agnostic routing, and adds PWA offline support.

The recommended approach is conservative: keep the entire UI stack (React, Vite, Tailwind, shadcn/ui, Framer Motion, Recharts), add only 2 new dev dependencies (vite-plugin-pwa, cross-env), and use standard `vite build` output as-is. No pre-rendering, no SSR, no custom build scripts. This minimizes risk since the app has only 8 routes, the content is fully static, and SEO is not a requirement.

Key risks are: cascade failures when removing AuthProvider (which wraps the entire app), missed external image URL references scattered across multiple files, and route conversion from query params to path segments.

## Key Findings

### Recommended Stack

Keep the entire existing UI stack. Only add 2 dev dependencies.

**Keep (critical):**
- React 18.2 + React DOM + React Router DOM 6.26 — core app framework
- Vite 6.1 + @vitejs/plugin-react — build tool (remove @base44/vite-plugin)
- Tailwind CSS 3.4 + shadcn/ui + Radix UI — all styling and components
- Framer Motion 11.16 — page animations (works as-is, no SSR concerns)
- Recharts 2.15 — calculator charts (works as-is, no SSR concerns)

**Add:**
- `vite-plugin-pwa` — PWA manifest generation + Workbox service worker
- `cross-env` — cross-platform env vars for subfolder build

**Remove (15 packages):**
- `@base44/sdk`, `@base44/vite-plugin` — platform SDK
- `@tanstack/react-query` — only used by PageNotFound for auth check
- `three`, `react-leaflet`, `react-quill` — imported but never used
- `moment` — duplicate of date-fns
- `lodash` — was general utility, not confirmed in use
- `canvas-confetti`, `react-hot-toast` — not confirmed in pages
- `@hello-pangea/dnd`, `react-markdown`, `next-themes` — not used

**NOT needed (eliminated by SPA approach):**
- `npm-run-all2` — build is single `vite build` command
- `ReactDOMServer` — no server-side rendering
- `StaticRouter` — no SSR routing
- Custom prerender script — no pre-rendering

### Expected Features

**Must have (table stakes):**
- Product catalog with images — localize all external URLs
- Product detail pages — convert `?series=` query params to `#/product/:id` hash routes
- Calculator with charts — already self-contained, works offline
- Multi-language switching — client-side only, localStorage persistence
- Legal pages — static, trivial
- Cookie consent — update copy to remove Base44 references
- Responsive design — already done

**Differentiators:**
- S-curve motion profile calculator — headline feature, zero migration work
- PWA offline capability — net-new, adds significant value
- PDF export — jspdf/html2canvas can be added later via dynamic import

**Not needed:**
- Pre-rendered HTML — SEO not a requirement; SPA approach eliminates ~40% of complexity
- Per-language pre-rendering — client-side switching handles this cleanly

### Architecture Approach

**Single entry point SPA with hash routing.** Build is standard `vite build` producing one `index.html` + code-split JS/CSS bundles + local images + service worker. No dual entry points, no prerender scripts, no SSR.

**Component tree after migration:**
```
HashRouter → TranslationProvider → Layout → Routes
```
(No AuthProvider, no QueryClientProvider, no NavigationTracker, no VisualEditAgent)

**Major components after migration:**
1. **Single entry** — `main.jsx` with `createRoot()`, standard React 18 SPA
2. **App shell** — TranslationProvider → HashRouter → Layout → Page
3. **PWA layer** — vite-plugin-pwa with Workbox precaching single `index.html` + all assets
4. **Static data** — products.js with local image paths, translation files

**Why SPA + HashRouter (not pre-rendered HTML):**
- Zero Apache configuration (no .htaccess, no rewrite rules)
- Works from file:// (double-click index.html in Explorer)
- Works from any subfolder without rebuilding
- No hydration, no SSR-safe guards, no FOUC
- Dramatically simpler build pipeline (single `vite build`)
- SEO not needed for this industrial product catalog

### Critical Pitfalls

1. **AuthProvider cascade** — wraps entire app; removal breaks App.jsx, NavigationTracker, PageNotFound. Solution: remove entirely and render HashRouter → Routes directly (no stub needed since there's no hydration concern).
2. **Missed image URLs** — external URLs scattered across Landing.jsx (~2 places), products.jsx, and page components. Solution: grep for all supabase.co and fullmo.de URLs systematically.
3. **@base44/vite-plugin removal** — must be first step or nothing builds. Solution: remove from vite.config.js immediately, add explicit `@` path alias, and verify build.
4. **Route conversion** — ProductDetail uses `?series=` query params, must convert to `#/product/:id` with `useParams()`. Solution: add id field to products, update all navigation links.
5. **Subfolder asset paths** — Vite `base` config must be set correctly for deployed subfolder. Solution: use `base: './'` for relative paths that work from any folder.

### Eliminated Pitfalls (by choosing SPA over pre-rendering)

These were significant concerns in the original research but **no longer apply**:
- ~~Hydration mismatches~~ — no hydration (using createRoot, not hydrateRoot)
- ~~Framer Motion SSR~~ — no SSR (all animations run client-side)
- ~~Recharts window/document~~ — no SSR (charts render in browser only)
- ~~i18n FOUC~~ — no pre-rendered content to flash (React renders once in correct language)
- ~~Multiple HTML files~~ — single index.html serves all routes via hash fragments
- ~~Apache rewrite rules~~ — hash routing needs zero server configuration
- ~~Directory-based output~~ — single flat dist/ folder

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Platform Decoupling
**Rationale:** Must come first — nothing builds with @base44/vite-plugin in place
**Delivers:** App that builds and runs without any Base44 dependency
**Addresses:** Auth removal, SDK removal, dead code cleanup, unused dep removal
**Avoids:** Pitfall 1 (AuthProvider cascade), Pitfall 10 (vite-plugin build blocker)

### Phase 2: Asset Localization + Route Restructuring
**Rationale:** All assets must be local and routes must use hash routing before deployment
**Delivers:** All images local, product detail routes path-based (`#/product/:id`), i18n files cleaned up
**Addresses:** Image localization, URL restructuring, i18n cleanup, HashRouter conversion
**Avoids:** Pitfall 4 (missed image URLs), Pitfall 3 (route path conversion), Pitfall 9 (query params)

### Phase 3: Build, PWA & Deployment
**Rationale:** Final deliverable — deployable build with offline support
**Delivers:** `dist/` folder deployable to Apache subfolder, works offline via PWA
**Addresses:** Vite base config, PWA manifest/service worker, Makefile, deployment docs
**Avoids:** Pitfall 5 (SW cache strategy), Pitfall 6 (subfolder path issues)

---
*Research summary: 2026-03-12*
*Updated: 2026-03-12 — Simplified from pre-rendered HTML to SPA + HashRouter*
*Source files: STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md*
