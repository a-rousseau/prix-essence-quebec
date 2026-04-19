# Phase 3: Filter Loading Feedback - Research

**Researched:** 2026-04-18
**Domain:** React state management + CSS animation + synchronous-filter overlay lifecycle
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** The filter overlay must use a dark background (e.g., `bg-black/40` or `bg-gray-900/50`) — not the white/90 of the existing data-load `LoadingSpinner`. This keeps both overlays visually distinct: white = waiting for network data, dark = filter re-rendering.
- **D-02:** Spinner only — no text label beneath the spinner. The action context (user just changed a filter) makes the overlay self-explanatory.
- **D-03:** Enforce a 150ms minimum display time on every filter overlay. This guarantees the user always perceives the feedback even on fast devices, without making filter changes feel sluggish.
- **D-04:** The overlay triggers on every filter change — both fuel type selection changes and brand selection changes. No exceptions or partial triggers.

### Claude's Discretion

- Exact dark color and opacity values (`bg-black/40` vs `bg-gray-900/50` vs other — pick what looks best)
- Whether to add an optional fade-in/fade-out transition on the dark overlay (consistent with existing Tailwind transition patterns is fine)
- Implementation mechanism for the 150ms guarantee (e.g., `setTimeout` + `useRef` tracking the overlay start time — handle as needed)
- Whether to extract the dark filter overlay into a new component or add a `variant` prop to the existing `LoadingSpinner`

### Deferred Ideas (OUT OF SCOPE)

- None — discussion stayed within phase scope.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FILTER-01 | A dark overlay with a centered spinner appears over the full screen when any filter change is applied (fuel type or brand) | New `FilterOverlay` component + `filterPending` boolean state in `App.tsx` wired into existing `useEffect([stations, filterState])` |
| FILTER-02 | The overlay disappears after the filtered results are rendered to the map | 150ms guard via `useRef`-tracked `setTimeout`; overlay clears after filter completes and minimum time elapses |

</phase_requirements>

---

## Summary

Phase 3 is a narrow, well-scoped UI change: add a full-screen dark overlay with a centered spinner that appears whenever `filterState` changes in `App.tsx` and disappears once the filtered station set is applied. The filtering function (`filterStations`) is synchronous — it runs in microseconds — so the overlay requires a deliberate timing strategy to remain visible for at least 150ms.

The implementation requires: (1) a new `FilterOverlay` component, (2) a `filterPending: boolean` state variable added to `App.tsx`, and (3) lifecycle logic woven into the existing `useEffect([stations, filterState])` that already drives `setFilteredStations`. No changes to `FilterPanel.tsx`, `filterUtils.ts`, or any other file are needed except `App.tsx` and the new component.

The UI-SPEC (03-UI-SPEC.md) has been approved and defines the component anatomy, exact Tailwind classes, and the lifecycle contract precisely. Research confirms all patterns are consistent with the existing codebase.

**Primary recommendation:** Create `src/components/FilterOverlay.tsx` as a standalone component; wire `filterPending` state and its lifecycle into `App.tsx`'s existing filter `useEffect`.

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on Phase 3 |
|-----------|-------------------|
| React + Leaflet + Tailwind v4 — no new UI frameworks | No new libraries; all implementation via Tailwind utility classes |
| No accounts, app is stateless | Not applicable to this phase |
| French UI (`fr-CA`) | Phase 3 adds no new user-facing text (D-02: spinner only) |
| Mobile-first | `absolute inset-0` overlay works correctly on all screen sizes |
| `interface` over `type` for object shapes | `FilterOverlayProps` uses `interface` |
| `import type` for type-only imports | Enforced by `verbatimModuleSyntax: true` |
| No `console.log/warn/error` in `src/` | No logging in new component or modified `App.tsx` |
| Named exports (default export for `App` only) | `FilterOverlay` uses named export |
| No barrel `index.ts` | Import directly: `'./components/FilterOverlay'` |
| Tailwind v4 — no `tailwind.config.js` | All classes must work in config-free Tailwind v4 |
| 2-space indentation, single quotes | Applied to all new code |

---

## Standard Stack

### Core (no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | `useState`, `useEffect`, `useRef` for overlay lifecycle | Already in project |
| Tailwind CSS v4 | 4.2.2 | All overlay styling via utility classes | Project-standard; no config file needed |

**No new npm packages are required for this phase.** [VERIFIED: codebase grep — all required patterns already exist]

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── FilterOverlay.tsx   ← NEW: standalone dark overlay component
│   └── LoadingSpinner.tsx  ← UNCHANGED: white data-load overlay
├── App.tsx                 ← MODIFIED: filterPending state + lifecycle
└── (all other files unchanged)
```

### Pattern 1: Standalone Component (not a variant prop)

**What:** `FilterOverlay` is a new file, not a modification to `LoadingSpinner`.
**When to use:** When two overlays have different semantics (network vs. filter) and different visual treatments. Coupling them via a `variant` prop creates hidden dependencies between unrelated triggers.
**Decision source:** 03-UI-SPEC.md Component Specification — "Implement as a standalone component — do NOT add a `variant` prop to `LoadingSpinner`." [VERIFIED: codebase read]

```tsx
// src/components/FilterOverlay.tsx
// Source: 03-UI-SPEC.md Component Specification
export function FilterOverlay() {
  return (
    <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/40">
      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  )
}
```

### Pattern 2: Always-mounted with opacity toggle (for exit animation)

**What:** `FilterOverlay` renders unconditionally in JSX; `filterPending` drives opacity/pointer-events classes. This matches the `HamburgerMenu` pattern and enables a CSS exit animation.
**When to use:** Whenever a Tailwind `transition-opacity` exit animation is needed — conditional rendering (`{condition && <Component />}`) unmounts instantly, killing the fade-out.
**Decision source:** 03-UI-SPEC.md Transition section; HamburgerMenu.tsx established pattern. [VERIFIED: codebase read]

```tsx
// In App.tsx render — always-mounted pattern
// Source: HamburgerMenu.tsx transition pattern + 03-UI-SPEC.md
<FilterOverlay visible={filterPending} />
```

```tsx
// FilterOverlay with visible prop
interface FilterOverlayProps {
  visible: boolean
}

export function FilterOverlay({ visible }: FilterOverlayProps) {
  return (
    <div
      className={`absolute inset-0 z-[2000] flex items-center justify-center bg-black/40
        transition-opacity duration-150 ease-in-out
        ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      aria-hidden="true"
    >
      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  )
}
```

### Pattern 3: 150ms minimum display time with useRef timeout tracking

**What:** Record `overlayStartTime` when overlay shows; after filter completes, compute remaining time and schedule hide with `setTimeout`. Cancel any pending timeout via `useRef` before starting a new one (handles rapid filter changes).
**When to use:** Any time a guaranteed minimum display duration is needed for a synchronous operation. [ASSUMED — standard browser timing pattern]

```tsx
// In App.tsx — inside useEffect([stations, filterState])
// Source: 03-CONTEXT.md Specifics + 03-UI-SPEC.md Interaction Contract
const overlayStartRef = useRef<number>(0)
const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

useEffect(() => {
  // Show overlay and record start time
  setFilterPending(true)
  overlayStartRef.current = Date.now()

  // Clear any pending hide timer (rapid-change reset)
  if (overlayTimerRef.current !== null) {
    clearTimeout(overlayTimerRef.current)
    overlayTimerRef.current = null
  }

  // Apply filter synchronously
  const result = filterStations(stations, filterState)
  setFilteredStations(result)

  // Enforce 150ms minimum before hiding overlay
  const elapsed = Date.now() - overlayStartRef.current
  const remaining = Math.max(0, 150 - elapsed)
  overlayTimerRef.current = setTimeout(() => {
    setFilterPending(false)
    overlayTimerRef.current = null
  }, remaining)
}, [stations, filterState])
```

**Cleanup:** The `useEffect` must return a cleanup function that clears `overlayTimerRef.current` to avoid state updates after unmount. [ASSUMED — standard React pattern]

### Pattern 4: Initial render guard

**What:** `filterState` initializes synchronously in `App.tsx`. On first render, the effect runs and would flash the overlay briefly before data loads. The existing effect already has `if (stations.length === 0) return` in the brand-init effect — the filter effect should not show the overlay when `stations` is empty.
**When to use:** Always — prevents phantom overlay on initial page load before data arrives. [VERIFIED: codebase read — App.tsx line 52]

```tsx
useEffect(() => {
  if (stations.length === 0) {
    // Don't show filter overlay before data loads — LoadingSpinner handles that
    setFilteredStations([])
    return
  }

  setFilterPending(true)
  // ... rest of lifecycle
}, [stations, filterState])
```

### Anti-Patterns to Avoid

- **Conditional rendering for animated overlays:** `{filterPending && <FilterOverlay />}` kills the exit fade-out. Use always-mounted + opacity toggle.
- **Setting state after unmounted component:** `useEffect` cleanup must `clearTimeout(overlayTimerRef.current)` to prevent `setFilterPending(false)` firing on a torn-down component.
- **Showing overlay on initial empty-stations render:** Guard with `if (stations.length === 0) return` before triggering `setFilterPending(true)`.
- **Stacking timeouts on rapid changes:** Always `clearTimeout` the existing timer before creating a new one.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS spinner animation | Custom keyframe animation | Tailwind `animate-spin` | Already present in `LoadingSpinner.tsx`; consistent rendering |
| Fade transition | JS-controlled opacity | Tailwind `transition-opacity duration-150` | Existing pattern from `HamburgerMenu.tsx` |

**Key insight:** The spinner and transition are already established patterns in this codebase. The filter overlay is purely a recombination of existing Tailwind classes with new state wiring.

---

## Common Pitfalls

### Pitfall 1: Overlay flash on initial load

**What goes wrong:** `useEffect([stations, filterState])` runs on first render even when `stations = []`. If the overlay logic runs unconditionally, the filter overlay flashes momentarily before `LoadingSpinner` appears.
**Why it happens:** React runs all `useEffect` hooks after first mount regardless of dependency values.
**How to avoid:** Guard with `if (stations.length === 0) return` at the top of the filter `useEffect`, consistent with the brand-init `useEffect` (App.tsx line 52).
**Warning signs:** Brief dark flash before the white loading spinner on hard reload. [VERIFIED: codebase read]

### Pitfall 2: Stacked timeouts on rapid filter changes

**What goes wrong:** User clicks fuel type → brand checkbox → fuel type again in quick succession. Without cleanup, three `setTimeout` callbacks are queued; the overlay hides at the first callback (150ms after the first change), then re-triggers for subsequent callbacks.
**Why it happens:** `setTimeout` callbacks are not automatically cancelled when a new one is created.
**How to avoid:** Store timer ID in `useRef`; `clearTimeout` before creating a new timer in every effect run.
**Warning signs:** Overlay flickers (disappears then reappears) during rapid filter interactions. [ASSUMED — standard JS timing pitfall]

### Pitfall 3: State update on unmounted component

**What goes wrong:** Component unmounts (user navigates away or app crashes) while the 150ms timer is pending. `setFilterPending(false)` fires after unmount, causing a React state-update-on-unmounted-component warning.
**Why it happens:** `setTimeout` callbacks are not automatically cancelled on component unmount.
**How to avoid:** Return a cleanup function from `useEffect` that calls `clearTimeout(overlayTimerRef.current)`.
**Warning signs:** React console warning (development mode): "Can't perform a React state update on a component that is not yet mounted." [ASSUMED — standard React cleanup pattern]

### Pitfall 4: Exit animation broken by conditional rendering

**What goes wrong:** Using `{filterPending && <FilterOverlay />}` immediately unmounts the component when `filterPending` becomes false, so the 150ms fade-out never plays — the overlay just disappears.
**Why it happens:** React unmounts immediately on falsy condition; CSS transitions require the element to remain in the DOM.
**How to avoid:** Always-mounted pattern with `opacity-0 pointer-events-none` when hidden; matches `HamburgerMenu` pattern.
**Warning signs:** Overlay disappears abruptly with no fade. [VERIFIED: HamburgerMenu.tsx read — established pattern]

### Pitfall 5: Two overlays shown simultaneously

**What goes wrong:** If `loading === true` (network fetch) and `filterPending === true` at the same time, both overlays render at `z-[2000]`. While the CONTEXT.md notes these are "mutually exclusive in normal flow," a slow network + impatient user could trigger both.
**Why it happens:** Both render conditions are independent boolean states.
**How to avoid:** Render `FilterOverlay` only when `!loading` — filter feedback is irrelevant while data is loading. [ASSUMED — defensive guard; confirmed as "mutually exclusive in normal flow" by 03-UI-SPEC.md]

---

## Code Examples

Verified patterns from existing codebase:

### Existing overlay (LoadingSpinner — do not modify)
```tsx
// Source: src/components/LoadingSpinner.tsx [VERIFIED]
export function LoadingSpinner() {
  return (
    <div className="absolute inset-0 z-[2000] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
        <p className="text-gray-600 text-sm font-medium">Chargement des prix...</p>
      </div>
    </div>
  )
}
```

### Established fade transition pattern (HamburgerMenu)
```tsx
// Source: src/components/HamburgerMenu.tsx [VERIFIED]
<div
  className={`fixed inset-0 z-[2900] bg-black/50 transition-opacity duration-300 ease-in-out ${
    open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
  }`}
  onClick={onClose}
/>
```

### Existing filter effect (target for modification)
```tsx
// Source: src/App.tsx lines 62-64 [VERIFIED]
useEffect(() => {
  setFilteredStations(filterStations(stations, filterState))
}, [stations, filterState])
```

### filterStations signature (synchronous, no async)
```ts
// Source: src/lib/filterUtils.ts [VERIFIED]
export function filterStations(stations: Station[], filterState: FilterState): Station[]
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `{condition && <Component />}` conditional rendering | Always-mounted + opacity toggle | Established by HamburgerMenu (Phase 2) | Exit animations work correctly |

**No deprecated patterns relevant to this phase.**

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Stacked timeouts without `clearTimeout` cause overlay flicker on rapid filter changes | Common Pitfalls §2 | Risk is low — behavior matches standard JS event loop semantics |
| A2 | `useEffect` cleanup with `clearTimeout` prevents state update on unmounted component | Common Pitfalls §3, Code Examples §3 | If React 19 handles this differently, add a `cancelled` ref guard as used in `useStations.ts` |
| A3 | Rendering `FilterOverlay` only when `!loading` correctly prevents simultaneous overlay display | Common Pitfalls §5 | If both states can genuinely co-occur at user pace, additional dedup logic may be needed — low probability per CONTEXT.md |

---

## Open Questions

1. **Transition duration: 150ms or 300ms?**
   - What we know: 03-UI-SPEC.md recommends `duration-150` to match the minimum display time floor; HamburgerMenu uses `duration-300`.
   - What's unclear: Whether 150ms is visually smooth enough on low-end Android devices — it may feel abrupt.
   - Recommendation: Start with `duration-150` per the UI-SPEC; adjust to `duration-200` if testing shows it feels choppy. This is within Claude's discretion.

2. **Should `filterPending` suppress the overlay when `stations.length === 0`?**
   - What we know: `LoadingSpinner` already covers the initial-load state. Filter overlay during empty data is pointless.
   - What's unclear: Whether the guard should be `stations.length === 0` or `loading === true`.
   - Recommendation: Guard with `if (stations.length === 0) return` (matches existing brand-init useEffect pattern), and additionally skip overlay render when `loading === true` as a defensive measure.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 3 is a pure code change (new React component + App.tsx state wiring). No external tools, CLIs, services, databases, or runtimes beyond the existing Vite dev server are required.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected |
| Config file | None — no `vitest.config.*`, `jest.config.*`, `pytest.ini` found |
| Quick run command | N/A — Wave 0 must install framework |
| Full suite command | N/A — Wave 0 must install framework |

No test files (`*.test.*`, `*.spec.*`) and no test directories (`test/`, `tests/`, `__tests__/`) were found in the project. [VERIFIED: filesystem scan]

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FILTER-01 | `filterPending` becomes true when `filterState` changes | unit | `npx vitest run src/lib/filterUtils.test.ts` | ❌ Wave 0 |
| FILTER-02 | `filterPending` becomes false after 150ms minimum elapses | unit (with fake timers) | `npx vitest run src/App.test.tsx` | ❌ Wave 0 |

**Note:** Both requirements involve React state and `setTimeout` timing. The most practical test approach for this codebase is Vitest + React Testing Library with `vi.useFakeTimers()` to control the 150ms guard. However, given the project has zero existing test infrastructure, the Wave 0 overhead is significant. The planner should consider whether the testing investment is proportionate to a 2-file change, or whether manual verification is more appropriate for this phase.

### Sampling Rate

- **Per task commit:** Manual browser check (no automated suite exists)
- **Per wave merge:** Manual browser check
- **Phase gate:** Manual verification against FILTER-01 and FILTER-02 acceptance criteria before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `src/lib/filterUtils.test.ts` — unit tests for `filterStations` pure function (covers FILTER-01 precondition)
- [ ] `src/App.test.tsx` — integration test for overlay lifecycle (covers FILTER-01, FILTER-02)
- [ ] Framework install: `npm install --save-dev vitest @testing-library/react @testing-library/user-event jsdom` — if automated tests are desired
- [ ] `vite.config.ts` — add `test: { environment: 'jsdom' }` Vitest config block

**Recommendation:** Given zero existing test infrastructure and a 2-file change, treat this phase as manually verified. Document the acceptance criteria steps explicitly in the PLAN so the human verifier knows exactly what to check.

---

## Security Domain

No ASVS categories apply to Phase 3. This phase adds only a visual overlay component with no authentication, session management, access control, input validation, cryptography, or network requests. The overlay is entirely client-side, stateless, and non-interactive (`aria-hidden="true"`).

---

## Sources

### Primary (HIGH confidence)
- `src/App.tsx` [VERIFIED: file read] — existing filter `useEffect`, `filterState`, `filteredStations` state
- `src/components/LoadingSpinner.tsx` [VERIFIED: file read] — existing overlay classes and z-index
- `src/components/HamburgerMenu.tsx` [VERIFIED: file read] — established `transition-opacity duration-300 ease-in-out` + always-mounted pattern
- `src/lib/filterUtils.ts` [VERIFIED: file read] — synchronous filter function signature
- `src/components/FilterPanel.tsx` [VERIFIED: file read] — `onFilterChange` callback wiring
- `.planning/phases/03-filter-loading-feedback/03-CONTEXT.md` [VERIFIED: file read] — locked decisions D-01 through D-04
- `.planning/phases/03-filter-loading-feedback/03-UI-SPEC.md` [VERIFIED: file read] — component anatomy, exact classes, interaction contract

### Secondary (MEDIUM confidence)
- None required — all patterns sourced directly from existing codebase

### Tertiary (LOW confidence / ASSUMED)
- A1, A2, A3 in Assumptions Log — standard React/JS timing patterns not requiring external verification

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all patterns from verified codebase reads
- Architecture: HIGH — patterns directly from existing `HamburgerMenu.tsx` and `App.tsx`
- Pitfalls: HIGH (P1, P2, P4) / ASSUMED (P3, P5) — core pitfalls verified from source, edge cases assumed

**Research date:** 2026-04-18
**Valid until:** 2026-05-18 (stable — no fast-moving dependencies)
