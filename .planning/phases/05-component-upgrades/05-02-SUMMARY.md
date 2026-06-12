---
phase: 05-component-upgrades
plan: 02
subsystem: canvas-2d
tags: [canvas-2d, dpr, retina, setTransform, useThemeColors, useAnimationGate, theme-reactive, perf, globe, particle-network, rAF-gate]

requires:
  - phase: 03-shared-foundation
    provides: "useAnimationGate (shouldAnimate gate: reduced-motion + in-view + tab-visible), useThemeColors (CSS-var -> resolved hex string, re-reads on data-theme via MutationObserver, never per-frame)"
provides:
  - "InteractiveGlobe.tsx — retina DPR bug fixed via ctx.setTransform (no compounding scale); --accent-blue/--accent-violet theme tokens; useAnimationGate-gated rAF; all 31 POPs/15 arcs/drag/auto-rotate/ResizeObserver preserved"
  - "IdeaNetworkCanvas.tsx — cached rect (no per-frame getBoundingClientRect); DPR-2 via setTransform; --accent-violet/--accent-blue/--accent-emerald tokens (amber sparks remapped to emerald); velocity-clamp physics polish; gated rAF; 3 node types preserved"
affects: [05-09]

tech-stack:
  added: []
  patterns:
    - "Canvas-2D DPR canonical pattern: canvas.width = cssW*dpr; canvas.height = cssH*dpr; ctx.setTransform(dpr,0,0,dpr,0,0) TOGETHER per size change. setTransform RESETS the matrix (idempotent across re-runs); ctx.scale MULTIPLIES (accumulates) — the named retina bug."
    - "Theme-reactive canvas color: useThemeColors returns resolved hex; a small hexToRGBTriplet() parser converts each token to an 'r, g, b' channel triplet, mirrored into a ref so the long-lived rAF closure reads the LATEST theme each frame (cheap string read) without re-creating the loop."
    - "Closed-accent-set reuse: when a needed color (amber) has no token and adding a new color family is forbidden, remap to the unused member of the closed accent set (--accent-emerald) rather than hardcoding — keeps both themes correct."
    - "Cache getBoundingClientRect: read once on mount/resize into a ref; refresh only the OFFSET on scroll (passive); the draw loop reads cached CSS size — zero per-frame layout reads."

key-files:
  created: []
  modified:
    - src/components/InteractiveGlobe.tsx
    - src/components/IdeaNetworkCanvas.tsx

key-decisions:
  - "Amber spark token: no --accent-amber exists and the plan forbids a new color family, so the IdeaNetwork sparks (was rgba(251,191,36)) map to --accent-emerald — the third, otherwise-unused member of the closed accent set — giving the sparks a distinct, theme-aware identity in both themes."
  - "DPR fix uses ctx.setTransform(dpr,0,0,dpr,0,0) (NOT ctx.scale) in both components — setTransform resets the matrix so re-running the resize/render effect on every dimensions/getRadius change can never compound the scale (the named retina/DPR-2 coordinate bug)."
  - "Near-white highlight literals kept verbatim (Globe dot core rgba(200,220,255), IdeaNetwork idea-core rgba(255,255,255)) and the Globe dark-navy ambient background tints (rgba(30,27,75)/(15,13,45)) — these are not accent colors and the plan's residual-literal check targets only the blue/violet/amber accent set."

patterns-established:
  - "Refined Canvas-2D (not a WebGL rewrite): fix DPR + tokenize colors + gate the loop while preserving exact geometry/interaction — the low-risk path for retained 2D components."

requirements-completed: [VIS-02, VIS-03, PERF-02]

duration: 7min
completed: 2026-06-12
---

# Phase 5 Plan 02: InteractiveGlobe + IdeaNetworkCanvas Refinement Summary

**Refined both retained Canvas-2D components without a WebGL rewrite: fixed the named retina/DPR-2 coordinate bug by replacing the compounding `ctx.scale(dpr,dpr)` with the idempotent `ctx.setTransform(dpr,0,0,dpr,0,0)` in both; made every accent color theme-reactive via `useThemeColors` (Globe blue/violet; IdeaNetwork violet/blue + amber-sparks-remapped-to-emerald); eliminated IdeaNetwork's per-frame `getBoundingClientRect` by caching the rect; and added a per-type velocity clamp for smoother physics settle — all 31 POPs, 15 arcs, drag/auto-rotate, ResizeObserver, 3 node types, orbit, and gated rAF preserved intact.**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-06-12T06:45:11Z
- **Completed:** 2026-06-12T06:52:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

### Task 1 — InteractiveGlobe
- **DPR fix (the named bug):** replaced `ctx.scale(dpr, dpr)` with `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` (mirrors `Hero3DScene.tsx`). The render effect re-runs on `[dimensions, getRadius]`; `scale` MULTIPLIES the matrix so each re-run compounded the scale and blew up the coordinate space on retina — `setTransform` RESETS the matrix, so it is now safe and applied exactly once per size change, never inside the per-frame draw.
- **Theme tokens:** `useThemeColors(['--accent-blue', '--accent-violet'])`; a `hexToRGBTriplet()` helper resolves each token to an `'r, g, b'` triplet, mirrored into `rgbRef` and read fresh each frame so the existing `ALPHA` placeholder and the blue→violet arc gradient interpolate from live theme channels (re-reads on `data-theme` flip, never per-frame from `getComputedStyle`). Replaced every `rgba(96,165,250)` / `rgba(167,139,250)` accent literal (lat/lon/equator lines, outer glow, POP dot glow, connection arcs, inner sphere shading).
- **Preserved:** all 31 POPs, 15 great-circle arcs (slerp, lifted 8%), drag-rotate (Pointer Events + setPointerCapture, ±π/2 clamp), auto-rotate `y+=0.003`, ResizeObserver, `touchAction:"none"`, optional `size` prop, and the existing `useAnimationGate` rAF gate (draw-then-check single settle frame, re-arm on gate flip).

### Task 2 — IdeaNetworkCanvas
- **Cached rect (jank fix):** the draw loop no longer calls `getBoundingClientRect()` every frame. A `rectRef` caches CSS size + offset, populated on mount/resize; a passive `scroll` listener refreshes only the offset (cheap, size unchanged) so mouse mapping stays correct on the scrollable `/ideas` page. The draw loop and `mousemove` both read the cache.
- **DPR-2 via setTransform:** the DPR-capped path now uses `ctx.setTransform(dpr,...)` instead of `ctx.scale`; `init()` re-seeds nodes against the CSS-pixel size.
- **Theme tokens:** `useThemeColors(['--accent-violet','--accent-blue','--accent-emerald'])` replaces all violet/blue/amber literals across connections, traveling pulse dots, idea-node glow+core, regular nodes+ring, spark fill, and cursor glow.
- **Physics polish:** kept damping ×0.995, mouse attraction `1 - dist/180`, and spark orbit; added a per-type velocity speed clamp (sparks 2.4, idea/node 1.4) so sustained attraction/orbit can no longer accelerate a node into jitter — a smoother settle with no force/behavior removed.
- **Preserved:** 6 idea + ~54 node + 20 spark nodes, dynamic connections within `min(w,h)*0.22`, traveling pulse dots, 120px cursor glow, and the existing `useAnimationGate` rAF gate. Removed one dead unused `frameRef`.

## Task Commits

Each task committed atomically (`--no-verify`, explicit per-file staging):

1. **Task 1: InteractiveGlobe — DPR setTransform fix + theme tokens + gate** — `861c4b7` (feat) — `src/components/InteractiveGlobe.tsx`
2. **Task 1 fixup: const startTime (prefer-const lint)** — `fdfc00f` (fix) — `src/components/InteractiveGlobe.tsx`
3. **Task 2: IdeaNetworkCanvas — cache rect + physics polish + theme tokens + gate** — `56fb6d6` (feat) — `src/components/IdeaNetworkCanvas.tsx`

## Files Created/Modified

- `src/components/InteractiveGlobe.tsx` (modified) — `useThemeColors` import + `hexToRGBTriplet` helper; `setTransform` DPR fix; token-driven accent colors throughout the draw loop; arc gradient interpolated from resolved blue→violet channels.
- `src/components/IdeaNetworkCanvas.tsx` (modified) — `useThemeColors` import + `hexToRGBTriplet` helper; `rectRef` cache (mount/resize) + passive scroll-offset refresh; `setTransform` DPR-2 path; `init(w,h)` signature; all node/connection/spark colors tokenized (amber→emerald); per-type velocity clamp; dead `frameRef` removed.

## Decisions Made

See `key-decisions` frontmatter. In short:
- **Amber spark token → `--accent-emerald`** (no `--accent-amber` token; new color family forbidden by plan → reuse the unused closed-set member).
- **`setTransform` not `scale`** in both components (idempotent matrix reset fixes the compounding-scale retina bug).
- **Near-white highlights and dark-navy ambient tints kept verbatim** — not accent colors; outside the residual-literal check scope.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Lint] `let startTime` → `const startTime` in InteractiveGlobe**
- **Found during:** Task 1 verification (the plan's `<verification>` requires `npm run lint` clean on both files).
- **Issue:** ESLint `prefer-const` error on a pre-existing `let startTime = performance.now()` inside the render effect I was editing — never reassigned.
- **Fix:** Changed to `const`. Trivial, in my owned file, required to satisfy the lint gate.
- **Files modified:** `src/components/InteractiveGlobe.tsx`
- **Commit:** `fdfc00f`

**2. [Rule 1 - Lint] Removed dead unused `frameRef` in IdeaNetworkCanvas**
- **Found during:** Task 2 lint (`@typescript-eslint/no-unused-vars` warning).
- **Issue:** A `frameRef = useRef(0)` was declared but never read (pre-existing dead code) in a file I was fully refactoring.
- **Fix:** Removed the declaration — file is now lint-warning-clean.
- **Files modified:** `src/components/IdeaNetworkCanvas.tsx`
- **Commit:** `56fb6d6` (folded into the Task-2 feat commit)

**3. [Rule 2 - Correctness] Added passive `scroll` offset refresh in IdeaNetworkCanvas**
- **Found during:** Task 2 (caching the rect).
- **Issue:** Caching `getBoundingClientRect` once would make the cursor-glow/mouse-attraction mapping drift as the user scrolls the `/ideas` page (the canvas is a full-page scrollable background) — caching naively would have introduced a correctness regression versus the old per-frame read.
- **Fix:** Added a passive `window` `scroll` listener that refreshes ONLY the cached `left`/`top` offset (size unchanged → no canvas resize/re-seed). Preserves correct mouse mapping while still removing the per-frame layout read. Cleanup added to the effect teardown.
- **Files modified:** `src/components/IdeaNetworkCanvas.tsx`
- **Commit:** `56fb6d6`

---

**Total deviations:** 3 auto-fixed (2 lint, 1 correctness). No architectural changes, no scope creep. All geometry/interaction additive/identity-preserving.

## Issues Encountered

- Pre-existing `tsc --noEmit` errors in unrelated API/expertise files persist (documented in Phase 4 `deferred-items.md`), non-blocking by `typescript.ignoreBuildErrors: true`; both files I touched are tsc-clean and lint-clean (0 problems).
- The parallel 05-03 agent's `05-03-SUMMARY.md` appeared untracked mid-run — left untouched per the parallel-execution boundary (it owns `ScrollReveal.tsx` + `InteractiveButton.tsx`).
- Windows CRLF line-ending warnings on commit — cosmetic.

## Known Stubs

None. All changes operate on existing, fully-wired geometry and color logic; no placeholder/empty/mock values introduced. The amber→emerald spark remap is an intentional, documented color choice, not a stub.

## Manual Verification Deferred (to 05-09 gate)

- DPR-2 emulation in BOTH themes → both canvases render crisp (no blur/coordinate blow-up).
- Scroll off-screen / switch tab / reduced-motion → both rAF loops stop scheduling and resume on return (gate already wired; structure preserved).
- Theme toggle → both canvases recolor live (tokens re-read via `useThemeColors` MutationObserver).

## Self-Check: PASSED

All claims verified:
- FOUND: `src/components/InteractiveGlobe.tsx` (modified, tsc + lint clean)
- FOUND: `src/components/IdeaNetworkCanvas.tsx` (modified, tsc + lint clean)
- FOUND: `.planning/phases/05-component-upgrades/05-02-SUMMARY.md`
- FOUND commit `861c4b7` (feat — Globe DPR + tokens)
- FOUND commit `fdfc00f` (fix — Globe prefer-const)
- FOUND commit `56fb6d6` (feat — IdeaNetwork)
- Regex gates: `ctx.setTransform` present in both; `useAnimationGate` + `useThemeColors` in both; no residual blue/violet/amber accent literals; no `getBoundingClientRect` inside the IdeaNetwork frame loop (only mount/resize/scroll).

---
*Phase: 05-component-upgrades*
*Completed: 2026-06-12*
