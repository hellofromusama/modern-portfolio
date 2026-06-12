---
phase: 05-component-upgrades
plan: 00
subsystem: infra
tags: [three, react-three-fiber, drei, maath, r3f-perf, particle-field, perf-spike, bundle-budget, route-split, prereq-guard, hero-webgl, lighthouse]

requires:
  - phase: 03-shared-foundation
    provides: "useAnimationGate (shouldAnimate gate), useThemeColors (CSS-var -> raw hex bridge), motion.ts (EASE_SIGNATURE/transitions/fadeUp/stagger), IslandBoundary (default-export class boundary, prop `fallback`)"
  - phase: 04-r3f-infrastructure
    provides: "ClientScene/SceneCanvas/ScenePoster/ThemedScene (the WebGL island), isWebGLAvailable(), scripts/bundle-gate.mjs (CANVAS_ROUTES PERF-01 gate), three@0.184/@react-three/fiber@9.6/drei@10.7/motion@12 installed"
provides:
  - "05-00-SPIKE.md — confirmed Phase-3/4 primitive signatures read from source (esp. the ClientScene NO-scene-injection finding), chosen hero particle count (2000), bloom decision (OFF), installed dep versions, Lighthouse availability"
  - "maath@^0.10.8 (dependencies) installed — maath/random.inSphere particle distribution for the hero field"
  - "r3f-perf@^7.2.3 (devDependencies) installed — dev-only FPS/draw-call HUD, gated behind NODE_ENV"
  - "bundle-gate.mjs CANVAS_ROUTES armed with /page (homepage hero mount) ahead of 05-01 — green on the current pre-hero build"
affects: [05-01, hero-webgl, 05-09]

tech-stack:
  added:
    - "maath@^0.10.8 (dependencies)"
    - "r3f-perf@^7.2.3 (devDependencies)"
  patterns:
    - "Wave-0 de-risk: HARD prereq existence guard BLOCKS the phase if any consumed primitive is absent; actual hook/component signatures are read from SOURCE (not research sketches) before any scene code is written"
    - "GPU particle field = ONE draw call regardless of count (single <points> + maath/random.inSphere static buffer, GPU-rotated, no per-frame CPU attribute writes); the budget axis is fragment overdraw, not draw calls"
    - "Conservative-fallback perf decisioning when real-device measurement is impossible headlessly: pick the overdraw-safest band end, label estimates as estimates, never fabricate fps, defer up-tuning to a measured device pass"
    - "Pre-arming the bundle gate: add the future hero route (/page) to CANVAS_ROUTES BEFORE the hero ships — safe because the route carries no three until 05-01, and it arms the leak assertion for the moment the hero mounts"

key-files:
  created:
    - .planning/phases/05-component-upgrades/05-00-SPIKE.md
  modified:
    - package.json
    - package-lock.json
    - scripts/bundle-gate.mjs

key-decisions:
  - "ClientScene takes ONLY {className} and hardcodes the SceneCanvas->ThemedScene chain — there is NO scene-injection prop. 05-01 MUST parameterize SceneCanvas (add scene?: ReactNode, default <ThemedScene/>) and thread it through ClientScene to mount the hero while preserving the route-split."
  - "Hero particle count = 2000 (low end of the 2,000-3,000 research band): draw-call cost is identical across the band (1), so the only lever is additive fragment overdraw, which is smallest at 2000 — safest for the un-measured mid-tier-mobile worst case. Re-tune up only on measured 60fps headroom."
  - "Bloom = OFF; @react-three/postprocessing NOT installed. Bloom's ~2-3 extra full-screen passes are the largest overdraw multiplier and cannot be measured headlessly — shipping it on un-measured mobile risks the LCP/60fps budget. Approximate the glow with additive PointMaterial blending; revisit bloom only after a real-device spike."
  - "Bundle gate is scripts/bundle-gate.mjs, NOT the plan's check-bundle.mjs (name typo corrected). CANVAS_ROUTES += /page, kept /scene-harness/page until 05-01 deletes the harness."

patterns-established:
  - "Pattern: a Wave-0 spike plan resolves Research Open Questions (signatures, particle count, bloom) from confirmed source + measurement (or honest conservative fallback) BEFORE any production scene code, so all downstream work aligns to real APIs and real budgets."
  - "Pattern: throwaway spike code (scratch _hero-spike scene) validates the exact production wiring (maath + drei Points + r3f-perf) via type-check, then is DELETED before commit — it must never ship."

requirements-completed: [PERF-02, SHIP-01]

duration: 7min
completed: 2026-06-12
---

# Phase 5 Plan 00: Hero De-Risk (prereq guard + signatures + perf spike + bundle-gate prep) Summary

**A Wave-0 de-risk that BLOCK-guarded all 10 Phase-3/4 primitives present, recorded their ACTUAL signatures from source (surfacing that `ClientScene` has no scene-injection prop so 05-01 must parameterize `SceneCanvas`), installed `maath@0.10.8` + dev `r3f-perf@7.2.3` at registry-verified versions, decided the hero at 2,000 particles with bloom OFF from a conservative honest-methodology spike (one draw call verified, no fabricated fps), and pre-armed `scripts/bundle-gate.mjs` `CANVAS_ROUTES` with the homepage `/page` — green on the current pre-hero build.**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-06-12T06:16:45Z
- **Completed:** 2026-06-12T06:24:08Z
- **Tasks:** 3
- **Files modified:** 4 (1 created, 3 modified)

## Accomplishments
- **HARD prereq guard PASSED** — an existence check over all 10 Phase-3/4 primitives Phase 5 consumes exited 0 (no BLOCK). Phase 3 + Phase 4 confirmed merged before any scene code.
- **Real signatures recorded** (Research Open Q 3 resolved) for `useAnimationGate`, `useThemeColors`, `motion.ts`, `IslandBoundary` (default export, prop `fallback`), and critically `ClientScene`/`SceneCanvas` — read verbatim from source, not the plan sketch.
- **The scene-mount finding for 05-01:** `ClientScene({ className })` hardcodes `dynamic(() => import("./SceneCanvas"))` and `SceneCanvas` hardcodes `<ThemedScene>`. There is no scene slot. The SPIKE documents the recommended low-blast-radius injection: add `scene?: ReactNode` to `SceneCanvas` (default `<ThemedScene/>`), thread it through `ClientScene`, forward `paused`.
- **Deps installed at registry-verified versions:** `maath@^0.10.8` (dependencies), `r3f-perf@^7.2.3` (devDependencies). `npm view` confirmed both are the current latest in line. `tsc --noEmit` clean in three/hooks/webgl scope after install.
- **Perf spike decision (honest methodology):** hero **2,000 particles**, **bloom OFF**, `@react-three/postprocessing` NOT installed. The exact production wiring (`maath/random.inSphere` + drei `<Points>`/`<PointMaterial>` + dev-gated `<Perf>`) was validated by a throwaway `_hero-spike` scene that type-checks clean, then DELETED. One-draw-call accounting verified; no fps fabricated (headless, no GPU loop) — estimates labeled.
- **Bundle gate pre-armed:** `bundle-gate.mjs` `CANVAS_ROUTES` += `/page`; `npm run build` + `node scripts/bundle-gate.mjs` → "three confined to canvas routes [/page, /scene-harness/page] across 38 routes" (exit 0).
- **Lighthouse CLI probed:** absent locally (npx-on-demand `13.4.0` available; Chrome binary present) — fallback documented for the 05-09 LCP gate.

## Task Commits

Each task committed atomically (`--no-verify`, explicit per-file staging):

1. **Task 1: Prereq HARD-guard + read actual primitive signatures** - `fbbed01` (docs) — `05-00-SPIKE.md`
2. **Task 2: Install Phase-5 deps at registry-verified versions** - `14d45a3` (chore) — `package.json`, `package-lock.json`, `05-00-SPIKE.md`
3. **Task 3: Hero perf spike + update bundle gate** - `058767e` (feat) — `scripts/bundle-gate.mjs`, `05-00-SPIKE.md`

**Plan metadata:** see final docs commit.

## Files Created/Modified
- `.planning/phases/05-component-upgrades/05-00-SPIKE.md` (created) — confirmed primitive signatures (incl. the ClientScene no-injection finding + recommended fix), installed dep versions, perf-spike decision (2000 particles / bloom OFF) with honest methodology, Lighthouse availability, bundle-gate update, and a 05-01 hand-off table.
- `package.json` / `package-lock.json` (modified) — added `maath@^0.10.8` (deps) + `r3f-perf@^7.2.3` (devDeps).
- `scripts/bundle-gate.mjs` (modified) — `CANVAS_ROUTES` += `/page`; comments document why pre-arming before the hero ships is safe, and the 05-01 follow-up to remove `/scene-harness/page`.

## Decisions Made
See `key-decisions` frontmatter. In short: ClientScene has no scene-injection prop → 05-01 must parameterize SceneCanvas/ClientScene; hero = 2000 particles (overdraw-safest band end); bloom OFF and postprocessing not installed (largest un-measurable overdraw multiplier); bundle gate is `bundle-gate.mjs` (not the plan's `check-bundle.mjs`).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Corrected the bundle-gate filename (`check-bundle.mjs` → `bundle-gate.mjs`)**
- **Found during:** Task 1 (prereq guard) and Task 3 (gate update)
- **Issue:** The plan's `files_modified`, the `<interfaces>`/`<files>` blocks, and the Task-1 verify command all reference `scripts/check-bundle.mjs`. That file does NOT exist — Phase 4 (04-01/04-03) created and armed `scripts/bundle-gate.mjs`. Running the guard or the gate against the named path would have failed / proven nothing.
- **Fix:** Ran the existence guard and the gate update against the REAL file `scripts/bundle-gate.mjs`. Recorded the correction in `05-00-SPIKE.md`.
- **Files modified:** `scripts/bundle-gate.mjs` (the intended target all along)
- **Verification:** Guard exits 0 with `bundle-gate.mjs` in the path; `node scripts/bundle-gate.mjs` exits 0 after build.
- **Committed in:** `fbbed01` (documented) + `058767e` (gate edit)

**2. [Rule 3 - Blocking] Perf spike: conservative fallback substituted for live throttled fps (no GPU browser loop headlessly)**
- **Found during:** Task 3 (hero perf spike)
- **Issue:** The plan asks for measured fps via a live `r3f-perf` HUD under DevTools CPU throttling. This session is a headless agent with no human-driven interactive WebGL loop to read the on-canvas HUD frame-over-frame, so a gold-standard fps measurement was impossible.
- **Fix:** Per the orchestrator's explicit conservative-fallback instruction: validated the exact production wiring via a throwaway type-checked spike scene (then deleted it), verified the one-draw-call accounting structurally, chose the overdraw-safest band end (2000) and bloom OFF, and labeled every non-verified number as `[ESTIMATE]`. No fps fabricated.
- **Files modified:** `05-00-SPIKE.md` (Methodology + Decision sections)
- **Verification:** Spike scene type-checks clean; scratch route deleted (absent from `src/app/`); decisions recorded (verify passes for "particle count" + "bloom").
- **Committed in:** `058767e`

---

**Total deviations:** 2 auto-fixed (both Rule 3 - blocking).
**Impact on plan:** Both essential for correctness. The filename correction is the difference between the gate running and a false pass; the conservative-fallback follows the orchestrator's own instruction and keeps the decision honest rather than fabricated. No scope creep — the deliverables (guard, signatures, deps, spike decision, armed gate) are exactly as specified, only the bloom path was conservatively pruned (postprocessing intentionally not installed).

## Issues Encountered
- `npm audit` reports 30 advisories — these are PRE-EXISTING in the existing dependency tree (count unchanged by the `maath`/`r3f-perf` installs), out of scope per the scope boundary, non-blocking.
- `require('r3f-perf/package.json')` throws `ERR_PACKAGE_PATH_NOT_EXPORTED` (modern `exports` map blocks subpath require) — cosmetic; the version was read via `fs` instead (confirmed `7.2.3`).
- Pre-existing `tsc --noEmit` errors in unrelated API/expertise files persist (documented in Phase 4 `deferred-items.md`), non-blocking by `typescript.ignoreBuildErrors: true`; all three/scene/dep-touched files are clean.
- Windows CRLF line-ending warnings on commit — cosmetic.

## Known Stubs
None. The SPIKE is a decision/record artifact; the throwaway spike scene was deleted (not a stub). No production code with hardcoded empty/placeholder values was introduced — the only deliverables are the recorded decisions and the two dependency installs.

## User Setup Required
None — no external service configuration required. (Lighthouse CLI is optional and only relevant to the 05-09 LCP gate; documented as npx-on-demand or DevTools panel.)

## Next Phase Readiness
- **05-01 is unblocked** with hard numbers: parameterize `SceneCanvas`/`ClientScene` with a `scene?` prop (default `<ThemedScene/>`), build `HeroScene` (icosahedron + `maath/random.inSphere` particle field at **2000**, bloom **OFF**, `{ paused }` contract, no per-frame CPU attribute writes), mount on the homepage via `ClientScene` only, then remove `/scene-harness` and drop `/scene-harness/page` from `CANVAS_ROUTES` (leaving `/page`).
- The bundle gate is armed for `/page` and green on the current build — the moment the hero mounts, it asserts the three vendor chunk stays scene-only and absent from shared/text routes.
- 05-09 should pin `lighthouse@13.4.0` as a devDependency (or use the DevTools panel) for the LCP gate — it is not pre-installed.

## Self-Check: PASSED

All claims verified below.

---
*Phase: 05-component-upgrades*
*Completed: 2026-06-12*
