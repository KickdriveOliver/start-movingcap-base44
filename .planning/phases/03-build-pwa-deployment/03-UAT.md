---
status: complete
phase: 03-build-pwa-deployment
source: 03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md
started: 2026-03-13T11:09:47.6094210+01:00
updated: 2026-03-13T12:18:18.9182637+01:00
---

## Current Test

[testing complete]

## Tests

### 1. Hash Route Navigation Works
expected: Start the app and verify `#/`, `#/products`, `#/calculator`, and `#/product/turntrack` all render correctly and survive browser refresh.
result: pass

### 2. Subfolder Build Loads Correctly
expected: Build with `VITE_BASE_URL=/movingcap/` and serve the `dist` folder from that subpath; the app loads assets and routes correctly from `/movingcap/`.
result: pass

### 3. PWA Artifacts Generated in Build
expected: After `npm run build`, `dist/manifest.webmanifest` and `dist/sw.js` exist, and `dist/index.html` references PWA registration output.
result: pass

### 4. Offline Indicator Reacts to Network State
expected: In the running app, switching browser network offline shows the offline indicator; restoring network hides it again.
result: pass

### 5. README Deployment Steps Are Executable
expected: Following README commands for dev/build/preview and base-url examples works as documented without missing required steps.
result: pass

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
