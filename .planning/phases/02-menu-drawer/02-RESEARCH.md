# Phase 2: Menu Drawer - Research

**Researched:** 2026-04-10
**Domain:** CSS drawer animation, React conditional rendering, Tailwind v4 transitions
**Confidence:** HIGH

## Summary

Phase 2 transforms the existing `HamburgerMenu` component from a static top-banner overlay into a left-side slide drawer with a dimming backdrop. The current implementation mounts/unmounts the component instantly on `showMenu` boolean — the drawer pattern requires keeping the component mounted (or using CSS-driven show/hide) so the exit animation can play before unmount.

The entire implementation uses only existing project dependencies: Tailwind CSS v4 utility classes for transforms and transitions, and React state for open/closed tracking. No new libraries are needed. The critical challenge is exit animation — CSS transitions require the element to be present in the DOM during the slide-out, which means unmounting must be deferred until the transition ends.

**Primary recommendation:** Keep the drawer always mounted in the DOM; drive open/closed via a Tailwind `-translate-x-full` / `translate-x-0` toggle. Use `onTransitionEnd` to set a `mounted` flag that gates DOM presence, or simply leave the drawer always mounted since it is lightweight (a few buttons). The simplest correct approach is always-mounted with opacity+translate toggling.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MENU-01 | Hamburger menu opens as a left-side drawer (not full-width) with an ease-in-out slide animation | Tailwind `transition-transform duration-300 ease-in-out translate-x-0` on open; `-translate-x-full` on closed |
| MENU-02 | Hamburger menu closes with slide-back-left ease-in-out animation (reverse of open) | Same CSS transition plays in reverse when class switches back to `-translate-x-full` |
| MENU-03 | Dark semi-transparent backdrop appears behind drawer when open; closes menu when tapped | Fixed inset overlay with `bg-black/50`; `onClick` calls `onClose`; opacity transitions from 0 to 1 |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.2.2 (already installed) | Transition, translate, opacity utility classes | Project-mandated; v4 config-free mode in use |
| React | 19.2.4 (already installed) | State for `showMenu` + `isOpen` flag | All app state lives in App.tsx per project architecture |

### Supporting

No additional libraries required. `transition-transform`, `-translate-x-full`, `translate-x-0`, `transition-opacity`, `opacity-0`, `opacity-100`, `pointer-events-none` are all standard Tailwind v4 utility classes. [VERIFIED: tailwindcss.com/docs/translate, tailwindcss.com/docs/transition-property]

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Always-mounted CSS toggle | Mount/unmount with `onTransitionEnd` guard | More complex, risk of race condition; not needed for a lightweight component |
| Tailwind transition classes | Framer Motion | Overkill; project prohibits new UI frameworks |
| `translate-x` CSS | `left: -100%` / `left: 0` | Older pattern; `translate` property is GPU-composited and preferred |

**Installation:** No new packages needed.

## Architecture Patterns

### Recommended Structure

The change is confined to two files:

```
src/
├── App.tsx                   # showMenu state already exists — no change needed
└── components/
    └── HamburgerMenu.tsx     # Refactor: add drawer + backdrop markup and transition classes
```

### Pattern 1: Always-Mounted CSS Toggle Drawer

**What:** The drawer div is always in the DOM. Open/closed state is driven by toggling between `-translate-x-full` (off-screen) and `translate-x-0` (on-screen). The backdrop uses `opacity-0 pointer-events-none` when closed and `opacity-100 pointer-events-auto` when open.

**When to use:** Any lightweight drawer where the exit animation must play. Avoids all unmount-timing complexity.

**Example:**
```typescript
// Source: tailwindcss.com/docs/translate + tailwindcss.com/docs/transition-property
// In HamburgerMenu.tsx — driven by an `open` prop from App.tsx

// Backdrop
<div
  className={`fixed inset-0 z-[2900] bg-black/50 transition-opacity duration-300 ease-in-out ${
    open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
  }`}
  onClick={onClose}
/>

// Drawer panel
<div
  className={`fixed top-0 left-0 h-full z-[3000] bg-white shadow-xl
    w-72 max-w-[80vw]
    transition-transform duration-300 ease-in-out
    ${open ? 'translate-x-0' : '-translate-x-full'}`}
  style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px))' }}
>
  {/* drawer content */}
</div>
```

**Why `w-72 max-w-[80vw]`:** MENU-01 requires non-full-width. `w-72` (288px) is a natural drawer width on desktop; `max-w-[80vw]` ensures it does not overflow on small phones. [ASSUMED — exact width is Claude's discretion]

### Pattern 2: Conditional Rendering (current approach — to be replaced)

**What:** The current `HamburgerMenu` only renders when `showMenu` is `true` in `App.tsx`. This means no exit animation is possible because the element is removed from the DOM immediately on `setShowMenu(false)`.

**Why it must change:** The exit slide animation (MENU-02) requires the element to remain in the DOM while transitioning. The always-mounted pattern above replaces this.

**Migration:** In `App.tsx`, change from conditional rendering to always rendering `HamburgerMenu` with an `open` prop:

```typescript
// Before (App.tsx)
{showMenu && <HamburgerMenu onClose={() => setShowMenu(false)} ... />}

// After (App.tsx)
<HamburgerMenu
  open={showMenu}
  onClose={() => setShowMenu(false)}
  ...
/>
```

### Anti-Patterns to Avoid

- **Using `display: none` instead of translate:** `display` is not animatable. The drawer would snap in/out with no transition.
- **Animating `left` position:** Less performant than `translate` — triggers layout recalculation. Use `translate-x` which is GPU-composited. [CITED: tailwindcss.com/docs/translate]
- **`transition-all`:** Animates every property change, can cause unintended jank. Use `transition-transform` for the drawer panel and `transition-opacity` for the backdrop.
- **Z-index conflicts:** Current HamburgerMenu uses `z-[2900]` (backdrop) and `z-[3000]` (panel). These must be preserved — they are already above the map and filter controls.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drawer slide animation | Custom JS animation with `requestAnimationFrame` | Tailwind `transition-transform` + CSS | CSS transitions are hardware-accelerated; no JS needed |
| Backdrop fade | Manual opacity animation via JS | Tailwind `transition-opacity` | Same; CSS handles it natively |
| Exit animation timing | `setTimeout` matching transition duration | CSS handles it — drawer stays mounted | Avoids duration sync bugs when easing changes |

**Key insight:** CSS transitions are the right primitive here. The only "problem" to solve is DOM presence during exit, which the always-mounted pattern handles with zero extra complexity.

## Common Pitfalls

### Pitfall 1: Exit animation is skipped

**What goes wrong:** Developer keeps conditional `{showMenu && <HamburgerMenu />}` from the current code. Closing the menu removes the element from the DOM instantly — the slide-out transition never plays.

**Why it happens:** CSS transitions only animate between two states while the element is mounted. Unmount = no animation.

**How to avoid:** Switch to always-mounted pattern with `open` prop. The element stays in the DOM; CSS transitions run in both directions.

**Warning signs:** Menu disappears without sliding when close button is tapped.

### Pitfall 2: Backdrop blocks interaction when drawer is closed

**What goes wrong:** The backdrop `div` covers the full screen at `z-[2900]`. If it is always mounted with no `pointer-events-none` when closed, all map taps and button presses are silently swallowed.

**Why it happens:** A fixed full-screen div captures pointer events even when `opacity-0`.

**How to avoid:** Apply `pointer-events-none` when `open === false`. The Tailwind pattern above handles this. [VERIFIED: standard CSS behavior]

### Pitfall 3: Body scroll behind backdrop on iOS

**What goes wrong:** On iOS Safari, content behind a fixed backdrop can still scroll via momentum/inertia when the drawer is open.

**Why it happens:** iOS has historically not respected `overflow: hidden` on `body` for scroll-lock.

**How to avoid:** The app already sets `overflow: hidden` on `html, body, #root` in `index.css` (verified in codebase). The map is the only scrollable surface, and it uses Leaflet's own event handling. Scroll-lock is already solved — no additional code needed. [VERIFIED: codebase grep of index.css line 16]

### Pitfall 4: Safe-area-inset on the drawer top edge

**What goes wrong:** On iPhone with notch/Dynamic Island, the drawer top content sits behind the system status bar.

**Why it happens:** Fixed-positioned elements start at the physical top, not below the safe area.

**How to avoid:** The current HamburgerMenu already applies `paddingTop: 'calc(env(safe-area-inset-top, 0px))'` inline. This must be kept on the drawer panel in the refactored version. [VERIFIED: HamburgerMenu.tsx line 19]

### Pitfall 5: Drawer width must be non-full-width (MENU-01)

**What goes wrong:** Using `w-full` or `w-screen` on the drawer panel.

**Why it happens:** Developer defaults to full-width for simplicity.

**How to avoid:** Use a fixed width with a viewport cap: e.g., `w-72 max-w-[80vw]`. Requirements explicitly forbid full-width. [VERIFIED: REQUIREMENTS.md — Out of Scope section]

## Code Examples

### Minimal drawer pattern (Tailwind v4)

```typescript
// Source: tailwindcss.com/docs/transition-property, tailwindcss.com/docs/translate

interface HamburgerMenuProps {
  open: boolean         // NEW prop — replaces conditional rendering in App.tsx
  onClose: () => void
  onPrivacy: () => void
  onTrademarks: () => void
  onCookies: () => void
}

export function HamburgerMenu({ open, onClose, onPrivacy, onTrademarks, onCookies }: HamburgerMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[2900] bg-black/50 transition-opacity duration-300 ease-in-out ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 h-full z-[3000] w-72 max-w-[80vw] bg-white shadow-xl
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px))' }}
      >
        {/* existing header + menu items — unchanged */}
      </div>
    </>
  )
}
```

### App.tsx change (always render)

```typescript
// Source: project architecture — App.tsx
// Before: conditional mount
// {showMenu && <HamburgerMenu onClose={...} ... />}

// After: always mounted, open prop controls visibility
<HamburgerMenu
  open={showMenu}
  onClose={() => setShowMenu(false)}
  onPrivacy={() => setShowPrivacy(true)}
  onTrademarks={() => setShowTrademark(true)}
  onCookies={() => { clearAdConsent(); setShowBanner(true) }}
/>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `left: -100%` / `left: 0` drawer | `translate-x` (GPU-composited) | CSS transforms widely adopted ~2015 | No layout recalculation; smoother on mobile |
| JS timeout for exit animation | Always-mounted CSS toggle | N/A — always was the correct pattern | No setTimeout magic needed |

**Deprecated/outdated:**
- Animating `left` / `margin-left`: works but causes layout recalc; replaced by `transform: translateX()`

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Drawer width `w-72 max-w-[80vw]` is appropriate | Code Examples | Visual mismatch — adjust width in implementation; low functional risk |
| A2 | Transition duration `300ms` feels right for mobile | Code Examples | Could feel sluggish or too fast — trivially tunable in one place |

**All other claims were verified against official Tailwind docs or the project codebase.**

## Open Questions

1. **Drawer content scroll on very small phones**
   - What we know: The current menu has 4-5 items — very short
   - What's unclear: Whether any future items could make the drawer taller than the viewport
   - Recommendation: Add `overflow-y-auto` to the drawer panel now as a safety measure; no functional impact today

## Environment Availability

Step 2.6: SKIPPED — Phase is purely React/CSS changes, no external CLI tools, services, or runtimes required beyond the existing project build tooling.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected in project (no vitest.config.*, jest.config.*, pytest.ini found) |
| Config file | None — Wave 0 gap |
| Quick run command | `npm run lint` (type-check + lint as proxy) |
| Full suite command | `npm run lint && tsc -b --noEmit` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MENU-01 | Drawer slides in from left at non-full width | manual-only | — visual | N/A |
| MENU-02 | Drawer slides back out on close | manual-only | — visual | N/A |
| MENU-03 | Backdrop appears, tap closes drawer | manual-only | — visual | N/A |

**Note:** All three requirements are CSS animation and interaction behaviors that cannot be verified by a unit test without a full browser environment. Type-checking (`tsc -b`) and lint (`npm run lint`) serve as the automated gate confirming no TypeScript errors and no lint violations were introduced. Visual verification is the acceptance gate for this phase.

### Sampling Rate

- **Per task commit:** `npm run lint`
- **Per wave merge:** `tsc -b && npm run lint`
- **Phase gate:** Type-check + lint green AND manual visual check of all 4 success criteria before `/gsd-verify-work`

### Wave 0 Gaps

- No unit test framework installed — MENU-01/02/03 are visual-only; no test files needed
- `tsc -b && npm run lint` serves as the automated regression gate

## Security Domain

No security-sensitive changes in this phase. The drawer contains only navigation links and modal triggers — no user input, no data handling, no authentication surfaces. ASVS categories V2–V6 do not apply. `security_enforcement` is absent from config (treated as enabled), but this phase has no applicable threat surface.

## Sources

### Primary (HIGH confidence)
- [tailwindcss.com/docs/translate](https://tailwindcss.com/docs/translate) — translate-x-full, -translate-x-full, translate-x-0 utilities confirmed
- [tailwindcss.com/docs/transition-property](https://tailwindcss.com/docs/transition-property) — transition-transform, duration-*, ease-in-out confirmed; default duration 150ms
- Project codebase — `src/components/HamburgerMenu.tsx`, `src/App.tsx`, `src/index.css` read directly

### Secondary (MEDIUM confidence)
- [tailwindcss.com/docs/transition-property](https://tailwindcss.com/docs/transition-property) — transition-opacity utility confirmed for backdrop fade

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed; no new dependencies
- Architecture: HIGH — pattern verified against official Tailwind docs and current codebase
- Pitfalls: HIGH — derived from direct codebase reading (confirmed existing safe-area-inset handling, overflow-hidden on body) and known CSS transition behavior

**Research date:** 2026-04-10
**Valid until:** 2026-05-10 (Tailwind v4 is stable; CSS transitions are stable)
