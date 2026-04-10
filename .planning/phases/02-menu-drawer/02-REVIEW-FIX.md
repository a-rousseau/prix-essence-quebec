---
phase: 02-menu-drawer
fixed_at: 2026-04-10T00:00:00Z
review_path: .planning/phases/02-menu-drawer/02-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 4
skipped: 0
status: all_fixed
---

# Phase 02: Code Review Fix Report

**Fixed at:** 2026-04-10
**Source review:** .planning/phases/02-menu-drawer/02-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 4 (WR-01 through WR-04; IN-* excluded per fix_scope=critical_warning)
- Fixed: 4
- Skipped: 0

## Fixed Issues

### WR-01: Modal opens while drawer is still animating closed

**Files modified:** `src/components/HamburgerMenu.tsx`
**Commit:** 42d737f
**Applied fix:** Added `setTimeout(..., 300)` around each modal-open callback (`onPrivacy`, `onTrademarks`, `onCookies`) in the three `MenuItem` click handlers. `onClose()` is still called synchronously so the drawer begins closing immediately; the modal opens only after the 300ms CSS transition completes.

### WR-02: Safe-area-inset-top fallback collapses to 0px on older iOS

**Files modified:** `src/components/HamburgerMenu.tsx`
**Commit:** 42ee7c0
**Applied fix:** Changed the drawer panel's `paddingTop` inline style from `calc(env(safe-area-inset-top, 0px))` to `max(env(safe-area-inset-top, 0px), 12px)`. This guarantees at least 12px of top padding on all devices, matching the pattern already used in `App.tsx`'s `TOP_CONTROLS_STYLE`.

### WR-03: Brands allowlist never updated after initial station load

**Files modified:** `src/App.tsx`
**Commit:** a50fa02
**Applied fix:** Replaced the `brandsInitializedRef` guard pattern with a merge-only `useEffect`. The new effect runs on every `stations` change, computes `availableCompanies`, then uses the functional `setFilterState` updater to find only brands not already in `prev.companies` and appends them. If no new brands are found it returns `prev` (no re-render). `brandsInitializedRef` and its `useRef` declaration were removed; `useRef` was also removed from the React import since it is no longer used anywhere in the file.

### WR-04: Drawer has no ARIA role or focus management

**Files modified:** `src/components/HamburgerMenu.tsx`
**Commit:** 042951a
**Applied fix:** Added `role="dialog"`, `aria-modal="true"`, and `aria-label="Menu de navigation"` to the drawer panel `<div>`. Added a `closeButtonRef` (`useRef<HTMLButtonElement>`) attached to the close button, and a `useEffect` that calls `closeButtonRef.current?.focus()` whenever `open` transitions to `true`. `useEffect` and `useRef` were added to the React import line.

---

_Fixed: 2026-04-10_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
