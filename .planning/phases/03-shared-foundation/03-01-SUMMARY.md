---
phase: 03-shared-foundation
plan: 01
subsystem: ui
tags: [wcag, contrast, accessibility, design-tokens, css-variables, skip-link, focus-visible, type-scale, spacing-scale]

# Dependency graph
requires:
  - phase: 03-shared-foundation (Plan 03-00)
    provides: scripts/contrast-check.mjs (canonical final token values + AA gate); 03-token-usage-audit.md (per-usage promote/keep decision table)
  - phase: 02-ai-engineering
    provides: layout.tsx with AI knowsAbout additions; clean <body>/flex-1 region (no skip-link pre-existing)
provides:
  - WCAG AA-passing token palette in both themes (dark --text-muted 0.45; light --text-faint #64748b + accents blue/violet/emerald promoted to 600/700)
  - Documented --text-xs..--text-5xl type scale + --space-1..--space-24 spacing scale in globals.css (single source of truth, FOUND-03)
  - .skip-link + :focus-visible a11y CSS (theme-aware) + layout.tsx skip anchor wired to #main-content target (PERF-03)
  - Information-bearing faint/ghost text promoted to AA --text-muted across 10 non-canvas files (Strategy A+B)
affects: [03-03, 03-04, component-upgrades, phase-06-ship-gate]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Documented CSS-variable type/spacing scale as single source of truth (consumed via Tailwind utilities + inline var())"
    - "Strategy A+B token contract enforced at usage sites: decorative tokens stay low (documented-exempt), info-bearing usages promote one tier to AA muted"
    - "Off-screen .skip-link revealed on :focus + global :focus-visible ring keyed to --accent-blue (theme-aware)"

key-files:
  created:
    - .planning/phases/03-shared-foundation/03-01-SUMMARY.md
  modified:
    - src/app/globals.css
    - src/app/layout.tsx
    - src/components/Hero3D.tsx
    - src/components/Footer.tsx
    - src/components/FAQ.tsx
    - src/components/LastUpdated.tsx
    - src/components/TeamSection.tsx
    - src/app/page.tsx
    - src/app/team/page.tsx
    - src/app/developer-australia/page.tsx
    - src/app/blog/best-developer-perth/page.tsx
    - src/app/blog/ai-developer-perth/page.tsx

key-decisions:
  - "Applied exactly the contrast-check.mjs canonical values (dark muted 0.45, light faint #64748b, accents #2563eb/#7c3aed/#047857); re-ran the script as the AA gate (exit 0)"
  - "Type + spacing scales added as documented CSS variables in :root (single source of truth) without rewriting consumers — zero visual change, satisfies FOUND-03"
  - "Skip-link + #main-content wired as a clean two-line addition (Phase 2 left no pre-existing skip-link to reconcile)"
  - "Canvas-wiring files (ideas/page.tsx, fund-me/page.tsx) deliberately NOT edited despite audit PROMOTE rows — handed off to Plan 03-03 to avoid parallel write collision"

patterns-established:
  - "Pattern: token-value nudges (2 globals.css lines) fix the majority of contrast failures; only the remaining info-bearing low-tier usages need per-site relabels"
  - "Pattern: decorative-only token contract documented inline above faint/ghost definitions so future edits respect the AA exemption"

requirements-completed: [FOUND-03, PERF-03]

# Metrics
duration: 5min
completed: 2026-06-12
---

# Phase 3 Plan 01: AA Tokens + Scales + Skip-Link/Focus-Visible + Audited Relabels Summary

**Brought both theme palettes to WCAG AA via canonical contrast-check.mjs token values, added a documented type+spacing scale and skip-link/:focus-visible a11y CSS to globals.css, wired a two-line skip-to-content link in layout.tsx, and promoted 14 information-bearing faint/ghost text usages to the AA muted tier across 10 non-canvas files.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-12T02:28:53Z
- **Completed:** 2026-06-12T02:33:55Z
- **Tasks:** 3
- **Files modified:** 12 (1 summary created, 12 source modified)

## Accomplishments
- Both theme palettes pass WCAG AA — `node scripts/contrast-check.mjs` exits 0 (dark `--text-muted` 0.3→0.45 = 4.50; light `--text-faint` #94a3b8→#64748b = 4.55; light accents-as-text blue/violet/emerald 4.94/5.45/5.24).
- Documented `--text-xs`..`--text-5xl` type scale and `--space-1`..`--space-24` spacing scale added to `:root` in globals.css as the single source of truth (FOUND-03), plus an inline decorative-only contract comment above the faint/ghost tokens.
- Skip-to-content accessibility floor laid (PERF-03): theme-aware `.skip-link` (off-screen, reveals on focus) + global `:focus-visible` ring keyed to `--accent-blue`; layout.tsx skip anchor + `#main-content` focusable target (two-line surgical change, reconciled clean against concurrent Phase 2).
- 14 information-bearing faint/ghost text usages promoted to AA `--text-muted` across 10 non-canvas files; all documented-decorative usages (dividers, ghost numerals, social/arrow glyphs, scroll/drag labels) preserved per Strategy A.

## Task Commits

Each task was committed atomically (with `--no-verify`, per-file staging, as a parallel executor):

1. **Task 1: AA-correct tokens + documented type/spacing scales** - `a9baa61` (feat)
2. **Task 2: skip-link + :focus-visible CSS + layout.tsx wiring** - `60b0543` (feat)
3. **Task 3: per-usage faint/ghost → muted relabels (non-canvas files)** - `e377ef1` (feat)

**Plan metadata:** (this commit) `docs(03-01)`

## Files Created/Modified
- `src/app/globals.css` - AA token nudges (dark muted, light faint, 3 light accents) + documented `--text-*`/`--space-*` scales + decorative-only comment + `.skip-link`/`.skip-link:focus`/`:focus-visible` rules
- `src/app/layout.tsx` - skip-link anchor after `<body>` + `id="main-content" tabIndex={-1}` on the `flex-1` wrapper (two lines)
- `src/components/Hero3D.tsx` - hero caption (L67) + stat label (L95) faint→muted; Scroll label + gradient divider kept faint (decorative)
- `src/components/Footer.tsx` - intro paragraph, nav links, services list, connect links, copyright (faint→muted) + Perth tagline (ghost→muted)
- `src/components/FAQ.tsx` - expand toggle glyph faint→muted (per audit recorded action)
- `src/components/LastUpdated.tsx` - freshness timestamp faint→muted
- `src/components/TeamSection.tsx` - member role caption (L183) faint→muted; social glyphs + ghost initials kept
- `src/app/page.tsx` - grid section label, CTA fine-print, social-link rest/leave color faint→muted; ↗ arrow glyph kept
- `src/app/team/page.tsx` - member role caption ghost→muted; 3xl ghost initial kept
- `src/app/developer-australia/page.tsx`, `src/app/blog/best-developer-perth/page.tsx`, `src/app/blog/ai-developer-perth/page.tsx` - article/page footer byline faint→muted

## Decisions Made
- Used the contrast-check.mjs constants verbatim as the canonical final palette and re-ran the script as the gate (exit 0) — no independent ratio recomputation needed.
- Added type/spacing scales as documented CSS variables without rewriting consumers; this satisfies FOUND-03's "documented scale" mandate with zero visual change and zero risk to the concurrent Phase 3 plans.
- FAQ.tsx:107 is the rotating `+` expand glyph (visually decorative) but the audit recorded it as PROMOTE→muted; followed the audit's recorded action exactly (promotion is harmless — still AA, and the glyph conveys open/closed state).

## Deviations from Plan

None - plan executed exactly as written.

The plan's `<interfaces>` target values matched the contrast-check.mjs constants and the live globals.css anchors (dark muted 0.3, light faint #94a3b8, light accents #3b82f6/#8b5cf6/#10b981) exactly as documented. layout.tsx required no reconciliation — Phase 2 left no pre-existing skip-link or `#main-content`, so the change was a clean two-line addition. All audit line numbers (§2/§3) matched the live source.

**Total deviations:** 0.
**Impact on plan:** None. Both-theme AA achieved, scales documented, a11y floor laid, audited relabels applied, scope boundary (canvas files) respected.

## Issues Encountered
None.

Parallel-execution note: the concurrent executor for Plan 03-02 landed its commits (`ffc39ac` feat motion presets, `996e391` docs) during this plan's window. It touched only its assigned files (`src/lib/motion.ts`, `src/hooks/*`); no write collision occurred with this plan's files.

## Handoff to Plan 03-03 (canvas-wiring file relabels)

These audit-flagged **information-bearing** `--text-faint` usages live in canvas-wiring files that Plan 03-03 owns (for gate/canvas wiring). They were intentionally NOT edited here to avoid a parallel write collision. **Plan 03-03 must promote each to `var(--text-muted)`** (now AA in both themes) per `03-token-usage-audit.md` §2:

**`src/app/ideas/page.tsx`** (3 promotions):
- L199 — section description (`text-sm max-w-md mb-8`) → muted
- L240 — stat label (`text-[10px] uppercase`) → muted
- L302 — category description (`text-[11px]`, `{cat.desc}`) → muted

**`src/app/fund-me/page.tsx`** (6 promotions):
- L172 — globe section description (`text-sm max-w-md`) → muted
- L205 — stat label (`text-[10px] uppercase`, `{stat.label}`) → muted
- L252 — "AUD" currency suffix (`text-xs font-normal`) → muted
- L254 — donation option description (`text-[11px]`, `{option.description}`) → muted
- L315 — info/notice box body text (`text-center text-sm`) → muted
- L354 — secure-payment fine print (`text-[11px]`) → muted

**KEEP (decorative, do NOT change) in those files:** `fund-me/page.tsx:183` ("Drag to explore" hint).

After 03-03 applies these, a grep should confirm no information-bearing `var(--text-faint)`/`var(--text-ghost)` remains at the §2/§3 PROMOTE lines, and `node scripts/contrast-check.mjs` should still exit 0 (token values unchanged by relabels).

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - this plan only adjusts CSS token values, adds documented scale variables, adds a11y CSS, and relabels existing text-color tokens. No data sources, components, or placeholder content introduced.

## Next Phase Readiness
- FOUND-03 (documented AA tokens + type/spacing scales) and PERF-03 (skip-link + focus ring) complete and gate-verified.
- Plan 03-03 is unblocked: it has the exact canvas-file relabel list above and the green contrast gate.
- Both-theme manual smoke (visible skip link on Tab; :focus-visible ring; promoted captions readable) is recommended at the Phase 3 SHIP-01 gate; not run here (no dev server started by this autonomous plan).

## Self-Check: PASSED

All listed files present on disk (03-01-SUMMARY.md, globals.css, layout.tsx, Hero3D.tsx, + 8 other relabel files); all 3 task commits (a9baa61, 60b0543, e377ef1) found in git history.

---
*Phase: 03-shared-foundation*
*Completed: 2026-06-12*
