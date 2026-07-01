---
phase: quick-260701-nfu
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/space/layout.tsx
  - src/app/space/page.tsx
  - src/components/three/space/waypoints.ts
  - src/components/three/space/Starfield.tsx
  - src/components/three/space/SpaceExperience.tsx
  - src/components/three/space/CameraRig.tsx
  - src/components/three/space/Planet.tsx
  - src/components/three/space/SpaceHUD.tsx
autonomous: true
requirements: [PROTO-SPACE]
must_haves:
  truths:
    - "Navigating to /space renders a full-screen deep-black cosmos in a single WebGL context"
    - "Scrolling flies the camera FORWARD (-Z) through 5 glowing planet waypoints (About/Projects/Skills/Team/Contact)"
    - "Everything drifts/rotates gently (weightless) and reacts subtly to mouse movement"
    - "A fixed glassmorphic HUD shows the UJ logo, 5 section links, and a live scroll-progress indicator"
    - "Planet + star colors follow the active theme (dark AND light) via CSS accent tokens with no remount"
    - "/space is noindex,nofollow and does NOT touch the live homepage or any shared component"
    - "prefers-reduced-motion falls back to a static poster (no flythrough / no continuous motion)"
  artifacts:
    - path: "src/app/space/layout.tsx"
      provides: "Server layout emitting robots noindex/nofollow for the /space segment"
      contains: "index: false"
    - path: "src/app/space/page.tsx"
      provides: "Client route that dynamic-imports SpaceExperience (ssr:false) with a poster fallback + reduced-motion static branch"
    - path: "src/components/three/space/waypoints.ts"
      provides: "Shared section/waypoint + camera-path contract (SECTIONS, SCROLL_PAGES, camera z range)"
      contains: "SECTIONS"
    - path: "src/components/three/space/Starfield.tsx"
      provides: "Multi-layer parallax starfield (maath inSphere static buffers + additive PointMaterial)"
    - path: "src/components/three/space/SpaceExperience.tsx"
      provides: "Dedicated <Canvas> + ScrollControls + gate + mouse ref, composing all scene pieces"
    - path: "src/components/three/space/CameraRig.tsx"
      provides: "useScroll-driven forward camera flight + mouse parallax + scroll-progress CSS var"
    - path: "src/components/three/space/Planet.tsx"
      provides: "Glowing rim-lit placeholder planet mesh with Float drift + slow rotation"
    - path: "src/components/three/space/SpaceHUD.tsx"
      provides: "Fixed glassmorphic nav overlay (logo, links, progress bar) styled with CSS tokens/fonts"
  key_links:
    - from: "src/app/space/page.tsx"
      to: "src/components/three/space/SpaceExperience.tsx"
      via: "next/dynamic ssr:false with ScenePoster loading fallback"
      pattern: "dynamic\\(.*SpaceExperience.*ssr: false"
    - from: "src/components/three/space/CameraRig.tsx"
      to: "camera.position.z"
      via: "useScroll offset lerped across CAMERA_START_Z -> CAMERA_END_Z in useFrame"
      pattern: "useScroll"
    - from: "src/components/three/space/SpaceExperience.tsx"
      to: "src/components/three/space/SpaceHUD.tsx"
      via: "absolutely-positioned overlay sibling of the Canvas reading the scroll-progress CSS var"
      pattern: "SpaceHUD"
---

<objective>
Build a DESIGN-AGNOSTIC "outer space" scroll experience PROTOTYPE on a NEW `/space` route so we can FEEL the motion (a runnable flythrough) before matching a final Claude Design mockup.

Purpose: De-risk the space-scroll concept — verify the camera flight, parallax depth, weightless drift, and theme-token cosmos read well — WITHOUT touching the live homepage.
Output: A self-contained, noindex `/space` route with a dedicated single-GL-context scene reusing the repo's established R3F patterns (HeroParticles buffer, useThemeColors bridge, useAnimationGate gating, Hero3D mouse ref).

STRICTLY ADDITIVE: create NEW files only. DO NOT modify `src/app/page.tsx`, `Hero3D.tsx`, `SceneCanvas.tsx`, `ClientScene.tsx`, `HeroScene.tsx`, `HeroParticles.tsx`, or any other existing shared component. NO new dependencies (`@react-three/drei` v10 ships ScrollControls/useScroll/Scroll/Float; `maath` already installed).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@CLAUDE.md
@.planning/STATE.md

# Established patterns to REUSE (read, do not modify):
@src/components/three/HeroParticles.tsx
@src/components/three/HeroScene.tsx
@src/components/three/ScenePoster.tsx
@src/components/Hero3D.tsx
@src/app/scene-harness/page.tsx
@src/app/scene-harness/layout.tsx
@src/hooks/useThemeColors.ts
@src/hooks/useAnimationGate.ts

<interfaces>
<!-- Contracts the executor needs. Extracted from the codebase — use directly, no exploration. -->

Reduced-motion / off-screen / tab-blur gate (src/hooks/useAnimationGate.ts):
```typescript
function useAnimationGate<T extends Element>(
  ref: React.RefObject<T | null>,
  opts?: { rootMargin?: string; threshold?: number }
): { shouldAnimate: boolean; prefersReduced: boolean; inView: boolean; tabVisible: boolean };
```

CSS-var -> color bridge (src/hooks/useThemeColors.ts). Reads once on mount + on data-theme flip only; returns RAW token strings. Parse to THREE.Color at the consumer via useMemo keyed on the returned object, with a hardcoded hex pre-mount fallback:
```typescript
function useThemeColors(varNames: string[]): Record<string, string>;
// e.g. const t = useThemeColors(["--accent-blue","--accent-violet","--accent-emerald"]);
//      const c = useMemo(() => new THREE.Color(t["--accent-blue"] || "#60a5fa"), [t]);
```

Static particle buffer pattern (src/components/three/HeroParticles.tsx) — ONE draw call, buffer computed ONCE, motion via whole-field transform in useFrame (never per-particle writes):
```typescript
const positions = useMemo(
  () => inSphere(new Float32Array(count * 3), { radius: R }) as Float32Array, [count]
);
// <Points positions={positions} stride={3} frustumCulled>
//   <PointMaterial transparent size={S} sizeAttenuation depthWrite={false}
//     color={color} blending={THREE.AdditiveBlending} />
```

Normalized -1..1 mouse ref pattern (src/components/Hero3D.tsx) — window mousemove into a ref, no re-renders, read on the frame loop only:
```typescript
const mouse = useRef({ x: 0, y: 0 });
// mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
// mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
```

Noindex-for-a-client-page pattern (src/app/scene-harness/layout.tsx) — client pages CANNOT export metadata, so a sibling SERVER layout carries the robots directive:
```typescript
export const metadata: Metadata = { robots: { index: false, follow: false } };
```

Theme tokens available (from globals.css): --accent-blue (#60a5fa), --accent-violet (#a78bfa),
--accent-emerald (#34d399), --bg-primary (#0a0a0f dark), --bg-secondary, --bg-card,
--border-subtle, --text-primary/secondary/muted. Fonts: var(--font-space-grotesk) headings,
var(--font-geist-mono) labels. NOT Tailwind dark: variant — theme flows through these CSS vars.
</interfaces>
</context>

<constraints>
- ADDITIVE ONLY. New files exclusively. Zero edits to any existing file.
- NO new npm dependencies. drei v10.7.7 + fiber v9.6.1 + maath already installed (verified).
- Match existing style: 2-space indent, semicolons, PascalCase components, `@/` alias for src imports, RELATIVE imports for sibling `three/space/` files, `"use client"` on client files. Quote style: prefer double quotes (mirrors the three/ dir).
- Single GL context (one <Canvas> for the whole route), dpr clamped to [1,2], static particle buffers, pause off-screen/tab-blur via useAnimationGate, prefers-reduced-motion honored.
- Deep-black realistic-cosmos aesthetic. Colors ONLY from theme tokens (accent-blue/violet/emerald + bg tokens). No hardcoded brand hex except pre-mount fallbacks.
- Design-agnostic PROTOTYPE: placeholder planets + HUD are stand-ins to FEEL motion; do not polish visuals to a mockup.
</constraints>

<tasks>

<task type="auto">
  <name>Task 1: Route shell + noindex layout + dedicated Canvas + parallax Starfield</name>
  <files>src/components/three/space/waypoints.ts, src/components/three/space/Starfield.tsx, src/components/three/space/SpaceExperience.tsx, src/app/space/layout.tsx, src/app/space/page.tsx</files>
  <action>
Establish the route and get a scrollable starfield rendering in ONE GL context (interface-first: define the shared contract before consumers).

1. `src/components/three/space/waypoints.ts` (the CONTRACT — no "use client", pure module):
   - Export `interface SpaceSection { id: string; label: string; position: [number, number, number]; colorVar: "--accent-blue" | "--accent-violet" | "--accent-emerald"; }`.
   - Export `const SECTIONS: SpaceSection[]` with 5 entries laid out along -Z with alternating lateral offsets so the camera flies PAST each:
     About `[3, 0.5, -8]` --accent-blue, Projects `[-4, -0.5, -28]` --accent-violet, Skills `[4, 0.8, -48]` --accent-emerald, Team `[-3, -0.8, -68]` --accent-blue, Contact `[2, 0.3, -88]` --accent-violet.
   - Export `const SCROLL_PAGES = 5;`, `const CAMERA_START_Z = 8;`, `const CAMERA_END_Z = -95;`.

2. `src/components/three/space/Starfield.tsx` (`"use client"`) — REUSE the HeroParticles pattern exactly (import `{ inSphere } from "maath/random"`, `{ Points, PointMaterial } from "@react-three/drei"`, `useFrame`, `* as THREE`):
   - Props: `{ paused: boolean; color?: THREE.Color | string }`.
   - Render 2-3 parallax depth LAYERS as separate <Points>, each with its OWN static `useMemo(inSphere(new Float32Array(count*3), { radius })...)` buffer: near layer (count ~800, radius 18, size ~0.06), mid (count ~1500, radius 45, size ~0.09), far (count ~2500, radius 90, size ~0.14). Each additive PointMaterial, depthWrite={false}, sizeAttenuation.
   - Motion: rotate each layer's whole transform very slowly at DIFFERENT rates in ONE useFrame (parallax) — `if (paused) return;` guard first. ZERO per-particle writes.

3. `src/components/three/space/SpaceExperience.tsx` (`"use client"`) — the DEDICATED canvas host (do NOT touch shared SceneCanvas). This task ships it with Starfield only; Tasks 2-3 add the rig/planets/HUD:
   - Own the normalized `mouse = useRef({ x: 0, y: 0 })` + window mousemove listener (Hero3D pattern; cleanup on unmount).
   - `wrapRef = useRef<HTMLDivElement>(null)`; `const { shouldAnimate, prefersReduced } = useAnimationGate(wrapRef);` `const paused = !shouldAnimate || prefersReduced;`.
   - Render a full-size wrapper div (ref=wrapRef, `position: relative; width:100%; height:100%`). Inside it a dedicated `<Canvas dpr={[1,2]} gl={{ antialias: true, powerPreference: "high-performance" }} frameloop={shouldAnimate ? "always" : "never"} camera={{ position: [0,0,CAMERA_START_Z], fov: 60 }} style={{ background: "var(--bg-primary)" }}>`.
   - Inside Canvas: `<ScrollControls pages={SCROLL_PAGES} damping={0.25}>` wrapping a theme-color bridge that resolves `useThemeColors(["--accent-blue","--accent-violet","--accent-emerald"])` -> THREE.Color(s) via useMemo, `<ambientLight />`, a `<pointLight />`, and `<Starfield paused={paused} color={starColor} />`. (CameraRig + planets arrive in Task 2 — leave a clear insertion point.)

4. `src/app/space/layout.tsx` (SERVER file, NO "use client") — copy the scene-harness noindex pattern: `import type { Metadata } from "next";` + `export const metadata: Metadata = { robots: { index: false, follow: false } };` + default layout returning `children`.

5. `src/app/space/page.tsx` (`"use client"`):
   - `dynamic(() => import("@/components/three/space/SpaceExperience"), { ssr: false, loading: () => <ScenePoster variant="hero" /> })` (reuse existing `@/components/three/ScenePoster`).
   - Reduced-motion branch: read `useReducedMotion()` from "motion/react" behind a `mounted` guard; if reduced-motion, render a static full-screen `<ScenePoster variant="hero" />` INSTEAD of the live experience (no flythrough). Otherwise mount `<SpaceExperience />`.
   - Full-screen shell: a `<main>` with `position: fixed; inset: 0` (or `w-screen h-screen`), `background: var(--bg-primary)`, overflow hidden, so the experience is edge-to-edge.

Note: ScrollControls injects its own absolutely-positioned scroll container over the canvas — that is expected; the HUD (Task 3) layers above it.
  </action>
  <verify>
    <automated>cd "C:/Users/Usama.Javed/Desktop/modern-portfolio" && npx tsc --noEmit 2>&1 | grep -E "space/|app/space" || echo "TSC_CLEAN_IN_SPACE_FILES"</automated>
  </verify>
  <done>All 5 files exist; `npx tsc --noEmit` reports ZERO errors in any `space/` file; `/space` route compiles; SpaceExperience mounts one <Canvas> with ScrollControls + a 2-3 layer Starfield; layout emits robots noindex; page has the ssr:false dynamic import + reduced-motion static branch.</done>
</task>

<task type="auto">
  <name>Task 2: Forward camera flight (useScroll) + glowing planet waypoints</name>
  <files>src/components/three/space/CameraRig.tsx, src/components/three/space/Planet.tsx, src/components/three/space/SpaceExperience.tsx</files>
  <action>
Make the scroll DRIVE a forward flythrough past 5 glowing planets.

1. `src/components/three/space/CameraRig.tsx` (`"use client"`) — MUST render inside <ScrollControls>:
   - Props: `{ mouse: React.RefObject<{ x: number; y: number }>; paused: boolean }`.
   - `const scroll = useScroll();` (from "@react-three/drei").
   - In `useFrame((state, delta) => { ... })`:
     - Compute `const z = CAMERA_START_Z + (CAMERA_END_Z - CAMERA_START_Z) * scroll.offset;` and drive the camera forward: `state.camera.position.z = z;` (scroll-driven, so it updates even mid-scroll).
     - Subtle mouse parallax on camera x/y using `maath/easing` damp toward `mouse.current.x * 1.2` / `mouse.current.y * 0.8` (frame-rate-independent; read the ref, no DOM reads). Skip the damp when `paused` but STILL set camera.z from scroll so a paused/blurred frame stays coherent.
     - Write scroll progress to a CSS var for the HUD: `document.documentElement.style.setProperty("--space-scroll", String(scroll.offset));` (cheap, no React re-render). Guard `typeof document`.
   - Return null (logic-only component).

2. `src/components/three/space/Planet.tsx` (`"use client"`):
   - Props: `{ section: SpaceSection; color: THREE.Color | string; paused: boolean }`.
   - Wrap in drei `<Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.8} enabled={!paused}>` positioned at `section.position` for weightless drift.
   - A `<mesh>` (ref) with `<sphereGeometry args={[2.2, 48, 48]} />` and a rim-lit glowing look: `<meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.4} metalness={0.1} />`. Add a larger faint additive halo shell: a second `<mesh>` with `sphereGeometry args={[2.7,32,32]}` + `<meshBasicMaterial color={color} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />`.
   - Slow self-rotation in useFrame (`if (paused) return; mesh.rotation.y += delta * 0.2;`).

3. Edit `src/components/three/space/SpaceExperience.tsx` — at the Task-1 insertion point inside <ScrollControls>: add `<CameraRig mouse={mouse} paused={paused} />` and map `SECTIONS.map((s) => <Planet key={s.id} section={s} color={colorFor(s.colorVar)} paused={paused} />)`, where `colorFor` resolves each section's `colorVar` from the already-memoized theme colors (add the emerald token if not present). Keep the existing lights/starfield.
  </action>
  <verify>
    <automated>cd "C:/Users/Usama.Javed/Desktop/modern-portfolio" && npx tsc --noEmit 2>&1 | grep -E "space/|app/space" || echo "TSC_CLEAN_IN_SPACE_FILES"</automated>
  </verify>
  <done>CameraRig + Planet exist and are wired into SpaceExperience; `npx tsc --noEmit` reports ZERO errors in `space/` files; scrolling drives `camera.position.z` from CAMERA_START_Z toward CAMERA_END_Z via useScroll; 5 theme-colored glowing planets sit at the waypoints with Float drift + slow rotation; camera parallax reads the mouse ref; scroll progress is written to `--space-scroll`.</done>
</task>

<task type="auto">
  <name>Task 3: Glassmorphic HUD overlay + verification gates</name>
  <files>src/components/three/space/SpaceHUD.tsx, src/components/three/space/SpaceExperience.tsx</files>
  <action>
Add the fixed navigation HUD and run the full verification gate.

1. `src/components/three/space/SpaceHUD.tsx` (`"use client"`) — a PLAIN absolutely-positioned React overlay (NOT inside the Canvas), so it uses real DOM + CSS tokens/fonts:
   - Container: `position: absolute; inset: 0; z-index: 10; pointer-events: none;` (children that need interaction set `pointer-events: auto`).
   - Top bar (glassmorphic): `background: var(--bg-card); border-bottom: 1px solid var(--border-subtle); backdrop-filter: blur(12px);`.
     - Left: logo "UJ" in `font-[family-name:var(--font-space-grotesk)]`, bold, `color: var(--text-primary)`.
     - Right: the 5 section labels from `SECTIONS` (import the contract) as links, `font-[family-name:var(--font-geist-mono)]`, `color: var(--text-muted)`, uppercase, letter-spacing. `pointer-events: auto`. For the prototype these can be visual/anchor stubs (no scroll wiring required); optional active styling.
   - Scroll-progress indicator: a thin fixed bar (e.g. top or bottom, height 2px) whose fill scales with scroll — drive it purely from the CSS var with NO React re-render: `transform: scaleX(var(--space-scroll, 0)); transform-origin: left;` `background: linear-gradient(90deg, var(--accent-blue), var(--accent-violet));`.
   - All colors/fonts from tokens ONLY; deep-black cosmos aesthetic; keep it minimal (design-agnostic stand-in).

2. Edit `src/components/three/space/SpaceExperience.tsx` — render `<SpaceHUD />` as a sibling of the <Canvas>, INSIDE the wrapRef div, AFTER the Canvas so it layers on top. (HUD lives outside the R3F tree and reads `--space-scroll` set by CameraRig.)

3. Run the full verification gate (repo ignores TS/lint in build, so tsc is the real gate):
   - `npx tsc --noEmit` (must be clean for all space files).
   - `npm run lint` (no NEW problems in space files).
   - `npm run build` (must exit 0; /space route present in output).
   - Record a manual smoke NOTE (browser step, not automatable here): navigate to `/space`, scroll top->bottom, confirm the camera flies forward through the 5 planets, starfield parallax depth reads, HUD progress bar fills, and it looks correct in BOTH dark and light themes (toggle `data-theme` on <html>).
  </action>
  <verify>
    <automated>cd "C:/Users/Usama.Javed/Desktop/modern-portfolio" && npx tsc --noEmit 2>&1 | grep -E "space/|app/space" || echo "TSC_CLEAN_IN_SPACE_FILES"</automated>
    <automated>cd "C:/Users/Usama.Javed/Desktop/modern-portfolio" && npx eslint src/components/three/space src/app/space 2>&1 | tail -20</automated>
    <automated>cd "C:/Users/Usama.Javed/Desktop/modern-portfolio" && npm run build 2>&1 | tail -25</automated>
  </verify>
  <done>SpaceHUD renders as a fixed glassmorphic overlay above the Canvas (UJ logo, 5 section links, token-styled); progress bar scales from `--space-scroll` with no React re-render; `npx tsc --noEmit` clean in space files; `npm run lint` adds no new problems; `npm run build` exits 0 with `/space` present; manual smoke note recorded (flythrough + parallax + HUD verified in BOTH themes).</done>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` — ZERO errors in any `src/components/three/space/*` or `src/app/space/*` file (the real gate; build ignores TS errors).
- `npx eslint src/components/three/space src/app/space` — no new lint problems.
- `npm run build` — exits 0; `/space` route appears in the route table.
- Additive check: file listing shows ONLY new files under `src/app/space/` and `src/components/three/space/`; no existing file modified.
- Manual smoke (browser): `/space` flies the camera forward through 5 planets on scroll, starfield shows parallax depth, HUD progress fills, correct in dark AND light; `/space` served HTML carries `<meta name="robots" content="noindex, nofollow">`.
</verification>

<success_criteria>
- New `/space` route renders a full-screen deep-black cosmos in a SINGLE WebGL context, noindex/nofollow.
- Scroll drives a forward (-Z) camera flight past 5 theme-colored glowing planet waypoints (About/Projects/Skills/Team/Contact).
- Multi-layer parallax starfield + weightless Float drift/rotation + subtle mouse parallax convey the "outer space" feel.
- Fixed glassmorphic HUD (UJ logo, section links, live scroll-progress bar) styled entirely from CSS tokens/fonts.
- Reuses useThemeColors + useAnimationGate + HeroParticles buffer pattern + Hero3D mouse ref; respects prefers-reduced-motion (static fallback).
- ZERO edits to the live homepage or any shared component; no new dependencies; tsc + lint + build all green.
</success_criteria>

<output>
After completion, create `.planning/quick/260701-nfu-space-scroll-experience-prototype-on-new/260701-nfu-SUMMARY.md`.
</output>
