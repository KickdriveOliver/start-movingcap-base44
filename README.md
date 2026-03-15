# MovingCap Start App

Product catalog and motion calculator for [MovingCap Servo Drives](https://movingcap.com) from [Fullmo GmbH](https://fullmo.de). This project is a React single-page application (SPA) with PWA support for offline use after first load.

> **Migration demo**: This repository documents a successful one-shot migration of a [Base 44](https://base44.com) AI-builder prototype to a self-hosted static site with PWA offline support — deployed on a standard Apache web server. It demonstrates the productive use of the amazing [GSD get-shit-done](https://github.com/gsd-build/get-shit-done) meta-prompting framework within a Windows / VS Code / Copilot / Claude / GPT / Gemini mixed environment. 

## Base44 Migration Process

This project started as a rapid prototype built entirely inside [Base 44](https://base44.com). The goal was to migrate it to a conventional, self-hosted React SPA without manual rewriting. 

### Toolchain & Steps

1. **Prepare data layer while still in Base44**
   Prompt the Base 44 builder to replace its data management for translation and product data with local static JSON/JS data storage. A approach similar to this [cat-based coding style](https://talktomachines.blogspot.com/2025/12/cat-based-coding-in-2025-can-i-haz.html) has worked well here.

2. **Export from Base 44**
   The Base 44 "Builder" plan allows exporting to a `.zip` archive.

3. **Import into VS Code workspace**
   Create a [VS Code](https://code.visualstudio.com/) / GitHub Copilot Pro workspace and copy the `.zip` contents there. 

4. **Set up GSD (get-shit-done)**
   Install the [VS Code / no-git fork of GSD](https://github.com/KickdriveOliver/get-shit-done/tree/feature/vscode-copilot-win-no-git) - see also the original and updated [GSD get-shit-done](https://github.com/gsd-build/get-shit-done) for Claude Code. 

5. **Map the codebase**
   Run `/gsd-map-codebase` to analyze the base44 project structure and dependencies.

6. **Write conversion requirements** in a free text specification file:
   [`specs_convert_to_static_site.md`](https://github.com/KickdriveOliver/start-movingcap-base44/blob/main/.planning/user_docs/specs_convert_to_static_site.md)

7. **Launch the migration**
   ```
   /gsd-new-project convert this web project as described in .planning/user_docs/specs_convert_to_static_site.md
   ```
   GSD drives the full planning → execution → verification cycle.

8. **Interactive mode with model selection**
   Use GSD's interactive discussion and verification phases. Model allocation that worked well for this project:
   - **Claude Opus 4.6** — GSD plan and verify
   - **GPT 5.3** — GSD execute


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

If deploying under a subfolder such as `https://example.com/start/`, set `VITE_BASE_URL` before building.

Linux/macOS:

```bash
VITE_BASE_URL=/start/ npm run build
```

Windows PowerShell:

```powershell
$env:VITE_BASE_URL="/start/"; npm run build
```

Windows CMD:

```cmd
set VITE_BASE_URL=/start/ && npm run build
```

Alternative via `.env` file in project root:

```env
VITE_BASE_URL=/start/
```

### Preview Build Locally

```bash
npm run preview
```

## Deploy to Apache

1. Build the project (`npm run build`)
2. Copy everything from `dist/` to your Apache document root or target subfolder
3. No `.htaccess` rewrite rules are required because routing is hash-based (`#/products`, `#/calculator`)
4. Add HTTP cache headers for correct PWA update behavior:
   - Serve `index.html`, `sw.js`, `registerSW.js`, and `manifest.webmanifest` with `Cache-Control: no-cache, no-store, must-revalidate`
   - Serve static assets (`*.js`, `*.css`, images, fonts) with long cache (`max-age=31536000, immutable`)
   - Use the ready-made Apache snippet in `deploy/apache-cache-headers.conf`

### Apache Cache Header Snippet

Use the file `deploy/apache-cache-headers.conf` and include it in your vhost config, or copy its content into a `.htaccess` file in the deployment root (if `AllowOverride FileInfo`/`AllowOverride All` is enabled).

A ready-to-copy `.htaccess` template is also available in the project root.

Example vhost include:

```apache
Include /path/to/start-movingcap/deploy/apache-cache-headers.conf
```

Example Apache folder layout:

```text
/var/www/html/start/
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
