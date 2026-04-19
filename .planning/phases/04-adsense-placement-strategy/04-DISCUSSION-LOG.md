# Phase 4: AdSense Placement Strategy - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-19
**Phase:** 04-adsense-placement-strategy
**Areas discussed:** Ad zones, Density rules, Strategy scope, Document format

---

## Ad zones

| Option | Description | Selected |
|--------|-------------|----------|
| Station card only | Keep ads in popup tooltip only | ✓ |
| Banner below map | Persistent bottom banner above stats bar | |
| Hamburger menu | Ad inside menu drawer | |
| Full-page interstitial | Ad shown on first load after consent | ✓ |

**User's choice:** Station card (active) + full-page interstitial (document only, not implement)
**Notes:** Interstitial is to be documented as a planned future zone, not implemented in this phase.

---

## Density rules

| Option | Description | Selected |
|--------|-------------|----------|
| 1 ad at a time | Only currently-open card shows an ad | ✓ |
| Unlimited | Each open tooltip renders its own slot | |
| 1 per session | Station card ad shows once per page load | |

**User's choice:** 1 ad at a time

| Option | Description | Selected |
|--------|-------------|----------|
| Once per session | Interstitial max once per browser session | ✓ |
| Once per day | Cap per 24h via localStorage | |
| No cap | Let AdSense control frequency | |

**User's choice:** Once per session (for interstitial)

---

## Strategy scope

| Option | Description | Selected |
|--------|-------------|----------|
| Current + planned zones | Station card (active) + interstitial (planned) | ✓ |
| Current only | Station card slot only | |
| Full future-proof spec | All speculative zones included | |

**User's choice:** Current + planned zones — with "future consideration" markers for anything beyond.

---

## Document format

| Option | Description | Selected |
|--------|-------------|----------|
| Dev reference | Scannable Markdown for next developer | ✓ |
| Formal spec | Structured with rationale sections | |
| Minimal checklist | Bullet list of constraints only | |

**User's choice:** Dev reference — practical, scannable, audience is the next developer implementing ad units.

---

## Claude's Discretion

- Exact section structure and headings within the strategy document
- Whether to include an AdSense policy reminder section
- How to surface the `ADS_ENABLED = false` flag and env-var gate in the document

## Deferred Ideas

- Bottom banner above stats bar — not accepted for this milestone
- Ad inside hamburger menu — not accepted
- Per-day interstitial cap — deferred to Phase 5
- Full speculative zone list — out of scope
