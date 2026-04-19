# Phase 4: AdSense Placement Strategy - Research

**Researched:** 2026-04-19
**Domain:** Documentation — AdSense placement strategy for a mobile-first PWA
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Two zones are in scope: Station card popup (active, slot ID `3373913657`) and Full-page interstitial (planned, future zone — no implementation in this phase).
- **D-02:** All other zones (bottom banner, hamburger menu, sidebar) are out of scope for this milestone. May be noted under "future considerations" but must NOT be listed as acceptable placements.
- **D-03:** No ad zone may block the map, price stats bar, or filter controls on any mobile viewport. Hard constraint for all current and future zones.
- **D-04:** Max 1 active ad unit at a time — only the currently-open station card shows an ad. No stacking.
- **D-05:** Interstitial (when implemented): once per browser session maximum. No per-day localStorage tracking at this stage.
- **D-06:** Cover station card (active) and interstitial (planned). Mark speculative future zones clearly as "future consideration — not currently acceptable."
- **D-07:** Developer reference style — scannable Markdown. Audience: next dev implementing Phase 5 ad units.

### Claude's Discretion

- Exact section structure and headings within the strategy doc
- Whether to include an AdSense policy reminder section (acceptable — keep it short)
- How to handle the `ADS_ENABLED = false` flag mention (just note it exists; activation is out of scope)

### Deferred Ideas (OUT OF SCOPE)

- Bottom banner above stats bar
- Ad inside hamburger menu
- Per-day interstitial cap via localStorage
- Full speculative zone list
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ADS-01 | A written placement strategy document exists in `.planning/` that specifies: which UI zones are acceptable for ads, density rules (max ads per view), and which slot IDs to use — consent gating is already implemented via `ADS_ENABLED` constant in `src/lib/adConsent.ts`, activation is out of scope | All zone, slot ID, and density details verified directly from codebase; document structure researched and defined below |
| ADS-02 | The strategy accounts for mobile-first constraints (no ads blocking the map, stats bar, or filter controls) | Mobile constraints documented from UI-SPEC and confirmed via App.tsx layout analysis |
</phase_requirements>

---

## Summary

Phase 4 is a documentation-only phase. The single deliverable is `.planning/ADS-STRATEGY.md` — a developer-facing reference that specifies two ad zones, one density rule, one slot ID, and the consent gating model. No new code is written.

All decisions are locked via CONTEXT.md and the UI-SPEC is already approved. Research confirms the existing codebase already has a working ad slot (station card popup, slot ID `3373913657`) and a complete consent infrastructure (`adConsent.ts`). The strategy document needs to codify what is already built, specify constraints for what is planned (interstitial), and draw a clear boundary around what is out of scope.

The planner's only task is to produce one Markdown file with the correct content sections. This is a write-once documentation task, not an engineering task. The research below maps every content requirement to a verified code location so the plan can be maximally specific.

**Primary recommendation:** The plan should have a single wave with a single task: write `.planning/ADS-STRATEGY.md` using the content inventory below. No sub-tasks, no iterations.

---

## Standard Stack

This phase introduces no new libraries, packages, or tooling. [VERIFIED: codebase grep — no new dependencies required]

The deliverable is a Markdown file. The existing infrastructure that the document describes:

| Asset | Location | Purpose |
|-------|----------|---------|
| `ADS_ENABLED` flag | `src/lib/adConsent.ts` line 2 | Global on/off gate; currently `false` |
| `ADSENSE_PUBLISHER_ID` | `src/lib/adConsent.ts` line 6 | Sourced from `VITE_ADSENSE_PUBLISHER_ID` env var |
| `loadAdSense()` | `src/lib/adConsent.ts` lines 38-51 | Injects AdSense `<script>` tag into `<head>` |
| `getAdConsent()` | `src/lib/adConsent.ts` lines 13-27 | Returns `'accepted' \| 'refused' \| null` |
| `saveConsent()` | `src/lib/adConsent.ts` lines 29-32 | Persists consent with 6-month TTL |
| Slot ID `3373913657` | `src/components/Map.tsx` line 96 | Only active ad slot; station card popup |
| `ADSENSE_CLIENT` constant | `src/components/Map.tsx` line 9 | `import.meta.env.VITE_ADSENSE_PUBLISHER_ID ?? ''` |
| `.station-card-ad-container` | `src/index.css` lines 175-182 | `display:none` by default; shown via `:has([data-ad-status="filled"])` |
| `ConsentBanner.tsx` | `src/components/ConsentBanner.tsx` | Loi 25 consent UI; fr-CA copy |
| ADS_ENABLED gate in App.tsx | `src/App.tsx` lines 29-30, 36, 162 | Controls banner visibility and `loadAdSense()` invocation |

[VERIFIED: direct file reads of all listed paths]

---

## Architecture Patterns

### Deliverable Structure

The ADS-STRATEGY.md file the planner writes must contain the following sections (in this order):

1. **Header** — Phase reference, date, status (active zones vs. planned zones)
2. **Zone Table** — One row per zone with: zone name, status, slot ID, activation gate, mobile constraint, density rule
3. **Density Policy** — "1 active ad unit at a time" rule + interstitial session cap
4. **Consent Gating** — Reference to existing infrastructure (not re-specification)
5. **Activation Checklist** — Steps a Phase 5 implementer must follow to go live
6. **Future Considerations** — Deferred zones listed as "not currently acceptable"
7. **Out of Scope** — Explicit list of excluded zones

### Zone: Station Card Popup (Active)

All details verified directly from codebase. [VERIFIED: `src/components/Map.tsx` lines 9, 90-101; `src/index.css` lines 175-182; `src/lib/adConsent.ts`]

| Property | Value | Source |
|----------|-------|--------|
| Status | Active (code exists; `ADS_ENABLED = false` keeps it dormant) | `src/lib/adConsent.ts` line 2 |
| Slot ID | `3373913657` | `src/components/Map.tsx` line 96 |
| Publisher ID | From `VITE_ADSENSE_PUBLISHER_ID` env var → `ADSENSE_CLIENT` constant | `src/components/Map.tsx` line 9 |
| Container class | `.station-card-ad-container` | `src/components/Map.tsx` line 91 |
| Ad element | `<ins class="adsbygoogle" style="display:block;width:250px">` | `src/components/Map.tsx` lines 92-99 |
| Activation gate | `ADSENSE_CLIENT.trim()` non-empty → ad HTML rendered; empty → `adSlotHtml = ''` | `src/components/Map.tsx` lines 90-101 |
| Visibility gate | CSS `:has(.adsbygoogle[data-ad-status="filled"])` → `display:block` | `src/index.css` lines 179-182 |
| Default container state | `display:none` | `src/index.css` lines 175-177 |
| Separator | 1px `#f3f4f6` above and below via `.station-card-sep` | `src/index.css` lines 169-173 |
| Max concurrent | 1 (Leaflet tooltip model allows only one expanded card at a time) | `src/components/Map.tsx` ClusterLayer logic |
| Consent requirement | `ADS_ENABLED === true` AND `getAdConsent() === 'accepted'` before `loadAdSense()` | `src/App.tsx` lines 29-30 |
| Mobile constraint | Must not push expanded card below the price stats bar on 375px viewport | `src/App.tsx` layout; CONTEXT.md D-03 |

### Zone: Full-Page Interstitial (Planned)

All details from CONTEXT.md locked decisions; no code exists yet. [VERIFIED: codebase grep found no interstitial slot]

| Property | Value |
|----------|-------|
| Status | Planned — not implemented in Phase 4 or Phase 5 without a contract amendment |
| Slot ID | None yet — must be assigned from AdSense dashboard before implementation |
| Session cap | Maximum once per browser session |
| Session tracking | No localStorage tracking required at this stage |
| Trigger | To be defined in Phase 5 planning — not specified in Phase 4 strategy |
| Mobile constraint | Must render as a dismissible overlay above the map, not as a layout-shifting element. Must not block map, stats bar, or filter controls |
| Consent requirement | Same as Zone 1: `ADS_ENABLED === true` AND `getAdConsent() === 'accepted'` |

### Consent Flow (Existing — No Changes)

[VERIFIED: `src/lib/adConsent.ts`, `src/App.tsx`, `src/components/ConsentBanner.tsx`]

| State | Behavior |
|-------|----------|
| `getAdConsent() === null` | `ConsentBanner.tsx` shown. No ad slots render. |
| `getAdConsent() === 'refused'` | No ad slots render. Banner dismissed. |
| `getAdConsent() === 'accepted'` | `loadAdSense()` called (if `ADS_ENABLED === true`). Slots render when filled. |
| `ADS_ENABLED === false` | Entire ad system bypassed regardless of consent. No banner, no slots. |

Consent duration: 180 days (6 months per Loi 25), stored in `localStorage` key `'ad-consent'`. [VERIFIED: `src/lib/adConsent.ts` lines 3-5]

### App Layout — Mobile Constraint Mapping

[VERIFIED: `src/App.tsx` full read]

The app layout is `h-dvh flex flex-col`:
- `flex-1 min-h-0` — map layer (fills remaining space)
  - `z-[1001]` — filter controls (hamburger + search + FilterPanel) — absolutely positioned top-left
  - Map canvas fills this container
- `PriceStatsBar` — rendered at bottom of flex column, always visible when `stations.length > 0`

An expanded station card popup (Leaflet tooltip) appears inside the map layer. The ad within the card must not push content below `PriceStatsBar`. This is the D-03 mobile constraint. Phase 5 implementers must verify on a 375px viewport.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Consent storage | Custom consent system | Existing `adConsent.ts` — fully implemented |
| Ad slot HTML | Custom ad component | Existing `adSlotHtml` template in `Map.tsx` |
| Script injection | Custom loader | Existing `loadAdSense()` in `adConsent.ts` |
| Ad visibility gating | JS-based show/hide | Existing CSS `:has([data-ad-status="filled"])` rule |

**Key insight:** The document being written in Phase 4 must point implementers to these existing assets. Phase 5 must not re-implement any of these; it only activates (`ADS_ENABLED = true`) and extends (interstitial zone, if pursued).

---

## Runtime State Inventory

> Not applicable — this is a greenfield documentation phase. No rename, refactor, or migration involved.

---

## Common Pitfalls

### Pitfall 1: Omitting the `ADS_ENABLED = false` warning

**What goes wrong:** Phase 5 implementer sets `VITE_ADSENSE_PUBLISHER_ID` in their env, sees no ads, does not know why.
**Why it happens:** The env var alone is not sufficient; `ADS_ENABLED` must also be set to `true` in `adConsent.ts`.
**How to avoid:** ADS-STRATEGY.md must call out both gates explicitly: env var AND `ADS_ENABLED` constant. Both must be true.

### Pitfall 2: Specifying zones that are out of scope

**What goes wrong:** A future dev reads the strategy and implements a bottom banner because it appears in the doc.
**Why it happens:** Ambiguous "future considerations" language gets treated as acceptance.
**How to avoid:** The document must use explicit language: "NOT CURRENTLY ACCEPTABLE — out of scope for this milestone" for any zone that is not the station card popup.

### Pitfall 3: Assuming the interstitial slot ID exists

**What goes wrong:** Phase 5 implementer searches the codebase for the interstitial slot ID and can't find it.
**Why it happens:** The slot ID for Zone 2 has not yet been created in the AdSense dashboard.
**How to avoid:** ADS-STRATEGY.md must state clearly: "No slot ID exists yet for the interstitial zone. A new slot must be created in the AdSense dashboard before implementation."

### Pitfall 4: Removing the CSS visibility gate

**What goes wrong:** Layout shift appears when ad slot is empty (not filled by AdSense).
**Why it happens:** Developer removes `display:none` default or the `:has()` CSS rule, thinking it is unnecessary.
**How to avoid:** Strategy doc must call this out as a "preserve this" constraint for Phase 5.

### Pitfall 5: Stacking multiple ad units

**What goes wrong:** Multiple station cards show ads simultaneously (e.g., if Leaflet tooltip behavior changes).
**Why it happens:** Developer wires ad rendering to card render without checking the density rule.
**How to avoid:** Density policy "max 1 active unit at a time" must be prominently stated and the current Leaflet enforcement mechanism explained.

---

## Code Examples

### Existing ad slot template (Zone 1, active)

```typescript
// Source: src/components/Map.tsx lines 90-101
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

### CSS visibility gate (existing — must not be removed)

```css
/* Source: src/index.css lines 175-182 */
.station-card-ad-container {
  display: none;
}

.station-card-ad-container:has(.adsbygoogle[data-ad-status="filled"]) {
  display: block;
}
```

### Consent + activation gate in App.tsx

```typescript
// Source: src/App.tsx lines 29-30, 36, 103, 162
const initialConsent = getAdConsent()
if (ADS_ENABLED && initialConsent === 'accepted') loadAdSense()

const [showBanner, setShowBanner] = useState(ADS_ENABLED && initialConsent === null)

function handleConsent(accepted: boolean) {
  if (accepted) loadAdSense()
  setShowBanner(false)
}

{showBanner && <ConsentBanner onConsent={handleConsent} />}
```

---

## State of the Art

This phase does not involve library version selection. AdSense integration patterns are stable.

| Constraint | Current Approach | Notes |
|------------|-----------------|-------|
| Ad visibility | CSS `:has([data-ad-status="filled"])` | Modern CSS; prevents layout shift from unfilled slots |
| Consent duration | 180 days (Loi 25 compliant) | 6-month TTL encoded in `adConsent.ts` |
| Script loading | Deferred `<script async>` injection via `loadAdSense()` | No blocking; only loads after consent accepted |
| Slot env-gating | `ADSENSE_CLIENT.trim()` check | Ad HTML omitted entirely if publisher ID is missing |

---

## Environment Availability

Step 2.6: SKIPPED — this is a documentation-only phase. No external tools, services, CLIs, runtimes, or package installs are required to write `.planning/ADS-STRATEGY.md`.

---

## Validation Architecture

`nyquist_validation` is enabled in `.planning/config.json`. However, this phase produces a Markdown file, not executable code. Automated test coverage is not applicable.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — documentation deliverable |
| Config file | Not applicable |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ADS-01 | `.planning/ADS-STRATEGY.md` exists with required sections | manual-only | `ls .planning/ADS-STRATEGY.md` (existence check only) | Will be created |
| ADS-02 | Strategy doc states mobile constraint explicitly | manual-only | Content review — no automation possible | Will be created |

**Manual-only justification:** ADS-01 and ADS-02 require a human or the verifier agent to review document content for completeness and accuracy. Content quality cannot be asserted via automated test commands. The verifier (`/gsd-verify-work`) will check against the acceptance criteria in REQUIREMENTS.md.

### Sampling Rate
- **Per task commit:** `ls -la .planning/ADS-STRATEGY.md` (file existence only)
- **Per wave merge:** Verifier content review against ADS-01 and ADS-02 acceptance criteria
- **Phase gate:** Content-complete review before `/gsd-verify-work`

### Wave 0 Gaps
None — no test infrastructure required for a documentation deliverable.

---

## Security Domain

No new code is introduced in Phase 4. The strategy document references existing consent infrastructure which is already implemented and reviewed. No ASVS controls are applicable to a Markdown documentation file.

> Security enforcement applies to code phases. This phase produces no executable code, no API endpoints, no data handling, and no new UI surfaces.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The interstitial zone has no slot ID in AdSense dashboard yet | Architecture Patterns — Zone 2 | Low: easily verifiable by checking AdSense account; does not affect this phase's deliverable |
| A2 | `nyquist_validation: true` does not require automated tests for documentation deliverables | Validation Architecture | Low: verifier agent can evaluate content manually |

---

## Open Questions

1. **Interstitial trigger event**
   - What we know: The interstitial zone is planned with a once-per-session cap.
   - What's unclear: What user action or timing event will trigger it (CONTEXT.md says "To be defined in Phase 5 planning").
   - Recommendation: ADS-STRATEGY.md should note "trigger: TBD in Phase 5 planning" — do not speculate or lock a trigger in the strategy document.

2. **Future zone list depth**
   - What we know: Bottom banner and hamburger menu ad are deferred.
   - What's unclear: Whether to list other possible zones (interstitial on page load, between route changes, etc.) under "Future Considerations."
   - Recommendation: Keep "Future Considerations" strictly to the two deferred zones explicitly named in CONTEXT.md (bottom banner, hamburger menu). Do not speculate beyond what the user discussed.

---

## Sources

### Primary (HIGH confidence)
- `src/lib/adConsent.ts` — Full read: `ADS_ENABLED`, `loadAdSense()`, `getAdConsent()`, consent TTL, publisher ID source
- `src/components/Map.tsx` lines 1-101 — Full read: `ADSENSE_CLIENT` constant, `adSlotHtml` template, slot ID `3373913657`
- `src/index.css` — CSS for `.station-card-ad-container`, `.station-card-sep`, `:has()` visibility gate (lines 169-182)
- `src/App.tsx` lines 25-165 — Full read: ADS_ENABLED gating, consent flow, layout structure
- `src/components/ConsentBanner.tsx` — Full read: consent UI, fr-CA copy
- `.planning/phases/04-adsense-placement-strategy/04-CONTEXT.md` — Full read: all locked decisions D-01 through D-07
- `.planning/phases/04-adsense-placement-strategy/04-UI-SPEC.md` — Full read: visual contracts for both zones
- `.planning/REQUIREMENTS.md` — Full read: ADS-01 and ADS-02 acceptance criteria
- `.planning/config.json` — Full read: `nyquist_validation: true`, `commit_docs: true`

### Secondary (MEDIUM confidence)
None applicable — all findings sourced from the codebase directly.

### Tertiary (LOW confidence)
None.

---

## Metadata

**Confidence breakdown:**
- Deliverable content: HIGH — all required content is directly verifiable from the codebase and locked decisions
- Zone constraints: HIGH — sourced from actual code (`Map.tsx`, `index.css`, `adConsent.ts`)
- Density rules: HIGH — locked in CONTEXT.md D-04, D-05
- Validation approach: HIGH — documentation deliverable, manual review only; no automated test gap risk

**Research date:** 2026-04-19
**Valid until:** 2026-05-19 (stable — no third-party library changes; all sources are local codebase)
