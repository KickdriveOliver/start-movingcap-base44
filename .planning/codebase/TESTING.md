# Testing Patterns

**Analysis Date:** 2026-03-12

## Test Framework

**Runner:**
- No test framework configured
- No test runner in `package.json` scripts
- No `test` script defined

**Status:** Testing is not implemented in this project.

## Test File Organization

**Location:**
- No test files found in the codebase
- No `__tests__/` directories
- No `*.test.js`, `*.test.jsx`, `*.spec.js` files

## Type Checking (Alternative Quality Gate)

**TypeScript checking via `jsconfig.json`:**
- `checkJs: true` enables type checking on JavaScript files
- Scoped to: `src/components/**/*.js`, `src/pages/**/*.jsx`, `src/Layout.jsx`
- Excludes: `node_modules`, `dist`, `src/components/ui`, `src/api`, `src/lib`
- Run: `npm run typecheck` (`tsc -p ./jsconfig.json`)

**ESLint as quality gate:**
- Catches unused imports (error level)
- Enforces React hooks rules
- Run: `npm run lint` / `npm run lint:fix`

## Recommendations

**If adding tests:**
- Consider Vitest (natural fit with Vite tooling)
- Priority areas for testing:
  1. `Calculator.jsx` — Complex S-curve physics calculations (pure function `calculateTrajectoryParameters`)
  2. `src/components/data/products.jsx` — Product lookup helpers
  3. `src/utils/index.ts` — `createPageUrl()` function
  4. `src/components/useTranslations.jsx` — Translation fallback logic
  5. `src/lib/app-params.js` — Parameter resolution logic

**Test structure suggestion:**
```
src/
  pages/
    Calculator.test.jsx
  components/
    data/
      products.test.jsx
  utils/
    index.test.ts
```

---

*Testing analysis: 2026-03-12*
*Update after establishing test infrastructure*
