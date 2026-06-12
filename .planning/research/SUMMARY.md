# Project Research Summary

**Project:** World-class portfolio upgrade (Usama Javed -- usamajaved.com.au)
**Domain:** Awwwards/FWA-tier developer + production-AI-engineer portfolio -- additive WebGL/3D + motion upgrade on a LIVE, indexed Next.js 15 App Router site
**Researched:** 2026-06-12
**Confidence:** HIGH

## Executive Summary

This is a **brownfield "wow-factor" upgrade** on a live, SEO-indexed portfolio (React 19.2.4 / Next 15.5.12 / Tailwind v4.1.13, theming via `data-theme` + CSS custom properties, all visuals currently hand-rolled Canvas 2D). The goal is to reach Awwwards-tier craft while proving the rare second half of the owner's Core Value -- *production* AI engineering, not notebook demos. Experts build this kind of site as a **thin RSC shell wrapping client "islands"** for anything stateful/animated/WebGL, fed by a **single typed content module** that fans out to page grids, `projects/[id]` metadata, JSON-LD, and the sitemap. The recommended additive stack is exact-React-19-compatible: `@react-three/fiber@9` + `@react-three/drei@10` + `three` for true 3D, `motion@12` (framer-motion renamed) for DOM/scroll motion, with native CSS scroll-driven animations preferred for simple reveals and `lenis` added only if inertial scroll is genuinely wanted. No framework changes; GSAP and react-spring are explicitly rejected as redundant.

The dominant failure mode here is **regression, not greenfield mistakes**: breaking ranked pages, Core Web Vitals, or working flows in pursuit of polish. Three risks dominate. (1) **SSR/hydration** -- `three`/R3F touch browser-only globals and there are no error boundaries in the repo, so a naive `<Canvas>` can white-screen an indexed page; every 3D tree must load via `dynamic(..., { ssr:false })` inside a `'use client'` wrapper, behind a static poster, with `error.tsx`/`global-error.tsx` added as a hard prerequisite. (2) **Bundle/CWV** -- `three` is ~150KB+ gzipped and must never enter the shared bundle or text/SEO routes; INP is the most-failed CWV in 2026 and feeds rankings. (3) **Content drift** -- centralizing 4-way-duplicated content while appending 5 AI projects is the #1 maintenance risk; a dropped entry or changed slug is a same-day-rollback offense (a prior rebuild was already rolled back).

The mitigation strategy is **foundations-first, additive-only, verbatim-preserving**. Build the single content source (baseline-and-diff gated), then the shared reduced-motion / off-screen-pause / theme-bridge primitives, then the R3F island infrastructure, then upgrade components in place -- with `tsc --noEmit` + lint + build + manual both-theme smoke + hard-refresh as the per-phase gate, because `ignoreBuildErrors: true` makes a green build meaningless.

## Key Findings

### Recommended Stack

The stack is purely **additive deltas** chosen for exact compatibility with the locked React 19.2.4 / Next 15.5.12 versions -- no framework changes. All versions and peer deps were verified live against the npm registry (HIGH confidence). The hard constraint throughout: R3F v9 is the *only* line supporting React 19 (v8 is React-18-only), and its peer range is `react >=19 <19.3`, so React must stay pinned and any 19.3 bump gated.

**Core technologies:**
- `@react-three/fiber@^9.6.1` + `@react-three/drei@^10.7.7` + `three@^0.184.0`: declarative WebGL for the signature hero/globe -- the only React-19-compatible 3D line; replaces the hand-rolled Canvas 2D that has hit its ceiling.
- `motion@^12.40.0` (framer-motion renamed): DOM component reveals, scroll-linked motion (`useScroll`/`useTransform`), page transitions, gestures, and `useReducedMotion` -- clean on React 19.2.
- Native **CSS scroll-driven animations** (`animation-timeline: view()`): preferred for simple fade/slide reveals -- zero JS, compositor-run, reduced-motion-safe. Reach for libraries only when native isn't enough.
- Supporting (add as needed): `lenis@^1.3.23` (smooth/inertial scroll, only if wanted), `maath` (3D math helpers), `@react-three/postprocessing` (cinematic glow, gated behind the 3D chunk), `r3f-perf` (dev-only FPS HUD).

**Explicitly rejected:** R3F v8/drei v9 (React 18), GSAP (licensing diligence + redundant with motion), react-spring alongside motion (two runtimes), multiple simultaneous `<Canvas>` instances, static three imports at route level, and `dynamic(ssr:false)` inside a Server Component.

### Expected Features

A "merely good" portfolio is clean and responsive; a **jaw-dropping** one wins on a signature hero moment, proof-over-claims (quantified production case studies), and *restraint as craft* (intentional motion, reduced-motion honored, off-screen pause). The strategic gap to exploit: design-led portfolios rarely prove production AI depth, and AI portfolios rarely look stunning -- this site does both.

**Must have (table stakes):**
- Distinct, intentional hero moment -- first 3s decide the impression (upgrade existing to WebGL).
- `prefers-reduced-motion` honored everywhere + animations pause off-screen -- accessibility/perf floor, already a hard constraint.
- Mobile-first responsive, full keyboard nav + visible focus, fast Core Web Vitals, WCAG AA contrast in both themes.
- Clear nav + persistent contact path, project list -> detail pages, persisted theme toggle, coherent design-token system, SEO/metadata/social cards.

**Should have (competitive differentiators):**
- Signature WebGL hero (R3F v9) -- the single highest-leverage upgrade.
- **AI Engineering Experience section** (ESIA MCP-server production narrative: Ollama<->NetSuite, v1->v2 LangGraph, batching/pagination fixes) -- the rarest, most differentiating content asset.
- AI case studies as Problem -> Architecture -> Trade-offs -> Impact, plus architecture diagrams and observability/trace screenshots (high credibility-per-effort).
- Centralized content data source (enabling), View Transitions page transitions, refined micro-interactions via motion v12.

**Defer (v2+):**
- Embedded live demo / Loom walkthrough per flagship AI project -- content-production heavy.
- Custom branded cursor / signature motif -- trend-positive but easy to overdo; only if it earns its place without hurting restraint/perf.

**Anti-features to avoid (scope-creep guards):** scroll-jacking, long mandatory preloaders, percentage skill bars, gratuitous/maximal animation, autoplay audio, deep parallax, removing/replacing existing pages or SEO assets, fake/inflated AI metrics, blocking 3D on low-end devices with no fallback.

### Architecture Approach

The winning pattern is a **thin RSC shell wrapping client islands** for anything animated/WebGL, with a **single content module fanning out to all readers**. Everything is additive -- existing `src/app` routing and the flat `src/components` layout stay put (reorganizing risks the rejected-rebuild trap); only new `three/` pieces, a `content/` source-of-truth, and shared `lib/` hooks are introduced.

**Major components:**
1. **Content modules** (`src/content/*.ts`) -- single typed source of truth (projects/skills/experience), pure data/no JSX, server-importable from pages, `generateMetadata`, JSON-LD builders, and sitemap. The highest-value structural change; eliminates the current 4-way manual sync.
2. **Client-wrapper boundary** -- tiny `'use client'` file doing `dynamic(() => import('./Scene'), { ssr:false })`, imported by the RSC shell (works around the Server-Component `ssr:false` ban).
3. **R3F Canvas island** -- one WebGL context, DPR-clamped, frameloop paused off-screen, reads theme via the bridge; behind a static fallback poster.
4. **Shared `lib/` foundation** -- `useThemeColors` (CSS-var -> WebGL uniform bridge via `getComputedStyle` + `MutationObserver` on `data-theme`), `useReducedMotion`/device-tier gate, `useInView`, motion presets -- built *before* component upgrades to prevent per-component re-implementation.
5. **Two-track animation** -- DOM motion (`motion` v12) and in-canvas R3F `useFrame` stay separate render-wise but share scroll progress (one MotionValue) and theme.

### Critical Pitfalls

1. **WebGL mounts during SSR -> hydration crash white-screens a ranked page** -- load all R3F via `dynamic({ ssr:false })` in a `'use client'` wrapper, static poster fallback, and add `error.tsx`/`global-error.tsx` (repo currently has none) as a hard prerequisite before any 3D ships.
2. **Three.js bundle bloat regresses LCP/INP site-wide** -- dynamic-import so three lands in a route-specific chunk; narrow drei imports; keep text/SEO routes a no-WebGL zone; gate on a `@next/bundle-analyzer` budget; verify field data (CrUX/Search Console), not just Lighthouse.
3. **3D hero steals the LCP slot (>2.5s) + CLS spike** -- paint an instant `next/image` poster or CSS hero as the LCP element, reserve exact canvas dimensions (zero CLS), mount WebGL on top as enhancement.
4. **Content centralization silently drops/drifts entries** -- snapshot every slug/skill/JSON-LD block/sitemap URL as a baseline, then diff after refactor requiring zero deletions (additive deltas only); move literals byte-for-byte, validate with Rich Results Test.
5. **Animations never pause off-screen + ignore reduced-motion** -- one shared hook: IntersectionObserver pauses RAF off-screen, `visibilitychange` pauses background tabs, reduced-motion renders a single static frame; cap DPR at 2.
6. **Verification theater** -- `ignoreBuildErrors: true` makes a green build prove nothing; per-phase gate is `tsc --noEmit` + lint + build + both-theme smoke + hard-refresh (not client nav). (Plus: WebGL ignoring CSS-var theming, and a11y regressions on unlabeled canvases / keyboard-only globe.)

## Implications for Roadmap

Based on combined research, the suggested phase structure is **dependency-ordered, foundations-first**. The architecture's "Suggested Build Order" and the pitfall-to-phase mapping converge cleanly on this sequence.

### Phase 1: Content Centralization (verbatim + baseline-diff)
**Rationale:** Every later step (appending AI content, component upgrades rendering content) depends on a single source; doing it first also closes the existing 4-way duplication and the missing `projects/[id]` `generateStaticParams`/`generateMetadata`. Must precede appending AI entries.
**Delivers:** `src/content/*.ts` (types + existing entries byte-for-byte) wired into page grid, detail pages, layout JSON-LD, and sitemap, with a baseline snapshot and a zero-deletion diff gate.
**Addresses:** Centralized content data source (P1 enabling feature).
**Avoids:** Pitfall 4 (content drift/loss) -- baseline-and-diff is the definition of done.

### Phase 2: Append AI Content
**Rationale:** A one-place edit only possible after Phase 1; surfaces the rarest half of the Core Value.
**Delivers:** 5 AI projects as full case studies (Problem->Architecture->Trade-offs->Impact), AI skills, and the ESIA/MCP experience narrative -- additive deltas only.
**Addresses:** AI Engineering Experience section + AI case studies (P1 differentiators).

### Phase 3: Shared Foundation (tokens + motion/3D primitives + error boundaries)
**Rationale:** Design tokens before component upgrades; shared animation/theme/error utilities before any 3D or per-component work (prevents Anti-Pattern 4 re-implementation, and error boundaries are a hard prerequisite for shipping 3D).
**Delivers:** Tightened CSS-variable token scale; `useReducedMotion`/device-tier gate, `useInView`, `useThemeColors` bridge, motion presets; `error.tsx` + `global-error.tsx`; skip-to-content link.
**Avoids:** Pitfalls 1, 5, 6, 7 (white-screen, off-screen RAF drain, verification gaps, theme bridge).

### Phase 4: R3F Infrastructure Island
**Rationale:** The canvas boundary + theming bridge + fallback scaffold must exist before any scene is migrated.
**Delivers:** Installed `@react-three/fiber@9` + `three` (+ drei), `SceneCanvas` provider (DPR clamp, frameloop control), `ClientScene` `ssr:false` wrapper, bundle-analyzer budget check.
**Uses:** R3F v9 / drei v10 / three / motion v12 from STACK.md.
**Avoids:** Pitfall 2 (bundle bloat) -- verify three is absent from shared and text routes.

### Phase 5: Per-Component Visual Upgrades (hero/3D first)
**Rationale:** Foundations now make each upgrade a thin, consistent change; hero is highest-leverage and highest-risk (LCP), so it goes first with budgets in its success criteria.
**Delivers:** Signature WebGL hero (swap Canvas-2D internals behind existing `Hero3D` wrapper, static poster LCP, zero CLS), then motion-driven sections, cards, typography -- all consuming shared primitives.
**Addresses:** Signature WebGL hero + refined micro-interactions + design-system polish (P1/P2).
**Avoids:** Pitfall 3 (hero LCP/CLS) and Pitfall 6 (a11y) per-component.

### Phase 6: Enhancements + Hardening
**Rationale:** Add cohesion polish once structure is solid, then re-enable strict build as end-state.
**Delivers:** View Transitions page transitions, architecture diagrams + trace screenshots on flagship AI projects, a11y-hardening pass, re-enable `ignoreBuildErrors`/`ignoreDuringBuilds`. Cross-cutting security/perf fixes done "in passing" as files are touched.
**Addresses:** P2 features; closes verification-theater debt.

### Phase Ordering Rationale
- **Content before everything visual:** the single source is the spine; appending AI content and rendering it in upgraded components both require it, and consolidating it first eliminates the rollback-prone 4-way drift.
- **Primitives before components:** reduced-motion, off-screen-pause, theme-bridge, and error boundaries are cross-cutting prerequisites for *every* motion/3D feature -- build once, reuse everywhere (Anti-Pattern 4).
- **Hero first within upgrades:** it's both the highest-leverage differentiator and the highest CWV risk, so it carries explicit LCP/CLS/bundle budgets early rather than discovering field regression weeks later.

### Research Flags

Phases likely needing deeper research (`/gsd:research-phase`) during planning:
- **Phase 4 (R3F Infrastructure):** the CSS-var->WebGL theme bridge and off-screen-pause/frameloop patterns are MEDIUM-confidence (credible articles, no single canonical doc) -- worth a focused pass when wiring the actual provider.
- **Phase 5 (Hero upgrade):** the specific WebGL hero design + shader/particle budget to hit LCP <= 2.5s on mobile is design-and-perf-sensitive and not fully specified by research.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Content centralization):** content-module-as-source and `generateStaticParams`/`generateMetadata` are well-documented (HIGH).
- **Phase 2 (Append AI content):** pure data edits on an established model.
- **Phase 3 (Foundation):** dynamic-import/`ssr:false` boundary and reduced-motion are HIGH-confidence, verified against official docs.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions + peer deps verified live against npm registry; `ssr:false` constraint verified against current Next.js docs; R3F v9 = only React-19 line confirmed. |
| Features | MEDIUM-HIGH | WebSearch-driven, cross-verified across design-authority + accessibility-standards sources; engagement/bounce figures are indicative/single-sourced. |
| Architecture | HIGH / MEDIUM | R3F v9/React 19 compat, dynamic-import boundary, content-layer pattern verified against official docs (HIGH); CSS-var->WebGL bridge and off-screen-pause patterns from credible articles, no canonical doc (MEDIUM). |
| Pitfalls | HIGH | Project-specific pitfalls grounded in CONCERNS.md; ecosystem pitfalls verified against Next.js docs + Core Web Vitals 2026 guidance. |

**Overall confidence:** HIGH

### Gaps to Address
- **CSS-var -> WebGL theme bridge details (MEDIUM):** validate the `getComputedStyle` + `MutationObserver` approach with a spike during Phase 4; smoke every scene in both themes.
- **Off-screen-pause / frameloop patterns (MEDIUM):** confirm IntersectionObserver + `visibilitychange` + `frameloop` behavior in the profiler during Phase 3/4.
- **Mobile hero perf budget:** LCP <= 2.5s / INP <= 200ms targets must be validated on real mid-tier devices and in field data (CrUX/Search Console), not just lab Lighthouse -- bake into Phase 5 success criteria.
- **Engagement/bounce stats (LOW):** the ~22% engagement / ~15% bounce figures are indicative; treat the "restraint as craft" thesis as the durable signal, not the exact numbers.
- **GSAP licensing (MEDIUM):** rejection rests primarily on redundancy with motion; verify license terms only if a stakeholder insists on GSAP.

## Sources

### Primary (HIGH confidence)
- npm registry (live `npm view`, 2026-06-12) -- exact versions + peerDependencies for three, R3F v9, drei v10, motion v12, lenis, maath, postprocessing.
- Next.js docs -- "How to lazy load Client Components and libraries" + JSON-LD guide -- `ssr:false` disallowed in Server Components, client-wrapper workaround, JSON-LD from typed data.
- R3F v9 migration guide + releases (official) -- v9 pairs with React 19 (19.0-19.2).
- `.planning/codebase/CONCERNS.md` + `.planning/PROJECT.md` + `.planning/codebase/*` -- project-specific perf/a11y/security audit, additive-only mandate, locked versions, 4-way content duplication.
- MDN -- `getComputedStyle`/custom properties; Next.js hydration error reference; WCAG 2.2 C39 / 2.3.3 + `prefers-reduced-motion`.

### Secondary (MEDIUM confidence)
- Awwwards/FWA portfolio + developer winners (inspiration index); NN/g Scrolljacking 101 + Webflow accessibility checklist (anti-pattern authority).
- Core Web Vitals 2026 optimization guides (INP most-failed metric, lazy-LCP trap, thresholds).
- Three.js + Next.js 2026 integration guide; "ssr:false trap" article; Wawa Sensei R3F + motion scroll tutorial; r3f-scroll-rig single-canvas pattern; Nicolas Mattia CSS->WebGL shader-color article.
- Portfolio case-study structure (PSR); micro-interaction trends; RAG/MCP/agentic patterns 2026; AI-agent observability as production signal.

### Tertiary (LOW confidence)
- Engagement/bounce percentages (single-sourced, indicative).
- GSAP licensing post-Webflow (general ecosystem knowledge).

---
*Research completed: 2026-06-12*
*Ready for roadmap: yes*
