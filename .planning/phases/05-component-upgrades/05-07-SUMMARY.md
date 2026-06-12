---
phase: 05-component-upgrades
plan: 07
subsystem: ui
tags: [tokens, design-system, theming, css-variables, cards, typography, light-theme, seo-preservation]

# Dependency graph
requires:
  - phase: 03-shared-foundation
    provides: "Phase-3 tightened token scales (--bg-card/--border-subtle/--shadow-card, --text-primary/secondary/tertiary/muted, --space-*, --text-* type scale) — single source of truth in globals.css"
  - phase: 05-03
    provides: "Finalized ScrollReveal/StaggerReveal/AnimatedCounter/InteractiveButton public APIs (motion v12) — home page inherits these upgrades with zero churn"
  - phase: 05-05
    provides: "Footer/FAQ/TeamSection card-elevation convention this pass mirrors on pages"
provides:
  - "6 of 12 routes (home, projects/[id], expertise, services, tech-stack, developer-australia) conformed to the tightened design tokens"
  - "Hardcoded slate/glass/raw-Tailwind-color literals on these pages replaced with CSS-var tokens — light theme now correct (expertise/services/tech-stack/projects-detail were previously dark-only or light-only and broke in the opposite theme)"
  - "Unified card hover-elevation (hover:-translate-y-1 + bg-card/border-subtle/shadow-card) across all card surfaces on these routes"
  - "All server-page SEO assets (metadata, JSON-LD, generateStaticParams/generateMetadata, slugs, copy, data objects) preserved byte-for-byte — only className/style changed"
affects: [05-08, 05-09, page.tsx, projects, expertise, services, tech-stack, developer-australia]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Page-level token card convention: background var(--bg-card) + 1px var(--border-subtle) + box-shadow var(--shadow-card) + rounded-xl/2xl + transition-all duration-500 hover:-translate-y-1"
    - "Two-tone heading pattern: font-[family-name:var(--font-space-grotesk)] with --text-primary base + --text-secondary accent line; body copy on --text-secondary/tertiary/muted"
    - "SEO-safe visual-only edit: on server pages, touch className/style exclusively; never alter metadata/JSON-LD/generateStaticParams/copy/data (verified via grep-diff gate)"
    - "Content-vs-chrome distinction: per-item accent classes that live in DATA arrays (e.g. tech.color, project.gradient) are preserved as content; only structural chrome literals are tokenized"

key-files:
  created:
    - .planning/phases/05-component-upgrades/05-07-SUMMARY.md
  modified:
    - src/app/page.tsx
    - src/app/projects/[id]/page.tsx
    - src/app/expertise/page.tsx
    - src/app/services/page.tsx
    - src/app/tech-stack/page.tsx
    - src/app/developer-australia/page.tsx

key-decisions:
  - "home (page.tsx) + developer-australia were ALREADY token-conformant from earlier work — for those the only change was UNIFYING the hover lift: added hover:-translate-y-1 to home stat+skill cards (project cards already had it) and added box-shadow:var(--shadow-card)+hover lift to developer-australia city/CTA cards. No literal replacements needed (verified grep-clean already)."
  - "expertise/services were the worst LIGHT-only offenders (bg-white root + text-slate-900 cards) — would render broken in dark theme; tech-stack/projects-detail were DARK-only (slate-900/50 + slate-700 borders) — would render broken in light theme. Tokenizing root/cards/text fixes both-theme correctness in one pass (VIS-07 core goal)."
  - "Accent-gradient banner CTAs (bg-gradient-to-r from-blue-600 to-purple-600 with white text + hover:bg-slate-100 button) on expertise/services were KEPT as intentional brand decoration — they sit on a self-contained colored band, are theme-independent, and match the home InteractiveButton primary-gradient identity. Not tokenized (would lose the signature look)."
  - "bg-clip-text accent gradients and content-driven literals (project.gradient, tech.color, image bg-black/20 overlays) preserved verbatim — these are decoration/content, not theme chrome."
  - "Mapped legacy ad-hoc Tailwind accent shades to the closed brand accent set used elsewhere (purple-400/500 -> violet-400, green-400/600/700 -> emerald-400/500, orange-400 -> amber-400, slate-300/400 captions -> var(--text-secondary/muted)) for visual consistency with the rest of the upgraded site."

patterns-established:
  - "Pattern 1: every card surface on a conformed page = bg-card + border-subtle + shadow-card + unified hover:-translate-y-1 lift"
  - "Pattern 2: server-page token pass touches className/style ONLY — SEO assets proven unchanged via git-diff grep gate before commit"

requirements-completed: [VIS-07]

# Metrics
duration: 8 min
completed: 2026-06-12
---

# Phase 5 Plan 7: Token + Typography Conformance (Pages Group A) Summary

**6 of the 12 routes (home, projects/[id], expertise, services, tech-stack, developer-australia) conformed to the Phase-3 tightened design tokens — slate/glass/raw-color literals replaced with CSS-var card surfaces and two-tone Space-Grotesk headings, hover-elevation unified to the standard -translate-y-1 lift, both themes now correct (expertise/services were light-only, tech-stack/projects-detail dark-only), and every server-page SEO asset preserved byte-for-byte.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-12T07:05Z
- **Completed:** 2026-06-12T07:13Z
- **Tasks:** 2
- **Files modified:** 6 (source) + 1 (summary)

## Accomplishments
- **expertise/page.tsx** — the biggest fix: removed `bg-white` root + `text-slate-900` light-only cards; tokenized hero, all `technicalExpertise` tech cards + `sectors` cards, certifications grid, and headings. Confirmed NO percentage skill bars (anti-feature already absent, kept absent). Expertise JSON-LD + metadata + both data objects preserved verbatim.
- **tech-stack/page.tsx** — dark-only `slate-900/50` cards + `slate-700` borders across techStack/features/performance-metrics/architecture sections all tokenized to `bg-card`/`border-subtle`/`shadow-card` with unified hover lift; nav links and slate body text tokenized; `tech.color` content accents preserved.
- **projects/[id]/page.tsx** — server detail page chrome (nav, slate hero text, tech-stack pills, challenges/results cards, CTA) tokenized; `generateStaticParams`, `generateMetadata`, `getProject` content, and `project.gradient`/image overlays untouched.
- **services/page.tsx** — `bg-white` root + slate service-grid cards + process section tokenized, unified hover, two-tone headings; serviceSchema JSON-LD + metadata preserved.
- **page.tsx (home, client)** — already fully tokenized; unified the hover lift by adding `hover:-translate-y-1` to stat + skill cards to match the project cards' standard lift. Inherits 05-03 ScrollReveal/InteractiveButton upgrades — verified nothing broke.
- **developer-australia/page.tsx** — already fully tokenized; added `box-shadow: var(--shadow-card)` + unified hover lift to city cards and the CTA card to complete the standard card-surface convention. JSON-LD (Article + FAQPage) + metadata untouched.

## Task Commits

Each task was committed atomically (parallel-executor protocol: `--no-verify`, explicit per-file staging, never `git add -A`):

1. **Task 1: Home + projects/[id] + expertise — token cards & type** - `027978c` (feat)
2. **Task 2: services + tech-stack + developer-australia — token cards & type** - `084a63f` (feat)

_Note: skipped shared counters and `npm run build` per parallel-execution mandate (wave-final 05-09 reconciles + validates)._

## Files Created/Modified
- `src/app/page.tsx` - unified hover lift on stat + skill cards (already token-conformant otherwise)
- `src/app/projects/[id]/page.tsx` - nav/chrome/cards/text tokenized; SEO/content/gradient preserved
- `src/app/expertise/page.tsx` - root/hero/tech+sector cards/certs tokenized (was light-only); JSON-LD + data verbatim; no % bars
- `src/app/services/page.tsx` - root/hero/service-grid/process tokenized (was light-only); serviceSchema preserved
- `src/app/tech-stack/page.tsx` - all card sections + nav tokenized (was dark-only); tech.color content accents preserved
- `src/app/developer-australia/page.tsx` - added shadow-card + hover lift to city/CTA cards (already tokenized)

## Decisions Made
See `key-decisions` frontmatter. Headlines: home + developer-australia were already tokenized (only hover/shadow unification applied, no literal swaps); expertise/services were light-theme-only and tech-stack/projects-detail were dark-theme-only — the token pass makes all four correct in BOTH themes (VIS-07). Accent-gradient banner CTAs and content-driven literals (`project.gradient`, `tech.color`) deliberately preserved as brand decoration/content. Legacy ad-hoc accent shades remapped to the closed brand set (violet/emerald/amber) for site-wide consistency.

## Deviations from Plan

None - plan executed exactly as written. The plan correctly anticipated that home would "inherit the ScrollReveal/InteractiveButton upgrades automatically" and that the convention is applied to className/style only. The one nuance worth noting (not a deviation): home and developer-australia required only hover/shadow UNIFICATION rather than literal replacement because prior waves had already tokenized their card surfaces — the plan's "conform to tightened tokens" goal was satisfied by completing the unified hover-elevation contract on those two.

## Issues Encountered

**Pre-existing tsc errors in expertise/page.tsx (out of scope, untouched).** `npx tsc --noEmit` reports 18 errors in `expertise/page.tsx` — all in the data-iteration type logic (`category.technologies` / `category.sectors` access on a union type + cascading implicit-`any` params). These are the documented Phase-6-owned baseline errors. Verified identical count (18) before and after my edits via `git stash` diff — my token edits (className/style only) introduced ZERO new errors. Both task verification gates (`tsc | grep <my-files>` excluding pre-existing patterns) and the explicit baseline-count check confirmed NO new errors across all 6 files.

**Parallel write awareness.** During a `git stash` baseline check, the working tree showed `blog/page.tsx`, `budget/page.tsx`, `contact/page.tsx` modified — these belong to the parallel 05-08 executor. Handled correctly: every commit used explicit per-file `git add` of only my 6 files; the parallel agent's files were never staged or touched.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- 6 of 12 routes (group A) conform to the tightened tokens, both themes correct. The remaining 6 routes (blog/budget/team/ideas/contact/fund-me) are 05-08's scope (file-disjoint parallel).
- VIS-07 partially advanced (group A complete); 05-09 (wave-final) runs the full `tsc + lint + build` gate, reconciles shared counters, and performs the both-theme manual smoke across all 12 routes.
- No blockers. Verification evidence: all 6 files grep-clean of `bg-white/[0` + `border-white/[0` glass literals and slate-* chrome literals (CTA-banner `hover:bg-slate-100` on colored bands intentionally retained); SEO-asset git-diff gate returned NONE_CHANGED for projects/[id], expertise, services, and developer-australia.

## Self-Check: PASSED

- Files: FOUND src/app/page.tsx, src/app/projects/[id]/page.tsx, src/app/expertise/page.tsx, src/app/services/page.tsx, src/app/tech-stack/page.tsx, src/app/developer-australia/page.tsx, .planning/phases/05-component-upgrades/05-07-SUMMARY.md
- Commits: FOUND 027978c (feat Task 1), 084a63f (feat Task 2)
- tsc: NO new errors in any of the 6 files (expertise pre-existing 18 errors unchanged, baseline-verified via stash)
- SEO: metadata/JSON-LD/generateStaticParams/copy/data byte-unchanged (git-diff grep gate)

---
*Phase: 05-component-upgrades*
*Completed: 2026-06-12*
