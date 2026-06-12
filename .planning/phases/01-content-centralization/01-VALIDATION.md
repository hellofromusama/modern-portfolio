---
phase: 1
slug: content-centralization
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-12
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none (repo has zero tests) — validation via Node snapshot/diff scripts + compiler gates |
| **Config file** | none — Wave 0 creates `scripts/content-baseline.mjs` + `scripts/content-diff.mjs` |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit && npm run lint && npm run build && node scripts/content-diff.mjs` |
| **Estimated runtime** | ~90 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run full suite command
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| (filled by planner) | — | 0 | SEO-01 | baseline snapshot | `node scripts/content-baseline.mjs` | ❌ W0 | ⬜ pending |
| (filled by planner) | — | 1+ | FOUND-01 | zero-deletion diff | `node scripts/content-diff.mjs` | ❌ W0 | ⬜ pending |
| (filled by planner) | — | 1+ | FIX-03 | build-output route check | `npm run build` then grep route table for all 7 project slugs | ✅ | ⬜ pending |
| (filled by planner) | — | all | SHIP-01 | compiler gates | `npx tsc --noEmit && npm run lint && npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/content-baseline.mjs` — captures, BEFORE any code change: home-grid project list (6, in order), detail map (7 keys), JSON-LD ItemList entities (6, with exact copy), sitemap URLs (8 project URLs + all others), homepage skills array — written to `.planning/phases/01-content-centralization/baseline.json`
- [ ] `scripts/content-diff.mjs` — re-extracts the same five projections from the LIVE code and diffs against `baseline.json`; exits non-zero on ANY missing/changed entry (additions allowed)

*Both scripts are validation tooling, not site code; they live in `scripts/` and are committed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Both-theme rendering smoke | SHIP-01 | No E2E framework | `npm run dev`; load /, /projects/ai-erp-integration (and 2 other slugs), toggle data-theme both ways; confirm grid, detail copy, no console errors |
| View-source JSON-LD check | SEO-01 | Script-tag content easiest eyeballed | View source on /, confirm ItemList present with 6 entities, unchanged copy |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
