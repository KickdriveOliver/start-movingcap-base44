# MovingCap Static Site

## What This Is

A self-contained static website for MovingCap servo drive products — currently hosted on the Base44 platform at start.movingcap.com. This project migrates the site to a standalone build that can be deployed to any standard Apache webserver and run offline as a PWA. The site features a product catalog, S-curve motion profile calculator, technical documentation, and multi-language support (EN/DE/IT/FR).

## Core Value

The product catalog and motion calculator must work flawlessly as a fully offline-capable static site with zero external service dependencies.

## Requirements

### Validated

Existing capabilities confirmed in codebase:

- ✓ Product catalog with 7 MovingCap drive products — existing
- ✓ Product detail pages with specs, features, datasheets — existing
- ✓ S-curve motion profile calculator with recharts visualization — existing
- ✓ Multi-language support (EN/DE/IT/FR) with context-based switching — existing
- ✓ Landing page with marketing content and animations — existing
- ✓ Documentation hub with technical datasheets — existing
- ✓ Legal pages (Impressum, Datenschutz) — existing
- ✓ Cookie consent banner (GDPR) — existing
- ✓ Responsive design with mobile detection — existing
- ✓ shadcn/ui component library with Tailwind CSS — existing

### Active

- [ ] Remove all Base44 platform dependencies (@base44/sdk, auth, integrations, visual edit agent)
- [ ] Download and localize all external images (Supabase storage, Fullmo CDN) to project assets
- [ ] Add PWA support (service worker, manifest) for offline operation
- [ ] Replace `@base44/vite-plugin` with standard Vite config
- [ ] Convert to HashRouter for Apache-compatible SPA routing
- [ ] Remove dead code (Home.jsx, TranslationExport.jsx, unused dependencies)
- [ ] Configure build for subfolder deployment (relative asset paths)
- [ ] Provide clear build instructions / Makefile

### Out of Scope

- Authentication / user accounts — site is public, auth was never enforced
- Database backends — all data is already static JS; no need for server-side data
- Server-side rendering (SSR) — pre-rendered static HTML achieves the same result for this content
- Real-time features (LLM, email, SMS integrations) — platform integrations not used by any page
- Content management system — product data is maintained directly in source code
- Search engine optimization beyond basic meta tags — not a priority for this migration

## Context

**Current State:**
- React 18 SPA running on Base44 platform with Vite 6 + Tailwind 3.4
- Product data is fully static in `src/components/data/products.jsx` (7 products)
- Auth system exists but `requiresAuth: false` — purely public site
- Images loaded from external URLs: `lmhpgqmwcpnpjvllgkkn.supabase.co` and `www.fullmo.de`
- ~50 shadcn/ui components, Framer Motion animations, Recharts for calculator
- Tech debt: duplicate date libraries (moment + date-fns), empty pages, mixed translation patterns

**Migration Target:**
- Static HTML files per route, deployable to Apache webserver
- All assets (images, fonts, CSS, JS) self-contained in build output
- PWA manifest + service worker for offline capability
- Works from subfolder (e.g., `movingcap.com/start/`)
- Simple build command via npm scripts or Makefile

## Constraints

- **Build tool**: Vite (already in use, keep it)
- **Styling**: Tailwind CSS (already in use, keep it)
- **Deployment**: Standard Apache webserver with static files only
- **Offline**: Must work as PWA or from local folder on Windows/Linux
- **No external services**: Zero runtime dependencies on Base44, Supabase, or any API
- **SPA routing**: Hash-based routing (`#/products`) — no server config needed

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Pre-rendered static HTML per route | Dropped — SPA + hash routing chosen for simplicity; SEO not needed | ✓ Good |
| Strip all Base44 code completely | Auth not used; clean removal reduces complexity | — Pending |
| Remove all dead code and unused deps | Leaner build, easier maintenance | — Pending |
| Subfolder deployment | Site may live at a subpath, not root domain | — Pending |
| SPA + hash routing instead of SSG | Eliminates SSR/hydration complexity; works from local folder | — Pending |

---
*Last updated: 2026-03-12 after initialization*
