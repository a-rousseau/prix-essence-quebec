# Requirements — Milestone 1: UI Polish & Ad Strategy

## v1 Requirements

### Dropdown Behavior (DROPDOWN)

- [ ] **DROPDOWN-01**: User can click anywhere outside the brand dropdown to close it
- [ ] **DROPDOWN-02**: Brand dropdown does not overlap the price stats bar on mobile viewports

### Menu Drawer (MENU)

- [ ] **MENU-01**: Hamburger menu opens as a left-side drawer (not full-width) with an ease-in-out slide animation
- [ ] **MENU-02**: Hamburger menu closes with a slide-back-left ease-in-out animation (reverse of open)
- [ ] **MENU-03**: A dark semi-transparent backdrop appears behind the drawer when open, and closes the menu when clicked

### Filter Feedback (FILTER)

- [ ] **FILTER-01**: A dark overlay with a centered spinner appears over the full screen when any filter change is applied (fuel type or brand)
- [ ] **FILTER-02**: The overlay disappears after the filtered results are rendered to the map

### AdSense Strategy (ADS)

- [ ] **ADS-01**: A written placement strategy document exists in `.planning/` that specifies: which UI zones are acceptable for ads, density rules (max ads per view), and which slot IDs to use — consent gating is already implemented via `ADS_ENABLED` constant in `src/lib/adConsent.ts`, activation is out of scope for this phase
- [ ] **ADS-02**: The strategy accounts for mobile-first constraints (no ads blocking the map, stats bar, or filter controls)

---

## v2 Requirements (Deferred)

- Implement AdSense ad units in code (deferred — placement strategy first)
- Keyboard accessibility for map markers
- `aria-pressed` on fuel type toggles
- `fieldset`/`legend` wrapper on brand checkbox list

---

## Out of Scope

- Full-width menu on any breakpoint — user explicitly wants non-full-width drawer
- Spinner only on network fetch — user wants visual feedback on every filter change
- AdSense code implementation — planning/strategy only for this milestone

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| DROPDOWN-01 | Phase 1 | Pending |
| DROPDOWN-02 | Phase 1 | Pending |
| MENU-01 | Phase 2 | Pending |
| MENU-02 | Phase 2 | Pending |
| MENU-03 | Phase 2 | Pending |
| FILTER-01 | Phase 3 | Pending |
| FILTER-02 | Phase 3 | Pending |
| ADS-01 | Phase 4 | Pending |
| ADS-02 | Phase 4 | Pending |
