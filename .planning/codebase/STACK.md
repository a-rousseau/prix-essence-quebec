---
generated: 2026-04-10
focus: tech
---

# Technology Stack

## Languages

**Primary:**
- TypeScript ~5.9.3 — all source files in `src/` (`.ts`, `.tsx`)

**Secondary:**
- CSS — `src/index.css` (Tailwind utility classes + custom component styles)

## Runtime

**Environment:**
- Browser (no SSR; fully client-side SPA)
- Node.js — used only for build tooling and Netlify Functions

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.2.4 — UI framework; used via JSX (`react-jsx` transform), React 19 strict mode enabled in `src/main.tsx`
- react-dom 19.2.3 — DOM renderer

**Mapping:**
- Leaflet 1.9.4 — core map engine; used directly via imperative API in `src/components/Map.tsx`
- react-leaflet 5.0.0 — React wrapper for Leaflet (`MapContainer`, `TileLayer`, `ZoomControl`, `useMap`)
- leaflet.markercluster 1.5.3 — marker clustering; called imperatively via `L.markerClusterGroup()`

**Styling:**
- Tailwind CSS 4.2.2 — utility-first CSS; integrated via `@tailwindcss/vite` Vite plugin (no `tailwind.config.js` — v4 config-free mode)

**PWA:**
- vite-plugin-pwa 1.2.0 — service worker generation; configured in `vite.config.ts` with Workbox runtime caching rules for the GeoJSON data source and OSM tiles
- workbox-window 7.4.0 — client-side Workbox integration

**Serverless Functions:**
- @netlify/functions 5.1.5 — Netlify Functions SDK (present as dependency; no function files found in `src/` — likely used via `netlify/` directory or not yet implemented)

## Build Tools

**Bundler:**
- Vite 7.3.1 — dev server and production bundler
- Config: `vite.config.ts`
- Manual chunk splitting: `vendor-map` (leaflet stack) and `react` (react + react-dom)
- Build command: `tsc -b && vite build`
- Output: `dist/`

**Vite Plugins:**
- `@vitejs/plugin-react` 4.7.0 — Babel-based React Fast Refresh
- `@tailwindcss/vite` 4.2.2 — Tailwind CSS v4 integration
- `vite-plugin-pwa` 1.2.0 — service worker and web manifest generation
- `@netlify/vite-plugin` 2.11.2 — Netlify dev server proxy (`netlify dev` wraps `vite dev` at port 8888 → 5173)

**TypeScript:**
- `tsc -b` (project references build) using `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `noEmit: true` — TypeScript is type-check only; Vite handles transpilation

## TypeScript Configuration

Configured in `tsconfig.app.json` (for `src/`) and `tsconfig.node.json` (for `vite.config.ts`):

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

**Linting:**
- eslint 9.39.4 — flat config format (`eslint.config.js`)
- @eslint/js 9.39.4 — base JS rules
- typescript-eslint 8.57.0 — TypeScript-aware lint rules
- eslint-plugin-react-hooks 7.0.1 — hooks rules (exhaustive-deps, etc.)
- eslint-plugin-react-refresh 0.5.2 — validates React Refresh compatibility
- globals 17.4.0 — browser globals for ESLint config
- Lint command: `npm run lint`

**No test runner detected** — no test files, no jest/vitest config found.

## Deployment

- Platform: Netlify
- Config: `netlify.toml`
- Publish dir: `dist/`
- Dev port: 8888 (Netlify CLI) → proxied to Vite at 5173
