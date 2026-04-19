# AdSense Placement Strategy

**Phase:** 4 — AdSense Placement Strategy
**Document status:** Active — governs Phase 5 implementation
**Created:** 2026-04-19
**Audience:** Developer implementing Phase 5 ad units

---

## Overview

This document governs which UI zones are acceptable for ad placement in Prix Essence Québec, the density rules that apply to each zone, the slot ID assignments, and the consent gating requirements. Phase 5 implementers must read this document in full before writing any ad-related code. All decisions are locked (CONTEXT.md D-01 through D-07) and are not subject to unilateral change during Phase 5 execution. Any deviation from the zone table, density policy, or consent model below requires a strategy amendment approved before implementation begins.

---

## Ad Zone Table

| Zone | Status | Slot ID | Activation Gate | Mobile Constraint | Density Rule |
|------|--------|---------|-----------------|-------------------|--------------|
| Station Card Popup | ACTIVE (code exists; `ADS_ENABLED = false` keeps it dormant) | `3373913657` | `ADS_ENABLED = true` AND `VITE_ADSENSE_PUBLISHER_ID` env var set (see Activation Checklist) | Must not block map, price stats bar, or filter controls. Verify expanded card + ad does not push below stats bar on 375px viewport. | Max 1 active unit at a time (Leaflet tooltip model — only one card expands at a time) |
| Full-Page Interstitial | PLANNED — not implemented in Phase 4 or Phase 5 without a contract amendment | NONE — must be created in AdSense dashboard before implementation | `ADS_ENABLED = true` AND `getAdConsent() === 'accepted'` | Must render as a dismissible overlay above the map. Must not block map, stats bar, or filter controls. Not a layout-shifting element. | Once per browser session maximum. No localStorage tracking required at this stage. Trigger TBD in Phase 5 planning. |

---

## Density Policy

1. **Maximum 1 active ad unit at a time.** Only the currently-open station card shows an ad. No simultaneous multi-card ad rendering. The Leaflet tooltip model enforces this naturally — only one expanded card exists at a time. Do not wire ad rendering to override this constraint. If the Leaflet tooltip behavior changes in a future version, the density rule must be enforced explicitly in code.

2. **Interstitial (when implemented): once per browser session.** No per-day tracking required. A session cap must be checked before triggering the interstitial. No localStorage tracking is required at this stage — a module-level boolean flag is sufficient for session-scoped enforcement.

---

## Consent Gating

The consent infrastructure is fully implemented in `src/lib/adConsent.ts` and `src/components/ConsentBanner.tsx`. Do not re-implement it in Phase 5. Extend it only if a new zone requires a new consent surface.

| State | Behavior |
|-------|----------|
| `getAdConsent() === null` | ConsentBanner shown. No ad slots render. |
| `getAdConsent() === 'refused'` | No ad slots render. Banner dismissed. |
| `getAdConsent() === 'accepted'` | `loadAdSense()` called (only if `ADS_ENABLED === true`). Slots render when AdSense confirms fill. |
| `ADS_ENABLED === false` | Entire ad system bypassed. No banner, no slots. Current state. |

**Note:** Consent duration is 180 days (Loi 25 compliance), stored in `localStorage` key `'ad-consent'`.

---

## Activation Checklist

These are the steps a Phase 5 implementer must complete to go live with Zone 1 (Station Card Popup):

1. Set `ADS_ENABLED = true` in `src/lib/adConsent.ts` line 2. **Both this constant AND the env var below must be set — neither alone is sufficient.**
2. Set `VITE_ADSENSE_PUBLISHER_ID` in Netlify environment variables (or `.env.local` for dev). The `ADSENSE_CLIENT` constant in `Map.tsx` is derived from this env var; the ad HTML is omitted entirely when it is empty.
3. Rebuild and deploy. Confirm the consent banner appears (Loi 25 requirement).
4. Accept consent in the UI. Confirm `loadAdSense()` injects the AdSense `<script>` into `<head>`.
5. Confirm the station card popup renders the ad slot (`<ins class="adsbygoogle">` with `data-ad-slot="3373913657"`).
6. Verify on a 375px-wide viewport: expanded station card + ad does not obscure the price stats bar.
7. Preserve the CSS gate: `.station-card-ad-container { display: none }` and the `:has(.adsbygoogle[data-ad-status="filled"])` rule in `src/index.css` must remain. **Do not remove or override this gate** — it prevents layout shift from empty ad slots.

For Zone 2 (interstitial): a new slot must be created in the AdSense dashboard first. Slot ID does not yet exist. Do not begin implementation until a slot ID is available and a contract amendment is written for Phase 5.

---

## Existing Ad Slot Reference (Zone 1)

The `adSlotHtml` template is already wired into `src/components/Map.tsx`. Phase 5 does not need to re-create it — only activate it.

```typescript
// src/components/Map.tsx lines 90-101
const adSlotHtml = ADSENSE_CLIENT.trim()
  ? `<div class="station-card-ad-container">
       <div class="station-card-sep"></div>
       <ins class="adsbygoogle"
         style="display:block;width:250px"
         data-ad-client="${esc(ADSENSE_CLIENT)}"
         data-ad-slot="3373913657"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
       <div class="station-card-sep"></div>
     </div>`
  : ''
```

The CSS visibility gate is already present in `src/index.css`:

```css
/* src/index.css lines 175-182 */
.station-card-ad-container {
  display: none;
}
.station-card-ad-container:has(.adsbygoogle[data-ad-status="filled"]) {
  display: block;
}
```

**Note:** The ad element width is 250px fixed. `data-full-width-responsive="true"` is set but the container enforces 250px. Do not modify these values.

---

## Common Pitfalls

> **Pitfall 1 — Missing ADS_ENABLED:** Setting `VITE_ADSENSE_PUBLISHER_ID` alone shows no ads. Both `ADS_ENABLED = true` in `src/lib/adConsent.ts` AND the env var must be set. If either is missing, no ads appear and no error is thrown — the system silently bypasses the ad layer.

> **Pitfall 2 — Removing the CSS gate:** The `display: none` default on `.station-card-ad-container` and the `:has(.adsbygoogle[data-ad-status="filled"])` rule prevent layout shift when an ad slot is unfilled. Do not remove or override them. If the `:has()` rule is removed, empty ad containers will take up space and break the station card layout.

> **Pitfall 3 — Assuming interstitial slot ID exists:** No slot ID exists yet for Zone 2 (Full-Page Interstitial). The slot must be created in the AdSense dashboard before any Phase 5 interstitial implementation begins. Do not use the Zone 1 slot ID (`3373913657`) for the interstitial — they are distinct slot types.

> **Pitfall 4 — Stacking multiple ad units:** Multiple open station cards should not each show an ad simultaneously. The density rule is 1 active unit maximum. The current Leaflet tooltip model enforces this because only one expanded card exists at a time. Do not break this constraint by changing how tooltips are opened or persisted.

> **Pitfall 5 — Out-of-scope zones:** Bottom banner, hamburger menu ad, and sidebar ad are not currently acceptable placements. Do not implement them without a new strategy amendment for a future milestone. Implementing any of these zones without a contract amendment is a scope violation.

---

## Future Considerations

The zones below were considered during Phase 4 planning. They are not currently acceptable placements and must not be implemented without a strategy amendment for a future milestone.

- Bottom banner above price stats bar — considered, not accepted for this milestone
- Ad inside hamburger menu drawer — considered, not accepted
- Sidebar ad — no sidebar component exists

---

## Out of Scope

This document does NOT cover:

- AdSense account creation or ad unit configuration (done outside the codebase, in the AdSense dashboard)
- Activation of `ADS_ENABLED` (out of scope for Phase 4; Phase 5 concern)
- Interstitial trigger event (to be defined in Phase 5 planning)
- Per-day impression caps (deferred; session cap is sufficient for now)
- Any zone not listed in the Ad Zone Table above
