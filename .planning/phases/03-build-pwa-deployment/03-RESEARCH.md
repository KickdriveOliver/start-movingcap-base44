# Phase 3: Build, PWA & Deployment - Research

**Researched:** 2026-03-13
**Domain:** Vite PWA configuration, service worker, static deployment
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Vite `base` option configurable at build time via environment variable
- All assets use relative paths for full portability
- Best-effort `file://` protocol support (if achievable without major changes)
- Full branding PWA — MovingCap name, description, theme color, custom icons from `public/icons/`
- Precache all build output — aggressive offline-first
- Silent auto-update — Workbox updates service worker automatically
- Browser-native install only — no custom install button
- Service worker scope matches configured Vite base path automatically
- External PDF datasheets on movingcap.de stay online-only
- Subtle offline indicator in UI
- npm scripts only (no Makefile)
- IT-admin-friendly step-by-step README with prerequisites
- Apache-specific deployment docs
- README.md replaces current placeholder
- Rename package.json name from `base44-app`
- Scan for and remove remaining Base44 references

### Claude's Discretion
- Specific vite-plugin-pwa configuration details (generateSW vs injectManifest)
- Offline indicator implementation approach
- `.htaccess` content (if any needed)
- Whether `file://` requires special handling

### Deferred Ideas (OUT OF SCOPE)
- None — all discussion stayed within phase scope
</user_constraints>

<research_summary>
## Summary

Phase 3 takes the already working React SPA and adds production build configuration, PWA offline support, and deployment documentation. The codebase is clean after Phases 1-2: no Base44 SDK imports remain, images are local, routing uses `HashRouter`.

The standard approach is `vite-plugin-pwa` with `generateSW` mode — it auto-generates a Workbox service worker that precaches all build output. The Vite `base` option with `'./'` default (overridable via `VITE_BASE_URL` env var) makes assets portable. Icons already exist in `public/icons/` at required resolutions.

Remaining cleanup is minimal: rename `package.json` name, remove `base44` text references in `translations.jsx` Impressum content (legal text mentioning the platform — user decision needed on whether to keep/edit), and remove the dead `<link rel="manifest" href="/manifest.json" />` from `index.html` (vite-plugin-pwa injects its own).

**Primary recommendation:** Use `vite-plugin-pwa` with `generateSW`, `base: './'`, and write comprehensive README.md with Apache deployment steps.
</research_summary>

<standard_stack>
## Standard Stack

### Core (to add)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite-plugin-pwa | ^0.21.x | PWA for Vite | Generates manifest + SW via Workbox; battle-tested with Vite 6 |

### Already Present (no changes)
| Library | Version | Purpose |
|---------|---------|---------|
| vite | ^6.1.0 | Build tool — already configured with `@/` alias |
| @vitejs/plugin-react | ^4.3.4 | React JSX transform |
| react-router-dom | ^6.26.0 | HashRouter already in place |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| vite-plugin-pwa (generateSW) | injectManifest mode | More control but requires writing custom SW; not needed for simple precache |
| vite-plugin-pwa | Manual public/sw.js + manifest.json | More work, no auto-precache manifest, manual registration |
| cross-env for VITE_BASE_URL | dotenv / inline env | cross-env is cross-platform; but VITE_ env vars also work via `.env` files natively in Vite |

**Installation:**
```bash
npm install --save-dev vite-plugin-pwa
```

Note: `cross-env` from STACK.md research is optional — Vite natively reads `VITE_*` env vars from `.env` files, and the user can set env vars in their shell. Skipping `cross-env` keeps devDependencies lean.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Vite Config with PWA
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: process.env.VITE_BASE_URL || './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',  // Silent auto-update
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico,woff2}'],
      },
      manifest: {
        name: 'MovingCap - Servo Drive Products',
        short_name: 'MovingCap',
        // ... icons, theme_color, etc.
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Build Output Structure
```
dist/
  index.html                     # SPA entry
  assets/                        # Hashed JS/CSS bundles
  images/                        # Product images (copied from public/)
  icons/                         # PWA icons (copied from public/)
  favicon.svg                    # Favicon
  manifest.webmanifest           # Generated by vite-plugin-pwa
  sw.js                          # Generated service worker
  workbox-*.js                   # Workbox runtime
```

### Offline Indicator Pattern
Simple React component using `navigator.onLine` + event listeners:
```jsx
function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  useEffect(() => {
    const goOffline = () => setIsOffline(true)
    const goOnline = () => setIsOffline(false)
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])
  if (!isOffline) return null
  return <div className="...">Offline</div>
}
```
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Service worker | Manual public/sw.js | vite-plugin-pwa generateSW | Precache manifest auto-generated from build output; manual SW misses new assets |
| PWA manifest | Manual manifest.json | vite-plugin-pwa manifest config | Plugin handles icon paths relative to base, generates correct manifest |
| SW registration | Manual `navigator.serviceWorker.register()` | vite-plugin-pwa `registerType: 'autoUpdate'` | Handles update lifecycle, registration timing, reload triggers |
| Asset hashing in SW | Manual revision tracking | Workbox precaching | Workbox uses content hashes from Vite build output automatically |
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Hardcoded absolute asset paths
**What goes wrong:** Assets fail to load when deployed to a subfolder
**Why it happens:** Default Vite `base: '/'` produces absolute paths like `/assets/index-abc.js`
**How to avoid:** Use `base: './'` for relative paths; all `<script>`, `<link>`, and image `src` become relative
**Warning signs:** 404s on JS/CSS when opening from subfolder or file://

### Pitfall 2: manifest.json link in index.html conflicts with plugin
**What goes wrong:** Two manifests — one from the static link, one from vite-plugin-pwa
**Why it happens:** Current `index.html` has `<link rel="manifest" href="/manifest.json" />`; vite-plugin-pwa also injects a manifest link
**How to avoid:** Remove the existing `<link rel="manifest">` from index.html; let the plugin inject it
**Warning signs:** Console warnings about duplicate manifests, wrong manifest loaded

### Pitfall 3: Service worker scope vs subfolder
**What goes wrong:** SW doesn't intercept requests because scope doesn't match deployment path
**Why it happens:** Default SW scope is `/`; subfolder deployments need scope matching the base path
**How to avoid:** vite-plugin-pwa handles this automatically when `base` is configured — it sets SW scope to match
**Warning signs:** PWA install prompt doesn't appear; offline doesn't work despite SW being registered

### Pitfall 4: file:// and service workers
**What goes wrong:** Service worker registration fails on file:// protocol
**Why it happens:** Service workers require HTTPS or localhost; file:// is neither
**How to avoid:** Accept this limitation — document it in README. App still renders from file:// because all assets are relative and local; just no offline caching
**Warning signs:** Console error "Failed to register a ServiceWorker"
</common_pitfalls>

<code_examples>
## Code Examples

### vite-plugin-pwa with generateSW
```javascript
// vite.config.js — complete config
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: process.env.VITE_BASE_URL || './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,ico,woff,woff2}'],
      },
      includeAssets: ['favicon.svg', 'favicon.ico', 'icons/safari-pinned-tab.svg'],
      manifest: {
        name: 'MovingCap - Servo Drive Products',
        short_name: 'MovingCap',
        description: 'Product catalog and motion calculator for MovingCap servo drives',
        theme_color: '#1e40af',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### SW Registration Check (for offline indicator)
```javascript
// vite-plugin-pwa handles registration automatically via virtual:pwa-register
// For offline indicator, just use navigator.onLine — no direct SW interaction needed
```
</code_examples>

<open_questions>
## Open Questions

1. **Impressum "base44.com" text references**
   - What we know: `translations.jsx` lines 124, 557, 697 mention "base44.com" in legal/Impressum text
   - What's unclear: Should this legal text be updated or is it accurate (the site was built on base44)?
   - Recommendation: Flag during execution — these are content edits, not code. User should decide the replacement text.

2. **Theme color selection**
   - What we know: Need a `theme_color` for PWA manifest
   - What's unclear: Exact brand color to use
   - Recommendation: Use primary blue from Tailwind config (`hsl(var(--primary))`) — inspect the actual hex value from CSS variables. Fallback: `#1e40af` (blue-800).
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- Existing `.planning/research/STACK.md` — comprehensive stack research from initialization
- Existing `.planning/research/ARCHITECTURE.md` — deployment architecture patterns
- Current codebase: `vite.config.js`, `index.html`, `package.json`, `public/icons/`

### Secondary (MEDIUM confidence)
- vite-plugin-pwa docs — generateSW config, registerType options
- Workbox precaching patterns — globPatterns syntax
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Vite build config, vite-plugin-pwa
- Ecosystem: Workbox, PWA manifest standard
- Patterns: Subfolder deployment, offline indicator, service worker lifecycle
- Pitfalls: Asset paths, manifest conflicts, file:// limitations

**Confidence breakdown:**
- Standard stack: HIGH — single well-known library (vite-plugin-pwa)
- Architecture: HIGH — straightforward Vite config changes
- Pitfalls: HIGH — documented in existing research + known web platform constraints
- Code examples: HIGH — patterns from official docs and existing codebase analysis

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (30 days — Vite ecosystem stable)
</metadata>

---

*Phase: 03-build-pwa-deployment*
*Research completed: 2026-03-13*
*Ready for planning: yes*
