---
phase: 4
slug: r3f-infrastructure
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-12
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Phase 4 ships runtime WebGL but the repo has NO test framework (vitest+Playwright deferred to a later milestone). Validation = type/lint/build + zero-dependency scripted node gates + manual smoke. Building a test framework is OUT OF SCOPE.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | **None** — no test framework/files/script in the repo (STACK.md). De-facto unit gate is `npx tsc --noEmit`. |
| **Config file** | none — see Wave 0 (Plan 04-01 authors the node gate scripts instead of test files) |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit && npm run lint && npm run build && node scripts/check-stack.mjs && node scripts/bundle-gate.mjs` |
| **Estimated runtime** | ~45–90 seconds (build dominates) |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit` (fast type gate; the only sub-30s check available, grep-scoped to Phase-4 files).
- **After every plan wave:** Run the full suite (`tsc && lint && build && check-stack && bundle-gate`).
- **Before `/gsd:verify-work`:** Full suite green + manual both-theme + reduced-motion + WebGL-disabled smoke + hard-refresh of the canvas route.
- **Max feedback latency:** ~90 seconds (one build).

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | FOUND-04 | scripted | `node -e "..."` stack-present assert (Phase-3 ls-guard precedes) | ❌ W0 (script) | ⬜ pending |
| 4-01-02 | 01 | 1 | FOUND-04, PERF-01 | scripted | `npm run build && node scripts/check-stack.mjs && node scripts/bundle-gate.mjs` | ❌ W0 (scripts) | ⬜ pending |
| 4-02-01 | 02 | 2 | FOUND-04 | type | `npx tsc --noEmit` (grep webgl/ScenePoster) | ✅ | ⬜ pending |
| 4-02-02 | 02 | 2 | FOUND-04 | type | `npx tsc --noEmit` (grep SceneCanvas/ThemedScene) | ✅ | ⬜ pending |
| 4-02-03 | 02 | 2 | FOUND-04 | type | `npx tsc --noEmit` (grep ClientScene) | ✅ | ⬜ pending |
| 4-03-01 | 03 | 3 | PERF-01 | scripted | `npm run build && node scripts/bundle-gate.mjs` | ✅ (from W0) | ⬜ pending |
| 4-03-02 | 03 | 3 | SHIP-01, PERF-01 | scripted | full suite + curl LCP proof | ✅ | ⬜ pending |
| 4-03-03 | 03 | 3 | FOUND-04, SHIP-01 | manual | human evidence checkpoint (both-theme/reduced-motion/WebGL-off) | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] **Sequencing guard (BLOCKING):** `src/hooks/useAnimationGate.ts`, `src/hooks/useThemeColors.ts`, `src/components/IslandBoundary.tsx` all exist (Phase 3 merged). If absent → STOP (do not re-author — duplicate/merge-conflict risk). [Plan 04-01 Task 1]
- [ ] `npm ci` (only if `node_modules` absent) → then `npm install three@^0.184 @react-three/fiber@^9.6 @react-three/drei@^10.7` + `-D @types/three`; `grep '"motion"'` before adding motion (Phase 3 owns it). [Plan 04-01 Task 1]
- [ ] `scripts/check-stack.mjs` — zero-dep package.json deps assertion. [Plan 04-01 Task 2]
- [ ] `scripts/bundle-gate.mjs` — zero-dep `.next/app-build-manifest.json` parser; **tune the chunk matcher against the REAL built manifest** (named-vendor regex vs cross-route chunk-set diff — webpack may hash the three chunk). [Plan 04-01 Task 2]
- [ ] next.config.ts analyzer wrapper decided OUT — manifest script is the gate; next.config.ts stays untouched (collision point removed).

*No test framework to install — scripted node checks + grep + manual smoke only.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Theme reactivity in BOTH `data-theme` values | FOUND-04 | Requires rendering WebGL + reading on-screen color; no headless GL in repo | Toggle theme on `/_scene-harness` → icosahedron edge changes dark `#60a5fa` → light `#3b82f6`, no remount, no `THREE.Color` warning |
| Pause off-screen / on tab-blur | PERF (PERF-02 foundation) | Needs DevTools Performance / visual frame observation | Scroll canvas off-screen → loop stops; switch tab → stops (frameloop ← useAnimationGate) |
| Reduced-motion static view | PERF-04 foundation | Needs OS/DevTools reduced-motion emulation | DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, reload → icosahedron frozen |
| WebGL-unavailable poster fallback | FOUND-04 / FOUND-05 | Needs WebGL disabled at the browser/GPU level | Disable WebGL (chrome://flags) / force context loss → `ScenePoster` shows, no crash |
| Hero LCP element = poster/text, not `<canvas>` | PERF-01 | LCP attribution needs Lighthouse + curl HTML inspection | `curl /` shows server-rendered hero/poster, no three in home payload; Lighthouse LCP element = poster/text, CLS ≤ 0.1 |
| No hydration error on hard refresh | FOUND-04 | Hydration mismatch only visible at runtime in console | Hard-refresh `/_scene-harness` → no hydration error (ssr:false excludes server pass) |
| Live hero untouched | (regression guard) | Visual parity judgment | Visit `/` → existing Canvas-2D hero unchanged |

---

## Route-table Check (PERF-01 guard)

Assert NO text/SEO route imports the canvas. After build, `bundle-gate.mjs` enforces this automatically; the grep companion:
`rg -l "ClientScene|SceneCanvas|@react-three|from 'three'" src/app/{blog,developer-australia,expertise,services,tech-stack,projects} src/app/layout.tsx` → must return **nothing**. The only route allowed to ship three this phase is `/_scene-harness` (in `CANVAS_ROUTES`). Phase 5 swaps in the hero route and removes the harness entry.

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or are explicit manual checkpoints with Wave-0-authored gates
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify (every code task has a `tsc`/script gate)
- [ ] Wave 0 covers all gate scripts (check-stack, bundle-gate) before the plans that consume them
- [ ] No watch-mode flags (all commands are one-shot)
- [ ] Feedback latency < 90s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
