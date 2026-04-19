---
phase: 03-filter-loading-feedback
reviewed: 2026-04-18T00:00:00Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - src/components/FilterOverlay.tsx
  - src/App.tsx
findings:
  critical: 0
  warning: 2
  info: 3
  total: 5
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-04-18
**Depth:** standard
**Files Reviewed:** 2
**Status:** issues_found

## Summary

Two new files were reviewed: `FilterOverlay.tsx` (new component) and `App.tsx` (modified to wire in `filterPending` state and the overlay lifecycle). `FilterOverlay.tsx` is clean and straightforward. The issues are all in the filter effect added to `App.tsx`.

The most notable problem is a logic error in the elapsed-time calculation: `elapsed` is computed immediately after `overlayStartRef.current` is set, with only synchronous statements in between, so `elapsed` is always ~0ms and the `remaining` calculation always produces ~500ms. The design intent of the pattern — to subtract already-elapsed time to avoid showing the overlay longer than necessary — is never realized. A secondary issue is that the cleanup path does not null the timer ref, leaving a stale ID that could confuse the cancellation guard on the next run.

No security issues were found.

---

## Warnings

### WR-01: `elapsed` is always ~0ms — minimum-duration logic is non-functional

**File:** `src/App.tsx:75-89`

**Issue:** `overlayStartRef.current` is set on line 75. `filterStations()` runs synchronously on line 84. `elapsed` is computed on line 88 immediately after — before any re-render occurs and with only a handful of synchronous statements in between. The elapsed value is always 0–1ms, so `remaining` is always ~500ms. The intended behavior (subtract already-elapsed work time so the overlay hides exactly 500ms after it appeared) is never achieved. If `filterStations` ever takes longer than 500ms, the overlay will show for 500ms *after* that, exceeding the target minimum. The current behavior happens to enforce a fixed 500ms delay, but through coincidence, not design, and the `overlayStartRef` / `elapsed` pattern adds complexity with no benefit.

**Fix:** Drop the elapsed calculation entirely. Since the filter runs synchronously before the timeout is scheduled, the timeout should just be the full minimum duration:

```typescript
// Replace lines 87-93 with:
overlayTimerRef.current = setTimeout(() => {
  setFilterPending(false)
  overlayTimerRef.current = null
}, 500)
```

If the intent is to measure async re-render time, the start time would need to be recorded *before* `setFilterPending(true)` and the hide decision made inside a `useLayoutEffect` or a `requestAnimationFrame` callback after paint — not inside the same synchronous effect body.

---

### WR-02: Cleanup does not null the timer ref — cancellation guard becomes unreliable

**File:** `src/App.tsx:96-99`

**Issue:** The cleanup function (lines 96–99) calls `clearTimeout(overlayTimerRef.current)` but does not set `overlayTimerRef.current = null`. On the next effect run, the guard on line 78 (`if (overlayTimerRef.current !== null)`) evaluates to `true` and calls `clearTimeout` on a stale, already-cleared timer ID. This is harmless in the browser (clearing a non-pending timer is a no-op), but it makes the guard misleading: the guard is supposed to detect a *pending* timer, but after cleanup it will always detect the stale ID from the previous run.

**Fix:** Null the ref in the cleanup function:

```typescript
return () => {
  if (overlayTimerRef.current !== null) {
    clearTimeout(overlayTimerRef.current)
    overlayTimerRef.current = null  // add this line
  }
}
```

---

## Info

### IN-01: `eslint-disable` comments reference a non-existent rule name

**File:** `src/App.tsx:58, 73`

**Issue:** Both comments suppress `react-hooks/set-state-in-effect`. This rule does not exist in `eslint-plugin-react-hooks` (the package only ships `rules-of-hooks` and `exhaustive-deps`). The suppressions are no-ops — they disable nothing — and are misleading to future readers who may assume they are necessary.

**Fix:** Remove both `// eslint-disable-next-line react-hooks/set-state-in-effect` comments. If ESLint does flag these `setState` calls with a real rule, address the actual rule name.

---

### IN-02: Magic number `500` should be a named constant

**File:** `src/App.tsx:89`

**Issue:** The inline `500` (milliseconds) is a magic number. Per project conventions, module-scope constants use SCREAMING_SNAKE_CASE (e.g., `CACHE_TTL_MS`, `EXPECTED_CARD_HEIGHT`).

**Fix:** Extract to a module-level constant above `App()`:

```typescript
const FILTER_OVERLAY_MIN_MS = 500 // ms — minimum overlay duration for perceived stability (D-03)
```

Then reference it in the effect: `Math.max(0, FILTER_OVERLAY_MIN_MS - elapsed)` (or the simplified form from WR-01).

---

### IN-03: `filteredStations` initialized to `stations` but `stations` is always `[]` at mount

**File:** `src/App.tsx:44`

**Issue:** `const [filteredStations, setFilteredStations] = useState(stations)` captures the initial value of `stations`, which is always `[]` (the hook returns an empty array before data arrives). The initial state is therefore always `[]` regardless of the argument. This is not a bug — `loading` guards the display — but it is potentially confusing to readers who expect the initializer to carry meaning.

**Fix:** Make the intent explicit:

```typescript
const [filteredStations, setFilteredStations] = useState<typeof stations>([])
```

This is clearer and avoids the false implication that `stations`'s initial value is meaningful here.

---

_Reviewed: 2026-04-18_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
