# Stack Research

**Domain:** Elite animated portfolio (3D/WebGL + scroll-driven motion) on Next.js 15.5 App Router + React 19.2 + Tailwind v4
**Researched:** 2026-06-12
**Confidence:** HIGH (all versions + peer deps verified live against npm registry; App Router `ssr:false` constraint verified against current Next.js docs)

> Scope note: this is an *additive* milestone on an existing site (React 19.2.4 / Next 15.5.12 / Tailwind v4.1.13, no animation libs today — all visuals are hand-rolled Canvas 2D). Recommendations below are the deltas to ADD, chosen for exact compatibility with the locked React/Next versions. No framework changes.

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `three` | `^0.184.0` (≥0.159 required by drei) | WebGL renderer + scene graph | The WebGL standard. Pinned by R3F/drei peer ranges; framework-agnostic, no React constraint. Use a caret but treat three as the version drei dictates. |
| `@react-three/fiber` | `^9.6.1` | React renderer for three.js (declarative scenes, hooks, `useFrame`) | **Only R3F line that supports React 19.** v8 is React 18-only. Lets you build the hero/globe as JSX instead of imperative canvas math. **Peer: `react >=19 <19.3`** — your 19.2.4 fits; see Version Compatibility for the ceiling caveat. |
| `@react-three/drei` | `^10.7.7` | Helper components for R3F (Environment, OrbitControls, Float, MeshTransmissionMaterial, shaderMaterial, useTexture, Html, ScrollControls, drei/Bvh) | drei **v10** is the R3F-v9/React-19 line (v9 = R3F v8/React 18). Removes 80% of boilerplate. Tree-shakeable — import only what you use. |
| `motion` | `^12.40.0` | Declarative UI animation, layout animation, scroll-linked motion, gestures, `useReducedMotion` | This is **framer-motion renamed** — same code, `motion` is the canonical package since v11.12+. Peer `react ^18 || ^19` → clean on React 19.2. Drop-in for component reveals, page transitions, micro-interactions, and `<AnimatePresence>`. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lenis` | `^1.3.23` | Smooth/inertial scroll + scroll-progress events | When you want "buttery" smooth scrolling and a single scroll source to drive both DOM and 3D. **Renamed from `@studio-freight/lenis`** — use `lenis`, not the old scoped name. React 17+, framework-agnostic. **Optional** — see "What NOT to Use" for when to skip it. |
| `@react-three/postprocessing` | `^3.0.4` | R3F bindings for bloom, DOF, chromatic aberration, vignette, noise | Only if a scene needs cinematic glow/grading. Peer `@react-three/fiber ^9`, `react ^19` — compatible. Pulls in `postprocessing@^6.39` transitively. Adds weight — gate behind the dynamic 3D import. |
| `postprocessing` | `^6.39.1` | Underlying effect-composer engine | Transitive dep of the above; pin only if you hit a resolution conflict. |
| `maath` | `^0.10.8` | Math/easing/random helpers for R3F (e.g. `maath/random` for particle fields, `maath/easing` for damped lerps) | Replaces hand-rolled 3D math in the particle hero/globe. Tiny, tree-shakeable. |
| `r3f-perf` | `^7.2.3` | In-canvas GPU/draw-call/FPS HUD | **Dev-only.** Mount conditionally (`process.env.NODE_ENV !== 'production'`) to verify the 60fps + off-screen-pause budget the PROJECT mandates. |

### Native-first alternatives (prefer these before reaching for libraries)

| Capability | Native option | When it's enough |
|------------|---------------|------------------|
| Scroll-triggered reveals | CSS **scroll-driven animations** (`animation-timeline: view()` / `scroll()`) | Baseline in Chromium 115+ / supported broadly by 2026. Zero JS, runs on compositor, respects `prefers-reduced-motion` via `@media`. Use for simple fade/slide-in reveals — your existing `ScrollReveal` can often become pure CSS. |
| Element entrance/exit | CSS `@starting-style` + `transition` | Simple appear/disappear without `<AnimatePresence>`. |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` + `useReducedMotion()` from motion | Always — mandated by PROJECT constraints. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `r3f-perf` | 3D performance HUD | Dev-only mount; gate the import so it never ships. |
| `@next/bundle-analyzer` | Verify 3D code lands in its own async chunk and is absent from initial JS | Confirms the `ssr:false` dynamic-import strategy actually code-splits. |
| `tsc --noEmit` + `eslint` | Type/lint gate | PROJECT mandates running these explicitly — `next.config.ts` ignores both during build. |

## Installation

```bash
# Core 3D (exact React-19-compatible lines)
npm install three@^0.184.0 @react-three/fiber@^9.6.1 @react-three/drei@^10.7.7

# Core motion (framer-motion renamed)
npm install motion@^12.40.0

# Supporting (add only as features need them)
npm install lenis@^1.3.23 maath@^0.10.8
npm install @react-three/postprocessing@^3.0.4   # only if cinematic effects are used

# Dev / verification
npm install -D r3f-perf@^7.2.3 @types/three @next/bundle-analyzer
```

## App Router bundle-size strategy (load-bearing — verified against Next.js docs)

The #1 performance risk: three.js + R3F is heavy (~150kb+ gzipped). It must never enter the initial/server bundle.

1. **`ssr: false` only works inside a Client Component.** Next.js throws if `dynamic(..., { ssr: false })` is used in a Server Component. Pattern: make a thin `'use client'` wrapper (e.g. `HeroCanvas.client.tsx`) that does the dynamic import, then render that wrapper from your Server Component page.
   ```tsx
   // components/Hero3DLoader.tsx  ('use client')
   'use client'
   import dynamic from 'next/dynamic'
   const Hero3DScene = dynamic(() => import('./Hero3DScene'), {
     ssr: false,
     loading: () => <HeroPoster />, // CSS/static fallback — also the reduced-motion view
   })
   export default function Hero3DLoader() { return <Hero3DScene /> }
   ```
2. **WebGL can't SSR anyway** (no `WebGLRenderingContext` on the server), so `ssr:false` is correct, not a workaround — it also avoids hydration mismatches.
3. **One `<Canvas>` per heavy scene, lazy-mounted**, ideally gated on viewport (IntersectionObserver) so the 3D chunk downloads only when the hero/globe nears view. Pairs with the PROJECT requirement that animations pause off-screen.
4. **Use the `loading` fallback as the reduced-motion + low-power experience** (a static poster image / CSS gradient). Satisfies `prefers-reduced-motion` for free.
5. **`frameloop="demand"`** on `<Canvas>` for scenes that only animate on interaction; call `invalidate()` to render — drops idle GPU/CPU cost to zero.
6. **Tree-shake drei** — always `import { Float } from '@react-three/drei'`, never namespace-import the whole package.
7. **Verify with `@next/bundle-analyzer`** that the three/R3F chunk is async and the route's initial JS is unchanged.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `motion` v12 | `framer-motion` v12 (same code) | Identical package; `framer-motion` still publishes as a compatibility alias. Prefer `motion` — it's the canonical name and lets you import the lighter `motion/react` entry. No reason to install both. |
| `motion` v12 | `@react-spring/web` | Only if you specifically want spring-physics interpolation across a large existing react-spring codebase. For a greenfield portfolio, motion covers springs + layout + scroll + gestures in one lib with better docs and React 19 support. |
| CSS scroll-driven animations | `lenis` + scroll-linked motion | Reach for lenis only when you genuinely want smooth/inertial scrolling or need a unified scroll value driving WebGL. For plain reveal-on-scroll, native CSS (or motion's `useScroll` on the native scroller) is lighter and accessible by default. |
| R3F (declarative) | Raw `three` imperative | If a scene is a one-off with no React state interplay, raw three in a `useEffect` is leaner. But for a site of interconnected animated components, R3F's reconciler + drei pays for itself. The existing hand-rolled Canvas 2D scenes are the case *against* staying imperative. |
| `@react-three/postprocessing` | hand-written shader passes | Use raw shaders only for a bespoke signature effect; for standard bloom/DOF/grain the library is far faster to ship and well-optimized. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@react-three/fiber` **v8** / `@react-three/drei` **v9** | React 18-only. **Will not install / will break** against React 19.2.4. | R3F **v9.6.1** + drei **v10.7.7** |
| Bumping React past **19.2.x** without re-checking R3F | R3F v9.6.1 peer is **`react >=19 <19.3`** — a future `npm update` to React 19.3 would break the R3F peer range. | Keep React pinned at 19.2.4; treat 19.3 as a gated upgrade that waits for an R3F release widening the range. |
| `@studio-freight/lenis` (old scoped name) | Deprecated/renamed package; stale. | `lenis` (unscoped) |
| `gsap` (with ScrollTrigger/SplitText, etc.) | (1) **Licensing**: GSAP's previously-paid "bonus" plugins (SplitText, MorphSVG, ScrollSmoother, etc.) became free under Webflow in 2024, but GSAP core remains under its own "no-charge" license with redistribution restrictions — extra license diligence for a commercial client site, and a second large animation runtime alongside motion. (2) **Redundancy**: motion v12 + CSS scroll-driven animations + lenis already cover scroll, timelines, and micro-interactions. Adding GSAP means two overlapping engines and more bundle. | `motion` v12 (`useScroll`/`useTransform`/timelines) + native CSS scroll-driven animations; `lenis` for smooth scroll |
| `react-spring` **and** `motion` together | Two animation runtimes doing the same job → bundle bloat + mental overhead. | Pick **`motion`** only |
| Multiple `<Canvas>` instances rendering simultaneously | Each spins up its own WebGL context/render loop → GPU contention, mobile jank, context-loss risk (browsers cap active contexts). | One shared lazy-mounted `<Canvas>`, or sequential mounts gated by IntersectionObserver |
| Static `import` of three/R3F at the route level | Pulls ~150kb+ into initial JS and can crash SSR (no WebGL on server). | `next/dynamic(..., { ssr:false })` inside a `'use client'` wrapper |
| `dynamic(..., { ssr:false })` inside a **Server Component** | Next.js 15 throws a build error — it's disallowed in Server Components. | Move the dynamic import into a `'use client'` wrapper, render that from the server page |
| Tailwind `dark:` variants for new components | Project themes via CSS custom properties + `data-theme`, **not** `dark:`. Mixing breaks theme consistency. | Keep using `--bg-*` / `--text-*` variables + `data-theme` |

## Stack Patterns by Variant

**If the component is a simple reveal/fade/slide on scroll:**
- Use **CSS scroll-driven animations** (`animation-timeline: view()`), or `motion`'s `whileInView`.
- Because it runs on the compositor, ships ~0 extra JS, and respects `prefers-reduced-motion` natively. Don't load three or lenis for this.

**If the component is a hero / globe / particle field (true 3D):**
- Use **R3F v9 + drei v10 (+ maath)**, lazy-mounted via `ssr:false` in a client wrapper, `frameloop="demand"` or IntersectionObserver-gated.
- Because Canvas 2D has hit its ceiling (the existing scenes) and WebGL is what "world-best" requires here.

**If you want site-wide buttery scrolling that also drives 3D:**
- Add **lenis**, expose its scroll progress, feed it into `useFrame`/`useTransform`.
- Because a single scroll source keeps DOM and WebGL perfectly in sync. Skip lenis if you don't need inertial scroll — it intercepts native scroll and adds an accessibility/UX surface to test.

**If a scene needs cinematic polish (glow, depth, grain):**
- Add **@react-three/postprocessing**, gated behind the same dynamic 3D chunk, effects toggled off under `prefers-reduced-motion` / low-power.
- Because hand-writing passes is slow and error-prone; the library is GPU-optimized.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `@react-three/fiber@9.6.1` | `react@19.2.4`, `react-dom@19.2.4` | Peer is **`>=19 <19.3`** — current React fits. **Hard ceiling at 19.3**; pin React, gate any 19.3 bump. |
| `@react-three/fiber@9.6.1` | `three@>=0.156` | Satisfied by three 0.184. |
| `@react-three/drei@10.7.7` | `react@^19`, `@react-three/fiber@^9`, `three@>=0.159` | drei v10 is the React-19 line; v9 is React 18. |
| `@react-three/postprocessing@3.0.4` | `@react-three/fiber@^9`, `react@^19`, `three@>=0.156` | Compatible; pulls `postprocessing@^6.39`. |
| `motion@12.40.0` | `react@^18 \|\| ^19`, `react-dom@^18 \|\| ^19` | Clean on React 19.2. `@emotion/is-prop-valid` is an optional peer (only for styled-components interop) — safe to ignore. |
| `lenis@1.3.23` | `react@>=17` | Framework-agnostic core; `lenis/react` provides the React hook. |
| `next@15.5.12` | `dynamic(ssr:false)` | Only inside Client Components (verified against Next docs, 2026-03). |
| `three@0.184.0` | (no React peer) | Version is effectively dictated by drei's `>=0.159` floor; caret is fine. |

## Sources

- npm registry (live `npm view`, 2026-06-12) — exact versions + peerDependencies for `three@0.184.0`, `@react-three/fiber@9.6.1` (`react >=19 <19.3`), `@react-three/drei@10.7.7` (`react ^19`, `@r3f/fiber ^9`), `@react-three/postprocessing@3.0.4`, `motion@12.40.0` (`react ^18||^19`), `framer-motion@12.40.0`, `lenis@1.3.23`, `maath@0.10.8`, `r3f-perf@7.2.3`, `postprocessing@6.39.1`, `gsap@3.15.0` — **HIGH confidence**
- Next.js docs — "How to lazy load Client Components and libraries" (nextjs.org, lastUpdated 2026-03-10) — confirmed `ssr:false` is disallowed in Server Components and the client-wrapper workaround — **HIGH confidence**
- R3F dist-tags: `latest=9.6.1`, v10 only in alpha/canary — confirms v9 is the stable React-19 line, do **not** adopt v10 prereleases — **HIGH confidence**
- `.planning/codebase/STACK.md` — existing locked versions (React 19.2.4, Next 15.5.12, Tailwind v4.1.13, no animation libs) and theming-via-`data-theme` constraint — **HIGH confidence (project source of truth)**
- GSAP licensing (Webflow acquisition, plugins free 2024) — **MEDIUM confidence** (general ecosystem knowledge; the recommendation to skip GSAP rests primarily on redundancy with motion, not solely on licensing — verify license terms if a stakeholder insists on GSAP)

---
*Stack research for: elite animated portfolio (3D/WebGL + scroll motion) on Next.js 15.5 / React 19.2 / Tailwind v4*
*Researched: 2026-06-12*
