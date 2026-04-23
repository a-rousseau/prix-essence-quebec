# Roadmap: Prix Essence Québec

## Milestones

- ✅ **v1.0 UI Polish & Ad Strategy** — Phases 01–04 (shipped 2026-04-20)
- **v1.1 Favorites, Geolocation & Revenue** — Phases 05–08 (active)

## Phases

<details>
<summary>✅ v1.0 UI Polish & Ad Strategy (Phases 01–04) — SHIPPED 2026-04-20</summary>

- [x] Phase 01: Dropdown Fixes (1/1 plan) — completed 2026-04-10
- [x] Phase 02: Menu Drawer (1/1 plan) — completed 2026-04-10
- [x] Phase 02.1: Fix Modal Transitions — PrivacyNotice + TrademarkNotice (1/1 plan, INSERTED) — completed 2026-04-11
- [x] Phase 03: Filter Loading Feedback (1/1 plan) — completed 2026-04-18
- [x] Phase 04: AdSense Placement Strategy (1/1 plan) — completed 2026-04-19

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### v1.1 Favorites, Geolocation & Revenue

- [ ] **Phase 05: Accessibility Fixes** - Fuel toggles, brand list, and map markers are fully keyboard and screen-reader accessible
- [ ] **Phase 06: Geolocation UX** - Map centers on the user automatically on load, shows an accuracy ring, and gives clear feedback on errors
- [ ] **Phase 07: AdSense Implementation** - The AdSense slot renders consent-gated below the price stats bar without blocking map controls
- [ ] **Phase 08: Favorites** - Users can save, view, filter, and export/import favorite stations with TTL-based persistence

## Phase Details

### Phase 05: Accessibility Fixes
**Goal**: Filter controls and map markers are accessible to keyboard users and screen reader users
**Depends on**: Nothing (v1.0 complete; these are isolated markup improvements)
**Requirements**: A11Y-01, A11Y-02, A11Y-03, A11Y-04
**Success Criteria** (what must be TRUE):
  1. Screen reader announces fuel type buttons as toggle buttons with pressed/unpressed state
  2. Brand checkbox list is announced as a group with a visible legend by screen readers
  3. User can Tab through map markers and open a station card with Enter or Space
  4. Opening a station card moves keyboard focus into the card; closing it returns focus to the source marker
**Plans**: TBD
**UI hint**: yes

### Phase 06: Geolocation UX
**Goal**: The map locates the user automatically on first load and communicates geolocation state clearly
**Depends on**: Phase 05
**Requirements**: GEO-01, GEO-02, GEO-03, GEO-04
**Success Criteria** (what must be TRUE):
  1. When permission is granted, the map pans and zooms to the user's location on first load without any manual action
  2. A translucent accuracy ring is visible around the user location marker, sized to match GPS accuracy
  3. When geolocation is denied, timed out, or unavailable, a clear French error message is displayed to the user
  4. Tapping the locate-me button after a denial or error re-triggers the geolocation attempt
**Plans**: TBD
**UI hint**: yes

### Phase 07: AdSense Implementation
**Goal**: The AdSense slot 3373913657 is live in the app, consent-gated, and does not disrupt the mobile layout
**Depends on**: Phase 05
**Requirements**: ADS-01, ADS-02, ADS-03, ADS-04
**Success Criteria** (what must be TRUE):
  1. An ad unit appears below the price stats bar on mobile when the user has accepted cookies
  2. No ad unit appears when the user has declined cookies or not yet responded to the consent banner
  3. Only one ad unit is ever active on screen at a time
  4. The ad unit does not overlap map controls, the locate button, or safe-area-inset padding on any mobile viewport
**Plans**: TBD
**UI hint**: yes

### Phase 08: Favorites
**Goal**: Users can persistently save favorite stations, see them highlighted on the map, and manage them across sessions
**Depends on**: Phase 06
**Requirements**: FAV-01, FAV-02, FAV-03, FAV-04, FAV-05, FAV-06, FAV-07
**Success Criteria** (what must be TRUE):
  1. User can tap a control on a station card to save it as a favorite, and tap again to remove it
  2. Favorited stations display a distinct visual indicator on the map (e.g., a star or highlight)
  3. User can activate a "favorites only" filter to show only saved stations on the map
  4. Favorites are still present after closing and reopening the browser (localStorage persistence)
  5. User is notified before a favorite expires and can extend its TTL; user can also export favorites as JSON and re-import them
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 01. Dropdown Fixes | v1.0 | 1/1 | Complete | 2026-04-10 |
| 02. Menu Drawer | v1.0 | 1/1 | Complete | 2026-04-10 |
| 02.1. Modal Transitions (INSERTED) | v1.0 | 1/1 | Complete | 2026-04-11 |
| 03. Filter Loading Feedback | v1.0 | 1/1 | Complete | 2026-04-18 |
| 04. AdSense Placement Strategy | v1.0 | 1/1 | Complete | 2026-04-19 |
| 05. Accessibility Fixes | v1.1 | 0/? | Not started | - |
| 06. Geolocation UX | v1.1 | 0/? | Not started | - |
| 07. AdSense Implementation | v1.1 | 0/? | Not started | - |
| 08. Favorites | v1.1 | 0/? | Not started | - |
