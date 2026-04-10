---
phase: 02-menu-drawer
reviewed: 2026-04-10T00:00:00Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - src/components/HamburgerMenu.tsx
  - src/App.tsx
findings:
  critical: 0
  warning: 4
  info: 2
  total: 6
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-04-10
**Depth:** standard
**Files Reviewed:** 2
**Status:** issues_found

## Summary

Reviewed `HamburgerMenu.tsx` and `App.tsx` as they relate to the menu drawer implementation. The code is generally well-structured and follows project conventions. No critical security vulnerabilities or crash-level bugs were found.

Four warnings were identified: a visual sequencing bug where modals open while the drawer is still animating closed; a missing safe-area fallback that risks notch overlap on iOS; a brands allowlist that is never refreshed after the initial station load; and missing ARIA attributes that leave the drawer inaccessible to keyboard and screen-reader users. Two informational items round out the findings.

---

## Warnings

### WR-01: Modal opens while drawer is still animating closed

**File:** `src/components/HamburgerMenu.tsx:38` (also lines 43, 49)
**Issue:** When a menu item is clicked, `onClose()` and `onPrivacy()` (or `onTrademarks()`, `onCookies()`) are called synchronously in the same event handler tick. The drawer close is a 300ms CSS transition (`transition-transform duration-300`), so both the drawer and the opened modal are simultaneously visible for 300ms on mobile. This produces a jarring layered visual on small screens.
**Fix:** Delay the callback until after the close animation completes:
```tsx
onClick={() => {
  onClose()
  setTimeout(onPrivacy, 300)
}}
```
Alternatively, accept a single `onAction` prop that `App.tsx` wires to both close + open in sequence with a timer, keeping `HamburgerMenu` unaware of the delay.

---

### WR-02: Safe-area-inset-top fallback collapses to 0px on older iOS

**File:** `src/components/HamburgerMenu.tsx:26`
**Issue:** `paddingTop: 'calc(env(safe-area-inset-top, 0px))'` uses `0px` as the CSS env fallback. On iOS devices where `env()` is unsupported or where the value resolves to `0` (e.g., non-notched devices in landscape), the drawer header is flush against the very top edge of the screen. For notched devices that fail env resolution, the close button and title overlap the status bar.
**Fix:** Use a safe minimum:
```tsx
style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}
```
This ensures at least 12px of breathing room regardless of device/orientation.

---

### WR-03: Brands allowlist never updated after initial station load

**File:** `src/App.tsx:52-57`
**Issue:** `brandsInitializedRef.current` is set to `true` on the first non-empty `stations` load and never reset. If the user triggers `refresh()` and the refreshed data contains new brands (e.g., a new station chain appears), those brands are never added to `filterState.companies`. The new stations pass through `filterStations` but the companies filter silently excludes them because the brand is absent from the allowlist.
```ts
// Current — brands locked in on first load, never updated on refresh
if (stations.length === 0 || brandsInitializedRef.current) return
brandsInitializedRef.current = true
setFilterState(prev => ({ ...prev, companies: availableCompanies }))
```
**Fix:** On every refresh, merge new brands into the existing allowlist rather than skipping the update entirely:
```ts
useEffect(() => {
  if (stations.length === 0) return
  const availableCompanies = Array.from(
    new Set(stations.map(s => s.banniere).filter(Boolean))
  ).sort()
  setFilterState(prev => {
    // Add any newly discovered brands to the allowlist
    const newBrands = availableCompanies.filter(b => !prev.companies.includes(b))
    if (newBrands.length === 0) return prev
    return { ...prev, companies: [...prev.companies, ...newBrands] }
  })
}, [stations])
```
The `brandsInitializedRef` can then be removed entirely.

---

### WR-04: Drawer has no ARIA role or focus management

**File:** `src/components/HamburgerMenu.tsx:22-61`
**Issue:** The drawer panel has no `role="dialog"`, no `aria-modal="true"`, and no focus trap. When `open` is `true`, keyboard users can Tab through the rest of the page (map, search bar, filter panel) even though the backdrop visually blocks pointer interaction. Screen readers receive no signal that a modal context is active.
**Fix:** Add role and aria attributes to the panel, and move focus into the drawer on open:
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-label="Menu de navigation"
  className={`fixed top-0 left-0 ...`}
  ...
>
```
For focus management, add a `useEffect` in `HamburgerMenu` (or `App.tsx`) that calls `.focus()` on the close button when `open` transitions to `true`. A full focus trap (Tab cycles within the drawer) is the gold standard but requires additional logic or a small utility.

---

## Info

### IN-01: External link duplicates MenuItem button styles instead of reusing the component

**File:** `src/components/HamburgerMenu.tsx:52-60`
**Issue:** The "Bugs et suggestions" `<a>` element manually replicates the same Tailwind classes used by `MenuItem` (`flex items-center gap-3 px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100`). If `MenuItem` styles are updated in the future, this element will drift out of sync.
**Fix:** Either wrap the anchor in a `MenuItem`-like variant that accepts an `href`, or extract the shared classes into a CSS variable / Tailwind component class in `index.css`.

---

### IN-02: Derived state stored as useState introduces a one-render stale window

**File:** `src/App.tsx:43`
**Issue:** `filteredStations` is computed from `stations` and `filterState` inside a `useEffect`, which means there is always one render where `filteredStations` lags behind the latest `stations`/`filterState` values. This is the classic "derived state in useState" anti-pattern.
```ts
const [filteredStations, setFilteredStations] = useState(stations) // stale on first render
```
**Fix:** Compute `filteredStations` inline during render — `filterStations` is already a pure function:
```ts
const filteredStations = filterStations(stations, filterState)
```
Remove the `useState` and the `useEffect` that drives it. This eliminates the stale render and the extra state update cycle.

---

_Reviewed: 2026-04-10_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
