# Architecture

**Analysis Date:** 2026-03-12

## Pattern Overview

**Overall:** Client-side SPA (Single Page Application) on Base44 platform

**Key Characteristics:**
- Static client-side React application with no server-side logic
- Platform-hosted (Base44) with SDK for auth, entities, and integrations
- Page-based routing with shared layout wrapper
- i18n (4 languages) via React Context with static translation data
- Product data is fully static (no database-driven product catalog)

## Layers

**Presentation (Pages):**
- Purpose: Full-page components implementing features
- Contains: `src/pages/*.jsx` — Landing, Products, ProductDetail, Calculator, Documentation, legal pages
- Depends on: Components, Data, Translations, Utilities
- Used by: Router in `App.jsx`

**Components (UI):**
- Purpose: Reusable UI building blocks
- Contains: `src/components/ui/*.jsx` (shadcn primitives), `src/components/*.jsx` (app-level components)
- Depends on: Radix UI, Tailwind CSS, lucide-react icons
- Used by: Pages, Layout

**Data Layer:**
- Purpose: Static product data and API client
- Contains: `src/components/data/products.jsx` (static products), `src/api/` (Base44 SDK wrappers)
- Depends on: `@base44/sdk`
- Used by: Pages (products data), AuthContext (API calls)

**Platform Integration:**
- Purpose: Base44 platform features — auth, logging, visual editing
- Contains: `src/lib/AuthContext.jsx`, `src/lib/NavigationTracker.jsx`, `src/lib/VisualEditAgent.jsx`
- Depends on: `@base44/sdk`, PostMessage API
- Used by: App.jsx (wraps entire app)

**Internationalization:**
- Purpose: Multi-language support (EN, DE, IT, FR)
- Contains: `src/components/useTranslations.jsx`, `src/components/i18n/*.jsx`
- Depends on: React Context
- Used by: All pages and layout

## Data Flow

**Page Render (typical):**

1. `main.jsx` renders `<App />` into DOM root
2. `App.jsx` wraps in `AuthProvider` → `QueryClientProvider` → `Router`
3. `AuthProvider` checks app public settings via Base44 API, then checks user auth
4. React Router matches URL to page component via `pages.config.js`
5. `LayoutWrapper` wraps page in `Layout` (header/footer/nav)
6. Page component reads static product data + translation context
7. Page renders with shadcn/ui components, Tailwind classes, framer-motion animations

**Auth Flow:**

1. `AuthContext` loads app public settings from Base44 API
2. If `access_token` exists (from URL param or localStorage), checks user auth via `base44.auth.me()`
3. On error: shows `UserNotRegisteredError` or redirects to login
4. On success: renders authenticated app
5. `NavigationTracker` logs page views for authenticated users

**State Management:**
- React Context for auth state (`AuthContext`) and language (`TranslationContext`)
- React Query for server data (configured but minimally used — only `PageNotFound.jsx`)
- `useState` within page components for UI state (search queries, calculator inputs)
- `localStorage` for language preference and cookie consent

## Key Abstractions

**Base44 SDK Client:**
- Purpose: Interface to Base44 platform APIs
- Examples: `base44.auth`, `base44.entities.Query`, `base44.integrations.Core`
- Pattern: Singleton client created in `src/api/base44Client.js`

**Translation System:**
- Purpose: Static i18n with language-specific text lookup
- Examples: `useTranslations()` hook returning `{ t, currentLang, setLanguage }`
- Pattern: Context Provider + hook, static translation maps imported synchronously

**Product Data Model:**
- Purpose: Static product catalog for MovingCap drives
- Examples: `products` array, `getProductBySeries()`, `getCalculatorProducts()`
- Pattern: Static data module with helper functions, no database

**Page Config System:**
- Purpose: Auto-generated routing configuration
- Examples: `pages.config.js` with `PAGES` object mapping name → component
- Pattern: Convention-based — files in `src/pages/` are registered automatically

## Entry Points

**Browser Entry:**
- Location: `src/main.jsx` → `index.html`
- Triggers: Browser navigation / page load
- Responsibilities: Mount React root, render App, set up HMR messaging

**Route Entry:**
- Location: `src/App.jsx` → `AuthenticatedApp` component
- Triggers: URL changes via React Router
- Responsibilities: Auth gating, route matching, layout wrapping

## Error Handling

**Strategy:** Minimal — errors caught at auth boundary, graceful fallbacks in UI

**Patterns:**
- Auth errors caught in `AuthContext` with typed error states (`auth_required`, `user_not_registered`)
- Navigation logging silently swallows errors (`try/catch` with no rethrow)
- No global error boundary component
- Product lookups return `null` for missing data (handled with conditional rendering)

## Cross-Cutting Concerns

**Logging:**
- `NavigationTracker` logs page views to Base44 platform for authenticated users
- `console.error` used for auth failures

**Internationalization:**
- `TranslationProvider` wraps all pages via `Layout`
- 4 languages: English, German, Italian, French
- Static translation files (~1100 lines each) in `src/components/i18n/`
- Fallback chain: requested language → English → raw key

**Authentication:**
- Base44 platform auth via SDK
- Token passed via URL `?access_token=` and persisted in localStorage
- `AuthProvider` gates the entire app — either shows content or error/redirect

**Visual Editing:**
- `VisualEditAgent` (648 lines) provides live CSS editing via PostMessage API
- Platform feature for base44 editor integration — not for end users

---

*Architecture analysis: 2026-03-12*
*Update after major structural changes*
