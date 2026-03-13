# Pitfalls Research

**Domain:** React SPA to Static Site Migration  
**Project:** MovingCap servo drive product catalog (Base44 → self-contained static)  
**Researched:** 2026-03-12  
**Updated:** 2026-03-12 — Simplified to SPA + HashRouter (dropped pre-rendered HTML)
**Confidence:** High — based on direct codebase analysis and established migration patterns

---

## Critical Pitfalls

### Pitfall 1: AuthProvider Wraps Entire App — Removal Cascades Everywhere

**What goes wrong:**  
Removing `@base44/sdk` and `AuthProvider` causes a cascade of import failures and runtime crashes. The `AuthProvider` wraps the entire component tree in `App.jsx`. The `AuthenticatedApp` component calls `useAuth()` and gates all route rendering behind auth state (`isLoadingPublicSettings`, `isLoadingAuth`, `authError`). Removing `AuthProvider` without replacing it breaks:
- `App.jsx` — `AuthenticatedApp` calls `useAuth()` which throws `"useAuth must be used within an AuthProvider"`
- `NavigationTracker.jsx` — imports `base44` client directly and calls `base44.appLogs.logUserInApp()`
- `PageNotFound.jsx` — calls `base44.auth.me()` via `useQuery`
- `AuthContext.jsx` — imports `createAxiosClient` from `@base44/sdk/dist/utils/axios-client`

**Why it happens:**  
The auth layer is not enforced (no login wall for product pages) but is deeply wired as infrastructure. `AuthenticatedApp` in `App.jsx` shows a loading spinner until `isLoadingPublicSettings` resolves. Without the SDK, the app never progresses past the spinner or outright crashes on missing imports.

**How to avoid it:**
1. ~~Create a minimal stub `AuthContext`~~ — **Instead, remove entirely.** With SPA + HashRouter, there's no hydration concern. Just delete the AuthProvider and AuthenticatedApp wrapper, render Routes directly.
2. Delete `NavigationTracker.jsx` entirely — it only reports to the Base44 platform
3. Replace `PageNotFound.jsx` with a simple static NotFound component
4. Remove `@base44/sdk`, `@base44/vite-plugin`, `src/api/base44Client.js`, `src/api/entities.js`, `src/api/integrations.js` as a batch
5. Remove `VisualEditAgent.jsx` (648 lines of platform coupling)
6. Strip `app-params.js` which reads `app_id`, `server_url`, `access_token` from URL params

**Warning signs:**
- Build fails with `Cannot resolve '@base44/sdk'`
- White screen with infinite spinner (auth loading state never resolves)
- Console error: `useAuth must be used within an AuthProvider`
- `vite.config.js` fails because `@base44/vite-plugin` is missing

**Phase:** Phase 1 (Platform Decoupling) — must be first, all other work depends on clean builds

---

### ~~Pitfall 2: Hydration Mismatches During Pre-rendering~~ — ELIMINATED

**Status:** This pitfall no longer applies.

With the SPA + HashRouter approach, there is no pre-rendering, no SSR, and no hydration. The app uses `createRoot()` exclusively (never `hydrateRoot()`). All components render client-side only. This means:
- No `window is not defined` errors during build
- No `localStorage` SSR guards needed
- No hydration mismatch warnings
- No FOUC (Flash of Unstyled/Untranslated Content)
- Framer Motion, Recharts, and all browser-dependent code works without modification

**Original concern:** Pre-rendered HTML differing from client-rendered HTML causing React hydration errors. Multiple sources of non-determinism: `localStorage` reads, `window.location.search`, `new Date()`, etc.

**Why eliminated:** No server-side or build-time rendering occurs. Everything renders in the browser where `window`, `document`, `localStorage` are always available.

---

### Pitfall 3: Route Path Conversion — createPageUrl() and Product Detail URLs

**What goes wrong:**  
After switching from `BrowserRouter` to `HashRouter`, existing navigation helpers and product detail URL patterns break. `createPageUrl()` generates paths that don't work with hash routing. Product detail pages lose their `?series=` query parameter approach.

**Why it happens:**  
- `createPageUrl("Products")` currently returns `'/' + pageName.toLowerCase()` — this must work within hash routing context
- `ProductDetail.jsx` reads `series` from `new URLSearchParams(window.location.search)` (line 17) — query params in hash URLs work differently
- Products page links use `createPageUrl("ProductDetail") + "?series=turnTRACK"` — must convert to path-based routing
- There are 7 products: turnTRACK, maxTRACK, flatTRACK, FATtrack, shortTRACK, pushTRACK, sideTRACK
- PascalCase page names in `pages.config.js` vs lowercase in URL generation

**How to avoid it:**
1. **Convert from query params to path segments**: `#/product/turntrack` instead of `?series=turnTRACK`
2. Switch `ProductDetail.jsx` from `window.location.search` to React Router's `useParams()` hook
3. Add an `id` field to each product in `products.js`: `{ id: 'turntrack', name: 'turnTRACK', ... }`
4. Add `getProductById(id)` lookup function to `products.js`
5. Update all navigation that generates product detail URLs to use `<Link to={`/product/${product.id}`}>`
6. Replace `createPageUrl()` with direct React Router `<Link>` components or a simplified hash-aware helper
7. Remove `pages.config.js` (platform-generated route config) — define routes explicitly in `App.jsx`

**Warning signs:**
- Product detail page shows "Product not found" after migration
- Links from Products page don't navigate to correct product
- `createPageUrl()` generates wrong paths
- URL bar shows `#/?series=turnTRACK` instead of `#/product/turntrack`

**Phase:** Phase 2 (Routing Conversion) — must be done before deployment

---

### Pitfall 4: External Image URL Replacement — Missed References and Broken Paths

**What goes wrong:**  
Images still load from Supabase CDN or fullmo.de after migration, then fail when those URLs become unavailable. Some images get downloaded but referenced paths in code don't match the actual file locations.

**Why it happens:**  
External image URLs are scattered across multiple locations with **different patterns**:
- `products.jsx`: `image_url` and `gallery_urls` arrays — 7 products × 2 fields = ~14 URLs from `qtrypzzcjebvfcihiynt.supabase.co` and `fullmo.de`
- `Landing.jsx`: Hardcoded in two separate data structures — `img` property in series showcase (~7 URLs, line ~116-146) AND `image` property in use cases section (~3 URLs, line ~280-300) — **easy to miss the second set**
- Datasheet URLs (`datasheet_url`, `datasheet_url_de`, `datasheet_url_en`, `datasheet_url_it`) point to `movingcap.de` — these are PDFs hosted externally and should probably remain external links, not downloaded
- Product images have hashed filenames like `e86935_ani-001.jpg`, `dc47a5_moving-cap-004b.jpg` that are not human-readable

**How to avoid it:**
1. Exhaustive grep for all external domains: `qtrypzzcjebvfcihiynt.supabase.co`, `fullmo.de/assets`, `base44-prod` — current search finds 30+ matches
2. Create a canonical mapping file: `{ oldUrl: newLocalPath }` before touching any code
3. Download all images to `public/images/` with descriptive names: `turntrack-main.jpg`, not the hash
4. Reference images as `/images/turntrack-main.jpg` (relative to Vite `base`) or use Vite static imports
5. Explicitly decide: datasheet PDFs stay as external links to `movingcap.de` (documented decision)
6. After replacement, grep again to verify zero remaining external image URLs
7. Check `gallery_urls` arrays — these are distinct from `image_url` and must both be updated

**Warning signs:**
- Broken image icons on product cards or landing page
- Network tab shows requests to `supabase.co` domains
- Build succeeds but images 404 in production (wrong relative path with subfolder deployment)
- Some products show images, others don't (partial replacement)

**Phase:** Phase 1 (Asset Localization) — do immediately after platform decoupling

---

### Pitfall 5: PWA Offline Support — Service Worker Cache Strategy Mistakes

**What goes wrong:**  
- Service worker caches stale JS and users see outdated content indefinitely
- Offline mode works for some pages but not others
- Pre-cached assets exceed reasonable cache size (especially if product images are large)
- Update mechanism fails: users never get new versions without clearing browser data

**Why it happens:**  
- Cache-first strategy for the single `index.html` means users never see updates until SW updates
- Network-first for HTML causes offline failures
- No cache versioning strategy: old SW serves old assets even after deployment
- Service worker scope may not match subfolder deployment path

**How to avoid it (simplified for SPA approach):**
1. Use `vite-plugin-pwa` with `registerType: 'autoUpdate'` — handles SW lifecycle automatically
2. Workbox `generateSW` with `globPatterns: ['**/*.{html,js,css,jpg,png,webp,svg,woff2}']` precaches everything
3. Content-hashed JS/CSS filenames (Vite default) ensure cache busting — old SW can't serve stale assets
4. Only **one HTML file** to cache (`index.html`) — dramatically simpler than pre-rendered approach
5. Use `start_url: './'` and `scope: './'` in manifest (relative paths for subfolder deployment)
6. Add a "New version available" toast using the existing Toaster component
7. Runtime caching for external datasheet PDFs (CacheFirst, max 20 entries)
8. Test offline mode: kill network after initial load, verify all routes and Calculator work

**Warning signs:**
- Users report seeing old content after deployment
- Lighthouse PWA audit shows cache issues
- `navigator.serviceWorker.register()` silently fails in some browsers
- Offline mode works on localhost but fails on Apache (scope/path mismatch)

**Phase:** Phase 3 (PWA Implementation) — after routing and assets are stable

---

### Pitfall 6: Apache Subfolder Deployment — Asset Path Breaks

**What goes wrong:**  
Site deploys to `https://example.com/movingcap/` but asset paths are wrong, causing 404s for JS/CSS/images. Service worker scope doesn't match.

**Why it happens (simplified for HashRouter):**  
- Vite defaults to `base: '/'` — all emitted asset paths start with `/`
- CSS/JS resources use absolute URLs in the generated HTML
- Service worker `scope` defaults to its file location

**How to avoid it:**
1. Set `base: './'` in `vite.config.js` — **relative paths work from any folder** without rebuilding
2. Alternatively, use `base: '/movingcap/'` for a fixed subfolder
3. **No `basename` prop needed** on HashRouter — hash fragments are server-agnostic
4. **No `.htaccess` rewrite rules needed** — Apache serves `index.html` for the root, hash routing handles the rest
5. Set PWA manifest `start_url: './'` and `scope: './'` for relative paths
6. All image references from `public/images/` should use relative paths
7. Test: `vite preview` → navigate all routes, check no 404s

**Warning signs:**
- Blank page with console 404s for main.js/main.css
- Images show locally but break in deployed subfolder
- Service worker registers but can't fetch cached assets
- PWA install fails due to scope mismatch

**Phase:** Phase 3 (Build Configuration) — configure early to avoid late-stage path issues

---

### ~~Pitfall 7: Framer Motion + Recharts in SSR/Pre-rendering~~ — ELIMINATED

**Status:** This pitfall no longer applies.

With the SPA approach, there is no SSR/pre-rendering build step. All components render exclusively in the browser where `window`, `document`, `ResizeObserver`, `requestAnimationFrame`, and all browser APIs are available.

**Original concern:** Pre-render build crashes with `ReferenceError: window is not defined` due to Recharts DOM measurements and Framer Motion `window.matchMedia` access.

**Why eliminated:** No server-side or build-time rendering occurs. Recharts SVG charts render in the browser as always. Framer Motion animations work without SSR guards. No need for `LazyMotion`, client-only boundaries, or `isServer` checks.

---

### ~~Pitfall 8: i18n Language Persistence Across Static Pages~~ — GREATLY SIMPLIFIED

**Status:** This pitfall is mostly eliminated. Only minor concern remains.

With SPA + HashRouter, all pages are rendered client-side from the same `index.html`. The `TranslationProvider` reads `localStorage('language')` during React initialization and renders in the correct language immediately. There is no pre-rendered HTML to mismatch.

**Remaining concern:** On very first visit (no localStorage), the app defaults to English. This is expected behavior, not a bug. The user selects their language once, and it persists across all navigation and page refreshes.

**No longer a concern:**
- No FOUC (Flash of Untranslated Content) — React renders once in the correct language
- No per-language pre-rendered HTML directories needed
- No SSR `localStorage` guards needed
- Language selector works instantly across all hash routes

**Still recommended:**
- Add `lang` attribute to `<html>` tag dynamically based on selected language (accessibility)
- Default to browser language detection (`navigator.language`) on first visit if desired

---

### Pitfall 9: Query Parameter to Path-Based Routing Migration

**What goes wrong:**  
Product detail URLs change from `?series=turnTRACK` to `#/product/turntrack`. Any existing bookmarks, saved links, or external references to the old URL format will break.

**Why it happens:**  
- `ProductDetail.jsx` currently reads `series` from `new URLSearchParams(window.location.search)` (line 17)
- The new routing pattern uses `useParams()` with path segments: `#/product/:id`
- Product identifiers change from mixed-case brand names (`turnTRACK`, `FATtrack`) to lowercase slugs (`turntrack`, `fattrack`)

**How to avoid it:**
1. **Convert from query params to path segments**: `#/product/turntrack` instead of `?series=turnTRACK`
2. Add an `id` field to each product: `{ id: 'turntrack', name: 'turnTRACK', ... }`
3. Switch `ProductDetail.jsx` to use `useParams()` with case-insensitive lookup
4. Update all `createPageUrl("ProductDetail") + "?series=X"` calls to `<Link to={`/product/${product.id}`}>`
5. Document the URL change in deployment notes — old links will not auto-redirect
6. Consider adding a compatibility check: if `window.location.search` contains `series=`, redirect to the hash route equivalent

**Warning signs:**
- Pre-rendered product detail page shows "Product not found" — wait, no pre-rendering now
- Product detail shows blank/error after navigation
- Old bookmarks ("?series=turnTRACK") no longer work
- Some product IDs don't match between `products.js` and URL generation

**Phase:** Phase 2 (Routing Conversion) — architectural change, must be done before deployment

---

### Pitfall 10: Vite Plugin and Build Pipeline Breakage

**What goes wrong:**  
Build fails immediately because `vite.config.js` imports `@base44/vite-plugin` which no longer exists. Even after removing it, the build may fail due to missing environment variables, dead import paths, or Vite alias resolution breaking.

**Why it happens:**  
- `vite.config.js` line 1: `import base44 from "@base44/vite-plugin"` — hard crash if package is removed
- The plugin may configure path aliases, proxy settings, or inject environment variables that other code depends on
- `app-params.js` reads `import.meta.env.VITE_BASE44_APP_ID` and `VITE_BASE44_BACKEND_URL` — undefined after removal
- The `legacySDKImports` option in the plugin may set up import aliases that source files depend on

**How to avoid it:**
1. Remove `@base44/vite-plugin` from `vite.config.js` first — just delete the import and `base44()` from plugins array
2. Keep `@vitejs/plugin-react` as the only plugin initially
3. Ensure path alias `@/` still resolves (this may be configured by the base44 plugin — add explicit `resolve.alias` if needed):
   ```js
   resolve: { alias: { '@': path.resolve(__dirname, './src') } }
   ```
4. Remove `app-params.js` or replace it with static config
5. Remove `VITE_BASE44_*` env vars from any `.env` files
6. Test: `npm run build` must succeed cleanly before any other migration step

**Warning signs:**
- `vite build` crashes on first line of config
- `@/components/...` imports fail to resolve after plugin removal
- Environment variables are `undefined` at runtime
- Build succeeds but app shows blank screen (missing provider/context)

**Phase:** Phase 1 (Platform Decoupling) — literally the first thing to fix

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|------------------|----------------|-----------------|
| Keep `AuthProvider` as empty wrapper instead of removing | Zero refactoring of component tree | Dead code, confusing to future devs, bundle size | Never — remove completely (SPA has no hydration risk) |
| ~~Use `HashRouter` instead of proper static routing~~ | ~~Works in subfolder without `.htaccess`~~ | ~~Ugly URLs, no SEO~~ | **Chosen approach** — hash routing is the project decision, not a shortcut. SEO confirmed not needed. |
| Leave external image URLs and rely on CDN availability | No download/rename work needed | Site breaks when Supabase bucket is deleted or changes policy | Never acceptable — this is a core requirement |
| Keep `react-query` for no actual queries | No refactoring of QueryClientProvider wrapper | 50KB+ of unused dependency in bundle | Acceptable short-term, remove in Phase 1 |
| Inline all translations instead of using context | No provider nesting needed | Harder to add languages, violates DRY | Never — current i18n system is already clean |
| Ship pure SPA without PWA | Simpler Phase 1 delivery | No offline support, no install prompt | Acceptable as Phase 1-2 milestone, add PWA in Phase 3 |
| Leave unused shadcn/ui components in bundle | No audit needed | Tree-shaking handles most of it; ~5KB waste | Acceptable — Vite tree-shaking is effective |
| Use `html2canvas` import at top level | Simpler code structure | Adds 200KB+ to initial bundle for rarely-used feature | Never — always dynamic import |
| Skip service worker, rely on browser cache | No SW complexity | No offline support, no install prompt, no update control | Only for Phase 1-2 development, not final |

---

## Migration Checklist

### Pre-Migration Verification
- [ ] All external image URLs catalogued (grep for `supabase.co`, `fullmo.de`)
- [ ] Count of all `@base44` imports across codebase (currently: 6+ files)
- [ ] Identify all `?series=` query-param-dependent routes
- [ ] Document target deployment URL and subfolder path

### Phase 1: Platform Decoupling
- [ ] Remove `@base44/vite-plugin` from `vite.config.js`
- [ ] Add explicit `@` path alias to `vite.config.js`
- [ ] Remove `src/api/base44Client.js`, `entities.js`, `integrations.js`
- [ ] Remove `src/lib/app-params.js`
- [ ] Remove `src/lib/VisualEditAgent.jsx` (648 lines)
- [ ] Remove `src/lib/AuthContext.jsx` entirely
- [ ] Remove `src/lib/NavigationTracker.jsx` entirely
- [ ] Replace `src/lib/PageNotFound.jsx` with simple static NotFound
- [ ] Remove `@base44/sdk` and `@base44/vite-plugin` from `package.json`
- [ ] Remove `@tanstack/react-query` and `query-client.js`
- [ ] Remove `UserNotRegisteredError.jsx` component
- [ ] Simplify `App.jsx` — HashRouter → TranslationProvider → Layout → Routes
- [ ] Remove dead dependencies (three, react-leaflet, react-quill, moment, lodash, etc.)
- [ ] Delete dead pages: `Home.jsx`, `TranslationExport.jsx`
- [ ] `npm run build` succeeds with zero `@base44` references
- [ ] App loads and navigates correctly in dev mode

### Phase 2: Routing & Assets
- [ ] Download all external images to `public/images/`
- [ ] Create URL → local path mapping
- [ ] Update `products.jsx` with local image paths
- [ ] Update `Landing.jsx` (both showcase AND use-case sections) with local images
- [ ] Grep confirms zero remaining `supabase.co` / `fullmo.de/assets` image URLs
- [ ] Add `id` field to products for URL slugs
- [ ] Convert `ProductDetail` from `?series=` to `useParams()` with `#/product/:id`
- [ ] Replace `createPageUrl()` with direct `<Link>` components
- [ ] Remove `pages.config.js` (platform route config)
- [ ] Rename `*.json.jsx` translation files to `*.js`
- [ ] Update translation import paths
- [ ] Configure `vite.config.js` `base: './'` for relative asset paths

### Phase 3: PWA & Deployment
- [ ] Install `vite-plugin-pwa` and configure manifest + Workbox
- [ ] Create PWA icons (192x192, 512x512)
- [ ] Precache all assets via `globPatterns`
- [ ] Runtime cache for external datasheet PDFs
- [ ] Test offline navigation across all page types
- [ ] Verify Calculator works offline (all JS cached)
- [ ] Add `lang` attribute to `<html>` based on selected language
- [ ] Test subfolder deployment (verify asset paths, hash routing)
- [ ] Optional: `.htaccess` with cache headers for static assets
- [ ] Lighthouse PWA audit score ≥ 90

### Post-Migration Validation
- [ ] All 7 product pages load with local images
- [ ] All 4 languages switch correctly
- [ ] Calculator computes and displays charts
- [ ] Datasheet download links still work (external `movingcap.de`)
- [ ] Cookie consent banner functions (text updated, no Base44 reference)
- [ ] Mobile navigation works
- [ ] 404 page shows for unknown hash routes
- [ ] Site works offline after initial load
- [ ] Hash routing works: direct URL access, refresh, back/forward
- [ ] Subfolder deployment: all assets load, hash routes work
- [ ] Final grep: zero references to `base44`, `supabase.co` in build output
- [ ] Lighthouse Performance ≥ 80, Accessibility ≥ 90

---
*Pitfalls research: 2026-03-12*
*Updated: 2026-03-12 — Simplified from pre-rendered HTML to SPA + HashRouter*
