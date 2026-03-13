# Phase 2: Asset Localization & Route Restructuring - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Localize all external images (Supabase storage, fullmo.de CDN) to local assets, convert from BrowserRouter to HashRouter with path-segment-based product detail routes, and rename i18n `.json.jsx` files to `.js`. Datasheet PDF links to movingcap.de remain external. No new features or capabilities are added.

</domain>

<decisions>
## Implementation Decisions

### Image asset organization
- All images go in `public/images/` (flat folder, no subfolders)
- Naming convention: prefixed — `movingcap-turntrack.jpg`, `movingcap-maxtrack.jpg`, etc.
- Gallery images are downloaded too (e.g. `movingcap-turntrack-1.jpg` if multiple)
- Hero section Unsplash background image replaced with CSS-only gradient (no external image)
- Feature section images reuse the same localized product images (no separate copies)
- Images referenced as public URL strings (e.g. `/images/movingcap-turntrack.jpg`), NOT ES module imports

### Hash route URL design
- Clean lowercase paths: `#/products`, `#/calculator`, `#/documentation`, `#/impressum`, `#/datenschutz`
- Product detail routes use singular path: `#/product/turntrack` (all lowercase slugs)
- Case-insensitive lookup for product slugs (URL `turntrack` matches series `turnTRACK`)
- Landing page served at `#/` only — remove the `/landing` alias route
- 404/NotFound route preserved for unmatched paths

### External link handling
- Datasheet PDF links to movingcap.de stay external (PDFs are large, change over time)
- Keep generic fallback URL (`movingcap.de/MovingCap-AnwenderDoku/...`) when language-specific datasheet is missing
- Audit ALL external URLs in source — localize non-PDF assets, flag any remaining external URLs besides movingcap.de PDFs

### URL utility & file cleanup
- Remove `createPageUrl()` entirely — use direct `<Link to="/products">` path strings in components
- Convert `src/utils/index.ts` to `src/utils/index.js` (align with rest of .jsx codebase)
- Product detail links change from `createPageUrl('ProductDetail?series=turnTRACK')` to direct `<Link to="/product/turntrack">`

### Claude's Discretion
- Whether to create a small helper function for product detail URLs (e.g. `productUrl(series)`) or use inline strings — choose whatever keeps components cleanest
- How to structure the product slug mapping (lowercase id field already exists on products, can be used directly)

</decisions>

<specifics>
## Specific Ideas

- Product IDs in data already lowercase (`turntrack`, `maxtrack`, `flattrack`, etc.) — use these as URL slugs directly
- The `seriesData` array in Landing.jsx duplicates image URLs from products.jsx — after localization, both should reference the same `public/images/` paths
- The Unsplash hero image (`photo-1518124624242`) is a subtle industrial background at 30% opacity with gradient overlay — CSS-only replacement should maintain the same dark moody feel

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-asset-localization-route-restructuring*
*Context gathered: 2026-03-12*
