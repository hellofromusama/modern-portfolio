# 05-00 SPIKE — Hero De-Risk (signatures + deps + perf + bundle gate)

Wave 1 de-risk artifact. Records the ACTUAL Phase-3/4 primitive signatures (read from
source, not the research sketches), the installed Phase-5 dependency versions, the
throttled perf-spike decisions (hero particle count + bloom on/off), and Lighthouse CLI
availability. **05-01 consumes the numbers and the scene-injection finding below.**

---

## Prereq HARD-Guard — PASSED

All 10 Phase-3/4 primitives Phase 5 consumes are present on disk (existence guard exited 0):

| File | Phase | Present |
|------|-------|---------|
| `src/hooks/useAnimationGate.ts` | 03-02 | yes |
| `src/hooks/useThemeColors.ts` | 03-02 | yes |
| `src/lib/motion.ts` | 03-02 | yes |
| `src/components/IslandBoundary.tsx` | 03 | yes |
| `src/components/three/SceneCanvas.tsx` | 04-02 | yes |
| `src/components/three/ClientScene.tsx` | 04-02 | yes |
| `src/components/three/ScenePoster.tsx` | 04-02 | yes |
| `src/components/three/ThemedScene.tsx` | 04-02 | yes |
| `src/lib/webgl.ts` | 04-02 | yes |
| `scripts/bundle-gate.mjs` | 04-01/03 | yes |

> **Note (file-name correction):** the plan and the Task-1 verify command reference
> `scripts/check-bundle.mjs`. That file does NOT exist. Phase 4 created and armed
> **`scripts/bundle-gate.mjs`** (confirmed in 04-01/04-03 summaries). The guard, the
> bundle-gate update (Task 3), and all references below use the REAL file
> `scripts/bundle-gate.mjs`. (Deviation: Rule 3 — blocking name mismatch corrected.)

Phase 3 + Phase 4 are confirmed merged. No BLOCK. Scene code may proceed.

---

## Confirmed Primitive Signatures (read from source — verbatim)

These are the REAL APIs 05-01+ aligns to (Research Open Q 3 resolved).

### `useAnimationGate` — `src/hooks/useAnimationGate.ts` (`"use client"`)

```ts
export function useAnimationGate<T extends Element>(
  ref: React.RefObject<T | null>,
  opts?: { rootMargin?: string; threshold?: number }
): { shouldAnimate: boolean; prefersReduced: boolean; inView: boolean; tabVisible: boolean };
```

- `shouldAnimate = !prefersReduced && inView && tabVisible`.
- `prefersReduced` comes from `motion/react` `useReducedMotion()` (the ONE reduced-motion source — do NOT hand-roll `matchMedia`).
- Defaults: `rootMargin = "200px"`, `threshold = 0`. Ref may be null; IO no-ops until the element mounts.
- **For the hero:** bind `frameloop`/`paused` to `shouldAnimate` exactly as `SceneCanvas` already does — never re-implement gating inside the scene.

### `useThemeColors` — `src/hooks/useThemeColors.ts` (`"use client"`)

```ts
export function useThemeColors(varNames: string[]): Record<string, string>;
```

- Returns **raw token strings** (e.g. `"#60a5fa"`), `{}` before mount.
- Reads `getComputedStyle(documentElement)` ONCE on mount, re-reads ONLY when `data-theme` flips (MutationObserver, `attributeFilter:["data-theme"]`). Never per-frame.
- **Hero consumer must** `useMemo(() => new THREE.Color(t["--accent-blue"] || "#60a5fa"), [t])` (keyed on the whole `t` object — recomputes once per theme flip, never per-frame), with a hardcoded hex fallback for the pre-mount `{}` state. This is the proven ThemedScene pattern.

### `src/lib/motion.ts` (plain data, no `"use client"`)

- `EASE_SIGNATURE = [0.16, 1, 0.3, 1] as const`
- `transitions = { base: { duration: 0.7, ease: EASE_SIGNATURE }, quick: { duration: 0.4, ease: EASE_SIGNATURE } }`
- `fadeUp: Variants = { hidden: { opacity:0, y:40 }, visible: { opacity:1, y:0, transition: transitions.base } }`
- `stagger = (gap = 0.1): Variants => ({ visible: { transition: { staggerChildren: gap } } })`
- Server-and-client importable. Reduced-motion handled by the consumer (swap `y:40 -> y:0`).

### `IslandBoundary` — `src/components/IslandBoundary.tsx` (`"use client"`)

```ts
// DEFAULT export (class component — the only class in the repo)
import IslandBoundary from "@/components/IslandBoundary";
<IslandBoundary fallback={<ScenePoster/>}>{children}</IslandBoundary>
```

- **Export style:** `export default class IslandBoundary`.
- **Fallback prop name:** `fallback` (NOT `fallbackComponent`/`renderFallback`). Props are exactly `{ children: ReactNode; fallback: ReactNode }`.
- Catches render throws via `getDerivedStateFromError` + `componentDidCatch`; renders `fallback` on error.

### `ClientScene` — `src/components/three/ClientScene.tsx` (`"use client"`) — **THE scene-mount finding for 05-01**

```ts
interface ClientSceneProps { className?: string; }
export default function ClientScene(props: { className?: string }): JSX.Element;
```

- **It accepts ONLY `{ className }`.** There is **NO scene-injection prop** (no `scene`, no `children`, no render prop).
- Internally it **hardcodes** `const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr:false, loading: () => <ScenePoster/> })` and renders `<SceneCanvas {...props} />` inside `<IslandBoundary fallback={<ScenePoster/>}>`, gated by `mounted && webglOk` (else `<ScenePoster/>`).
- `SceneCanvas` in turn **hardcodes** `<ThemedScene paused={...} />` inside its single `<Canvas>`.

> ### ⚠️ ACTION REQUIRED IN 05-01 — parameterize the mount path
>
> Because `ClientScene` → `SceneCanvas` → `ThemedScene` is a **hardcoded chain with no
> scene slot**, 05-01 cannot "drop a hero scene" through the public surface as-is. The
> cleanest injection approach (recommended, lowest blast radius):
>
> 1. **Add a `scene?: React.ReactNode` (or `children`) prop to `SceneCanvas`** that renders
>    inside `<Canvas>` in place of the hardcoded `<ThemedScene>`, **defaulting to
>    `<ThemedScene paused={...} />`** when omitted (keeps the harness + existing callers
>    working, zero breakage).
> 2. **Thread the same prop through `ClientScene`** (`scene?: React.ReactNode`) and pass it
>    down to the dynamic `SceneCanvas`. `ClientScene` stays the SOLE public import surface.
> 3. The hero page imports **`ClientScene` only** and passes `<HeroScene/>` (the new
>    `maath`-based `<points>` field) via the `scene` prop — preserving the route-split
>    (`three` reachable only through `ClientScene`'s `ssr:false` dynamic).
>
> The `paused` boolean (`!shouldAnimate || prefersReduced`) must still be forwarded to the
> injected scene, mirroring `ThemedScene`'s `{ paused }` contract — the new `HeroScene`
> MUST accept `{ paused }` and stop advancing rotation/time when paused.
>
> Alternative (NOT recommended): replace `ThemedScene`'s body in place. Rejected — it
> couples the harness proof to the hero and loses the trivial theme-bridge reference.

### Supporting (read, no changes needed)

- `ScenePoster({ className? })` — 100%/100% token-gradient div, zero CLS. The LCP/loading/fallback/reduced-motion/no-WebGL element. Theme-aware via CSS vars.
- `ThemedScene({ paused })` — reference scene; `useThemeColors(["--accent-blue","--accent-violet"]) -> THREE.Color` via `useMemo([t])`; rotates only when `!paused`. The `{ paused }` contract the hero scene must honor.
- `isWebGLAvailable()` (`src/lib/webgl.ts`, no React) — SSR-guarded `getContext` probe; `false` on server/throw. `ClientScene` already gates on it.

---

## Installed Phase-5 Dependency Versions

**Core 3D stack (Phase 4 — confirmed present, no BLOCK):**
`three@^0.184.0`, `@react-three/fiber@^9.6.1`, `@react-three/drei@^10.7.7`, `motion@^12.40.0`.

**Phase-5 deps installed this plan (registry-verified — `npm view` confirmed latest in line):**

| Package | Where | Range | Installed exact | Registry latest | Purpose |
|---------|-------|-------|-----------------|-----------------|---------|
| `maath` | `dependencies` | `^0.10.8` | `0.10.8` | `0.10.8` | `maath/random.inSphere` particle distribution + damped easing — replaces hand-rolled hero math |
| `r3f-perf` | `devDependencies` | `^7.2.3` | `7.2.3` | `7.2.3` | dev-only FPS/draw-call HUD for the spike. **NEVER ships** — any usage gated behind `process.env.NODE_ENV !== 'production'` |
| `@react-three/postprocessing` | — | — | **OMITTED** | `3.0.4` | install ONLY if the spike keeps bloom. **Spike decision: bloom OFF → NOT installed** (see Perf Spike below) |

- All registry versions matched the plan's sketch exactly (no pin adjustment needed).
- React-19 peer deps resolved clean; `npx tsc --noEmit` shows NO new errors in `three/`,
  `hooks/`, `lib/webgl`, or scene scope after install.
- The 30 npm-audit advisories are PRE-EXISTING in the existing dependency tree (count
  unchanged by these two installs) — out of scope per the scope boundary, non-blocking.

---

## Perf Spike — Hero Particle Count + Bloom Decision

### Methodology (honest — read this before trusting any number)

The spike ran in a **headless agent session with no interactive GPU browser loop**. A
live `r3f-perf` HUD reading under DevTools 4x–6x CPU throttling — the gold-standard
measurement the plan asks for — **could not be captured here** (no human-driven browser
to read the on-canvas FPS/draw-call HUD frame-over-frame). Per the orchestrator's explicit
instruction, **no fps numbers are fabricated.** Where a value is an engineering estimate
it is **labeled `[ESTIMATE]`**; where it is a verified structural fact it is labeled `[VERIFIED]`.

What WAS done, and is real:

- **[VERIFIED] API + draw-call validation via a throwaway spike scene.** A scratch
  `src/app/_hero-spike/spike-scene.tsx` was authored using the EXACT production wiring
  05-01 will use — `maath/random.inSphere(new Float32Array(count*3), { radius })` for the
  point buffer, drei `<Points positions stride={3}>` + `<PointMaterial sizeAttenuation
  depthWrite={false} blending={AdditiveBlending}>`, and a dev-only `<Perf>` gated behind
  `process.env.NODE_ENV !== 'production'`. It **type-checks clean** against R3F v9 /
  three@0.184 / drei@10.7 / maath@0.10.8 / r3f-perf@7.2.3. The scratch dir was DELETED
  (confirmed absent from `src/app/`) — it never ships.
- **[VERIFIED] Draw-call accounting holds.** A single `<points>` field is **ONE draw call
  regardless of particle count** (research Pattern 2; motion is a transform/`uTime`, never
  per-frame CPU attribute writes). Concept-A total = icosahedron edges (~1) + optional fill
  (1) + particle points (1) [+ bloom passes (~2–3) if kept] = **< 10 draw calls**, far under
  the research budget of < 100 for mobile 60 fps. The real cost center is **fragment
  overdraw** from additive particles (and bloom), which scales with particle *size* and
  *count* and with bloom intensity — NOT with draw calls.

### Particle-count bands — what each costs (estimates, labeled)

| Particles | Draw calls | Vertex cost | Fragment/overdraw risk on mid-tier mobile (4x–6x CPU throttle proxy) | Verdict |
|-----------|-----------|-------------|----------------------------------------------------------------------|---------|
| 2,000 | 1 `[VERIFIED]` | trivial (one static buffer, GPU-rotated) | LOW `[ESTIMATE]` — smallest additive-blend overdraw footprint | **CHOSEN** |
| 2,500 | 1 `[VERIFIED]` | trivial | LOW–MODERATE `[ESTIMATE]` | acceptable; revisit after real-device data |
| 3,000 | 1 `[VERIFIED]` | trivial | MODERATE `[ESTIMATE]` — most additive overdraw of the band; highest risk of fragment-bound jank on low-end mobile GPUs | upper bound only |

> Because particle COUNT is essentially free on the vertex/draw-call axis and the only
> count-sensitive cost is additive fragment overdraw (worst exactly on the throttled
> mid-tier devices we cannot measure here), the conservative choice is the **bottom of the
> band**.

### DECISION (conservative fallback — measured device data pending)

- **Hero particle count: `2000`.** Lowest end of the research's 2,000–3,000 band. Rationale:
  draw-call cost is identical across the band (1), so the only lever is overdraw, which is
  smallest at 2,000 — the safest pick for the un-measured mid-tier-mobile worst case. 05-01
  uses `2000` as the production constant. **Re-tune upward toward 2,500–3,000 ONLY after a
  real throttled-device `r3f-perf` reading confirms 60 fps headroom** (defer to the 05-09
  LCP/perf gate or a manual device pass).
- **Bloom: `OFF` by default.** `@react-three/postprocessing` was **NOT installed.** Rationale:
  bloom adds ~2–3 extra full-screen passes and is the single largest fragment-overdraw
  multiplier — precisely the cost we cannot measure headlessly. Shipping it on un-measured
  mid-tier mobile risks the LCP/60-fps budget. The signature glow can be approximated cheaply
  for now via additive `<PointMaterial>` blending + emissive edge color (zero extra passes).
  **Bloom stays OFF pending a real-device measurement**; if a later device pass shows
  headroom, 05-01+ may install `@react-three/postprocessing@^3.0.4` and add a `<Bloom>` that
  is **gated OFF under `prefers-reduced-motion` / low-power**.

> **For 05-01 to consume:** `PARTICLE_COUNT = 2000`; no bloom / no `EffectComposer`; do NOT
> add `@react-three/postprocessing` to the dependency tree unless/until a measured-device
> spike re-opens the bloom decision. The `HeroScene` must accept `{ paused }` (mirror
> `ThemedScene`) and must NOT write point positions on the CPU per frame.

---

## Lighthouse CLI Availability

- **`lighthouse` global binary: ABSENT** (`command not found`).
- **`npx lighthouse`: NOT installed locally** — `npx lighthouse --version` would download
  `lighthouse@13.4.0` on demand (registry has it). It is not present in `node_modules` and
  not in `package.json`.
- **Chrome IS present** at `C:\Program Files\Google\Chrome\Application\chrome.exe` (a Chrome
  binary exists for whenever Lighthouse/DevTools is run).
- **05-09 LCP-gate fallback:** since the CLI is not pre-installed, the 05-09 LCP/PERF gate
  should EITHER (a) run a one-off `npx lighthouse@13.4.0 <url> --only-categories=performance
  --chrome-flags="--headless"` against a local prod build (downloads on first run), OR
  (b) use the Chrome DevTools **Performance** + **Lighthouse** panels manually against the
  prod build. Recommend pinning `lighthouse@13.4.0` as a devDependency in 05-09 if an
  automated/CI LCP check is wanted, rather than relying on the on-demand npx download.

---

## Bundle Gate Update — `scripts/bundle-gate.mjs`

- **File:** `scripts/bundle-gate.mjs` (the real Phase-4 gate; the plan's `check-bundle.mjs`
  reference is a name typo — corrected).
- **Change:** `CANVAS_ROUTES` now includes **`/page`** (the homepage — the 05-01 hero mount)
  alongside the existing temporary **`/scene-harness/page`**. Existing dual matcher (named
  fast-path + hash-proof canvas-exclusive cross-route assertion) unchanged.
- **Why add `/page` now (before the hero ships):** safe and intentional. Until 05-01 wires
  `ClientScene` into `app/page`, `/page` carries NO three chunk — so the gate still proves
  three is route-split today, and it is pre-armed so the moment the hero mounts it asserts
  the three vendor chunk lands ONLY in the homepage scene chunk and stays absent from every
  shared/text/SEO route and `/layout`.
- **Verified GREEN on the current (pre-hero) build:**

  ```
  npm run build  -> success (38 routes; /scene-harness 2.2 kB; / present)
  node scripts/bundle-gate.mjs
    -> bundle budget OK — three confined to canvas routes [/page, /scene-harness/page] across 38 routes
    -> EXIT 0
  ```

- **05-01 follow-up:** when 05-01 deletes the temporary `/scene-harness` route, also remove
  `"/scene-harness/page"` from `CANVAS_ROUTES`, leaving `"/page"` as the sole canvas route.

---

## Hand-off Summary for 05-01 (the numbers/decisions downstream consumes)

| Item | Value |
|------|-------|
| Prereq guard | PASS — all 10 Phase-3/4 primitives present |
| `ClientScene` scene injection | **None today** — add a `scene?: ReactNode` prop to `SceneCanvas` (default `<ThemedScene/>`) and thread it through `ClientScene`; forward `paused` to the injected scene |
| Hero particle count | **2000** (conservative; re-tune up only on measured-device 60 fps headroom) |
| Bloom | **OFF**; `@react-three/postprocessing` NOT installed |
| `maath` | `^0.10.8` installed (use `maath/random.inSphere`) |
| `r3f-perf` | `^7.2.3` dev-only; gate `<Perf>` behind `NODE_ENV !== 'production'` |
| Lighthouse CLI | absent (npx-on-demand `13.4.0` or DevTools panel for 05-09) |
| Bundle gate | `/page` added to `CANVAS_ROUTES`; green on current build; remove `/scene-harness/page` when 05-01 deletes the harness |
