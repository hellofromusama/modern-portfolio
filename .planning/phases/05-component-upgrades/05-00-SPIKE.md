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

_(populated in Task 2)_

---

## Perf Spike — Hero Particle Count + Bloom Decision

_(populated in Task 3)_

---

## Lighthouse CLI Availability

_(populated in Task 3)_

---

## Bundle Gate Update

_(populated in Task 3)_
