---
phase: 03-shared-foundation
plan: 02
subsystem: ui
tags: [motion, hooks, animation, intersection-observer, mutation-observer, reduced-motion, css-variables, theme]

requires:
  - phase: 03-shared-foundation
    provides: "Plan 03-00 — motion@^12.40.0 installed, motion/react resolves on React 19.2.4"
provides:
  - "useAnimationGate hook — single shouldAnimate gate (reduced-motion + inView + tabVisible)"
  - "useThemeColors hook — CSS-var -> string color bridge cached on data-theme mutation"
  - "src/lib/motion.ts — EASE_SIGNATURE/transitions/fadeUp/stagger shared presets"
affects: [03-03, 04-hero-webgl, 05-component-upgrades, ScrollReveal-rewrite]

tech-stack:
  added: []
  patterns:
    - "Single composed animation gate (reduced-motion + IO inView + tab visibility) consumed as one boolean instead of N hand-rolled loops"
    - "Theme-color bridge reads CSS vars once + on data-theme MutationObserver only (never per-frame)"
    - "Shared motion preset module as the single easing/duration source (cubic-bezier(0.16,1,0.3,1))"

key-files:
  created:
    - src/hooks/useAnimationGate.ts
    - src/hooks/useThemeColors.ts
    - src/lib/motion.ts
  modified: []

key-decisions:
  - "useReducedMotion sourced from motion/react (not hand-rolled matchMedia) as the one reduced-motion truth"
  - "prefersReduced coerces motion's null to false via `?? false` so the gate is always a concrete boolean"
  - "useThemeColors returns raw token strings (canvas-ready); THREE.Color parsing deferred to Phase 4 consumers"
  - "transitions use `satisfies Transition` to keep the literal tuple ease type while staying assignable"

patterns-established:
  - "Pattern: one useAnimationGate(ref, opts) -> { shouldAnimate, prefersReduced, inView, tabVisible } gate every animated component consumes"
  - "Pattern: theme-aware canvas colors via useThemeColors(varNames) cached on data-theme mutation, read once per theme change"
  - "Pattern: motion presets (EASE_SIGNATURE/transitions/fadeUp/stagger) imported as the single easing source"

requirements-completed: [FOUND-02, PERF-04]

duration: 4min
completed: 2026-06-12
---

# Phase 3 Plan 02: Shared Animation Primitives (Wave 2) Summary

**Three standalone, type-clean primitives — a composed `useAnimationGate` (reduced-motion + IntersectionObserver inView + tab-visibility -> one `shouldAnimate` boolean), a `useThemeColors` CSS-var->string bridge cached on `data-theme` MutationObserver, and `src/lib/motion.ts` shared presets keyed to the existing `cubic-bezier(0.16,1,0.3,1)` signature easing.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-12T02:28:51Z
- **Completed:** 2026-06-12T02:33:00Z
- **Tasks:** 3
- **Files modified:** 3 (3 created, 0 modified)

## Accomplishments
- `useAnimationGate` is now the single off-screen/tab-blur/reduced-motion composition — every animated component (3 existing canvases + every Phase-4/5 scene) consumes one boolean instead of N hand-rolled matchMedia/IO/visibility loops.
- `useThemeColors` bridges CSS custom properties to raw color strings for canvas/WebGL consumers, re-reading only on `data-theme` change (no per-frame `getComputedStyle`).
- `src/lib/motion.ts` ships the signature easing/durations and fade/stagger variants as the single source the Phase 5 ScrollReveal rewrite will consume.
- All three files type-check clean under `tsc --noEmit` (verified individually and combined).

## Exact Exported Hook Signatures (Phase 4/5 contract)

```ts
// src/hooks/useAnimationGate.ts  ('use client')
import { useReducedMotion } from "motion/react";
interface AnimationGateOptions { rootMargin?: string; threshold?: number; }
export function useAnimationGate<T extends Element>(
  ref: React.RefObject<T | null>,
  opts?: AnimationGateOptions          // defaults: rootMargin "200px", threshold 0
): { shouldAnimate: boolean; prefersReduced: boolean; inView: boolean; tabVisible: boolean };
// shouldAnimate = !prefersReduced && inView && tabVisible
// prefersReduced = useReducedMotion() ?? false  (always a concrete boolean)

// src/hooks/useThemeColors.ts  ('use client')
export function useThemeColors(varNames: string[]): Record<string, string>;
// reads getComputedStyle(documentElement) once on mount + on data-theme
// MutationObserver change; never per-frame. Returns {} before mount.
// Values are raw token strings (e.g. "#60a5fa") — canvas fillStyle-ready.

// src/lib/motion.ts  (no 'use client' — plain data export)
export const EASE_SIGNATURE: readonly [0.16, 1, 0.3, 1];
export const transitions: {
  readonly base: Transition;   // { duration: 0.7, ease: EASE_SIGNATURE }
  readonly quick: Transition;  // { duration: 0.4, ease: EASE_SIGNATURE }
};
export const fadeUp: Variants;                 // hidden {opacity:0,y:40} -> visible {opacity:1,y:0, transition: base}
export const stagger: (gap?: number) => Variants;  // default gap 0.1 -> { visible: { transition: { staggerChildren: gap } } }
```

## Task Commits

Each task was committed atomically (`--no-verify`, explicit per-file staging — parallel executor protocol):

1. **Task 1: Create useAnimationGate hook** - `d2fe2db` (feat)
2. **Task 2: Create useThemeColors theme-bridge hook** - `b5ee0d0` (feat)
3. **Task 3: Create motion preset module** - `ffc39ac` (feat)

## Files Created/Modified
- `src/hooks/useAnimationGate.ts` - composed reduced-motion + IO inView + tab-visibility gate returning the four-field object
- `src/hooks/useThemeColors.ts` - CSS-var -> string bridge cached via data-theme MutationObserver
- `src/lib/motion.ts` - EASE_SIGNATURE/transitions/fadeUp/stagger shared motion presets

## Decisions Made
- **`useReducedMotion` from `motion/react`** is the one reduced-motion source (research Don't-Hand-Roll) — no per-component matchMedia.
- **`useReducedMotion() ?? false`**: motion's hook can return `null` (SSR/initial); coercing to `false` keeps `shouldAnimate`/`prefersReduced` strictly boolean per the contract.
- **`useThemeColors` returns raw token strings** (work directly as canvas `fillStyle`); THREE.Color parsing is deferred to the Phase 4 consumer, keeping the bridge framework-agnostic.
- **`satisfies Transition`** on `transitions.base/quick` preserves the literal `EASE_SIGNATURE` tuple type while guaranteeing assignability to motion's `Transition`.

## Deviations from Plan

None - plan executed exactly as written. All three files were built to the `<interfaces>` contract verbatim, type-check clean, and were committed individually.

## Issues Encountered
None. `src/hooks/` and `src/lib/` directories did not exist and were created by the Write tool as the new files were authored. (Pre-existing CRLF line-ending warnings from git are cosmetic and expected on Windows.)

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - these are complete, type-clean primitives. They are intentionally NOT yet wired into the three existing canvases; that wiring is Plan 03-03 (per this plan's objective: "creates the primitives ONLY"). This is documented scope, not a stub.

## Next Phase Readiness
- Plan 03-03 can now wire `useAnimationGate` + `useThemeColors` into Hero3D / InteractiveGlobe / IdeaNetworkCanvas against the exact signatures above.
- Phase 4 (WebGL hero) and Phase 5 (ScrollReveal rewrite) have their shared gate, theme bridge, and motion presets ready to import from `@/hooks/*` and `@/lib/motion`.
- Runs in parallel with Plan 03-01 (globals.css/layout) — no file overlap; this plan touched only src/hooks/* and src/lib/motion.ts.

## Self-Check: PASSED

All 3 created files present on disk; all 3 task commits (d2fe2db, b5ee0d0, ffc39ac) found in git history.

---
*Phase: 03-shared-foundation*
*Completed: 2026-06-12*
