---
task: 260702-gkj
title: Implement the finalized Claude Design "Space-Journey Portfolio" on /space
branch: feature/space-scroll-prototype
date: 2026-07-02
tasks_completed: 6
requirements: [SPACE-DESIGN]
key-files:
  created:
    - src/components/three/space/spaceSpec.ts
    - src/components/three/space/spaceFonts.ts
    - src/components/three/space/SpaceContent.tsx
    - src/components/three/space/SpaceLighting.tsx
    - src/components/three/space/SpaceLoader.tsx
    - public/space/2k_saturn.jpg
    - public/space/2k_saturn_ring_alpha.png
    - public/space/2k_venus_surface.jpg
    - public/space/2k_mercury.jpg
    - .planning/quick/260702-gkj-implement-claude-design-space-journey-on/space-motion-smoke.mjs
  modified:
    - src/components/three/space/CameraRig.tsx
    - src/components/three/space/SpaceBackground.tsx
    - src/components/three/space/Planet.tsx
    - src/components/three/space/Starfield.tsx
    - src/components/three/space/SpaceHUD.tsx
    - src/components/three/space/SpaceExperience.tsx
    - src/components/three/space/space-dom.css
    - src/components/three/space/waypoints.ts
    - src/app/space/page.tsx
    - public/space/CREDITS.md
    - .gitignore
commits:
  - f20d591 feat: foundation — textures, fonts, spaceSpec
  - 8f41cc3 feat: camera dive + sky + planets + click-to-fly
  - 60a9e0b feat: twinkle stars + lighting rig + fog
  - 052b19b feat: 6 sections via <Html transform>, content verbatim
  - 85ecf54 feat: HUD + loader + reduced-motion page fix + assembly
  - d8a73a3 test: author re-runnable Playwright motion-smoke
---

# Quick Task 260702-gkj: Space-Journey Portfolio on /space — Summary

Evolved the `/space` prototype into the full finalized Claude Design "Space-Journey
Portfolio": a scroll-driven WebGL camera dive through real photo-textured planets,
with all 6 portfolio sections of REAL existing content floating in 3D via drei
`<Html transform>`, click-a-planet-to-fly, a glass HUD, ambient drone, both themes,
and reduced-motion awareness. Built entirely on the existing single-Canvas host;
the live homepage and shared content/components were reused by import only.

## Tasks & what was built

**Task 1 — Foundation** (`f20d591`)
- Downloaded 4 missing self-hosted textures into `public/space/` from Solar System
  Scope (CC BY 4.0, same source as existing files): `2k_saturn.jpg` (200 KB),
  `2k_saturn_ring_alpha.png` (12 KB), `2k_venus_surface.jpg` (885 KB),
  `2k_mercury.jpg` (873 KB). All verified as valid images (JPEG `ffd8ff` / PNG
  `89504e47`), all > 5 KB. `CREDITS.md` updated with the 4 new files + fallback source.
- `spaceSpec.ts` — single source of truth: `PLANETS` (6 bodies, exact README
  coords/tints/radii), `SECTION_ANCHORS` (6 anchors, `position = [wx, 1, wz]`,
  `wz = (30 + anchor*-262) - 34`), `ASTEROIDS`, `CAMERA_START_Z=30`,
  `CAMERA_END_Z=-232`, `SCROLL_VH=640`, `FOV=60`, `ACCENT_CYCLE`.
- `spaceFonts.ts` — additive `next/font/google` Inter (`--font-inter`) + JetBrains
  Mono (`--font-jetbrains-mono`), exported as `spaceFontVars` (layout.tsx untouched).
- `waypoints.ts` → `export * from "./spaceSpec"` (stable path).
- `.gitignore` ignores `claude design/` (verified via `git check-ignore`).

**Task 2 — Camera dive + sky + planets + click-to-fly** (`8f41cc3`)
- `CameraRig.tsx` — exact eased dive: `t += (target - t) * (reduced ? 0.5 : 0.07)`,
  `camZ = 30 + t*(-262)` (30 → -232), sway `sin(t·2π)·1.6 + mouseX·3.2`,
  `camY = 1 + sin(time·0.3)·0.4 + mouseY·2.2`, `lookAt(mouseX·2.4, 1+mouseY·1.8, camZ-60)`;
  `position.set` directly (the t-lerp IS the ease, no extra damp); moves the tracking
  light; publishes `--space-scroll`.
- `SpaceBackground.tsx` — BackSide r900 Milky Way sky sphere, SRGB, `fog:false`, slow rotation.
- `Planet.tsx` — photo body `sphereGeometry(r,64,48)` + `meshStandardMaterial({map,
  roughness:0.92, metalness:0.02})` SRGB; atmosphere shell (`r·1.04`, BackSide additive,
  opacity 0.16) + soft radial glow sprite (scale `r·3.0`, opacity 0.26); Saturn ring
  `ringGeometry(r·1.35, r·2.35, 110)` with radial UV remap, DoubleSide opacity 0.92,
  `rotation.x=π/2`; seeded axial tilt/spin/bob; `onClick` → `window.scrollTo(anchor·max,
  smooth)`, pointer cursor on hover. `Asteroids` = 8 seeded rock bodies (r 1.0–2.8,
  x ±15, y ±10, z −104..−150) cycling Mercury/Moon/Mars, sharing anchor 0.6.
- `SpaceExperience.tsx` — threads `reduced=prefersReduced`; frameloop = `(inView &&
  tabVisible) ? "always" : "never"` (decoupled from reduced-motion so scroll still
  drives the dive); camera `{position:[0,0,30], fov:60, near:0.1, far:3000}`; 640vh
  transparent scroll driver; `spaceFontVars` on the wrapper.

**Task 3 — Foreground stars + lighting + fog** (`60a9e0b`)
- `Starfield.tsx` — two THREE.Points layers (mid 900 / near 360) with per-point
  star-temperature colors, a shared 64px soft additive sprite, opacity twinkle +
  mouse-parallax rotation; all autonomous motion paused when reduced.
- `SpaceLighting.tsx` — ambient `0x556680`@0.7, directional `0xfff4e6`@2.1 at
  (30,18,42), `scene.fog = FogExp2(0x05060a, 0.0052)` (cleaned up on unmount). The
  camera-tracking `pointLight(0x88aaff, 0.35, 200, 1.8)` stays host-owned (moved by CameraRig).

**Task 4 — 6 floating sections, content verbatim** (`052b19b`)
- `SpaceContent.tsx` — 6 `<Html transform occlude={false}>` anchored at each section's
  world position, `distanceFactor={10}`, `pointerEvents="auto"`, each with an explicit
  inline width (Hero/About/Contact 640px, Skills/Projects/Team 1100px). Skills maps all
  8 groups from `skills.ts` (item strings VERBATIM); Projects maps the 7 ids
  (`kashmir-fund … mcp-netsuite-ollama-bridge`) via `getProject`, using
  `gridTitle/gridDescription/gridCategory` VERBATIM; Team mounts `<TeamSection/>`
  unedited; Hero/About/Contact use the exact README copy. Accent cycles
  `[#60a5fa, #a78bfa, #34d399, #fbbf24]`.
- `space-dom.css` — glass panels/cards/chips (tokens: rgba(18,22,36,.38), blur(18px)
  saturate(1.25), border rgba(255,255,255,.13)), project `:hover` lift −14px / scale
  1.04 / accent glow via `--card-accent`, and the Team sticky fix
  (`.space-team [class*="sticky"] { position: relative !important; top: auto !important }`)
  + section-bg transparentize — no `TeamSection.tsx` edit.

**Task 5 — HUD + loader + reduced-motion fix + assembly** (`85ecf54`)
- `SpaceHUD.tsx` — UJ gradient monogram (#60a5fa→#a78bfa) + "Usama Javed / CREATIVE
  DEV"; glass nav (About·Skills·Projects·Team·Contact) smooth-scrolling to anchors with
  active state; theme toggle swapping `--hud-accent` #60a5fa↔#fbbf24 (☾/☀); sound toggle
  (three sine oscillators 55/82.4/110 Hz → gain ramp to 0.045 over 1.2s, off by default,
  ♪/♫); right-edge FLIGHT gauge (`height = t·100%`) + padded percent; bottom progress bar.
  Gauge/percent/active-nav driven by a rAF reading `--space-scroll` (no React re-render).
- `SpaceLoader.tsx` — 0→100 counter (45ms, `v += rand·7+3`) with "CALIBRATING FLIGHT
  PATH", fade-out at 100 then unmount after 800ms; reduced-motion completes faster.
- `src/app/space/page.tsx` — ALWAYS renders `<SpaceExperience/>` (no static-poster
  fallback); reduced-motion is handled inside via the threaded `reduced` flag. Keeps
  `dynamic ssr:false` + `ScenePoster` chunk-load fallback + the noindex layout.

**Task 6 — Motion-smoke script** (`d8a73a3`)
- `space-motion-smoke.mjs` authored + `node --check` passed. ESM Playwright script
  using the session-scratchpad harness (repo `package.json` UNCHANGED — no Playwright
  dep). Encodes `bringToFront`, scroll → `--space-scroll` rises ~0→~1, real content
  (Usama Javed + MCP NetSuite-Ollama Bridge + AI Protocols & Agents + team name),
  click/nav-to-fly changes `--space-scroll`, theme-toggle `--hud-accent` swap; saves 3
  scroll screenshots + 1 post-theme; prints `SMOKE PASS`/`SMOKE FAIL`. The ORCHESTRATOR
  runs the full browser smoke against a running server.

## Executor HARD gates (all pass)
- `npx tsc --noEmit`: CLEAN across `src/components/three/space/**` and `src/app/space/**`
  (0 new errors; pre-existing api/expertise baseline unchanged).
- `npx eslint src/components/three/space src/app/space`: CLEAN (0 problems).
- `npm run build`: exit 0; `/space` route compiles (○ /space, 1.61 kB).

## Texture provenance / attribution
Solar System Scope (solarsystemscope.com), CC BY 4.0 — same source as the existing
skybox/planet maps. Self-hosted in `public/space/`, never hotlinked in production code.
`CREDITS.md` updated. Milky Way sky reuses the existing `2k_stars_milky_way.jpg`.

## Additive-only proof (git-verified)
`git diff --name-only f20d591^..d8a73a3` touches ONLY: `.gitignore`, the 4 textures +
`CREDITS.md`, the `src/components/three/space/**` files, `src/app/space/page.tsx`, and
the smoke script. `src/app/page.tsx`, `src/components/TeamSection.tsx`,
`src/content/projects.ts`, `src/content/skills.ts`, and `src/app/layout.tsx` are
UNCHANGED. Nothing under `claude design/` was edited/moved/run/imported.

## Deviations from Plan
- **[Rule 2 — design correctness] Skill-card side-tab removed.** The plan/README
  described a per-card accent border; the impeccable design hook flagged the 2px
  left side-tab as an AI tell. Resolved by dropping the side-tab and carrying the
  accent through the cycling label color (kept the neutral glass border). Wrapper-only
  change; no content text affected. (`052b19b`, `space-dom.css`.)
- Otherwise executed as written.

## Known Stubs
None. All 6 sections are wired to real content sources (skills.ts / projects.ts /
TeamSection / README copy); no placeholder/empty panels.

## Motion-smoke run command (for the orchestrator)
```
# 1) start a server (from the repo)
npm run build && npm run start        # or: npm run dev
# 2) run the smoke from the scratchpad Playwright harness dir
cd "C:/Users/USAMA~1.JAV/AppData/Local/Temp/claude/C--Users-Usama-Javed/f6c04630-64d7-4165-91c9-bbf7953edde1/scratchpad/pw-record"
node "C:/Users/Usama.Javed/Desktop/modern-portfolio/.planning/quick/260702-gkj-implement-claude-design-space-journey-on/space-motion-smoke.mjs"
```
Screenshots land in the quick task dir: `space-smoke-1-top.png`, `-2-mid.png`,
`-3-bottom.png`, `-4-theme.png`. Expect a final `SMOKE PASS` line.

## Self-Check: PASSED
All 11 asserted created files exist on disk; all 6 task commits exist in git
(f20d591, 8f41cc3, 60a9e0b, 052b19b, 85ecf54, d8a73a3).
