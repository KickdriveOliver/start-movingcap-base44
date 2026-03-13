# Technology Stack

**Analysis Date:** 2026-03-12

## Languages

**Primary:**
- JavaScript (JSX) - All application code, components, pages, utilities

**Secondary:**
- TypeScript - Utility file (`src/utils/index.ts`), type checking via `jsconfig.json`
- CSS - Tailwind-based styling (`src/index.css`, `src/App.css`)

## Runtime

**Environment:**
- Node.js - Development tooling (Vite, ESLint, PostCSS)
- Browser - Client-side SPA, no SSR

**Package Manager:**
- npm - Standard package manager
- Lockfile: `package-lock.json` expected (not committed or gitignored)

## Frameworks

**Core:**
- React 18.2 - UI framework (function components, hooks)
- React Router DOM 6.26 - Client-side routing
- TanStack React Query 5.84 - Server state management

**UI:**
- shadcn/ui (new-york style) - Component library (`components.json` config)
- Radix UI - Headless component primitives (20+ packages)
- Tailwind CSS 3.4 - Utility-first CSS framework
- Framer Motion 11.16 - Animations throughout pages

**Build/Dev:**
- Vite 6.1 - Bundler and dev server
- `@base44/vite-plugin` 1.0 - Platform-specific Vite plugin
- PostCSS 8.5 + Autoprefixer 10.4 - CSS processing
- ESLint 9.19 - Linting (flat config)
- TypeScript 5.8 - Type checking only (no compilation, `checkJs: true`)

## Key Dependencies

**Critical (Platform):**
- `@base44/sdk` ^0.8.0 - Base44 platform SDK (auth, entities, integrations, logging)

**Critical (Features):**
- `recharts` ^2.15.4 - Motion profile charts in Calculator page
- `zod` ^3.24.2 - Schema validation (with `@hookform/resolvers`)
- `react-hook-form` ^7.54.2 - Form management
- `react-leaflet` ^4.2.1 - Map widget (available but usage not confirmed in pages)
- `jspdf` ^2.5.2 + `html2canvas` ^1.4.1 - PDF generation from browser
- `three` ^0.171.0 - 3D rendering (available, usage not confirmed)

**UI Enhancements:**
- `lucide-react` ^0.475.0 - Icon library
- `sonner` ^2.0.1 - Toast notifications
- `embla-carousel-react` ^8.5.2 - Carousels
- `canvas-confetti` ^1.9.4 - Confetti effects
- `vaul` ^1.1.2 - Drawer component

**Utilities:**
- `lodash` ^4.17.21 - General utility functions
- `date-fns` ^3.6.0 + `moment` ^2.30.1 - Date formatting (two libraries)
- `clsx` ^2.1.1 + `tailwind-merge` ^3.0.2 - CSS class utilities
- `class-variance-authority` ^0.7.1 - Variant-based class generation (for shadcn)

## Configuration

**Environment:**
- Vite env vars via `import.meta.env` (`VITE_BASE44_APP_ID`, `VITE_BASE44_BACKEND_URL`)
- Runtime params from URL query params + localStorage (`src/lib/app-params.js`)
- `access_token` passed via URL, stored in localStorage

**Build:**
- `vite.config.js` - Vite config with base44 plugin + react plugin
- `jsconfig.json` - Path aliases (`@/*` → `./src/*`), type checking config
- `components.json` - shadcn/ui configuration (new-york style, lucide icons)
- `tailwind.config.js` - Tailwind config with CSS variable-based design tokens
- `postcss.config.js` - PostCSS with Tailwind + Autoprefixer
- `eslint.config.js` - ESLint flat config

## Platform Requirements

**Development:**
- Any platform with Node.js
- Run: `npm run dev` (Vite dev server)

**Production:**
- Hosted on Base44 platform
- Static SPA build: `npm run build` (Vite production build)
- No server-side runtime required

---

*Stack analysis: 2026-03-12*
*Update after major dependency changes*
