# Roadmap: Prix Essence Québec — Milestone 1: UI Polish & Ad Strategy

## Overview

Four focused phases that harden the existing filter/menu UI and establish a documented AdSense placement strategy. No new features, no backend changes — every phase completes an observable interaction and leaves the app in a better state than it found it.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Dropdown Fixes** - Brand dropdown closes on outside click and never overlaps the price stats bar
- [ ] **Phase 2: Menu Drawer** - Hamburger menu slides in/out as a left-side drawer with backdrop
- [ ] **Phase 3: Filter Loading Feedback** - Full-screen overlay + spinner appears and clears on every filter change
- [ ] **Phase 4: AdSense Placement Strategy** - Written strategy document covering ad zones, density rules, and consent gating

## Phase Details

### Phase 1: Dropdown Fixes
**Goal**: The brand dropdown behaves correctly in all common interaction scenarios
**Depends on**: Nothing (first phase)
**Requirements**: DROPDOWN-01, DROPDOWN-02
**Success Criteria** (what must be TRUE):
  1. User can click anywhere outside the open brand dropdown (map, stats bar, header) and it closes
  2. The open brand dropdown does not visually overlap the price stats bar on any mobile viewport
  3. Opening the dropdown on a small screen reveals filter options without obscuring the bottom bar
**Plans**: TBD
**UI hint**: yes

### Phase 2: Menu Drawer
**Goal**: The hamburger menu opens and closes as an animated left-side drawer with a dimming backdrop
**Depends on**: Phase 1
**Requirements**: MENU-01, MENU-02, MENU-03
**Success Criteria** (what must be TRUE):
  1. Tapping the hamburger icon slides a non-full-width drawer in from the left with an ease-in-out animation
  2. Tapping the close control slides the drawer back out with the same transition in reverse
  3. A dark semi-transparent backdrop covers the rest of the screen while the drawer is open
  4. Tapping the backdrop closes the drawer (same slide-out animation)
**Plans**: TBD
**UI hint**: yes

### Phase 3: Filter Loading Feedback
**Goal**: Users receive immediate visual confirmation that a filter change is being applied
**Depends on**: Phase 2
**Requirements**: FILTER-01, FILTER-02
**Success Criteria** (what must be TRUE):
  1. Changing fuel type or brand selection triggers a full-screen dark overlay with a centered spinner
  2. The overlay disappears once the filtered station set is rendered on the map
  3. The overlay never gets stuck — it always clears after a filter operation completes
**Plans**: TBD
**UI hint**: yes

### Phase 4: AdSense Placement Strategy
**Goal**: A clear, mobile-first written strategy exists that specifies where ads may appear and under what conditions
**Depends on**: Phase 3
**Requirements**: ADS-01, ADS-02
**Success Criteria** (what must be TRUE):
  1. A strategy document exists at `.planning/ADS-STRATEGY.md` listing acceptable UI zones for ad placement
  2. The document specifies a maximum ads-per-view density rule
  3. The document identifies which slot IDs map to which zones
  4. The document explicitly states that no ad zone blocks the map, price stats bar, or filter controls on mobile
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute sequentially: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Dropdown Fixes | 0/? | Not started | - |
| 2. Menu Drawer | 0/? | Not started | - |
| 3. Filter Loading Feedback | 0/? | Not started | - |
| 4. AdSense Placement Strategy | 0/? | Not started | - |
