# Phase 5: Per-Component Visual Upgrades - Research

**Researched:** 2026-06-12
**Domain:** Signature WebGL hero (R3F v9 on the Phase-4 `SceneCanvas` boundary) + motion-v12 micro-interaction rewrite + DPR-correct canvas upgrades + token-conformance pass across 17 components and 12 pages, all under a mobile LCP ≤ 2.5s / zero-CLS / animation-gated budget.
**Confidence:** HIGH on stack/versions, the existing-component inventory (read from source), the LCP/poster strategy, and the motion-v12 API. MEDIUM-HIGH on exact particle/draw-call budgets (cross-verified against R3F perf authorities, but final numbers need a Wave-0 profiler spike on a real mid-tier device). MEDIUM on the globe WebGL-vs-canvas recommendation (a judgment call grounded in effort/risk, documented below).

## Summary

Phase 5 is the flagship. It does NOT build infrastructure — Phase 4 already shipped the `SceneCanvas` provider (DPR clamp `[1,2]`, `frameloop` driven by `useAnimationGate`, `useThemeColors` hex bridge, `dynamic(ssr:false)` `ClientScene` wrapper, `ScenePoster` LCP fallback, `IslandBoundary`). Phase 5 *consumes* that boundary to build the real signature hero, then elevates every other component on the shared primitives. The dominant constraint is regression-avoidance: each component already has a distinct visual identity (read and inventoried below) that must be *raised*, never *replaced* — a from-scratch rebuild was previously rolled back, so "additive, identity-preserving" is non-negotiable.

The single highest-leverage decision is the hero scene. The current hero is a Canvas-2D wireframe **icosahedron** orbited by particles, floating triangles, and dashed elliptical rings, with a lerped mouse-parallax. The brand-correct move is **evolution, not replacement**: a WebGL icosahedron that reads as the same motif at higher fidelity (true depth, real lines, optional bloom) surrounded by a GPU particle field — an upgrade reads as craft, a brand-new scene reads as a rebrand. The critical perf insight from R3F authorities: **a GPU particle field is ONE draw call regardless of count** (a single `<points>`/BufferGeometry with a shader), so thousands of particles are cheap; the real budget is *draw calls* (target < 100, trivially met here), *fragment overdraw*, and *never updating particle positions on the CPU per frame*. The hero's LCP element is the existing `<h1>` text overlay (z-10 over the z-0 canvas) plus the `ScenePoster` — `three` never blocks LCP because the poster paints instantly and the scene fades in on top.

**Primary recommendation — RECOMMENDED HERO CONCEPT: "Icosahedron Evolution + Particle Field" (Concept A below).** Evolve the existing icosahedron into a real WebGL wireframe (drei `<Icosahedron>` + `<Edges>` or `<Wireframe>`, theme-colored), suspended in a GPU `<points>` particle field (2,000–3,000 particles, shader-driven, one draw call), with subtle mouse-parallax on the camera/group and an optional gated bloom. It preserves brand identity exactly while delivering the WebGL leap. Budget: < 30 draw calls, DPR clamped `[1,2]`, `frameloop` gated, static poster + reduced-motion fallback. Sequence the hero FIRST (it validates the Phase-4 infra end-to-end), then run independent component groups as parallel file-disjoint waves.

## User Constraints

> **No `CONTEXT.md` exists** for this phase (`.planning/phases/05-component-upgrades/` is empty — verified via glob). Constraints below carry locked-decision authority, extracted verbatim-in-spirit from `CLAUDE.md` (PROJECT/CONSTRAINTS/CONVENTIONS blocks), `REQUIREMENTS.md` (VIS-*, PERF-02, SHIP-01), `ROADMAP.md` Phase 5 success criteria, the Phase-4 research (the boundary contract Phase 5 consumes), and the orchestrator `<additional_context>`. If `/gsd:discuss-phase` runs later and produces a CONTEXT.md, it supersedes this section.

### Locked Decisions
- **Versions pinned (no framework change):** React 19.2.4, Next 15.5.12, Tailwind v4.1.13 (CSS-first, no `tailwind.config`), TypeScript 5.9. 3D stack fixed to the React-19 line: `@react-three/fiber@^9.6.1`, `@react-three/drei@^10.7.7`, `three@^0.184.0`, `motion@^12.40`. **Keep React pinned — R3F v9 peer ceiling is `<19.3`.**
- **Additive only; identity-preserving.** Every existing component, page, project, route, and SEO asset is preserved. A prior from-scratch rebuild was rejected and rolled back — upgrades raise fidelity in place; they do NOT remove features or redesign from zero. Each component's current purpose/identity (inventoried in §Per-Component Upgrade Specs) is the floor.
- **Theming contract frozen:** `data-theme` attribute on `<html>` + CSS custom properties (`--bg-*`, `--text-*`, `--accent-*`, `--btn-*`, `--border-*`). **NOT** Tailwind `dark:`. Every upgraded component must be theme-aware via these tokens. WebGL colors come through Phase-3 `useThemeColors` → `THREE.Color` — never hardcoded hex in materials.
- **Consume Phase-3/Phase-4 primitives; do NOT re-author them.** `useAnimationGate`, `useThemeColors`, `IslandBoundary`, `SceneCanvas`, `ClientScene`, `ScenePoster`, `webgl.ts`, motion presets, tightened tokens — all exist before Phase 5. Phase 5 uses them.
- **Performance budget (hard):** Mobile LCP ≤ 2.5s; **zero CLS** (every poster/canvas reserves exact dimensions); hero LCP element is the text/poster, never `<canvas>`; `three` route-split (absent from shared/text routes — re-run the Phase-4 bundle gate); **all animation pauses off-screen AND on tab-blur AND respects `prefers-reduced-motion`**; DPR capped at 2 on mobile; capability detection serves a static/reduced scene to low-power devices.
- **DPR coordinate bug MUST be fixed** in `InteractiveGlobe` (and verified in `IdeaNetworkCanvas`) — see §Common Pitfalls #1.
- **Verification gate (SHIP-01):** `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke in BOTH themes per phase. `next build` alone proves nothing (`ignoreBuildErrors:true`, `ignoreDuringBuilds:true`).
- **Anti-features forbidden** (from FEATURES.md): no scroll-jacking, no mandatory preloaders/intros, no percentage skill bars, no gratuitous/maximal animation, no autoplaying audio, no deep stacked parallax, no blocking 3D with no fallback. "Restraint as craft" — animate to direct attention, not decorate.
- **Out of scope this phase:** View Transitions (VIS-08 → Phase 6), security/bug fixes (FIX-01/02 → Phase 6), strict-build re-enable (Phase 6). No Horizon Digital / interview-prep content. Don't touch Stripe/email/checkout logic (visual polish only).

### Claude's Discretion
- **The specific hero scene concept** (3 proposed below; Concept A recommended). The exact particle count within the budget band, whether bloom is included, and the exact camera-parallax feel.
- **Globe: WebGL migration vs. refined Canvas-2D** (recommendation: refined Canvas-2D with the DPR fix + gating + theme tokens — lower risk, preserves the exact look; full WebGL is a larger rewrite for marginal visual gain on a decorative element. Documented in §Per-Component Upgrade Specs).
- **Exact motion-v12 variant/transition values** (durations, stagger amounts, easing) — within the "restraint" envelope and matching the existing signature easing `cubic-bezier(0.16,1,0.3,1)`.
- **Whether `ScrollReveal` becomes pure CSS scroll-driven animation or motion `whileInView`** (recommendation: motion `whileInView` for parity with the existing IntersectionObserver behavior + variants for stagger; keep the same prop surface so call sites don't churn).
- **Card/typography token treatment specifics** (elevation values, hover lift magnitude) — within the tightened Phase-3 token scale.
- **Wave grouping / file-disjoint ownership** (proposed in §Sequencing; planner may re-balance).
- **Whether to install `maath` (particle/easing helpers) and/or `@react-three/postprocessing` (bloom)** — recommendation: `maath` yes (tiny, tree-shakeable, replaces hand-rolled particle math); postprocessing only if bloom is included and gated.

### Deferred Ideas (OUT OF SCOPE for Phase 5)
- View Transitions page transitions (VIS-08), security fixes (FIX-01 test-openai, FIX-02 VisitorTracker), strict-build re-enable, a11y-hardening final pass, flagship architecture-diagram polish → **Phase 6**.
- Loom/video walkthroughs, observability/trace screenshots, custom branded cursor → **v2** (REQUIREMENTS.md v2 list).
- `lenis` smooth-scroll → only if a component genuinely needs unified scroll-driven 3D (none identified); default is to skip it (intercepts native scroll = accessibility surface). Native scroll + motion `useScroll` covers reveals.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **VIS-01** | Hero → signature WebGL scene (R3F), themed via CSS vars, reduced-motion static fallback, capability detection for low-power devices | §Hero Scene Design (Concept A recommended); §Per-Component (LCP/poster strategy); consumes Phase-4 `SceneCanvas`/`ScenePoster`/`useThemeColors`/`useAnimationGate` |
| **VIS-02** | InteractiveGlobe upgraded (WebGL or refined canvas), crisp DPR-correct, theme-reactive, off-screen pause | §Per-Component Upgrade Specs → Globe (recommend refined Canvas-2D + DPR fix + gate + token colors); §Pitfall 1 (DPR bug) |
| **VIS-03** | IdeaNetworkCanvas upgraded: retina DPR coordinate bug fixed, physics polish, theme-reactive, off-screen pause | §Per-Component → IdeaNetworkCanvas (DPR already capped at 2 but `getBoundingClientRect` re-read each frame — physics + token-color spec); §Pitfall 1 |
| **VIS-04** | ScrollReveal + micro-interactions (InteractiveButton, hover, magnetic) re-implemented on motion v12 with restraint | §Per-Component → ScrollReveal/InteractiveButton/MagneticHover (motion-v12 `whileInView`/`variants`/`stagger` specs); §Code Examples |
| **VIS-05** | Navigation upgraded: refined desktop + mobile menu, polished open/close choreography, keyboard accessible, focus-visible | §Per-Component → Navigation (scroll-aware glass spec, `AnimatePresence` mobile menu, keyboard/focus spec) |
| **VIS-06** | ThemeToggle, Footer, FAQ, TeamSection, FundMeWidget, AnimatedIcons elevated to the new design language (all 17 touched) | §Per-Component (one motion-preset/token spec each); FundMeWidget flagged for hardcoded-color de-hack |
| **VIS-07** | Cards + typography across ALL 12 pages conform to tightened tokens | §Typography & Cards Pass (file-by-file at planning altitude) |
| **PERF-02** | All animation loops pause off-screen + on tab blur; mobile DPR caps + capability-appropriate scenes | §Validation Architecture; §Per-Component (every canvas/loop wired to `useAnimationGate`); device-tier heuristic |
| **SHIP-01** | tsc + lint + build + both-theme smoke | §Validation Architecture (gate + bundle re-run + LCP measurement + reduced-motion smoke) |

## Standard Stack

### Already installed by Phase 4 (verify, don't reinstall)

| Library | Version | Purpose | Note |
|---------|---------|---------|------|
| `three` | `^0.184.0` | WebGL renderer + scene graph | Installed Phase 4. `npm view three version` to confirm at execution. |
| `@react-three/fiber` | `^9.6.1` | `<Canvas>`, `useFrame`, `useThree`, `invalidate` | Phase 4. Peer `react >=19 <19.3` — React 19.2.4 fits. |
| `@react-three/drei` | `^10.7.7` | Helpers — Phase 5 finally USES these: `Icosahedron`, `Edges`/`Wireframe`, `Float`, `Points`/`PointMaterial`, `AdaptiveDpr`, `PerformanceMonitor`, `Environment` (optional) | Phase 4 installed but unused; Phase 5 is the consumer. **Named imports only** (tree-shake). |
| `motion` | `^12.40.0` | Declarative animation, `whileInView`, `variants`, `stagger`, `AnimatePresence`, `useReducedMotion`, `useScroll` | Phase 3 installs. Import from `motion/react`. |
| `@types/three` | latest | TS types | Phase 4 (dev). |

### Add this phase (only as features need them)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `maath` | `^0.10.8` | `maath/random` (in-sphere/in-box particle distribution), `maath/easing` (damped lerp for parallax) | Hero particle field + smooth mouse-parallax. Replaces hand-rolled `Math.random()` seeding and manual lerp. Tiny, tree-shakeable. **Recommended.** |
| `@react-three/postprocessing` | `^3.0.4` | `<EffectComposer>` + `<Bloom>` for the icosahedron glow | **Only if** the hero includes bloom. Gate effects OFF under `prefers-reduced-motion`/low-power. Pulls `postprocessing@^6.39`. Adds weight to the (already async) 3D chunk — acceptable since route-split. **Optional — recommend including for the signature glow, gated.** |
| `r3f-perf` | `^7.2.3` | In-canvas FPS/draw-call/GPU HUD | **Dev-only** (`process.env.NODE_ENV !== 'production'`). Use during the Wave-0 hero spike to verify the draw-call/fps budget on a throttled device. Never ships. |

**Do NOT install:** `lenis` (no unified-scroll-3D need identified), `gsap` (redundant with motion + adds a second runtime + license diligence — STACK.md "What NOT to Use").

**Installation (execution-time, after confirming Phase 4 merged the core stack):**
```bash
npm install maath@^0.10.8
npm install @react-three/postprocessing@^3.0.4   # only if hero bloom is included
npm install -D r3f-perf@^7.2.3                    # dev HUD for the budget spike
```

**Version verification before writing plans (training data is stale — confirm against registry):**
```bash
npm view three version @react-three/fiber version @react-three/drei version motion version maath version @react-three/postprocessing version r3f-perf version
```
Phase-4 research live-verified (2026-06-12): three 0.184.0, fiber 9.6.1, drei 10.7.7, motion 12.40.0. `maath`, `@react-three/postprocessing@3.0.4`, `r3f-perf@7.2.3` were registry-listed in STACK.md (HIGH) but re-confirm at execution.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GPU `<points>` shader particle field (one draw call) | drei `<Instances>`/`InstancedMesh` for particles | Instances has documented R3F overhead vs. raw instancedMesh, and is overkill for tiny dots. `<points>` + a `shaderMaterial` (or `<PointMaterial>`) is one draw call and the canonical particle approach. **Recommend `<points>`.** |
| Refined Canvas-2D globe | Full WebGL globe (R3F sphere + arcs) | WebGL globe is a multi-day rewrite (great-circle arcs, drag-rotate, 31 POPs, pulse travel) for a *decorative* element on one page. Refined Canvas-2D (DPR fix + gate + tokens) preserves the exact look at far lower risk. **Recommend refined Canvas-2D**; WebGL is discretionary if budget allows. |
| motion `whileInView` for ScrollReveal | Native CSS scroll-driven animations (`animation-timeline: view()`) | CSS is lighter/compositor-run and accessible-by-default, but the existing `ScrollReveal` has a rich prop API (direction/distance/duration/delay/stagger/threshold) consumed across every page. motion `whileInView` + variants matches that API with minimal call-site churn. **Recommend motion**; CSS optional for the simplest fades. |
| `@react-three/postprocessing` bloom | Hand-written shader bloom pass | Library bloom is GPU-optimized and 5 lines; hand-rolling is slow/error-prone. |

## Hero Scene Design (Research Flag #1 — RESOLVED)

**Brand anchor (read from `Hero3DScene.tsx`):** the current hero is a Canvas-2D scene with (1) a faded dot grid, (2) 8 drifting wireframe triangles/diamonds, (3) 100 pulsing particles with proximity-line connections, (4) a **wireframe icosahedron** (12 verts / 30 edges) rotating on 3 axes with blue→violet depth-gradient edges and glowing vertices, (5) 3 dashed elliptical orbiting rings, (6) a radial cursor glow. Mouse-parallax is a lerped center/rotation shift. **The icosahedron is the brand motif** — keep it recognizable.

The LCP element is the `<h1>` "Usama / Javed" text overlay (`Hero3D.tsx`, z-10 over the z-0 canvas, `min-h-[92vh]`). This stays — the WebGL scene lives behind it via the Phase-4 `ClientScene`/`SceneCanvas`/`ScenePoster` stack at `opacity: var(--canvas-opacity)` (1 dark / 0.6 light, already a token).

### Concept A — "Icosahedron Evolution + Particle Field" ★ RECOMMENDED

A real WebGL wireframe icosahedron (the brand motif, now with true depth and crisp lines) slowly rotating, suspended in a GPU particle field, with subtle camera/group mouse-parallax and an optional gated bloom glow on the edges/vertices.

- **Geometry:** drei `<Icosahedron args={[1.4, 0]} />` with `<Edges>` (or drei `<Wireframe>`) for clean lines; edge color = `--accent-blue`, a second accent (`--accent-violet`) on a faint inner solid or the vertex glow. Optionally `<Float>` for organic drift.
- **Particles:** a single `<points>` with a BufferGeometry seeded by `maath/random.inSphere` (2,000–3,000 points) + a `shaderMaterial`/`<PointMaterial>` (additive blend, size attenuation, `--accent-*` tint). Animate via a single `uTime` uniform in the vertex shader (NO per-frame CPU attribute writes) → **one draw call, animation on the GPU.**
- **Parallax:** lerp the camera or the root `<group>` rotation toward normalized mouse (reuse the existing mouse ref from `Hero3D.tsx`; smooth with `maath/easing.damp`). No DOM reads per frame.
- **Bloom (optional, gated):** `<EffectComposer><Bloom mipmapBlur intensity={...} /></EffectComposer>`, disabled under reduced-motion/low-power.
- **Budget:** draw calls — icosahedron edges (~1) + optional fill (1) + particle points (1) + bloom passes (~2–3) = **< 10**, far under the < 100 mobile-60fps threshold. DPR `[1,2]`. Triangle count trivial (icosahedron = 20 faces). The cost center is fragment overdraw from additive particles + bloom — keep particle size small and bloom intensity modest; profile on a throttled device.
- **LCP/CLS:** `ScenePoster` (CSS gradient using `--bg-secondary`→`--bg-primary` + a faint accent, sized to the exact `min-h-[92vh]` container) paints first and is the LCP-adjacent backdrop; the `<h1>` text is the actual LCP element and renders immediately (it's not inside the canvas). Scene fades in on top. Zero layout shift because the container height is reserved by the existing layout.
- **Why recommended:** maximal brand continuity (same icosahedron motif), genuine WebGL leap (real depth, GPU particles, optional bloom), comfortably within budget, and it directly validates the entire Phase-4 boundary (theme bridge, gate, poster, context-loss) on the most-visited route.

### Concept B — "Code ⇆ Neural-Network Morphing Particle Field"

A single GPU particle field that morphs between two point clouds: a code/bracket/grid motif and a neural-network/node-graph motif, cycling slowly, tinted by theme accents.

- **Geometry:** two target position buffers; vertex shader lerps between them on a `uMorph` uniform (eased). One `<points>`, one draw call, thousands of particles cheap.
- **Pros:** literally encodes "full-stack + AI engineer" (code ⇆ neural net) — strong narrative fit; very performant (pure GPU).
- **Cons:** **abandons the icosahedron brand motif** → reads closer to a rebrand than an evolution (the orchestrator explicitly flags this risk). Higher shader-authoring complexity (morph targets, easing, two well-formed point clouds). Recommend only if the owner explicitly wants a thematic departure.
- **Budget:** ~1 draw call for particles; same overdraw caveat. < 10 total.

### Concept C — "Icosahedron + Orbiting Geometric Constellation" (literal 1:1 port)

A near-literal WebGL re-creation of today's scene: WebGL icosahedron + WebGL floating triangles/diamonds + WebGL proximity-line particles + WebGL dashed orbit rings.

- **Pros:** highest fidelity to the current look (lowest "did it change?" risk).
- **Cons:** the proximity-line network (O(n²) per frame) and dashed rings are *more* work to do well in WebGL than they're worth, and several elements (dot grid, dashed rings) gain little from WebGL. Highest effort for the least incremental "wow." Effectively Concept A plus low-value extras.
- **Verdict:** Concept A is C minus the low-value clutter plus a proper GPU particle field — strictly better.

**RECOMMENDATION: Concept A.** It is the evolution the orchestrator describes — the icosahedron persists as an upgrade, not a replacement — and it is the lowest-risk path to a genuine WebGL signature within the mobile budget.

## Architecture Patterns

### Recommended file structure (additive + in-place edits)

```
src/
├── components/three/                 # Phase-4 boundary (exists) — Phase 5 ADDS scenes
│   ├── SceneCanvas.tsx               #   (Phase 4) provider — reuse as-is
│   ├── ClientScene.tsx               #   (Phase 4) ssr:false wrapper — reuse/parameterize
│   ├── ScenePoster.tsx               #   (Phase 4) — extend with a hero-specific poster variant
│   ├── HeroScene.tsx                 #   NEW — the icosahedron+particles scene graph (Concept A)
│   ├── HeroParticles.tsx             #   NEW — <points> + shaderMaterial particle field
│   └── (optional) HeroEffects.tsx    #   NEW — gated <Bloom> composer
├── components/                       # existing 17 — EDITED IN PLACE (identity preserved)
│   ├── Hero3D.tsx                    #   swap dynamic(Hero3DScene) → ClientScene(HeroScene); keep text overlay
│   ├── Hero3DScene.tsx               #   KEEP as reduced-motion/no-WebGL Canvas-2D fallback OR retire into poster
│   ├── InteractiveGlobe.tsx          #   DPR fix + useAnimationGate + token colors (refined Canvas-2D)
│   ├── IdeaNetworkCanvas.tsx         #   DPR verify + physics polish + token colors + gate
│   ├── ScrollReveal.tsx              #   rewrite internals on motion v12 (KEEP prop API + named exports)
│   ├── InteractiveButton.tsx         #   magnetic/glow on motion v12 (KEEP variant/size API)
│   ├── Navigation.tsx                #   scroll-aware glass + AnimatePresence mobile menu + focus-visible
│   ├── ThemeToggle.tsx               #   motion-smoothed knob (KEEP localStorage/data-theme logic)
│   ├── Footer / FAQ / TeamSection / AnimatedIcons / FundMeWidget  # token + motion-preset pass
└── (pages)                          # 12 routes — card/typography token conformance (VIS-07)
```

### Pattern 1: Mount the hero scene through the Phase-4 boundary (VIS-01, PERF-02)
**What:** `Hero3D.tsx` keeps its text overlay (LCP) and swaps the canvas layer from `dynamic(() => import('./Hero3DScene'))` to the Phase-4 `ClientScene` rendering `HeroScene`. `ClientScene` already provides `ssr:false` + `IslandBoundary` + `ScenePoster`. The scene consumes `useAnimationGate` (frameloop) and `useThemeColors` (material colors) inside the Canvas.
**When:** the homepage hero, and any other route that gains a scene.
**Why:** zero new boundary code; the hard problems (SSR-safety, gating, theming, error fallback, poster) are Phase-4 deliverables.

### Pattern 2: GPU particle field = one draw call (perf-critical)
**What:** particles are a single `<points>` with a static position buffer; motion comes from a `uTime` uniform in the vertex shader, never from rewriting the position attribute on the CPU.
**Why:** R3F authorities are explicit — CPU-side per-frame attribute updates are "pretty expensive"; delegating to the shader scales to 1M particles on desktop and keeps mid-tier mobile smooth. Count is essentially free; **draw calls** (keep < 100; this scene < 10) and **overdraw** are the real budget.
**Anti-pattern:** looping over particles in `useFrame` and mutating `positions[i]` each frame (what the current Canvas-2D hero does) — do NOT port that pattern into WebGL.

### Pattern 3: motion v12 reveal/stagger via variants + whileInView (VIS-04)
**What:** Replace the IntersectionObserver-in-`useEffect` of `ScrollReveal` with motion's `whileInView` + `viewport={{ once, amount }}` and parent/child `variants` for stagger.
```tsx
// motion v12 — import from 'motion/react'
import { motion, useReducedMotion } from 'motion/react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
// reduced-motion: skip transforms, render final state
```
**Why:** matches the existing prop surface (direction/distance/duration/delay/stagger) and the signature easing `[0.16,1,0.3,1]`; `viewport={{ once: true }}` preserves the existing `once` semantics and is the documented perf default. Use `useReducedMotion()` to short-circuit to the static end-state (parity with the current `prefers-reduced-motion` early-return).

### Pattern 4: AnimatePresence for the mobile menu (VIS-05)
**What:** wrap the conditional mobile-menu block (`Navigation.tsx`) in `<AnimatePresence>` so it animates open AND close (today it just mounts/unmounts with no exit). Keep the existing `isMobileMenuOpen` state and nav-item data.
**Accessibility additions (VIS-05 + PERF-03 floor):** `aria-expanded` on the toggle, `aria-controls` → menu id, focus-visible rings on every link/button, Escape-to-close, focus trap while open, and `inert`/`aria-hidden` on background when open. These are NET-NEW (current nav has none) and required by the success criterion.

### Pattern 5: Theme-reactive Canvas-2D (Globe / IdeaNetwork — VIS-02/VIS-03)
**What:** the two retained Canvas-2D components currently hardcode RGBA literals (e.g. `rgba(96,165,250,...)` = `--accent-blue`-dark, `rgba(139,92,246,...)`, amber sparks). Read the resolved tokens once via `useThemeColors` (or `getComputedStyle` on mount + a `data-theme` `MutationObserver`) and interpolate alpha into those instead of literals, so both themes look correct. Wire the rAF loop to `useAnimationGate` (pause off-screen + tab-blur + reduced-motion).
**Why:** today these only look right in dark mode and run forever (battery/perf). This is the VIS-02/03 + PERF-02 fix without a WebGL rewrite.

### Anti-Patterns to avoid
- Replacing the icosahedron motif wholesale → reads as rebrand (use Concept A evolution).
- Porting the CPU per-frame particle loop into WebGL → kills the GPU advantage (use Pattern 2).
- Hardcoded hex/RGBA in any upgraded component or material → breaks the theme toggle (use tokens / `useThemeColors`).
- Re-implementing reduced-motion/in-view/tab-blur per component → use `useAnimationGate`.
- Namespace-importing drei (`import * as drei`) → defeats tree-shaking, bloats the chunk. Named imports only.
- Mobile menu that mounts/unmounts with no exit animation → use `AnimatePresence`.
- Letting `<canvas>` become the LCP element → keep the text overlay + poster as LCP; scene fades in behind.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reduced-motion + off-screen + tab-blur gating | New IntersectionObserver/matchMedia/visibilitychange per component | Phase-3 `useAnimationGate(ref)` → `frameloop` / loop guard | Already solved; reinventing risks inconsistent thresholds (PERF-02) |
| CSS-var → color for WebGL/canvas | Custom MutationObserver per scene | Phase-3 `useThemeColors([...])` | Cached, SSR-safe, observes `data-theme` once |
| Canvas error fallback | try/catch around render (can't catch render errors) | Phase-3 `<IslandBoundary fallback={<ScenePoster/>}>` | React render errors need the class boundary |
| Particle distribution + easing math | Hand-rolled `Math.random()` seeding + manual lerp | `maath/random` + `maath/easing` | Correct in-sphere distribution + framerate-independent damping |
| Bloom/glow | Hand-written shader passes | `@react-three/postprocessing` `<Bloom>` | GPU-optimized, 5 lines, gateable |
| Reveal/stagger orchestration | Per-component IntersectionObserver state machines | motion v12 `whileInView` + `variants` + `stagger` | One declarative API; `viewport.once` perf default; matches existing prop surface |
| Mobile-menu open/close | Manual mount/unmount + ad-hoc transitions | motion `<AnimatePresence>` | Animates exit too; standard pattern |
| Scene render loop / resize / DPR / disposal | `new THREE.WebGLRenderer()` + manual rAF | R3F `<Canvas>` (via Phase-4 `SceneCanvas`) | R3F handles resize/DPR/disposal/frameloop correctly |

**Key insight:** Phase 5's "hard" sub-problems (gating, theming, error fallback, the canvas boundary) are already Phase-3/4 deliverables. The failure mode is re-implementing them per component instead of consuming them. New code is *scene content* (HeroScene/particles) and *motion choreography*, not infrastructure.

## Per-Component Upgrade Specs (grounded in what exists TODAY)

> Inventory read directly from source. Each spec preserves identity and raises fidelity. "Gate" = wire to `useAnimationGate`. "Tokenize" = replace hardcoded colors with `--*` tokens / `useThemeColors`.

| Component | What it does TODAY (identity to preserve) | Upgrade spec (raise fidelity) | Req |
|-----------|-------------------------------------------|-------------------------------|-----|
| **Hero3DScene** | Canvas-2D icosahedron + 100 particles + 8 floating shapes + dashed rings + cursor glow + lerped mouse-parallax | Replace the *canvas layer* with `HeroScene` (Concept A: WebGL icosahedron + GPU particle field) via `ClientScene`. Keep `Hero3D.tsx` text overlay verbatim. Retain a static/reduced fallback (poster). | VIS-01 |
| **InteractiveGlobe** | Canvas-2D wireframe globe, 31 pulsing POPs, 15 great-circle arcs w/ travelling pulse, drag-rotate, auto-rotate, ResizeObserver | **DPR fix** (Pitfall 1: `ctx.scale(dpr,dpr)` re-applied on every `dimensions`/`getRadius` effect run → compounding scale). Tokenize the hardcoded blue/violet RGBA via `useThemeColors`. Gate the rAF. Keep all geometry/interaction. | VIS-02, PERF-02 |
| **IdeaNetworkCanvas** | Canvas-2D 60-node network (6 idea + ~54 node + 20 spark), mouse attraction, spark orbit, dynamic connections, DPR capped at 2 | DPR is capped at 2 (good) but re-reads `getBoundingClientRect()` every frame — cache it; physics polish (damping/influence tuning). Tokenize violet/blue/amber. Gate the rAF. | VIS-03, PERF-02 |
| **ScrollReveal** (+ StaggerReveal, AnimatedCounter, MagneticHover, TextReveal, ParallaxSection) | IntersectionObserver + inline opacity/transform; signature easing; reduced-motion early-return; rich prop API; used on nearly every section | Rewrite internals on motion v12 (`whileInView`/`variants`/`stagger`); **keep the exact prop surface + named exports** so call sites don't churn. `useReducedMotion()` → static end-state. AnimatedCounter: keep rAF count-up (fine) but gate it. ParallaxSection: keep subtle, gate. | VIS-04 |
| **InteractiveButton** | Polymorphic a/button, 3 variants from tokens, click ripple (styled-jsx), hover cursor-glow + 1px lift | Re-implement hover/lift/glow on motion (`whileHover`/`whileTap`) with restraint; keep ripple or replace with a motion tap-scale. **Keep variant/size/href API + token styling.** Add focus-visible ring (a11y floor). | VIS-04 |
| **MagneticHover** | mousemove translate toward cursor, springs back | Re-implement with motion springs (`useSpring`); cap strength (restraint); desktop-only (skip on touch / reduced-motion). | VIS-04 |
| **Navigation** | Fixed nav, scroll-aware bg/blur/border (>20px), mobile menu (mount/unmount, no exit), per-link hover underline via direct DOM mutation, active-page detection, ThemeToggle + Hire-Me CTA | Keep scroll-aware glass (already good); refine via motion. **Replace per-link DOM-mutation underline** with a motion layout/`variants` underline. **`AnimatePresence` mobile menu** with open/close choreography. Add `aria-expanded`/`aria-controls`/focus-visible/Escape/focus-trap (NET-NEW, required). | VIS-05, PERF-03 |
| **ThemeToggle** | CSS-transition knob slide, sun/moon cross-fade, `mounted` guard, localStorage + `data-theme` | Smooth the knob/icon swap via motion (spring); keep ALL localStorage/`data-theme` logic verbatim. Optionally pair with a View-Transition-friendly toggle — but VT itself is Phase 6, so just make the toggle animation clean here. Add focus-visible. | VIS-06 |
| **Footer** | 4-col grid, ScrollReveal-wrapped, token colors, hover translate-x | Light touch: inherits the ScrollReveal upgrade automatically; verify token conformance + hover-elevation consistency. | VIS-06, VIS-07 |
| **FAQ** | Accordion (max-height transition), category filter, ScrollReveal, FAQPage JSON-LD, token colors | Accordion height animation via motion (`AnimatePresence` + `height:auto` or layout) for smoother expand; **preserve the JSON-LD block verbatim** (SEO). Keep category filter. Tokenize any residual literals. | VIS-06, VIS-07 |
| **TeamSection** | Auto-cycling featured member, hover-to-pin, grayscale→color photo, progress dots, token colors, `--accent-blue` | Smooth member cross-fade + dot transitions via motion; keep auto-cycle + hover-pin logic. Tokenize. Add `next/image` consideration for the photos (CLS/LCP) — optional. | VIS-06, VIS-07 |
| **AnimatedIcons** | 12 morph icons via injected CSS keyframe cross-fade between two SVG groups (no JS loop); only fund-me uses 3 | Keep the keyframe-cross-fade approach (it's already efficient and gate-free since CSS); ensure it respects reduced-motion (add `@media` guard if missing). Tokenize stroke colors to `currentColor`/tokens. Low-effort elevation. | VIS-06 |
| **FundMeWidget** | Floating 💖 button, pulse-ring/glow, expand panel, **hardcoded pink/purple/blue gradients + slate-900**, imperative DOM overlay heart-rain on click, emoji sparkles | **De-hack toward tokens/restraint** while preserving the fund-me feature: the hardcoded `slate-900/95`, `pink/purple/blue` gradients, and `border-pink-500` don't respect the theme. Replace with token-driven accent treatment; tame the always-on `animate-ping`/`animate-pulse`/`animate-bounce`/`spin` (gate / reduced-motion). Keep the navigation-to-`/fund-me` behavior. This is the least token-conformant component — biggest single VIS-06/07 win. | VIS-06, VIS-07 |

## Typography & Cards Pass (VIS-07 — file-by-file at planning altitude)

**What "conform to tokens" means concretely** (Phase 3 tightens the type scale, spacing scale, and both-theme color tokens in `globals.css`; Phase 5 applies them):

- **Headings:** every page H1/H2/H3 uses `font-[family-name:var(--font-space-grotesk)]` (already the convention) at the tightened type-scale steps, with `--text-primary`/`--text-secondary` for the two-tone heading pattern already in use (e.g. FAQ "Common / questions.", Team "Featured / people."). Standardize the scale so pages don't drift (`text-4xl sm:text-5xl` for section heads, the hero's `text-6xl…text-9xl` clamp preserved).
- **Card surface treatment:** standardize on `background: var(--bg-card)`, `border: 1px solid var(--border-subtle)`, `box-shadow: var(--shadow-card)` (none in dark, soft in light — already tokenized), `rounded-xl`/`rounded-2xl`. Replace any page-local hardcoded `bg-white/[0.0x]`, `border-white/[0.1]` glass literals with the tokens so light theme is correct.
- **Hover elevation:** a single consistent lift — `translateY(-1px..-2px)` + `border-hover` + `bg-card-hover` (tokens already exist) — applied uniformly to interactive cards. Today some cards use `hover:translate-x-0.5`, some none; unify.

**The 12 routes (ARCHITECTURE route map) and what each needs:**

| Route | File | Card/Type work |
|-------|------|----------------|
| `/` | `src/app/page.tsx` (client) | Project grid cards + skills + stats → token cards, unified hover, type scale; inherits ScrollReveal upgrade |
| `/projects/[id]` | `projects/[id]/page.tsx` (server) | Detail typography + any cards → tokens (SEO-sensitive — don't touch metadata/JSON-LD) |
| `/expertise` | `expertise/page.tsx` (server) | `technicalExpertise` cards + certs → token cards (no % bars per anti-features); preserve expertise JSON-LD |
| `/services` | `services/page.tsx` (server) | Service catalog cards → tokens |
| `/blog`, `/blog/*` | `blog/*` (server) | Article/list cards + prose type scale → tokens; preserve Blog JSON-LD |
| `/budget` | `budget/page.tsx` (client) | Calculator UI cards/inputs → tokens |
| `/team` | `team/page.tsx` (client) | Team cards (mirrors TeamSection) → tokens |
| `/tech-stack` | `tech-stack/page.tsx` (server) | `techStack`/`features` cards → tokens |
| `/ideas` | `ideas/page.tsx` (client) | Form + cards over IdeaNetworkCanvas → tokens; ensure canvas gate |
| `/contact` | `contact/page.tsx` (client) | Form fields/cards → tokens |
| `/developer-australia` | `developer-australia/page.tsx` (server) | SEO landing cards/type → tokens |
| `/fund-me` | `fund-me/page.tsx` (client) | Donation cards + Globe + AnimatedIcons → tokens; ensure Globe gate/DPR/theme |

> **SEO guard:** server pages carry metadata/JSON-LD — Phase 5 is *visual only* on these; never alter metadata, JSON-LD, slugs, or copy (SEO-01 is locked/complete). Touch className/style/token surfaces only.

## Mobile Performance Budget (Research Flag #4 — concrete numbers)

| Metric | Budget | Basis |
|--------|--------|-------|
| **Home-route initial JS (no three)** | Unchanged vs. pre-phase baseline; `three`/R3F/drei/postprocessing **absent** from the initial/shared chunk | PERF-01 (Phase 4 gate) — re-run the bundle script; the 3D chunk is async-only |
| **Three.js async chunk (gzipped)** | ~**150–170 KB gz** for fiber+drei+three (+ ~30–50 KB if postprocessing/bloom included) | STACK.md ("three.js + R3F ~150kb+ gzipped"); acceptable because route-split + lazy + behind the poster |
| **Hero draw calls** | **< 30** (Concept A: ~<10) | R3F authority: < 100 draw calls → 60fps on most devices; > 500 struggles |
| **Hero particle count** | **2,000–3,000** as ONE `<points>` draw call (shader-animated) | maximeheckel/R3F: single Points draw call; 2,000 is conservative-comfortable, count is GPU-cheap, overdraw is the limiter |
| **DPR** | clamped `[1, 2]` (Phase-4 `SceneCanvas` already enforces) | uncapped DPR melts phones (Phase-4 Pitfall) |
| **LCP (mid-tier mobile)** | **≤ 2.5s** — LCP element = hero `<h1>` text / poster, never `<canvas>` | VIS-01/PERF-01; poster paints instantly, scene fades in on top |
| **CLS** | **0** — poster/canvas containers reserve exact dimensions (`min-h-[92vh]`) | VIS-01 zero-CLS |
| **All rAF/useFrame loops** | pause off-screen + on tab-blur + under reduced-motion | PERF-02 via `useAnimationGate` |

**Device-tier heuristic (when to serve static poster instead of scene):** drive off the Phase-3 `useAnimationGate` signals + a capability probe:
1. `prefers-reduced-motion: reduce` → **static poster**, no scene (hard rule).
2. WebGL unavailable / context lost (Phase-4 `webgl.ts` + context-loss handler) → **static poster**.
3. Low-power signal → reduced scene or poster. Practical signals: `navigator.hardwareConcurrency <= 4` and/or `navigator.deviceMemory <= 4` (where supported) → drop particle count to the low band (or poster) and disable bloom. Optionally use drei `<PerformanceMonitor>` / `<AdaptiveDpr>` to auto-degrade if fps sags. (`deviceMemory`/`hardwareConcurrency` are heuristics, not guarantees — MEDIUM confidence; treat as a downgrade hint, not a hard gate.)
4. Off-screen / tab-blurred → `frameloop` paused (no render), regardless of tier.

## Sequencing (Research Flag #5 — wave grouping with file-disjoint ownership)

Hero FIRST (validates the Phase-4 infra end-to-end on the highest-leverage, highest-CWV-risk surface); then independent component groups run as parallel, file-disjoint waves; token/typography pass and the verification gate last.

| Wave | Scope | Files (disjoint) | Why grouped / parallel-safe |
|------|-------|------------------|------------------------------|
| **Wave 0** | Spike + setup | `r3f-perf` dev install; throwaway hero-spike route or Storybook-less local test; profile draw-calls/fps on a throttled device; tune particle count + decide bloom; confirm Phase-3/4 primitives exist (`ls src/hooks/ src/components/three/`); re-baseline bundle | De-risks the budget before committing the hero; no production edits |
| **Wave 1** | **Signature hero (FIRST)** | `components/three/HeroScene.tsx`, `HeroParticles.tsx`, (opt) `HeroEffects.tsx`, `ScenePoster.tsx` (hero variant); edit `Hero3D.tsx` (swap canvas layer, keep overlay) | Validates SceneCanvas/poster/gate/theme bridge/context-loss on `/`. Blocks nothing else's files except `Hero3D`/`Hero3DScene`. **Gate: LCP ≤ 2.5s, CLS 0, both-theme, bundle clean — before proceeding.** |
| **Wave 2a** | Canvas upgrades | `InteractiveGlobe.tsx`, `IdeaNetworkCanvas.tsx` | Both Canvas-2D DPR/gate/token fixes; independent files; no overlap with motion rewrite |
| **Wave 2b** | Motion primitives | `ScrollReveal.tsx`, `InteractiveButton.tsx` (MagneticHover lives in ScrollReveal.tsx) | Shared "motion v12 rewrite" theme; **these are consumed widely** — land them before the pages that use them re-verify. Keep prop APIs stable to avoid call-site churn. |
| **Wave 2c** | Navigation + ThemeToggle | `Navigation.tsx`, `ThemeToggle.tsx` | Nav imports ThemeToggle + InteractiveButton — sequence *after* 2b (InteractiveButton) or coordinate; otherwise file-disjoint |
| **Wave 3** | Remaining components | `Footer.tsx`, `FAQ.tsx`, `TeamSection.tsx`, `AnimatedIcons.tsx`, `FundMeWidget.tsx` | Independent files; each a self-contained token+motion-preset pass; fully parallel. FundMeWidget is the biggest token de-hack. |
| **Wave 4** | Typography/cards token pass | 12 page files (`src/app/**/page.tsx`) | Visual-only token conformance; depends on Waves 2b/3 primitives being final. Parallelizable by route (each `page.tsx` disjoint). **SEO guard on server pages.** |
| **Wave 5** | SHIP-01 gate | none (verification) | tsc + lint + build + bundle re-run + both-theme + reduced-motion + LCP smoke + hard-refresh |

**Dependency notes:** `ScrollReveal`/`InteractiveButton` (2b) are imported across pages, Footer, FAQ, TeamSection, Navigation — finalize their APIs early so downstream waves verify against stable primitives. Navigation (2c) imports ThemeToggle + InteractiveButton. The 12-page token pass (Wave 4) should follow the component waves so pages conform to finished components.

## Common Pitfalls

### Pitfall 1: The retina DPR coordinate bug (VIS-02/VIS-03 — the named bug)
**What goes wrong:** `InteractiveGlobe` calls `ctx.scale(dpr, dpr)` inside the render-loop effect, which re-runs whenever `dimensions`/`getRadius` change. Each re-run sets `canvas.width` (which resets the transform) then re-applies `scale` — but if any path re-applies `scale` without resetting the transform first, scale compounds; on devices with DPR > 1 the drawing is mis-scaled/offset. `IdeaNetworkCanvas` correctly caps DPR at 2 and re-scales in `resize()`, but it re-reads `getBoundingClientRect()` every frame (jank) and also relies on `ctx.scale` after `canvas.width` resets.
**How to avoid:** Use the canonical pattern — set `canvas.width/height = cssSize * dpr` AND `ctx.setTransform(dpr,0,0,dpr,0,0)` together (setTransform, not scale, avoids accumulation); the Canvas-2D hero (`Hero3DScene.tsx`) already does this correctly (`ctx.setTransform`). Cache CSS size; don't `getBoundingClientRect()` per frame. Verify crisp rendering on a DPR-2 device/emulation in both themes.
**Warning signs:** blurry or offset globe/network on retina/mobile; lines doubling; coordinates drifting after resize.

### Pitfall 2: Canvas becomes the LCP element → LCP > 2.5s
**What goes wrong:** deferring the scene with no instant backdrop leaves nothing to paint until WebGL is ready.
**How to avoid:** the hero `<h1>` text overlay (already z-10, not in the canvas) is the LCP element; `ScenePoster` is an instantly-painted backdrop sized to the exact container; the scene fades in on top. Verify Lighthouse names the text/poster as LCP, not `<canvas>`.

### Pitfall 3: Scene/component looks right in dark, broken in light
**What goes wrong:** colors hardcoded during dark-mode dev (the current Globe/IdeaNetwork/FundMeWidget all do this).
**How to avoid:** all scene/canvas colors via `useThemeColors`; all component colors via `--*` tokens. Toggle `data-theme` in smoke — every upgraded surface must visibly adapt (e.g. icosahedron edge dark `#60a5fa` → light `#3b82f6`).

### Pitfall 4: CPU-side per-frame particle updates ported into WebGL
**What goes wrong:** copying the Canvas-2D pattern (loop + mutate positions each frame) into R3F → CPU bottleneck, defeats WebGL.
**How to avoid:** animate particles via a `uTime` uniform in the shader; positions buffer is static (Pattern 2).

### Pitfall 5: `next build` green while a component is visually broken
**What goes wrong:** `ignoreBuildErrors`/`ignoreDuringBuilds` → green build proves nothing.
**How to avoid:** `npx tsc --noEmit` + `npm run lint` explicitly; hard-refresh (not client-nav) every upgraded route; both-theme + reduced-motion smoke; re-run the bundle gate.

### Pitfall 6: Animation loops that never pause (PERF-02)
**What goes wrong:** Globe/IdeaNetwork rAF loops currently run forever (no off-screen/tab-blur pause) — battery/perf cost, especially mobile.
**How to avoid:** wire every rAF/`useFrame` to `useAnimationGate` (off-screen via IntersectionObserver + tab-blur via `visibilitychange` + reduced-motion). Verify in DevTools Performance: scroll away → loop stops; switch tab → stops.

### Pitfall 7: Drei namespace import bloats the async chunk
**How to avoid:** `import { Icosahedron, Edges, Points, PointMaterial, Float } from '@react-three/drei'` — never `import * as drei`.

## Code Examples

### Hero scene graph (Concept A) — consumes Phase-4 boundary
```tsx
// src/components/three/HeroScene.tsx  ('use client')
'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Edges, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeColors } from '@/hooks/useThemeColors'; // Phase 3
import HeroParticles from './HeroParticles';

export default function HeroScene({ paused }: { paused: boolean }) {
  const group = useRef<THREE.Group>(null);
  const t = useThemeColors(['--accent-blue', '--accent-violet']);
  const edge = t['--accent-blue'] || '#60a5fa';

  useFrame((_, delta) => {
    if (paused || !group.current) return;
    group.current.rotation.y += delta * 0.15; // slow, intentional
  });

  return (
    <group ref={group}>
      <Float speed={1} rotationIntensity={0.4} floatIntensity={0.6} enabled={!paused}>
        <Icosahedron args={[1.4, 0]}>
          <meshBasicMaterial transparent opacity={0.04} color={t['--accent-violet'] || '#a78bfa'} />
          <Edges color={edge} />
        </Icosahedron>
      </Float>
      <HeroParticles count={2400} paused={paused} />
    </group>
  );
}
```

### GPU particle field — one draw call, shader-animated
```tsx
// src/components/three/HeroParticles.tsx  ('use client')
'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { inSphere } from 'maath/random'; // correct in-sphere distribution
import * as THREE from 'three';

export default function HeroParticles({ count = 2400, paused = false }: { count?: number; paused?: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(
    () => inSphere(new Float32Array(count * 3), { radius: 3 }) as Float32Array,
    [count]
  );
  // animate the whole field via rotation (cheap) — NOT per-point CPU writes
  useFrame((_, delta) => {
    if (paused || !ref.current) return;
    ref.current.rotation.y += delta * 0.02;
  });
  return (
    <Points ref={ref} positions={positions} frustumCulled>
      <PointMaterial transparent size={0.012} sizeAttenuation depthWrite={false} color="#60a5fa" />
    </Points>
  );
}
```
> For richer motion, replace `<PointMaterial>` with a `shaderMaterial` driving point displacement from a `uTime` uniform — still one draw call. Color should be bridged via `useThemeColors` like the icosahedron edge.

### motion v12 reveal (ScrollReveal internals) — keep the existing prop API
```tsx
// inside the rewritten ScrollReveal — import from 'motion/react'
import { motion, useReducedMotion } from 'motion/react';

export default function ScrollReveal({ children, direction = 'up', distance = 40, duration = 700, delay = 0, once = true, threshold = 0.1, className = '' }: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const offset = { up: { y: distance }, down: { y: -distance }, left: { x: distance }, right: { x: -distance }, none: {} }[direction];
  if (reduce) return <div className={className}>{children}</div>; // static end-state
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{ duration: duration / 1000, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

## State of the Art

| Old (current repo) | Current (Phase 5 target) | Impact |
|--------------------|--------------------------|--------|
| Canvas-2D icosahedron + CPU particles | WebGL icosahedron (drei `<Edges>`) + GPU `<points>` field (1 draw call) | Real depth, crisp lines, GPU-cheap particles; signature WebGL moment |
| IntersectionObserver-in-useEffect reveals | motion v12 `whileInView` + `variants` + `stagger` | Declarative orchestration; `viewport.once` perf default; less per-component code |
| rAF loops run forever; dark-only colors | `useAnimationGate` + `useThemeColors` everywhere | Off-screen/tab-blur/reduced-motion pause; both themes correct |
| Mobile menu mounts/unmounts (no exit) | `AnimatePresence` + a11y (aria-expanded, focus-trap, Esc) | Polished choreography + keyboard accessibility |
| Per-link underline via direct DOM mutation | motion variants underline | No imperative DOM hacks |
| FundMeWidget hardcoded pink/purple/slate + always-on ping/pulse/spin | Token-driven + gated motion | Theme-correct, restrained |

**Deprecated/outdated:** R3F v8/drei v9 (React-18 — do NOT install). `framer-motion` import path → `motion/react`. `@studio-freight/lenis` → `lenis` (not needed this phase). Hardcoded RGBA color literals in canvases → `useThemeColors`.

## Open Questions

1. **Exact particle count + whether to ship bloom — needs a Wave-0 device spike.**
   - Known: count is GPU-cheap (one draw call); overdraw + bloom are the limiters; budget band 2,000–3,000.
   - Unclear: the mid-tier-mobile fps headroom with additive particles + bloom on.
   - Recommendation: Wave-0 `r3f-perf` spike on a throttled device; pick the count and the bloom-on/off decision from measured fps, not theory. (MEDIUM confidence on the exact number; HIGH on the approach.)

2. **Globe: refined Canvas-2D vs. full WebGL — confirm with owner appetite.**
   - Known: Canvas-2D + DPR fix + gate + tokens satisfies VIS-02 at low risk and preserves the exact look; WebGL is a larger rewrite for marginal gain on a decorative element.
   - Recommendation: **refined Canvas-2D** unless the owner explicitly wants WebGL parity with the hero. (MEDIUM — a judgment call.)

3. **Does Phase 3/4 expose the exact `useAnimationGate` signal shape Phase 5 assumes** (`{ shouldAnimate, prefersReduced }` + a ref API, plus a tab-blur signal)?
   - Recommendation: Wave-0 task to read the actual Phase-3/4 hook signatures (`src/hooks/useAnimationGate.ts`, `useThemeColors.ts`) and align the scene/component code to them — don't assume the shape sketched here.

4. **`navigator.deviceMemory`/`hardwareConcurrency` availability for the low-power heuristic.**
   - Known: `deviceMemory` is not universally supported (notably Safari); `hardwareConcurrency` is broad.
   - Recommendation: treat both as optional downgrade *hints*; the hard gates are reduced-motion + WebGL-availability + drei `<PerformanceMonitor>` runtime fps. (LOW-MEDIUM.)

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `three` / `@react-three/fiber` / `@react-three/drei` | Hero scene (VIS-01) | Phase 4 (verify) | 0.184 / 9.6.1 / 10.7.7 | none — installed by Phase 4 |
| `motion` | VIS-04/05/06 | Phase 3 (verify) | 12.40.0 | none |
| `maath` | particle distribution + easing | Installable | ^0.10.8 | hand-rolled (worse) |
| `@react-three/postprocessing` | hero bloom (optional) | Installable | ^3.0.4 | skip bloom |
| `r3f-perf` | dev budget spike | Installable (dev) | ^7.2.3 | manual DevTools FPS |
| Phase-3 hooks (`useAnimationGate`, `useThemeColors`) + `IslandBoundary` | gating + theming + error fallback | **Must exist (Phase 3 merged)** | — | BLOCK if absent — do not re-author |
| Phase-4 `SceneCanvas`/`ClientScene`/`ScenePoster`/`webgl.ts` + bundle gate | hero mount + poster + bundle proof | **Must exist (Phase 4 merged)** | — | BLOCK if absent |
| Lighthouse CLI (LCP measurement) | PERF/VIS verification | **Probe at execution** (`npx lighthouse --version` / `lighthouse` global) | — | Chrome DevTools Lighthouse panel (manual) or WebPageTest; see §Validation |
| WebGL (runtime, end-user) | scene render | device-dependent | — | `ScenePoster` static fallback |
| Node / npm | install + build + scripts | ✓ (Node v22 local) | — | — |

**Missing dependencies with no fallback:** none at the library level. **Hard prerequisite:** Phase 3 + Phase 4 must be merged (their primitives are consumed, not re-created) — Wave-0 must verify (`ls`) and BLOCK if absent.
**Missing with fallback:** Lighthouse CLI → DevTools Lighthouse panel (manual LCP read); bloom → skip if perf budget tight.

## Validation Architecture

> `.planning/config.json` → `workflow.nyquist_validation: true` → this section is REQUIRED.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | **None** — repo has no test framework/files/script (STACK.md; vitest+Playwright are deferred to a later milestone, REQUIREMENTS.md V2-04). |
| Config file | none — see Wave 0 |
| Quick run command | `npx tsc --noEmit` (de-facto fast gate; only sub-30s automated check available) |
| Full suite command | `npx tsc --noEmit && npm run lint && npm run build && node scripts/check-bundle.mjs` (Phase-4 bundle script) + manual both-theme / reduced-motion / LCP smoke |

> Building a test framework is OUT of scope (V2-04). Validation = type/lint/build + the Phase-4 bundle assertion + a scripted/manual LCP read + structured manual smoke. This is honest about the repo's reality.

### Phase Requirements → Verification Map
| Req | Behavior | Verification type | Command / method |
|-----|----------|-------------------|------------------|
| VIS-01 | Hero is WebGL, themed, reduced-motion + low-power fallback, LCP ≤ 2.5s, CLS 0 | manual + scripted | Lighthouse (mobile preset) on `/` → LCP element = text/poster, LCP ≤ 2.5s, CLS ≤ 0.1; toggle theme → icosahedron edge color changes; emulate reduced-motion → static poster; disable WebGL → poster |
| VIS-02 | Globe crisp/DPR-correct, theme-reactive, off-screen pause | manual | DPR-2 emulation both themes → crisp; scroll off-screen → rAF stops (DevTools Performance) |
| VIS-03 | IdeaNetwork DPR fixed, physics polish, theme-reactive, pause | manual | same as VIS-02 on `/ideas` |
| VIS-04 | ScrollReveal + micro-interactions on motion v12, restraint, reduced-motion | manual | reveals fire once on scroll; reduced-motion → static; buttons hover/tap; keyboard focus-visible |
| VIS-05 | Nav desktop+mobile, choreography, keyboard, focus-visible | manual | Tab through nav (focus rings), open/close mobile menu (Esc closes, focus trapped, `aria-expanded` toggles) |
| VIS-06 | All 17 components elevated, token-conformant | manual + grep | both-theme smoke each component; `rg` for residual hardcoded color literals in upgraded files (e.g. `pink-500`, `slate-900`, raw `rgba(96, 165, 250`) → should be tokens |
| VIS-07 | Cards/type across 12 pages conform to tokens | manual + grep | visit each route both themes; grep page files for hardcoded glass/color literals |
| PERF-02 | All loops pause off-screen + tab-blur; mobile DPR cap + capability scene | manual + DevTools | each canvas: scroll-away/tab-switch → loop stops; reduced-motion → poster/static; low-power emulation → reduced/poster |
| PERF-01 (carried) | `three` route-split, absent from shared/text routes | scripted | `node scripts/check-bundle.mjs` after `npm run build` (Phase-4 gate, CANVAS_ROUTES now includes `/page`) |
| SHIP-01 | Phase gate | command | full suite green + both-theme + reduced-motion + LCP smoke + hard-refresh |

### LCP measurement approach (local)
1. **Preferred:** `npx lighthouse http://localhost:3000/ --only-categories=performance --preset=desktop` and again with `--form-factor=mobile --screenEmulation.mobile` (or `--preset` mobile) → read LCP, CLS, and the LCP element. Probe availability first (`npx lighthouse --version`); if the CLI isn't present, `npx -y lighthouse` or fall back to (2).
2. **Fallback:** Chrome DevTools → Lighthouse panel (mobile, throttled) on a `next build && next start` production server (NOT dev — dev is unoptimized and misleads LCP). Confirm the LCP element is the `<h1>`/poster, not `<canvas>`.
3. **CLS:** DevTools Performance → "Layout Shift" track during hero mount must show 0 around the canvas swap.
4. Run on a **production build** (`npm run build && npm start`) — dev-mode timings are not representative.

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit`.
- **Per wave merge:** `npx tsc --noEmit && npm run lint && npm run build && node scripts/check-bundle.mjs` + a quick both-theme glance at the touched surface.
- **Phase gate (before `/gsd:verify-work`):** full suite green + Lighthouse LCP/CLS on `/` (mobile, prod build) + both-theme + reduced-motion + WebGL-disabled + hard-refresh smoke across all 12 routes.

### Wave 0 Gaps
- [ ] **Prereq guard:** `ls src/hooks/useAnimationGate.ts src/hooks/useThemeColors.ts src/components/IslandBoundary.tsx src/components/three/SceneCanvas.tsx src/components/three/ScenePoster.tsx` — all must exist (Phase 3 + 4 merged). BLOCK if absent.
- [ ] Read the actual Phase-3/4 hook/component signatures and align scene/component code (Open Q 3).
- [ ] Install `maath` (+ optional `@react-three/postprocessing`, dev `r3f-perf`); re-verify versions via `npm view`.
- [ ] Hero device spike: profile draw-calls/fps on a throttled device; finalize particle count + bloom decision (Open Q 1).
- [ ] Probe Lighthouse CLI availability (`npx lighthouse --version`); else document the DevTools-panel fallback.
- [ ] Confirm Phase-4 `scripts/check-bundle.mjs` exists and update `CANVAS_ROUTES` to include `/page` (homepage now mounts the scene).
- [ ] (No test framework to install — scripted/manual checks only.)

## Sources

### Primary (HIGH confidence)
- **Repo, read directly (2026-06-12):** `Hero3DScene.tsx`, `Hero3D.tsx`, `InteractiveGlobe.tsx`, `IdeaNetworkCanvas.tsx`, `ScrollReveal.tsx`, `InteractiveButton.tsx`, `Navigation.tsx`, `ThemeToggle.tsx`, `Footer.tsx`, `FAQ.tsx`, `TeamSection.tsx`, `FundMeWidget.tsx`, `AnimatedIcons.tsx`, `globals.css` (token system — accents as hex, both themes), `.planning/config.json` (`nyquist_validation:true`). Component identity/inventory and the DPR-bug locations are first-hand.
- `.planning/phases/04-r3f-infrastructure/04-RESEARCH.md` — the boundary contract Phase 5 consumes (SceneCanvas DPR clamp, frameloop+useAnimationGate, useThemeColors hex bridge, ClientScene ssr:false, ScenePoster, webgl.ts, bundle gate). HIGH.
- `.planning/research/STACK.md` — live-verified versions/peers (three 0.184, fiber 9.6.1, drei 10.7.7, motion 12.40, maath 0.10.8, postprocessing 3.0.4, r3f-perf 7.2.3), App-Router bundle strategy, "What NOT to Use". HIGH.
- `.planning/ROADMAP.md` + `REQUIREMENTS.md` — Phase 5 success criteria + VIS-01..07/PERF-02/SHIP-01 exact text. HIGH.
- `.planning/research/FEATURES.md` — restraint-as-craft thesis, differentiators, anti-features. HIGH (design-domain).
- [React Three Fiber — Performance pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls) — instancing, avoid per-frame allocations. HIGH.
- [Motion (React) docs — motion component / animation / variants / scroll-trigger](https://motion.dev/docs/react-motion-component), [variants tutorial](https://motion.dev/tutorials/react-variants) — `whileInView`, `viewport={{once,amount}}`, `variants`, `stagger`, `motion/react` import path (updated 2026-03). HIGH.

### Secondary (MEDIUM confidence)
- [100 Three.js performance tips (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips) and [Krapton — Boosting R3F mobile performance 2026](https://www.krapton.com/blog/boosting-react-three-fiber-mobile-performance-in-2026-a-deep-dive-d6105c) — **< 100 draw calls → 60fps, > 500 struggles**; instancing; Draco; adaptive DPR. (Krapton page returned 403 to automated fetch; the draw-call thresholds are cross-confirmed by the utsubo + R3F-forum results.) MEDIUM-HIGH on the thresholds.
- [Maxime Heckel — Particles with R3F and shaders](https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/) — single Points/FBO draw call; **2,000 particles trivial, >1M on M1 desktop via shader**; CPU attribute updates are "pretty expensive". HIGH on the technique, MEDIUM on exact mobile headroom.
- [drei GitHub](https://github.com/pmndrs/drei) — `Points`/`PointMaterial`/`Instances`/`AdaptiveDpr`/`PerformanceMonitor`/`Float`/`Edges`/`Wireframe`/`Icosahedron` availability. HIGH on existence, MEDIUM on exact signatures (confirm at execution).

### Tertiary (LOW confidence — flagged for validation)
- Exact mid-tier-mobile particle count + bloom headroom → Wave-0 device spike (Open Q 1).
- `navigator.deviceMemory`/`hardwareConcurrency` as low-power signals → support varies (notably Safari); downgrade *hint* only (Open Q 4).

## Metadata

**Confidence breakdown:**
- Standard stack / versions: HIGH — Phase-4 live-verification + STACK.md; re-confirm `maath`/postprocessing/r3f-perf at execution.
- Component inventory + upgrade specs: HIGH — read from source; identity and DPR-bug locations first-hand.
- Hero concept recommendation: HIGH on strategy (icosahedron evolution preserves brand; GPU particles = one draw call), MEDIUM on exact particle count/bloom (Wave-0 spike).
- Mobile perf budget: MEDIUM-HIGH — draw-call thresholds cross-verified; exact gz chunk size and mobile fps headroom need the build + device spike.
- Motion v12 API: HIGH — official docs (2026-03), `motion/react` + `whileInView`/`variants`/`stagger` confirmed.
- Globe WebGL-vs-canvas: MEDIUM — judgment call documented; defer to owner appetite.

**Research date:** 2026-06-12
**Valid until:** ~2026-07-12 (R3F v9 / drei v10 / motion v12 / Next 15.5 are stable; re-verify only if React bumps toward 19.3, which breaks the R3F peer ceiling, or if a particle/bloom budget surprise emerges in the Wave-0 spike).
