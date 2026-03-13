# Architecture Research

**Domain:** Static Site with Client-Side Interactivity (React SPA → Self-Contained Static Build)
**Researched:** 2026-03-12
**Updated:** 2026-03-12 — Simplified to SPA + HashRouter (dropped pre-rendered HTML requirement)
**Confidence:** High — all data sources are static JS, no runtime APIs needed for content

---

## Standard Architecture

### System Overview

```
BUILD TIME                                    RUNTIME (Browser)
═══════════════════════════════════════       ═══════════════════════════════════

┌─────────────────────────────────────┐       ┌─────────────────────────────────┐
│         Vite Build Pipeline         │       │        Apache Webserver         │
│                                     │       │   (serves from /subfolder/)     │
│  ┌──────────┐   ┌────────────────┐  │       │                                │
│  │ Vite     │──▸│ React Plugin   │  │       │  /index.html  (SPA entry)      │
│  │ Build    │   │ + PWA Plugin   │  │       │  /assets/                      │
│  └──────────┘   └───────┬────────┘  │       │    *.js (code-split bundles)   │
│                         │           │       │    *.css (purged Tailwind)      │
│  ┌──────────────────────▼────────┐  │       │    images/ (local product imgs) │
│  │  Asset Pipeline               │  │       │  /manifest.webmanifest         │
│  │  • CSS (Tailwind purge)       │  │       │  /sw.js (service worker)       │
│  │  • JS chunks (code-split)     │  │       └──────────┬──────────────────────┘
│  │  • Images (local assets)      │  │                  │
│  │  • manifest.webmanifest       │  │       ┌──────────▼──────────────────────┐
│  │  • sw.js (service worker)     │  │       │     Browser (Client-Side)       │
│  └───────────────────────────────┘  │       │                                │
│                                     │       │  1. index.html loads            │
│  ┌────────────────────────────────┐ │       │  2. JS creates React root      │
│  │  Output: dist/                 │ │       │  3. HashRouter handles routes:  │
│  │  Single index.html + assets   │─┼──────▸│     #/products                  │
│  │  (deployable to any server)   │ │       │     #/product/turntrack         │
│  └────────────────────────────────┘ │       │     #/calculator               │
│                                     │       │  4. All features work:          │
└─────────────────────────────────────┘       │     • Calculator (state/forms) │
                                              │     • Language switcher        │
                                              │     • Product search/filter    │
                                              │     • Mobile menu toggle       │
                                              │  5. Service worker caches all  │
                                              │     assets for offline use     │
                                              └────────────────────────────────┘
```

### Why SPA + HashRouter (Not Pre-Rendered HTML)

The decision to drop pre-rendered static HTML eliminates ~40% of migration complexity:

| Concern | Pre-Rendered HTML | SPA + HashRouter |
|---------|------------------|------------------|
| **SSR/pre-render pipeline** | Custom Node script, dual entry points, StaticRouter | Not needed — standard `vite build` |
| **Hydration** | `hydrateRoot()`, mismatch debugging, FOUC | Not needed — `createRoot()` only |
| **window/document guards** | Every component must be SSR-safe | Not needed — browser-only |
| **Framer Motion SSR** | LazyMotion, SSR config, animation guards | Works as-is — no changes |
| **Recharts SSR** | Client-only boundaries, placeholder divs | Works as-is — no changes |
| **localStorage in render** | Must guard with `typeof window` checks | Works as-is — browser-only |
| **Apache config** | `.htaccess` rewrite rules, directory-based routing | Zero config — hash URLs work everywhere |
| **Subfolder deployment** | Complex `base` + `basename` + rewrite rules | Vite `base` config only |
| **Opens from local folder** | Requires local HTTP server | `index.html` opens directly in browser |
| **Build output** | 13+ HTML files, prerender script, server build | Single `index.html` + assets |
| **SEO** | Pre-rendered content indexable | No SEO — acceptable per requirements |

### Component Tree (After Base44 Removal)

```
<div id="root">                           ← Single SPA entry point
  <HashRouter>                            ← Hash-based routing (#/products, #/calculator)
    <TranslationProvider>                 ← i18n context (reads localStorage client-side)
      <Layout>                            ← Header/Nav/Footer (shared shell)
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <CookieConsent />                   ← Client-side only (localStorage check)
      <Toaster />                         ← Toast notifications
    </TranslationProvider>
  </HashRouter>
</div>
```

### Component Responsibilities

| Component | Type | Responsibility | Notes |
|-----------|------|---------------|-------|
| **main.jsx** | Entry | `createRoot()` → render App | Single entry point (dev + production) |
| **App.jsx** | Root | HashRouter → TranslationProvider → Layout → Routes | Simplified: no AuthProvider, no QueryClient |
| **TranslationProvider** | Context | Language state, `localStorage` persistence | Reads/writes `localStorage('language')` |
| **Layout** | Shared shell | Header, nav, footer, cookie consent | Mobile menu toggle, lang selector |
| **LanguageSelector** | Interactive | Dropdown to switch language | Triggers re-render of all translated text |
| **CookieConsent** | Interactive | GDPR banner on first visit | `localStorage` driven |
| **Landing** | Page | Marketing content, product highlights | Framer Motion animations, links to products |
| **Products** | Page | Product catalog grid with search | Client-side search/filter on static data |
| **ProductDetail** | Page | Single product specs, features, datasheet | Receives product ID via `useParams()` |
| **Calculator** | Page | S-curve motion profile calculator | Full client-side: forms, math, Recharts charts |
| **Documentation** | Page | Technical docs hub | Links to external datasheets on movingcap.de |
| **Impressum** | Page | Legal imprint | Static text |
| **Datenschutz** | Page | Privacy policy | Static text |
| **Service Worker** | PWA | Offline caching | Workbox precaches all assets |

---

## Recommended Project Structure

```
movingcap-static/
├── index.html                          ← Vite SPA entry (single HTML file)
├── vite.config.js                      ← Vite + React + PWA plugin config
├── package.json
├── Makefile                            ← Build instructions
├── tailwind.config.js
├── postcss.config.js
│
├── public/
│   ├── icons/                          ← PWA icons (192x192, 512x512)
│   └── images/                         ← Downloaded product images (local)
│       ├── turntrack.jpg
│       ├── maxtrack.jpg
│       ├── flattrack.jpg
│       ├── fattrack.jpg
│       ├── shorttrack.jpg
│       ├── pushtrack.jpg
│       └── sidetrack.jpg
│
├── src/
│   ├── main.jsx                        ← Entry: createRoot() — single entry point
│   ├── App.jsx                         ← Simplified (no Auth, no QueryClient)
│   ├── Layout.jsx                      ← Shared header/footer/nav
│   │
│   ├── components/
│   │   ├── CookieConsent.jsx
│   │   ├── LanguageSelector.jsx
│   │   ├── useTranslations.jsx         ← TranslationProvider + hook
│   │   ├── data/
│   │   │   └── products.js             ← Static product data (images → local paths)
│   │   ├── i18n/
│   │   │   ├── en.js                   ← Renamed from .json.jsx
│   │   │   ├── de.js
│   │   │   ├── it.js
│   │   │   ├── fr.js
│   │   │   └── translations.js         ← Re-exports all languages
│   │   └── ui/                         ← shadcn/ui components (unchanged)
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       └── ...
│   │
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx           ← Receives product via useParams() route param
│   │   ├── Calculator.jsx
│   │   ├── Documentation.jsx
│   │   ├── Impressum.jsx
│   │   ├── Datenschutz.jsx
│   │   └── NotFound.jsx                ← Simple static 404 page
│   │
│   ├── lib/
│   │   └── utils.js                    ← cn() helper, shared utilities
│   │
│   ├── hooks/
│   │   └── use-mobile.jsx              ← Viewport mobile detection
│   │
│   └── utils/
│       └── index.ts                    ← createPageUrl() adapted for hash routing
│
├── scripts/
│   └── download-images.js              ← One-time: download external images to public/
│
└── dist/                               ← Build output (deployable)
    ├── index.html                      ← Single SPA entry
    ├── assets/
    │   ├── *.js                        ← Code-split bundles (content-hashed)
    │   └── *.css                       ← Purged Tailwind CSS
    ├── images/                         ← Copied from public/
    ├── icons/                          ← PWA icons
    ├── manifest.webmanifest            ← PWA manifest
    └── sw.js                           ← Compiled service worker
```

### Key Structural Changes from Current Codebase

| Current | Target | Reason |
|---------|--------|--------|
| `BrowserRouter` (path-based) | `HashRouter` (hash-based) | Works on Apache without .htaccess, works from local folder |
| `pages.config.js` (auto-generated) | Explicit routes in `App.jsx` | Clear route definitions, no platform magic |
| `?series=flatTRACK` query params | `#/product/flattrack` hash route params | Clean product URLs via `useParams()` |
| `AuthContext.jsx` | **REMOVED** | No authentication needed |
| `NavigationTracker.jsx` | **REMOVED** | Base44 platform tracking |
| `VisualEditAgent.jsx` | **REMOVED** | Base44 visual editor |
| `@base44/sdk`, `@base44/vite-plugin` | **REMOVED** | Platform dependencies |
| `@tanstack/react-query` | **REMOVED** | No runtime API calls |
| `api/base44Client.js`, `api/entities.js`, `api/integrations.js` | **REMOVED** | No API layer needed |
| `query-client.js` | **REMOVED** | No React Query |
| `app-params.js` | **REMOVED** | Base44 config |
| `PageNotFound.jsx` (with auth) | `NotFound.jsx` (simple static) | No auth dependency |
| `UserNotRegisteredError.jsx` | **REMOVED** | Base44-specific error |
| External image URLs (supabase, fullmo.de) | Local `public/images/` | Self-contained, offline-capable |
| `*.json.jsx` translation files | `*.js` translation files | Cleaner, non-misleading extension |
| `Home.jsx` (empty) | **REMOVED** | Dead code |
| `TranslationExport.jsx` (empty) | **REMOVED** | Dead code |

**NOT needed (eliminated by SPA approach):**

| File/Concept | Why Not Needed |
|---|---|
| `entry-server.jsx` | No server-side rendering |
| `entry-client.jsx` | No hydration — single `main.jsx` entry |
| `scripts/prerender.js` | No pre-rendering |
| `routes.js` (separate file) | Routes defined directly in `App.jsx` |
| `StaticRouter` | No SSR |
| `hydrateRoot()` | No hydration — using `createRoot()` |
| `.htaccess` rewrite rules | Hash routing handles all navigation |
| Directory-based HTML output | Single `index.html` serves all routes |
| SSR-safe guards (`typeof window`) | Everything runs in browser only |
| FOUC mitigation scripts | No pre-rendered content to flash |

---

## Architectural Patterns

### Pattern 1: Single Entry Point SPA

The simplest possible React app architecture — one entry, one HTML file, client-side routing.

```jsx
// main.jsx — Single entry point for both dev and production
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(<App />);
```

```jsx
// App.jsx — Simplified root (no Auth, no QueryClient, no platform wrappers)
import { HashRouter, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from '@/components/useTranslations';
import Layout from './Layout';
import Landing from '@/pages/Landing';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Calculator from '@/pages/Calculator';
import Documentation from '@/pages/Documentation';
import Impressum from '@/pages/Impressum';
import Datenschutz from '@/pages/Datenschutz';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  return (
    <HashRouter>
      <TranslationProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster />
      </TranslationProvider>
    </HashRouter>
  );
}
```

**Why this pattern:**
- `createRoot()` — standard React 18 rendering, no hydration complexity
- `HashRouter` — URLs like `#/products` work on any server (Apache, Nginx, file://) without configuration
- No `BrowserRouter` basename needed — hash fragment is server-agnostic
- No pre-rendering concerns — everything is client-side
- Clean, readable route table directly in the root component

### Pattern 2: Path-Based Product Routing with `useParams()`

Convert from `?series=turnTRACK` query params to hash path segments: `#/product/turntrack`.

```jsx
// In App.jsx routes:
<Route path="/product/:id" element={<ProductDetail />} />

// In ProductDetail.jsx:
import { useParams } from 'react-router-dom';
import { getProductById } from '@/components/data/products';

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id);  // Lookup by lowercase slug

  if (!product) return <NotFound />;
  // ... render product detail
}
```

```jsx
// In products.js — add slug/id field for routing:
export const products = [
  { id: 'turntrack', name: 'turnTRACK', /* ... */ },
  { id: 'maxtrack',  name: 'maxTRACK',  /* ... */ },
  // ...
];

export function getProductById(id) {
  return products.find(p => p.id === id.toLowerCase());
}
```

**Why this pattern:**
- `useParams()` is the idiomatic React Router way to read route parameters
- Works naturally with `HashRouter` — URL becomes `#/product/turntrack`
- No `window.location.search` parsing needed
- Each product has a clean, shareable, bookmarkable URL
- Products page links: `<Link to={`/product/${product.id}`}>` — clean navigation

### Pattern 3: Client-Side i18n with localStorage Persistence

Language switching is entirely client-side. No pre-rendering concern.

```
┌────────────────────────────────────────────────────┐
│ User visits site                                    │
│                                                     │
│ 1. React mounts, TranslationProvider initializes    │
│ 2. Read localStorage('language') → 'de' or default  │
│ 3. Render entire UI in selected language             │
│ 4. User changes language → setState → re-render      │
│ 5. Save preference to localStorage                   │
│                                                     │
│ No FOUC — everything renders once, in correct lang  │
│ No SSR mismatch — everything is client-side         │
└────────────────────────────────────────────────────┘
```

**Why this pattern:**
- No pre-rendering means no hydration mismatch between server/client language
- `localStorage` read happens during React initialization — user sees correct language immediately
- All 4 language bundles (~50KB total) are included in the JS bundle
- Zero complexity overhead compared to per-language HTML generation

---

## Data Flow

### Build Pipeline

```
                    ┌──────────────┐     ┌──────────────┐
                    │ Vite build   │────▸│ dist/         │
                    │ (standard)   │     │ index.html    │
                    │              │     │ assets/*.js   │
                    │ + PWA plugin │     │ assets/*.css  │
                    │              │     │ images/       │
                    └──────────────┘     │ sw.js         │
                                         │ manifest.*    │
                                         └──────────────┘
```

**Data sources consumed at build time:**

| Source | File | Consumed By | Output |
|--------|------|-------------|--------|
| Product catalog | `products.js` (7 items) | Vite bundler (in JS) | Product data in JS bundle |
| Translations | `i18n/*.js` (4 langs) | Vite bundler (in JS) | All translations in JS bundle |
| Images | `public/images/*.jpg` | Vite copy | `dist/images/` (served statically) |
| PWA manifest | `vite-plugin-pwa` config | Vite PWA plugin | `dist/manifest.webmanifest` |
| Service worker | Workbox config | Vite PWA plugin | `dist/sw.js` |

### Runtime Flow

```
User visits site (any URL with hash)
         │
         ▼
┌─────────────────────────────────────────┐
│  1. Apache serves index.html            │
│     (same file regardless of hash)      │
│     → CSS loaded (Tailwind, purged)     │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  2. JS bundle loads and executes        │
│     → createRoot() mounts React         │
│     → HashRouter reads window.location  │
│       .hash (#/products, #/calculator)  │
│     → TranslationProvider reads         │
│       localStorage('language')          │
│     → Correct page renders immediately  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  3. Service Worker activates            │
│     → Precaches index.html, JS, CSS,    │
│       images, manifest                  │
│     → Subsequent visits: cache-first    │
│     → Fully offline-capable             │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  4. User interactions (client-side)     │
│     • Navigate: HashRouter swaps page   │
│     • Search: local filter on products  │
│     • Calculator: local computation     │
│     • Lang switch: setState → re-render │
│     • Menu toggle: useState             │
│     • All work offline after first load │
└─────────────────────────────────────────┘
```

**Page classifications by interactivity level:**

| Level | Pages | Notes |
|-------|-------|-------|
| **Static** (text only) | Impressum, Datenschutz, Documentation | Nav, lang switcher, cookie consent are interactive |
| **Static + Animations** | Landing, Products, ProductDetail | Framer Motion animations, search filter, tabs |
| **Fully Interactive** | Calculator | Form state, S-curve math, Recharts visualization |

### Navigation Strategy

With `HashRouter`, all navigation is client-side:

- **Direct URL access** (bookmark, share, refresh) → Apache serves `index.html`, React reads hash
- **In-app navigation** (clicking links) → HashRouter swaps components
- **Offline navigation** → Service worker serves cached `index.html`, React handles hash

This means:
- **No `.htaccess` needed** — every request goes to `index.html`
- **No directory-based routing** — single file handles all routes
- **Works from file://** — opening `index.html` directly works (except service worker)
- **Subfolder deployment** — only requires Vite `base` config for asset paths

**Subfolder configuration:**

```javascript
// vite.config.js — only config needed for subfolder
export default defineConfig({
  base: process.env.VITE_BASE_URL || './',  // './' = relative paths, works from any folder
  // ...
});
```

Using `base: './'` (relative paths) means the build output works from **any** subfolder without rebuilding. This is the simplest approach for Apache deployment.

---

## Service Worker / PWA Integration

### Strategy: Precache All Assets

```
┌─────────────────────────────────────────────────────────┐
│                   Service Worker                         │
│                                                          │
│  ┌────────────────────────┐  ┌────────────────────────┐ │
│  │    PRECACHE (install)  │  │  RUNTIME CACHE         │ │
│  │                        │  │                        │ │
│  │  • index.html          │  │  • External datasheet  │ │
│  │  • JS bundles          │  │    PDFs (if visited)   │ │
│  │  • CSS                 │  │                        │ │
│  │  • Product images      │  │  Strategy:             │ │
│  │  • manifest.webmanifest│  │  CacheFirst for PDFs   │ │
│  │  • PWA icons           │  │                        │ │
│  │                        │  │                        │ │
│  │  Total: ~2-5 MB        │  │                        │ │
│  └────────────────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Implementation: Workbox via `vite-plugin-pwa`

```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{html,js,css,jpg,png,webp,woff2,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/movingcap\.de\/.*\.pdf$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'datasheets',
              expiration: { maxEntries: 20, maxAgeSeconds: 30 * 24 * 60 * 60 }
            }
          }
        ]
      },
      manifest: {
        name: 'MovingCap Product Catalog',
        short_name: 'MovingCap',
        description: 'Servo drive product catalog and motion calculator',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
});
```

**Key PWA considerations for SPA + hash routing:**
- `start_url: './'` and `scope: './'` — relative paths work from any subfolder
- Only one HTML file (`index.html`) to precache — simpler than 13 separate files
- All hash routes are served by the same cached `index.html`
- Service worker scope covers all assets regardless of hash fragment
- Smaller precache manifest than pre-rendered approach

### Offline Capability Matrix

| Feature | Online | Offline |
|---------|--------|---------|
| All pages (via hash routing) | ✅ | ✅ (index.html + JS cached) |
| Language switching | ✅ | ✅ (translations in JS bundle) |
| Product search/filter | ✅ | ✅ (data in JS bundle) |
| Calculator | ✅ | ✅ (pure client-side math) |
| Product images | ✅ | ✅ (precached local images) |
| Datasheet PDFs (external) | ✅ Download | ⚠️ Only if previously visited |
| Framer-motion animations | ✅ | ✅ |
| Opens from file:// | ✅ | ✅ (no SW, but all assets are local) |

---

## Build Configuration

### Build Scripts (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:subfolder": "cross-env VITE_BASE_URL=/movingcap/ vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "download-images": "node scripts/download-images.js"
  }
}
```

**Build is just `vite build`** — no multi-step pipeline, no prerender script, no server build. The PWA plugin runs as part of the standard Vite build.

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  base: process.env.VITE_BASE_URL || './',
  plugins: [
    react(),
    VitePWA({ /* ... manifest + workbox config */ })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### Build Output

```
dist/
├── index.html              ← Single SPA entry (serves all routes)
├── assets/
│   ├── index-[hash].js     ← Main bundle
│   ├── vendor-[hash].js    ← Vendor chunk (React, Radix, etc.)
│   └── index-[hash].css    ← Purged Tailwind CSS
├── images/                 ← Product images (from public/)
│   ├── turntrack.jpg
│   ├── maxtrack.jpg
│   └── ...
├── icons/                  ← PWA icons (from public/)
├── manifest.webmanifest    ← PWA manifest (generated by plugin)
└── sw.js                   ← Service worker (generated by Workbox)
```

---

## Build Order

The migration steps with dependencies:

```
Step 1 ─── Remove Base44 dependencies
            • Remove @base44/vite-plugin from vite.config.js
            • Add explicit @ path alias to vite.config.js
            • Delete: src/api/ directory
            • Delete: AuthContext, NavigationTracker, VisualEditAgent, app-params
            • Simplify: App.jsx (remove Auth wrappers, QueryClient)
            • Remove: @base44/sdk, @base44/vite-plugin, @tanstack/react-query
            • Verify: npm run build succeeds
            Dependencies: none — this is the first step
                │
Step 2 ─── Remove unused deps and dead code
            • Remove: three, react-leaflet, react-quill, moment, lodash, etc.
            • Delete: Home.jsx, TranslationExport.jsx
            • Clean up route config
            • Verify: npm run build still succeeds
            Dependencies: Step 1
                │
Step 3 ─── Download and localize images
            • Download all external images to public/images/
            • Update products.jsx with local paths
            • Update Landing.jsx image references (both data structures)
            • Grep verify: zero supabase.co or fullmo.de image URLs
            Dependencies: none (can parallel with Steps 1-2)
                │
Step 4 ─── Convert to HashRouter + path-based products
            • Switch BrowserRouter → HashRouter in App.jsx
            • Add product slug/id field to products.js
            • Convert ProductDetail from ?series= to useParams()
            • Update createPageUrl() for hash routing
            • Update all internal <Link> and navigation
            Dependencies: Steps 1-2 (need simplified App.jsx)
                │
Step 5 ─── Clean up i18n files
            • Rename .json.jsx → .js
            • Update import paths
            Dependencies: none (can parallel with Step 4)
                │
Step 6 ─── Configure Vite for deployment + PWA
            • Set base: './' for relative asset paths
            • Add vite-plugin-pwa with manifest + Workbox config
            • Create PWA icons
            • Verify: npm run build produces correct dist/
            Dependencies: Steps 1-5
                │
Step 7 ─── Create build instructions
            • Write Makefile
            • Update README with deployment docs
            • Test: build → deploy to Apache subfolder
            • Test: offline mode
            • Test: open from local folder
            Dependencies: Step 6
```

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Base44 removal cascade (AuthProvider wraps everything) | Build fails, white screen | Remove incrementally: vite-plugin first, then AuthContext, then dependencies |
| Missed external image URLs | Broken images in production | Exhaustive grep for supabase.co and fullmo.de; verify after replacement |
| Hash routing breaks existing bookmarks/links | Users get 404 or wrong page | Document URL change; redirect old URLs if possible |
| Large JS bundle (all UI components + translations) | Slow initial load on mobile | Code-split per route with `React.lazy()`; lazy-load Calculator (heaviest) |
| External datasheet PDFs unavailable offline | Broken download links | Show "available when online" badge |
| Subfolder asset path issues | 404s for JS/CSS/images | Use `base: './'` for relative paths — works from any folder |
| Service worker caches stale content | Users see old version | `vite-plugin-pwa` `registerType: 'autoUpdate'` handles updates automatically |

### Apache Deployment

With hash routing, Apache config is minimal — no rewrite rules needed:

```apache
# Optional: cache static assets aggressively
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 1 hour"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
</IfModule>
```

No `mod_rewrite`, no `FallbackResource`, no `.htaccess` routing rules. Apache serves `index.html` for the root URL. All page navigation happens via hash fragments, which the browser handles client-side without server involvement.

---

## Summary of Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Routing approach** | SPA + `HashRouter` | Zero server config, works from file://, subfolder-safe, eliminates SSR complexity |
| **Pre-rendering** | **None** (dropped) | SEO not needed; SPA approach eliminates ~40% of migration complexity |
| **Build approach** | Standard `vite build` | No custom prerender scripts, no dual entry points, no server build step |
| **Entry point** | Single `main.jsx` with `createRoot()` | No hydration needed — simpler than dual entry approach |
| **i18n strategy** | Client-side switching only | All translations bundled in JS; localStorage persists preference; no FOUC concern |
| **ProductDetail URLs** | `#/product/{id}` hash path segments | Each product has a shareable URL; `useParams()` for clean access |
| **PWA tooling** | Workbox via `vite-plugin-pwa` | Battle-tested, auto-generates precache manifest from build output |
| **Images** | Downloaded to `public/images/` | Self-contained, offline-capable, no external dependency at runtime |
| **Base44 removal** | Complete removal (Auth, tracking, SDK, API) | No runtime dependencies; all content is static |
| **Subfolder deployment** | `base: './'` (relative paths) | Works from any folder without rebuilding |
| **Apache config** | Minimal (cache headers only) | No rewrite rules needed with hash routing |

---
*Architecture research: 2026-03-12*
*Updated: 2026-03-12 — Simplified from pre-rendered HTML to SPA + HashRouter*
