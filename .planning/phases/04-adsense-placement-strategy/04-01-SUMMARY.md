---
phase: 04-adsense-placement-strategy
plan: "01"
subsystem: planning/documentation
tags:
  - adsense
  - documentation
  - strategy
dependency_graph:
  requires:
    - .planning/phases/04-adsense-placement-strategy/04-CONTEXT.md
    - .planning/phases/04-adsense-placement-strategy/04-RESEARCH.md
    - .planning/phases/04-adsense-placement-strategy/04-UI-SPEC.md
  provides:
    - .planning/ADS-STRATEGY.md
  affects:
    - Phase 5 AdSense implementation
tech_stack:
  added: []
  patterns:
    - Developer-facing strategy document in .planning/
key_files:
  created:
    - .planning/ADS-STRATEGY.md
  modified: []
decisions:
  - Two ad zones scoped: station card popup (active, slot 3373913657) and full-page interstitial (planned, no slot ID yet)
  - Density policy fixed at max 1 active unit at a time — enforced by Leaflet tooltip model
  - Interstitial capped at once per browser session with no localStorage tracking required
  - Bottom banner, hamburger menu ad, and sidebar explicitly marked as not currently acceptable
metrics:
  duration: "~15 minutes"
  completed: "2026-04-19T15:47:21Z"
  tasks_completed: 1
  tasks_total: 1
  files_created: 1
  files_modified: 0
---

# Phase 4 Plan 1: AdSense Placement Strategy Summary

**One-liner:** Developer-facing AdSense strategy document mapping slot 3373913657 to the station card popup zone with consent gating, density policy, and explicit out-of-scope boundaries.

---

## What Was Built

A single Markdown reference document at `.planning/ADS-STRATEGY.md` that Phase 5 executor agents will use as their implementation spec for AdSense ad placement. The document codifies all decisions locked in CONTEXT.md (D-01 through D-07) into a scannable, actionable format.

### Document Structure (10 sections)

1. **Title and metadata block** — phase, status, date, audience
2. **Overview** — scope statement, locked decisions reference
3. **Ad Zone Table** — two zones with slot IDs, activation gates, mobile constraints, density rules
4. **Density Policy** — 1-unit-max rule + interstitial session cap
5. **Consent Gating** — reference to existing `adConsent.ts` infrastructure, 4-state table
6. **Activation Checklist** — 7-step go-live procedure for Zone 1
7. **Existing Ad Slot Reference (Zone 1)** — verbatim `adSlotHtml` template + CSS gate from `Map.tsx` / `index.css`
8. **Common Pitfalls** — 5 callout blocks for common implementation mistakes
9. **Future Considerations** — deferred zones explicitly marked as not currently acceptable
10. **Out of Scope** — explicit boundary list

### Key Content Verified

| Check | Result |
|-------|--------|
| Slot ID `3373913657` present | 4 occurrences |
| `ADS_ENABLED` referenced | 7 occurrences (zone table, consent section, activation checklist) |
| `VITE_ADSENSE_PUBLISHER_ID` referenced | 3 occurrences (zone table, activation checklist, pitfall) |
| `not currently acceptable` phrase present | 2 occurrences (pitfall 5 + future considerations) |
| 375px mobile constraint stated | 2 occurrences |
| `display: none` CSS gate pitfall | 3 occurrences |
| `once per browser session` density rule | 1 occurrence |
| All 8 required sections present | Confirmed |
| Line count | 132 lines (minimum 80 required) |

---

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Write .planning/ADS-STRATEGY.md | 50cf5d5 | .planning/ADS-STRATEGY.md (created) |

---

## Deviations from Plan

None — plan executed exactly as written.

---

## Known Stubs

None — this is a documentation deliverable. No stub patterns apply.

---

## Threat Flags

None — the document references the env var name `VITE_ADSENSE_PUBLISHER_ID` only, not the actual publisher ID value. No secrets written to file. T-04-01 (Information Disclosure) is accepted per threat register.

---

## Self-Check: PASSED

- `.planning/ADS-STRATEGY.md` exists: FOUND
- Task commit `50cf5d5` exists: FOUND
- All acceptance criteria grep checks: PASSED
