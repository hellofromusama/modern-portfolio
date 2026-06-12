# Architecture Research

**Domain:** High-end Next.js 15 portfolio/agency site — WebGL/3D scenes + motion orchestration + centralized typed content layer (additive upgrade of an existing all-client App Router site)
**Researched:** 2026-06-12
**Confidence:** HIGH (R3F v9 / React 19 compatibility, dynamic-import boundary, content-layer-as-module pattern verified against official docs + multiple sources); MEDIUM (CSS-var→WebGL theming bridge, off-screen pause patterns — verified by credible articles, no single canonical doc)

> **Framing for this milestone:** The existing architecture is already documented in `.planning/codebase/ARCHITECTURE.md` (App Router monolith, `src/app` + flat `src/components`, all-client Canvas-2D visuals, CSS-variable theming via `data-theme`, hardcoded 4-way-duplicated content). This research answers **how the NEW capabilities slot in** — it does not redesign what exists. Everything below is additive and respects the owner mandate (enhance, never replace).

## Standard Architecture

### System Overview

How elite Next.js 3D portfolios layer responsibilities. The winning pattern is a **thin RSC shell wrapping client "islands"** for anything stateful/animated/WebGL, with a **single content module** feeding every consumer (pages, JSON-LD, sitemap).

```
┌──────────────────────────────────────────────────────────────────────┐
│  CONTENT LAYER (server-importable, framework-agnostic TS modules)      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │ projects.ts│ │ skills.ts  │ │ experience │ │ types.ts   │          │
│  │ (data[])   │ │ (data[])   │ │ .ts        │ │ (Project,  │          │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ │  Skill...) │          │
│        └──────────────┴──────────────┴────────┴─────┬──────┘          │
│   one source of truth → consumed by 4 readers below ▼                 │
├───────────────┬───────────────┬──────────────┬───────────────────────┤
│ page.tsx grid │ projects/[id] │ layout JSON-LD│ sitemap.ts            │
│ (RSC reads,   │ generateStatic│ + page schemas│ (maps over            │
│  passes to    │ Params/Metadata│ (build JSON  │  content arrays)      │
│  client isl.) │  from content │  from content)│                       │
├───────────────┴───────────────┴──────────────┴───────────────────────┤
│  PRESENTATION LAYER                                                    │
│  ┌──────────────────────┐   ┌──────────────────────────────────────┐  │
│  │  RSC SHELL (server)  │   │  CLIENT ISLANDS ("use client")       │  │
│  │  layout, server pages│──▶│  ┌────────────┐ ┌──────────────────┐ │  │
│  │  static section markup│   │  │ R3F Canvas │ │ motion sections  │ │  │
│  │  (text from content) │   │  │ (3D scenes)│ │ (scroll reveal,  │ │  │
│  └──────────────────────┘   │  │ ssr:false  │ │  AnimatedCounter)│ │  │
│        ▲ imports            │  └─────┬──────┘ └────────┬─────────┘ │  │
│        │ wrapper            │        │ both read       │           │  │
│  ┌─────┴──────────────┐    │        ▼                 ▼           │  │
│  │ Client wrapper      │    │  ┌──────────────────────────────┐    │  │
│  │ (dynamic ssr:false) │────┘  │ SHARED FOUNDATION            │    │  │
│  └─────────────────────┘       │ • theme tokens (CSS vars)    │    │  │
│                                │ • useReducedMotion / useInView│    │  │
│                                │ • useThemeColors() bridge     │    │  │
│                                │ • R3F <Canvas> provider opts  │    │  │
│                                └──────────────────────────────┘    │  │
│                                └──────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│  THEMING SUBSTRATE: globals.css :root / [data-theme] custom props      │
│  → CSS drives DOM directly; JS bridge reads getComputedStyle for WebGL │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Content modules** (`src/content/*.ts`) | Single typed source of truth for projects/skills/experience. No React, no JSX — pure data + types | `export const projects: Project[]` + `export const getProject = (id) => ...`; importable from RSC, metadata routes, sitemap |
| **RSC shell** (layout + server pages) | Renders static markup, reads content for text + JSON-LD, embeds `<script type="application/ld+json">`. Holds no animation/3D | Server components; `metadata`/`generateMetadata` exports built from content modules |
| **Client wrapper** | Bridges the "can't `ssr:false` in a server component" rule | Tiny `"use client"` file that `dynamic(() => import('./Scene'), { ssr:false })` and renders it; imported by RSC |
| **R3F Canvas island** | Owns one WebGL context: `<Canvas>` + scene graph, frameloop control, theme-color uniforms | `"use client"`; `frameloop="demand"` or paused when off-screen; reads theme via bridge |
| **Motion layer** | Scroll-reveal, stagger, counters, parallax — DOM (not canvas) animation | `motion`/`framer-motion` v12 `whileInView` + `useScroll`/`useTransform`; honors `useReducedMotion()` |
| **Theme bridge** (`useThemeColors`) | Reads resolved CSS custom-property colors → feeds WebGL uniforms; re-reads on `data-theme` change | `getComputedStyle(document.documentElement).getPropertyValue('--accent')` + `MutationObserver` on `data-theme` |
| **Capability/motion hooks** | Gate heavy effects: reduced-motion, device tier, in-view | `useReducedMotion`, `IntersectionObserver`, optional `navigator.hardwareConcurrency`/`deviceMemory` checks |

## Recommended Project Structure

Additive folders alongside the existing `src/app` + flat `src/components` (do **not** reorganize existing files — that risks the rejected-rebuild trap):

```
src/
├── app/                      # UNCHANGED routing; pages now IMPORT from content/
│   ├── page.tsx              #   reads content/projects, content/skills (was inline)
│   ├── projects/[id]/page.tsx#   + generateStaticParams + generateMetadata from content
│   ├── layout.tsx            #   JSON-LD built from content (was hardcoded duplicate)
│   └── sitemap.ts            #   maps content arrays (was hardcoded URL list)
├── content/                  # NEW — single source of truth (pure TS, server-safe)
│   ├── types.ts              #   Project, Skill, Experience, BlogPost interfaces
│   ├── projects.ts           #   existing entries verbatim + 5 AI projects appended
│   ├── skills.ts             #   existing + AI skills (MCP/RAG/LangGraph...) appended
│   ├── experience.ts         #   NEW: ESIA MCP server narrative (additive)
│   └── seo.ts                #   buildPersonSchema(), buildItemListSchema() from content
├── components/               # UNCHANGED flat layout; new shared sub-pieces grouped:
│   ├── three/                # NEW — WebGL islands
│   │   ├── SceneCanvas.tsx   #   "use client" <Canvas> provider (DPR clamp, frameloop)
│   │   ├── HeroScene.tsx     #   R3F upgrade path for Hero3DScene
│   │   └── ClientScene.tsx   #   dynamic(ssr:false) wrapper imported by RSC
│   ├── Hero3D.tsx            #   existing wrapper — swaps canvas-2D for R3F island
│   └── ...existing 17 files  #   upgraded in place, still CSS-var themed
└── lib/                      # NEW — shared utilities (no UI)
    ├── useThemeColors.ts     #   CSS var → uniform bridge
    ├── useReducedMotion.ts   #   (or re-export motion's) + device-tier gate
    └── motion.ts             #   shared transition presets / variants
```

### Structure Rationale

- **`src/content/`:** The single highest-value structural change. Today the same project list lives in 4 places (`page.tsx`, `projects/[id]`, layout JSON-LD, `sitemap.ts`) and must be hand-synced — the #1 stated maintenance risk while *adding* AI content. A plain typed module is server-importable everywhere (pages, `generateMetadata`, sitemap) with zero runtime cost. Prefer a hand-rolled module over a CMS or MDX content-collection here: the data is small, additive, and already exists as TS literals.
- **`src/components/three/`:** WebGL needs hard boundaries (one `<Canvas>` = one GL context; contexts are limited and non-shareable). Co-locating scenes + the `ssr:false` wrapper keeps the client/server seam in one obvious place.
- **`src/lib/`:** Theme bridge, reduced-motion gate, and motion presets are used by *both* the WebGL and the motion layers — shared foundation must exist before per-component upgrades or you re-implement the bridge N times.
- **Flat `src/components/` preserved:** Existing 17 components stay where they are and keep referencing `var(--*)` tokens. Grouping only the *new* three/ pieces avoids a churny move-everything diff.

## Architectural Patterns

### Pattern 1: Client-wrapper boundary for `ssr:false` 3D

**What:** A Next.js App Router server component **cannot** call `dynamic(..., { ssr:false })` directly (documented limitation, enforced in Next 15). You insert a tiny `"use client"` wrapper that does the dynamic import, and the RSC imports the wrapper.
**When to use:** Any WebGL/`<Canvas>` scene mounted from a server page (and for the homepage, which is currently fully client — the upgrade can keep `page.tsx` client OR move static text to RSC and island the canvas; islanding is the elite pattern and improves LCP).
**Trade-offs:** One extra trivial file per entry point; in exchange you get RSC-rendered text (better SEO/LCP) with a hydration-deferred canvas. No hydration mismatch, no SSR'd GL crash.

**Example:**
```typescript
// components/three/ClientHeroScene.tsx
'use client';
import dynamic from 'next/dynamic';
// ssr:false is legal here because THIS file is a client component
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => <HeroFallback />, // static gradient/poster — no layout shift
});
export default function ClientHeroScene(props) { return <HeroScene {...props} />; }

// app/page.tsx (can stay client, or become RSC shell) imports the wrapper, not HeroScene
```
> This mirrors the site's *existing* `next/dynamic` + `ssr:false` usage (`Hero3D`, `fund-me`, `ideas`) — the upgrade swaps Canvas-2D internals for R3F without changing the boundary pattern.

### Pattern 2: Content-module as single source → fan-out to readers

**What:** Data lives once in `src/content/*.ts` as typed arrays; every consumer derives from it — page grids, `generateStaticParams`, `generateMetadata`, JSON-LD builders, and `sitemap.ts`.
**When to use:** Always, for this milestone. It is the prerequisite that makes "append 5 AI projects + AI skills" a one-place edit instead of a four-place edit.
**Trade-offs:** Up-front refactor cost (move literals into modules, point readers at them) and a verification pass to prove existing entries are byte-identical. Payoff: every later phase that touches content is cheap and consistent; fixes the existing `projects/[id]` gap (no `generateStaticParams`/`generateMetadata`) for free.

**Example:**
```typescript
// content/projects.ts
export const projects: Project[] = [ /* existing verbatim */, ...aiProjects ];
export const getProject = (id: string) => projects.find(p => p.id === id);

// app/projects/[id]/page.tsx (RSC)
export const generateStaticParams = () => projects.map(p => ({ id: p.id }));
export async function generateMetadata({ params }) {
  const p = getProject((await params).id);          // Next 15 async params
  return p ? { title: p.title, description: p.summary } : {};
}

// app/sitemap.ts          → projects.map(p => ({ url: `${base}/projects/${p.id}` }))
// content/seo.ts          → buildItemListSchema(projects)  (consumed by layout JSON-LD)
```

### Pattern 3: Two-track animation — motion (DOM) over WebGL (canvas), one context

**What:** Keep DOM scroll/reveal animation (`motion` v12 `whileInView`, `useScroll`+`useTransform`) **separate** from in-canvas animation (R3F `useFrame`). They share *scroll progress* and *theme*, not a render loop. Run a **single** `<Canvas>` (one GL context) behind/within the page; drive it from a shared scroll value if needed.
**When to use:** Whenever 3D and rich scroll motion coexist. Avoids the classic trap of multiple WebGL contexts (browser-capped, non-shareable resources) and of fighting two RAF loops.
**Trade-offs:** Requires discipline about where each effect lives; in return you get smooth scroll-linked 3D without context exhaustion. On mobile/low-power, the DOM layer degrades gracefully (CSS) while the canvas can drop to a static poster.

**Example:**
```typescript
'use client';
import { useScroll, useTransform, useReducedMotion } from 'motion/react';
function HeroSection() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  return (
    <>
      <ClientHeroScene scrollProgress={scrollYProgress} /> {/* canvas reads same value via useFrame */}
      <motion.div style={{ y }} initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} />
    </>
  );
}
```

### Pattern 4: CSS-variable → WebGL color bridge (theming integration)

**What:** WebGL can't read CSS variables natively. A small hook reads resolved values via `getComputedStyle` and pushes them into materials/uniforms; a `MutationObserver` on `data-theme` (the site's existing toggle target) re-reads on theme switch.
**When to use:** Any scene whose colors must track the light/dark theme — required here, since the site themes purely via CSS custom properties and the upgrade must keep that single theming source.
**Trade-offs:** `getComputedStyle` is sync/cheap when batched (read once per theme change, not per frame). Reading a *rendered element's* color (vs the raw `--var`) returns a normalized `rgb()` that's trivial to parse into a THREE.Color.

**Example:**
```typescript
// lib/useThemeColors.ts
export function useThemeColors(varNames: string[]) {
  const [colors, set] = useState(read);
  function read() {
    const cs = getComputedStyle(document.documentElement);
    return Object.fromEntries(varNames.map(v => [v, cs.getPropertyValue(v).trim()]));
  }
  useEffect(() => {
    const ob = new MutationObserver(() => set(read()));
    ob.observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });
    return () => ob.disconnect();
  }, []);
  return colors; // feed into <meshBasicMaterial color={colors['--accent']} /> etc.
}
```

### Pattern 5: Progressive enhancement / capability gating

**What:** Layered fallbacks — (1) `prefers-reduced-motion` → static poster/no parallax; (2) off-screen → pause render via `IntersectionObserver` toggling R3F `frameloop` to `'never'` (or `invalidate()` on `frameloop="demand"`); (3) low-power tier → skip the canvas entirely, render a CSS/static hero. The DOM content is always present (RSC text), so 3D is purely additive polish.
**When to use:** Mandatory per project constraints (animations pause off-screen + respect reduced-motion; mobile is first-class).
**Trade-offs:** More branches to test (both themes × reduced-motion × mobile), but it's the difference between "world-class" and "janky on a recruiter's mid-range phone."

**Example:**
```typescript
const reduce = useReducedMotion();
const inView = useInView(ref, { margin: '200px' });
const lowPower = (navigator.deviceMemory ?? 8) < 4 || (navigator.hardwareConcurrency ?? 8) < 4;
if (reduce || lowPower) return <HeroPoster />;           // static, no GL
<Canvas frameloop={inView ? 'always' : 'never'} dpr={[1, 2]} /> // pause off-screen, clamp DPR
```

## Data Flow

### Content → Render → SEO Flow

```
src/content/projects.ts (typed array, edited ONCE)
        │
        ├─▶ app/page.tsx (RSC) ──────────▶ grid markup (text server-rendered)
        │                                   └─▶ <ClientScene/> island (deferred canvas)
        ├─▶ app/projects/[id] ──▶ generateStaticParams() ▶ prebuilt routes
        │                        generateMetadata()      ▶ per-project <head>
        ├─▶ content/seo.ts builders ──▶ layout.tsx JSON-LD <script>
        └─▶ app/sitemap.ts ──────────▶ /sitemap.xml URLs

   THEME (independent axis):
   globals.css :root/[data-theme] ──▶ DOM (CSS, instant)
                                  └──▶ useThemeColors() ──▶ WebGL uniforms (on theme change)
```

### State Management

```
Scroll position ──useScroll()──▶ MotionValue ──▶ DOM (useTransform/motion styles)
                                            └──▶ Canvas (useFrame reads same value)
Theme ──data-theme attr──▶ CSS vars (DOM)  +  MutationObserver──▶ WebGL colors
In-view ──IntersectionObserver──▶ frameloop on/off (pause off-screen)
```
No global store needed — matches the existing "local `useState`/`useRef`, no context" convention. The only new "shared state" is scroll progress (a motion value) and theme colors (derived from CSS).

### Key Data Flows

1. **Content fan-out:** One edit to `content/projects.ts` propagates to grid, detail pages, metadata, JSON-LD, and sitemap — eliminating the current 4-way manual sync.
2. **Theme propagation:** CSS variables remain the single theming source; DOM updates instantly via CSS, WebGL updates via the `getComputedStyle` bridge on `data-theme` mutation — no second theme system.
3. **Scroll→3D:** A single scroll MotionValue feeds both DOM reveals and in-canvas camera/mesh motion, so they stay perfectly synced without duplicate listeners.

## Scaling Considerations

This is a static marketing site (Vercel, no DB), so "scale" = **render performance per device**, not concurrent users.

| Scale axis | Architecture Adjustments |
|------------|--------------------------|
| Content growth (more projects/skills) | Trivial — append to `content/*.ts`; readers map automatically. This is the whole point of centralizing. |
| Visual richness (more scenes) | Stay at **one** `<Canvas>`/GL context where possible; reuse it across sections via scroll-driven scene swaps rather than mounting many canvases (contexts are browser-capped). |
| Device range (flagship → low-end mobile) | DPR clamp `[1,2]`, `frameloop` pause off-screen, low-power poster fallback. This is the first and most important "scaling" lever. |
| Traffic | Vercel CDN + static/ISR handles it; centralized content makes `generateStaticParams` exhaustive so project pages prerender. |

### Scaling Priorities

1. **First bottleneck — mobile GPU/jank:** Fix with DPR clamp, off-screen `frameloop` pause, reduced-motion + low-power posters *before* adding more scenes.
2. **Second bottleneck — multiple GL contexts:** If a second scene is wanted, reuse the single canvas with scroll-swapped content instead of mounting a new `<Canvas>`.

## Anti-Patterns

### Anti-Pattern 1: `dynamic(ssr:false)` called inside a server component
**What people do:** Add `dynamic(() => import('./Scene'), { ssr:false })` directly in a server `page.tsx`/`layout.tsx`.
**Why it's wrong:** Next.js 15 App Router disallows it — build/runtime error. (The existing site sidesteps this only because those pages are already `"use client"`.)
**Do this instead:** Use a one-line `"use client"` wrapper (Pattern 1) and import the wrapper from the server component.

### Anti-Pattern 2: Multiple `<Canvas>` / WebGL contexts for multiple sections
**What people do:** Drop a separate R3F `<Canvas>` into hero, projects, and CTA sections.
**Why it's wrong:** Browsers cap active WebGL contexts and can't share resources between them; you get "context lost" on mobile and wasted GPU memory.
**Do this instead:** One persistent canvas; swap/transition scene content via scroll. (For this milestone, prefer upgrading the existing single hero canvas first rather than scattering new ones.)

### Anti-Pattern 3: A second theming system for 3D
**What people do:** Hardcode hex colors in materials, or build a JS theme object parallel to the CSS variables.
**Why it's wrong:** Two sources of truth drift; the site's entire theming contract is "components reference `var(--*)`, never hardcode." A parallel system breaks that and the light/dark toggle for WebGL.
**Do this instead:** Bridge CSS vars → uniforms (Pattern 4). CSS stays the single source.

### Anti-Pattern 4: Re-implementing reduced-motion / in-view per component
**What people do:** Each upgraded component writes its own `matchMedia('prefers-reduced-motion')` and IntersectionObserver.
**Why it's wrong:** Inconsistent thresholds, duplicated logic, easy to forget one (violating the "all animations respect reduced-motion + pause off-screen" constraint).
**Do this instead:** Shared `lib/` hooks built **before** component upgrades, used everywhere. (The existing `ScrollReveal` already does reduced-motion correctly — promote its logic to shared hooks rather than copy-paste.)

### Anti-Pattern 5: Centralizing content by paraphrasing existing entries
**What people do:** While moving project/skill data into modules, "clean up" the copy.
**Why it's wrong:** Owner mandate is additive/verbatim; paraphrase loses SEO equity and breaks the rollback-sensitive trust established after the rejected rebuild.
**Do this instead:** Move literals byte-for-byte; verify with a diff that rendered output is unchanged; only *append* new AI entries.

## Integration Points

### External Services (unchanged — keep as-is, visual polish only)

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Stripe | existing `/api/create-checkout` lazy `getStripe()` | Don't touch flow; fund-me visuals can be polished but logic frozen |
| SMTP / nodemailer | existing `/api/send-email` | Contact form unchanged |
| LLM providers | existing budget/AI-training routes | Out of scope for visual milestone (but note existing key-exposure security fix flagged separately) |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| content modules ↔ RSC pages | direct import (server) | Pure data; no React. Safe in `generateMetadata`, `sitemap.ts`, `layout` |
| RSC shell ↔ client island | props through `"use client"` wrapper | Only serializable props cross the boundary; pass scroll value as a child of a client provider, not as a server prop |
| CSS theming ↔ WebGL | `getComputedStyle` + `MutationObserver` (read-only) | One-directional: CSS is source, WebGL is consumer |
| motion layer ↔ R3F layer | shared MotionValue (scroll), shared theme hook | No shared render loop; sync via shared values only |

## Suggested Build Order (downstream roadmap input)

Dependency-ordered so foundations exist before consumers. Each step is independently verifiable (tsc + lint + build + both-theme smoke).

1. **Content centralization FIRST.** Create `src/content/*` with `types.ts` + existing entries verbatim; repoint `page.tsx`, `projects/[id]`, layout JSON-LD, and `sitemap.ts` to read from it; add `generateStaticParams`/`generateMetadata`. *Rationale:* every later step (appending AI projects/skills, per-component upgrades that render content) depends on a single source; doing this first also closes the existing duplication + `projects/[id]` metadata gaps. **Must precede appending AI entries.**
2. **Append AI content** (5 AI projects, AI skills, ESIA/MCP experience) into the now-centralized modules. *Rationale:* one-place edit only possible after step 1.
3. **Shared foundation: design tokens + lib hooks.** Confirm/extend CSS-variable token set; build `useReducedMotion`/device-tier gate, `useInView`, `useThemeColors`, `motion.ts` presets. *Rationale:* design tokens before component upgrades; shared animation/theme utilities before per-component work (prevents per-component re-implementation, Anti-Pattern 4).
4. **R3F infrastructure island.** Add `@react-three/fiber@9` + `three` (+ drei as needed; all React-19/v9 compatible — see Sources), build `SceneCanvas` provider (DPR clamp, frameloop control) + `ClientScene` wrapper. *Rationale:* the canvas boundary + theming bridge + fallback scaffold must exist before any scene is migrated.
5. **Per-component visual upgrades**, hero/3D first (swap Canvas-2D internals for R3F behind the existing `Hero3D` wrapper), then motion-driven sections, then cards/typography. *Rationale:* foundations (1–4) now make each upgrade a thin, consistent change; reuse shared hooks + tokens throughout.
6. **Cross-cutting fixes in passing** (security key exposure, DPR/retina bug, etc.) as their files are touched — per project decision, not a separate phase.

## Sources

- [v9 Migration Guide — React Three Fiber (official)](https://r3f.docs.pmnd.rs/tutorials/v9-migration-guide) — HIGH: R3F v9 pairs with React 19; reconciler bundled for 19.0–19.2 compatibility (project is on 19.2.4)
- [React Three Fiber releases / v9.5.0 (official GitHub)](https://github.com/pmndrs/react-three-fiber/releases) — HIGH: v9 stable, compatibility release for React 19
- [Three.js with Next.js Integration Guide 2026](https://threejsresources.com/frameworks/three-js-nextjs) — MEDIUM: R3F v9 + Next 15 App Router setup, Canvas in `"use client"` Scene
- [The ssr:false Trap in Next.js App Router (Medium)](https://medium.com/@joshisagarm3/the-ssr-false-trap-in-next-js-app-router-and-how-i-escaped-it-74816bc7a778) — MEDIUM: client-wrapper workaround for `ssr:false` in server components
- [Next.js Guides: JSON-LD (official)](https://nextjs.org/docs/app/guides/json-ld) — HIGH: render JSON-LD as `<script>` in layout/page; build from typed data
- [Stop Wrestling with JSON-LD: Type-Safe Structured Data for Next.js (DEV)](https://dev.to/arindamdawn/stop-wrestling-with-json-ld-type-safe-structured-data-for-nextjs-38on) — MEDIUM: type-safe schema generation, central types dir
- [Build a 3D Portfolio with R3F + Framer Motion Scroll (Wawa Sensei)](https://wawasensei.dev/tuto/build-a-3D-portfolio-with-react-three-fiber-framer-motion-scroll-animations) — MEDIUM: motion `useScroll`/`useTransform` driving R3F
- [r3f-scroll-rig (14islands, GitHub)](https://github.com/14islands/r3f-scroll-rig) — MEDIUM: single-canvas pattern syncing 3D meshes to DOM scroll; multiple-context warning
- [How to Set WebGL Shader Colors with CSS and JavaScript — Nicolas Mattia](https://nmattia.com/posts/2025-01-29-shader-css-properties/) — MEDIUM: reading resolved CSS colors into WebGL, syncing on change
- [getComputedStyle / custom properties — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties) — HIGH: `getComputedStyle().getPropertyValue('--var')` for the theme bridge
- Existing codebase architecture (`.planning/codebase/ARCHITECTURE.md`) — HIGH: current dynamic-import/`ssr:false` usage, CSS-var theming, 4-way content duplication, reduced-motion in `ScrollReveal`

---
*Architecture research for: high-end Next.js 15 portfolio — 3D/motion/content-layer integration (additive upgrade)*
*Researched: 2026-06-12*
