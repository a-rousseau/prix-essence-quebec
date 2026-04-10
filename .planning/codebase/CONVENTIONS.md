---
generated: 2026-04-10
focus: quality
---

# Coding Conventions

**Analysis Date:** 2026-04-10

## Naming Patterns

**Files:**
- React components: PascalCase matching the exported function name (e.g., `FilterPanel.tsx`, `BrandDropdown.tsx`)
- Hooks: camelCase prefixed with `use` (e.g., `useStations.ts`, `useMapStats.ts`)
- Utilities/libraries: camelCase (e.g., `filterUtils.ts`, `brandLogos.ts`, `parsePrice.ts`, `clusterIcon.ts`, `adConsent.ts`, `cache.ts`)
- Type definition files: camelCase (e.g., `station.ts`, `filter.ts`)

**Directories:**
- `src/components/` — React UI components (PascalCase files)
- `src/hooks/` — Custom React hooks (camelCase files)
- `src/lib/` — Pure utility/helper modules (camelCase files)
- `src/types/` — TypeScript interface/type definitions (camelCase files)

**Functions:**
- Exported React components: PascalCase (`export function FilterPanel`, `export function Map`)
- Hooks: camelCase prefixed with `use` (`export function useStations`)
- Utility functions: camelCase (`export function filterStations`, `export function getBrandLogo`, `export function parsePrice`)
- Private/internal helpers: camelCase (`function parseGeoJson`, `function normalize`, `function fmt`, `function esc`)
- Event handlers: `handle` prefix for component-level handlers (`handleConsent`, `handleSelectFuel`, `handleBrandsChange`), `on` prefix for prop callbacks (`onFilterChange`, `onMapReady`, `onRefresh`)

**Variables:**
- camelCase throughout (`filterState`, `selectedFuelType`, `availableBrands`, `lastUpdated`)
- Boolean flags: descriptive adjectives or `is`/`show` prefix (`loading`, `showBanner`, `showMenu`, `allSelected`, `isExpanding`)
- Refs: `Ref` suffix (`debounceRef`, `controllerRef`, `brandsInitializedRef`, `throttleRef`)
- Constants defined at module scope: SCREAMING_SNAKE_CASE for true constants (`CACHE_KEY`, `CACHE_TTL_MS`, `TOOLTIP_OPTIONS`, `CLUSTER_GROUP_OPTIONS`, `PRICE_COLORS`)

**Types/Interfaces:**
- PascalCase with `interface` keyword (preferred over `type` aliases for object shapes)
- Props interfaces: ComponentName + `Props` suffix (`FilterPanelProps`, `BrandDropdownProps`, `StatItemProps`)
- Result interfaces: descriptive name + `Result` suffix (`UseStationsResult`, `MapStats`)
- Never use `type` for object shapes — `interface` is universal across the codebase
- Union type literals used for constrained string values: `'regulier' | 'super' | 'diesel' | null`

## Code Style

**Formatting:**
- No Prettier config detected — formatting is implicit via TypeScript strict mode + ESLint
- 2-space indentation throughout
- Single quotes for strings in TypeScript/TSX
- Trailing commas in multi-line arrays/objects
- No semicolons required at statement end (TSX files omit them, `.ts` files include them — not enforced consistently)
- Template literals preferred for string interpolation

**Linting:**
- ESLint 9 with flat config (`eslint.config.js`)
- Rules applied: `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Applies to `**/*.{ts,tsx}` only
- `dist/` is globally ignored

**TypeScript:**
- Strict mode enabled (`"strict": true`)
- `noUnusedLocals: true`, `noUnusedParameters: true` — no dead variables allowed
- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `noFallthroughCasesInSwitch: true`
- `erasableSyntaxOnly: true`
- Target: ES2023, module resolution: `bundler`
- `import type` is used consistently for type-only imports: `import type { Station } from '../types/station'`

## Import Organization

**Order (as observed in practice):**
1. React and third-party library imports (`import { useState } from 'react'`, `import L from 'leaflet'`)
2. Internal type imports with `import type` (`import type { Station } from '../types/station'`)
3. Internal component imports (`import { FuelTypeBadges } from './FuelTypeBadges'`)
4. Internal hook imports (`import { useStations } from './hooks/useStations'`)
5. Internal lib/utility imports (`import { filterStations } from './lib/filterUtils'`)

**Path Aliases:**
- None configured — all internal imports use relative paths (`'../types/station'`, `'./lib/cache'`, `'./components/Map'`)

**Import style:**
- Named exports preferred; default export used only for the root `App` component
- `import type` enforced by `verbatimModuleSyntax` for type-only imports

## Props Passing

- Props interfaces always explicitly defined before the component function
- Destructured directly in the function signature: `function FilterPanel({ filterState, onFilterChange, stations }: FilterPanelProps)`
- Callbacks lifted to parent via `on*` props; local event handlers named `handle*`

## Error Handling

**Patterns:**
- `try/catch` with empty `catch {}` blocks for non-critical failures (localStorage, clipboard): appropriate silent failures
- Error state via `useState<string | null>(null)` returned from hooks and displayed in UI
- `err instanceof Error ? err.message : 'Erreur inconnue'` pattern for safe error message extraction
- Network errors surface as French-language user-facing strings (all UI copy is in French)
- Async cancellation via `cancelled` boolean flag in `useEffect` cleanup (see `useStations.ts`)
- AbortController used for in-flight fetch cancellation (see `SearchBar.tsx`)

## Logging

**Framework:** None — no logging library used.

**Patterns:**
- No `console.log/warn/error` calls anywhere in `src/` (verified by grep)
- Errors are surfaced via React state, not logged to console

## Comments

**When to Comment:**
- Single-line `//` comments explain non-obvious logic or performance decisions
- Inline comments document why (not what): `// Browser auto-decompresses gzip via Content-Encoding header`
- Section separators use `// ──` dashes for visually grouping long blocks inside functions (see `Map.tsx`)
- Comment constants that document intent: `const EXPECTED_CARD_HEIGHT = 345 // px — expected expanded station card height for flyTo pre-offset`

**JSDoc/TSDoc:** Not used — TypeScript types serve as the documentation layer.

## Function Design

**Size:** Functions are kept small and focused. Long imperative logic (e.g., `separateTooltips` in `Map.tsx`) is an acknowledged exception for complex DOM manipulation with no clean decomposition.

**Parameters:** Single object destructuring for React component props; primitive parameters for pure utility functions.

**Return Values:**
- Hooks return a typed result object (`UseStationsResult`, `MapStats`)
- Utility functions return `T | null` for nullable results (`parsePrice`, `getCached`, `getBrandLogo`)
- React components return JSX or `null` (for render-nothing hooks like `ClusterLayer`, `LocateControl`)

## Module Design

**Exports:**
- Named exports for everything except `App.tsx` (default export)
- No barrel `index.ts` files — imports go directly to the source file

**Barrel Files:** Not used. Import directly from `src/components/Map.tsx`, `src/lib/cache.ts`, etc.

## Inline Styles

- Inline `style` props used for dynamic or platform-specific values that cannot be expressed in Tailwind (CSS env variables, `safe-area-inset-*`, dynamic pixel calculations)
- Module-level constants used for reused inline style objects to avoid object recreation on each render:
  ```tsx
  const SAFE_AREA_PADDING = { paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }
  ```
- Tailwind CSS v4 used for all other styling via utility classes

## Tailwind Usage

- Tailwind v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed)
- Utility classes composed directly on JSX elements
- Conditional classes via template literals: `` `px-3 py-1.5 rounded-md ${active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}` ``
- No `clsx` or `classnames` library — plain template literals used

---

*Convention analysis: 2026-04-10*
