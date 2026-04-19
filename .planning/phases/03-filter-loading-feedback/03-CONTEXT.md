# Phase 3: Filter Loading Feedback - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Show a full-screen overlay with a centered spinner whenever the user changes a filter (fuel type or brand). The overlay must appear for at least 150ms and always clear after the filtered station set is rendered on the map.

Scope: visual feedback only — no new filter types, no data fetching changes.

</domain>

<decisions>
## Implementation Decisions

### Overlay appearance
- **D-01:** The filter overlay must use a **dark background** (e.g., `bg-black/40` or `bg-gray-900/50`) — not the white/90 of the existing data-load `LoadingSpinner`. This keeps both overlays visually distinct: white = waiting for network data, dark = filter re-rendering.
- **D-02:** Spinner only — no text label beneath the spinner. The action context (user just changed a filter) makes the overlay self-explanatory.

### Minimum display time
- **D-03:** Enforce a **150ms minimum display time** on every filter overlay. This guarantees the user always perceives the feedback even on fast devices, without making filter changes feel sluggish.

### Trigger scope
- **D-04:** The overlay triggers on **every filter change** — both fuel type selection changes and brand selection changes. No exceptions or partial triggers.

### Claude's Discretion
- Exact dark color and opacity values (`bg-black/40` vs `bg-gray-900/50` vs other — pick what looks best)
- Whether to add an optional fade-in/fade-out transition on the dark overlay (consistent with existing Tailwind transition patterns is fine)
- Implementation mechanism for the 150ms guarantee (e.g., `setTimeout` + `useRef` tracking the overlay start time — handle as needed)
- Whether to extract the dark filter overlay into a new component or add a `variant` prop to the existing `LoadingSpinner`

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing overlay component
- `src/components/LoadingSpinner.tsx` — Current full-screen overlay (white/90, "Chargement des prix..." text, z-[2000]). The filter overlay must be visually distinct from this.

### Filter state and rendering pipeline
- `src/App.tsx` — All filter state lives here: `filterState` → `useEffect([stations, filterState])` → `filterStations()` → `setFilteredStations`. This is where the overlay trigger logic must be wired.
- `src/lib/filterUtils.ts` — `filterStations()` is a synchronous pure function — no async, no network. The overlay needs a timing trick (e.g., show overlay → `requestAnimationFrame`/`setTimeout(0)` → apply filter → set 150ms guard → hide overlay).
- `src/components/FilterPanel.tsx` — `onFilterChange` callback fires on every fuel type or brand change. Upstream in App.tsx this calls `setFilterState`.

### Requirements
- `FILTER-01`, `FILTER-02` in `.planning/REQUIREMENTS.md` — acceptance criteria for this phase.

### Animation patterns (for any transition on the overlay)
- `src/components/HamburgerMenu.tsx` — Established transition pattern: `transition-transform duration-300 ease-in-out`. Adapt if adding fade.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `LoadingSpinner` — Already renders an `absolute inset-0 z-[2000]` overlay. Can be adapted (via prop or sibling component) for the dark filter variant.
- `filterStations` (pure function) — Called in a `useEffect`; the overlay lifecycle must wrap this effect.

### Established Patterns
- Full-screen overlays use `absolute inset-0 z-[2000]` — keep z-index consistent.
- State in App.tsx only — no external state library. Add a `filterPending: boolean` state here.
- `useEffect` for filter application is the right place to orchestrate show/hide logic.

### Integration Points
- `App.tsx` `useEffect([stations, filterState])` — The overlay show/hide logic wires in here.
- The `<LoadingSpinner />` already rendered when `loading` is true — the filter overlay is a parallel, separate render condition.

</code_context>

<specifics>
## Specific Ideas

- Dark overlay: map should remain faintly visible beneath (translucent, not opaque black). `bg-black/40` is a reasonable starting point.
- The 150ms minimum is a UX floor, not a UX target — don't add artificial delay beyond what's needed.
- If the user rapidly changes filters while an overlay is active, the timeout should reset (debounce-style) to avoid the overlay clearing prematurely mid-change.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-filter-loading-feedback*
*Context gathered: 2026-04-18*
