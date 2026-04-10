# Prix Essence Québec

## What This Is

A mobile-first Progressive Web App that displays real-time gas prices across Quebec, pulling data from the Régie de l'énergie du Québec. Users can browse an interactive map of gas stations, filter by fuel type and brand, and find the cheapest nearby prices. The app is entirely public — no accounts, no login.

## Core Value

The map shows you where to find the cheapest gas near you, right now.

## Requirements

### Validated

- ✓ Interactive Leaflet map with clustered, color-coded price markers — existing
- ✓ Real-time station data fetched from regieessencequebec.ca (GeoJSON, 30-min cache) — existing
- ✓ Filter by fuel type (régulier, super, diesel) — mutually exclusive selection — existing
- ✓ Filter by brand (multi-select dropdown) — existing
- ✓ Price stats bar (global and viewport min/max prices) — existing
- ✓ Geocoding search bar (Photon API) — existing
- ✓ Hamburger menu with privacy notice, trademarks, cookie settings — existing
- ✓ Ad consent banner (Loi 25 / GDPR compliant) — existing
- ✓ PWA with offline tile caching and GeoJSON NetworkFirst caching — existing
- ✓ Mobile-first responsive layout — existing

### Active

- [ ] Brand dropdown closes when user clicks outside it
- [ ] Brand dropdown does not overlap the price stats bar on mobile
- [ ] Hamburger menu slides in from the left (non-full-width drawer, ease-in-out transition)
- [ ] Hamburger menu slides back out on close with the same transition
- [ ] A dark overlay + spinner appears on screen when a filter change is applied (fuel type or brand)
- [ ] AdSense placement strategy documented — where ads appear, density rules, consent gating approach

### Out of Scope

- User accounts / favorites sync across devices — no backend, app is stateless by design
- Server-side rendering — SPA architecture is established
- Price history or trend charts — data source is current-state only
- Native mobile app (iOS/Android) — PWA covers the mobile use case

## Context

- Stack: React 19 + TypeScript, Vite, Tailwind CSS v4, Leaflet + react-leaflet, leaflet.markercluster, vite-plugin-pwa
- Deployed on Netlify; one serverless function (`stations.mts`) exists but is currently unused (frontend fetches GeoJSON directly)
- All UI copy is in French (fr-CA)
- AdSense is wired up but gated behind Loi 25 consent; publisher ID is in `index.html`, slot ID is hard-coded in `Map.tsx`
- Codebase map: `.planning/codebase/` (generated 2026-04-10)
- Known issues per codebase map: dead code (`FilterButton.tsx`, unused `regions`/`showFavoritesOnly` fields, `ajv` dep), O(n²) tooltip collision loop, zero automated tests

## Constraints

- **Tech stack**: React + Leaflet + Tailwind v4 — no new UI frameworks
- **No accounts**: App must remain entirely public and stateless
- **French UI**: All user-facing text stays in fr-CA
- **Mobile-first**: Every UI change must work well on small screens first

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fetch GeoJSON directly from regieessencequebec.ca | Simpler, no server cost, browser handles gzip decompression | ✓ Good |
| All state in App.tsx, no state library | App is simple enough; avoids Redux/Zustand overhead | ✓ Good |
| Tailwind v4 (no config file) | Zero-config, matches Vite plugin approach | ✓ Good |
| Spinner on every filter change (not just fetches) | User wants visual feedback even for instant JS filtering | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-10 after initialization*
