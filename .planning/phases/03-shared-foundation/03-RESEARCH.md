# Phase 3: Shared Foundation - Research

**Researched:** 2026-06-12
**Domain:** Cross-cutting front-end primitives — design tokens (WCAG AA), shared motion-gating hook (reduced-motion + IntersectionObserver + visibilitychange), CSS-var→WebGL theme bridge, motion v12 presets, Next.js 15 App Router error boundaries, a11y (skip link + focus-visible)
**Confidence:** HIGH (token contrast computed numerically; motion v12 + React 19 peer-deps verified live against npm; Next.js error-boundary contract verified against official docs; gate/bridge patterns grounded in actual repo code)

## Summary

Phase 3 builds the foundation every later phase depends on. The work is five additive, independently-verifiable primitives that must land **before** any component or 3D upgrade so those upgrades become thin, consistent changes instead of N re-implementations: (1) tightened/documented design tokens with **both palettes brought to WCAG AA**, (2) a single shared motion-gating hook that serves both the existing Canvas-2D rAF components and future R3F scenes, (3) a CSS-var→WebGL theme-color bridge hook, (4) motion v12 preset module + install, (5) Next.js error boundaries (`error.tsx` + `global-error.tsx` + a reusable `<IslandBoundary>` class component) plus a skip-to-content link and visible `:focus-visible` states.

The single highest-risk, highest-value finding is **the contrast audit**: I computed every `--text-*` and accent pair against its background. **Dark theme** `--text-muted` (2.62), `--text-faint` (1.77), `--text-ghost` (1.48) fail AA, and `--text-tertiary` (3.77) passes only at large-text sizes. **Light theme** `--text-faint` (2.45) and `--text-ghost` (1.42) fail, and critically **all three light-theme accent colors fail AA for normal text** (blue 3.52 / violet 4.05 / emerald 2.42). This is a real, quantified regression source the planner must fix with minimal, look-preserving nudges (values supplied below).

**Primary recommendation:** Install `motion@^12.40.0` now (peer-clean on React 19.2.4). Create `src/hooks/` (single shared `useAnimationGate` + `useThemeColors`) and `src/lib/motion.ts` (presets). Bring both palettes to AA with the exact replacement values in this doc. Add `error.tsx`, `global-error.tsx`, and `src/components/IslandBoundary.tsx` (class component — the only `'use client'` class in the repo). Touch `layout.tsx` for the skip link ONLY (minimal one-line insert at the `<body>` open — Phase 2 may also touch this file; flag the merge point). Do NOT touch `src/content/*` or any new experience-section page (Phase 2 owns those, executing concurrently).

## User Constraints

> No `CONTEXT.md` exists for this phase (`.planning/phases/03-shared-foundation/` contains no `*-CONTEXT.md`). Constraints below are extracted from the project `CLAUDE.md` (PROJECT block), `REQUIREMENTS.md`, and the orchestrator's `<additional_context>`. Treat these with locked-decision authority.

### Locked Decisions (from CLAUDE.md / REQUIREMENTS / roadmap)
- **Versions are pinned:** React 19.2.4, Next 15.5.12, Tailwind v4.1.13 (CSS-first, no `tailwind.config`), TypeScript 5.9. No framework changes. `motion@^12.40` is the locked animation lib (STACK.md); `@react-three/fiber@^9.6` + `three` + `drei@^10.7` are Phase 4 — **NOT this phase**.
- **Additive only.** Existing tokens/components preserved; this phase tightens and extends, never removes. Existing entries verbatim.
- **Theming contract is frozen:** `data-theme` attribute on `<html>` + CSS custom properties (`--bg-*`, `--text-*`, `--accent-*`). **NOT** Tailwind `dark:`. New work consumes tokens via inline `style={{ ... 'var(--token)' }}`; layout/spacing via Tailwind utilities.
- **Animations MUST pause off-screen AND on tab blur AND respect `prefers-reduced-motion`.** Mobile is first-class.
- **Verification gate (SHIP-01) per phase:** `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke in BOTH themes. `next build` alone passes with errors (`ignoreBuildErrors:true`, `ignoreDuringBuilds:true`) — it proves nothing.
- **No Horizon Digital / interview-prep content** anywhere.

### Claude's Discretion
- Exact hook shape/signature of `useAnimationGate` and `useThemeColors`, and whether the gate ships as a hook, a `<MotionGate>` wrapper, or both (recommendation below: hook-first, optional thin wrapper).
- Folder choice for shared hooks (`src/hooks/` vs `src/lib/`) — recommended concretely below.
- The exact minimally-adjusted AA-passing color values (candidates computed below; planner picks final).
- Motion preset module shape (variants/transitions tokens).
- Dev-only reduced-motion verification mechanism.

### Deferred Ideas (OUT OF SCOPE for Phase 3)
- All R3F/three install + `SceneCanvas`/`ClientScene` infrastructure → **Phase 4 (FOUND-04, PERF-01)**.
- Actual per-component visual upgrades, ScrollReveal→motion rewrite, hero WebGL → **Phase 5 (VIS-\*)**.
- View Transitions API, security fixes (test-openai, VisitorTracker) → **Phase 6**.
- **Phase 2 territory — DO NOT EDIT:** `src/content/*` (projects/skills/experience/seo), any new AI experience-section page. Phase 2 is executing concurrently.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-02 | Shared motion-gating utility: `prefers-reduced-motion` + IntersectionObserver off-screen pause, used by every animated component | `useAnimationGate` hook design (§Architecture Pattern 1); grounded in the 3 existing rAF loops (Hero3DScene:290, IdeaNetworkCanvas:307, InteractiveGlobe:446) + ScrollReveal's existing reduced-motion check |
| FOUND-03 | Design tokens (type/spacing/color, both themes) tightened + documented in globals.css; both palettes pass WCAG AA | Full numeric contrast audit (§Don't Hand-Roll / §Token Inventory) — failing pairs + minimally-adjusted passing values supplied |
| FOUND-05 | Error boundaries wrap every WebGL/canvas island so a 3D failure can never white-screen a page | Next.js 15 `error.tsx` + `global-error.tsx` contract (§Pattern 2) + reusable `<IslandBoundary>` class component (§Code Examples) |
| PERF-03 | Every interactive element keyboard-reachable with visible focus state; no keyboard traps | Skip-to-content link + `:focus-visible` ring tokens consistent with existing globals.css (§Pattern 3) |
| PERF-04 | OS `prefers-reduced-motion` produces an equivalent, fully readable static experience on every page | `useAnimationGate` reduced-motion branch + existing globals.css kill-switch; dev-only verification approach (§Validation Architecture) |
| SHIP-01 | Phase passes tsc + lint + build + both-theme smoke | Verification gate baked into §Validation Architecture; this phase is text/CSS/hook only (no runtime WebGL yet) so smoke is cheap |

## Standard Stack

### Core (install in this phase)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `motion` | `^12.40.0` (latest, verified 2026-06-12) | `useReducedMotion`, variants/transitions presets, `whileInView` | framer-motion renamed; canonical package since v11.12+. Installing now lets the preset module + ScrollReveal-replacement prep begin; React-19-clean. |

**Peer-dep safety (verified live `npm view motion@12.40.0`):** `react: ^18.0.0 || ^19.0.0`, `react-dom: ^18.0.0 || ^19.0.0` — clean on React 19.2.4. `@emotion/is-prop-valid: '*'` is an **optional** peer (styled-components interop only); safe to ignore, do not install it.

**Install in Phase 3 vs Phase 4 — recommendation: install NOW (Phase 3).** Rationale: (a) the motion preset module (`src/lib/motion.ts`) and `useReducedMotion` re-export are Phase-3 deliverables; (b) motion has no native/3D deps so it carries zero Phase-4 coupling; (c) it is tree-shakeable, so adding it to the foundation doesn't inflate routes that don't import it; (d) lets executors validate `useAnimationGate`'s reduced-motion branch against `motion`'s `useReducedMotion` immediately. Defer ONLY `three`/R3F/drei to Phase 4.

### Supporting (do NOT install this phase)
| Library | Version | Why deferred |
|---------|---------|--------------|
| `three`, `@react-three/fiber@^9.6`, `@react-three/drei@^10.7` | per STACK.md | Phase 4 (FOUND-04). The theme bridge + gate are designed to serve them, but they aren't imported yet. |
| `lenis`, `maath`, `@react-three/postprocessing`, `r3f-perf` | per STACK.md | Phase 4/5 as features need them. |

**Installation:**
```bash
npm install motion@^12.40.0
```
(No `-D` flags; no `@types/*` — motion ships its own types.)

**Version verification done:** `npm view motion@12.40.0 version peerDependencies` → `12.40.0`, dist-tag `latest = 12.40.0`, peers as above (2026-06-12).

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `motion` v12 | `framer-motion` v12 | Same code, compatibility alias. Prefer `motion` (canonical name, lighter `motion/react` entry). Don't install both. |
| Custom `useReducedMotion` | `motion`'s `useReducedMotion` (from `motion/react`) | Use motion's — it's already a dep, SSR-safe, and battle-tested. The shared gate should re-export/compose it, not re-implement `matchMedia`. |
| New gate hook | Promote ScrollReveal's existing IO+reduced-motion logic | The existing logic is correct but per-component (Anti-Pattern 4). Promote the *pattern* into one shared hook; don't copy-paste. |

## Architecture Patterns

### Recommended File Locations (concrete decision)

ARCHITECTURE.md's suggested structure put shared hooks in `src/lib/`. The orchestrator asks to decide `src/hooks/` vs `src/lib/` concretely. **Recommendation:**

```
src/
├── hooks/                       # NEW — React hooks (client-only primitives)
│   ├── useAnimationGate.ts      #   FOUND-02: reduced-motion + IO off-screen + visibilitychange
│   └── useThemeColors.ts        #   CSS-var → WebGL/canvas color bridge (consumed Phase 4/5)
├── lib/                         # NEW — non-hook shared utilities
│   └── motion.ts                #   motion v12 variants/transitions presets (no React state)
├── components/
│   └── IslandBoundary.tsx       #   NEW — reusable error-boundary class wrapper ('use client')
└── app/
    ├── error.tsx                #   NEW — route-level error boundary ('use client', reset prop)
    ├── global-error.tsx         #   NEW — root error boundary (renders own <html><body>)
    ├── globals.css              #   EDITED — token tightening + AA fixes + focus-visible + skip-link styles
    └── layout.tsx               #   EDITED (minimal) — skip-link anchor only; flag Phase 2 merge point
```

**Why `src/hooks/` for hooks and `src/lib/` for non-hooks:** The repo today has neither folder. Splitting React hooks (stateful, client-only, `use*` naming) from pure utility modules (`motion.ts` is a plain data/object export, no hooks) is the clearer convention and matches Next.js community norms. `motion.ts` holds variant/transition *objects* consumed by components — it is not a hook, so `src/lib/`. The two new hooks are `'use client'`-only React hooks → `src/hooks/`. This is a discretion call; if the planner prefers a single `src/lib/` for all three to minimize new folders, that's acceptable, but the hooks/lib split is recommended for clarity as the foundation grows.

### Pattern 1: Single shared `useAnimationGate` serving BOTH Canvas-2D rAF and future R3F

**What:** One hook returns whether animation should run, composing three independent signals: `prefers-reduced-motion` (via motion's `useReducedMotion`), in-view (IntersectionObserver on a passed ref), and tab visibility (`document.visibilitychange`). Existing Canvas-2D components consume the boolean to start/stop their own `requestAnimationFrame` loop; future R3F `<Canvas>` maps it to `frameloop="always" | "never"`.

**When to use:** Every animated component — the 3 existing canvases (Hero3DScene, InteractiveGlobe, IdeaNetworkCanvas), ScrollReveal's replacement, and every Phase-4/5 scene.

**Grounding in actual repo code (verified):**
- `Hero3DScene.tsx:290` — `animId = requestAnimationFrame(draw)`; cleanup `cancelAnimationFrame(animId)` at :295. Single rAF, **no IO, no visibilitychange gate today.**
- `IdeaNetworkCanvas.tsx:307–313` — same single-rAF + cleanup pattern; DPR already capped at 2.
- `InteractiveGlobe.tsx:446–452` — `animFrameRef.current = requestAnimationFrame(render)`; cleanup cancels. Same gap.
- `ScrollReveal.tsx:34` — already does `window.matchMedia("(prefers-reduced-motion: reduce)")` correctly; promote this pattern, don't duplicate it.

**The canonical hook shape (recommended signature):**
```typescript
// src/hooks/useAnimationGate.ts
'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface AnimationGateOptions {
  rootMargin?: string;   // IO pre-load margin, default '200px' (start just before in-view)
  threshold?: number;    // IO threshold, default 0
}

/**
 * Returns `shouldAnimate`: true only when the element is on-screen,
 * the tab is visible, AND the user has not requested reduced motion.
 * Consumers gate their own rAF loop (Canvas-2D) or R3F frameloop on this.
 */
export function useAnimationGate<T extends Element>(
  ref: React.RefObject<T | null>,
  { rootMargin = '200px', threshold = 0 }: AnimationGateOptions = {}
) {
  const prefersReduced = useReducedMotion();           // motion v12, SSR-safe
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold]);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible');
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const shouldAnimate = !prefersReduced && inView && tabVisible;
  return { shouldAnimate, prefersReduced, inView, tabVisible };
}
```

**Consumption — Canvas-2D (the 3 existing components):** the loop reads `shouldAnimate`. When it flips false, skip scheduling the next frame (draw one final static frame first so reduced-motion / off-screen shows a frozen-but-correct image, satisfying PERF-04). Pattern:
```typescript
// inside the existing rAF closure:
const draw = () => {
  // ...render one frame...
  if (gateRef.current) animId = requestAnimationFrame(draw); // gateRef mirrors shouldAnimate
};
```
Use a `ref` mirror of `shouldAnimate` (updated in an effect) so the long-lived rAF closure reads the latest value without re-creating the loop each render.

**Consumption — future R3F (Phase 4, designed-for now):**
```tsx
const { shouldAnimate } = useAnimationGate(wrapperRef);
<Canvas frameloop={shouldAnimate ? 'always' : 'never'} dpr={[1, 2]} />
```

**Optional `<MotionGate>` wrapper:** a thin component that owns the ref + renders `children(shouldAnimate)` or a static fallback. **Recommendation: ship the hook as the primary primitive; add the wrapper only if Phase 5 finds repetitive ref wiring.** Hook-first keeps the API minimal and avoids prescribing a render shape the canvases (which own their `<canvas ref>`) don't need.

### Pattern 2: Next.js 15 App Router error boundaries (verified against official docs)

**What:** App Router uses **file-convention error boundaries**, not manually-mounted ones, for route-level catches. Two files plus one reusable component:

1. **`src/app/error.tsx`** — catches errors in the route segment and its children. **MUST be a Client Component** (`'use client'`). Receives `{ error: Error & { digest?: string }, reset: () => void }`. `reset()` re-renders the segment. Does NOT catch errors in `layout.tsx` of the same segment (that's why `global-error.tsx` is also needed).
2. **`src/app/global-error.tsx`** — the root boundary; catches errors in the root `layout.tsx` itself. **MUST be `'use client'` AND must render its own `<html>` and `<body>`** (it replaces the root layout when active). Only active in production.
3. **`src/components/IslandBoundary.tsx`** — a reusable React **class** component (the React error-boundary API requires a class with `componentDidCatch`/`getDerivedStateFromError`; there is no hook equivalent). This is what actually wraps individual animation islands so one failed canvas degrades to a poster instead of bubbling to `error.tsx` and blanking the whole route. This will be the ONLY class component in this otherwise function-component repo — that's expected and correct.

**Why all three:** `error.tsx`/`global-error.tsx` are the safety net (FOUND-05 baseline — "a 3D failure can never white-screen a page"), but they replace the **whole route's** UI. `<IslandBoundary>` is the surgical tool: it keeps the page chrome + below-fold SEO content intact and swaps only the broken island for a fallback. Pitfall #1 (PITFALLS.md) explicitly calls "no error.tsx/global-error.tsx + wrap each 3D component in its own boundary" as a hard prerequisite for shipping 3D — so the island boundary is the load-bearing one for Phase 4/5.

### Pattern 3: Skip-to-content link + `:focus-visible` (consistent with existing globals.css)

**What:** A visually-hidden anchor that becomes visible on focus, placed as the first focusable element after `<body>`, targeting the main content via `#main-content`. Plus a global `:focus-visible` ring using existing accent tokens.

**globals.css already has the substrate:** `--accent-blue`, `--bg-elevated`, `--border-hover`, and a reduced-motion kill-switch (lines 134–142). Add focus styles using these tokens so both themes get a theme-aware ring for free. Existing `::selection` uses `rgba(96,165,250,0.3)` (accent-blue) — match that hue for the focus ring for visual consistency.

**Layout touch (MINIMAL — flag merge point):** insert the skip anchor immediately after `<body ...>` opens (currently line 593–596) and add `id="main-content"` to the existing `<div className="flex-1">` (line 596) so the link has a target. That is the entire `layout.tsx` change for this phase.

> **⚠️ MERGE POINT (Phase 2 concurrency):** Phase 2 may also touch `layout.tsx` (it adds an experience section / possibly new JSON-LD). Keep this phase's `layout.tsx` diff to **two lines** (skip anchor + `id` on the flex div) so the merge is trivial. Do not reformat or move existing JSON-LD blocks. If Phase 2 has already added a skip link or `id`, reconcile rather than duplicate.

### Anti-Patterns to Avoid
- **Re-implementing reduced-motion / IO per component** (PITFALLS Anti-Pattern 4): build the one shared hook first; every animated component consumes it.
- **A second theming system for canvas/WebGL** (Anti-Pattern 3): never hardcode hex in materials/canvas; bridge CSS vars (Pattern 4 below).
- **Per-frame `getComputedStyle`**: read theme colors once per `data-theme` change (MutationObserver), cache them — per-frame reads thrash layout.
- **Touching `src/content/*` or the new experience page**: Phase 2 owns those, executing concurrently. Out of scope.
- **Large `layout.tsx` diff**: merge-conflict risk with Phase 2; keep to the two-line skip-link change.
- **Using Tailwind `dark:` for new tokens**: theming is `data-theme` + CSS vars only.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reduced-motion detection | Custom `matchMedia` listener per component | `useReducedMotion` from `motion/react` | SSR-safe, handles change events, already a dep |
| Error boundary | try/catch around render | React class boundary (`<IslandBoundary>`) + Next `error.tsx`/`global-error.tsx` | Render errors can't be caught by try/catch; React requires the class API / file convention |
| Contrast checking | Eyeballing colors | The computed audit in this doc + a repeatable script (§Validation) | "Looks fine in dark mode" is exactly how light-mode AA failures ship (Pitfall #6) |
| Variants/transitions | Inline magic-number durations everywhere | A `src/lib/motion.ts` preset module | One source for easing/duration keeps 17 components consistent (the "inconsistent polish" UX pitfall) |

**Key insight:** The whole point of Phase 3 is that these are built ONCE as shared primitives. Every per-component hand-roll in Phase 5 is a foundation failure surfacing late.

## Token Inventory & Contrast Audit (FOUND-03 — load-bearing)

### What exists today (globals.css)
- **Colors:** full `--bg-*` (6), `--text-*` (6-step hierarchy), `--border-*` (3), `--btn-*` (5), `--accent-*` (3), plus `--gradient-divider`, `--shadow-card`, `--canvas-opacity`, `--background`/`--foreground`. Both themes defined (`:root` dark default, `[data-theme="light"]` override).
- **Missing (FOUND-03 asks for these to be added + documented):** **no documented type scale** (font sizes are ad-hoc Tailwind arbitrary values like `text-[...]` / `h-[92vh]`), **no documented spacing scale** (spacing is raw Tailwind utilities). FOUND-03 wants a tightened, *documented* type + spacing scale in globals.css. Recommend adding `--text-xs … --text-5xl` (or a named scale) and `--space-*` custom properties as documentation/reference, even though Tailwind utilities remain the consumption mechanism — the tokens give a single source of truth and `@theme` can expose them.

### Contrast audit (computed via WCAG relative-luminance formula, 2026-06-12)

AA thresholds: **4.5** normal text, **3.0** large text (≥24px or ≥18.66px bold) & UI/graphical objects.

**DARK theme** — `--text-*` are white at alpha over `--bg-primary` #0a0a0f:

| Token | Value | Ratio | AA normal (4.5) | AA large (3.0) |
|-------|-------|-------|:---:|:---:|
| `--text-primary` | #ffffff | 19.75 | ✅ | ✅ |
| `--text-secondary` | white@0.5 | 5.36 | ✅ | ✅ |
| `--text-tertiary` | white@0.4 | 3.77 | ❌ | ✅ (large only) |
| `--text-muted` | white@0.3 | **2.62** | ❌ | ❌ |
| `--text-faint` | white@0.2 | **1.77** | ❌ | ❌ |
| `--text-ghost` | white@0.15 | **1.48** | ❌ | ❌ |
| accents (blue/violet/emerald) | — | 7.77 / 7.26 / 10.27 | ✅ | ✅ |

**LIGHT theme** — over `--bg-primary` #f8fafc:

| Token | Value | Ratio | AA normal (4.5) | AA large (3.0) |
|-------|-------|-------|:---:|:---:|
| `--text-primary` | #0f172a | 17.06 | ✅ | ✅ |
| `--text-secondary` | #334155 | 9.90 | ✅ | ✅ |
| `--text-tertiary` | #475569 | 7.24 | ✅ | ✅ |
| `--text-muted` | #64748b | 4.55 | ✅ | ✅ |
| `--text-faint` | #94a3b8 | **2.45** | ❌ | ❌ |
| `--text-ghost` | #cbd5e1 | **1.42** | ❌ | ❌ |
| `--accent-blue` | #3b82f6 | **3.52** | ❌ | ✅ (large/UI only) |
| `--accent-violet` | #8b5cf6 | **4.05** | ❌ | ✅ (large/UI only) |
| `--accent-emerald` | #10b981 | **2.42** | ❌ | ❌ |

### Failing pairs + minimally-adjusted passing values (preserve the look)

The faint/ghost tiers are deliberately decorative (dividers, ghost numerals). **Two valid strategies — planner picks:**

**Strategy A (recommended): tier-by-role policy.** Keep `--text-faint`/`--text-ghost` as **decorative-only** tokens (never used for text that conveys information), and document that contract in globals.css. AA does **not** require contrast for purely decorative/disabled elements. Then only fix tokens actually used for readable text. This preserves the exact current aesthetic. **Requires an audit of where `--text-faint`/`--text-ghost`/`--text-muted` are used for real labels** (Pitfall #6 specifically flags `--text-faint` + 10–11px uppercase labels as likely AA failures — those usages must move up a tier).

**Strategy B: nudge values to pass.** Minimal look-preserving replacements (computed):

| Token | Theme | Current → Ratio | Suggested → Ratio | Note |
|-------|-------|------|------|------|
| `--text-muted` | dark | white@0.3 → 2.62 | **white@0.45 → 4.49** | rounds to AA; small visual lift |
| `--text-tertiary` | dark | white@0.4 → 3.77 | white@0.5 (=secondary) → 5.36, or keep for large-text-only use | document as large-text tier |
| `--text-faint` | dark | white@0.2 → 1.77 | decorative-only (Strategy A) | text use → promote to muted |
| `--text-faint` | light | #94a3b8 → 2.45 | **#64748b → 4.55** | matches light `--text-muted` |
| `--accent-blue` | light | #3b82f6 → 3.52 | **#2563eb → 4.94** | blue-600; same hue, AA |
| `--accent-violet` | light | #8b5cf6 → 4.05 | **#7c3aed → 5.45** | violet-600; same hue, AA |
| `--accent-emerald` | light | #10b981 → 2.42 | **#047857 → 5.24** | emerald-700; AA. (emerald-600 #059669 = 3.60, large-text only) |

> **Critical nuance:** light-theme accents are used for **small text and dots/badges**. Where an accent colors *text*, it must hit 4.5 → use the -600/-700 values above. Where it's only a **decorative dot/icon** (graphical object), 3.0 suffices and the current -500 values are borderline-OK. The planner should split "accent-as-text" from "accent-as-decoration." Dark-theme accents all pass comfortably (7+), so only light theme needs accent work.

**Recommendation:** Strategy A for faint/ghost (document decorative-only + audit/relabel text usages) **plus** Strategy B's accent fixes for light theme (mandatory — accents-as-text genuinely fail). This is the minimal-change path that preserves the design while reaching AA in both themes.

## Common Pitfalls

### Pitfall 1: Light-mode contrast shipped because dev happens in dark mode
**What goes wrong:** All three light accents + faint/ghost fail AA; invisible until someone toggles theme. **Why:** dev defaults to dark (`:root`). **Avoid:** the computed table above + a both-theme smoke gate + a repeatable contrast script (§Validation). **Warning signs:** axe/Lighthouse a11y drop in light mode only.

### Pitfall 2: rAF closure reads stale `shouldAnimate`
**What goes wrong:** the long-lived `requestAnimationFrame` closure captures the first render's boolean and never sees the gate flip. **Why:** closures capture by value; the existing canvases create the loop once in `useEffect`. **Avoid:** mirror `shouldAnimate` into a `useRef` updated by an effect; the loop reads `gateRef.current`. **Warning signs:** animation never pauses off-screen despite the hook returning false.

### Pitfall 3: `global-error.tsx` without its own `<html>`/`<body>`
**What goes wrong:** blank/broken render when the root layout itself throws. **Why:** `global-error` **replaces** the root layout, so it must supply the document shell. **Avoid:** include `<html><body>...</body></html>` in `global-error.tsx`. **Warning signs:** hydration/render errors only in production root-error scenarios.

### Pitfall 4: Error boundary that catches but gives no recovery
**What goes wrong:** island boundary shows a dead fallback with no retry. **Avoid:** `<IslandBoundary>` fallback should be a *static poster* (the reduced-motion view), not an error message, so a failed canvas looks intentional. This doubles as the reduced-motion fallback. **Warning signs:** ugly "Something went wrong" box where a hero should be.

### Pitfall 5: Skip link that doesn't actually move focus
**What goes wrong:** skip link visible but Tab/Enter doesn't jump to content. **Why:** target lacks `id`/`tabindex`, or `scroll-behavior:smooth` + reduced-motion interaction. **Avoid:** target `<div id="main-content" tabindex="-1">`; the existing reduced-motion block already sets `scroll-behavior:auto`. **Warning signs:** keyboard test — Tab to skip link, Enter, focus should land in main.

## Code Examples

### `src/components/IslandBoundary.tsx` (reusable error boundary)
```tsx
// Source: React error-boundary API (getDerivedStateFromError / componentDidCatch)
// https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
'use client';
import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback: ReactNode; }
interface State { hasError: boolean; }

export default class IslandBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(): State { return { hasError: true }; }
  componentDidCatch(error: unknown) {
    // console stripped in prod by compiler.removeConsole
    console.error('[IslandBoundary] island failed, showing fallback:', error);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
// Usage (Phase 4/5): <IslandBoundary fallback={<HeroPoster />}><Hero3D /></IslandBoundary>
```

### `src/app/error.tsx` (route-level)
```tsx
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/error
'use client';
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-xl">Something went wrong</h2>
      <button onClick={reset} style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }} className="px-4 py-2 rounded-lg">Try again</button>
    </div>
  );
}
```

### `src/app/global-error.tsx` (root — own html/body)
```tsx
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error
'use client';
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-AU">
      <body style={{ background: '#0a0a0f', color: '#fff' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <h2>Something went wrong</h2>
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}
```
> Note: `global-error` can't rely on theme CSS vars reliably (it replaces the layout that scopes them) — use literal hex for its shell, matching the dark default.

### Skip link + focus-visible (globals.css additions)
```css
/* Skip-to-content */
.skip-link {
  position: absolute; left: -9999px; top: 0; z-index: 100;
  background: var(--bg-elevated); color: var(--text-primary);
  padding: 0.75rem 1rem; border-radius: 0 0 0.5rem 0;
  border: 1px solid var(--border-hover);
}
.skip-link:focus { left: 0; }

/* Visible focus ring — theme-aware, both themes */
:focus-visible {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
  border-radius: 2px;
}
```
```tsx
// layout.tsx — MINIMAL change (two lines), immediately after <body ...>:
<a href="#main-content" className="skip-link">Skip to content</a>
// and add id+tabindex to the existing wrapper:
<div id="main-content" tabIndex={-1} className="flex-1">{children}</div>
```

### `src/hooks/useThemeColors.ts` (CSS-var → canvas/WebGL bridge)
```tsx
// Source: ARCHITECTURE.md Pattern 4 + MDN getComputedStyle custom properties
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
'use client';
import { useEffect, useState, useCallback } from 'react';

export function useThemeColors(varNames: string[]) {
  const read = useCallback(() => {
    const cs = getComputedStyle(document.documentElement);
    return Object.fromEntries(varNames.map(v => [v, cs.getPropertyValue(v).trim()]));
  }, [varNames]);

  const [colors, setColors] = useState<Record<string, string>>({});

  useEffect(() => {
    setColors(read());                                   // initial (client-only)
    const ob = new MutationObserver(() => setColors(read()));
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => ob.disconnect();
  }, [read]);

  return colors; // e.g. colors['--accent-blue'] → feed THREE.Color / canvas fillStyle
}
```
> Phase 3 ships this hook; Phase 4/5 consumes it. It reads on `data-theme` mutation only (cached), never per-frame. For canvas-2D it returns the raw token string (works directly as `fillStyle`); for WebGL, parse into `THREE.Color` (which accepts `rgb()`/hex strings) at the consumer.

### `src/lib/motion.ts` (preset module shape)
```typescript
// motion v12 variants + transition tokens — single source for the 17 components
import type { Variants, Transition } from 'motion/react';

export const EASE_SIGNATURE = [0.16, 1, 0.3, 1] as const; // matches existing cubic-bezier

export const transitions = {
  base:  { duration: 0.7, ease: EASE_SIGNATURE } satisfies Transition,
  quick: { duration: 0.4, ease: EASE_SIGNATURE } satisfies Transition,
} as const;

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};
export const stagger = (gap = 0.1): Variants => ({
  visible: { transition: { staggerChildren: gap } },
});
// Consumers honor useReducedMotion(): when reduced, swap y:40 → y:0 (no transform).
```
> This preserves the existing signature easing `cubic-bezier(0.16, 1, 0.3, 1)` (seen in ScrollReveal/ThemeToggle) so motion-driven components feel identical to the current hand-rolled ones. Ships in Phase 3; ScrollReveal rewrite consumes it in Phase 5.

## State of the Art

| Old Approach (current repo) | Current Approach (Phase 3 target) | Impact |
|--------------|------------------|--------|
| Per-component `matchMedia` reduced-motion checks | One `useAnimationGate` composing motion's `useReducedMotion` + IO + visibilitychange | Consistent gating, no off-screen drain |
| rAF runs forever (no IO/visibility gate) | rAF gated on shared boolean | Battery/thermal/INP fix (PERF-02 foundation) |
| No error boundaries (any throw white-screens) | `error.tsx` + `global-error.tsx` + `<IslandBoundary>` | 3D can't blank a ranked page (FOUND-05) |
| Ad-hoc Tailwind arbitrary sizes | Documented type/spacing tokens | Consistent typography across all pages |
| Accents/faint untested for contrast | Both palettes audited to AA | a11y + page-experience signal |

**Deprecated/outdated:** `framer-motion` package name → use `motion`. `@studio-freight/lenis` → `lenis` (Phase 4 only). React class components are NOT deprecated for error boundaries — they remain the only API (no hook equivalent), so `<IslandBoundary>` as a class is correct, not legacy.

## Open Questions

1. **Where are `--text-faint`/`--text-ghost`/`--text-muted` actually used for readable text vs decoration?**
   - What we know: globals.css defines them; PITFALLS flags `--text-faint` + 10–11px uppercase labels as AA failures.
   - What's unclear: the exact set of components using faint/ghost for information-bearing text.
   - Recommendation: planner adds a Wave-0 grep audit task (`var(--text-faint)` / `var(--text-ghost)` / `var(--text-muted)` across `src/`) before deciding Strategy A vs B per usage. This is a quick grep, not deep research.

2. **Does Phase 2 already touch `layout.tsx` body / add a skip link or `id`?**
   - What we know: Phase 2 runs concurrently and may add an experience section + JSON-LD to layout.
   - What's unclear: whether it edits the `<body>`/`<div className="flex-1">` region.
   - Recommendation: keep the Phase-3 layout diff to two lines; at execution time, re-read layout.tsx and reconcile (don't duplicate skip link / `id`).

3. **Type/spacing scale: define as CSS custom props, Tailwind `@theme`, or both?**
   - What we know: Tailwind v4 CSS-first with `@theme inline` block already in globals.css; consumption is via utilities + inline var().
   - Recommendation: add `--text-*`/`--space-*` tokens as documented reference values in `:root`; optionally expose via `@theme` if the planner wants utility classes generated. Document the scale in a comment block matching the existing `/* === THEME SYSTEM === */` style. Low-risk; discretion call.

## Environment Availability

> This phase is code/CSS/hook only — the single external dependency is the `motion` npm install.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `motion@^12.40.0` | FOUND-02 presets, gate reduced-motion | Installable (registry verified) | 12.40.0 | none needed — peer-clean on React 19.2.4 |
| Node/npm | install + build | ✓ (Node v22 local, npm lockfile v3) | — | — |
| `npm ci` baseline | reproducible install | node_modules may be absent locally | — | run `npm ci` before install (PITFALLS #8) |

**Missing dependencies with no fallback:** none.
**Note:** run `npm ci` first if `node_modules` isn't present (lockfile-faithful), then `npm install motion@^12.40.0`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | **None** — repo has no test framework, no test files, no test script (STACK.md; vitest+Playwright deferred to V2-04). |
| Config file | none |
| Quick run command | `npx tsc --noEmit` (the de-facto unit gate here) |
| Full suite command | `npx tsc --noEmit && npm run lint && npm run build` + manual both-theme smoke |

> Phase 3 ships no runtime WebGL, so validation is type/lint/build + targeted scripted checks + manual keyboard/contrast/theme smoke. Building a test framework is **out of scope** (V2-04). Use scripted node checks for the mechanical criteria below.

### Phase Requirements → Verification Map
| Req | Behavior | Verification type | Command / method |
|-----|----------|-------------------|------------------|
| FOUND-03 | Both palettes pass AA | scripted | contrast-check node script (below) over final token values → asserts every text-role token ≥ 4.5 (or ≥3.0 + documented decorative) |
| FOUND-03 | Tokens documented | grep/manual | `--text-*`/`--space-*` scale present + commented in globals.css |
| FOUND-02 | Shared gate exists + is the only gate | grep | `rg "useAnimationGate"` shows the 3 canvases + future consumers; `rg "matchMedia\(.*reduced-motion"` returns only the hook (no per-component duplicates) |
| FOUND-02/PERF-04 | rAF pauses off-screen / tab-blur / reduced-motion | manual + devtools | DevTools Performance: scroll canvas off-screen → rAF stops; switch tab → stops; emulate reduced-motion → static frame |
| FOUND-05 | Boundaries catch without white-screen | deliberate-throw | dev-only throw page (below) — verify `<IslandBoundary>` shows fallback, page chrome survives; remove before ship |
| PERF-03 | Keyboard + visible focus | manual | Tab through every page: skip link works, `:focus-visible` ring shows in both themes, no traps |
| SHIP-01 | Phase gate | command | `npx tsc --noEmit && npm run lint && npm run build` green + both-theme smoke |

### Contrast-check script (repeatable, no framework needed)
A ~30-line node script (relative-luminance WCAG formula, same one used for this audit) that reads the final hex/alpha token values and asserts each text-role token meets its threshold, printing a pass/fail table for BOTH themes. Run it after token edits. (This research already executed that computation — the script just makes it repeatable in CI-less form.)

### Dev-only reduced-motion + error-boundary verification (must NOT ship)
- **Reduced-motion:** executors verify via **Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce"** (no OS setting change needed). Optionally an **env-gated query override** for local testing: read `?reducedMotion=1` ONLY when `process.env.NODE_ENV !== 'production'` inside the gate, forcing the reduced branch. Gate it so it never affects production. Document this as the canonical dev verification path so executors don't need to flip OS settings.
- **Error boundary:** a **dev-only deliberate-throw** approach — a component that throws when `process.env.NODE_ENV !== 'production'` and a query flag is set, wrapped in `<IslandBoundary>` on a throwaway local route or behind a flag. Verify the fallback renders and the rest of the page survives, then ensure the throw path is compiled out / removed before ship (it must not ship — assert via grep that no `throw new Error('TEST` remains).

### Wave 0 Gaps
- [ ] `npm ci` then `npm install motion@^12.40.0` — establish the one new dep.
- [ ] Grep audit: where `--text-faint`/`--text-ghost`/`--text-muted` are used as readable text (drives Strategy A vs B per usage) — Open Question 1.
- [ ] Re-read `layout.tsx` at execution time to reconcile with concurrent Phase 2 edits before inserting skip link — Open Question 2.
- [ ] (No test framework to install — scripted node checks + manual smoke only.)

## Sources

### Primary (HIGH confidence)
- `npm view motion@12.40.0 version peerDependencies` (live, 2026-06-12) — `12.40.0`, `react ^18||^19`, `react-dom ^18||^19`, optional `@emotion/is-prop-valid` — verified React-19.2.4 clean
- Repo source (read directly): `globals.css` (token inventory both themes), `ScrollReveal.tsx:34` (existing reduced-motion pattern), `ThemeToggle.tsx` (data-theme mechanism), `layout.tsx:522–599` (body/skip-link insert point), `Hero3DScene.tsx:290`, `IdeaNetworkCanvas.tsx:307`, `InteractiveGlobe.tsx:446` (single-rAF loops, no IO/visibility gate), `package.json` (motion absent, React 19.2.4)
- WCAG relative-luminance contrast computed numerically for every token pair (this research, node) — failing/passing ratios are exact, not estimated
- [Next.js error.tsx / global-error.tsx file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/error) — `'use client'` + `reset` prop, global-error must render own html/body
- [React error boundary API](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) — class-only, `getDerivedStateFromError`
- [MDN getComputedStyle custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties) — theme-bridge read
- `.planning/research/STACK.md`, `PITFALLS.md`, `ARCHITECTURE.md` (prior milestone research, HIGH) — version locks, gate/bridge patterns, pitfall mapping

### Secondary (MEDIUM confidence)
- WCAG 2.1 AA thresholds (4.5 normal / 3.0 large+UI) — established standard
- Candidate AA-passing accent values (blue-600 #2563eb, violet-600 #7c3aed, emerald-700 #047857) — Tailwind palette hues, ratios computed here

## Metadata

**Confidence breakdown:**
- Standard stack (motion install): HIGH — peer-deps verified live, React 19.2.4 clean
- Token contrast audit: HIGH — ratios computed numerically from actual globals.css values
- Motion-gate hook design: HIGH — grounded in the 3 actual rAF loops + motion's `useReducedMotion`
- Error boundaries: HIGH — verified against current Next.js + React docs
- Theme bridge: MEDIUM-HIGH — pattern verified (MDN + ARCHITECTURE), but WebGL consumption is Phase 4 (not exercised here)
- Type/spacing scale specifics: MEDIUM — FOUND-03 mandates them but exact scale is discretion

**Research date:** 2026-06-12
**Valid until:** ~2026-07-12 (stable; motion v12 line and Next 15 error conventions are not fast-moving)
