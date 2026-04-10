---
phase: 2
slug: menu-drawer
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (already configured via Vite) |
| **Config file** | vite.config.ts |
| **Quick run command** | `npm run build` (TypeScript + Vite build) |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | MENU-01 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 2-01-02 | 01 | 1 | MENU-02 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 2-01-03 | 01 | 1 | MENU-03 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test setup needed — build + lint validates correctness.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Slide-in animation smoothness | MENU-01 | CSS transitions not testable in CI | Open app on mobile/devtools, tap hamburger — drawer slides in from left smoothly |
| Slide-out animation on close button | MENU-02 | CSS transitions not testable in CI | Tap close control — drawer slides back out |
| Backdrop dims background | MENU-03 | Visual opacity change | Open drawer — rest of screen should be dark semi-transparent overlay |
| Backdrop tap closes drawer | MENU-03 | Click-target interaction | Tap outside drawer — should close with slide-out animation |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
