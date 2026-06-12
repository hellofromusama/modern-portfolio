# Usama Javed Portfolio — World-Class Upgrade

## What This Is

The live personal portfolio of Usama Javed (usamajaved.com.au) — Senior Full Stack Developer & AI Engineer in Perth. A feature-rich Next.js 15 site with hand-built 3D/canvas animations, a blog, services, fund-me widget, and extensive AI-SEO infrastructure. This milestone upgrades every component to a world-class modern UI standard and adds his AI engineering experience — without removing anything that exists today.

## Core Value

A visitor (recruiter, client, hiring manager) is visually stunned within 3 seconds and immediately understands Usama is both a senior full-stack developer AND a production AI engineer — every existing capability preserved, every pixel elevated.

## Requirements

### Validated

<!-- Inferred from existing codebase (see .planning/codebase/ARCHITECTURE.md) -->

- ✓ Home page with hero + canvas "3D" animation (Hero3D/Hero3DScene) — existing
- ✓ Interactive globe and idea network canvas animations — existing
- ✓ Theme toggle (light/dark via data-theme + CSS custom properties) — existing
- ✓ Projects list + project detail pages (projects/[id]) — existing
- ✓ Expertise, services, tech-stack, team, budget, ideas, developer-australia pages — existing
- ✓ Blog with SEO-targeted posts (ai-developer-perth, best-developer-perth) — existing
- ✓ Contact page with EmailJS + nodemailer email delivery — existing
- ✓ Fund-me widget + Stripe checkout flow — existing
- ✓ SEO infrastructure: sitemap.ts, robots.ts, JSON-LD, AI-training API routes, IndexNow — existing
- ✓ Scroll reveal animations and interactive buttons — existing

### Active

<!-- This milestone -->

- [ ] Every visual component upgraded to elite modern standard (Hero3D/Hero3DScene, InteractiveGlobe, IdeaNetworkCanvas, ScrollReveal, Navigation, AnimatedIcons, InteractiveButton, ThemeToggle, Footer, FAQ, TeamSection, FundMeWidget, cards/typography on all pages)
- [ ] Real WebGL/3D upgrades where they raise quality (three + @react-three/fiber v9, motion v12) — React 19 compatible versions only
- [ ] All animations respect prefers-reduced-motion and pause when off-screen
- [ ] AI Engineer experience section added: ESIA MCP server (Ollama ↔ NetSuite via OAuth + SuiteScript RESTlet; v1 → v2 LangGraph multi-step reasoning with chunking; production fixes: 250-record batching, leads-vs-customers system prompts, pagination)
- [ ] 5 new AI projects APPENDED to existing project lists: MCP NetSuite-Ollama Bridge, LinkedIn Job Auto-Apply Agent, Self-Learning Social Media Generator, n8n Marketing Research Workflows, Healthcare Voice Agent (Ollama/FastAPI/n8n)
- [ ] AI skills APPENDED to existing skills: MCP/A2A/ACP, RAG pipelines, vector DBs, embeddings/rerankers, LangChain/LangGraph/CrewAI/AutoGen/Semantic Kernel, LLM memory, prompt engineering & injection defense, FastAPI/Python, AWS AI stack, LLM observability
- [ ] Content centralized into a single data source (consumed by page.tsx, projects/[id], JSON-LD, sitemap) — all existing entries preserved verbatim
- [ ] Security fixes in passing: test-openai key exposure + unauthenticated proxying, VisitorTracker unthrottled paid calls
- [ ] Bug fixes in passing: IdeaNetworkCanvas retina DPR bug, projects/[id] generateStaticParams/generateMetadata
- [ ] Production deploy to Vercel project modern-portfolio — only after owner approval

### Out of Scope

- Removing ANY existing page, project, capability, SEO asset, or integration — owner mandate: additive only (prior from-scratch rebuild was rejected and rolled back)
- Horizon Digital company research / interview-prep content — private material, reputational risk if published
- Simplifying/minimalizing the design — owner explicitly wants MORE polish and motion, not less
- Test suite buildout — valuable but separate; this milestone uses tsc+lint+build+manual smoke as gates
- Replacing the donation/fund-me or Stripe flows — working features, keep as-is (visual polish only)

## Context

- **Codebase map:** .planning/codebase/ (7 docs) — read STACK.md, ARCHITECTURE.md, CONVENTIONS.md, CONCERNS.md before planning any phase.
- All visuals are hand-rolled Canvas 2D + requestAnimationFrame with manual 3D math; no WebGL today. AnimatedIcons/ThemeToggle are pure CSS.
- Theming: CSS custom properties (`--bg-*`, `--text-*`) + `data-theme` attribute, NOT Tailwind `dark:`. All 17 components are 'use client'.
- Content is hardcoded and duplicated: projects in page.tsx, projects/[id]/page.tsx, layout JSON-LD, sitemap.ts; skills in page.tsx + expertise/page.tsx.
- next.config.ts ignores TS/ESLint errors during build — verification must run `npx tsc --noEmit` and `npm run lint` explicitly.
- History: a from-scratch portfolio rebuild was deployed on 2026-06-10, rejected by owner, and rolled back same day. The owner's standard: "world best modern UI" — enhancement of what exists, never replacement.
- Owner background to feature: 5 yrs JS/full-stack → 2 yrs AI engineering; Senior Systems Developer at Ear Science Institute Australia (Perth).

## Constraints

- **Compatibility**: React 19.2.4 — requires @react-three/fiber v9 and motion v12 if added; verify all new deps support React 19
- **Tech stack**: Next.js 15 App Router + Tailwind v4 CSS-first + TS — no framework changes
- **Content**: Additive only; existing entries preserved verbatim when centralizing
- **Privacy**: No Horizon Digital research or interview-prep content anywhere public
- **Performance**: Animations must pause off-screen and respect prefers-reduced-motion; mobile performance is first-class
- **Verification**: tsc + lint + build + manual smoke in BOTH themes per phase (build alone passes with errors)
- **Deploy**: Vercel project `modern-portfolio` (serves usamajaved.com.au); production deploy gated on owner approval

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Enhance existing site, never rebuild | Owner rejected from-scratch rebuild; existing site has SEO equity + features | ✓ Good |
| Allow three/@react-three/fiber + motion for upgrades | Canvas 2D ceiling too low for "world best" bar; React 19-compatible versions exist | — Pending |
| Centralize duplicated content into one data source | 4-way duplication is the #1 maintenance risk while adding AI content | — Pending |
| Fix security/bugs in passing, not separate phase | Touching those files anyway; keeps phases cohesive | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-12 after initialization*
