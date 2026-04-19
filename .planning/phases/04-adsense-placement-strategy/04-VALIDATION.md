---
phase: 4
slug: adsense-placement-strategy
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-19
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — documentation deliverable |
| **Config file** | Not applicable |
| **Quick run command** | `ls .planning/ADS-STRATEGY.md` |
| **Full suite command** | `ls .planning/ADS-STRATEGY.md` |
| **Estimated runtime** | ~1 second |

---

## Sampling Rate

- **After every task commit:** Run `ls .planning/ADS-STRATEGY.md`
- **After every plan wave:** Run `ls .planning/ADS-STRATEGY.md`
- **Before `/gsd-verify-work`:** File must exist with required sections
- **Max feedback latency:** 1 second

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | ADS-01 | — | N/A | manual | `ls .planning/ADS-STRATEGY.md` | ❌ W0 | ⬜ pending |
| 4-01-02 | 01 | 1 | ADS-02 | — | N/A | manual | Content review | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test stubs needed — documentation deliverable.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `.planning/ADS-STRATEGY.md` exists with zone table, density rules, slot IDs, mobile constraint | ADS-01 | Document content — no automation possible | Read file, verify each required section is present |
| Strategy explicitly states no ad zone blocks map/price stats bar/filter controls on mobile | ADS-02 | Content quality — requires human review | Read mobile constraint section, verify explicit statement |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 1s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
