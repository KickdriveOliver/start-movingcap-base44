# Phase 3: Build, PWA & Deployment - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Produce a deployable static build with PWA offline support and clear build/deploy instructions. The app already builds and runs standalone (Phase 1–2 complete). This phase configures production-ready Vite output, adds service worker + manifest for offline capability, writes deployment documentation, and performs a final cleanup of any residual Base44 references (e.g. package.json name).

</domain>

<decisions>
## Implementation Decisions

### Subfolder Deployment
- Vite `base` option configurable at build time via environment variable (not hardcoded)
- All assets (JS, CSS, images) use **relative paths** for full portability — the dist/ folder should work from any location
- Best-effort support for `file://` protocol (open index.html directly) — implement if achievable without major changes; drop if it conflicts with service worker or routing fundamentals
- HashRouter already in place from Phase 2, which naturally supports subfolder and file:// scenarios

### PWA Behavior
- **Full branding** — proper MovingCap app name, description, theme color, and custom icons
- Icon assets already exist in `public/icons/` — multiple resolution PNGs, `favicon.svg` (multicolor vector), `safari-pinned-tab.svg` (monochrome vector)
- **Precache all** build output (JS, CSS, HTML, images, fonts) — aggressive offline-first after first visit
- **Silent auto-update** — Workbox updates service worker automatically on next visit, no user prompt
- **Browser-native install** only — no custom install button in UI

### Service Worker Scope
- Scope matches the configured Vite base path automatically
- Precache everything in dist/ — no runtime caching strategy needed
- External PDF datasheets on movingcap.de stay **online-only** (not cached/bundled)
- **Subtle offline indicator** — small visual cue when the user is offline (e.g. badge or banner)

### Build & Deploy Instructions
- **npm scripts only** — no Makefile; `npm run build` / `npm run preview`
- Target audience: **IT admin who may not know Node.js** — step-by-step with prerequisites, not just commands
- **Apache-specific** deployment docs including .htaccess configuration if needed
- Instructions written into **README.md** (replace current placeholder README)

### Final Cleanup
- Rename `package.json` name from `base44-app` to proper project name (e.g. `movingcap-site`)
- Scan for and remove any remaining Base44 references across the project
- Verify build output is clean and self-contained

### Claude's Discretion
- Specific Vite config details for path aliases (`@/` → `src/`)
- `vite-plugin-pwa` configuration details (Workbox options, generateSW vs injectManifest)
- Offline indicator implementation (toast, badge, or subtle UI element — whatever fits the existing design)
- `.htaccess` rewrite rules (if any needed beyond hash routing)
- Whether `file://` support requires any special handling or is naturally compatible

</decisions>

<specifics>
## Specific Ideas

- Icons in `public/icons/`: multiple PNG resolutions + `favicon.svg` (multicolor) + `safari-pinned-tab.svg` (monochrome) — use these directly in the PWA manifest
- `file://` support is a nice-to-have — if HashRouter + relative paths give it for free, great; don't over-engineer it
- README should enable a new person to go from zero to deployed in under 5 minutes (per success criteria in ROADMAP.md)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-build-pwa-deployment*
*Context gathered: 2026-03-13*
