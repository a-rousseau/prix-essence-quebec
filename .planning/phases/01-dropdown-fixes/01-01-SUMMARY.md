---
phase: 01-dropdown-fixes
plan: 01
subsystem: ui
tags: [react, leaflet, tailwind, mobile]

# Dependency graph
requires: []
provides:
  - BrandDropdown closes on outside click via document mousedown listener
  - BrandDropdown panel height capped with maxHeight/dvh to avoid overlapping PriceStatsBar
affects: [FilterPanel, App]

# Tech tracking
tech-stack:
  added: []
  patterns: [useRef+useEffect for outside-click dismiss, maxHeight with dvh for mobile-safe panels]

key-files:
  created: []
  modified:
    - src/components/BrandDropdown.tsx

key-decisions:
  - "useEffect only attaches the mousedown listener when the dropdown is open — avoids a global listener when closed"
  - "maxHeight: calc(100dvh - 240px) chosen after browser testing; 200px was insufficient clearance, 240px gives visible space above the stats bar"

patterns-established:
  - "Outside-click dismiss: useRef container + useEffect mousedown listener with cleanup — reuse for any future dropdown/modal"
  - "Mobile-safe panel height: maxHeight with dvh (not vh) so address bar resize is handled correctly"

requirements-completed:
  - DROPDOWN-01
  - DROPDOWN-02

# Metrics
duration: 15min
completed: 2026-04-10
---

# Phase 01: dropdown-fixes Summary

**BrandDropdown closes on outside click and caps panel height with `maxHeight: calc(100dvh - 240px)` to avoid overlapping the PriceStatsBar on mobile**

## Performance

- **Duration:** ~15 min
- **Completed:** 2026-04-10
- **Tasks:** 3 (2 auto + 1 human-verify)
- **Files modified:** 1

## Accomplishments
- Outside-click dismiss: `useRef` container ref + `useEffect` mousedown listener (cleans up on close/unmount) — DROPDOWN-01
- Panel height constraint: replaced fixed `height: calc(100vh - 220px)` with `maxHeight: calc(100dvh - 240px)` — DROPDOWN-02
- Human-verified in browser on mobile viewport — both fixes confirmed working

## Task Commits

1. **Tasks 1 & 2: Outside-click + height constraint** - `4597c93` (fix)
2. **User offset adjustment (200px → 240px)** - `c67d0db` (fix)

## Files Created/Modified
- `src/components/BrandDropdown.tsx` - Added `useRef`/`useEffect` for dismiss, switched to `maxHeight` dvh

## Decisions Made
- Offset bumped from 200px to 240px after manual browser test — 200px left the panel too close to the stats bar on the test device
- Listener is only registered when `open === true`, keeping the global event surface minimal

## Deviations from Plan
- Height offset adjusted from `200px` (plan) to `240px` (user tested, manual fix) — same pattern, just a calibrated value

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Dropdown filter UI behaves correctly on mobile — prerequisite for any future FilterPanel or map interaction work
- No blockers

---
*Phase: 01-dropdown-fixes*
*Completed: 2026-04-10*
