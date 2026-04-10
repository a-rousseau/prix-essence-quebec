---
generated: 2026-04-10
focus: arch
---

# Architecture

**Analysis Date:** 2026-04-10

## Pattern Overview

**Overall:** Single-page application (SPA) with a Netlify serverless backend function. The frontend is a React/TypeScript app centered on an interactive map; the backend is a single edge function that proxies and parses data from an external government source.

**Key Characteristics:**
- All application state lives in `App.tsx` (root component); no global state library
- Data flows top-down via props from `App` → child components
- The map layer (`Map.tsx`) manages its own Leaflet imperative state internally via `useEffect` and refs
- A custom React hook (`useStations`) encapsulates all data fetching and caching logic
- Filtering is a pure function applied in `App.tsx` before passing data to display components

## Layers

**Serverless API:**
- Purpose: Fetch, parse, and serve gas station data from regieessencequebec.ca
- Location: `netlify/functions/stations.mts`
- Contains: HTTP handler, XLSX parsing, response shaping
- Depends on: External government site (`regieessencequebec.ca`), `xlsx` npm package
- Used by: `useStations` hook (note: hook now fetches GeoJSON directly, bypassing this function)

**Data Fetching / Cache Hook:**
- Purpose: Fetch station GeoJSON, parse it, manage 30-minute localStorage cache, expose refresh
- Location: `src/hooks/useStations.ts`
- Contains: Fetch logic, GeoJSON → `Station[]` parsing, cache read/write, cancellation token
- Depends on: `src/lib/cache.ts`, `src/lib/parsePrice.ts`, `src/types/station.ts`
- Used by: `src/App.tsx`

**Application Root:**
- Purpose: Own all top-level UI state; orchestrate data → filter → display pipeline
- Location: `src/App.tsx`
- Contains: Filter state, modal visibility flags, ad consent logic, layout
- Depends on: `useStations`, `filterStations`, all components, `FilterState` type
- Used by: `src/main.tsx`

**Map Layer:**
- Purpose: Render interactive Leaflet map with clustered, color-coded markers and expandable station cards
- Location: `src/components/Map.tsx`
- Contains: `MapContainer`, `ClusterLayer`, `LocateControl`, `MapController`, tooltip/card HTML generation, tooltip collision-resolution algorithm
- Depends on: `leaflet`, `react-leaflet`, `leaflet.markercluster`, `src/lib/brandLogos.ts`, `src/lib/clusterIcon.ts`
- Used by: `src/App.tsx`

**UI Components:**
- Purpose: Self-contained display and control widgets
- Location: `src/components/`
- Contains: `FilterPanel`, `FuelTypeBadges`, `BrandDropdown`, `PriceStatsBar`, `SearchBar`, `HamburgerMenu`, `ConsentBanner`, `PrivacyNotice`, `TrademarkNotice`, `LoadingSpinner`
- Depends on: `src/types/`, `src/hooks/useMapStats.ts`, `leaflet` (SearchBar, PriceStatsBar)
- Used by: `src/App.tsx`

**Utility Library:**
- Purpose: Stateless helper functions and lookup tables
- Location: `src/lib/`
- Contains: `filterUtils.ts` (pure filter function), `cache.ts` (localStorage TTL cache), `brandLogos.ts` (brand name → logo path), `clusterIcon.ts` (Leaflet cluster icon factory), `parsePrice.ts` (string → number), `adConsent.ts` (GDPR-style consent management)
- Depends on: `src/types/`
- Used by: hooks and components

**Type Definitions:**
- Purpose: Shared TypeScript interfaces
- Location: `src/types/`
- Contains: `Station`, `StationsApiResponse`, GeoJSON raw types (`GeoJsonResponse`, etc.), `FilterState`
- Depends on: nothing
- Used by: all layers

## Data Flow

**Station Data Load:**

1. `App.tsx` mounts → calls `useStations()` hook
2. Hook checks `localStorage` cache (`src/lib/cache.ts`) — returns immediately if fresh (< 30 min)
3. On cache miss: `fetch('https://regieessencequebec.ca/stations.geojson.gz')` — browser auto-decompresses gzip
4. If `metadata.generated_at` matches stale cache timestamp, TTL is refreshed without re-parsing
5. Otherwise: `parseGeoJson()` converts `GeoJsonFeature[]` → `Station[]`, stores to cache
6. Hook sets `stations` state; `App.tsx` receives it

**Filter Pipeline:**

1. `filterState` (fuel type + company allowlist) lives in `App.tsx` state
2. `useEffect` in `App.tsx` calls `filterStations(stations, filterState)` on every change — pure function in `src/lib/filterUtils.ts`
3. `filteredStations` passed as prop to `<Map>` and `<PriceStatsBar>`
4. Company allowlist is initialized once from live station data (via `brandsInitializedRef` guard)

**Map Rendering:**

1. `<Map>` receives `filteredStations` and `selectedFuelType`
2. `ClusterLayer` (inside `Map`) runs a `useEffect` on every station/fuelType change: destroys old `markerClusterGroup`, rebuilds all `L.circleMarker` instances
3. Marker color is determined by tertile thresholds computed from the current station set
4. On click, station card HTML is generated via `createStationCard()` and injected as a Leaflet permanent tooltip
5. Overlapping tooltips are resolved by an iterative push-apart algorithm using CSS `transform` + SVG connectors

**Price Stats:**

1. `<PriceStatsBar>` receives `filteredStations`
2. `useMapStats` hook computes global min/max via `useMemo`
3. `PriceStatsBar` also computes visible-viewport min using `map.getBounds()` on a trailing 200 ms throttle

**Ad Consent:**

1. On module load, `adConsent.ts` reads `localStorage` — if already accepted, injects AdSense script immediately
2. If consent is `null`, `ConsentBanner` is shown
3. User action stores consent with 6-month expiry (Loi 25 compliant)

## Key Abstractions

**`Station` interface:**
- Purpose: Normalized in-memory representation of a gas station
- Definition: `src/types/station.ts`
- Fields: `nom`, `banniere`, `adresse`, `region`, `codePostal`, `lat`, `lng`, `prixRegulier | null`, `prixSuper | null`, `prixDiesel | null`

**`FilterState` interface:**
- Purpose: All active filter criteria
- Definition: `src/types/filter.ts`
- Fields: `selectedFuelType` (mutually exclusive), `companies` (allowlist array), `regions`, `showFavoritesOnly`

**`filterStations()` pure function:**
- Purpose: Apply `FilterState` to `Station[]`, return matching subset
- Location: `src/lib/filterUtils.ts`
- Pattern: Pure function — no side effects, easily testable

**`useStations()` hook:**
- Purpose: Single source of truth for station data, loading, error, and cache
- Location: `src/hooks/useStations.ts`
- Returns: `{ stations, loading, error, lastUpdated, refresh }`

## Entry Points

**Browser Entry:**
- Location: `src/main.tsx`
- Triggers: Browser load of `index.html`
- Responsibilities: Mount React root into `#root` div with `StrictMode`

**App Component:**
- Location: `src/App.tsx`
- Triggers: React render tree
- Responsibilities: All state management, data orchestration, layout, conditional rendering of modals

**API Endpoint:**
- Location: `netlify/functions/stations.mts`
- Triggers: HTTP GET `/api/stations`
- Responsibilities: Scrape `regieessencequebec.ca`, parse XLSX, return JSON — currently not used by the frontend (frontend fetches GeoJSON directly)

## Error Handling

**Strategy:** Errors surface as dismissible inline banners; no error boundaries used.

**Patterns:**
- `useStations` catches fetch errors and sets `error: string | null` state
- `App.tsx` renders error banner when `error !== dismissedError`; user can dismiss per-error
- `cache.ts` wraps all `localStorage` calls in try/catch, silently degrades
- `adConsent.ts` wraps localStorage in try/catch, falls back to `null` consent state
- Geolocation errors in `Map.tsx` render inline HTML error notices with instructional text

## Cross-Cutting Concerns

**Logging:** None — no logging framework; errors are caught and surfaced to UI or silently ignored
**Validation:** Input sanitization via `esc()` helper in `Map.tsx` for all HTML injected into Leaflet tooltips; `parsePrice()` in `src/lib/parsePrice.ts` normalizes price strings
**Authentication:** None — entirely public, no user accounts
**Localization:** French (fr-CA) throughout; `toLocaleTimeString('fr-CA')` for time display; UI copy hardcoded in French
**PWA / Offline:** Service worker registered via `vite-plugin-pwa`; GeoJSON cached with NetworkFirst (10 s timeout, 30 min expiry); OSM tiles cached CacheFirst (500 entries, 30 days)

---

*Architecture analysis: 2026-04-10*
