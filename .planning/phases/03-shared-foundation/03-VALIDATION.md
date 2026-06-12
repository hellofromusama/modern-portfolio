---
phase: 3
slug: shared-foundation
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-12
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Phase 3 ships NO runtime WebGL — validation is type/lint/build + scripted node checks + manual both-theme/keyboard/reduced-motion smoke. Building a test framework is out of scope (V2-04).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — repo has no test framework/files/script (STACK.md; vitest+Playwright deferred to V2-04). `npx tsc --noEmit` is the de-facto unit gate. |
| **Config file** | none |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit && npm run lint && npm run build && node scripts/contrast-check.mjs` |
| **Estimated runtime** | ~60–120 seconds (build-dominated) |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit` (plus the task's own `<automated>` node check).
- **After every plan wave:** Run the full suite command.
- **Before `/gsd:verify-work`:** Full suite must be green + dev-only boundary/reduced-motion/keyboard checks done.
- **Max feedback latency:** 120 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-00-01 | 00 | 1 | FOUND-02 | scripted | `node -e "require.resolve('motion/react')"` | ❌ W0 creates | ⬜ pending |
| 3-00-02 | 00 | 1 | FOUND-03 | scripted | `node scripts/contrast-check.mjs` | ❌ W0 creates | ⬜ pending |
| 3-00-03 | 00 | 1 | FOUND-03 | scripted | `node -e "fs check 03-token-usage-audit.md"` | ❌ W0 creates | ⬜ pending |
| 3-01-01 | 01 | 2 | FOUND-03 | scripted | `node scripts/contrast-check.mjs` | ✅ (3-00) | ⬜ pending |
| 3-01-02 | 01 | 2 | PERF-03 | scripted | `node -e "grep skip-link/#main-content"` | ✅ | ⬜ pending |
| 3-01-03 | 01 | 2 | FOUND-03 | scripted | `node -e "hero caption off faint"` | ✅ | ⬜ pending |
| 3-02-01 | 02 | 2 | FOUND-02 | type | `npx tsc --noEmit` (useAnimationGate) | ✅ | ⬜ pending |
| 3-02-02 | 02 | 2 | FOUND-02/PERF-04 | type | `npx tsc --noEmit` (useThemeColors) | ✅ | ⬜ pending |
| 3-02-03 | 02 | 2 | FOUND-02 | type | `npx tsc --noEmit` (lib/motion) | ✅ | ⬜ pending |
| 3-03-01 | 03 | 3 | FOUND-05 | scripted | `node -e "grep boundary trio contracts"` | ✅ | ⬜ pending |
| 3-03-02 | 03 | 3 | FOUND-02/PERF-04 | scripted | `node -e "grep useAnimationGate+gateRef in 3 canvases"` | ✅ | ⬜ pending |
| 3-03-03 | 03 | 3 | FOUND-05 | scripted | `node -e "grep IslandBoundary in 3 islands"` | ✅ | ⬜ pending |
| 3-04-01 | 04 | 4 | SHIP-01 | command | `npx tsc --noEmit && npm run lint && npm run build && node scripts/contrast-check.mjs` | ✅ | ⬜ pending |
| 3-04-02 | 04 | 4 | FOUND-05/PERF-04/PERF-03 | scripted+manual | `node -e "grep-clean TEST_BOUNDARY"` + manual smoke | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm ci` (if node_modules absent) then `npm install motion@^12.40.0` — the single new dep (Plan 03-00 Task 1).
- [ ] `scripts/contrast-check.mjs` — repeatable WCAG AA pass/fail over both palettes (Plan 03-00 Task 2). Asserted by every token edit thereafter.
- [ ] `.planning/phases/03-shared-foundation/03-token-usage-audit.md` — faint/ghost/muted text-vs-decoration audit driving Strategy A/B per usage (Plan 03-00 Task 3).
- [ ] Re-read `layout.tsx` at execution time (Plan 03-01) to reconcile the two-line skip-link change with concurrent Phase 2 edits.

*No test framework to install (scripted node checks + manual smoke only).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Reduced-motion static experience | PERF-04 | No automated DOM-paint harness in repo | DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce"; load home/ideas/fund-me → 3 canvases show a static frame, pages fully readable |
| Off-screen / tab-blur rAF pause | FOUND-02/PERF-04 | Requires runtime profiler observation | Scroll a canvas off-screen → rAF stops; switch tab → stops; both resume on return (DevTools Performance) |
| Keyboard skip-link + focus ring | PERF-03 | Requires interactive keyboard test | Tab from page top → skip link visible, Enter moves focus into #main-content; :focus-visible ring shows in BOTH themes; no keyboard trap |
| IslandBoundary catch without white-screen | FOUND-05 | Requires deliberate dev-only throw | Load a wrapped island with `?boom=1` (dev-only throw) → poster renders, page chrome survives; then REMOVE throw and grep-confirm no `TEST_BOUNDARY` ships |
| Both-theme AA visual smoke | FOUND-03 | Visual confirmation complements the numeric script | Toggle theme on every touched page → text readable, accents legible, no contrast regression |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (motion install + contrast script + audit)
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
