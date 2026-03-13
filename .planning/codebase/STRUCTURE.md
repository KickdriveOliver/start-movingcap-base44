# Codebase Structure

**Analysis Date:** 2026-03-12

## Directory Layout

```
start-movingcap-base44/
├── .claude/                    # GSD framework (workflows, templates, tools)
├── .github/                    # GitHub config, Copilot prompt files
├── .planning/                  # GSD project planning (this directory)
│   └── codebase/               # Codebase mapping documents
├── src/                        # Application source code
│   ├── api/                    # Base44 SDK client wrappers
│   ├── assets/                 # Static assets (empty)
│   ├── components/             # Reusable components
│   │   ├── data/               # Static data modules
│   │   ├── i18n/               # Translation files (4 languages)
│   │   └── ui/                 # shadcn/ui primitives (~50 files)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Core library code (auth, utils, platform)
│   ├── pages/                  # Page components (route targets)
│   └── utils/                  # Utility functions
├── components.json             # shadcn/ui configuration
├── eslint.config.js            # ESLint flat config
├── index.html                  # SPA entry HTML
├── jsconfig.json               # TypeScript/JSConfig with path aliases
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS (Tailwind + Autoprefixer)
├── tailwind.config.js          # Tailwind CSS config with design tokens
└── vite.config.js              # Vite bundler config
```

## Directory Purposes

**`src/api/`:**
- Purpose: Base44 platform SDK client configuration and entity/integration exports
- Contains: 3 files
- Key files:
  - `base44Client.js` — Creates and exports singleton `base44` SDK client
  - `entities.js` — Exports `Query` entity and `User` auth object
  - `integrations.js` — Exports Core integrations (LLM, Email, SMS, Upload, etc.)

**`src/components/`:**
- Purpose: All reusable components — app-level and UI primitives
- Key files:
  - `CookieConsent.jsx` — GDPR cookie banner
  - `LanguageSelector.jsx` — Language dropdown (EN/DE/IT/FR)
  - `UserNotRegisteredError.jsx` — Auth error page
  - `useTranslations.jsx` — i18n Context provider + hook
- Subdirectories:
  - `data/` — Static data: `products.jsx` (7 MovingCap products)
  - `i18n/` — Translation files: `en.json.jsx`, `de.json.jsx`, `it.json.jsx`, `fr.json.jsx`, `translations.jsx`
  - `ui/` — ~50 shadcn/ui primitive components (accordion, button, card, dialog, etc.)

**`src/hooks/`:**
- Purpose: Custom React hooks
- Contains: 1 file
- Key files: `use-mobile.jsx` — Viewport-based mobile detection hook

**`src/lib/`:**
- Purpose: Core library code — auth, platform integration, utilities
- Key files:
  - `AuthContext.jsx` — Authentication context provider (Base44 auth)
  - `NavigationTracker.jsx` — Page view logging + iframe communication
  - `VisualEditAgent.jsx` — Live CSS editing overlay (base44 platform)
  - `PageNotFound.jsx` — 404 page with admin-aware messaging
  - `app-params.js` — Runtime parameter resolution (URL + localStorage + env)
  - `query-client.js` — TanStack React Query client instance
  - `utils.js` — `cn()` helper (clsx + tailwind-merge) and `isIframe` detection

**`src/pages/`:**
- Purpose: Page-level components, each is a route target
- Contains: 9 page files
- Key files:
  - `Landing.jsx` — Marketing landing page (main page)
  - `Products.jsx` — Product catalog with search
  - `ProductDetail.jsx` — Single product detail (query param `?series=`)
  - `Calculator.jsx` — S-curve motion profile calculator (1081 lines, largest file)
  - `Documentation.jsx` — Documentation hub with datasheets
  - `Impressum.jsx` — Legal imprint page
  - `Datenschutz.jsx` — Privacy policy page
  - `Home.jsx` — Empty placeholder
  - `TranslationExport.jsx` — Empty/unimplemented

**`src/utils/`:**
- Purpose: Shared utility functions
- Contains: 1 file
- Key files: `index.ts` — Exports `createPageUrl()` for route generation

## Key File Locations

**Entry Points:**
- `index.html` — HTML shell with `<div id="root">`
- `src/main.jsx` — React root mount point
- `src/App.jsx` — Application root component (providers, router, auth)

**Configuration:**
- `vite.config.js` — Vite build config
- `jsconfig.json` — Path aliases (`@/*` → `./src/*`), type checking scope
- `tailwind.config.js` — Tailwind theme with CSS variable design tokens
- `eslint.config.js` — ESLint rules (unused imports, react hooks)
- `components.json` — shadcn/ui generator config
- `postcss.config.js` — PostCSS pipeline

**Core Logic:**
- `src/pages/Calculator.jsx` — Motion trajectory calculation engine
- `src/components/data/products.jsx` — Product data (source of truth)
- `src/components/useTranslations.jsx` — i18n system
- `src/lib/AuthContext.jsx` — Authentication state management

**Routing:**
- `src/pages.config.js` — Auto-generated page registry + main page setting
- `src/utils/index.ts` — URL generation helper

**Styling:**
- `src/index.css` — Tailwind directives + CSS variable definitions (light/dark)
- `src/App.css` — Minimal app-level styles

## Naming Conventions

**Files:**
- PascalCase for React components: `Landing.jsx`, `ProductDetail.jsx`, `CookieConsent.jsx`
- kebab-case for shadcn/ui primitives: `button.jsx`, `alert-dialog.jsx`, `dropdown-menu.jsx`
- kebab-case for hooks: `use-mobile.jsx`
- camelCase for non-component JS modules: `base44Client.js`, `app-params.js`
- Translation files: `{lang}.json.jsx` (e.g., `en.json.jsx`)

**Directories:**
- lowercase for all directories: `api/`, `components/`, `pages/`, `lib/`, `hooks/`
- Nested grouping: `components/ui/`, `components/data/`, `components/i18n/`

**Special Patterns:**
- `pages.config.js` — Auto-generated, only `mainPage` is manually editable
- shadcn/ui components in `components/ui/` follow the shadcn naming convention exactly
- `useTranslations.jsx` — Custom hook file named with `use` prefix but PascalCase

## Where to Add New Code

**New Page:**
- Create file: `src/pages/PageName.jsx`
- Auto-registered in `src/pages.config.js` (file is auto-generated)
- Access via: `createPageUrl("PageName")` → `/pagename`

**New Component:**
- App component: `src/components/ComponentName.jsx`
- shadcn/ui primitive: `src/components/ui/component-name.jsx` (via shadcn CLI)

**New Translation Key:**
- Add to all 4 files: `src/components/i18n/{en,de,it,fr}.json.jsx`
- Also add to `src/components/i18n/translations.jsx` if not re-exported from there

**New API Entity:**
- Add export to `src/api/entities.js`

**New Utility:**
- `src/utils/index.ts` for page-level utilities
- `src/lib/utils.js` for CSS/UI utilities

---

*Structure analysis: 2026-03-12*
*Update after directory reorganization*
