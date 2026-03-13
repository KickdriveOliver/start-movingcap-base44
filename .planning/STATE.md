# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-12)

**Core value:** The product catalog and motion calculator must work flawlessly as a fully offline-capable static site with zero external service dependencies.
**Current focus:** Phase 3 — Build, PWA & Deployment

## Current Position

Phase: 3 of 3 (Build, PWA & Deployment)
Plan: 0 of 3 in current phase
Status: Planned — 3 plans ready for execution
Last activity: 2026-03-13 — Phase 3 researched and planned (3 plans in 2 waves)

Progress: [███████░░░] 67%

## Performance Metrics

**Velocity:**
- Total plans completed: 6
- Average duration: 12.0 min
- Total execution time: 1.2 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 (Platform Decoupling) | 3 | 41 min | 13.7 min |
| 2 (Asset Localization & Route Restructuring) | 3 | 31 min | 10.3 min |

**Recent Trend:**
- Last 5 plans: 01-02, 01-03, 02-01, 02-02, 02-03
- Trend: Stable (all planned tasks completed without blockers)

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: Drop pre-rendered static HTML in favor of SPA + hash routing — SEO not needed, eliminates SSR/hydration complexity
- [Init]: Strip all Base44 code completely — auth never enforced, clean removal
- [Init]: Remove all dead code and unused dependencies — leaner build
- [Init]: Subfolder deployment — site may live at a subpath
- [Exec-01-03]: Use fixed light Sonner theme and remove `next-themes` to preserve functionality without introducing new theme infrastructure
- [Exec-02-01]: Localize all product imagery to `/images/movingcap-*.jpg` and replace hero external image with CSS gradient
- [Exec-02-02]: Use `HashRouter` with `/product/:slug` and remove `createPageUrl` utility in favor of direct route strings
- [Exec-02-03]: Delete unused i18n `.json.jsx` stubs and keep `translations.jsx` as single source of truth

### Key Research Findings

- **@base44/vite-plugin must be removed first** — nothing builds without this change (PITFALLS.md)
- **AuthProvider wraps entire app** — removal cascades to App.jsx, NavigationTracker, PageNotFound. Create stub first.
- **External images in 2+ locations** — Landing.jsx has URLs in two data structures, products.jsx has more
- **localStorage reads in render path** — useTranslations and CookieConsent read localStorage (safe since no SSR now)
- **15 unused packages** to remove, saving ~2MB+ from bundle

### Pending Todos

- Plan and execute Phase 3 plans (03-01 → 03-02 → 03-03)

### Blockers/Concerns

None. Existing build warnings remain in `src/components/i18n/translations.jsx` (duplicate object keys) and chunk-size warning; both are non-blocking.

## Session Continuity

Last session: 2026-03-13
Stopped at: Phase 3 planned — 3 plans ready for execution
Resume file: .planning/phases/03-build-pwa-deployment/03-01-PLAN.md
