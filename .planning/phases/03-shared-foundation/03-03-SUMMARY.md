---
phase: 03-shared-foundation
plan: 03
subsystem: ui
tags: [error-boundary, react-class-component, next-app-router, canvas, requestAnimationFrame, animation-gate, off-screen-pause, reduced-motion, static-poster]

# Dependency graph
requires:
  - phase: 03-shared-foundation (Plan 03-02)
    provides: "useAnimationGate(ref, opts?) -> { shouldAnimate, prefersReduced, inView, tabVisible } — the single off-screen/tab-blur/reduced-motion gate"
  - phase: 03-shared-foundation (Plan 03-01)
    provides: "AA muted token + handoff list of info-bearing faint usages in the two canvas-wiring pages (ideas/fund-me) for this plan to relabel"
provides:
  - "IslandBoundary — reusable class error boundary isolating each canvas island to a static-poster fallback (no white-screen)"
  - "error.tsx — themed route-level client boundary with reset() retry"
  - "global-error.tsx — root boundary with its own <html>/<body> shell + literal-hex styling"
  - "3 Canvas-2D islands (Hero3DScene, IdeaNetworkCanvas, InteractiveGlobe) gated through useAnimationGate: rAF stops off-screen/tab-blur/reduced-motion after one final static frame, re-arms when the gate reopens"
  - "3 islands boundary-wrapped with themed static posters; ideas/fund-me handed-off faint->muted relabels applied"
affects: [03-04, 04-hero-webgl, 05-component-upgrades, phase-06-ship-gate]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-island React class error boundary (getDerivedStateFromError + componentDidCatch) wrapping each ssr:false canvas; fallback doubles as the reduced-motion/no-WebGL static poster"
    - "Next.js App Router error.tsx (route) + global-error.tsx (root, own html/body) recovery trio"
    - "rAF gating via gateRef mirror of shouldAnimate (stale-closure fix): draw-then-check, re-schedule only while gate open, one final static frame on the false transition, re-arm via a shouldAnimate effect"

key-files:
  created:
    - src/components/IslandBoundary.tsx
    - src/app/error.tsx
    - src/app/global-error.tsx
    - .planning/phases/03-shared-foundation/03-03-SUMMARY.md
  modified:
    - src/components/Hero3DScene.tsx
    - src/components/IdeaNetworkCanvas.tsx
    - src/components/InteractiveGlobe.tsx
    - src/components/Hero3D.tsx
    - src/app/ideas/page.tsx
    - src/app/fund-me/page.tsx

key-decisions:
  - "IslandBoundary is the repo's only class component — required and correct (error-boundary lifecycle is class-only, no hook equivalent)"
  - "global-error.tsx uses literal hex (#0a0a0f/#fff) not theme CSS vars: it replaces the root layout so token scoping is unreliable there (Pitfall #3)"
  - "gateRef stale-closure mirror + draw-then-check + a separate shouldAnimate effect to re-arm an idle loop — chosen over an always-scheduled early-return tick so a paused canvas schedules ZERO frames (true PERF-04 pause, not a busy idle)"
  - "Static-poster fallbacks use theme tokens (--bg-card/--bg-secondary) so a failed/reduced-motion canvas looks intentional in both themes, never an error message (Pitfall #4)"
  - "Rendering math, DPR handling, props, and dynamic()/ssr:false imports left completely untouched — this plan is gating + boundaries only; visual redesign is Phase 5's"

patterns-established:
  - "Pattern: each animated canvas owns drawRef + runningRef + gateRef; rAF body ends with `if (gateRef.current) reschedule; else runningRef=false`; a `[shouldAnimate]` effect mirrors the gate and re-kicks the stored draw/render when it reopens"
  - "Pattern: wrap each ssr:false island in <IslandBoundary fallback={<themed poster sized to the island box/>}> so a throw degrades locally instead of bubbling to error.tsx"

requirements-completed: [FOUND-05, FOUND-02, PERF-04]

# Metrics
duration: 5min
completed: 2026-06-12
---

# Phase 3 Plan 03: Error-Boundary Trio + Canvas Animation Gating Summary

**Stood up the FOUND-05 error-boundary trio (a reusable IslandBoundary class boundary, a themed route-level error.tsx with reset(), and a root global-error.tsx with its own html/body shell), gated all three existing Canvas-2D islands through useAnimationGate so every rAF loop stops off-screen / on tab blur / under reduced motion after one final static frame (FOUND-02 consumption + PERF-04), and wrapped each island in IslandBoundary with a themed static-poster fallback — plus applied Plan 03-01's handed-off faint→muted relabels in ideas/fund-me.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-06-12T02:38:16Z
- **Completed:** 2026-06-12T02:42:43Z
- **Tasks:** 3
- **Files modified:** 10 (3 created boundary files + 1 summary; 6 source modified)

## Accomplishments
- **Error-boundary trio (FOUND-05):** `IslandBoundary.tsx` (class boundary: `getDerivedStateFromError` + `componentDidCatch` → fallback), `error.tsx` (themed route boundary with `reset()` retry using `--bg-primary`/`--text-primary`/`--btn-primary-*`), `global-error.tsx` (own `<html lang="en-AU"><body>` shell, literal hex). A thrown island render error now degrades to a poster; a thrown route error shows a recovery screen — never a white screen.
- **Canvas gating (FOUND-02 + PERF-04):** all three canvases (`Hero3DScene`, `IdeaNetworkCanvas`, `InteractiveGlobe`) now `useAnimationGate(REF)` on the element they already own (canvasRef / canvasRef / containerRef), mirror `shouldAnimate` into a `gateRef` (Pitfall #2 stale-closure fix), and end each draw/render with a draw-then-check re-schedule. When the gate is false the canvas paints one correct static frame and schedules **zero** further frames; a `[shouldAnimate]` effect re-arms the idle loop when the gate reopens. Rendering math/DPR/props untouched.
- **Island wrapping (FOUND-05):** each `ssr:false` island wrapped in `<IslandBoundary fallback={<themed poster/>}>` sized to its box (Hero full-bleed `--bg-card`; ideas full-bleed `--bg-secondary`; globe `h-[350px] md:h-[400px] rounded-2xl --bg-card`). The poster doubles as the reduced-motion/no-WebGL static view (Pitfall #4 — looks intentional, not an error).
- **Handed-off relabels (from Plan 03-01):** promoted the 9 info-bearing `--text-faint` usages 03-01 deferred to this plan — ideas L199/L240/L302 and fund-me L172/L205/L252/L254/L315/L354 → `--text-muted`. Kept the decorative `fund-me` "Drag to explore" hint faint per the handoff. `node scripts/contrast-check.mjs` still exits 0.

## Task Commits

Each task committed atomically (`--no-verify`, explicit per-file staging):

1. **Task 1: error-boundary trio (IslandBoundary + error.tsx + global-error.tsx)** - `d9760b1` (feat)
2. **Task 2: gate 3 canvas rAF loops via useAnimationGate** - `7b98f0b` (feat)
3. **Task 3: wrap 3 islands in IslandBoundary + apply handed-off relabels** - `095d084` (feat)

**Plan metadata:** (final commit) `docs(03-03)`

## Files Created/Modified
- `src/components/IslandBoundary.tsx` *(created)* - reusable class error boundary; the repo's only class component (correct — boundaries are class-only)
- `src/app/error.tsx` *(created)* - themed route-level boundary, `reset()` retry, theme CSS vars
- `src/app/global-error.tsx` *(created)* - root boundary, own `<html>/<body>`, literal hex (replaces layout, so tokens unreliable)
- `src/components/Hero3DScene.tsx` - `useAnimationGate(canvasRef)` + gateRef/drawRef/runningRef; gated re-schedule + re-arm effect
- `src/components/IdeaNetworkCanvas.tsx` - `useAnimationGate(canvasRef)` + same gating pattern
- `src/components/InteractiveGlobe.tsx` - `useAnimationGate(containerRef)` + gating pattern on the `render(time)` loop (renderRef)
- `src/components/Hero3D.tsx` - import IslandBoundary; wrap `<Hero3DScene/>` with `--bg-card` poster
- `src/app/ideas/page.tsx` - import IslandBoundary; wrap `<IdeaNetworkCanvas/>` with `--bg-secondary` poster; 3 faint→muted relabels
- `src/app/fund-me/page.tsx` - import IslandBoundary; wrap `<InteractiveGlobe/>` with sized `--bg-card` poster; 6 faint→muted relabels (decorative hint kept faint)

## Decisions Made
- **gateRef mirror + draw-then-check + re-arm effect** (over an always-scheduled early-return tick): a paused canvas must schedule no frames at all for a real PERF-04 pause; the chosen pattern stops the loop entirely and revives it only when `shouldAnimate` flips true while idle (`runningRef` guard prevents double-scheduling).
- **One final static frame on the false transition:** the gate is checked AFTER a full frame is painted, so reduced-motion/off-screen always shows a correct frozen image, never a blank canvas (draw-then-check, never check-then-skip).
- **global-error literal hex:** it replaces the root layout, so theme CSS vars aren't reliably scoped — used `#0a0a0f`/`#fff` so the critical-failure screen is always legible (Pitfall #3).
- **Posters use theme tokens:** failed/reduced-motion canvases look intentional in both themes (Pitfall #4), doubling as the static no-WebGL view future phases can rely on.

## Deviations from Plan

None - plan executed exactly as written.

All `<interfaces>` repo anchors matched the live source after re-reading (Hero3DScene re-schedule at the cursor-glow tail + `draw()` kickoff; IdeaNetworkCanvas `animId = requestAnimationFrame(draw)` re-schedule + kickoff; InteractiveGlobe `animFrameRef.current = requestAnimationFrame(render)` re-schedule + kickoff with `containerRef`). The 9 handed-off relabel lines from 03-01 matched the live `--text-faint` usages exactly; the decorative "Drag to explore" hint was preserved as instructed.

**Total deviations:** 0.
**Impact on plan:** None. Error-boundary trio shipped, all 3 canvases gated with true off-screen pause + final static frame, all 3 islands boundary-wrapped, audited relabels applied, contrast gate still green, rendering untouched.

## Issues Encountered
None. Pre-existing repo tsc errors (29 lines, all in unrelated files: `api/ai-training`, `api/auto-llm-training`, `api/budget-estimate`, `api/create-checkout`, `expertise/page.tsx`) are latent and out of scope (`typescript.ignoreBuildErrors: true` per STACK.md) — untouched, count unchanged before/after this plan. All 9 files this plan touched are tsc-clean. CRLF line-ending warnings on commit are cosmetic/expected on Windows.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all three boundary files are complete with correct Next.js/React contracts; all three canvases are fully gated and wired to the live `useAnimationGate`; all three islands are wrapped with real themed posters (not placeholders). No empty data sources, no TODO/placeholder content introduced.

## Verification Notes (for Plan 03-04 / SHIP gate)
- `node scripts/contrast-check.mjs` exits 0 (relabels don't change token values).
- `npx tsc --noEmit`: all 9 touched files clean; pre-existing 29-error baseline unchanged.
- Manual smoke recommended at the Phase 3 SHIP gate (no dev server started by this autonomous plan): (1) throw inside a canvas → poster shows, page chrome survives, no white screen; (2) scroll a canvas off-screen / switch tabs / enable reduced motion → rAF stops on a correct static frame; (3) scroll back / refocus → loop resumes. FOUND-05 boundary behavior is formally verified in Plan 03-04.

## Next Phase Readiness
- FOUND-05 (error-boundary trio), FOUND-02 (useAnimationGate consumption), PERF-04 (off-screen/tab-blur/reduced-motion pause) complete for the existing canvases.
- Phase 4 (WebGL hero) inherits the IslandBoundary + gating pattern: wrap the new R3F canvas in IslandBoundary and consume useAnimationGate the same way.
- Plan 03-04 can now verify the thrown-error → poster path and the rAF-pause behavior end-to-end.

## Self-Check: PASSED

All created files present on disk (IslandBoundary.tsx, error.tsx, global-error.tsx, 03-03-SUMMARY.md); all modified files present; all 3 task commits (d9760b1, 7b98f0b, 095d084) found in git history.

---
*Phase: 03-shared-foundation*
*Completed: 2026-06-12*
