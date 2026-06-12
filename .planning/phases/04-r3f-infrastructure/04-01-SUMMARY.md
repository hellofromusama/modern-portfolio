---
phase: 04-r3f-infrastructure
plan: 01
subsystem: infra
tags: [three, react-three-fiber, drei, motion, webgl, bundle-budget, perf-gate, install-gate, react-19]

requires:
  - phase: 03-shared-foundation
    provides: "useAnimationGate, useThemeColors hooks + IslandBoundary component (Phase-3 sequencing guard targets); motion@^12.40.0 already installed"
provides:
  - "React-19-clean 3D stack: three@^0.184.0, @react-three/fiber@^9.6.1, @react-three/drei@^10.7.7 (deps) + @types/three@^0.184.1 (devDep)"
  - "scripts/check-stack.mjs — zero-dep FOUND-04 install gate: dep presence + major-version floors (fiber>=9, drei>=10, motion>=12)"
  - "scripts/bundle-gate.mjs — zero-dep PERF-01 hard gate: dual matcher confines three to CANVAS_ROUTES, tuned against the real built manifest"
affects: [04-02, 04-03, 04-canvas-island, 05-component-upgrades, hero-webgl]

tech-stack:
  added:
    - three@^0.184.0
    - "@react-three/fiber@^9.6.1"
    - "@react-three/drei@^10.7.7"
    - "@types/three@^0.184.1 (dev)"
  patterns:
    - "Zero-dependency Node ESM gate scripts (node: imports only) over @next/bundle-analyzer — keeps the single Next bundler config (next.config.ts) untouched, no collision point"
    - "Version-floor install proof: parse package.json range -> major int -> assert floor; survives lockfile churn AND silent major downgrades"
    - "Hash-proof bundle budget: canvas-exclusive cross-route chunk diff instead of (brittle) filename regex, because the real manifest showed three is not name-tagged in chunk paths"

key-files:
  created:
    - scripts/check-stack.mjs
    - scripts/bundle-gate.mjs
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "bundle-gate uses cross-route canvas-exclusive diff as the load-bearing matcher (named regex kept only as a free fast-path) because the real built manifest had ZERO chunks tagged three/fiber/drei — a filename regex would silently miss a webpack-hashed vendor chunk"
  - "CANVAS_ROUTES defaults to homepage /page (research default — Phase 5's WebGL hero replaces the homepage hero); set carries an explicit UPDATE comment for Phase 5"
  - "@next/bundle-analyzer NOT adopted; next.config.ts left byte-identical (git diff empty) per orchestrator decision — the zero-dep Node script is the gate"
  - "motion@^12.40.0 (Phase-3 deliverable) detected present and NOT reinstalled/duplicated"

patterns-established:
  - "Pattern: every later Phase-4/5 plan runs `node scripts/check-stack.mjs` (install proof) and `node scripts/bundle-gate.mjs` after `next build` (budget proof) — both exit 0/1, no deps"
  - "Pattern: add new gate scripts to scripts/ alongside content-baseline.mjs/content-diff.mjs, same node: ESM + process.exit convention"

requirements-completed: [FOUND-04, PERF-01]

duration: 4min
completed: 2026-06-12
---

# Phase 4 Plan 01: R3F Infrastructure — Stack Install + Gate Scripts Summary

**React-19-verified 3D stack (three@0.184 / @react-three/fiber@9.6 / @react-three/drei@10.7 + @types/three) installed peer-clean, plus two zero-dependency Node gate scripts — a version-floor install proof (check-stack.mjs) and a hash-proof bundle-budget gate (bundle-gate.mjs) tuned against the real built manifest — with next.config.ts left untouched.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-12T05:42:51Z
- **Completed:** 2026-06-12T05:47:03Z
- **Tasks:** 2
- **Files modified:** 4 (2 created, 2 modified)

## Accomplishments
- Phase-3 sequencing HARD GUARD passed: `src/hooks/useAnimationGate.ts`, `src/hooks/useThemeColors.ts`, `src/components/IslandBoundary.tsx` all confirmed present before any install — no Phase-3 files re-authored (no merge conflict).
- 3D stack installed React-19-clean: `three@^0.184.0`, `@react-three/fiber@^9.6.1`, `@react-three/drei@^10.7.7` in dependencies, `@types/three@^0.184.1` in devDependencies. `npm ls react` deduped to 19.2.4 everywhere — fiber@9's hard ceiling (`react <19.3`) resolved with NO peer conflict, NO `--force`/`--legacy-peer-deps`.
- `motion@^12.40.0` (a Phase-3 deliverable) detected present and deliberately NOT reinstalled.
- `scripts/check-stack.mjs` (FOUND-04): asserts all five deps present AND enforces major-version floors — motion>=12, @react-three/fiber>=9, @react-three/drei>=10 (three + @types/three presence-only). Exits 0 "stack OK".
- `scripts/bundle-gate.mjs` (PERF-01): parses the REAL `.next/app-build-manifest.json` (36 routes) and confines three to `CANVAS_ROUTES`. Exits 0 "bundle budget OK" — three absent everywhere this phase (no scene mounted yet), which still proves the parser runs.
- `next.config.ts` left byte-identical (`git diff next.config.ts` empty) — analyzer collision point eliminated per orchestrator decision.

## Exact Installed Versions

| Package | Range (package.json) | Resolved | Placement |
| --- | --- | --- | --- |
| three | ^0.184.0 | 0.184.0 | dependencies |
| @react-three/fiber | ^9.6.1 | 9.6.1 | dependencies |
| @react-three/drei | ^10.7.7 | 10.7.7 | dependencies |
| @types/three | ^0.184.1 | 0.184.1 | devDependencies |
| motion | ^12.40.0 | (Phase 3) | dependencies — NOT reinstalled |

React/React-DOM remain pinned at ^19.2.4; the entire `react` dependency tree deduped to 19.2.4.

## Version-Range Assertions Enforced by check-stack.mjs

`check-stack.mjs` strips any leading range operator and reads the first numeric segment as the major:
- `motion` major **>= 12**
- `@react-three/fiber` major **>= 9** (v8 does NOT support React 19)
- `@react-three/drei` major **>= 10** (the React-19 / fiber-9 line)
- `three` and `@types/three`: **presence only** (three has no React constraint; @types/three is a devDep)

On any missing dep OR any major below floor it prints each offender and `process.exit(1)`; otherwise prints `stack OK` and exits 0. This is the install proof that survives lockfile churn AND silent major downgrades.

## Bundle-Gate Matcher Approach Chosen — and Why

**Chosen: hash-proof cross-route "canvas-exclusive" diff as the load-bearing matcher, with a named-regex fast-path as a free belt-and-suspenders catch.**

The action ran `next build` (the same build that produced the manifest the `<verify>` step reads — verify did NOT rebuild) and inspected `.next/app-build-manifest.json`:
- Structure confirmed `{ pages: { "<route>": ["static/chunks/...js", ...] } }`, 36 routes, 45 unique chunks.
- Grepping every chunk path with `/three|react-three|fiber|drei/i` returned **ZERO** hits — three is NOT name-tagged in any chunk filename.

Because a filename regex would silently miss a webpack-HASHED vendor chunk (research Open Question 2: the three vendor chunk may emit as e.g. `static/chunks/4521.js`), the gate's primary check is the cross-route assertion: compute the set of chunks that appear ONLY on `CANVAS_ROUTES` (canvas-exclusive) and assert NO non-canvas route includes any of them. The named regex is kept as a cheap fast-path but is not relied upon. This makes the gate robust to webpack chunk hashing once a later plan actually imports three. With no scene mounted this phase, three is absent everywhere and the gate passes trivially — expected, and still proves the parser executes against a real manifest.

`CANVAS_ROUTES` defaults to the homepage `/page` (research default — Phase 5's WebGL hero replaces the homepage hero) with an explicit "UPDATE this set as Phase 5 adds scenes" comment.

## Phase-3 Guard Confirmation

The Task-1 Step-A hard guard ran and printed `Phase 3 outputs present — proceeding.` All three Phase-3 outputs exist; none were re-authored. The plan did NOT block at Task 1.

## Task Commits

Each task was committed atomically (`--no-verify`, explicit per-file staging):

1. **Task 1: Phase-3 guard + install React-19 3D stack** - `51f6653` (chore)
2. **Task 2: Author check-stack.mjs + bundle-gate.mjs, tune against real manifest** - `69e3f80` (feat)

## Files Created/Modified
- `scripts/check-stack.mjs` - FOUND-04 zero-dep install gate: dep presence + major-version floors
- `scripts/bundle-gate.mjs` - PERF-01 zero-dep budget gate: dual matcher (named fast-path + hash-proof canvas-exclusive cross-route diff)
- `package.json` - added three/fiber/drei to dependencies, @types/three to devDependencies
- `package-lock.json` - lockfile updated (55 packages added)

## Decisions Made
See `key-decisions` frontmatter. In short: cross-route diff over filename regex (real manifest showed no name-tagging); CANVAS_ROUTES = homepage; no @next/bundle-analyzer (next.config.ts untouched); motion not duplicated.

## Deviations from Plan

None - plan executed exactly as written. motion was present (Phase-3), so the conditional `npm install motion` branch was correctly skipped; `node_modules` was present, so the conditional `npm ci` was correctly skipped.

**Total deviations:** 0.
**Impact on plan:** None — clean execution; both gates green on first run.

## Issues Encountered
None. (Pre-existing CRLF line-ending warnings from git on Windows are cosmetic and expected. `npm audit` reports 30 vulnerabilities across the tree — these are pre-existing/transitive in the broader dependency graph, out of scope for this plan, and not introduced by the 3D stack specifically; logged here for awareness, not fixed per scope boundary.)

## User Setup Required
None - no external service configuration required.

## Known Stubs
None. Both scripts are complete, runnable, and green. `bundle-gate.mjs` passing "trivially" (three absent everywhere) is the EXPECTED and documented result for this phase — no scene mounts yet — not a stub. The `CANVAS_ROUTES` set is intentionally seeded with the homepage and carries a comment instructing Phase 5 to extend it.

## Next Phase Readiness
- 3D stack is installed and React-19 peer-clean — Plan 04-02/04-03 can import `three` / `@react-three/fiber` / `@react-three/drei` and consume the Phase-3 hooks (`@/hooks/useAnimationGate`, `@/hooks/useThemeColors`) + `IslandBoundary` directly.
- Both gate scripts are ready to be run by every later Phase-4/5 plan: `node scripts/check-stack.mjs` (install proof, anytime) and `node scripts/bundle-gate.mjs` after `next build` (budget proof). Once a scene mounts on `/page`, the cross-route matcher arms automatically and will flag any three leak onto a non-canvas route.
- Reminder for the plan that first mounts a scene: confirm the homepage is still the canvas route, and extend `CANVAS_ROUTES` in `bundle-gate.mjs` if a scene is added elsewhere.

## Self-Check: PASSED

All created files present; both task commits found in git history (verified below).

---
*Phase: 04-r3f-infrastructure*
*Completed: 2026-06-12*
