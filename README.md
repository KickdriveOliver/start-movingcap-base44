# MovingCap Static Site

Product catalog and motion calculator for MovingCap servo drives. This project is a React single-page application (SPA) with PWA support for offline use after first load.

## Features

- Product catalog (7 servo drive products with specs and datasheets)
- S-curve motion profile calculator with interactive charts
- Multi-language support (EN, DE, IT, FR)
- PWA support (installable, offline-capable after first HTTPS visit)
- Responsive design for desktop and mobile

## Prerequisites

For IT admin deployment workflows:

1. Install Node.js 18 or newer from https://nodejs.org/ (LTS recommended)
2. npm is included automatically with Node.js
3. Verify installation:

```bash
node --version
npm --version
```

## Quick Start (Development)

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build for Production

```bash
npm run build
```

Build output is generated in the `dist/` folder. Copy the full contents of `dist/` to your web server.

### Custom Base Path (Subfolder Deployment)

If deploying under a subfolder such as `https://example.com/movingcap/`, set `VITE_BASE_URL` before building.

Linux/macOS:

```bash
VITE_BASE_URL=/movingcap/ npm run build
```

Windows PowerShell:

```powershell
$env:VITE_BASE_URL="/movingcap/"; npm run build
```

Windows CMD:

```cmd
set VITE_BASE_URL=/movingcap/ && npm run build
```

Alternative via `.env` file in project root:

```env
VITE_BASE_URL=/movingcap/
```

### Preview Build Locally

```bash
npm run preview
```

## Deploy to Apache

1. Build the project (`npm run build`)
2. Copy everything from `dist/` to your Apache document root or target subfolder
3. No `.htaccess` rewrite rules are required because routing is hash-based (`#/products`, `#/calculator`)
4. Optionally add cache headers for static assets (`assets/*`, icons, images)

Example Apache folder layout:

```text
/var/www/html/movingcap/
├── index.html
├── assets/
├── images/
├── icons/
├── sw.js
└── manifest.webmanifest
```

### HTTPS Requirement for PWA

PWA features (service worker offline caching and installability) require HTTPS. If served over plain HTTP or `file://`, the site still renders but offline caching is unavailable.

## PWA / Offline Behavior

- After first visit over HTTPS, static assets are cached for offline use
- Updates are applied silently on subsequent visits (`registerType: autoUpdate`)
- A subtle `Offline` indicator appears when network connectivity is lost
- External datasheet PDFs hosted on `movingcap.de` are not available offline

## Project Structure

```text
src/
├── pages/          # Page components (Landing, Products, Calculator, etc.)
├── components/     # Shared components, UI library, data
├── Layout.jsx      # App shell (header, footer, navigation)
└── App.jsx         # Router configuration

public/
├── images/         # Product images
└── icons/          # PWA icons and favicons
```

## Tech Stack

- React 18 + React Router 6 (`HashRouter`)
- Vite 6
- Tailwind CSS 3.4 + shadcn/ui
- Framer Motion
- Recharts
- `vite-plugin-pwa`

## Troubleshooting

- Assets not loading after deployment:
	- Verify `VITE_BASE_URL` matches the deployed path
	- Rebuild and redeploy after changing base URL
- PWA/offline not working:
	- Confirm HTTPS is enabled
	- `file://` and non-secure HTTP do not support service workers
- Old version still shown after deploy:
	- Service worker updates on next visit
	- Hard refresh (`Ctrl+Shift+R`) to force the latest assets
