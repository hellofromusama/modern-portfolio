# Requirements — World-Class Portfolio Upgrade

**Defined:** 2026-06-12
**Mode:** auto (table stakes + owner brief)
**Core value check:** Visitor visually stunned in 3s AND immediately sees senior full-stack + production AI engineer. Additive only.

## v1 Requirements

### Foundation (FOUND)

- [x] **FOUND-01**: All projects, skills, and expertise content live in a single typed content module (`src/content/`) consumed by the home grid, `projects/[id]`, layout JSON-LD, and `sitemap.ts` — every existing entry preserved verbatim (diff-verified against the four current sources)
- [x] **FOUND-02**: A shared motion-gating utility (hook/wrapper) provides `prefers-reduced-motion` handling and IntersectionObserver-based off-screen pausing, used by every animated component
- [x] **FOUND-03**: Design tokens (type scale, spacing scale, color custom properties for both themes) are tightened and documented in globals.css; both theme palettes pass WCAG AA contrast
- [x] **FOUND-04**: three + @react-three/fiber@^9.6 + @react-three/drei@^10.7 + motion@^12.40 installed (React 19.2-verified); 3D scenes load via dynamic import `ssr:false` from inside client wrappers with static fallbacks
- [x] **FOUND-05**: Error boundaries wrap every WebGL/canvas island so a 3D failure can never white-screen a page

### AI Content (AICON)

- [x] **AICON-01**: An AI Engineering experience section presents the ESIA MCP server story: Ollama ↔ NetSuite via OAuth + SuiteScript RESTlet, with the 6-step query flow rendered visually
- [x] **AICON-02**: The v1 → v2 evolution (simple fetch → LangGraph multi-step reasoning with intelligent chunking) and the three production fixes (250-record batching, leads-vs-customers system prompts, pagination) are presented as a production-engineering narrative
- [x] **AICON-03**: An architecture diagram (SVG) visualizes the MCP bridge system
- [x] **AICON-04**: 5 new AI projects are APPENDED to the existing project list with detail pages: MCP NetSuite-Ollama Bridge, LinkedIn Job Auto-Apply Agent, Self-Learning Social Media Generator, n8n Marketing Research Workflows, Healthcare Voice Agent (Ollama/FastAPI/n8n) — existing projects untouched
- [x] **AICON-05**: AI skill domains are APPENDED to existing skills/expertise (MCP/A2A/ACP, RAG pipelines, vector DBs, embeddings/rerankers, LangChain/LangGraph/CrewAI/AutoGen/Semantic Kernel, LLM memory, prompt engineering & injection defense, FastAPI/Python, AWS AI stack, LLM observability) — grouped by domain and tied to real projects, no percentage bars
- [x] **AICON-06**: No Horizon Digital research or interview-prep content appears anywhere on the site

### Visual Upgrades (VIS)

- [x] **VIS-01**: Hero upgraded to a signature WebGL scene (R3F) themed via CSS variables, with reduced-motion static fallback and capability detection for low-power devices
- [x] **VIS-02**: InteractiveGlobe upgraded (WebGL or refined canvas) with crisp DPR-correct rendering, theme-reactive colors, off-screen pause
- [x] **VIS-03**: IdeaNetworkCanvas upgraded with the retina DPR coordinate bug fixed, physics polish, theme-reactive colors, off-screen pause
- [x] **VIS-04**: ScrollReveal and micro-interactions (InteractiveButton, hover states, magnetic effects) re-implemented on motion v12 with senior-level restraint
- [ ] **VIS-05**: Navigation upgraded: refined desktop nav + mobile menu with polished open/close choreography, keyboard accessible, focus-visible states
- [x] **VIS-06**: ThemeToggle, Footer, FAQ, TeamSection, FundMeWidget, AnimatedIcons visually elevated to the new design language (every one of the 17 components touched)
- [x] **VIS-07**: Cards and typography across ALL pages (home, projects, expertise, services, blog, budget, team, tech-stack, ideas, contact, developer-australia, fund-me) conform to the tightened design tokens
- [ ] **VIS-08**: Smooth page transitions via the View Transitions API as progressive enhancement, disabled under reduced motion

### Performance & Accessibility (PERF)

- [x] **PERF-01**: Core Web Vitals do not regress: WebGL/3D code is route-split and lazy; hero LCP element renders without waiting on three.js
- [x] **PERF-02**: All animation loops pause when off-screen and on tab blur; mobile devices get DPR caps and capability-appropriate scenes
- [x] **PERF-03**: Every interactive element is keyboard-reachable with a visible focus state; no keyboard traps introduced by new motion
- [x] **PERF-04**: OS-level prefers-reduced-motion produces an equivalent, fully readable static experience on every page

### Fixes in Passing (FIX)

- [ ] **FIX-01**: test-openai route no longer exposes any key material and is no longer an unauthenticated paid-API proxy (gated or disabled — feature preserved behind auth/env flag, not deleted)
- [ ] **FIX-02**: VisitorTracker no longer triggers paid AI endpoints unthrottled from visitors' browsers (rate-limited/gated)
- [x] **FIX-03**: projects/[id] implements generateStaticParams + generateMetadata from the centralized content source (every project slug preserved)

### SEO Preservation (SEO)

- [x] **SEO-01**: All existing routes, slugs, JSON-LD entities, sitemap entries, robots rules, and AI-SEO/IndexNow routes remain functional and unchanged in URL space
- [x] **SEO-02**: New AI content (experience section, 5 project detail pages) gets metadata, JSON-LD, and sitemap entries from the centralized source

### Ship (SHIP)

- [x] **SHIP-01**: Each phase passes `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke in BOTH themes before being marked complete
- [ ] **SHIP-02**: Production deploy to Vercel project `modern-portfolio` happens only after owner approval of the final result

## v2 Requirements (Deferred)

- **V2-01**: Loom/video walkthroughs embedded per flagship AI project — content production, not code
- **V2-02**: Observability/trace screenshots (Langfuse-style) in AI case studies — requires capturing real traces first
- **V2-03**: Custom branded cursor / signature motif — high overdo-risk; revisit after core upgrade ships
- **V2-04**: Test suite buildout (vitest + Playwright) — separate quality milestone

## Out of Scope

- Removing ANY existing page, project, capability, SEO asset, or integration — owner mandate after rejected rebuild
- Horizon Digital research / interview-prep content — private, reputational risk
- Scroll-jacking, mandatory preloaders, percentage skill bars, autoplaying audio, deep stacked parallax — anti-features that undercut the "world best UI" claim
- Design minimalization — owner wants higher-fidelity motion, not less
- Replacing Stripe/fund-me/email flows — working integrations, visual polish only

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FIX-03 | Phase 1 | Complete |
| SEO-01 | Phase 1 | Complete |
| AICON-01 | Phase 2 | Complete |
| AICON-02 | Phase 2 | Complete |
| AICON-03 | Phase 2 | Complete |
| AICON-04 | Phase 2 | Complete |
| AICON-05 | Phase 2 | Complete |
| AICON-06 | Phase 2 | Complete |
| SEO-02 | Phase 2 | Complete |
| FOUND-02 | Phase 3 | Complete |
| FOUND-03 | Phase 3 | Complete |
| FOUND-05 | Phase 3 | Complete |
| PERF-03 | Phase 3 | Complete |
| PERF-04 | Phase 3 | Complete |
| FOUND-04 | Phase 4 | Complete |
| PERF-01 | Phase 4 | Complete |
| VIS-01 | Phase 5 | Complete (05-01) |
| VIS-02 | Phase 5 | Complete (05-02) |
| VIS-03 | Phase 5 | Complete (05-02) |
| VIS-04 | Phase 5 | Complete (05-03) |
| VIS-05 | Phase 5 | Pending |
| VIS-06 | Phase 5 | Complete |
| VIS-07 | Phase 5 | Complete |
| PERF-02 | Phase 5 | Complete (05-01) |
| VIS-08 | Phase 6 | Pending |
| FIX-01 | Phase 6 | Pending |
| FIX-02 | Phase 6 | Pending |
| SHIP-02 | Phase 6 | Pending |
| SHIP-01 | All phases (cross-cutting gate) | Complete |

---
*Generated in auto mode from research/FEATURES.md + owner brief*
