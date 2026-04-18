# Phase 3: Filter Loading Feedback - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 03-filter-loading-feedback
**Areas discussed:** Overlay appearance, Spinner text, Minimum display time, Trigger scope

---

## Overlay Appearance

| Option | Description | Selected |
|--------|-------------|----------|
| Dark overlay | Semi-transparent dark background (bg-black/40 or bg-gray-900/50) — matches 'dark overlay' in FILTER-01, visually distinct from the white network-load spinner | ✓ |
| Reuse existing white spinner | Same bg-white/90 overlay as the data-load spinner — simpler, one component for both cases | |

**User's choice:** Dark overlay
**Notes:** FILTER-01 explicitly requires a dark overlay; keeps filter feedback visually distinct from network loading.

---

## Spinner Text

| Option | Description | Selected |
|--------|-------------|----------|
| No text | Spinner only — action context makes overlay self-explanatory | ✓ |
| Filtrage en cours… | Short French label naming the action | |
| Mise à jour… | Generic French 'updating' label | |

**User's choice:** No text
**Notes:** Brief overlay; gesture context is sufficient.

---

## Minimum Display Time

| Option | Description | Selected |
|--------|-------------|----------|
| ~150ms minimum | Guarantees visibility without feeling slow | ✓ |
| ~300ms minimum | More deliberate; risk of feeling sluggish | |
| No minimum | Show/hide as fast as React re-renders — may be imperceptible | |

**User's choice:** 150ms minimum
**Notes:** UX floor only — not an artificial delay target.

---

## Trigger Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Both fuel type + brand | Every filter change — consistent with PROJECT.md decision | ✓ |
| Brand changes only | Fuel type switches are fast; overlay may be overkill | |
| Brand + fuel type null toggle | Compromise — overlay only on toggling fuel type off | |

**User's choice:** Both fuel type + brand (every filter change)
**Notes:** Consistent with existing PROJECT.md decision: "Spinner on every filter change (not just fetches)."

---

## Claude's Discretion

- Exact dark color/opacity values
- Whether to add fade-in/fade-out transition on the overlay
- Implementation mechanism for 150ms guarantee
- Whether to extend `LoadingSpinner` with a variant prop or create a separate component

## Deferred Ideas

None — discussion stayed within phase scope.
