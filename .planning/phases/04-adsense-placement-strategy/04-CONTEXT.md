# Phase 4: AdSense Placement Strategy - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Produce `.planning/ADS-STRATEGY.md` — a written, developer-facing reference document that specifies: acceptable ad zones, density rules, slot ID mapping, and consent gating reminders.

Scope: document only — no new ad unit code in this phase.

</domain>

<decisions>
## Implementation Decisions

### Ad zones
- **D-01:** Two zones are in scope for the strategy document:
  - **Station card popup** (active) — one `<ins class="adsbygoogle">` slot already wired in `Map.tsx`, slot ID `3373913657`. This is the only currently enabled zone.
  - **Full-page interstitial** (planned) — document as a future zone. No implementation in this phase.
- **D-02:** All other zones (bottom banner, hamburger menu, sidebar) are out of scope for this milestone. The document may note them under "future considerations" but must not spec them as acceptable placements now.
- **D-03:** No ad zone may block the map, price stats bar, or filter controls on any mobile viewport. This is a hard constraint for all current and future zones.

### Density rules
- **D-04:** Max **1 active ad unit at a time** — only the currently-open station card shows an ad. No stacking across multiple open tooltips.
- **D-05:** Interstitial (when implemented): **once per browser session** maximum. Standard session cap; no per-day localStorage tracking needed at this stage.

### Strategy scope
- **D-06:** Cover station card (active) and interstitial (planned). Mark speculative future zones clearly as "future consideration — not currently acceptable." Document is forward-looking but not speculative beyond these two zones.

### Document format
- **D-07:** Developer reference style — scannable Markdown with practical sections: zone table with slot IDs and constraints, density policy, consent gating reminder. Not a formal spec. Audience is the next dev implementing Phase 5 ad units.

### Claude's Discretion
- Exact section structure and headings within the strategy doc
- Whether to include an AdSense policy reminder section (acceptable — keep it short)
- How to handle the `ADS_ENABLED = false` flag mention in the doc (just note it exists; activation is out of scope)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing ad infrastructure
- `src/lib/adConsent.ts` — `ADS_ENABLED` constant (currently `false`), `loadAdSense()`, `getAdConsent()`, `ADSENSE_PUBLISHER_ID` from env. Consent gating is fully implemented here.
- `src/components/Map.tsx` lines 90–101 — `adSlotHtml` template with slot ID `3373913657` inside station card popup. This is the only active slot.
- `src/App.tsx` lines 29–30, 36, 103, 162 — How `ADS_ENABLED` gates consent banner and `loadAdSense()` call.
- `src/components/ConsentBanner.tsx` — Loi 25 / GDPR consent UI already in place.

### Requirements
- `ADS-01`, `ADS-02` in `.planning/REQUIREMENTS.md` — acceptance criteria for this phase.

### Output location
- The strategy document must be written to `.planning/ADS-STRATEGY.md` — this is the deliverable the phase success criteria check for.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Consent infrastructure is complete — the strategy doc only needs to reference it, not spec it.
- One slot ID already in use: `3373913657` (station card). Any future zones will need new slot IDs from AdSense dashboard.

### Established Patterns
- `ADS_ENABLED = false` is the activation gate — the strategy doc should make this explicit so the next dev knows how to turn on each zone.
- Publisher ID is sourced from `VITE_ADSENSE_PUBLISHER_ID` env var — document this in the slot ID table.

### Integration Points
- The strategy document will feed directly into Phase 5 (AdSense implementation). It is the spec that executor agents will implement.

</code_context>

<specifics>
## Specific Ideas

- The station card ad is already display-blocked when `ADSENSE_CLIENT` (derived from `VITE_ADSENSE_PUBLISHER_ID`) is empty — the strategy doc should note this env-var gate.
- Density policy "1 ad at a time" aligns with the Leaflet tooltip model: only one expanded card is realistically visible at a time.

</specifics>

<deferred>
## Deferred Ideas

- Bottom banner above stats bar — considered, not accepted for this milestone
- Ad inside hamburger menu — considered, not accepted
- Per-day interstitial cap via localStorage — noted, deferred to Phase 5 when interstitial is implemented
- Full speculative zone list — out of scope; document stays scoped to two zones

</deferred>

---

*Phase: 04-adsense-placement-strategy*
*Context gathered: 2026-04-19*
