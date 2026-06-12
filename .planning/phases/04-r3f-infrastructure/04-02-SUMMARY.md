---
phase: 04-r3f-infrastructure
plan: 02
subsystem: three
tags: [three, react-three-fiber, webgl, ssr-false, dynamic-import, island, dpr-clamp, frameloop-gate, context-loss, theme-bridge, error-boundary, perf-route-split]

requires:
  - phase: 03-shared-foundation
    provides: "useAnimationGate (shouldAnimate/prefersReduced gate), useThemeColors (CSS-var -> raw hex bridge), IslandBoundary (default-export class error boundary, prop `fallback`)"
  - phase: 04-r3f-infrastructure
    provides: "Plan 04-01 — three@0.184 / @react-three/fiber@9.6 / @react-three/drei@10.7 + @types/three installed React-19-clean; check-stack.mjs + bundle-gate.mjs gates"
provides:
  - "ClientScene — the SOLE public entry point for the WebGL island: dynamic(ssr:false) SceneCanvas + IslandBoundary(fallback=poster) + mounted-gated isWebGLAvailable() probe"
  - "SceneCanvas — single-GL-context <Canvas> provider: dpr={[1,2]}, frameloop bound to useAnimationGate, webglcontextlost -> ScenePoster"
  - "ThemedScene — rotating icosahedron wireframe; useThemeColors -> THREE.Color for two accents, reconciles on data-theme with NO remount"
  - "ScenePoster — full-size token-gradient poster (LCP / loading / reduced-motion / no-WebGL / context-loss view), zero CLS"
  - "isWebGLAvailable() — SSR-guarded getContext probe (no React)"
affects: [04-03, 05-component-upgrades, hero-webgl]

tech-stack:
  added: []
  patterns:
    - "ssr:false dynamic import ONLY inside a 'use client' file (Next 15 build-errors it in a server file) — ClientScene is that legal boundary"
    - "Poster-first island: a static token-gradient poster is the loading view, IslandBoundary fallback, reduced-motion view AND no-WebGL/context-loss view — keeps `three` off the LCP path and guarantees zero CLS"
    - "frameloop bound to Phase-3 useAnimationGate ('always'/'never') so the render loop fully STOPS off-screen / tab-blur / reduced-motion (no idle GPU cost) — not just a paused rAF"
    - "Theme bridge: useThemeColors raw hex -> new THREE.Color() via useMemo; new color prop reconciles onto the material with NO mesh remount on data-theme toggle"
    - "Domain-grouped components subdir src/components/three/ (deliberate departure from CLAUDE.md's flat src/components/) for self-contained R3F island co-location"

key-files:
  created:
    - src/lib/webgl.ts
    - src/components/three/ScenePoster.tsx
    - src/components/three/SceneCanvas.tsx
    - src/components/three/ThemedScene.tsx
    - src/components/three/ClientScene.tsx
  modified: []

key-decisions:
  - "isWebGLAvailable() pre-mount gate WAS added to ClientScene (the optional path): mounted+webglOk state guards the island so machines without WebGL land on the poster client-side only — matches the repo's `mounted` hydration convention"
  - "IslandBoundary consumed as DEFAULT export with prop name `fallback` (confirmed from the actual file, not the contract's guess) — fallback={<ScenePoster/>}"
  - "useThemeColors useMemo deps keyed on the whole returned object `t` (not t['--accent-blue']) — the hook returns a fresh object only on data-theme change, so this recomputes both THREE.Colors exactly once per theme flip, never per-frame"
  - "src/components/three/ is a CONSCIOUS, SCOPED convention exception — Phase 5+ MUST follow the same three/ grouping for new scene work rather than reverting to flat src/components/"
  - "ssr:false placed inside ClientScene ('use client' line 1) — the single legal boundary; SceneCanvas/ThemedScene/three are NEVER imported from a page/layout/nav/footer"

patterns-established:
  - "Pattern: the ONLY symbol any route imports is ClientScene — never SceneCanvas/ThemedScene/three directly (that is what keeps three route-split for PERF-01)"
  - "Pattern: new R3F scenes go under src/components/three/ and degrade to ScenePoster on any failure (no-WebGL, render throw, context-loss)"
  - "Pattern: every animated R3F component binds frameloop (or a paused flag) to useAnimationGate — gating lives in the Phase-3 hook, never re-implemented inside the Canvas"

requirements-completed: [FOUND-04, PERF-01]

duration: 3min
completed: 2026-06-12
---

# Phase 4 Plan 02: WebGL Island (SceneCanvas + ClientScene ssr:false wrapper) Summary

**A thin, reusable SSR-safe WebGL island: a `dynamic(ssr:false)` `ClientScene` wrapper composing Phase-3's `IslandBoundary` + a static token-gradient `ScenePoster`, a DPR-clamped `SceneCanvas` provider whose frameloop is driven by `useAnimationGate` with a `webglcontextlost` -> poster handler, and one trivial `ThemedScene` (rotating icosahedron wireframe) that consumes `useThemeColors` inside the Canvas and reacts to `data-theme` with no remount. All five files are NEW; `three` is reachable only through `ClientScene` and is mounted on NO route yet.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-06-12T05:51:09Z
- **Completed:** 2026-06-12T05:53:44Z
- **Tasks:** 3
- **Files modified:** 5 (5 created, 0 modified)

## Accomplishments
- Phase-3 primitives CONSUMED, never re-authored: `useAnimationGate(wrapRef)` drives `frameloop` in SceneCanvas; `useThemeColors(['--accent-blue','--accent-violet'])` feeds two `THREE.Color`s in ThemedScene; `IslandBoundary` (default export, prop `fallback`) wraps the dynamic Canvas in ClientScene.
- The island degrades to the static `ScenePoster` on ALL three failure modes: no-WebGL (mounted-gated `isWebGLAvailable()` probe), runtime render throw (IslandBoundary fallback), and `webglcontextlost` (SceneCanvas state swap). None crashes to `error.tsx`.
- DPR explicitly clamped `dpr={[1, 2]}` and exactly ONE `<Canvas>` mounts — provable pixel budget, single GL context.
- frameloop fully STOPS (`"never"`) off-screen / tab-blur / reduced-motion via the Phase-3 gate — no idle GPU cost, not merely a paused rAF.
- Theme bridge proven end-to-end: both accents (`--accent-blue` -> wireframe, `--accent-violet` -> ambientLight) reconcile onto live material/light props on `data-theme` toggle with NO mesh remount.
- `three` route-split preserved: `rg -l "from 'three'|@react-three|ClientScene"` across all text/SEO/shared routes + `layout.tsx` returns NOTHING — the island is built but mounted nowhere (that is Plan 04-03).
- All five files type-check clean under `tsc --noEmit` (R3F intrinsic JSX elements `icosahedronGeometry`/`meshBasicMaterial`/`ambientLight`/`mesh` resolve, confirming fiber's JSX augmentation is active).

## Component APIs — Phase 5 Contract

```ts
// src/components/three/ClientScene.tsx  ('use client') — THE ONLY public entry point
export default function ClientScene(props: { className?: string }): JSX.Element;
// Renders ScenePoster pre-mount and on no-WebGL machines; otherwise
// IslandBoundary(fallback=ScenePoster) wrapping a dynamic(ssr:false) SceneCanvas.
// Import THIS from a page/section — NEVER SceneCanvas/ThemedScene/three directly.

// src/components/three/SceneCanvas.tsx  ('use client')
export default function SceneCanvas(props: { className?: string }): JSX.Element;
// dpr={[1,2]}; frameloop = shouldAnimate ? 'always' : 'never' (useAnimationGate);
// gl={{ antialias:true, powerPreference:'high-performance', failIfMajorPerformanceCaveat:false }};
// webglcontextlost -> renders <ScenePoster/>. ONE <Canvas>. (Imported only by ClientScene's dynamic.)

// src/components/three/ThemedScene.tsx  ('use client')
export default function ThemedScene(props: { paused: boolean }): JSX.Element;
// useThemeColors(['--accent-blue','--accent-violet']) -> THREE.Color (useMemo, fallback hex while {});
// rotates only when !paused; <icosahedronGeometry args={[1.4,0]}/> wireframe + ambientLight.

// src/components/three/ScenePoster.tsx  ('use client')
export default function ScenePoster(props: { className?: string }): JSX.Element;
// Full-size (100%x100%) token-gradient div, no animation, zero CLS. The LCP/fallback element.

// src/lib/webgl.ts  (no 'use client', no React)
export function isWebGLAvailable(): boolean;
// false on server; getContext('webgl2'||'webgl') probe; false on throw. Run client-side only.
```

**Phase 5 usage:** drop a real scene by either replacing `ThemedScene`'s body (keeping the `{ paused }` contract) or adding a sibling under `src/components/three/` and swapping it into `SceneCanvas`. Mount on a route by importing `ClientScene` ONLY, then extend `CANVAS_ROUTES` in `scripts/bundle-gate.mjs` for that route.

## Plan Output Questions — Answered

- **IslandBoundary fallback prop name used:** `fallback` (default export; `import IslandBoundary from "@/components/IslandBoundary"`). Confirmed from the real file, matching the Hero3D precedent.
- **isWebGLAvailable() pre-mount gate added to ClientScene?** YES — the optional path was taken. `mounted` + `webglOk` state; `if (!mounted || !webglOk) return <ScenePoster/>`. The probe runs in `useEffect` (client-only), per the repo's `mounted` hydration convention.
- **Public import surface:** `ClientScene` ONLY. `SceneCanvas`/`ThemedScene`/`three` are never imported from a page/layout/nav/footer — this is what keeps `three` route-split.
- **Convention departure:** `src/components/three/` is a deliberate, scoped domain-grouping exception to CLAUDE.md's flat `src/components/` directory. Phase 5+ MUST keep new scene work under `three/` rather than reverting to flat.

## Convention Note (deliberate departure)

CLAUDE.md/CONVENTIONS prescribe a FLAT `src/components/` directory (no subfolders). This plan intentionally introduces `src/components/three/` to keep the R3F island co-located and self-contained. This is a conscious, scoped exception — all three-related components live under `three/`. **Phase 5+ must follow the same `src/components/three/` grouping for new scene work.** `src/lib/webgl.ts` stays in the existing `src/lib/` (no departure there).

## Task Commits

Each task committed atomically (`--no-verify`, explicit per-file staging):

1. **Task 1: WebGL probe + static ScenePoster** - `6f22db5` (feat) — `src/lib/webgl.ts`, `src/components/three/ScenePoster.tsx`
2. **Task 2: SceneCanvas provider + ThemedScene** - `63cd3b4` (feat) — `src/components/three/SceneCanvas.tsx`, `src/components/three/ThemedScene.tsx`
3. **Task 3: ClientScene wrapper (dynamic ssr:false)** - `61ea459` (feat) — `src/components/three/ClientScene.tsx`

## Files Created
- `src/lib/webgl.ts` — `isWebGLAvailable()` SSR-guarded getContext probe (no React)
- `src/components/three/ScenePoster.tsx` — full-size token-gradient poster (LCP/loading/reduced-motion/no-WebGL/context-loss view)
- `src/components/three/SceneCanvas.tsx` — single-Canvas provider: dpr clamp + frameloop gate + context-loss handler
- `src/components/three/ThemedScene.tsx` — rotating icosahedron wireframe; useThemeColors -> THREE.Color theme bridge
- `src/components/three/ClientScene.tsx` — dynamic(ssr:false) + IslandBoundary + ScenePoster; the sole public entry point

## Decisions Made
See `key-decisions` frontmatter. In short: pre-mount WebGL probe WAS added (mounted-gated); IslandBoundary default export with `fallback` prop; useMemo keyed on the whole `t` object (recomputes once per theme flip, never per-frame); `src/components/three/` is a scoped convention exception Phase 5+ follows; ssr:false confined to the ClientScene 'use client' boundary.

## Deviations from Plan

None — plan executed exactly as written. The plan's optional `isWebGLAvailable()` pre-mount gate was included (the plan explicitly offered it as the recommended path). The IslandBoundary prop name resolved to `fallback` exactly as the contract anticipated. No auto-fixes (Rules 1-3) were needed; no architectural decisions (Rule 4) arose.

**Total deviations:** 0.
**Impact on plan:** None — clean execution; all five files type-check clean, every plan-level verification matcher passes, three mounted on no route.

## Issues Encountered

None specific to this plan. `tsc --noEmit` surfaces PRE-EXISTING type errors in unrelated files (`src/app/api/ai-training/route.ts`, `auto-llm-training`, `budget-estimate`, `create-checkout`, `expertise/page.tsx`) — these predate this plan, are out of scope per the scope boundary, and are non-blocking by design (`typescript.ignoreBuildErrors: true` in `next.config.ts`). Logged to `deferred-items.md`. The five files this plan created/touched are all clean. (Pre-existing CRLF line-ending warnings on Windows are cosmetic.)

## User Setup Required
None — no external service configuration required.

## Known Stubs
None. All five files are complete and runnable. The island is intentionally NOT mounted on any route yet — that is Plan 04-03's demo + gate, documented scope, not a stub. `ThemedScene` is deliberately trivial (one icosahedron) as the theme-bridge proof; Phase 5 replaces it with real scenes against the documented `{ paused }` contract.

## Next Phase Readiness
- Plan 04-03 can mount the island by importing `ClientScene` (only) on the homepage / a demo route, then must extend `CANVAS_ROUTES` in `scripts/bundle-gate.mjs` and run `node scripts/bundle-gate.mjs` after `next build` to arm the cross-route three-leak gate.
- Phase 5 has a working poster-first, gated, themed, error-isolated Canvas boundary — real scenes drop in via the `{ paused }` ThemedScene contract or a sibling under `src/components/three/`, no re-solving of gating/theming/fallback.
- Reminder: keep new scene components under `src/components/three/` (the established grouping) and route every page import through `ClientScene` to preserve the three route-split.

## Self-Check: PASSED

All five created files present on disk; all three task commits found in git history (verified below).

---
*Phase: 04-r3f-infrastructure*
*Completed: 2026-06-12*
