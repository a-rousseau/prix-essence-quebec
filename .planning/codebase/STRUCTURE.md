---
generated: 2026-04-10
focus: arch
---

# Codebase Structure

**Analysis Date:** 2026-04-10

## Directory Layout

```
prix-essence-quebec/
├── src/                    # All frontend application source
│   ├── App.tsx             # Root component — state, layout, orchestration
│   ├── main.tsx            # React DOM entry point
│   ├── index.css           # Global styles (Tailwind + Leaflet overrides)
│   ├── components/         # React UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Pure utility functions and stateless modules
│   └── types/              # TypeScript interface/type definitions
├── netlify/
│   └── functions/
│       └── stations.mts    # Netlify serverless function: /api/stations
├── public/
│   ├── brands/             # Brand logo images (webp, svg)
│   ├── icons/              # PWA icon sizes (192, 512)
│   ├── favicon.svg         # App favicon
│   ├── ads.txt             # AdSense ads.txt
│   └── icons.svg           # Sprite (if used)
├── dist/                   # Build output (generated, not committed)
├── docs/                   # Implementation planning docs (ways-of-work)
├── .planning/
│   └── codebase/           # GSD codebase analysis documents
├── index.html              # Vite HTML shell
├── vite.config.ts          # Vite + Tailwind + PWA + Netlify plugin config
├── netlify.toml            # Netlify build, headers, dev server config
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript project references root
├── tsconfig.app.json       # App-specific TS config
├── tsconfig.node.json      # Node/build-tool TS config
├── eslint.config.js        # ESLint flat config
└── .env.example            # Required env var template
```

## Directory Purposes

**`src/components/`:**
- Purpose: React UI components — each file exports one named component
- Contains: Map renderer, filter UI, price stats bar, search bar, modals, consent banner, loading state
- Key files:
  - `src/components/Map.tsx` — Leaflet map, cluster layer, locate control, tooltip collision engine
  - `src/components/FilterPanel.tsx` — fuel type badges + brand dropdown row
  - `src/components/FuelTypeBadges.tsx` — mutually exclusive fuel type selector
  - `src/components/BrandDropdown.tsx` — multi-select brand filter
  - `src/components/PriceStatsBar.tsx` — bottom bar with global/visible min/max prices
  - `src/components/SearchBar.tsx` — geocoding search via Photon API
  - `src/components/HamburgerMenu.tsx` — slide-in nav menu (privacy, trademarks, cookies)
  - `src/components/ConsentBanner.tsx` — GDPR/Loi 25 ad consent prompt
  - `src/components/LoadingSpinner.tsx` — full-screen loading overlay

**`src/hooks/`:**
- Purpose: Custom React hooks encapsulating stateful logic
- Contains:
  - `src/hooks/useStations.ts` — data fetch, GeoJSON parse, localStorage cache, refresh
  - `src/hooks/useMapStats.ts` — memoized min/max price computation across station array

**`src/lib/`:**
- Purpose: Pure, stateless utility modules; no React dependencies
- Contains:
  - `src/lib/filterUtils.ts` — `filterStations(stations, filterState)` pure function
  - `src/lib/cache.ts` — `localStorage` TTL cache (get/set/clear, 30-minute TTL)
  - `src/lib/brandLogos.ts` — brand name → logo path lookup with normalization cache
  - `src/lib/clusterIcon.ts` — Leaflet cluster icon factory (size scales with count)
  - `src/lib/parsePrice.ts` — price string/unknown → `number | null`
  - `src/lib/adConsent.ts` — ad consent read/write/clear + AdSense script injection

**`src/types/`:**
- Purpose: Shared TypeScript interfaces — no runtime code
- Contains:
  - `src/types/station.ts` — `Station`, `StationsApiResponse`, full GeoJSON raw types
  - `src/types/filter.ts` — `FilterState`

**`netlify/functions/`:**
- Purpose: Serverless API endpoints deployed as Netlify Functions
- Contains: `stations.mts` — scrapes `regieessencequebec.ca`, parses XLSX, returns JSON at `/api/stations`
- Note: Currently not called by the frontend (frontend fetches GeoJSON directly); retained for potential future use or caching layer

**`public/brands/`:**
- Purpose: Static brand logo assets served at `/brands/<filename>`
- Generated: No — manually curated
- Committed: Yes
- Formats: `.svg` preferred; `.webp` for complex logos

**`public/icons/`:**
- Purpose: PWA app icons
- Generated: No
- Committed: Yes

**`dist/`:**
- Purpose: Vite build output
- Generated: Yes — `npm run build`
- Committed: No (in `.gitignore`)

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React DOM mount, StrictMode wrapper
- `src/App.tsx`: Application root, all top-level state, layout
- `netlify/functions/stations.mts`: `/api/stations` HTTP handler

**Configuration:**
- `vite.config.ts`: Build plugins (React, Tailwind, PWA, Netlify), chunk splitting, Workbox rules
- `netlify.toml`: Build command, HTTP security headers, caching headers by path
- `tsconfig.app.json`: TypeScript settings for `src/`
- `eslint.config.js`: Linting rules
- `.env.example`: Documents required env vars (e.g., `VITE_ADSENSE_PUBLISHER_ID`)

**Core Logic:**
- `src/hooks/useStations.ts`: All data fetching and caching
- `src/lib/filterUtils.ts`: Station filtering
- `src/components/Map.tsx`: Entire map rendering and interaction logic

**Types:**
- `src/types/station.ts`: `Station` interface and GeoJSON types
- `src/types/filter.ts`: `FilterState` interface

## Naming Conventions

**Files:**
- Components: PascalCase matching the exported component name — `FilterPanel.tsx`, `PriceStatsBar.tsx`
- Hooks: camelCase prefixed with `use` — `useStations.ts`, `useMapStats.ts`
- Utilities: camelCase describing the module's purpose — `filterUtils.ts`, `brandLogos.ts`, `parsePrice.ts`
- Types: camelCase — `station.ts`, `filter.ts`
- Netlify functions: camelCase with `.mts` extension — `stations.mts`

**Directories:**
- Singular for type-grouping dirs: `components/`, `hooks/`, `lib/`, `types/`

## Where to Add New Code

**New UI component:**
- Implementation: `src/components/ComponentName.tsx`
- Export: named export matching filename
- Import in: `src/App.tsx` or composing component

**New custom hook:**
- Implementation: `src/hooks/useHookName.ts`
- Must follow `use` prefix convention

**New utility function:**
- If it's a pure function with no React deps: `src/lib/utilName.ts`
- If it extends an existing utility concern (e.g., more filter logic): add to `src/lib/filterUtils.ts`

**New TypeScript type/interface:**
- If related to station data: `src/types/station.ts`
- If related to filter/UI state: `src/types/filter.ts`
- If new domain: new file `src/types/newDomain.ts`

**New API endpoint:**
- Implementation: `netlify/functions/endpointName.mts`
- Accessible at `/api/endpointName`
- Must export `default` async handler and optional `config` with `path`

**New brand logo:**
- Add image to `public/brands/`
- Register the mapping in `src/lib/brandLogos.ts` in the `BRAND_LOGOS` record

## Special Directories

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents (ARCHITECTURE.md, STRUCTURE.md, etc.)
- Generated: By GSD mapping agents
- Committed: Yes

**`docs/ways-of-work/`:**
- Purpose: Human-authored implementation planning and design notes
- Generated: No
- Committed: Yes

**`.netlify/`:**
- Purpose: Netlify CLI local dev cache and compiled function bundles
- Generated: Yes
- Committed: No (should be in `.gitignore`)

---

*Structure analysis: 2026-04-10*
