---
phase: 5
slug: component-upgrades
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-12
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source: 05-RESEARCH.md §Validation Architecture. The repo has NO test framework
> (vitest/Playwright deferred to V2-04); validation = type/lint/build + the Phase-4
> bundle assertion + scripted/manual LCP + structured both-theme/reduced-motion smoke.
> This is honest about the repo's reality — building a test framework is OUT of scope.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no test framework/files/script in the repo (STACK.md; V2-04 defers vitest+Playwright) |
| **Config file** | none |
| **Quick run command** | `npx tsc --noEmit` (the only sub-30s automated gate available) |
| **Full suite command** | `npx tsc --noEmit && npm run lint && npm run build && node scripts/check-bundle.mjs` + manual both-theme / reduced-motion / WebGL-disabled / off-screen / LCP smoke |
| **Estimated runtime** | tsc ~15–25s; full suite (incl. build) ~60–120s; manual smoke ~10–15 min |

> Note: `next.config.ts` sets `ignoreBuildErrors:true` + `ignoreDuringBuilds:true` — `npm run build` alone proves NOTHING. tsc + lint MUST run explicitly (research Pitfall 5).

---

## Sampling Rate

- **After every task commit:** `npx tsc --noEmit` (grep-scoped to the touched files).
- **After every plan wave:** `npx tsc --noEmit && npm run lint && npm run build && node scripts/check-bundle.mjs` + a quick both-theme glance at the touched surface.
- **Before `/gsd:verify-work` (phase gate, 05-09):** full suite green + Lighthouse LCP/CLS on `/` (mobile, PROD build) + both-theme + reduced-motion + WebGL-disabled + off-screen-pause + hard-refresh smoke across all 12 routes + residual-literal grep sweep.
- **Max feedback latency:** ~25s (tsc) per task; ~2 min (full suite) per wave.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-00-01 | 00 | 1 | PERF-02/SHIP-01 | guard | `node -e "...exists check of Phase 3/4 primitives..."` | ✅ | ⬜ pending |
| 05-00-02 | 00 | 1 | SHIP-01 | install | `node -e "maath + r3f-perf present"` | ✅ | ⬜ pending |
| 05-00-03 | 00 | 1 | PERF-02 | spike+gate | `node -e "bundle gate + spike recorded"` | ✅ | ⬜ pending |
| 05-01-01 | 01 | 2 | VIS-01 | typecheck | `npx tsc --noEmit \| grep HeroParticles` | ✅ | ⬜ pending |
| 05-01-02 | 01 | 2 | VIS-01 | typecheck | `npx tsc --noEmit \| grep HeroScene` | ✅ | ⬜ pending |
| 05-01-03 | 01 | 2 | VIS-01/PERF-02 | typecheck+build | `npx tsc --noEmit \| grep Hero3D` + build + bundle | ✅ | ⬜ pending |
| 05-01-04 | 01 | 2 | VIS-01 | human-verify | Lighthouse LCP/CLS + both-theme + fallback (BLOCKING) | manual | ⬜ pending |
| 05-02-01 | 02 | 3 | VIS-02/PERF-02 | typecheck | `npx tsc --noEmit \| grep InteractiveGlobe` | ✅ | ⬜ pending |
| 05-02-02 | 02 | 3 | VIS-03/PERF-02 | typecheck | `npx tsc --noEmit \| grep IdeaNetworkCanvas` | ✅ | ⬜ pending |
| 05-03-01 | 03 | 3 | VIS-04 | typecheck | `npx tsc --noEmit \| grep ScrollReveal` | ✅ | ⬜ pending |
| 05-03-02 | 03 | 3 | VIS-04 | typecheck | `npx tsc --noEmit \| grep InteractiveButton` | ✅ | ⬜ pending |
| 05-04-01 | 04 | 4 | VIS-05 | typecheck | `npx tsc --noEmit \| grep Navigation` | ✅ | ⬜ pending |
| 05-04-02 | 04 | 4 | VIS-06 | typecheck | `npx tsc --noEmit \| grep ThemeToggle` | ✅ | ⬜ pending |
| 05-05-01 | 05 | 4 | VIS-06/07 | typecheck | `npx tsc --noEmit \| grep FAQ` | ✅ | ⬜ pending |
| 05-05-02 | 05 | 4 | VIS-06/07 | typecheck | `npx tsc --noEmit \| grep TeamSection\|Footer` | ✅ | ⬜ pending |
| 05-06-01 | 06 | 4 | VIS-06 | typecheck | `npx tsc --noEmit \| grep AnimatedIcons` | ✅ | ⬜ pending |
| 05-06-02 | 06 | 4 | VIS-06/07 | typecheck+grep | `npx tsc --noEmit \| grep FundMeWidget` + literal grep | ✅ | ⬜ pending |
| 05-07-01 | 07 | 5 | VIS-07 | typecheck | `npx tsc --noEmit \| grep page\|projects\|expertise` | ✅ | ⬜ pending |
| 05-07-02 | 07 | 5 | VIS-07 | typecheck | `npx tsc --noEmit \| grep services\|tech-stack\|developer-australia` | ✅ | ⬜ pending |
| 05-08-01 | 08 | 5 | VIS-07 | typecheck | `npx tsc --noEmit \| grep blog\|budget\|contact` | ✅ | ⬜ pending |
| 05-08-02 | 08 | 5 | VIS-07 | typecheck | `npx tsc --noEmit \| grep team\|ideas\|fund-me` | ✅ | ⬜ pending |
| 05-09-01 | 09 | 6 | SHIP-01/PERF-02 | full suite | `npx tsc --noEmit && npm run build && node scripts/check-bundle.mjs` | ✅ | ⬜ pending |
| 05-09-02 | 09 | 6 | SHIP-01/VIS-01/PERF-02 | human-verify | LCP/CLS + both-theme + reduced-motion + WebGL + pause (BLOCKING) | manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] **Prereq HARD-guard** (05-00 Task 1): all Phase-3/4 primitives present (`useAnimationGate`, `useThemeColors`, `lib/motion`, `IslandBoundary`, `SceneCanvas`, `ClientScene`, `ScenePoster`, `ThemedScene`, `webgl.ts`, `check-bundle.mjs`) — BLOCK if any absent.
- [ ] **Read + record actual primitive signatures** (05-00 Task 1) → `05-00-SPIKE.md` (esp. how ClientScene mounts a scene; Research Open Q 3).
- [ ] **Install deps** (05-00 Task 2): `maath` + dev `r3f-perf` (+ `@react-three/postprocessing` iff bloom kept) at registry-verified versions.
- [ ] **Hero perf spike** (05-00 Task 3): throttled fps at 2000/2500/3000 particles → pick count + bloom on/off (Research Open Q 1); delete scratch route.
- [ ] **Probe Lighthouse CLI** (05-00 Task 3): `npx lighthouse --version` else document DevTools-panel fallback.
- [ ] **Update Phase-4 bundle gate** (05-00 Task 3): add the homepage route to `CANVAS_ROUTES`; passes on current build.

> No test framework to install — scripted/manual checks only (V2-04 defers the suite).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero LCP ≤ 2.5s, CLS ~0, LCP element = text/poster | VIS-01/PERF-01 | Lighthouse judgment on a prod build; no headless harness in repo | Lighthouse mobile+throttled on `npm start` `/` → read LCP/CLS + LCP element (05-01 Task 4, 05-09 Task 2) |
| Both-theme correctness (no dark-only surfaces) | VIS-01..07 | Visual judgment across themes | Toggle `data-theme` on every route; confirm icosahedron edge, globe, idea-network, FundMeWidget, cards all adapt |
| Reduced-motion static equivalence | PERF-04 | OS/DevTools emulation + visual judgment | Emulate `prefers-reduced-motion: reduce` → hero poster, static reveals/widgets, fully readable |
| WebGL-unavailable fallback | VIS-01 | Requires disabling WebGL; visual | Disable WebGL → hero poster, no white-screen |
| Off-screen + tab-blur loop pause | PERF-02 | DevTools Performance trace judgment | On `/`, `/ideas`, `/fund-me`: scroll away + switch tab → loops stop rendering |
| Navigation keyboard a11y | VIS-05/PERF-03 | Keyboard interaction + focus judgment | Tab through nav (rings); mobile menu Esc-close, focus-trap, aria-expanded |
| DPR-2 crispness (globe/network) | VIS-02/VIS-03 | Retina/emulation visual | DPR-2 emulation both themes → crisp, not blurry/offset |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (typecheck-grep gate) or are explicit human-verify checkpoints
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify (every code task has a tsc gate; the only manual tasks are the two blocking checkpoints, each preceded by automated gates)
- [ ] Wave 0 covers all MISSING references (primitive guard + bundle-gate update + spike)
- [ ] No watch-mode flags
- [ ] Feedback latency < 25s (tsc) per task
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
