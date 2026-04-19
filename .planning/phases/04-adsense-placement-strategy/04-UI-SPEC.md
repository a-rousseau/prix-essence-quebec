---
phase: 4
slug: adsense-placement-strategy
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-19
---

# Phase 4 — UI Design Contract

> Visual and interaction contract for Phase 4: AdSense Placement Strategy.
> This phase produces a documentation deliverable (`.planning/ADS-STRATEGY.md`), not new UI components.
> The contracts below define the visual constraints that the ADS-STRATEGY.md document must capture
> for Phase 5 implementers. No new components are built in this phase.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none — no shadcn; Tailwind v4 config-free mode |
| Preset | not applicable |
| Component library | none (Leaflet tooltip HTML + Tailwind utility classes) |
| Icon library | lucide-react |
| Font | system-ui, -apple-system, sans-serif (as declared in `src/index.css`) |

Source: CLAUDE.md tech stack + `src/index.css` root rule.

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding |
| sm | 8px | Station card inner padding, ad separator margin |
| md | 16px | Default element spacing |
| lg | 24px | Section padding |
| xl | 32px | Layout gaps |
| 2xl | 48px | Major section breaks |
| 3xl | 64px | Page-level spacing |

Exceptions:
- Station card compact padding is 5px vertical / 8px horizontal (existing code — do not change).
- Ad container separator (`station-card-sep`) is 1px height with 8px bottom margin (existing code — do not change).
- Touch target minimum for any future ad close/dismiss control: 44px (mobile accessibility floor).

Source: `src/index.css` `.station-card-compact`, `.station-card-sep` rules.

---

## Typography

Existing type scale extracted from `src/index.css` — no new sizes may be introduced in Phase 4 or 5 ad slots without a contract amendment.

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body / detail | 14px | 400 | 1.3 |
| Label / compact card | 11px | 600 | 1 (single line) |
| Price (compact) | 14px | 700 | 1 |
| Price (expanded) | 24px | 900 | 1 |
| Cluster count | 12px | 700 | 1 |

Ad slot constraint: The `<ins class="adsbygoogle">` block inside `.station-card-ad-container` renders
AdSense-controlled content. No project typography rules apply to the ad creative itself.
The container enforces `width: 250px` and `display: block`. These values are locked.

Source: `src/index.css` typography declarations (lines 100–165).

---

## Color

Existing color contract extracted from `src/index.css` — ad containers must not introduce new surface colors.

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #ffffff | Station card background, page surfaces |
| Secondary (30%) | #1e3a5f | Price text, cluster icon background, header nav |
| Accent (10%) | #374151 | Station name text, address text, secondary labels |
| Separator | #f3f4f6 | `station-card-sep` — ad slot boundary line |
| Destructive | not applicable | No destructive actions in this phase |

Accent reserved for: station name labels, address text, secondary detail text. Not for ad borders or ad container backgrounds.

Ad slot constraint: The `.station-card-ad-container` must remain background-less (no fill color).
The 1px `#f3f4f6` separator above and below the ad slot is the only visual boundary permitted.

Source: `src/index.css` color values (lines 80–196), CONTEXT.md D-03.

---

## Ad Zone Visual Contracts

These contracts must be reproduced verbatim in `.planning/ADS-STRATEGY.md` as binding constraints for Phase 5 implementers.

### Zone 1: Station Card Popup (Active)

| Property | Constraint |
|----------|------------|
| Slot ID | `3373913657` |
| Publisher ID source | `VITE_ADSENSE_PUBLISHER_ID` env var → `ADSENSE_CLIENT` constant in `Map.tsx` |
| Container class | `.station-card-ad-container` |
| Ad element | `<ins class="adsbygoogle">` with `style="display:block;width:250px"` |
| Activation gate | `ADSENSE_CLIENT.trim()` must be non-empty; ad HTML is omitted entirely when empty |
| Display gate | CSS `:has(.adsbygoogle[data-ad-status="filled"])` — container is `display:none` until AdSense confirms fill |
| Width | 250px fixed |
| Responsive | `data-full-width-responsive="true"` and `data-ad-format="auto"` |
| Max active at once | 1 — only the currently-expanded station card shows an ad (Leaflet tooltip model enforces this naturally) |
| Consent gate | `ADS_ENABLED` must be `true` AND `getAdConsent()` must return `'accepted'` before `loadAdSense()` is called |
| Mobile constraint | Must not block map view, price stats bar, or filter controls. The card expands downward within the map viewport; implementers must verify the expanded card + ad does not push below the stats bar on 375px-wide screens |
| Separation | 1px `#f3f4f6` separator above the ad and below the ad (`.station-card-sep`) |

### Zone 2: Full-Page Interstitial (Planned — Not Active)

| Property | Constraint |
|----------|------------|
| Slot ID | To be assigned from AdSense dashboard — no slot ID exists yet |
| Status | Planned. Not implemented in Phase 4 or Phase 5 without a contract amendment |
| Session cap | Maximum once per browser session (no localStorage tracking required at this stage) |
| Mobile constraint | Must not block the map, price stats bar, or filter controls. Must render as a dismissible overlay above the map, not as a layout-shifting element |
| Trigger | To be defined in Phase 5 planning — not specified here |
| Consent gate | Same as Zone 1: `ADS_ENABLED = true` AND `getAdConsent() === 'accepted'` |

### Zones Explicitly Out of Scope

The following zones must NOT appear in ADS-STRATEGY.md as acceptable placements for this milestone:

- Bottom banner above price stats bar
- Ad inside hamburger menu drawer
- Sidebar ad (no sidebar exists)

These may be noted under a "Future Considerations" section in ADS-STRATEGY.md but must be marked
"not currently acceptable — out of scope for this milestone."

Source: CONTEXT.md D-02, D-03, D-04, D-05, D-06.

---

## Interaction Contracts

### Consent Flow (Existing — No Changes in Phase 4)

The consent infrastructure is fully implemented. The ADS-STRATEGY.md must reference it, not re-specify it.

| State | Behavior |
|-------|----------|
| `getAdConsent() === null` | `ConsentBanner.tsx` is shown. No ad slots render. |
| `getAdConsent() === 'refused'` | No ad slots render. Banner dismissed. |
| `getAdConsent() === 'accepted'` | `loadAdSense()` is called (if `ADS_ENABLED === true`). Ad slots render when filled. |
| `ADS_ENABLED === false` | Entire ad system is bypassed regardless of consent. No banner, no slots. |

Consent duration: 180 days (6 months per Loi 25 requirement), stored in `localStorage` key `'ad-consent'`.

Source: `src/lib/adConsent.ts` (entire file).

### Ad Slot Visibility (Existing CSS Gate)

The `.station-card-ad-container` uses `display: none` by default and only becomes visible when AdSense
has confirmed a filled ad (`data-ad-status="filled"`). This prevents layout shift from empty ad slots.
Phase 5 implementers must preserve this CSS gate and not override it.

Source: `src/index.css` lines 176–182.

---

## Copywriting Contract

This phase produces no user-facing UI strings beyond what already exists in `ConsentBanner.tsx`.
All copy is in fr-CA (project-wide constraint from CLAUDE.md).

| Element | Copy |
|---------|------|
| Primary CTA | not applicable — no new CTAs in Phase 4 |
| Empty state | not applicable — no new empty states |
| Error state | not applicable — no new error surfaces |
| Destructive confirmation | not applicable — no destructive actions |
| Consent banner (existing) | Managed by `ConsentBanner.tsx` — do not modify in this phase |

ADS-STRATEGY.md itself is a developer-facing document in English (developer audience). All user-facing
copy referenced within it (e.g., consent banner text) remains fr-CA.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not applicable |
| Third-party | none | not applicable |

No new components, no new dependencies, no registry blocks in Phase 4.

---

## Phase 5 Implementer Checklist

Constraints the ADS-STRATEGY.md must communicate to Phase 5:

- [ ] Verify expanded station card + ad does not obscure the price stats bar on 375px viewport
- [ ] Verify `ADS_ENABLED = true` activation path: set constant, rebuild, confirm banner appears, accept consent, confirm ad renders
- [ ] Verify `VITE_ADSENSE_PUBLISHER_ID` is set in Netlify environment variables before enabling
- [ ] Preserve `display: none` CSS gate on `.station-card-ad-container` — do not remove the `:has()` rule
- [ ] Max 1 active ad unit at any time — do not wire multiple simultaneous slot renders
- [ ] Any interstitial zone requires a new slot ID from the AdSense dashboard before implementation

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
