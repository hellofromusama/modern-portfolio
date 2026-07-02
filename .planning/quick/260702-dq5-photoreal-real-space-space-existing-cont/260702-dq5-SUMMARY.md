---
task: 260702-dq5
title: Photoreal "real space" /space — Team section slice
branch: feature/space-scroll-prototype
date: 2026-07-02
status: complete
tasks_completed: 3
requirements: [QUICK-260702-dq5]
key-files:
  created:
    - public/space/2k_stars_milky_way.jpg
    - public/space/2k_earth_daymap.jpg
    - public/space/2k_jupiter.jpg
    - public/space/2k_mars.jpg
    - public/space/2k_neptune.jpg
    - public/space/2k_moon.jpg
    - public/space/CREDITS.md
    - src/components/three/space/SpaceBackground.tsx
    - src/components/three/space/space-dom.css
  modified:
    - src/components/three/space/waypoints.ts
    - src/components/three/space/Planet.tsx
    - src/components/three/space/SpaceExperience.tsx
commits:
  - 47f4fd5  chore(space): add self-hosted Solar System Scope textures + CREDITS
  - 382077f  feat(space): real NASA-style skybox + planet photo-textures
  - 6ef706e  feat(space): float verbatim TeamSection as DOM over the fixed cosmos
---

# Quick Task 260702-dq5: Photoreal "Real Space" /space — Team Section Slice — Summary

Evolved the working `/space` prototype into a photoreal experience proven with one real content slice: a real equirectangular Milky Way skybox + real planet photo-textures, with the site's verbatim `<TeamSection/>` scrolling as DOM over the fixed 3D cosmos. Additive-only; zero new npm deps; no edits to TeamSection.tsx or globals.css.

## What Was Done

### Task 1 — Self-hosted real textures (commit 47f4fd5)
Downloaded 6 real 2K JPGs from Solar System Scope into `public/space/` via curl (self-hosted, not hotlinked) and verified each is a genuine 2048×1024 baseline JPEG (via `file`), not an HTML error page.

| File | Size | Verified |
|------|------|----------|
| 2k_stars_milky_way.jpg | 251,454 B | JPEG 2048×1024 |
| 2k_earth_daymap.jpg | 463,087 B | JPEG 2048×1024 |
| 2k_jupiter.jpg | 498,976 B | JPEG 2048×1024 |
| 2k_mars.jpg | 750,547 B | JPEG 2048×1024 |
| 2k_neptune.jpg | 241,580 B | JPEG 2048×1024 |
| 2k_moon.jpg | 1,053,869 B | JPEG 2048×1024 |

Wrote `public/space/CREDITS.md` with the required CC-BY-4.0 attribution line.

### Task 2 — Real skybox + planet photo-textures (commit 382077f)
- **Created `SpaceBackground.tsx`**: sets `scene.background` + `scene.environment` to the equirect Milky Way texture with `EquirectangularReflectionMapping` + `SRGBColorSpace`; nulls both on cleanup. Replaces `Starfield.tsx` as the sky (Starfield kept on disk, no longer imported — additive mandate).
- **`waypoints.ts`**: added `texture: string` to `SpaceSection` and mapped each section to a body (about→earth, projects→jupiter, skills→mars, team→neptune, contact→moon). Positions/colorVar/scroll constants unchanged.
- **`Planet.tsx`**: body now wears a real `useTexture(section.texture)` diffuse map with `map.colorSpace = THREE.SRGBColorSpace`; removed the accent `color`/`emissive` tint from the body and set `emissiveIntensity={0}` so the photo shows. Kept `roughness`/`metalness`, the `<Float>` drift, the gated self-rotation, and the faint additive halo shell still driven by the `color` prop.
- **`SpaceExperience.tsx`**: swapped `Starfield` import for `SpaceBackground`; imported `Suspense`; wrapped the texture-consuming nodes (`<SpaceBackground/>` + `SECTIONS.map(<Planet/>)`) in `<Suspense fallback={null}>`; lights + `CameraRig` left outside Suspense. Still passes `color={colorFor(...)}` to each Planet for the halo.

### Task 3 — Float verbatim TeamSection over the cosmos (commit 6ef706e)
- **Created `space-dom.css`**: scoped `.space-dom-content > section { background: transparent !important; }` — beats TeamSection's inline opaque `var(--bg-secondary)` bg without editing the component. Inner cards/name-rows/gradient left intact for readability.
- **`SpaceExperience.tsx`**: imported `TeamSection` verbatim + the CSS; added `zIndex:0` + `pointerEvents:"none"` to the fixed canvas wrapper (links stay clickable); replaced the tall transparent spacer with a `.space-dom-content` (zIndex:1) scroll layer = 80vh intro spacer + `<TeamSection/>` + `(SCROLL_PAGES-1)*100vh` outro spacer, which drives the native scroll length. `<SpaceHUD/>` kept as the last child; page.tsx reduced-motion branch untouched.

## Verification

| Gate | Result |
|------|--------|
| `npx tsc --noEmit` | exit 0 (clean) |
| `npx eslint src/components/three/space src/app/space` | exit 0 (clean) |
| `npm run build` | exit 0 — `/space` present (1.89 kB / 105 kB First Load) |
| Additive check | `git status` shows Starfield.tsx / TeamSection.tsx / globals.css UNCHANGED |
| Asset check | 6 JPGs >100 KB (real images) + CREDITS.md in public/space/ |

## Deviations from Plan

None — plan executed exactly as written. (Note: a pre-existing untracked file `--space-scroll` at repo root exists from a prior session; out of scope, left untouched.)

## Known Stubs

None. All planets are wired to real self-hosted textures; the skybox loads a real self-hosted equirect JPG; TeamSection is the real component with real photos/data.

## Manual Smoke (NOT automatable — for the human)

Open `/space` in BOTH themes and confirm:
1. A real starry Milky Way sky (photographic, not procedural dots).
2. Real-textured planets (Earth/Jupiter/Mars/Neptune/Moon) drifting/rotating.
3. The real Team photos/names scrolling as DOM over the cosmos, with the sky visible behind the (neutralized) section background.
4. Camera parallax still flies on scroll; fixed glass HUD present.
5. Team social links clickable (canvas does not eat pointer events).
6. `prefers-reduced-motion` still shows the static poster fallback.

## Self-Check: PASSED
