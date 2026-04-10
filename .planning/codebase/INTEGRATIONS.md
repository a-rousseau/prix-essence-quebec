---
generated: 2026-04-10
focus: tech
---

# External Integrations

## APIs & External Services

### Régie de l'énergie du Québec — Station Data

- **URL:** `https://regieessencequebec.ca/stations.geojson.gz`
- **Purpose:** Primary data source — all gas station names, brands, addresses, regions, coordinates, and fuel prices (regular, super, diesel)
- **Protocol:** Plain `fetch()` in `src/hooks/useStations.ts`; browser auto-decompresses gzip via `Content-Encoding` header
- **Format:** GeoJSON FeatureCollection; typed in `src/types/station.ts` as `GeoJsonResponse`
- **Auth:** None (public endpoint)
- **Update frequency:** App polls on load and on manual refresh; 30-minute client-side cache in localStorage
- **PWA caching:** `NetworkFirst` strategy, 10-second network timeout, 30-minute cache TTL (`vite.config.ts` Workbox config)
- **Preconnect hint:** `<link rel="preconnect" href="https://regieessencequebec.ca">` in `index.html`

### Photon by Komoot — Geocoding / Address Search

- **URL:** `https://photon.komoot.io/api/?lang=fr&limit=6&lat=46.8&lon=-71.2&q={query}`
- **Purpose:** Forward geocoding for the address search bar; converts user text input to lat/lng coordinates
- **Protocol:** `fetch()` in `src/components/SearchBar.tsx` with 280ms debounce and `AbortController` for in-flight cancellation
- **Format:** GeoJSON FeatureCollection with `properties` containing `name`, `street`, `housenumber`, `city`, `state`, `country`
- **Auth:** None (public endpoint)
- **Bias:** Biased toward Quebec City (`lat=46.8&lon=-71.2`), French results (`lang=fr`), max 6 results
- **Preconnect hint:** `<link rel="preconnect" href="https://photon.komoot.io">` in `index.html`

### OpenStreetMap — Map Tiles

- **URL pattern:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` (subdomains `a`, `b`, `c`)
- **Purpose:** Raster map tile rendering via Leaflet `TileLayer`
- **Protocol:** Leaflet handles tile loading; `maxZoom: 19`
- **Auth:** None (public CDN)
- **PWA caching:** `CacheFirst` strategy, max 500 entries, 30-day TTL (`vite.config.ts` Workbox config)
- **Attribution:** Displayed on map as required by OSM license
- **Preconnect hint:** `<link rel="preconnect" href="https://tile.openstreetmap.org">` in `index.html`

### Google Maps — Directions Links

- **URL pattern:** `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`
- **Purpose:** "Obtenir l'itinéraire" link in station cards opens Google Maps directions in a new tab
- **Protocol:** Static link (`<a target="_blank">`) generated in `src/components/Map.tsx` (`createStationCard`)
- **Auth:** None (public URL)

### Google AdSense — Advertising (disabled)

- **URL:** `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`
- **Purpose:** Display ads inside expanded station cards
- **Protocol:** Script injected dynamically by `src/lib/adConsent.ts` (`loadAdSense()`) only after user consent
- **Publisher ID:** Controlled by `VITE_ADSENSE_PUBLISHER_ID` env var; hardcoded account meta tag in `index.html` (`ca-pub-7169608195886569`)
- **Ad slot:** `3373913657` (configured in `src/components/Map.tsx`)
- **Status:** `ADS_ENABLED = false` in `src/lib/adConsent.ts` — ads are fully disabled at the feature-flag level
- **Consent:** GDPR/Law 25-style consent banner (`src/components/ConsentBanner.tsx`) gates ad loading; consent stored in localStorage for 180 days

## Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `VITE_ADSENSE_PUBLISHER_ID` | Google AdSense publisher ID used when loading the AdSense script | No (ads disabled) |

- Example file: `.env.example` (format: `ca-pub-xxxxxxxxxxxxxxxx`)
- Variables prefixed `VITE_` are exposed to the browser bundle via `import.meta.env`

## Browser APIs

### Geolocation API

- **Used in:** `src/components/Map.tsx` (`LocateControl` component)
- **Purpose:** Show user's location on map with a custom animated marker; auto-locates on load (browser mode) or on button tap (standalone PWA mode)
- **Strategy:** Two-step — fast low-accuracy position first (`enableHighAccuracy: false`, 5s timeout, 30s cache), then refines with high-accuracy GPS in the background (`enableHighAccuracy: true`, 15s timeout)
- **Permission:** Netlify header `Permissions-Policy: geolocation=(self)` restricts geolocation to same origin
- **Error handling:** Displays localized French error messages for `PERMISSION_DENIED`, `POSITION_UNAVAILABLE`, and `TIMEOUT` codes

### localStorage

- **Used in:** `src/lib/cache.ts`, `src/lib/adConsent.ts`
- **Station cache:** Key `prix-essence-stations` — stores parsed station data with 30-minute TTL; avoids redundant GeoJSON fetches and parses
- **Ad consent:** Key `ad-consent` — stores `{ value: 'accepted'|'refused', expiresAt: number }` with 180-day expiry (Quebec Law 25 compliance)

### Clipboard API

- **Used in:** `src/components/Map.tsx` (directions click handler)
- **Purpose:** Copies station address to clipboard when user clicks the directions link
- **Usage:** `navigator.clipboard?.writeText(s.adresse).catch(() => {})` — optional chaining, silent failure

### matchMedia API

- **Used in:** `src/components/Map.tsx` (`isStandalone()`)
- **Purpose:** Detects if app is running in PWA standalone mode (`display-mode: standalone`) to suppress auto-geolocation on load

### requestAnimationFrame

- **Used in:** `src/components/Map.tsx`
- **Purpose:** Debounces tooltip collision-resolution passes (`separateTooltips()`) and drives tooltip repositioning animation loop after station card expansion

## CDN & External Scripts

- No external CDN scripts loaded at page load
- AdSense script (`pagead2.googlesyndication.com`) is injected only after user consent and only when `ADS_ENABLED = true`
- All other dependencies are bundled by Vite at build time

## Deployment Platform

- **Netlify** — hosting, CDN, and serverless functions
- **@netlify/vite-plugin** proxies dev traffic through Netlify CLI for local parity
- **@netlify/functions** SDK is installed but no Netlify Function source files are present in the repository

## Web Manifest & PWA

- Manifest generated by `vite-plugin-pwa` in `vite.config.ts`
- App name: `Prix Essence Québec`, short name: `Essence QC`
- `display: standalone`, `orientation: portrait-primary`
- `start_url: /`, `lang: fr-CA`
- Service worker: `autoUpdate` register type — updates silently with `skipWaiting + clientsClaim`
- SW registered via `dist/registerSW.js`
