# Prix Essence Québec

## What This Is

A mobile-first Progressive Web App that displays real-time gas prices across Quebec, pulling data from the Régie de l'énergie du Québec. Users can browse an interactive map of gas stations, filter by fuel type and brand, and find the cheapest nearby prices. The app is entirely public — no accounts, no login. UI interactions are polished: animated side drawer, filter overlay feedback, and consent-ready ad infrastructure.

## Core Value

The map shows you where to find the cheapest gas near you, right now.

## Current Milestone: v1.1 Favorites, Geolocation & Revenue

**Goal:** Ship user-facing station favorites and improved geolocation, activate AdSense revenue, and close v1.0 accessibility gaps.

**Target features:**
- Favorites — save/unsave stations to localStorage, visible on map
- Better geolocation — auto-center on load, accuracy ring, clear errors
- AdSense implementation — activate slot 3373913657, consent-gated
- Accessibility — aria-pressed on fuel toggles, fieldset/legend on brand list, keyboard nav for map markers

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
- ✓ Brand dropdown closes when user clicks outside it — v1.0
- ✓ Brand dropdown does not overlap the price stats bar on mobile — v1.0
- ✓ Hamburger menu slides in from the left (non-full-width drawer, ease-in-out transition) — v1.0
- ✓ Hamburger menu slides back out on close with the same transition — v1.0
- ✓ Dark backdrop covers the map while drawer is open; tapping it closes the drawer — v1.0
- ✓ A dark overlay + spinner appears on screen when a filter change is applied — v1.0
- ✓ Overlay disappears once filtered results are rendered to the map — v1.0
- ✓ PrivacyNotice and TrademarkNotice open/close with smooth bottom-sheet slide animation — v1.0
- ✓ AdSense placement strategy documented (zone table, density policy, consent gating) — v1.0

### Active (v1.1)

- [ ] Favorites — save/unsave stations to localStorage, visible on map
- [ ] Better geolocation — auto-center on load, accuracy ring, clear errors
- [ ] Implement AdSense ad units in code (slot 3373913657 — strategy is in `.planning/ADS-STRATEGY.md`)
- [ ] Keyboard accessibility for map markers
- [ ] `aria-pressed` on fuel type toggles
- [ ] `fieldset`/`legend` wrapper on brand checkbox list

### Out of Scope

- User accounts / favorites sync across devices — no backend, app is stateless by design
- Server-side rendering — SPA architecture is established
- Price history or trend charts — data source is current-state only
- Native mobile app (iOS/Android) — PWA covers the mobile use case
- AdSense code implementation in v1.0 — placement strategy ships first, ad units in next milestone

## Context

- Stack: React 19 + TypeScript, Vite, Tailwind CSS v4, Leaflet + react-leaflet, leaflet.markercluster, vite-plugin-pwa
- Deployed on Netlify; one serverless function (`stations.mts`) exists but is currently unused (frontend fetches GeoJSON directly)
- All UI copy is in French (fr-CA)
- AdSense: publisher ID in `index.html`, slot 3373913657 wired in `Map.tsx`, gated by `ADS_ENABLED` via `adConsent.ts`; `ADS-STRATEGY.md` documents activation checklist
- Shipped v1.0 with ~1,943 TypeScript LOC, 123 commits over 17 days
- Always-mounted CSS toggle pattern (translate/opacity) now established for all drawers/modals — reuse for future UI work
- Known tech debt: `FilterButton.tsx` dead code, unused `regions`/`showFavoritesOnly` filter fields, `ajv` unused dep, O(n²) tooltip collision loop, zero automated tests, `Map.tsx` react-hooks/exhaustive-deps warning (pre-existing)
- Codebase map: `.planning/codebase/` (generated 2026-04-10)

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
| Spinner on every filter change (not just fetches) | User wants visual feedback even for instant JS filtering | ✓ Good — shipped in Phase 03 |
| Always-mounted CSS toggle pattern for all drawers/modals | Exit animations require DOM presence; conditional unmount kills the transition | ✓ Good — applied to HamburgerMenu, PrivacyNotice, TrademarkNotice, FilterOverlay |
| 500ms flat minimum for FilterOverlay (vs 150ms elapsed-time logic) | 150ms felt too quick on device; flat constant is simpler and more predictable | ✓ Good — user-approved |
| maxHeight: calc(100dvh - 240px) for BrandDropdown (vs 200px plan) | 200px was insufficient clearance on test device; 240px gives visible space | ✓ Good — human-verified |
| Separate transition-transform (drawer) vs transition-opacity (backdrop) | Avoids composite animation conflicts; each property animates independently | ✓ Good |
| AdSense strategy-first, implementation deferred | Ensures placement decisions are documented before code is written; consent gating already in place | ✓ Good |

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
*Last updated: 2026-04-22 — milestone v1.1 started*
