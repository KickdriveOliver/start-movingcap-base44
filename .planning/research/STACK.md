# Stack Research

**Domain:** React SPA to Static Site Migration  
**Researched:** 2026-03-12  
**Updated:** 2026-03-12 — Simplified to SPA + HashRouter (dropped pre-rendered HTML)
**Confidence:** High — all recommendations are based on audited current dependencies, proven Vite ecosystem tooling, and PWA web standards.

---

## Current State Summary

The existing app is a React 18 SPA hosted on the Base44 platform. It uses Vite 6.1, Tailwind 3.4, shadcn/ui (new-york style, JSX, not TSX), Radix UI primitives, Framer Motion, Recharts, and lucide-react icons. Routing is via React Router DOM 6.26 with flat `/:PageName` routes derived from `pages.config.js`. All product data is already static JS in `src/components/data/products.jsx`. Images are currently served from Supabase CDN (`qtrypzzcjebvfcihiynt.supabase.co`) and must be localized to `public/images/`.

**Routes (8 total, all client-side via HashRouter):**
`#/`, `#/products`, `#/product/:id`, `#/calculator`, `#/documentation`, `#/datenschutz`, `#/impressum`, `#/404`

---

## What to KEEP

| Technology | Version | Purpose | Why Keep |
|---|---|---|---|
| React | ^18.2.0 | UI framework | Core of entire component tree; stable, no reason to migrate |
| React DOM | ^18.2.0 | DOM rendering | Required for React; `createRoot()` for SPA rendering |
| React Router DOM | ^6.26.0 | Client-side routing | Already in use; switch from `BrowserRouter` to `HashRouter` for server-agnostic routing |
| Vite | ^6.1.0 | Build tool + dev server | Fast, already configured; standard `vite build` produces deployable output |
| @vitejs/plugin-react | ^4.3.4 | React JSX transform | Required for Vite + React |
| Tailwind CSS | ^3.4.17 | Utility CSS | Foundation of all styling; fully static, zero runtime |
| tailwindcss-animate | ^1.0.7 | CSS animations | Used by shadcn/ui components |
| tailwind-merge | ^3.0.2 | Class merging | Used by `cn()` utility in `lib/utils.js` |
| class-variance-authority | ^0.7.1 | Variant styling | Used by shadcn/ui button and other components |
| clsx | ^2.1.1 | Conditional classes | Used by `cn()` utility |
| PostCSS | ^8.5.3 | CSS processing | Required by Tailwind |
| Autoprefixer | ^10.4.20 | CSS vendor prefixes | Required for browser compatibility |
| All @radix-ui/* packages | (current) | Headless UI primitives | Core of shadcn/ui; all used via `src/components/ui/` |
| Framer Motion | ^11.16.4 | Page animations | Used in every page component (Landing, Products, Calculator, etc.) |
| Recharts | ^2.15.4 | Chart rendering | Used in Calculator page for motion analysis charts |
| lucide-react | ^0.475.0 | Icon library | Used across all pages and Layout |
| embla-carousel-react | ^8.5.2 | Carousel | Used by shadcn/ui carousel component |
| sonner | ^2.0.1 | Toast notifications | Used via shadcn/ui Toaster component |
| cmdk | ^1.0.0 | Command palette | Used by shadcn/ui command component |
| vaul | ^1.1.2 | Drawer | Used by shadcn/ui drawer component |
| react-resizable-panels | ^2.1.7 | Resizable panels | Used by shadcn/ui resizable component |
| input-otp | ^1.4.2 | OTP input | Used by shadcn/ui input-otp component |
| react-day-picker | ^8.10.1 | Date picker | Used by shadcn/ui calendar component |
| date-fns | ^3.6.0 | Date formatting | Peer dep of react-day-picker |
| zod | ^3.24.2 | Schema validation | Used by shadcn/ui form component |
| react-hook-form | ^7.54.2 | Form management | Used by shadcn/ui form component |
| @hookform/resolvers | ^4.1.2 | Form validators | Zod resolver for react-hook-form |
| ESLint + plugins | (current) | Code linting | Dev tooling, keep as-is |
| TypeScript | ^5.8.2 | Type checking | Dev dependency for jsconfig/typecheck |

## What to ADD

### PWA Tooling

| Technology | Version | Purpose | Why Recommended |
|---|---|---|---|
| vite-plugin-pwa | ^0.21.x | PWA integration for Vite | Generates `manifest.webmanifest`, service worker via Workbox, auto-updates, precache manifest. Battle-tested with Vite. |
| workbox-precaching | ^7.3.x | Service worker precaching | (Bundled with vite-plugin-pwa) Precaches all static assets for full offline support |

**vite-plugin-pwa** provides:
- Auto-generated `manifest.webmanifest` from config
- Workbox-powered service worker with `generateSW` strategy
- Precaches all build outputs (HTML, JS, CSS, images) for offline use
- `injectManifest` mode available if custom SW logic is needed later
- Handles SW registration and updates

### Subfolder Deployment

No additional library needed. Vite's `base` config handles this:

```js
// vite.config.js
export default defineConfig({
  base: process.env.VITE_BASE_URL || './',
  // ...
})
```

With `HashRouter`, no `basename` prop is needed — hash fragments are server-agnostic. The Vite `base` config only affects asset paths (JS, CSS, images), not routing.

### Build Tooling

| Tool | Version | Purpose | Why Recommended |
|---|---|---|---|
| cross-env | ^7.0.3 | Cross-platform env vars | Set `VITE_BASE_URL` in npm scripts on Windows + Linux |

> **Note:** `npm-run-all2` is **not needed** — the build is a single `vite build` command, no multi-step pipeline required.

### Supporting Libraries to Add

| Library | Version | Purpose | When to Use |
|---|---|---|---|
| @radix-ui/react-slot | ^1.1.2 | Already present | Keep (used by button component) |

No additional UI/functional libraries needed — the current stack is comprehensive.

---

## What to REMOVE

| Package | Why Remove | Impact | Replacement |
|---|---|---|---|
| `@base44/sdk` | Platform dependency; entire auth + API layer being removed | Remove `src/api/` directory, `AuthContext`, `NavigationTracker`, `VisualEditAgent`, `app-params.js` | Static data in JS files; no auth needed |
| `@base44/vite-plugin` | Platform build plugin | Remove from `vite.config.js` | None needed |
| `@tanstack/react-query` | Only used for Base44 API calls (`PageNotFound.jsx` auth check) | Remove `QueryClientProvider` from `App.jsx`, remove `query-client.js` | Direct static data imports |
| `next-themes` | Only imported in `sonner.jsx` but theme switching not used (site is light-only) | Minor: update sonner component to remove import | Hardcode theme or remove |
| `@hello-pangea/dnd` | Not imported anywhere in `src/` — unused dependency | Safe to remove | None |
| `react-leaflet` | Not imported anywhere in `src/` — unused dependency | Safe to remove | None |
| `three` | Not imported anywhere in `src/` — unused dependency | Safe to remove | None |
| `react-quill` | Not imported anywhere in `src/` — unused dependency | Safe to remove | None |
| `canvas-confetti` | Not imported anywhere in `src/` — unused dependency | Safe to remove | None |
| `react-hot-toast` | Not imported anywhere (sonner is used instead) | Safe to remove | Already using sonner |
| `react-markdown` | Not imported anywhere in `src/` pages | Verify; remove if unused | None |
| `moment` | Not imported anywhere in `src/` (date-fns is used) | Safe to remove | date-fns |
| `lodash` | Not imported anywhere in `src/` | Safe to remove | Native JS methods |
| `jspdf` | Not imported anywhere in `src/` — was likely planned | Safe to remove | Re-add if PDF needed later |
| `html2canvas` | Not imported anywhere in `src/` — was likely planned | Safe to remove | Re-add if PDF needed later |

### Files to Remove

| File/Directory | Reason |
|---|---|
| `src/api/base44Client.js` | Base44 SDK client |
| `src/api/entities.js` | Base44 entity bindings |
| `src/api/integrations.js` | Base44 integration bindings |
| `src/lib/AuthContext.jsx` | Base44 auth provider |
| `src/lib/NavigationTracker.jsx` | Base44 analytics tracker |
| `src/lib/VisualEditAgent.jsx` | Base44 visual editor |
| `src/lib/app-params.js` | Base44 app configuration |
| `src/lib/query-client.js` | React Query client (only used for Base44) |
| `src/lib/PageNotFound.jsx` | Depends on Base44 auth; replace with static 404 |
| `src/components/UserNotRegisteredError.jsx` | Base44-specific error component |

---

## Installation

### Remove unused dependencies

```bash
npm uninstall @base44/sdk @base44/vite-plugin @tanstack/react-query @hello-pangea/dnd react-leaflet three react-quill canvas-confetti react-hot-toast react-markdown moment lodash jspdf html2canvas next-themes
```

### Add new dependencies

```bash
npm install --save-dev vite-plugin-pwa cross-env
```

> **Note:** No new runtime dependencies needed. `vite-plugin-pwa` is dev-only (generates SW at build time). No pre-render script, no `ReactDOMServer`, no `StaticRouter` — just a standard SPA build.

### Updated package.json scripts

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

**Build is just `vite build`** — single command, no multi-step pipeline.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|---|---|---|
| SPA + HashRouter | Pre-rendered HTML (SSG) | If SEO becomes a requirement; would need `ReactDOMServer`, `StaticRouter`, prerender script |
| `HashRouter` | `BrowserRouter` | If clean URLs (no `#`) are required; would need `.htaccess` rewrite rules on Apache |
| vite-plugin-pwa (generateSW) | vite-plugin-pwa (injectManifest) | If custom service worker logic is needed (e.g., background sync, push notifications) |
| vite-plugin-pwa | Manual SW + manifest | If vite-plugin-pwa causes conflicts; write `public/sw.js` and `public/manifest.webmanifest` by hand |
| cross-env | dotenv-cli | If you prefer `.env` files over CLI env vars for base URL |
| `HashRouter` | Static `<a>` links (no SPA nav) | If you want zero JS client-side routing; but loses SPA transitions/animations |
| Keep Framer Motion | CSS-only animations | If bundle size is critical; saves ~30KB gzipped but requires rewriting all page transitions |
| Keep Recharts | Chart.js or static SVG | If Recharts bundle size becomes an issue; but Calculator page heavily uses Recharts API |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|---|---|---|
| Next.js | Full framework migration; overkill for static site, requires SSR runtime, different routing paradigm, would require rewriting entire app | Vite + hash routing SPA |
| Gatsby | Heavy, GraphQL data layer not needed, complex plugin system, slow builds | Vite SPA |
| Astro | Would require rewriting components to `.astro` format or using React islands; different mental model | Keep current Vite + React setup |
| vite-ssg | Primarily designed for Vue; React support is community/unofficial; unnecessary since we dropped pre-rendering | Standard `vite build` |
| react-snap | Unmaintained since 2020, Puppeteer-based (heavy, fragile in CI), version drift | Not needed — no pre-rendering |
| prerender-spa-plugin | Webpack-only, not Vite-compatible | Not needed — no pre-rendering |
| Puppeteer/Playwright for prerendering | Heavy runtime dependency (~400MB), flaky in CI, slow | Not needed — no pre-rendering |
| ReactDOMServer | No SSR/pre-rendering; adds complexity for zero benefit | `createRoot()` only |
| StaticRouter | No server-side rendering; `HashRouter` handles all routing client-side | `HashRouter` |
| Express/Fastify server | No server needed; fully static deployment | Apache serves static files |
| Any database (SQLite, PouchDB) | All data is static JS; adding a DB adds complexity for zero benefit | JS modules in `src/components/data/` |
| Firebase/Supabase | Moving away from cloud dependencies; site must work offline | Local assets + service worker |
| Webpack | Vite is already configured and working; Webpack migration would be regressive | Keep Vite |

---

## Version Compatibility

### Core Compatibility Matrix

| Package | Required By | Constraint |
|---|---|---|
| React 18.2 | react-dom, react-router-dom, all Radix UI, Framer Motion, Recharts | All current deps are React 18 compatible. Do NOT upgrade to React 19 during migration — breaking changes with Radix UI and Framer Motion. |
| React Router DOM 6.26 | App routing | Using `HashRouter` for server-agnostic hash-based routing. v6.4+ `createHashRouter` is also available but `<HashRouter>` component approach is simpler and consistent with current codebase style. |
| Vite 6.1 | Build system | Compatible with vite-plugin-pwa 0.21.x. Node 18+ required. |
| vite-plugin-pwa 0.21.x | Workbox 7.x | Requires Vite 5+ (satisfied). Generates SW compatible with all modern browsers. |
| Tailwind 3.4 | PostCSS, autoprefixer | Do NOT upgrade to Tailwind 4.x during migration — different config format, potential breaking changes with shadcn/ui. |
| Node.js | Build tooling | Minimum Node 18. Recommend Node 20 LTS. |

### Browser Compatibility

| Feature | Minimum Browser | Note |
|---|---|---|
| Service Worker (PWA) | Chrome 45, Firefox 44, Safari 11.1, Edge 17 | All modern browsers supported |
| CSS `backdrop-blur` | Chrome 76, Firefox 103, Safari 9 | Used in Layout header |
| ES Modules | Chrome 61, Firefox 60, Safari 11 | Vite output format |
| Hash-based routing | All browsers | Hash fragment (#) is universally supported |

### Deployment Compatibility

| Platform | Requirements |
|---|---|
| Apache 2.4+ | Serve static files from document root or subfolder. **No `.htaccess` rewrite rules needed** — hash routing is handled client-side. Optional: cache headers for static assets. |
| Subfolder deployment | `VITE_BASE_URL=/subfolder/` at build time for asset paths. Hash routing works regardless of subfolder. |
| Offline / file:// | Service worker won't work from `file://`; but SPA + local assets will render and navigate (all JS/CSS/images are local). For true PWA offline, serve via HTTPS or install as PWA from HTTPS origin. |

---

## Architecture Decisions

### Routing Strategy: HashRouter

All routing is client-side via `HashRouter`. URLs look like `https://example.com/subfolder/#/products`.

```
dist/
  index.html              → Single SPA entry (all routes)
  assets/                 → JS, CSS bundles (content-hashed)
  images/                 → Product images (local)
  icons/                  → PWA icons
  manifest.webmanifest    → PWA manifest
  sw.js                   → Service worker
```

Apache serves `index.html` for the root URL. All navigation happens via hash fragments, which the browser handles without any server-side routing configuration.

### Rendering Strategy: createRoot (Client-Only)

Standard React 18 SPA rendering — no hydration, no SSR:

```jsx
// main.jsx
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')).render(<App />);
```

- `createRoot()` in both dev and production
- No `hydrateRoot()` — nothing to hydrate
- No `ReactDOMServer.renderToString()` — no pre-rendering
- No SSR-safe concerns (`typeof window`, FOUC, etc.)
- All components can freely use `window`, `document`, `localStorage` in render

### PWA Caching Strategy

```
precacheAndRoute([
  // index.html (single entry)
  // All JS bundles
  // CSS
  // Product images
  // PWA icons
  // manifest.webmanifest
])
```

`generateSW` with `globPatterns: ['**/*.{html,js,css,png,jpg,webp,svg,woff2}']` will precache everything. Only one HTML file to cache (simpler than pre-rendered approach).

---

## Migration Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Base44 removal breaking imports | High | Many files import from `@/api/` and `@/lib/AuthContext`. Must remove all import chains systematically. Start with vite-plugin, then AuthContext, then API layer. |
| Image localization | Low | Mechanical find-replace of Supabase URLs → local paths; download images to `public/images/` |
| Subfolder `base` path | Low | Vite `base: './'` config, relative asset paths. Well-documented pattern. Hash routing is subfolder-agnostic. |
| Framer Motion works as-is | None | No SSR concerns — all animations run client-side only |
| Recharts works as-is | None | No SSR concerns — SVG rendering is browser-only |
| shadcn/ui + Radix works as-is | None | No SSR concerns — all components run client-side only |
| Hash routing UX | Low | URLs with `#` are less "clean" but fully functional. Acceptable since SEO is not a requirement. |
| Large JS bundle | Medium | Code-split per route with `React.lazy()`; lazy-load Calculator (heaviest page with Recharts). |

---
*Stack research: 2026-03-12*
*Updated: 2026-03-12 — Simplified from SSG to SPA + HashRouter*
