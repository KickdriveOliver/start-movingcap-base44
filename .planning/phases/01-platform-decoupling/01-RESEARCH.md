# Phase 1 Research: Platform Decoupling

**Phase:** 1 — Platform Decoupling
**Researched:** 2026-03-12
**Confidence:** High — based on direct source code analysis

---

## Scope

Remove all Base44 platform dependencies so the app builds and runs standalone with `vite build` and `vite dev`.

## Source Code Analysis

### Files to DELETE (no longer needed)

| File | Lines | Reason |
|------|-------|--------|
| `src/api/base44Client.js` | 14 | Creates Base44 SDK client — all consumers being removed |
| `src/api/entities.js` | 10 | Exports `Query` and `User` from SDK — unused by pages |
| `src/api/integrations.js` | 22 | Exports LLM/email/SMS integrations — unused by pages |
| `src/lib/AuthContext.jsx` | 155 | Auth provider wrapping entire app — never enforced |
| `src/lib/NavigationTracker.jsx` | 50 | Platform analytics (`postMessage` + `appLogs`) |
| `src/lib/VisualEditAgent.jsx` | 556 | Platform visual editor |
| `src/lib/app-params.js` | 51 | Reads `app_id`, `server_url`, `access_token` from URL params |
| `src/lib/query-client.js` | 12 | `@tanstack/react-query` client — no queries remain |
| `src/lib/PageNotFound.jsx` | 75 | 404 page with auth query — replace with static version |
| `src/components/UserNotRegisteredError.jsx` | ~30 | Base44 registration error UI |
| `src/pages/Home.jsx` | 12 | Empty placeholder — Landing.jsx is the real homepage |
| `src/pages/TranslationExport.jsx` | 0 | Empty file |
| `src/pages.config.js` | 76 | Auto-generated route config — replace with explicit routes |

### Files to MODIFY

| File | What Changes |
|------|-------------|
| `vite.config.js` | Remove `@base44/vite-plugin`, add `resolve.alias` for `@/` |
| `src/App.jsx` | Complete rewrite — remove Auth/Query wrappers, use explicit routes with `BrowserRouter` (HashRouter in Phase 2) |
| `src/main.jsx` | Remove Base44 HMR iframe `postMessage` code |
| `package.json` | Remove 15+ unused dependencies |

### Import Dependency Graph (removal cascade)

```
@base44/vite-plugin ← vite.config.js (BLOCKS BUILD)
    ↓
@base44/sdk ← base44Client.js ← AuthContext.jsx, NavigationTracker, PageNotFound
    ↓                          ← entities.js, integrations.js (unused by pages)
    ↓
AuthContext.jsx ← App.jsx (AuthProvider + useAuth)
    ↓
NavigationTracker ← App.jsx
VisualEditAgent ← App.jsx
query-client ← App.jsx (QueryClientProvider)
pages.config ← App.jsx (dynamic route generation)
UserNotRegisteredError ← App.jsx
PageNotFound ← App.jsx
app-params ← base44Client.js ← AuthContext.jsx
```

**Key insight:** All Base44 imports form a single dependency tree rooted in `App.jsx`. No page component imports any Base44 module. This means removal is clean — modify `App.jsx` + `vite.config.js` + `main.jsx`, delete the tree, remove deps.

### Pages that use `createPageUrl()` (from `src/utils/index.ts`)

- `Landing.jsx` — navigation links to products, calculator
- `Products.jsx` — links to product detail pages
- `ProductDetail.jsx` — back-links, related product links

`createPageUrl()` returns `'/' + pageName.toLowerCase()` — this must be preserved for Phase 1 (Phase 2 converts to hash routing). The routes change from dynamic `pages.config` to explicit routes but paths like `/products`, `/calculator` remain the same.

### Dependencies to REMOVE from package.json

**Platform dependencies:**
- `@base44/sdk` — Core SDK
- `@base44/vite-plugin` — Build plugin
- `@tanstack/react-query` — No API calls remain

**Unused dependencies (never imported by any page or component):**
- `three` — 3D rendering (~600KB)
- `react-leaflet` — Maps
- `react-quill` — Rich text editor
- `react-markdown` — Markdown rendering
- `canvas-confetti` — Confetti animation
- `@hello-pangea/dnd` — Drag and drop
- `react-hot-toast` — Duplicate toast library (keeping `sonner`)
- `lodash` — Utility library (not imported anywhere)
- `moment` — Date library (~330KB, `date-fns` already present)
- `next-themes` — Theme switching (only imported in unused `sonner.jsx`)
- `html2canvas` — Screenshot library
- `jspdf` — PDF generation

**Note on `next-themes`:** Imported by `src/components/ui/sonner.jsx`, but that component is never imported by any other file. `App.jsx` uses `@/components/ui/toaster` (Radix toast), not sonner. Safe to remove `next-themes` if we also fix/remove the sonner component — but that's a shadcn/ui component. Safest approach: remove `next-themes`, replace `useTheme()` in sonner.jsx with a hardcoded theme value. This keeps sonner available if needed later.

### New NotFound.jsx Component

Simple static 404 page replacing `PageNotFound.jsx` (which queries Base44 auth):

```jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-7xl font-light text-slate-300">404</h1>
        <div className="h-0.5 w-16 bg-slate-200 mx-auto" />
        <h2 className="text-2xl font-medium text-slate-800">Page Not Found</h2>
        <p className="text-slate-600">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-block text-blue-600 hover:text-blue-800 underline">
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
```

### New App.jsx Structure (Phase 1)

Still uses `BrowserRouter` in Phase 1 (converted to `HashRouter` in Phase 2). Routes are explicit instead of dynamic from `pages.config.js`.

```jsx
import './App.css';
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Landing from '@/pages/Landing';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Calculator from '@/pages/Calculator';
import Documentation from '@/pages/Documentation';
import Impressum from '@/pages/Impressum';
import Datenschutz from '@/pages/Datenschutz';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<Products />} />
          <Route path="/productdetail" element={<ProductDetail />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
```

**Note:** Route paths match `createPageUrl()` output — e.g., `createPageUrl("Products")` returns `/products` which matches `<Route path="/products">`. The `ProductDetail` route uses `/productdetail` to match `createPageUrl("ProductDetail")`.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Build fails after removing vite-plugin | Certain | Blocking | Add `resolve.alias` for `@/` first |
| White screen from missing AuthProvider | High | Blocking | Rewrite App.jsx completely, not incremental |
| Broken routes from removing pages.config | High | All pages 404 | Verify each route after rewrite |
| Missing dependency (imported but not found) | Low | Build error | Grep for all imports before removing |
| sonner.jsx fails without next-themes | Low | Toast broken | Fix sonner.jsx to hardcode theme |

---
*Phase 1 Research: 2026-03-12*
