# Milestones

## v1.0 UI Polish & Ad Strategy (Shipped: 2026-04-20)

**Phases completed:** 5 phases (4 planned + 1 inserted), 5 plans
**Timeline:** 2026-04-02 → 2026-04-20 (17 days)
**Stats:** 123 commits, ~1,943 TypeScript LOC

**Key accomplishments:**

- BrandDropdown outside-click dismiss and `maxHeight: calc(100dvh - 240px)` constraint — dropdown never overlaps PriceStatsBar on mobile
- HamburgerMenu refactored to always-mounted left-side slide drawer with 300ms ease-in-out transition and semi-transparent animated backdrop
- PrivacyNotice and TrademarkNotice fixed with always-mounted bottom-sheet slide pattern, focus management, and ARIA dialog roles (Phase 02.1 — inserted)
- FilterOverlay component: full-screen dark overlay + spinner on every filter change, 500ms minimum display, clearTimeout debounce to prevent stuck state
- AdSense placement strategy document: zone table (slot 3373913657), density policy (max 1 unit active), consent gating via existing `adConsent.ts`, activation checklist

### Known Gaps

Proceeding with known gaps (user-approved):
- **DROPDOWN-01/DROPDOWN-02**: No formal VERIFICATION.md for Phase 01. Implementation is correct and human-verified in SUMMARY. Protocol gap only — not a functional deficiency.
- **Nyquist**: All 5 phases have draft or missing VALIDATION.md. Nyquist compliance was not a delivery gate for this milestone.

---
