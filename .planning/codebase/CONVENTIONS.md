# Coding Conventions

**Analysis Date:** 2026-03-12

## Naming Patterns

**Files:**
- PascalCase for React component files: `Landing.jsx`, `ProductDetail.jsx`, `CookieConsent.jsx`
- kebab-case for shadcn/ui primitives: `button.jsx`, `alert-dialog.jsx`, `use-toast.jsx`
- camelCase for non-component modules: `base44Client.js`, `app-params.js`, `query-client.js`
- Hooks: mixed — `use-mobile.jsx` (kebab), `useTranslations.jsx` (PascalCase camelCase hybrid)

**Functions:**
- camelCase for all functions: `createPageUrl`, `getProductBySeries`, `getCalculatorProducts`
- `handle*` not consistently used for event handlers
- Inline arrow functions common in JSX event handlers

**Variables:**
- camelCase for variables: `isMenuOpen`, `searchQuery`, `currentLang`
- UPPER_SNAKE_CASE for constants: `MOBILE_BREAKPOINT`
- Destructuring pattern for context: `const { t, currentLang, setLanguage } = useTranslations()`

**Components:**
- PascalCase for component names: `LanguageSelector`, `CookieConsent`, `AuthenticatedApp`
- Default exports for page components
- Named exports for utility components and hooks

## Code Style

**Formatting:**
- No Prettier config found — formatting is manual/IDE-based
- Inconsistent quote style: double quotes in imports, single quotes in some config files
- Semicolons: present in most code
- Indentation: 2 spaces

**Linting:**
- ESLint 9 with flat config (`eslint.config.js`)
- Scoped to: `src/components/**`, `src/pages/**`, `src/Layout.jsx`
- Key rules:
  - `unused-imports/no-unused-imports: "error"` — Auto-remove unused imports
  - `react/prop-types: "off"` — No PropTypes validation
  - `react/react-in-jsx-scope: "off"` — React 17+ JSX transform
  - `react-hooks/rules-of-hooks: "error"` — Enforce hooks rules
  - `no-unused-vars: "off"` — Delegated to unused-imports plugin
- Run: `npm run lint` / `npm run lint:fix`

## Import Organization

**Order (observed pattern):**
1. React and React libraries (`react`, `react-router-dom`, `react-hook-form`)
2. Third-party libraries (`framer-motion`, `lucide-react`, `recharts`)
3. Internal `@/` path alias imports (`@/components/ui/...`, `@/lib/...`, `@/api/...`)
4. Relative imports (`./components/...`, `./pages/...`)

**Grouping:**
- No enforced import sorting — generally grouped by origin
- No blank lines between import groups required

**Path Aliases:**
- `@/*` → `./src/*` (configured in `jsconfig.json` and resolved by Vite via base44 plugin)
- Used extensively: `@/components/ui/button`, `@/lib/AuthContext`, `@/api/base44Client`

## Error Handling

**Patterns:**
- try/catch at service boundaries (auth checks, API calls)
- Silent catch with `console.error` — errors don't propagate to UI
- No global error boundary component
- No custom error classes

**Examples from codebase:**
```jsx
// AuthContext.jsx - typed error handling
if (appError.status === 403 && appError.data?.extra_data?.reason) {
  const reason = appError.data.extra_data.reason;
  if (reason === 'auth_required') {
    setAuthError({ type: 'auth_required', message: 'Authentication required' });
  }
}

// NavigationTracker.jsx - silent swallow
try {
  await base44.appLogs.logUserInApp({ pageName: matchedPage });
} catch (e) {
  // silently ignore logging failures
}
```

## Logging

**Framework:**
- `console.error` for error conditions
- No structured logging framework
- No production log aggregation

**Patterns:**
- Log errors in auth flow: `console.error('App state check failed:', appError)`
- No debug/info level logging in production code

## Comments

**When to Comment:**
- File-level JSDoc block in `pages.config.js` explaining auto-generation
- Inline comments for non-obvious logic (e.g., fallback patterns in product features)
- `// TODO`-style comments not observed

**Style:**
- Single-line `//` comments predominate
- No JSDoc on functions or components
- No TypeScript type annotations on JSX files (only `jsconfig.json` for type checking)

## Component Patterns

**Page Components:**
```jsx
// Standard page pattern
export default function PageName() {
  const { t, currentLang } = useTranslations();
  const [localState, setLocalState] = useState(initialValue);

  return (
    <motion.div initial="hidden" animate="visible">
      {/* Page content with shadcn/ui components */}
    </motion.div>
  );
}
```

**Translation Usage:**
```jsx
// Every user-facing text goes through t()
<h1>{t('hero_title')}</h1>
<p>{t('hero_subtitle')}</p>
```

**Conditional Rendering:**
```jsx
// Common pattern for optional content
{product.datasheet_url && (
  <Button asChild>
    <a href={datasheetUrl} target="_blank">{t('download_datasheet')}</a>
  </Button>
)}
```

## CSS/Styling Conventions

**Tailwind Classes:**
- Inline Tailwind classes on JSX elements
- `cn()` utility for conditional class merging (from `src/lib/utils.js`)
- CSS variables for design tokens (colors defined in `src/index.css`)

**Responsive Design:**
- Mobile-first with `md:` breakpoint for desktop (`768px`)
- `hidden md:flex` / `md:hidden` pattern for mobile/desktop nav
- `useMobile()` hook for programmatic breakpoint detection

**Animation:**
- Framer Motion throughout: `motion.div`, `AnimatePresence`
- Common pattern: `initial="hidden" animate="visible"` with `variants`
- Staggered entrance animations for lists/grids

---

*Conventions analysis: 2026-03-12*
*Update after establishing new team standards*
