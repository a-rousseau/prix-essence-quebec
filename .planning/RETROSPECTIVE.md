# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — UI Polish & Ad Strategy

**Shipped:** 2026-04-20
**Phases:** 5 (4 planned + 1 inserted) | **Plans:** 5 | **Timeline:** 17 days

### What Was Built

- BrandDropdown outside-click dismiss and mobile-safe height constraint (`maxHeight: calc(100dvh - 240px)`)
- HamburgerMenu refactored to always-mounted left-side slide drawer with animated backdrop
- PrivacyNotice + TrademarkNotice fixed with same always-mounted bottom-sheet pattern (Phase 02.1 — urgent insert)
- FilterOverlay: full-screen dark overlay + spinner on every filter change, 500ms minimum display
- ADS-STRATEGY.md: complete AdSense placement spec with zone table, density policy, consent gating, activation checklist

### What Worked

- The **always-mounted CSS toggle pattern** (translate/opacity) proved clean and reusable — applied identically to HamburgerMenu, PrivacyNotice, TrademarkNotice, and FilterOverlay within one milestone
- Phase 02.1 was inserted as an urgent decimal phase after Phase 02 exposed broken modal transitions; the insertion process was smooth and didn't disrupt milestone scope
- Phase 04 (documentation-only) was fastest to execute (~15min) — research and UI-SPEC artifacts did most of the pre-work
- Executor agents consistently caught ESLint issues and added missing ARIA attributes without being asked (Rule 2 enhancements)

### What Was Inefficient

- Phase 01 never got a formal VERIFICATION.md — only noticed at milestone audit. Should create VERIFICATION.md at phase completion, not retroactively
- SUMMARY frontmatter for Phase 03 wasn't updated after the 150ms → 500ms overlay duration change; documentation mismatch surfaced at audit
- Nyquist validation drafts exist for phases 02–04 but none reached `nyquist_compliant: true` — this was never a hard gate but accumulated as tech debt
- Worktree base reset during Phase 02 staged accidental planning file deletions; required a recovery commit

### Patterns Established

- **Always-mounted CSS toggle**: keep components in DOM, drive visibility with translate/opacity classes. Use this for any future drawer, modal, or overlay.
- **Pointer-events gating**: `pointer-events-none` on closed backdrops prevents map interaction bleed. Required on every backdrop.
- **Separate transition properties**: `transition-transform` on the panel, `transition-opacity` on the backdrop — never `transition-all`.
- **useRef + useEffect outside-click dismiss**: attach mousedown listener only when `open === true`; clean up on close.
- **`dvh` over `vh` for mobile panels**: `calc(100dvh - Npx)` handles address bar resize correctly.

### Key Lessons

1. Create VERIFICATION.md at the moment of phase completion — auditing retroactively forces guesswork about what was human-verified vs assumed.
2. When a deviation changes a documented value (e.g., 150ms → 500ms), update the SUMMARY immediately in the same commit.
3. Always-mounted pattern is non-negotiable for CSS exit animations. Document this in CLAUDE.md if future phases touch any animated UI element.
4. Phase insertions (decimal phases) work well for urgent scope additions — preserve integer phase numbering and don't delay the milestone.

### Cost Observations

- Model mix: not tracked per-session for this milestone
- Sessions: approximately 8–10 sessions across 17 days
- Notable: Documentation phases (04) were extremely low-cost relative to UI phases; research artifacts (RESEARCH.md, UI-SPEC.md) significantly reduced executor context requirements

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 5 | 5 | First milestone — established always-mounted pattern, phase insertion protocol |

### Cumulative Quality

| Milestone | Automated Tests | Coverage | Zero-Dep Additions |
|-----------|-----------------|----------|--------------------|
| v1.0 | 0 | 0% | 0 |

### Top Lessons (Verified Across Milestones)

1. Always-mounted CSS toggle is the correct pattern for animated UI in this stack — conditionally rendering animated components breaks exit transitions.
2. VERIFICATION.md must be written at phase completion time, not reconstructed at audit time.
