<!-- GSD:project-start source:PROJECT.md -->
## Project

**Prix Essence Québec**

A mobile-first Progressive Web App that displays real-time gas prices across Quebec, pulling data from the Régie de l'énergie du Québec. Users can browse an interactive map of gas stations, filter by fuel type and brand, and find the cheapest nearby prices. The app is entirely public — no accounts, no login.

**Core Value:** The map shows you where to find the cheapest gas near you, right now.

### Constraints

- **Tech stack**: React + Leaflet + Tailwind v4 — no new UI frameworks
- **No accounts**: App must remain entirely public and stateless
- **French UI**: All user-facing text stays in fr-CA
- **Mobile-first**: Every UI change must work well on small screens first
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript ~5.9.3 — all source files in `src/` (`.ts`, `.tsx`)
- CSS — `src/index.css` (Tailwind utility classes + custom component styles)
## Runtime
- Browser (no SSR; fully client-side SPA)
- Node.js — used only for build tooling and Netlify Functions
- npm
- Lockfile: `package-lock.json` present
## Frameworks
- React 19.2.4 — UI framework; used via JSX (`react-jsx` transform), React 19 strict mode enabled in `src/main.tsx`
- react-dom 19.2.3 — DOM renderer
- Leaflet 1.9.4 — core map engine; used directly via imperative API in `src/components/Map.tsx`
- react-leaflet 5.0.0 — React wrapper for Leaflet (`MapContainer`, `TileLayer`, `ZoomControl`, `useMap`)
- leaflet.markercluster 1.5.3 — marker clustering; called imperatively via `L.markerClusterGroup()`
- Tailwind CSS 4.2.2 — utility-first CSS; integrated via `@tailwindcss/vite` Vite plugin (no `tailwind.config.js` — v4 config-free mode)
- vite-plugin-pwa 1.2.0 — service worker generation; configured in `vite.config.ts` with Workbox runtime caching rules for the GeoJSON data source and OSM tiles
- workbox-window 7.4.0 — client-side Workbox integration
- @netlify/functions 5.1.5 — Netlify Functions SDK (present as dependency; no function files found in `src/` — likely used via `netlify/` directory or not yet implemented)
## Build Tools
- Vite 7.3.1 — dev server and production bundler
- Config: `vite.config.ts`
- Manual chunk splitting: `vendor-map` (leaflet stack) and `react` (react + react-dom)
- Build command: `tsc -b && vite build`
- Output: `dist/`
- `@vitejs/plugin-react` 4.7.0 — Babel-based React Fast Refresh
- `@tailwindcss/vite` 4.2.2 — Tailwind CSS v4 integration
- `vite-plugin-pwa` 1.2.0 — service worker and web manifest generation
- `@netlify/vite-plugin` 2.11.2 — Netlify dev server proxy (`netlify dev` wraps `vite dev` at port 8888 → 5173)
- `tsc -b` (project references build) using `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `noEmit: true` — TypeScript is type-check only; Vite handles transpilation
## TypeScript Configuration
- `target`: ES2023
- `module`: ESNext, `moduleResolution`: bundler
- `jsx`: react-jsx (no React import needed in JSX files)
- `strict`: true
- `noUnusedLocals`: true
- `noUnusedParameters`: true
- `verbatimModuleSyntax`: true — enforces `import type` for type-only imports
- `erasableSyntaxOnly`: true — disallows enums, namespaces, decorators
- `noUncheckedSideEffectImports`: true
- `allowImportingTsExtensions`: true
## Icons
- lucide-react 1.7.0 — tree-shakeable icon components; `Menu`, `Search`, `X` used in `src/App.tsx` and `src/components/SearchBar.tsx`
## Data Parsing
- ajv 8.18.0 — JSON schema validation (present in dependencies; not found in active use in source files explored)
- xlsx 0.18.5 — Excel parsing (present in dependencies; referenced in GeoJSON metadata as `excel_url`; not found in active use in source files explored)
## Dev Dependencies
- eslint 9.39.4 — flat config format (`eslint.config.js`)
- @eslint/js 9.39.4 — base JS rules
- typescript-eslint 8.57.0 — TypeScript-aware lint rules
- eslint-plugin-react-hooks 7.0.1 — hooks rules (exhaustive-deps, etc.)
- eslint-plugin-react-refresh 0.5.2 — validates React Refresh compatibility
- globals 17.4.0 — browser globals for ESLint config
- Lint command: `npm run lint`
## Deployment
- Platform: Netlify
- Config: `netlify.toml`
- Publish dir: `dist/`
- Dev port: 8888 (Netlify CLI) → proxied to Vite at 5173
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- React components: PascalCase matching the exported function name (e.g., `FilterPanel.tsx`, `BrandDropdown.tsx`)
- Hooks: camelCase prefixed with `use` (e.g., `useStations.ts`, `useMapStats.ts`)
- Utilities/libraries: camelCase (e.g., `filterUtils.ts`, `brandLogos.ts`, `parsePrice.ts`, `clusterIcon.ts`, `adConsent.ts`, `cache.ts`)
- Type definition files: camelCase (e.g., `station.ts`, `filter.ts`)
- `src/components/` — React UI components (PascalCase files)
- `src/hooks/` — Custom React hooks (camelCase files)
- `src/lib/` — Pure utility/helper modules (camelCase files)
- `src/types/` — TypeScript interface/type definitions (camelCase files)
- Exported React components: PascalCase (`export function FilterPanel`, `export function Map`)
- Hooks: camelCase prefixed with `use` (`export function useStations`)
- Utility functions: camelCase (`export function filterStations`, `export function getBrandLogo`, `export function parsePrice`)
- Private/internal helpers: camelCase (`function parseGeoJson`, `function normalize`, `function fmt`, `function esc`)
- Event handlers: `handle` prefix for component-level handlers (`handleConsent`, `handleSelectFuel`, `handleBrandsChange`), `on` prefix for prop callbacks (`onFilterChange`, `onMapReady`, `onRefresh`)
- camelCase throughout (`filterState`, `selectedFuelType`, `availableBrands`, `lastUpdated`)
- Boolean flags: descriptive adjectives or `is`/`show` prefix (`loading`, `showBanner`, `showMenu`, `allSelected`, `isExpanding`)
- Refs: `Ref` suffix (`debounceRef`, `controllerRef`, `brandsInitializedRef`, `throttleRef`)
- Constants defined at module scope: SCREAMING_SNAKE_CASE for true constants (`CACHE_KEY`, `CACHE_TTL_MS`, `TOOLTIP_OPTIONS`, `CLUSTER_GROUP_OPTIONS`, `PRICE_COLORS`)
- PascalCase with `interface` keyword (preferred over `type` aliases for object shapes)
- Props interfaces: ComponentName + `Props` suffix (`FilterPanelProps`, `BrandDropdownProps`, `StatItemProps`)
- Result interfaces: descriptive name + `Result` suffix (`UseStationsResult`, `MapStats`)
- Never use `type` for object shapes — `interface` is universal across the codebase
- Union type literals used for constrained string values: `'regulier' | 'super' | 'diesel' | null`
## Code Style
- No Prettier config detected — formatting is implicit via TypeScript strict mode + ESLint
- 2-space indentation throughout
- Single quotes for strings in TypeScript/TSX
- Trailing commas in multi-line arrays/objects
- No semicolons required at statement end (TSX files omit them, `.ts` files include them — not enforced consistently)
- Template literals preferred for string interpolation
- ESLint 9 with flat config (`eslint.config.js`)
- Rules applied: `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Applies to `**/*.{ts,tsx}` only
- `dist/` is globally ignored
- Strict mode enabled (`"strict": true`)
- `noUnusedLocals: true`, `noUnusedParameters: true` — no dead variables allowed
- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `noFallthroughCasesInSwitch: true`
- `erasableSyntaxOnly: true`
- Target: ES2023, module resolution: `bundler`
- `import type` is used consistently for type-only imports: `import type { Station } from '../types/station'`
## Import Organization
- None configured — all internal imports use relative paths (`'../types/station'`, `'./lib/cache'`, `'./components/Map'`)
- Named exports preferred; default export used only for the root `App` component
- `import type` enforced by `verbatimModuleSyntax` for type-only imports
## Props Passing
- Props interfaces always explicitly defined before the component function
- Destructured directly in the function signature: `function FilterPanel({ filterState, onFilterChange, stations }: FilterPanelProps)`
- Callbacks lifted to parent via `on*` props; local event handlers named `handle*`
## Error Handling
- `try/catch` with empty `catch {}` blocks for non-critical failures (localStorage, clipboard): appropriate silent failures
- Error state via `useState<string | null>(null)` returned from hooks and displayed in UI
- `err instanceof Error ? err.message : 'Erreur inconnue'` pattern for safe error message extraction
- Network errors surface as French-language user-facing strings (all UI copy is in French)
- Async cancellation via `cancelled` boolean flag in `useEffect` cleanup (see `useStations.ts`)
- AbortController used for in-flight fetch cancellation (see `SearchBar.tsx`)
## Logging
- No `console.log/warn/error` calls anywhere in `src/` (verified by grep)
- Errors are surfaced via React state, not logged to console
## Comments
- Single-line `//` comments explain non-obvious logic or performance decisions
- Inline comments document why (not what): `// Browser auto-decompresses gzip via Content-Encoding header`
- Section separators use `// ──` dashes for visually grouping long blocks inside functions (see `Map.tsx`)
- Comment constants that document intent: `const EXPECTED_CARD_HEIGHT = 345 // px — expected expanded station card height for flyTo pre-offset`
## Function Design
- Hooks return a typed result object (`UseStationsResult`, `MapStats`)
- Utility functions return `T | null` for nullable results (`parsePrice`, `getCached`, `getBrandLogo`)
- React components return JSX or `null` (for render-nothing hooks like `ClusterLayer`, `LocateControl`)
## Module Design
- Named exports for everything except `App.tsx` (default export)
- No barrel `index.ts` files — imports go directly to the source file
## Inline Styles
- Inline `style` props used for dynamic or platform-specific values that cannot be expressed in Tailwind (CSS env variables, `safe-area-inset-*`, dynamic pixel calculations)
- Module-level constants used for reused inline style objects to avoid object recreation on each render:
- Tailwind CSS v4 used for all other styling via utility classes
## Tailwind Usage
- Tailwind v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed)
- Utility classes composed directly on JSX elements
- Conditional classes via template literals: `` `px-3 py-1.5 rounded-md ${active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}` ``
- No `clsx` or `classnames` library — plain template literals used
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- All application state lives in `App.tsx` (root component); no global state library
- Data flows top-down via props from `App` → child components
- The map layer (`Map.tsx`) manages its own Leaflet imperative state internally via `useEffect` and refs
- A custom React hook (`useStations`) encapsulates all data fetching and caching logic
- Filtering is a pure function applied in `App.tsx` before passing data to display components
## Layers
- Purpose: Fetch, parse, and serve gas station data from regieessencequebec.ca
- Location: `netlify/functions/stations.mts`
- Contains: HTTP handler, XLSX parsing, response shaping
- Depends on: External government site (`regieessencequebec.ca`), `xlsx` npm package
- Used by: `useStations` hook (note: hook now fetches GeoJSON directly, bypassing this function)
- Purpose: Fetch station GeoJSON, parse it, manage 30-minute localStorage cache, expose refresh
- Location: `src/hooks/useStations.ts`
- Contains: Fetch logic, GeoJSON → `Station[]` parsing, cache read/write, cancellation token
- Depends on: `src/lib/cache.ts`, `src/lib/parsePrice.ts`, `src/types/station.ts`
- Used by: `src/App.tsx`
- Purpose: Own all top-level UI state; orchestrate data → filter → display pipeline
- Location: `src/App.tsx`
- Contains: Filter state, modal visibility flags, ad consent logic, layout
- Depends on: `useStations`, `filterStations`, all components, `FilterState` type
- Used by: `src/main.tsx`
- Purpose: Render interactive Leaflet map with clustered, color-coded markers and expandable station cards
- Location: `src/components/Map.tsx`
- Contains: `MapContainer`, `ClusterLayer`, `LocateControl`, `MapController`, tooltip/card HTML generation, tooltip collision-resolution algorithm
- Depends on: `leaflet`, `react-leaflet`, `leaflet.markercluster`, `src/lib/brandLogos.ts`, `src/lib/clusterIcon.ts`
- Used by: `src/App.tsx`
- Purpose: Self-contained display and control widgets
- Location: `src/components/`
- Contains: `FilterPanel`, `FuelTypeBadges`, `BrandDropdown`, `PriceStatsBar`, `SearchBar`, `HamburgerMenu`, `ConsentBanner`, `PrivacyNotice`, `TrademarkNotice`, `LoadingSpinner`
- Depends on: `src/types/`, `src/hooks/useMapStats.ts`, `leaflet` (SearchBar, PriceStatsBar)
- Used by: `src/App.tsx`
- Purpose: Stateless helper functions and lookup tables
- Location: `src/lib/`
- Contains: `filterUtils.ts` (pure filter function), `cache.ts` (localStorage TTL cache), `brandLogos.ts` (brand name → logo path), `clusterIcon.ts` (Leaflet cluster icon factory), `parsePrice.ts` (string → number), `adConsent.ts` (GDPR-style consent management)
- Depends on: `src/types/`
- Used by: hooks and components
- Purpose: Shared TypeScript interfaces
- Location: `src/types/`
- Contains: `Station`, `StationsApiResponse`, GeoJSON raw types (`GeoJsonResponse`, etc.), `FilterState`
- Depends on: nothing
- Used by: all layers
## Data Flow
## Key Abstractions
- Purpose: Normalized in-memory representation of a gas station
- Definition: `src/types/station.ts`
- Fields: `nom`, `banniere`, `adresse`, `region`, `codePostal`, `lat`, `lng`, `prixRegulier | null`, `prixSuper | null`, `prixDiesel | null`
- Purpose: All active filter criteria
- Definition: `src/types/filter.ts`
- Fields: `selectedFuelType` (mutually exclusive), `companies` (allowlist array), `regions`, `showFavoritesOnly`
- Purpose: Apply `FilterState` to `Station[]`, return matching subset
- Location: `src/lib/filterUtils.ts`
- Pattern: Pure function — no side effects, easily testable
- Purpose: Single source of truth for station data, loading, error, and cache
- Location: `src/hooks/useStations.ts`
- Returns: `{ stations, loading, error, lastUpdated, refresh }`
## Entry Points
- Location: `src/main.tsx`
- Triggers: Browser load of `index.html`
- Responsibilities: Mount React root into `#root` div with `StrictMode`
- Location: `src/App.tsx`
- Triggers: React render tree
- Responsibilities: All state management, data orchestration, layout, conditional rendering of modals
- Location: `netlify/functions/stations.mts`
- Triggers: HTTP GET `/api/stations`
- Responsibilities: Scrape `regieessencequebec.ca`, parse XLSX, return JSON — currently not used by the frontend (frontend fetches GeoJSON directly)
## Error Handling
- `useStations` catches fetch errors and sets `error: string | null` state
- `App.tsx` renders error banner when `error !== dismissedError`; user can dismiss per-error
- `cache.ts` wraps all `localStorage` calls in try/catch, silently degrades
- `adConsent.ts` wraps localStorage in try/catch, falls back to `null` consent state
- Geolocation errors in `Map.tsx` render inline HTML error notices with instructional text
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
