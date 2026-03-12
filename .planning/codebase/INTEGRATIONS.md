# External Integrations

**Analysis Date:** 2026-03-12

## APIs & External Services

**Base44 Platform (Primary):**
- Purpose: Full application hosting platform — auth, data, integrations, deployment
- SDK/Client: `@base44/sdk` ^0.8.0 via `src/api/base44Client.js`
- Auth: Token-based (`access_token` URL param → localStorage)
- Endpoints used:
  - `base44.auth.me()` — Check current user authentication
  - `base44.entities.Query` — Entity CRUD operations
  - `base44.integrations.Core` — Platform integrations (LLM, Email, SMS, Upload, Image, FileExtract)
  - `base44.appLogs.logUserInApp()` — User activity logging
  - App public settings API: `GET /api/apps/public/prod/public-settings/by-id/{appId}`

**Base44 Integrations (Available via SDK):**
- `InvokeLLM` — AI/LLM text generation
- `SendEmail` — Transactional email sending
- `SendSMS` — SMS notifications
- `UploadFile` — File upload to platform storage
- `GenerateImage` — AI image generation
- `ExtractDataFromUploadedFile` — Document data extraction

> Note: These integrations are exported in `src/api/integrations.js` but their actual usage in page code was not found during analysis. They may be available for future features.

## Data Storage

**Databases:**
- No direct database — all data access through Base44 SDK entities
- `Query` entity available via `base44.entities.Query`
- Platform handles persistence, querying, and storage

**File Storage:**
- Base44 platform file storage via `UploadFile` integration
- Product images hosted externally:
  - Supabase storage: `lmhpgqmwcpnpjvllgkkn.supabase.co/storage/v1/object/public/...`
  - Fullmo CDN: `www.fullmo.de/movingcap/img/...`

**Caching:**
- React Query client with `refetchOnWindowFocus: false` and `retry: 1`
- Browser localStorage for: language preference, cookie consent, auth tokens, app params

## Authentication & Identity

**Auth Provider:**
- Base44 platform authentication
- Implementation: `@base44/sdk` auth module wrapped in React Context (`src/lib/AuthContext.jsx`)
- Token storage: localStorage (`base44_access_token` key)
- Session management: Token passed via URL `?access_token=`, persisted in localStorage

**Auth Flow:**
1. App checks public settings from Base44 API
2. If token exists, calls `base44.auth.me()` to verify
3. Handles three states: authenticated, `auth_required` (redirect to login), `user_not_registered` (error page)

**Current Configuration:**
- `requiresAuth: false` in `src/api/base44Client.js` — app does NOT require authentication
- Auth machinery exists but is not enforced for this public-facing app

## Monitoring & Observability

**Error Tracking:**
- No dedicated error tracking service (no Sentry, Datadog, etc.)
- `console.error` for auth and navigation failures

**Analytics:**
- Base44 platform logging via `base44.appLogs.logUserInApp()` in `NavigationTracker`
- Tracks page views for authenticated users

**Logs:**
- Browser console only
- No server-side logging (static SPA)

## CI/CD & Deployment

**Hosting:**
- Base44 platform
- Static SPA deployment (Vite build output)

**Build:**
- `npm run build` → Vite production build
- `@base44/vite-plugin` handles platform-specific build transforms

**Visual Edit:**
- `VisualEditAgent.jsx` (648 lines) provides live CSS editing overlay
- Communicates with base44 platform editor via PostMessage API
- Supports: element hover highlighting, click selection, Tailwind class editing

## Environment Configuration

**Development:**
- Required env vars:
  - `VITE_BASE44_APP_ID` — Base44 application ID
  - `VITE_BASE44_BACKEND_URL` — Base44 backend server URL
- Optional: `BASE44_LEGACY_SDK_IMPORTS=true` — Enable legacy import paths

**Runtime (Browser):**
- `app_id` — From env var or URL param
- `server_url` — From env var or URL param
- `access_token` — From URL param (removed from URL after capture)
- `functions_version` — Optional, from URL param
- All stored in localStorage with `base44_` prefix

**External URLs (Hardcoded):**
- Product datasheets: `www.fullmo.de/movingcap/downloads/...`
- Product images: `lmhpgqmwcpnpjvllgkkn.supabase.co/storage/...` and `www.fullmo.de/movingcap/img/...`
- Company website: `movingcap.de`
- Contact email: `info@drives.fullmo.de`

---

*Integrations analysis: 2026-03-12*
*Update after adding new external services*
