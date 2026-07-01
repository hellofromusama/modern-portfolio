---
phase: quick-260701-nfu
plan: 01
subsystem: space-scroll-prototype
tags: [r3f, webgl, scroll, prototype, noindex]
requires:
  - "@react-three/fiber v9 + @react-three/drei v10 (ScrollControls/useScroll/Float/Points)"
  - "maath (random.inSphere, easing.damp)"
  - "src/hooks/useAnimationGate.ts, src/hooks/useThemeColors.ts (imported, unmodified)"
  - "src/components/three/ScenePoster.tsx (imported, unmodified)"
provides:
  - "/space noindex prototype route with a dedicated single-GL-context flythrough"
  - "Reusable space scene contract (SECTIONS + camera z-range) in waypoints.ts"
affects:
  - "NONE — strictly additive; zero edits to any existing shared file"
tech-stack:
  added: []
  patterns:
    - "HeroParticles static-buffer starfield (per-layer inSphere, whole-transform motion)"
    - "useThemeColors -> THREE.Color memo bridge (theme-reactive, no remount)"
    - "useScroll-driven camera z-lerp; scroll progress mirrored to a CSS var for a DOM HUD"
key-files:
  created:
    - "src/app/space/layout.tsx"
    - "src/app/space/page.tsx"
    - "src/components/three/space/waypoints.ts"
    - "src/components/three/space/Starfield.tsx"
    - "src/components/three/space/SpaceExperience.tsx"
    - "src/components/three/space/CameraRig.tsx"
    - "src/components/three/space/Planet.tsx"
    - "src/components/three/space/SpaceHUD.tsx"
  modified: []
decisions:
  - "Starfield uses a ref-array of 3 <Points> layers (one useFrame, per-layer parallax rate) — mirrors HeroParticles, zero per-particle writes"
  - "colorFor resolver maps each section's accent token to its memoized THREE.Color so all 5 planets + starfield follow data-theme with no remount"
  - "Reduced-motion handled at TWO levels: page.tsx renders a static ScenePoster instead of the live experience, and the gate pauses the frameloop if it ever mounts"
metrics:
  duration: ~12 min
  completed: 2026-07-01
---

# Quick Task 260701-nfu: Space Scroll Experience Prototype Summary

Design-agnostic outer-space scroll PROTOTYPE on a new noindex `/space` route: a single-GL-context flythrough where scrolling flies the camera forward past 5 theme-colored glowing planets over a 3-layer parallax starfield, with a glassmorphic DOM HUD — reusing the repo's established R3F patterns and touching zero existing files.

## What Was Built

- **Route shell** (`src/app/space/`): server `layout.tsx` emits `robots: { index: false, follow: false }`; client `page.tsx` dynamic-imports `SpaceExperience` (`ssr: false`) with a `ScenePoster` loading fallback and a mounted-guarded `useReducedMotion()` branch that renders a static poster instead of the live flythrough.
- **Contract** (`waypoints.ts`, pure module): `SpaceSection` interface, 5 `SECTIONS` laid along -Z with alternating lateral offsets, `SCROLL_PAGES=5`, `CAMERA_START_Z=8`, `CAMERA_END_Z=-95`.
- **Starfield.tsx**: 3 parallax depth layers, each a static `inSphere` buffer (`HeroParticles` pattern), additive `PointMaterial`, animated by whole-layer rotation at different rates in one `useFrame` guarded by `paused`.
- **SpaceExperience.tsx**: the dedicated `<Canvas>` (dpr `[1,2]`, `frameloop` bound to `useAnimationGate`), a normalized mouse ref (Hero3D pattern), `useThemeColors` -> THREE.Color bridge, `ScrollControls` wrapping the rig/planets/starfield.
- **CameraRig.tsx**: `useScroll` lerps `camera.position.z` from start->end (always, even paused), `maath/easing.damp` mouse parallax on x/y, and mirrors `scroll.offset` to the `--space-scroll` CSS var.
- **Planet.tsx**: rim-lit emissive sphere + faint additive halo shell inside a drei `<Float>`, slow self-rotation gated by `paused`.
- **SpaceHUD.tsx**: fixed glassmorphic DOM overlay (UJ logo, 5 mono uppercase links, `scaleX(var(--space-scroll))` progress bar) — all colors/fonts from tokens, `pointer-events` isolated.

## Verification Gate Results

- **`npx tsc --noEmit`** (filtered to space files): `NO_TSC_ERRORS_IN_SPACE_FILES` — clean.
- **`npx eslint src/components/three/space src/app/space`**: no problems reported.
- **`npm run build`**: exit `0`. `/space` present as a static route (`○ /space  1.87 kB  104 kB First Load`) — three is confined behind the `ssr:false` dynamic import (not eager on the route). Pre-existing non-blocking `colorScheme` metadata-export warning on `/` is unrelated/out-of-scope (already tracked in deferred-items.md).

## Manual Smoke-Test Note (browser-only, not automatable headlessly)

Navigate to `/space`, scroll top->bottom and confirm: the camera flies FORWARD through the 5 glowing planets (About/Projects/Skills/Team/Contact), the 3 starfield layers show parallax depth, everything drifts/rotates weightlessly and reacts subtly to mouse movement, the HUD progress bar fills with scroll, and colors read correctly in BOTH dark and light themes (toggle `data-theme` on `<html>`). Also verify `prefers-reduced-motion` shows the static poster (no flythrough).

## Deviations from Plan

None — plan executed exactly as written. No auto-fixes (Rules 1-3) were required; all space files were type/lint-clean on first compile.

## Known Stubs

- **HUD nav links** (`SpaceHUD.tsx`): `#about`/`#projects`/... anchor stubs with no scroll-to wiring. INTENTIONAL per the plan ("visual/anchor stubs, no scroll wiring required") — this is a design-agnostic motion prototype, not the final navigation. Resolving to real scroll targets is deferred to the eventual design-matched implementation.
- **Placeholder planets** (`Planet.tsx`): sphere + halo stand-ins to FEEL the motion, intentionally un-polished per the prototype mandate.

## Commits

- `69c7691` feat(space): route shell + noindex layout + dedicated Canvas + parallax starfield (Task 1)
- `47ac10b` feat(space): scroll-driven forward camera flight + glowing planet waypoints (Task 2)
- `5d646e5` feat(space): glassmorphic HUD overlay (logo, links, scroll-progress bar) (Task 3)

## Self-Check: PASSED

All 8 created files exist on disk; all 3 task commits (69c7691, 47ac10b, 5d646e5) exist in git history.
