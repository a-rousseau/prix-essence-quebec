---
generated: 2026-04-10
focus: concerns
---

# Technical Concerns

**Analysis Date:** 2026-04-10

## Dead Code / Unused Items

- **`src/types/filter.ts`** — `regions` and `showFavoritesOnly` fields defined in `FilterState` but never used anywhere in the app
- **`src/components/FilterButton.tsx`** — component file exists but is not imported by any other file
- **`package.json`** — `ajv` listed as a dependency but never imported anywhere in `src/`
- **`netlify/functions/stations.mts`** — likely vestigial; client now fetches GeoJSON directly from `regieessencequebec.ca` rather than calling `/api/stations`. The function uses the archived `xlsx` package to parse Excel, duplicates `parsePrice` logic from `src/lib/parsePrice.ts`, and has no callers in the frontend

## Performance Concerns

- **`src/components/Map.tsx:134-397`** — entire `markerClusterGroup` is torn down and rebuilt from scratch on every fuel type change (no marker diffing). On large datasets this is O(n) DOM destruction + recreation
- **`src/components/Map.tsx:176-295`** — O(n²) tooltip collision-resolution loop runs on every `moveend` and `zoomend` map event. May degrade on dense views with many open tooltips
- **`src/components/FilterPanel.tsx:13`** — `availableBrands` is computed inline without `useMemo`, causing recomputation on every render
- **`dist/assets/vendor-map-*.js`** — 196 KB uncompressed Leaflet/cluster bundle loaded eagerly; no lazy loading for the map chunk

## Security Concerns

- **`src/components/Map.tsx`** — custom `esc()` helper is used to sanitize HTML injected into Leaflet tooltips, but it does not escape single quotes — potential attribute injection vector if tooltip content includes single-quoted attributes
- **`src/components/Map.tsx:422`** — geolocation error display uses direct DOM HTML assignment with no sanitization (error strings come from the browser Geolocation API, which is controlled, but pattern is fragile)
- **`netlify.toml:47`** — `Access-Control-Allow-Origin: *` applied to all `/api/*` routes — overly permissive CORS for an API that may eventually handle non-public endpoints
- **`index.html:13`** — AdSense publisher ID hard-coded in HTML rather than injected from env at build time

## Configuration / Hard-coded Values

- **`src/components/Map.tsx:97`** — AdSense slot ID `3373913657` hard-coded in component instead of via env var
- **`src/lib/adConsent.ts:2`** — `ADS_ENABLED = false` constant but publisher ID is still present in `index.html:13` — inconsistent ad toggle mechanism
- **`src/components/Map.tsx:56`** — magic constant `EXPECTED_CARD_HEIGHT = 345` with a comment explaining it; value must be manually kept in sync with actual rendered card height

## Dependency Risks

- **`xlsx` (`package.json`)** — last published 2023, project archived on npm. Should be removed once `netlify/functions/stations.mts` is confirmed vestigial, or replaced with an actively maintained alternative if the function is kept

## Accessibility Gaps

- **Map markers** — Leaflet `circleMarker` elements have no `tabindex` or `keydown` handlers; the map is not keyboard-navigable
- **`src/components/FuelTypeBadges.tsx`** — fuel type toggle buttons are missing `aria-pressed` attribute
- **`src/components/BrandDropdown.tsx`** — checkbox list is missing a `<fieldset>`/`<legend>` wrapper for screen reader grouping
- **`src/components/Map.tsx:411-433`** — imperatively-created error toasts lack `role="alert"` so screen readers won't announce them

## Missing Error Handling

- **`src/hooks/useStations.ts`** — malformed GeoJSON silently produces an empty station list with no shape validation or user-facing error. A schema mismatch upstream would be invisible to users
- **`src/components/SearchBar.tsx:77-79`** — geocoding errors are fully swallowed with no user feedback; failed searches show nothing

## Testing Gap

- Zero automated tests in the project. See `TESTING.md` for full analysis and recommended approach (Vitest + co-located unit tests for pure functions in `src/lib/`)

---

*Concerns analysis: 2026-04-10*
