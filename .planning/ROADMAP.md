# Roadmap: Usama Javed Portfolio — World-Class Upgrade

## Overview

This milestone elevates a live, SEO-indexed Next.js 15 portfolio to Awwwards-tier craft while proving the rare second half of the owner's Core Value — *production* AI engineering — all additively, removing nothing. The journey is **dependency-ordered and foundations-first**: first consolidate the 4-way-duplicated content into one typed source (the spine everything else renders from), then append the AI projects/skills/experience narrative, then build the shared motion/theme/error primitives, stand up the R3F (WebGL) island infrastructure, upgrade every visual component in place behind those primitives (hero first, highest-leverage and highest-risk), and finally add cohesion polish, fix security/bugs in passing, close the verification-theater debt, and deploy on owner approval. The dominant risk is *regression, not greenfield mistakes* — so every phase is gated by `tsc --noEmit` + lint + build + both-theme manual smoke (SHIP-01), and a prior from-scratch rebuild that was rolled back makes "additive, verbatim-preserving" non-negotiable.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Content Centralization** - Single typed content source (verbatim + baseline-diff gated), wired into grid, detail pages, JSON-LD, sitemap
- [ ] **Phase 2: Append AI Content** - 5 AI projects, AI skill domains, and the ESIA/MCP production narrative appended additively
- [ ] **Phase 3: Shared Foundation** - Design tokens + motion/theme/in-view primitives + error boundaries + a11y floor
- [ ] **Phase 4: R3F Infrastructure Island** - Installed React-19-compatible 3D stack + SSR-safe Canvas island with bundle budget
- [ ] **Phase 5: Per-Component Visual Upgrades** - Signature WebGL hero + every component/page elevated to the new design language
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
**Plans**: TBD

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
**Plans**: TBD
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
**Plans**: TBD
**UI hint**: yes
**Research flag**: `/gsd:research-phase` recommended — off-screen-pause / frameloop + `visibilitychange` patterns are MEDIUM-confidence; confirm in the profiler.

### Phase 4: R3F Infrastructure Island
**Goal**: Stand up the SSR-safe WebGL boundary — installed React-19-compatible 3D stack, a DPR-clamped `SceneCanvas` provider with frameloop control, a `dynamic(ssr:false)` client wrapper, static-poster fallback, and a bundle budget — so scenes can be migrated in Phase 5 without ever pulling `three` into shared/text routes or crashing hydration.
**Depends on**: Phase 3
**Requirements**: FOUND-04, PERF-01, SHIP-01
**Success Criteria** (what must be TRUE):
  1. `@react-three/fiber@^9.6` + `@react-three/drei@^10.7` + `three` + `motion@^12.40` are installed and verified against React 19.2 (R3F v9 line only)
  2. A reusable Canvas island loads via dynamic import `ssr:false` from inside a client wrapper, renders a trivial themed scene that reacts to the `data-theme` toggle in both themes, and falls back to a static poster when WebGL is unavailable
  3. A bundle-analyzer check confirms `three` is absent from the shared bundle and from text/SEO routes — it lands only in its own route-specific chunk, and the hero LCP element renders without waiting on three.js
  4. Phase passes `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke in BOTH themes before being marked complete
**Plans**: TBD
**UI hint**: yes
**Research flag**: `/gsd:research-phase` recommended — the CSS-var→WebGL theme bridge (`getComputedStyle` + `MutationObserver`) and frameloop control are MEDIUM-confidence; spike during planning.

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
**Plans**: TBD
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
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Content Centralization | 0/TBD | Not started | - |
| 2. Append AI Content | 0/TBD | Not started | - |
| 3. Shared Foundation | 0/TBD | Not started | - |
| 4. R3F Infrastructure Island | 0/TBD | Not started | - |
| 5. Per-Component Visual Upgrades | 0/TBD | Not started | - |
| 6. Enhancements, Hardening & Ship | 0/TBD | Not started | - |
