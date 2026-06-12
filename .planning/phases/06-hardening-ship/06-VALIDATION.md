---
phase: 6
slug: hardening-ship
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-12
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | **None present.** Validation = `tsc --noEmit` + `eslint` + `next build` + manual smoke (both themes) + curl checklist. No unit-test runner in the repo (adding one is NOT a phase-6 requirement — V2-04, deferred). |
| **Config file** | `tsconfig.json` (strict), `eslint.config.mjs` (flat) — no test config |
| **Quick run command** | `npx tsc --noEmit && npm run lint` |
| **Full suite command** | `npx tsc --noEmit && npm run lint && npm run build` |
| **Estimated runtime** | ~30–90 seconds (tsc + lint quick; build ~10s) |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit && npm run lint` (the regression net — this is the gate since no unit tests exist)
- **After every plan wave:** Run `npx tsc --noEmit && npm run lint && npm run build`
- **Before `/gsd:verify-work`:** Full suite green + FIX-01/FIX-02 curl gate + both-theme smoke
- **Max feedback latency:** ~90 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | SHIP-02 | type+lint gate | `npx tsc --noEmit \| grep -E "auto-llm-training\|ai-training"` → 0 | ✅ tooling | ⬜ pending |
| 06-01-02 | 01 | 1 | SHIP-02 | type+lint gate | `npx tsc --noEmit \| grep -E "create-checkout\|budget-estimate"` → 0 | ✅ tooling | ⬜ pending |
| 06-02-01 | 02 | 1 | SHIP-02 | type+lint gate | `npx tsc --noEmit \| grep expertise` → 0 | ✅ tooling | ⬜ pending |
| 06-02-02 | 02 | 1 | SHIP-02 | content-diff | `git diff HEAD -- expertise/page.tsx \| grep content` → none | ✅ tooling | ⬜ pending |
| 06-03-01 | 03 | 1 | SHIP-02 | lint gate | `npm run lint \| grep <owned files>` → 0 | ✅ tooling | ⬜ pending |
| 06-03-02 | 03 | 1 | SHIP-02 | lint gate | `npm run lint` → owned files clean | ✅ tooling | ⬜ pending |
| 06-04-01 | 04 | 2 | FIX-01 | type gate | `npx tsc --noEmit \| grep admin-guard` → 0 | ✅ tooling | ⬜ pending |
| 06-04-02 | 04 | 2 | FIX-01 | grep gate | `grep -L requireAdmin <5 routes>` → none; `grep -c keyUsed` → 0 | ✅ tooling | ⬜ pending |
| 06-05-01 | 05 | 2 | FIX-02 | grep gate | `grep -cE "schedule-training\|auto-llm-training" VisitorTracker.tsx` → 0 | ✅ tooling | ⬜ pending |
| 06-05-02 | 05 | 2 | FIX-02 | grep gate | `grep -cE "bg-slate-900\|text-slate" VisitorCounter.tsx` → 0 | ✅ tooling | ⬜ pending |
| 06-06-01 | 06 | 2 | VIS-08 | grep gate | `grep -c "@view-transition" globals.css` → 1 | ✅ tooling | ⬜ pending |
| 06-06-CP | 06 | 2 | VIS-08 | manual | owner verifies crossfade + reduced-motion in browser | ❌ manual | ⬜ pending |
| 06-07-01 | 07 | 3 | SHIP-02 | build gate | `grep -cE "ignore.*true" next.config.ts` → 0; `npm run build` → exit 0 | ✅ tooling | ⬜ pending |
| 06-07-02 | 07 | 3 | SHIP-01,FIX-01,FIX-02 | curl+grep | `verify-prod.sh` local; `curl /api/test-openai` → 401/403 | ✅ tooling | ⬜ pending |
| 06-08-01 | 08 | 4 | SHIP-02 | deploy+curl | `bash scripts/verify-prod.sh <preview-url>` all PASS | ⚠️ interactive | ⬜ pending |
| 06-08-CP | 08 | 4 | SHIP-02 | manual | owner production-approval (human-action, non-bypassable) | ❌ manual | ⬜ pending |
| 06-08-02 | 08 | 4 | SHIP-02 | deploy+curl | post-approval `vercel --prod` + verify-prod.sh on live domain | ⚠️ interactive | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* No test framework install needed — the tsc/lint/build/curl gates ARE the validation surface (no unit-test runner in the repo; adding one is deferred V2-04). `scripts/verify-prod.sh` is authored in 06-07 as the reusable post-deploy checklist (not a unit test).

- [x] tsc + eslint + next build tooling present (node_modules installed)
- [x] scripts/verify-prod.sh — created in 06-07 (curl checklist), not a Wave-0 blocker for Wave-1 plans

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| View Transitions look subtle; instant under reduced-motion | VIS-08 | Browser-only visual + OS reduced-motion emulation | 06-06 checkpoint: navigate in Chrome/Edge (crossfade), enable reduced-motion (instant), Firefox (no regression) |
| Fresh visit fires no paid AI fetch | FIX-02 | Definitive check is DevTools Network on a real visit (grep of built chunk is the automatable proxy) | 06-08 owner pass: open preview, watch Network for /api/auto-llm-training + /api/schedule-training (expect none) |
| Both-theme visual correctness, keyboard pass | SHIP-01 | Live visual + keyboard interaction | 06-08 owner checkpoint: toggle themes, Tab-through, focus rings, no traps |
| Production-deploy approval | SHIP-02 | Contractually the owner's decision; deploy is irreversible-ish on a live domain | 06-08 human-action checkpoint: owner explicitly approves before `vercel --prod` |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or a documented manual/interactive reason (deploy + owner checkpoints)
- [x] Sampling continuity: no 3 consecutive tasks without automated verify (every code task has a tsc/lint/grep gate)
- [x] Wave 0 covers all MISSING references (none — tooling present; verify-prod.sh authored in 06-07)
- [x] No watch-mode flags
- [x] Feedback latency < 90s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
