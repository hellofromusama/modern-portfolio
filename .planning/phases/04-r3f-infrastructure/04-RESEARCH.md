# Phase 4: R3F Infrastructure Island - Research

**Researched:** 2026-06-12
**Domain:** SSR-safe WebGL boundary on Next.js 15.5 App Router + React 19.2 — `@react-three/fiber@9` provider (DPR clamp + frameloop control), `dynamic(ssr:false)` client-island pattern, CSS-var→WebGL theme bridge, static-poster fallback, and an automatable bundle budget proving `three` stays out of shared/text-route chunks.
**Confidence:** HIGH (all versions + peer deps verified live against npm 2026-06-12; build-manifest structure read from the actual `.next/`; `ssr:false`/client-wrapper rule verified against Phase 3 research + Next docs). MEDIUM-HIGH on the runtime frameloop-switch + context-loss patterns (stable R3F v9 APIs, but the exact `invalidate()`/`gl` recipe is composed from established usage rather than a single quoted doc line).

## Summary

Phase 4 stands up the WebGL *boundary*, not a real scene. The deliverables are: (1) install the React-19-verified 3D stack (`three@^0.184`, `@react-three/fiber@^9.6.1`, `@react-three/drei@^10.7.7`; `motion@^12.40` is a Phase-3 deliverable — **check `package.json` at execution time** before reinstalling); (2) a `SceneCanvas` provider component that clamps DPR to `[1,2]`, drives `frameloop` from Phase 3's `useAnimationGate`, and feeds Phase 3's `useThemeColors` into materials; (3) a `dynamic(ssr:false)` client wrapper composed with Phase 3's `IslandBoundary` and a static poster; (4) a WebGL-availability probe + context-loss handler that swaps to the poster; (5) a trivial themed scene (rotating icosahedron wireframe using two theme accents) that proves theme reactivity in both `data-theme` values; (6) an automatable bundle-budget check asserting `three` chunks attach **only** to routes that mount the canvas.

The single highest-leverage discovery for the planner: **the existing codebase already proves the island pattern works.** `src/app/page.tsx` is `'use client'` and already calls `dynamic(() => import(...), { ssr:false })` directly for Hero3D/FAQ/TeamSection — so for client pages no extra wrapper file is strictly required. But the *elite* and *future-proof* pattern (and the one the success criteria imply) is a dedicated `'use client'` wrapper file (`ClientScene.tsx`) so the canvas can also be mounted from a future RSC page. The `ssr:false` rule is the real constraint: it must never appear in a server file. There are currently **no server files that would import the canvas** — all canvas consumers (`page.tsx`, `fund-me`, `ideas`) are already client pages — so the lint/grep gate is a guard-rail, not a fix.

Second key finding: `@next/bundle-analyzer` is published **in lockstep with Next.js**. Version `15.5.0` exists and matches the project's Next 15.5.12 line; `latest` is `16.2.9` (targets Next 16). Recommend `@next/bundle-analyzer@^15.5.0` for version-matched safety, OR — more reliable for a CI-less local gate — a **dependency-free Node script that parses `.next/app-build-manifest.json`** (structure verified below) to assert `three` chunks attach only to canvas routes. The script is the primary gate; the analyzer is the human-readable companion.

**Primary recommendation:** Create `src/components/three/{SceneCanvas.tsx, ThemedScene.tsx, ClientScene.tsx, ScenePoster.tsx}` + `src/lib/webgl.ts` (availability probe). Install `three@^0.184.0 @react-three/fiber@^9.6.1 @react-three/drei@^10.7.7` (+ `-D @types/three`). Wrap the canvas in Phase 3's `IslandBoundary` with the poster as fallback. Drive `frameloop` off `useAnimationGate`, colors off `useThemeColors`. Add a Node `scripts/check-bundle.mjs` asserting `three` is absent from `/layout`, `/projects/[id]/page`, and every text route. **Serialize the `next.config.ts` + `package.json` edits after Phase 3 lands** (only shared-file collision points).

## User Constraints

> **No `CONTEXT.md` exists** for this phase (`.planning/phases/04-r3f-infrastructure/` has no `*-CONTEXT.md`). Constraints below are extracted with locked-decision authority from `CLAUDE.md` (PROJECT block), `REQUIREMENTS.md`, `ROADMAP.md` Phase 4, the milestone research docs (STACK/PITFALLS/ARCHITECTURE), Phase 3 research, and the orchestrator's `<additional_context>`.

### Locked Decisions
- **Versions pinned (no framework change):** React 19.2.4, Next 15.5.12, Tailwind v4.1.13 (CSS-first, no `tailwind.config`), TypeScript 5.9.
- **3D stack is fixed to the React-19 line:** `@react-three/fiber@^9.6.1` (NOT v8 — React-18-only), `@react-three/drei@^10.7.7` (NOT v9 — React-18-only), `three@^0.184.0`. `motion@^12.40` is the locked animation lib (likely already installed by Phase 3).
- **`ssr:false` only inside a Client Component.** Next 15 build-errors `dynamic(ssr:false)` in a Server Component. Canvas files are `'use client'`; the dynamic import lives in a `'use client'` wrapper (or a client page).
- **Additive only.** New files under `src/components/three/` + `src/lib/`; existing 17 components untouched this phase. Existing entries preserved verbatim.
- **Theming contract frozen:** `data-theme` attribute on `<html>` + CSS custom properties (`--bg-*`, `--text-*`, `--accent-*`). **NOT** Tailwind `dark:`. WebGL must consume colors via the `getComputedStyle` bridge — never hardcode hex in materials.
- **Animations MUST pause off-screen AND on tab blur AND respect `prefers-reduced-motion`.** Mobile is first-class; DPR capped at 2.
- **One `<Canvas>` per heavy scene; never multiple simultaneous WebGL contexts** (browser-capped, non-shareable).
- **`three` must NOT enter the shared bundle or any text/SEO route** — route-split via `ssr:false`; bundle budget proven.
- **Verification gate (SHIP-01):** `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke in BOTH themes. `next build` alone proves nothing (`ignoreBuildErrors:true`, `ignoreDuringBuilds:true`).
- **No Horizon Digital / interview-prep content.** Don't touch Stripe/email/security flows.

### Claude's Discretion
- Exact file names/signatures of `SceneCanvas`, `ClientScene`, `ThemedScene`, `ScenePoster`, `webgl.ts` (recommendations below).
- The trivial-scene geometry (recommendation: rotating icosahedron wireframe — mirrors the existing Canvas-2D hero's icosahedron, proving parity).
- Whether the bundle gate is `@next/bundle-analyzer`, a Node manifest-parser script, or both (recommendation: script as the hard gate, analyzer optional).
- How `useThemeColors` is consumed inside the Canvas tree (hook in a child component vs. props from the wrapper) — recommendation below.
- Whether `drei` is installed now or deferred (recommendation: install now per FOUND-04 wording; the trivial scene needs no drei helper, but Phase 5 will).

### Deferred Ideas (OUT OF SCOPE for Phase 4)
- The real signature WebGL hero, per-component upgrades, ScrollReveal→motion rewrite, InteractiveGlobe/IdeaNetworkCanvas DPR-bug fix → **Phase 5 (VIS-\*, PERF-02)**.
- `lenis`, `maath`, `@react-three/postprocessing`, `r3f-perf` → Phase 5 as features need them (do NOT install now).
- View Transitions, security fixes, strict-build re-enable → Phase 6.
- **Phase 3 territory (concurrent — DO NOT re-create or edit):** `src/hooks/useAnimationGate.ts`, `src/hooks/useThemeColors.ts`, `src/components/IslandBoundary.tsx`, `error.tsx`/`global-error.tsx`, token/AA work in `globals.css`. Phase 4 **consumes** these; it must not author them.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **FOUND-04** | `three` + `@react-three/fiber@^9.6` + `@react-three/drei@^10.7` + `motion@^12.40` installed (React-19-verified); 3D scenes load via `dynamic(ssr:false)` from client wrappers with static fallbacks | §Standard Stack (live-verified versions + peers); §Pattern 1 (client-island wrapper, reuses existing `page.tsx` precedent); §Pattern 5 (poster fallback) |
| **PERF-01** | CWV must not regress: WebGL/3D route-split and lazy; hero LCP element renders without waiting on three.js | §Pattern 1 (`ssr:false` route-split); §Validation Architecture (bundle-manifest assertion script — `three` only on canvas routes); §Pitfall 2 (poster is the LCP element, canvas mounts on top) |
| **SHIP-01** | Phase passes tsc + lint + build + both-theme smoke | §Validation Architecture (gate baked in); §Pattern 6 (trivial themed scene is the both-theme smoke target) |

## Standard Stack

### Core (install this phase)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `three` | `^0.184.0` | WebGL renderer + scene graph | The WebGL standard. drei requires `>=0.159`; 0.184 satisfies it. No React peer constraint. |
| `@react-three/fiber` | `^9.6.1` | React renderer for three.js (`<Canvas>`, `useFrame`, `useThree`, `invalidate`) | **Only R3F line supporting React 19.** Peer **`react >=19 <19.3`** — React 19.2.4 fits. v8 is React-18-only and will not install. |
| `@react-three/drei` | `^10.7.7` | R3F helpers (used in Phase 5: `Float`, `Environment`, etc.; this phase needs none but install per FOUND-04) | drei **v10** is the R3F-v9/React-19 line. Peer `react ^19`, `@react-three/fiber ^9.0.0`. Tree-shake: `import { X } from '@react-three/drei'`. |
| `@types/three` | latest | TypeScript types for `three` | `three` ships partial types; `@types/three` is the standard companion. Dev dependency. |

### Already-present / verify-don't-reinstall

| Library | Version | Notes |
|---------|---------|-------|
| `motion` | `^12.40.0` | **Phase 3 installs this.** At execution time `grep '"motion"' package.json` — if present, do NOT reinstall. If Phase 3 hasn't merged yet, install it. FOUND-04 lists it, so the phase must *ensure* it's present, not necessarily *add* it. |

### Do NOT install this phase

| Library | Why deferred |
|---------|--------------|
| `lenis`, `maath`, `@react-three/postprocessing`, `r3f-perf` | Phase 5 (scene-specific). Installing now inflates nothing (tree-shaken) but adds unused deps + lockfile churn against concurrent phases. |
| `@next/bundle-analyzer` | **Optional** — see §Validation. If used, pin `^15.5.0` (Next-15.5-matched), NOT `16.2.9` (Next-16). The Node manifest script is the recommended hard gate and needs zero deps. |

**Installation:**
```bash
# Run npm ci first if node_modules is absent (lockfile-faithful — PITFALLS #8)
npm install three@^0.184.0 @react-three/fiber@^9.6.1 @react-three/drei@^10.7.7
npm install -D @types/three
# motion: only if `grep '"motion"' package.json` shows it's absent (Phase 3 owns it)
npm install motion@^12.40.0
```

**Version verification (live `npm view`, 2026-06-12 — all HIGH confidence):**
- `three` → `0.184.0` (latest), no React peer.
- `@react-three/fiber` → `9.6.1` (latest), peer `react >=19 <19.3`, `react-dom >=19 <19.3`, `three >=0.156`. **React 19.2.4 fits; hard ceiling 19.3 — keep React pinned.**
- `@react-three/drei` → `10.7.7` (latest), peer `react ^19`, `react-dom ^19`, `three >=0.159`, `@react-three/fiber ^9.0.0`.
- `motion` → `12.40.0` (latest), peer `react ^18||^19`.
- `@next/bundle-analyzer` → `latest=16.2.9`, but **`15.5.0` exists** and matches Next 15.5.x. dist-tags confirm lockstep-with-Next publishing.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Dedicated `ClientScene.tsx` wrapper | Inline `dynamic(ssr:false)` directly in client page (existing `page.tsx` precedent) | Inline works for client pages and matches existing code. But a wrapper file lets a future RSC page mount the canvas and keeps the `ssr:false` seam in one obvious place. **Recommend the wrapper** (elite pattern, success-criteria-aligned). |
| `@next/bundle-analyzer` | Node script parsing `.next/app-build-manifest.json` | Analyzer needs a browser to read its HTML report (poor for an automatable gate). The manifest script gives a hard pass/fail in CI-less local runs. **Recommend the script as the gate**, analyzer as optional visualization. |
| `useThemeColors` hook inside a Canvas child | Pass resolved colors as props from the client wrapper | Hook-inside-Canvas keeps R3F reactive to theme changes via React state and is cleaner. **Recommend hook in a `<ThemedScene>` child** that lives *inside* `<Canvas>` (R3F context is available there). |

## Architecture Patterns

### Recommended file structure (additive — all NEW)

```
src/
├── components/three/                 # NEW — WebGL island boundary
│   ├── SceneCanvas.tsx               #   'use client' <Canvas> provider: DPR clamp, frameloop, gl/context-loss
│   ├── ThemedScene.tsx               #   'use client' scene graph (rotating icosahedron) — consumes useThemeColors INSIDE Canvas
│   ├── ScenePoster.tsx               #   'use client' (or server-safe) static poster — fallback + reduced-motion + WebGL-unavailable view
│   └── ClientScene.tsx               #   'use client' wrapper: dynamic(ssr:false) + IslandBoundary + Suspense/poster
├── lib/
│   └── webgl.ts                      #   isWebGLAvailable() canvas.getContext probe (no React)
└── scripts/                          # NEW (or .planning/scripts) — bundle gate
    └── check-bundle.mjs              #   parses .next/app-build-manifest.json; asserts three only on canvas routes
```
> `src/hooks/useAnimationGate.ts`, `src/hooks/useThemeColors.ts`, `src/components/IslandBoundary.tsx` are **Phase 3 outputs — consumed, not created here.** Confirm they exist at execution time (`ls src/hooks/`); if Phase 3 hasn't merged, the planner must sequence after it.

### Pattern 1: `dynamic(ssr:false)` client-island wrapper (FOUND-04, PERF-01)

**What:** A `'use client'` wrapper does the `dynamic(() => import('./SceneCanvas'), { ssr:false, loading: () => <ScenePoster/> })`. The canvas never server-renders (no `WebGLRenderingContext` on the server → no hydration mismatch, no crash). Compose Phase 3's `IslandBoundary` so a runtime WebGL throw degrades to the poster instead of bubbling to `error.tsx`.

**When to use:** Every place the canvas mounts. Mirrors the existing, working `page.tsx`/`Hero3D` pattern.

**Confirmed precedent (read from repo):** `src/app/page.tsx` is `'use client'` and already does `const Hero3D = dynamic(() => import('@/components/Hero3D'), { ssr:false })`; `Hero3D.tsx` itself does `dynamic(() => import('./Hero3DScene'), { ssr:false, loading: () => <div ... style={{background:'var(--bg-card)'}} /> })`. The new island reuses this exact shape, swapping Canvas-2D internals for R3F.

**Example:**
```tsx
// src/components/three/ClientScene.tsx
'use client';
import dynamic from 'next/dynamic';
import IslandBoundary from '@/components/IslandBoundary'; // Phase 3
import ScenePoster from './ScenePoster';

// ssr:false is legal — THIS file is a client component
const SceneCanvas = dynamic(() => import('./SceneCanvas'), {
  ssr: false,
  loading: () => <ScenePoster />, // also the LCP/reduced-motion/no-WebGL view
});

export default function ClientScene(props: { className?: string }) {
  return (
    <IslandBoundary fallback={<ScenePoster />}>
      <SceneCanvas {...props} />
    </IslandBoundary>
  );
}
```
**Trade-off:** one extra trivial file; in exchange the canvas is mountable from RSC *and* client pages with zero hydration risk and a guaranteed non-empty first paint.

### Pattern 2: `SceneCanvas` provider — DPR clamp + frameloop control + context-loss (FOUND-04, PERF-01, PERF-05-foundation)

**What:** The single `<Canvas>` owner. Clamps DPR `[1,2]` (caps mobile pixel work — PITFALLS Perf Trap "uncapped DPR melts phones"). Drives `frameloop` from Phase 3's `useAnimationGate` (off-screen / tab-blur / reduced-motion → pause). Handles WebGL context loss via the renderer's canvas events, flipping to the poster.

**When to use:** Always — one provider, one GL context (ARCHITECTURE Anti-Pattern 2: never multiple canvases).

**Frameloop semantics (R3F v9, dpr/frameloop confirmed against R3F Canvas docs):**
- `frameloop="always"` — continuous render loop (use when on-screen + visible + motion allowed).
- `frameloop="demand"` — renders only when `invalidate()` is called or props change (ideal for interaction-only scenes; idle GPU/CPU → zero).
- `frameloop="never"` — no automatic rendering (hard pause).
- **Runtime switch:** R3F reads the `frameloop` prop reactively — changing it on re-render switches modes. For the gate, bind it: `frameloop={shouldAnimate ? 'always' : 'never'}`. (On `'demand'`, after a theme change call `invalidate()` once to repaint the new colors without a running loop.)

**Example:**
```tsx
// src/components/three/SceneCanvas.tsx
'use client';
import { useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useAnimationGate } from '@/hooks/useAnimationGate'; // Phase 3
import ThemedScene from './ThemedScene';
import ScenePoster from './ScenePoster';

export default function SceneCanvas({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { shouldAnimate, prefersReduced } = useAnimationGate(wrapRef);
  const [contextLost, setContextLost] = useState(false);

  // Handle WebGL context loss → swap to poster (PITFALLS: context-loss risk on mobile)
  const onCreated = useCallback((state: { gl: { domElement: HTMLCanvasElement } }) => {
    const canvas = state.gl.domElement;
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();          // allow restoration attempts
      setContextLost(true);
    }, { passive: false });
    canvas.addEventListener('webglcontextrestored', () => setContextLost(false));
  }, []);

  if (contextLost) return <ScenePoster />;

  return (
    <div ref={wrapRef} className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        dpr={[1, 2]}                                   // clamp — never render >2x on retina/mobile
        frameloop={shouldAnimate ? 'always' : 'never'} // pause off-screen / tab-blur / reduced-motion
        gl={{ antialias: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false }}
        onCreated={onCreated}
        style={{ width: '100%', height: '100%' }}
      >
        <ThemedScene paused={!shouldAnimate || prefersReduced} />
      </Canvas>
    </div>
  );
}
```
**Trade-off:** the gate must mirror `shouldAnimate` correctly (Phase 3 already solves the stale-closure problem for the rAF case; R3F reads the prop on render so it's simpler here). DPR `[1,2]` is the R3F default but **set it explicitly** so the budget is provable in code review.

### Pattern 3: CSS-var → WebGL theme bridge (the #1 research flag — concrete resolution)

**What:** `THREE.Color` cannot parse `'var(--accent-blue)'`. Resolve the token to a concrete color string first, feed it to the material, and re-read on `data-theme` change. Phase 3's `useThemeColors(varNames)` already does the read + `MutationObserver` + cache. Phase 4 consumes it **inside a Canvas child** and converts to `THREE.Color`.

**Concrete format facts (verified from `globals.css`):**
- Accents are authored as **hex**: dark `--accent-blue:#60a5fa`, `--accent-violet:#a78bfa`, `--accent-emerald:#34d399`; light `--accent-blue:#3b82f6`, `--accent-violet:#8b5cf6`, `--accent-emerald:#10b981`. `--bg-primary` is hex (`#0a0a0f` / `#f8fafc`). **No `oklch`, no CSS color functions** in the token set. Some `--bg-card` tokens are `rgba()` but those aren't scene colors.
- **`getComputedStyle().getPropertyValue('--accent-blue')` returns the raw author string** — i.e. the hex `#60a5fa` (custom-property *values* are returned as-authored, NOT normalized to `rgb()`; normalization-to-`rgb()` happens for *resolved standard properties* like `color`, not for custom-property reads). Either way `THREE.Color` accepts **both** hex strings (`'#60a5fa'`) and `rgb()`/`rgba()` strings, so the bridge is robust to either. (Confidence: MEDIUM-HIGH — `THREE.Color` hex/`rgb()` string support is well-established; the custom-property-returns-author-value behavior is standard DOM. Cheap to verify empirically in the both-theme smoke.)
- **Alpha is dropped:** `THREE.Color` ignores any alpha channel. The scene colors are opaque hex, so this is a non-issue here; just don't feed an `rgba(...,0.x)` token expecting transparency (use material `opacity` instead).

**Updating without remount (uniforms vs `material.color.set`):**
- For a `<meshBasicMaterial color={...} />` driven by React state, simply **passing a new `color` prop re-applies it** — R3F reconciles the prop onto `material.color` without remounting. Easiest path; recommended for the trivial scene.
- For finer control / shader materials, call `material.color.set(themeColors['--accent-blue'])` imperatively in a `useEffect` keyed on the resolved colors, or set a `uniforms.uColor.value` and (if `frameloop="demand"`) call `invalidate()` once to repaint. **No remount needed in any case** — `set()` mutates the existing material.

**Consume the hook INSIDE the Canvas tree** (not in the wrapper): R3F context (`useThree`, material refs) only exists inside `<Canvas>`. A `<ThemedScene>` child can call `useThemeColors([...])` directly (it's a plain React hook; works in any client component, including R3F children). Passing colors as props from the wrapper also works but loses the reactive re-read on toggle unless the wrapper also subscribes — so **hook-in-child is cleaner.**

**Example:**
```tsx
// src/components/three/ThemedScene.tsx
'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useThemeColors } from '@/hooks/useThemeColors'; // Phase 3

export default function ThemedScene({ paused }: { paused: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  // Phase 3 hook: re-reads on data-theme MutationObserver, returns raw token strings
  const t = useThemeColors(['--accent-blue', '--accent-violet']);

  // THREE.Color accepts hex ('#60a5fa') or rgb() strings; fallback while colors hydrate
  const edge = useMemo(() => new THREE.Color(t['--accent-blue'] || '#60a5fa'), [t['--accent-blue']]);
  const fill = useMemo(() => new THREE.Color(t['--accent-violet'] || '#a78bfa'), [t['--accent-violet']]);

  useFrame((_, delta) => {
    if (paused || !mesh.current) return;
    mesh.current.rotation.x += delta * 0.3;
    mesh.current.rotation.y += delta * 0.4;
  });

  return (
    <>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.4, 0]} />
        {/* wireframe edge color tracks --accent-blue; updates on toggle via prop reconcile, no remount */}
        <meshBasicMaterial color={edge} wireframe />
      </mesh>
      {/* a second tinted element proves the SECOND theme color also reacts */}
      <ambientLight color={fill} intensity={0.8} />
    </>
  );
}
```
**Trade-off:** `getComputedStyle` is sync; the Phase-3 hook already gates it to once-per-theme-change (never per-frame — PITFALLS "per-frame getComputedStyle thrashes layout"). The `useMemo` keys ensure `THREE.Color` objects are recreated only when the resolved token changes.

### Pattern 4: WebGL-availability probe + poster fallback (research flag #5)

**What:** Before/around mounting, detect WebGL support; if absent (or context lost), render the static poster. The probe is a `canvas.getContext('webgl2') ?? canvas.getContext('webgl')` check.

**Example:**
```ts
// src/lib/webgl.ts  (no React; safe to import anywhere client-side)
export function isWebGLAvailable(): boolean {
  if (typeof document === 'undefined') return false; // never run on server
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}
```
Consume in `ClientScene`/`SceneCanvas`: gate the canvas mount on `isWebGLAvailable()` (after `mounted` is true, since it touches `document`), else render `<ScenePoster/>`. Combine with the `webglcontextlost` handler (Pattern 2) so both "never had WebGL" and "lost WebGL mid-session" land on the same poster.

### Pattern 5: `ScenePoster` — the LCP element, reduced-motion view, and error fallback (PERF-01, PITFALLS 3)

**What:** A lightweight, instantly-painted static element (CSS gradient or `next/image` poster) sized to **exactly** the canvas container (zero CLS). It serves four roles at once: dynamic-import `loading`, `IslandBoundary` fallback, reduced-motion static view, and WebGL-unavailable view. The canvas mounts **on top** as enhancement — the poster is what the LCP measurement sees, so `three` never blocks LCP.

**Recommendation:** A pure CSS gradient using theme tokens (`background: linear-gradient(var(--bg-secondary), var(--bg-primary))` + a subtle accent) is the cheapest and is theme-aware for free. Reserve the container's height/aspect so mounting the canvas causes **zero** layout shift.

### Anti-Patterns to avoid (from ARCHITECTURE/PITFALLS)
- `dynamic(ssr:false)` in a server file → Next 15 build error. (No current server file imports the canvas; keep it that way — grep gate below.)
- Multiple `<Canvas>` / GL contexts → context-loss on mobile. One provider only.
- Hardcoded hex in materials → breaks the theme toggle. Always bridge via `useThemeColors`.
- Per-frame `getComputedStyle` → layout thrash. Read on `data-theme` change only (Phase-3 hook already does).
- Re-implementing reduced-motion/in-view inside the Canvas → use Phase 3's `useAnimationGate`, don't reinvent.
- Namespace-importing drei (`import * as drei`) → kills tree-shaking, bloats the chunk. Named imports only.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reduced-motion + off-screen + tab-blur gate | A new IntersectionObserver/matchMedia per scene | Phase 3 `useAnimationGate(ref)` → `frameloop` | Phase 3 already solved it; reinventing violates Anti-Pattern 4 and risks inconsistent thresholds |
| CSS-var → color read + theme re-subscribe | Custom `MutationObserver` in the scene | Phase 3 `useThemeColors([...])` | Already cached, SSR-safe, observes `data-theme` once |
| Error fallback for a failed canvas | try/catch around render (can't catch render errors) | Phase 3 `<IslandBoundary fallback={<ScenePoster/>}>` | React render errors require the class boundary API; Phase 3 ships it |
| React renderer for three.js | Imperative `new THREE.WebGLRenderer()` + manual rAF | `@react-three/fiber` `<Canvas>` + `useFrame` | R3F handles resize, DPR, render loop, disposal, and `frameloop` control correctly |
| Bundle inspection | Eyeballing `next build` output | Node script over `.next/app-build-manifest.json` (§Validation) | "First Load JS" summary hides which *route* ships three; the manifest is the source of truth |
| WebGL feature detect | Assuming support | `canvas.getContext('webgl2'\|\|'webgl')` probe | Older devices / disabled GPU / headless → must fall back, not crash |

**Key insight:** Phase 4's whole job is to be a *thin boundary that wires Phase-3 primitives to R3F*. Almost every "hard" sub-problem (gating, theming, error fallback) is already a Phase-3 deliverable — the failure mode is re-implementing them inside the canvas instead of consuming them.

## Runtime State Inventory

> Phase 4 creates **new** files only (no rename/refactor/migration of existing runtime state). The only mutations to existing artifacts are dependency installs and an optional `next.config.ts` wrapper.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no datastore, DB, or persisted keys touched. | None |
| Live service config | None — no external service (Stripe/email/LLM) touched. | None |
| OS-registered state | None — no scheduled tasks / processes. | None |
| Secrets/env vars | New **build-time** env var `ANALYZE` only **if** `@next/bundle-analyzer` is adopted (read in `next.config.ts`). No secrets, not committed, no runtime effect. | None (document the flag) |
| Build artifacts / installed packages | `package-lock.json` + `node_modules/` change on install (three/fiber/drei/@types/three). `.next/` rebuilt. | `npm ci` then `npm install ...`; rebuild for the manifest gate |

**Shared-file collision points (serialize-after-Phase-3):**
- `package.json` / `package-lock.json` — Phase 3 installs `motion`; Phase 4 installs the 3D stack. **Install order: Phase 3 first, then Phase 4** to avoid lockfile conflicts. At execution, `grep '"motion"'` before adding it.
- `next.config.ts` — **only** if the bundle analyzer wrapper is added (the `withBundleAnalyzer(nextConfig)` export). Phase 3 does not touch `next.config.ts`, but treat this as a serialize point and keep the diff to the wrapper line only. **If the Node manifest script is used instead, `next.config.ts` is untouched entirely** (recommended — removes the collision).

## Common Pitfalls

### Pitfall 1: `three` leaks into the shared bundle or a text/SEO route (PERF-01 killer)
**What goes wrong:** A static `import` of three/R3F at module top level (or importing `SceneCanvas` from a shared component like layout/nav/footer) pulls ~150KB+ into the shared chunk — regressing LCP/INP on every route, including ranked text pages.
**Why:** `dynamic(ssr:false)` is forgotten, or the canvas is imported by something rendered site-wide.
**How to avoid:** Only `ClientScene` (the dynamic wrapper) is ever imported, and only by pages that actually show 3D. Never import `SceneCanvas`/`ThemedScene`/`three` from `layout.tsx`, `Navigation`, `Footer`, or any text page. **Prove it with the manifest script** (§Validation).
**Warning signs:** `three` chunk appears under `/layout` or `/projects/[id]/page` in `app-build-manifest.json`; "First Load JS shared by all" jumps.

### Pitfall 2: Canvas becomes the LCP element → LCP > 2.5s (PITFALLS 3)
**What goes wrong:** Deferring the whole scene with no poster leaves nothing to paint as LCP until WebGL is ready.
**How to avoid:** `ScenePoster` is a real, instantly-painted element occupying the exact container; canvas mounts on top. Lighthouse LCP element must be the poster/text, not `<canvas>`.
**Warning signs:** Lighthouse names `<canvas>` as LCP; layout "jump" when the scene appears (CLS > 0.1).

### Pitfall 3: Scene looks right in dark, broken in light (PITFALLS 7)
**What goes wrong:** Colors hardcoded during dark-mode dev; the toggle doesn't change them.
**How to avoid:** All scene colors come from `useThemeColors`; the trivial scene is the both-theme smoke target. Toggle `data-theme` → icosahedron edge color must visibly change (dark `#60a5fa` → light `#3b82f6`).
**Warning signs:** `THREE.Color` warning about an unparseable value; washed-out scene in one theme.

### Pitfall 4: `next build` green while the island is broken (PITFALLS 8)
**What goes wrong:** `ignoreBuildErrors:true` + `ignoreDuringBuilds:true` mean a green build proves nothing.
**How to avoid:** Run `npx tsc --noEmit` + `npm run lint` explicitly; hard-refresh (not client-nav) the canvas route; run the bundle script.
**Warning signs:** relying on "build passed."

### Pitfall 5: Canvas mounts before `mounted`/WebGL-probe → SSR/hydration edge
**What goes wrong:** Touching `document`/WebGL during the server pass or first hydration tick.
**How to avoid:** `ssr:false` already excludes the server pass; additionally guard the WebGL probe behind a `mounted` flag (existing repo convention: `mounted` state + `if (!mounted) return null`) so `isWebGLAvailable()` runs client-side only.

### Pitfall 6: drei namespace import bloats the chunk
**What goes wrong:** `import * as drei` (or barrel `examples/jsm`) defeats tree-shaking even inside the async chunk.
**How to avoid:** Named imports only (`import { Float } from '@react-three/drei'`). This phase needs no drei helper for the trivial scene — installing drei is for Phase 5.

## Code Examples

### Trivial themed scene spec (research flag #6 — the acceptance-test scene)
A **rotating wireframe icosahedron** (intentionally mirrors the existing Canvas-2D hero's hardcoded icosahedron, proving R3F parity) whose **wireframe edge color = `--accent-blue`** and whose **light tint = `--accent-violet`** (two distinct theme tokens, proving multi-color reactivity). Acceptance:
1. Mounts only via `ClientScene` (`ssr:false`) — no hydration error on hard refresh.
2. Rotates when on-screen + visible + motion allowed; **freezes** off-screen, on tab-blur, and under `prefers-reduced-motion` (via `useAnimationGate` → `frameloop`).
3. **In `data-theme="dark"`:** edges render `#60a5fa`. **In `data-theme="light"`:** toggling live updates edges to `#3b82f6` with **no remount** (prop reconcile / `material.color.set`).
4. WebGL disabled (or context lost) → `ScenePoster` shows instead, page chrome intact.
See Pattern 3 (`ThemedScene.tsx`) for the full implementation.

### Bundle-budget assertion script (research flag #4 — the automatable gate)
```js
// scripts/check-bundle.mjs — run AFTER `npm run build`. Zero deps. Node 22.
import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('.next/app-build-manifest.json', 'utf8'));
// Structure (verified from this repo's .next): { pages: { "<route>": ["static/chunks/...js", ...] } }

// Routes that are ALLOWED to ship three (canvas mounts here). Update as Phase 5 adds scenes.
const CANVAS_ROUTES = new Set(['/page']); // homepage hero in Phase 5; none strictly in Phase 4

const offenders = [];
for (const [route, chunks] of Object.entries(manifest.pages)) {
  const hasThree = chunks.some((c) => /three|react-three|fiber|drei/i.test(c));
  if (hasThree && !CANVAS_ROUTES.has(route)) {
    offenders.push({ route, chunks: chunks.filter((c) => /three|react-three/i.test(c)) });
  }
}
if (offenders.length) {
  console.error('❌ three.js leaked into non-canvas routes:', JSON.stringify(offenders, null, 2));
  process.exit(1);
}
console.log('✅ bundle budget OK — three is route-split, absent from shared/text routes');
```
> **Caveat (MEDIUM confidence):** webpack content-hashes and may name the three chunk generically (e.g. `static/chunks/4521.js`) rather than `three.*`. The chunk *filename* regex catches named vendor chunks; for hashed chunks the more robust assertion is **comparing `three`-containing chunks across routes** — assert that the set of chunks unique to canvas routes contains the large vendor chunk and that text routes' chunk lists don't include it. The planner should validate the regex against the *actual* built manifest in a Wave-0 task (run `npm run build`, inspect which chunk three lands in) and tune the matcher. The `@next/bundle-analyzer@^15.5.0` HTML report is the fallback human verification if the script's matcher proves brittle.

### Optional `@next/bundle-analyzer` wrapper (if adopted — serialize after Phase 3 on `next.config.ts`)
```ts
// next.config.ts — wrap the EXISTING export; do not alter other config
import bundleAnalyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
// ...existing nextConfig...
export default withBundleAnalyzer(nextConfig);
```
Run `ANALYZE=true npm run build`. Pin `@next/bundle-analyzer@^15.5.0` (Next-15.5-matched), not `16.x`.

## State of the Art

| Old Approach (current repo) | Current Approach (Phase 4 target) | Impact |
|--------------|------------------|--------|
| Canvas-2D + manual 3D math + raw rAF | R3F v9 `<Canvas>` + `useFrame` (still `ssr:false`, same boundary) | Declarative scenes, correct disposal/resize/DPR; Phase 5 builds real scenes on it |
| rAF runs forever | `frameloop` bound to `useAnimationGate` | Off-screen/tab-blur/reduced-motion pause for free |
| Colors hardcoded per canvas | `useThemeColors` → `THREE.Color` | Theme toggle works in WebGL |
| No bundle proof | Manifest-parser gate | `three` provably absent from shared/text routes |

**Deprecated/outdated:** R3F v8 / drei v9 (React-18-only — do NOT install). `@studio-freight/lenis` → `lenis` (Phase 5 only). `images.domains` in `next.config.ts` is deprecated (→ `remotePatterns`) but **out of scope** — don't touch it this phase.

## Open Questions

1. **Does Phase 3's `useAnimationGate`/`useThemeColors`/`IslandBoundary` exist at execution time?**
   - What we know: Phase 3 is building them (per 03-RESEARCH.md, exact signatures specified); Phase 3 runs concurrently.
   - What's unclear: merge timing.
   - Recommendation: **Hard sequencing dependency — Phase 4 must execute after Phase 3 merges.** Wave-0 task: `ls src/hooks/useAnimationGate.ts src/hooks/useThemeColors.ts src/components/IslandBoundary.tsx` must all exist before proceeding. If absent, block (don't re-author them — that creates a duplicate/merge conflict).

2. **Will the bundle script's chunk-name regex match hashed webpack chunks?**
   - What we know: manifest structure is `{pages:{route:[chunkPaths]}}` (verified); webpack may hash vendor chunk names.
   - Recommendation: Wave-0 task to `npm run build` and inspect the actual three chunk name, then tune the matcher (named-vendor regex vs. cross-route chunk-set diff). Keep `@next/bundle-analyzer@^15.5.0` as the human fallback.

3. **`getComputedStyle` custom-property return format — hex or normalized rgb()?**
   - What we know: tokens are authored as hex; custom-property reads typically return the author string; `THREE.Color` accepts both hex and `rgb()`.
   - Recommendation: non-blocking — the bridge handles both. Confirm empirically during the both-theme smoke (it's a one-line console check). LOW risk.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `three` | FOUND-04 scene graph | Installable (registry verified) | 0.184.0 | none needed |
| `@react-three/fiber` | FOUND-04 Canvas/useFrame | Installable; peer-clean on React 19.2.4 | 9.6.1 | none — v8 incompatible, no alt |
| `@react-three/drei` | FOUND-04 (Phase-5 helpers) | Installable; peer-clean | 10.7.7 | none needed |
| `@types/three` | TS types | Installable | latest | three's own partial types (worse DX) |
| `motion` | FOUND-04 (Phase-3 owns) | Likely already installed by Phase 3 | 12.40.0 | install if absent |
| `@next/bundle-analyzer` | optional bundle viz | Installable | **^15.5.0** (Next-15.5-matched) | **Node manifest script (recommended primary)** |
| Node / npm | install + build + script | ✓ (Node v22.22.2 local, lockfile v3) | — | — |
| `.next/app-build-manifest.json` | bundle gate input | ✓ (present from prior build; regenerated by `npm run build`) | — | — |
| WebGL (runtime, end-user) | scene render | device-dependent | — | `ScenePoster` static fallback (Pattern 4/5) |

**Missing dependencies with no fallback:** none.
**Missing with fallback:** `@next/bundle-analyzer` → Node manifest script (recommended primary anyway).
**Note:** run `npm ci` first if `node_modules` is absent (lockfile-faithful — PITFALLS #8), then install the 3D stack.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | **None** — repo has no test framework/files/script (STACK.md; vitest+Playwright deferred to a later milestone). |
| Config file | none — see Wave 0 |
| Quick run command | `npx tsc --noEmit` (de-facto unit gate) |
| Full suite command | `npx tsc --noEmit && npm run lint && npm run build && node scripts/check-bundle.mjs` + manual both-theme smoke |

> Phase 4 ships runtime WebGL but no test framework exists; validation is type/lint/build + a scripted bundle assertion + manual smoke (hard-refresh, theme toggle, reduced-motion emulation, WebGL-disabled). Building a test framework is out of scope.

### Phase Requirements → Verification Map
| Req | Behavior | Verification type | Automated command / method | File exists? |
|-----|----------|-------------------|----------------------------|--------------|
| FOUND-04 | Stack installed, React-19-verified | scripted | `node -e "const p=require('./package.json');['three','@react-three/fiber','@react-three/drei','motion'].forEach(d=>{if(!(p.dependencies[d]||p.devDependencies[d]))throw d+' missing'})"` | ❌ Wave 0 (script) |
| FOUND-04 | `ssr:false` only in client files; never in server files | grep | `rg "ssr:\s*false"` → every hit is in a file whose first non-empty line is `'use client'`/`"use client"`; `rg -l "ssr:\s*false" src/app` cross-checked so no server `page.tsx`/`layout.tsx` matches | ❌ Wave 0 (grep gate) |
| FOUND-04 | Island has a static fallback | grep/manual | `ClientScene` `loading:`/`IslandBoundary fallback` both reference `ScenePoster`; manual: disable WebGL (`chrome://flags` or DevTools) → poster shows | n/a |
| PERF-01 | `three` route-split, absent from shared/text routes | scripted | `node scripts/check-bundle.mjs` (parses `.next/app-build-manifest.json`; exits 1 on leak) after `npm run build` | ❌ Wave 0 (script) |
| PERF-01 | Hero LCP element is the poster, not canvas | manual | Lighthouse on the canvas route → LCP element = poster/text; CLS ≤ 0.1 on mount | n/a |
| FOUND-04 | Theme reactivity both `data-theme` values | manual smoke | Toggle theme → icosahedron edge color changes (dark `#60a5fa` → light `#3b82f6`), no remount, no `THREE.Color` warning | n/a |
| FOUND-04/PERF | Pause off-screen / tab-blur / reduced-motion | manual + DevTools | DevTools Performance: scroll canvas off-screen → render loop stops; switch tab → stops; emulate `prefers-reduced-motion: reduce` → frozen/poster | n/a |
| SHIP-01 | Phase gate | command | `npx tsc --noEmit && npm run lint && npm run build && node scripts/check-bundle.mjs` green + both-theme smoke + hard-refresh | n/a |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (fast type gate; the only sub-30s check available).
- **Per wave merge:** `npx tsc --noEmit && npm run lint && npm run build && node scripts/check-bundle.mjs`.
- **Phase gate:** full suite green + manual both-theme + reduced-motion + WebGL-disabled smoke + hard-refresh of the canvas route, before `/gsd:verify-work`.

### Route-table check (PERF-01 guard)
Assert no **text/SEO route** imports the canvas. Server text routes per ARCHITECTURE: `/blog`, `/blog/*`, `/developer-australia`, `/expertise`, `/services`, `/tech-stack`, `/projects/[id]`. Grep: `rg -l "ClientScene|SceneCanvas|@react-three|from 'three'" src/app/{blog,developer-australia,expertise,services,tech-stack,projects}` must return **nothing** this phase (Phase 4 mounts no scene on any page — it only builds the boundary; a demo mount, if any, belongs on a throwaway/dev route or the homepage which is the Phase-5 target).

### Wave 0 Gaps
- [ ] **Sequencing guard:** `ls src/hooks/useAnimationGate.ts src/hooks/useThemeColors.ts src/components/IslandBoundary.tsx` — all must exist (Phase 3 merged). If absent, BLOCK.
- [ ] `npm ci` (if `node_modules` absent) → then install 3D stack; `grep '"motion"' package.json` before adding motion.
- [ ] `scripts/check-bundle.mjs` — author it; then `npm run build` once and **tune the chunk-name regex** against the real manifest (Open Question 2).
- [ ] `package.json` stack-presence assertion script (FOUND-04 row above).
- [ ] Decide `next.config.ts` analyzer wrapper IN/OUT — recommend OUT (use the manifest script) to remove the `next.config.ts` serialize-point entirely.
- [ ] (No test framework to install — scripted node checks + grep + manual smoke only.)

## Sources

### Primary (HIGH confidence)
- `npm view` live (2026-06-12): `three@0.184.0`; `@react-three/fiber@9.6.1` peer `react >=19 <19.3`, `three >=0.156`; `@react-three/drei@10.7.7` peer `react ^19`, `@react-three/fiber ^9.0.0`, `three >=0.159`; `motion@12.40.0`; `@next/bundle-analyzer` dist-tags (`latest=16.2.9`, `15.5.0` exists, lockstep-with-Next).
- Repo read directly: `package.json` (React 19.2.4, motion absent), `next.config.ts` (no analyzer, `ignoreBuildErrors/ignoreDuringBuilds:true`), `src/app/globals.css` (accents as **hex**, no oklch), `src/app/page.tsx` (`'use client'` + direct `dynamic(ssr:false)`), `src/components/Hero3D.tsx` (`dynamic(ssr:false, loading:...)` precedent), `.next/app-build-manifest.json` (structure `{pages:{route:[chunks]}}`, 4 routes verified), `.planning/REQUIREMENTS.md` (FOUND-04/PERF-01/SHIP-01 exact text), `.planning/ROADMAP.md` (Phase 4 success criteria), `.planning/config.json` (`nyquist_validation:true`).
- `.planning/phases/03-shared-foundation/03-RESEARCH.md` — `useAnimationGate`/`useThemeColors`/`IslandBoundary` signatures + file locations (the primitives Phase 4 consumes).
- `.planning/research/{STACK,PITFALLS,ARCHITECTURE}.md` — version locks, island/theme-bridge/frameloop patterns, pitfall mapping, anti-patterns.
- [R3F Canvas API](https://r3f.docs.pmnd.rs/api/canvas) — `frameloop` ('always'/'demand'/'never'), `dpr` default `[1,2]`, `onCreated`, `gl` props (HIGH).

### Secondary (MEDIUM confidence)
- `THREE.Color` accepting hex + `rgb()` strings; `getComputedStyle` returning custom-property author values; `invalidate()`/`material.color.set` update-without-remount — established R3F/DOM behavior, composed from usage rather than a single quoted line. Empirically verifiable in the both-theme smoke.
- Webpack chunk-naming/hashing affecting the bundle-script regex — flagged for Wave-0 tuning against the real manifest.
- [Next.js — lazy-load Client Components / `ssr:false` in Server Components disallowed] — via STACK.md/Phase-3 (verified there against Next docs).

## Metadata

**Confidence breakdown:**
- Standard stack + versions/peers: HIGH — live `npm view` 2026-06-12, React 19.2.4 peer-clean.
- Island/`ssr:false` pattern: HIGH — existing repo precedent (`page.tsx`/`Hero3D`) + Phase-3/Next-docs confirmation.
- Frameloop/DPR/Canvas props: HIGH — R3F Canvas docs.
- Theme bridge (CSS-var→THREE.Color): MEDIUM-HIGH — token format read from globals.css (hex, confirmed); `THREE.Color` string parsing established but exact `getComputedStyle` return verified empirically in smoke.
- Context-loss + WebGL probe: MEDIUM-HIGH — standard WebGL event/`getContext` patterns.
- Bundle gate (manifest script): MEDIUM — structure verified; chunk-name regex needs Wave-0 tuning against the real build.

**Research date:** 2026-06-12
**Valid until:** ~2026-07-12 (stable; R3F v9 line + Next 15.5 conventions are not fast-moving; re-verify only if React is bumped toward 19.3, which would break the R3F peer ceiling).
