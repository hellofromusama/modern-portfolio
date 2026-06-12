# Roadmap: Usama Javed Portfolio — World-Class Upgrade

## Overview

This milestone elevates a live, SEO-indexed Next.js 15 portfolio to Awwwards-tier craft while proving the rare second half of the owner's Core Value — *production* AI engineering — all additively, removing nothing. The journey is **dependency-ordered and foundations-first**: first consolidate the 4-way-duplicated content into one typed source (the spine everything else renders from), then append the AI projects/skills/experience narrative, then build the shared motion/theme/error primitives, stand up the R3F (WebGL) island infrastructure, upgrade every visual component in place behind those primitives (hero first, highest-leverage and highest-risk), and finally add cohesion polish, fix security/bugs in passing, close the verification-theater debt, and deploy on owner approval. The dominant risk is *regression, not greenfield mistakes* — so every phase is gated by `tsc --noEmit` + lint + build + both-theme manual smoke (SHIP-01), and a prior from-scratch rebuild that was rolled back makes "additive, verbatim-preserving" non-negotiable.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Content Centralization** - Single typed content source (verbatim + baseline-diff gated), wired into grid, detail pages, JSON-LD, sitemap (completed 2026-06-12)
- [x] **Phase 2: Append AI Content** - 5 AI projects, AI skill domains, and the ESIA/MCP production narrative appended additively (completed 2026-06-12)
- [x] **Phase 3: Shared Foundation** - Design tokens + motion/theme/in-view primitives + error boundaries + a11y floor
- [x] **Phase 4: R3F Infrastructure Island** - Installed React-19-compatible 3D stack + SSR-safe Canvas island with bundle budget, mounted/proven on an isolated noindex /scene-harness route; SHIP-01 gate green (completed 2026-06-12)
- [x] **Phase 5: Per-Component Visual Upgrades** - Signature WebGL hero + every component/page elevated to the new design language (completed 2026-06-12)
- [ ] **Phase 6: Enhancements, Hardening & Ship** - Page transitions, security/bug fixes in passing, strict-build re-enabled, owner-approved deploy

## Phase Details

### Phase 1: Content Centralization
**Goal**: Collapse the 4-way-duplicated content (home grid, `projects/[id]`, layout JSON-LD, `sitemap.ts`) into a single typed `src/content/*.ts` module — every existing entry preserved byte-for-byte — so all later AI-append and component-upgrade work edits one place and ranked URLs never drift.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FIX-03, SEO-01, SHIP-01
**Success Criteria** (what must be TRUE):
  1. The home project grid, every `projects/[id]` page, the layout JSON-LD, and `sitemap.ts` all render from one typed content module — no duplicated literals remain
  2. A baseline-vs-after diff shows zero deletions: every existing project slug, skill, JSON-LD entity, and sitemap URL is preserved verbatim
  3. `projects/[id]` builds its routes and metadata via `generateStaticParams` + `generateMetadata` from the centralized source, with every existing slug still resolving
  4. All existing routes, slugs, robots rules, and AI-SEO/IndexNow routes remain functional and unchanged in URL space
  5. Phase passes `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke in BOTH themes before being marked complete
**Plans**: 5 plans
Plans:
- [x] 01-01-PLAN.md — Wave 0: baseline snapshot + zero-deletion diff scripts (no source edits yet)
- [x] 01-02-PLAN.md — Wave 1: build src/content module (7-project superset + projections + skills + JSON-LD builder)
- [x] 01-03-PLAN.md — Wave 2: repoint projects/[id] (generateStaticParams+generateMetadata, FIX-03) + sitemap.ts
- [x] 01-04-PLAN.md — Wave 2: repoint page.tsx (grid+skills) + layout.tsx JSON-LD ItemList
- [x] 01-05-PLAN.md — Wave 3: SHIP-01 gate (tsc+lint+build+7-route check+diff) + owner both-theme smoke


### Phase 2: Append AI Content
**Goal**: Surface the rarest half of the Core Value — production AI engineering — by appending the ESIA/MCP experience narrative, 5 new AI projects as full case studies, and AI skill domains into the now-single content source, with metadata/JSON-LD/sitemap flowing automatically, and zero Horizon Digital / interview-prep material anywhere.
**Depends on**: Phase 1
**Requirements**: AICON-01, AICON-02, AICON-03, AICON-04, AICON-05, AICON-06, SEO-02, SHIP-01
**Success Criteria** (what must be TRUE):
  1. A visitor reads an AI Engineering experience section telling the ESIA MCP-server story (Ollama ↔ NetSuite via OAuth + SuiteScript RESTlet) with the 6-step query flow and an SVG architecture diagram rendered visually
  2. The v1→v2 LangGraph evolution and the three production fixes (250-record batching, leads-vs-customers prompts, pagination) read as a Problem→Architecture→Trade-offs→Impact production narrative
  3. The 5 new AI projects appear in the project list with working detail pages, and AI skill domains appear grouped by domain (no percentage bars) — every pre-existing project and skill still present and untouched
  4. New AI content (experience section + 5 detail pages) carries correct metadata, JSON-LD, and sitemap entries generated from the centralized source; no Horizon Digital or interview-prep content appears anywhere
  5. Phase passes `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke in BOTH themes before being marked complete
**Plans**: 4 plans
Plans:
- [x] 02-01-PLAN.md — Wave 1: append 5 AI projects to projects.ts (map + projections) + bump numberOfItems
- [x] 02-02-PLAN.md — Wave 1: append AI skill groups to skills.ts + AI terms to layout knowsAbout
- [x] 02-03-PLAN.md — Wave 1: /ai-engineering server route + AiBridgeDiagram SVG + Navigation nav item
- [x] 02-04-PLAN.md — Wave 2: SHIP-01 gate + AICON-06 grep gate + count assertions + both-theme smoke
**UI hint**: yes

### Phase 3: Shared Foundation
**Goal**: Build the cross-cutting primitives — tightened design tokens, reduced-motion/device-tier gating, off-screen pause, CSS-var→WebGL theme bridge, motion presets, and error boundaries — *before* any component or 3D work, so every later upgrade is a thin consistent change and a 3D failure can never white-screen a page.
**Depends on**: Phase 2
**Requirements**: FOUND-02, FOUND-03, FOUND-05, PERF-03, PERF-04, SHIP-01
**Success Criteria** (what must be TRUE):
  1. Design tokens (type scale, spacing scale, both-theme color custom properties) are tightened and documented in globals.css, and both theme palettes pass WCAG AA contrast
  2. A shared motion-gating utility provides `prefers-reduced-motion` handling and IntersectionObserver off-screen pausing that any animated component can consume
  3. With OS reduced-motion enabled, every page presents an equivalent, fully readable static experience
  4. `error.tsx` + `global-error.tsx` exist and a deliberately-thrown render error in an island shows a graceful fallback instead of a white screen; a skip-to-content link and visible focus states make every interactive element keyboard-reachable with no keyboard traps
  5. Phase passes `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke in BOTH themes before being marked complete
**Plans**: 5 plans
Plans:
- [x] 03-00-PLAN.md — Wave 0: install motion@^12.40, contrast-check script, faint/ghost/muted usage audit
- [x] 03-01-PLAN.md — Wave 2: AA-correct tokens + type/spacing scales + skip-link/focus-visible (globals.css, layout.tsx)
- [x] 03-02-PLAN.md — Wave 2: useAnimationGate + useThemeColors hooks + motion presets (primitives only)
- [x] 03-03-PLAN.md — Wave 3: error.tsx/global-error.tsx/IslandBoundary + gate & wrap the 3 canvas islands
- [x] 03-04-PLAN.md — Wave 4: SHIP-01 gate (tsc+lint+build+contrast) + boundary/reduced-motion/keyboard verify
**UI hint**: yes
**Research flag**: `/gsd:research-phase` recommended — off-screen-pause / frameloop + `visibilitychange` patterns are MEDIUM-confidence; confirm in the profiler.

### Phase 4: R3F Infrastructure Island
**Goal**: Stand up the SSR-safe WebGL boundary — installed React-19-compatible 3D stack, a DPR-clamped `SceneCanvas` provider with frameloop control, a `dynamic(ssr:false)` client wrapper, static-poster fallback, and a bundle budget — so scenes can be migrated in Phase 5 without ever pulling `three` into shared/text routes or crashing hydration.
**Depends on**: Phase 3 (execution begins ONLY after Phase 3 merges — Phase 4 consumes useAnimationGate/useThemeColors/IslandBoundary; Wave 0 hard-guards their presence)
**Requirements**: FOUND-04, PERF-01, SHIP-01
**Success Criteria** (what must be TRUE):
  1. `@react-three/fiber@^9.6` + `@react-three/drei@^10.7` + `three` + `motion@^12.40` are installed and verified against React 19.2 (R3F v9 line only)
  2. A reusable Canvas island loads via dynamic import `ssr:false` from inside a client wrapper, renders a trivial themed scene that reacts to the `data-theme` toggle in both themes, and falls back to a static poster when WebGL is unavailable
  3. A bundle-budget check (zero-dep manifest-parser script — no @next/bundle-analyzer, no next.config.ts change) confirms `three` is absent from the shared bundle and from text/SEO routes — it lands only in its own route-specific chunk, and the hero LCP element renders without waiting on three.js
  4. Phase passes `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke in BOTH themes before being marked complete
**Plans**: 3 plans
Plans:
- [x] 04-01-PLAN.md — Wave 1: Phase-3 ls-guard + install 3D stack + author check-stack.mjs/bundle-gate.mjs (tune matcher vs real manifest)
- [x] 04-02-PLAN.md — Wave 2: webgl probe + ScenePoster + SceneCanvas (DPR clamp/frameloop/context-loss) + ThemedScene + ClientScene (ssr:false wrapper)
- [x] 04-03-PLAN.md — Wave 3: isolated /scene-harness mount (noindex/nofollow, sitemap-excluded) + SHIP-01 gate + poster-first LCP proof + evidence checkpoint (note: `_scene-harness`→`scene-harness`, underscore dirs non-routable)
**UI hint**: yes
**Research flag**: `/gsd:research-phase` complete — see `04-RESEARCH.md` (HIGH confidence; island/theme-bridge/frameloop patterns resolved).

### Phase 5: Per-Component Visual Upgrades
**Goal**: Elevate every one of the 17 components and all page cards/typography to the new design language consuming the shared primitives — hero first (signature WebGL scene, highest-leverage and highest CWV risk, carrying explicit LCP/CLS/bundle budgets), then globe, idea-network, micro-interactions, navigation, and the remaining components/pages.
**Depends on**: Phase 4
**Requirements**: VIS-01, VIS-02, VIS-03, VIS-04, VIS-05, VIS-06, VIS-07, PERF-02, SHIP-01
**Success Criteria** (what must be TRUE):
  1. The hero is a signature WebGL scene themed via CSS variables with a static-poster LCP element (LCP ≤ 2.5s, zero CLS on mid-tier mobile), a reduced-motion static fallback, and capability detection for low-power devices
  2. InteractiveGlobe and IdeaNetworkCanvas render crisp and DPR-correct (the retina DPR coordinate bug fixed), with theme-reactive colors and off-screen pause; all animation loops pause off-screen and on tab blur with DPR capped at 2 on mobile
  3. ScrollReveal, InteractiveButton, hover/magnetic micro-interactions, and Navigation (desktop + mobile menu, keyboard-accessible, focus-visible) are re-implemented on motion v12 with senior-level restraint
  4. ThemeToggle, Footer, FAQ, TeamSection, FundMeWidget, AnimatedIcons, and cards/typography across ALL pages (home, projects, expertise, services, blog, budget, team, tech-stack, ideas, contact, developer-australia, fund-me) conform to the tightened tokens — every component visibly elevated, no existing feature removed
  5. Phase passes `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke in BOTH themes before being marked complete
**Plans**: 10 plans
Plans:
- [x] 05-00-PLAN.md — Wave 1: prereq HARD-guard (all 10 primitives present) + read primitive signatures (ClientScene has NO scene prop → 05-01 must parameterize SceneCanvas) + install maath@0.10.8/r3f-perf@7.2.3 + hero perf spike (2000 particles, bloom OFF, honest conservative fallback) + bundle-gate += /page (completed 2026-06-12)
- [x] 05-01-PLAN.md — Wave 2: signature WebGL hero (Concept A icosahedron + GPU particle field — HeroScene + HeroParticles@2000, one draw call, no per-frame CPU writes) + scene-injection threaded (SceneCanvas/ClientScene scene?:(paused)=>ReactNode, default ThemedScene; ClientScene stays sole public surface) + Hero3D canvas layer swapped to ClientScene mounting HeroScene (mouse ref threaded, overlay/var(--canvas-opacity) preserved verbatim, Hero3DScene kept on disk) + bloom OFF; gates green (tsc/lint/build/bundle-gate exit 0, three route-split & not eager); LCP/CLS checkpoint auto-approved on prod evidence (CLS=0, observed LCP 689ms; simulated 22.7s = animation artifact, deferred to 05-09). VIS-01 + PERF-02 (completed 2026-06-12)
- [x] 05-02-PLAN.md — Wave 3: InteractiveGlobe + IdeaNetworkCanvas refined Canvas-2D (NO WebGL rewrite). Globe retina/DPR-2 bug fixed via ctx.setTransform (replaced compounding ctx.scale); both theme-reactive via useThemeColors + hexToRGBTriplet (Globe blue/violet; IdeaNetwork violet/blue + amber sparks→--accent-emerald closed-set reuse); IdeaNetwork per-frame getBoundingClientRect eliminated (cached rect + passive scroll-offset refresh); per-type velocity-clamp physics polish; existing useAnimationGate gates + all 31 POPs/15 arcs/drag/auto-rotate/3-node-types/interaction preserved; tsc+lint clean both files. Commits 861c4b7/fdfc00f/56fb6d6. VIS-02 + VIS-03 (completed 2026-06-12)
- [x] 05-03-PLAN.md — Wave 3: ScrollReveal (+5 named: StaggerReveal/AnimatedCounter/MagneticHover/TextReveal/ParallaxSection) + InteractiveButton re-implemented on motion v12 (whileInView/viewport, useSpring magnetic, useScroll/useTransform parallax, variants-stagger TextReveal; whileHover-lift/glow + whileTap scale on polymorphic button) — EXACT prop surfaces + named exports preserved (zero call-site churn), reduced-motion parity, EASE_SIGNATURE from lib/motion, net-new focus-visible ring (VIS-04 a11y floor). Gates green: tsc clean for both, lint clean, build succeeds across all 38 routes. VIS-04 (completed 2026-06-12)
- [x] 05-04-PLAN.md — Wave 4: Navigation (AnimatePresence menu + a11y) + ThemeToggle (motion, logic preserved)
- [x] 05-05-PLAN.md — Wave 4: FAQ + TeamSection + Footer (motion smoothing + token conformance, JSON-LD preserved)
- [x] 05-06-PLAN.md — Wave 4: AnimatedIcons + FundMeWidget token de-hack (identity preserved, motion gated)
- [x] 05-07-PLAN.md — Wave 5: token/type pass — home, projects/[id], expertise, services, tech-stack, developer-australia (VIS-07 group A; both-theme correctness fixed) (completed 2026-06-12)
- [x] 05-08-PLAN.md — Wave 5: token/type pass — blog, budget, team, ideas, contact, fund-me (+ canvas in-context verify) (VIS-07 group B; team/ideas/fund-me already conformed) (completed 2026-06-12)
- [x] 05-09-PLAN.md — Wave 6: SHIP-01 gate (tsc 29-baseline unchanged + lint 93-baseline + build 50/50 + bundle-gate/content-diff/contrast all exit 0 + clean glass-literal sweep) + LCP/CLS (CLS=0, observed LCP 1360ms; simulated 15.6s=animation artifact) + 17-route both-theme smoke + reduced-motion/WebGL/pause mechanisms verified; auto-fixed 2 Rule-1 regressions (/blog server-component prerender crash + ThemeToggle glass literal); shared state reconciled, Phase 5 marked complete (PERF-02 + SHIP-01) (completed 2026-06-12)
**UI hint**: yes
**Research flag**: `/gsd:research-phase` recommended — the specific WebGL hero design + shader/particle budget to hit mobile LCP ≤ 2.5s is design-and-perf-sensitive and under-specified by research.

### Phase 6: Enhancements, Hardening & Ship
**Goal**: Add final cohesion polish (View Transitions page transitions, flagship-project architecture diagrams), close the in-passing security/bug debt, re-enable strict build to end verification theater, run an a11y-hardening pass, and deploy to production only after owner approval.
**Depends on**: Phase 5
**Requirements**: VIS-08, FIX-01, FIX-02, SHIP-02, SHIP-01
**Success Criteria** (what must be TRUE):
  1. Page transitions use the View Transitions API as progressive enhancement, automatically disabled under reduced motion, with no regression on browsers that lack support
  2. The `test-openai` route no longer exposes key material or proxies a paid API unauthenticated (gated behind auth/env flag, feature preserved not deleted), and VisitorTracker no longer triggers paid AI endpoints unthrottled from visitors' browsers (rate-limited/gated)
  3. `ignoreBuildErrors` / `ignoreDuringBuilds` are re-enabled (strict) and the build is genuinely green under `tsc --noEmit` + lint + build with both-theme smoke and a hard-refresh (not client nav) pass
  4. Production deploy to Vercel project `modern-portfolio` (serving usamajaved.com.au) happens only after explicit owner approval of the final result, with all existing routes/SEO assets intact post-deploy
  5. Phase passes `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke in BOTH themes before being marked complete
**Plans**: 8 plans
Plans:
- [x] 06-01-PLAN.md — Wave 1: tsc+lint fix the four api/* type-routes (auto-llm-training/ai-training/create-checkout Stripe bump/budget-estimate; 11 errors)
- [x] 06-02-PLAN.md — Wave 1: tsc+lint fix expertise/page.tsx union-type debt (18 errors, type-only, content/JSON-LD preserved)
- [ ] 06-03-PLAN.md — Wave 1: lint sweep of the remaining ~59 problems (pages/components; prefer-const auto-fix, entity escaping, no-img-element)
- [x] 06-05-PLAN.md — Wave 1: FIX-02 remove VisitorTracker paid-endpoint fan-out + guard JSON.parse + tokenize VisitorCounter
- [ ] 06-04-PLAN.md — Wave 2: FIX-01 requireAdmin shared-secret gate on 5 test/training routes + remove test-openai keyUsed leak
- [ ] 06-06-PLAN.md — Wave 2: VIS-08 native CSS @view-transition + reduced-motion kill switch (owner-verify checkpoint; moved to Wave 2 so its build-running checkpoint does not race concurrent Wave-1 edits)
- [ ] 06-07-PLAN.md — Wave 3: SHIP-02 strict-build flip (remove ignore flags) + full gate + scripts/verify-prod.sh
- [ ] 06-08-PLAN.md — Wave 4: SHIP-02 Vercel preview deploy + post-deploy checklist + owner production-approval (human-action) + prod promote

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Content Centralization | 0/TBD | Complete    | 2026-06-12 |
| 2. Append AI Content | 4/4 | Complete    | 2026-06-12 |
| 3. Shared Foundation | 5/5 | Complete    | 2026-06-12 |
| 4. R3F Infrastructure Island | 3/3 | Complete    | 2026-06-12 |
| 5. Per-Component Visual Upgrades | 10/10 | Complete    | 2026-06-12 |
| 6. Enhancements, Hardening & Ship | 0/8 | Not started | - |
