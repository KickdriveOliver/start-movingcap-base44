# Feature Research

**Domain:** Static Product Catalog with Technical Calculator  
**Researched:** 2026-03-12  
**Updated:** 2026-03-12 — Simplified to SPA + HashRouter (dropped pre-rendered HTML)
**Confidence:** High — analysis based on full codebase audit of `src/` (pages, components, data, routing), dependency inventory (`package.json`), and user specs (`specs_convert_to_static_site.md`).

---

## Feature Landscape

### Table Stakes

Features that any industrial product catalog website must have. Users will notice their *absence* but not their *presence*.

| Feature | Why Expected | Complexity | Migration Notes |
|---|---|---|---|
| **Product catalog listing** | Core purpose of the site — visitors browse 7 servo drive products with names, images, descriptions, features | Low | Already static data in `products.jsx`. Only migration task: localize product images from Supabase URLs to `src/assets/`. |
| **Product detail pages** | Standard for any product catalog — specs tabs, feature lists, datasheet downloads, image gallery | Low | Renders from static data + translation keys. URL migrated from `?series=` query param to `#/product/:id` hash route with `useParams()`. |
| **Product images** | Customers expect to see what they're buying | Medium | **Critical migration task:** 9 images on Supabase CDN + 1 on fullmo.de must be downloaded, deduplicated, and referenced locally. Some products share images. |
| **Responsive / mobile layout** | 50%+ of B2B industrial traffic is mobile (trade shows, factory floors) | Low | Already implemented via `use-mobile.jsx` hook (768px breakpoint) + Tailwind responsive classes. No migration work. |
| **Navigation** | Header with links to Products, Documentation, Calculator; footer with legal links | Low | Already in `Layout.jsx`. Must remove auth-dependent code in `NavigationTracker.jsx`. |
| **Legal pages (Impressum, Datenschutz)** | **Legally required** for German company websites (TMG §5, DSGVO) | Low | Pure static content pages. No migration complexity. |
| **Cookie consent banner** | **Legally required** under GDPR/ePrivacy for EU sites | Low | Already in `CookieConsent.jsx`. Currently references Base44 platform in text — must update copy to remove platform mention. Uses `localStorage` only. |
| **Datasheet downloads** | Engineers expect downloadable PDF datasheets per product | Low | Links point to external `movingcap.de` URLs. These are **not** hosted on Base44 — they survive migration. Verify URLs still resolve. |
| **Multi-language support** | Site targets DE/EN/IT/FR markets; German industrial buyers expect native language | Medium | Translations are already fully static in `src/components/i18n/translations.jsx` (~1123 lines, 4 language objects). Client-side switching via React context + `localStorage`. **Decision made:** client-side-only switching (no pre-rendering). No FOUC concern since everything renders client-side. |

### Differentiators

Features that go beyond basic expectations and create competitive advantage.

| Feature | Value Proposition | Complexity | Migration Notes |
|---|---|---|---|
| **S-curve motion calculator** | Engineers can simulate motion profiles for MovingCap drives before purchase — **unique sales tool** that competitors lack. 1081-line component with product-aware physics (force, mass, stroke limits), real-time S-curve trajectory calculation, interactive parameter adjustment, and recharts visualization. | Low | **Already 100% client-side.** All calculation logic is pure JS math, no server calls. Recharts renders in browser SVG. Works offline by default. Only task: verify `getCalculatorProducts()` returns products with `technical_specs`. Currently 4 of 7 products have specs — calculator filters to those. |
| **Interactive motion profile charts** | Real-time position/velocity/acceleration curves using Recharts — engineers can visually verify motion profiles | Low | Recharts is a React SVG library; renders entirely in browser. Zero migration work for the charts themselves. |
| **Product-constrained calculations** | Calculator auto-clamps parameters to selected product limits (max stroke, max speed, max force) with visual feedback (green/amber/red validation) | Low | Pure client-side state logic. No migration impact. |
| **Trajectory adjustment feedback** | When requested parameters exceed physical limits, calculator explains *why* and *what* was adjusted (velocity limited, jerk increased, trapezoidal profile) | Low | Translation-key-driven UI. Works as-is. |
| **PWA offline capability** | Engineers can access product catalog and calculator offline at trade shows, in factories, or during site visits with no internet | High | **New feature to add.** Requires `vite-plugin-pwa`, service worker, manifest, icon assets. Must precache all routes, JS, CSS, images, and fonts. This is net-new work but enables the #1 user-requested deployment scenario. |
| **Framer Motion page animations** | Smooth page transitions and element animations create premium feel for an industrial site | Low | Framer Motion is client-side only. No migration work. No SSR concerns since everything renders client-side. Animations trigger on mount via `initial`/`animate` as expected. |
| **Documentation hub** | Centralized access to datasheets, CANopen docs, I/O setup guides, getting started guides, troubleshooting | Low | Static page with external links to `movingcap.de` documentation. No server dependencies. |

### Anti-Features

Features that exist in the codebase but should be **removed or replaced** during migration. They add complexity, external dependencies, or security surface with no benefit.

| Feature | Why It Exists | Why Problematic | Alternative |
|---|---|---|---|
| **Base44 Auth system** (`AuthContext.jsx`, `AuthProvider`) | Base44 platform requires auth wrapper for all apps | `requiresAuth: false` — auth was never enforced. Adds 155 lines of dead code, external API calls to `base44.com` on every page load, loading spinner on startup, and `@base44/sdk` dependency (~500KB). Blocks offline use. | **Remove entirely.** Render `<Routes>` directly without `AuthProvider`. |
| **Base44 SDK** (`@base44/sdk`, `@base44/vite-plugin`) | Platform integration toolkit | Runtime dependency on Base44 servers. Imported in `base44Client.js`, `AuthContext.jsx`, `NavigationTracker.jsx`. Vite plugin adds platform-specific build transforms. | **Remove both packages.** Delete `src/api/base44Client.js`, strip SDK imports from all files. |
| **Navigation tracker** (`NavigationTracker.jsx`) | Logs user page navigation to Base44 analytics | Posts `window.parent.postMessage` to Base44 iframe host and calls `base44.appLogs.logUserInApp()`. Useless without platform; leaks navigation data. | **Remove entirely.** Site will be standalone, not in an iframe. |
| **Visual Edit Agent** (`VisualEditAgent.jsx`, 648 lines) | Base44 in-browser visual editing tool for no-code platform | Massive component (648 lines) that enables click-to-edit CSS classes via `postMessage` to parent iframe. Only works inside Base44 editor. Dead code in production. | **Remove entirely.** |
| **`@tanstack/react-query`** (`QueryClientProvider`) | Data fetching + caching for API calls | No API calls remain after removing Base44. All data is static JS. Adds ~40KB to bundle for zero benefit. | **Remove.** No async data fetching needed. |
| **`appParams` / `app-params.js`** | Reads Base44 app ID, server URL, and access token from URL params / localStorage | Only used by Base44 SDK client and auth. Contains platform-specific logic for iframe embedding. | **Remove entirely.** |
| **Home.jsx page** | Unused — `pages.config.js` defines it but `mainPage` is set to `Landing` | Dead code. Separate from `Landing.jsx` which is the actual homepage. | **Remove file.** Verify it's not linked anywhere. |
| **TranslationExport.jsx** | Empty file — registered as page route but contains no code | Dead code. | **Remove file and route.** |
| **UserNotRegisteredError.jsx** | Shows error when Base44 user isn't registered for the app | Only triggered by Base44 auth flow. Never shown to public users. | **Remove entirely.** |
| **`moment.js`** dependency | Date formatting library | 330KB locale-heavy library alongside `date-fns` (which is leaner and already used by `react-day-picker`). Likely unused directly in any page component. | **Remove.** Use `date-fns` if dates are needed. |
| **`three.js`** dependency | 3D rendering library | ~600KB. Not imported by any page or component. Likely a leftover from Base44 template. | **Remove.** |
| **`react-leaflet`** dependency | Map library | Not imported by any page. No maps in the product catalog. | **Remove.** |
| **`react-quill`** dependency | Rich text editor | Not imported by any page. No content editing in a static site. | **Remove.** |
| **`react-markdown`** dependency | Markdown rendering | Not imported by any page. | **Remove.** |
| **`canvas-confetti`** dependency | Confetti animation | Not imported by any page. | **Remove.** |
| **`@hello-pangea/dnd`** dependency | Drag-and-drop | Not imported by any page. No drag-and-drop in the product catalog. | **Remove.** |
| **`react-hot-toast`** dependency | Toast notifications (duplicate) | `sonner` already provides toasts via shadcn/ui `Toaster`. Two toast libraries = confusion. | **Remove.** Keep `sonner` only. |
| **`lodash`** dependency | Utility library | 70KB. Typically only 1-2 functions used. Check if imported; if so, replace with native JS. | **Remove or replace with targeted imports.** |
| **`next-themes`** dependency | Theme switching (dark/light) | Site has no dark mode toggle. No theme switching UI. | **Remove.** |
| **Base44 reference in cookie consent** | Cookie banner text mentions "base44.com" platform and links to Base44 privacy policy | Confusing/incorrect for a self-hosted site. Visitors see a reference to a platform they didn't choose. | **Update copy** to reference MovingCap/Fullmo privacy policy only. |

---

## Feature Dependencies

```
Landing Page
├── products.jsx (static data)
├── translations.jsx (i18n strings)
├── Framer Motion (animations)
├── Layout.jsx (nav, footer, cookie consent)
│   ├── LanguageSelector.jsx
│   ├── CookieConsent.jsx
│   └── useTranslations.jsx → TranslationProvider
└── React Router DOM (navigation links)

Products Page
├── products.jsx (static data)
├── translations.jsx (i18n strings)
├── Client-side search (useState filter on product name/description)
└── Product cards → link to ProductDetail

Product Detail Page
├── products.jsx (static data, lookup by ?series= param)
├── translations.jsx (feature keys, description keys)
├── Tabs component (specs, features, datasheet)
└── External datasheet URLs (movingcap.de — NOT Base44)

Calculator Page
├── products.jsx → getCalculatorProducts() (products with technical_specs)
├── S-curve trajectory engine (pure JS math, ~250 lines)
├── Recharts (LineChart, ResponsiveContainer)
├── translations.jsx (all UI labels)
└── NO external dependencies — fully self-contained

Documentation Page
├── products.jsx (for datasheet listing)
├── translations.jsx
└── External links to movingcap.de docs

Legal Pages (Datenschutz, Impressum)
├── translations.jsx
└── Static content only

PWA Layer (TO ADD)
├── vite-plugin-pwa
├── Service worker (Workbox precaching)
├── manifest.webmanifest
├── App icons (multiple sizes)
└── Precache: index.html (single SPA entry), JS, CSS, images, fonts
```

### Dependency Removal Chain

Removing Base44 affects these files (in order):

```
1. Remove @base44/sdk, @base44/vite-plugin from package.json
2. Delete src/api/base44Client.js
3. Delete src/api/entities.js (if Base44-dependent)
4. Delete src/api/integrations.js (if Base44-dependent)
5. Delete src/lib/app-params.js
6. Rewrite src/lib/AuthContext.jsx → delete entirely
7. Delete src/lib/VisualEditAgent.jsx (648 lines)
8. Delete src/lib/NavigationTracker.jsx
9. Delete src/components/UserNotRegisteredError.jsx
10. Simplify src/App.jsx:
    - Remove AuthProvider wrapper
    - Remove QueryClientProvider (if @tanstack/react-query removed)
    - Remove NavigationTracker
    - Remove VisualEditAgent
    - Render <Router><Routes>...</Routes></Router> directly
11. Update src/components/CookieConsent.jsx (remove Base44 text reference)
```

---

## MVP Definition

### Launch With (v1) — "Parity + Independence"

Everything needed to ship a working static site that matches current functionality *without* Base44 dependencies.

| # | Feature | Rationale |
|---|---|---|
| 1 | **Strip all Base44 code** | Removes external dependencies, enables standalone build. Prerequisite for everything else. |
| 2 | **Localize all images** | Download 10 product images from Supabase/Fullmo CDN to `src/assets/images/`. Update all references in `products.jsx`. |
| 3 | **Product catalog + detail pages** | Table stakes. Already working; only needs image path updates. |
| 4 | **S-curve motion calculator** | Primary differentiator. Already 100% client-side — verify it works after Base44 removal. |
| 5 | **Multi-language support (client-side)** | Already fully static. Keep client-side switching in v1; evaluate pre-rendering per language later. Language stored in `localStorage`. |
| 6 | **Documentation hub** | Static page with external links. No work beyond Base44 cleanup. |
| 7 | **Legal pages + cookie consent** | Legally required. Update cookie consent text to remove Base44 platform references. |
| 8 | **SPA + HashRouter** | Switch from `BrowserRouter` to `HashRouter` for hash-based routing (`#/products`, `#/calculator`). Eliminates need for Apache rewrite rules, pre-render scripts, or per-route HTML files. Single `index.html` serves all routes. |
| 9 | **Responsive layout** | Already working. No migration work. |
| 10 | **Remove dead dependencies** | Remove `three`, `react-leaflet`, `react-quill`, `react-markdown`, `canvas-confetti`, `@hello-pangea/dnd`, `react-hot-toast`, `moment`, `next-themes`, `lodash`, `@tanstack/react-query`. Reduces bundle by ~1.5MB+. |
| 11 | **Build tooling** | Makefile or npm script: `npm run build` produces deployable `dist/` folder. Clear README instructions. |
| 12 | **Remove dead pages** | Delete `Home.jsx`, `TranslationExport.jsx`. Clean up route config. |

### Add After Validation (v1.x) — "Offline + Polish"

Features to add once v1 is deployed and verified working on Apache.

| # | Feature | Rationale |
|---|---|---|
| 1 | **PWA support** | Service worker + manifest for offline capability. Deferred because it requires testing the full precache inventory and offline fallback behavior. High value but non-blocking for initial deployment. |
| 2 | **Meta tags / Open Graph** | Per-page `<title>`, `<meta description>`, OG image tags. Important if site links are shared on LinkedIn or in sales emails. Can be implemented client-side with `document.title` updates per route. |
| 3 | **Asset optimization** | Image compression (WebP conversion), font subsetting, code splitting analysis. Reduces load time for mobile users on trade show WiFi. |
| 4 | **Subfolder deployment config** | Vite `base` option for deployments at `movingcap.com/start/` rather than domain root. Hash routing is subfolder-agnostic; only asset paths need `base` config. |
| 5 | **Calculator PDF export** | `jspdf` and `html2canvas` are in `package.json` but not imported in `Calculator.jsx` yet. Wire up export of motion profile chart + parameters as PDF. High-value for engineers who need to attach calculations to design specifications. |

### Future Consideration (v2+) — "Growth Features"

Features not currently in the codebase but relevant for a mature product catalog.

| # | Feature | Rationale |
|---|---|---|
| 1 | **Client-side full-text search** | Add search across all products, documentation, and translations using a pre-built search index (e.g., Fuse.js, Lunr.js). Current search only filters product names. |
| 2 | **Product comparison** | Side-by-side spec comparison table for 2-3 products. Common pattern in industrial catalogs. |
| 3 | **Calculator parameter sharing** | URL-encoded calculator state (e.g., `?product=flattrack&distance=500&speed=1000`) so engineers can share specific calculations via link. |
| 4 | **Dark mode** | Some engineers prefer dark UI. Could leverage `next-themes` (already a dependency, currently unused) — but only if user demand warrants it. |
| 5 | **Analytics (privacy-respecting)** | Plausible or Umami self-hosted analytics to understand which products get the most views. No user tracking, cookie-free. |
| 6 | **Automated image pipeline** | Script to download latest product images from a defined source and optimize them during build. Reduces manual maintenance as catalog grows. |
| 7 | **3D product viewer** | Interactive 3D model viewer for servo drives (would use `three.js` — currently an unused dependency). High effort, high wow factor for trade shows. |

---

## Migration Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| **Calculator breaks after Base44 removal** | High impact, Low likelihood | Calculator has zero Base44 imports. Verify `getCalculatorProducts()` still returns correct data after removing SDK. |
| **Images fail to load** | High impact, Medium likelihood | Some image URLs may be behind Supabase auth or have expiration. Download all images immediately and verify. |
| **Translation keys missing after cleanup** | Medium impact, Low likelihood | All translations are static in `translations.jsx`. No server dependency. Run a key coverage check across all 4 languages. |
| **Hash routing breaks existing bookmarks** | Low impact, Low likelihood | Users with old `?series=` bookmarks will see wrong page. Document URL changes. Hash-based URLs (`#/product/turntrack`) are simple and work everywhere. |
| **Unused shadcn/ui components bloat bundle** | Low impact, High likelihood | ~50 UI components; many likely unused. Tree-shaking should handle it, but verify with `vite build --report`. Non-blocking. |
| **External datasheet URLs break** | Medium impact, Low likelihood | Datasheets are on `movingcap.de` (own domain). Low risk but should be verified before launch. |

---

*Last updated: 2026-03-12 — updated for SPA + HashRouter (dropped pre-rendered HTML)*
