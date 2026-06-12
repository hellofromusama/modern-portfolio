---
phase: 02-append-ai-content
plan: 03
subsystem: ui
tags: [next, react, server-component, svg, json-ld, metadata, mcp, navigation]

# Dependency graph
requires:
  - phase: 01-content-centralization
    provides: CSS-var theme token system + server-page metadata/JSON-LD conventions
provides:
  - /ai-engineering server route telling the ESIA MCP case study (Problem -> Architecture -> v1/v2 -> Trade-offs)
  - AiBridgeDiagram theme-aware inline SVG of the 6-step MCP query flow
  - AI Engineering nav link (desktop + mobile) wired into Navigation.tsx
affects: [phase-03-motion, phase-05-nav-visual-upgrades, seo]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Theme-aware inline JSX SVG using only CSS custom-property tokens (var(--...)) for stroke/fill so light + dark themes work from one source"
    - "New SEO surface as a server route exporting its own metadata + page-level TechArticle JSON-LD referencing the Person @id"

key-files:
  created:
    - src/components/AiBridgeDiagram.tsx
    - src/app/ai-engineering/page.tsx
  modified:
    - src/components/Navigation.tsx

key-decisions:
  - "Diagram laid out as a vertical 6-box stack (not horizontal) so it stays legible on narrow viewports within the responsive viewBox"
  - "Page styled with CSS-var tokens + inline style props rather than Tailwind theme colours, matching the theme-aware mandate (blog/page.tsx's slate-* classes were NOT copied)"

patterns-established:
  - "Pattern 1: CSS-var-only SVG diagrams for theme safety (role=img + aria-label + reusable marker arrowhead)"
  - "Pattern 2: AI/case-study server route = metadata export + JSON-LD script + Navigation + narrative sections, all CSS-var themed"

requirements-completed: [AICON-01, AICON-02, AICON-03, SEO-02, SHIP-01]

# Metrics
duration: 3min
completed: 2026-06-12
---

# Phase 02 Plan 03: AI Engineering Experience Surface Summary

**A server-rendered /ai-engineering route telling the ESIA MCP-server production story with a theme-aware inline SVG of the 6-step NetSuite query flow, page-level metadata + TechArticle JSON-LD, and a new main-nav link.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-12T02:04:14Z
- **Completed:** 2026-06-12T02:06:50Z
- **Tasks:** 3
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments
- Built AiBridgeDiagram.tsx: a static, accessible inline SVG of the 6-step MCP bridge (Marketing UI -> MCP Server -> OAuth + NetSuite API -> SuiteScript RESTlet -> Ollama LLM -> Answer in UI), themed entirely through CSS custom-property tokens so it renders correctly in both light and dark modes.
- Created the /ai-engineering server route: unique metadata, TechArticle JSON-LD referencing the Person @id, Navigation, the diagram, and the ESIA narrative structured as Problem -> Architecture (with the numbered 6-step flow) -> v1/v2 LangGraph evolution -> Trade-offs (the 3 production fixes).
- Added a single "AI Engineering" entry to Navigation's navItems (placed after Home), rendered by both the desktop and mobile menus from the shared array.

## Task Commits

Each task was committed atomically:

1. **Task 1: Theme-aware SVG architecture diagram** - `0e3302e` (feat)
2. **Task 2: /ai-engineering server route (narrative + diagram + metadata + JSON-LD)** - `2a6cce8` (feat)
3. **Task 3: AI Engineering nav item** - `c50894d` (feat)

**Plan metadata:** _(final docs commit below)_

## Files Created/Modified
- `src/components/AiBridgeDiagram.tsx` - Inline JSX SVG of the 6-step MCP bridge; CSS-var-themed strokes/fills, role="img" + aria-label, reusable arrowhead marker, Space Grotesk font token. No animation (motion infra lands Phase 3).
- `src/app/ai-engineering/page.tsx` - Server component route: metadata export, TechArticle JSON-LD, Navigation, AiBridgeDiagram, and the verified-fact ESIA MCP narrative (6-step flow, v1->v2 LangGraph + chunking, 3 production fixes).
- `src/components/Navigation.tsx` - One new navItems entry `{ href: '/ai-engineering', label: 'AI Engineering' }` after Home.

## Decisions Made
- Vertical 6-box diagram layout for narrow-viewport legibility within a responsive viewBox.
- Used CSS-var tokens + inline styles for the page rather than copying blog/page.tsx's Tailwind slate-* hero classes, honouring the both-themes theme-token mandate.

## Deviations from Plan

None - plan executed exactly as written.

The three "collapse to ~6 boxes" allowances in the plan were applied as intended (OAuth + NetSuite API as one box; SuiteScript RESTlet + DB query as one box), which is the plan's own suggested collapse, not a deviation.

## Issues Encountered
- The Bash tool runs bash (not PowerShell), so the plan's `Select-String` verify command was not directly runnable. Resolved by running `tsc --noEmit -p tsconfig.json` against the whole project and filtering with `grep -i "<filename>"` — equivalent verification confirming no error in each target file.

## Content Verification
- AiBridgeDiagram uses 9 `var(--...)` colour tokens; zero hardcoded hex theme colours in stroke/fill.
- /ai-engineering route imports + renders AiBridgeDiagram, exports metadata, and emits an `application/ld+json` script.
- Navigation contains exactly one `/ai-engineering` link; existing entries unchanged.
- No "Horizon" or "interview" strings (case-insensitive) in any of the three files.
- Only verified ESIA facts used: ESIA Perth Senior Systems Developer, Ollama<->NetSuite MCP server, 6-step flow, v1/v2 LangGraph + chunking, 250-record batching/governance limits, leads-vs-customers system-prompt disambiguation, pagination through batches. No invented metrics, no percentage bars.

## Next Phase Readiness
- AI Engineering surface is live and discoverable from the main nav. SEO metadata + JSON-LD in place (SEO-02).
- Phase 3 (motion) can add scroll/entrance animation to the diagram and sections; the diagram was intentionally left static this phase.
- Note (out of scope, pre-existing): the hardcoded inline nav in `projects/[id]/page.tsx` does not include the new link — Phase 5 owns nav visual upgrades.

## Self-Check: PASSED

All created files verified on disk; all three task commits verified in git history.

---
*Phase: 02-append-ai-content*
*Completed: 2026-06-12*
