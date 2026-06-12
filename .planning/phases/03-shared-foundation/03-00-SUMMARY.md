---
phase: 03-shared-foundation
plan: 00
subsystem: infra
tags: [motion, wcag, contrast, accessibility, design-tokens, css-variables]

requires:
  - phase: 02-ai-engineering
    provides: layout.tsx AI knowsAbout additions; globals.css untouched (clean Phase-3 baseline)
provides:
  - motion@^12.40.0 installed (React 19.2.4 peer satisfied), motion/react resolves
  - scripts/contrast-check.mjs — repeatable WCAG AA contrast gate for both themes
  - 03-token-usage-audit.md — per-usage faint/ghost/muted promote-vs-keep decision table
affects: [03-01, 03-02, 03-03, 03-04, component-upgrades]

tech-stack:
  added: [motion@^12.40.0]
  patterns:
    - "Dependency-free Node ESM WCAG contrast script as a CI-less re-verification gate"
    - "Strategy A+B token contract: decorative tokens stay low, info-bearing usages promote a tier"

key-files:
  created:
    - scripts/contrast-check.mjs
    - .planning/phases/03-shared-foundation/03-token-usage-audit.md
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Dark --text-muted nudged 0.3->0.45 fixes all 81 muted usages with one globals.css edit (no per-file relabels)"
  - "24 of 34 --text-faint and 2 of 5 --text-ghost usages are information-bearing -> promote to --text-muted; remainder kept decorative under Strategy A"
  - "contrast-check.mjs is the single source of truth for 03-01's final globals.css token values"

patterns-established:
  - "Pattern: re-runnable contrast gate (node scripts/contrast-check.mjs) asserts >=4.5 for text-role tokens, prints DECORATIVE for documented-low tokens, exits 1 on text-role failure"
  - "Pattern: token-usage audit classifies every low-contrast usage as TEXT (promote) vs decorative (keep) before any CSS edit"

requirements-completed: [FOUND-02, FOUND-03]

duration: 3min
completed: 2026-06-12
---

# Phase 3 Plan 00: Shared Foundation (Wave 1 enabling) Summary

**Installed motion@^12.40.0, built a dependency-free WCAG AA contrast-check gate green against the final token palette, and produced the per-usage faint/ghost/muted audit (24+2 promotions, dark-muted 0.3→0.45 nudge) that drives Plan 03-01.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-12T02:22:04Z
- **Completed:** 2026-06-12T02:25:24Z
- **Tasks:** 3
- **Files modified:** 4 (2 created, 2 modified)

## Accomplishments
- `motion@^12.40.0` added to dependencies; `motion/react` resolves clean on React 19.2.4; no three/R3F/drei introduced (Phase 4 scope preserved).
- `scripts/contrast-check.mjs` (162 lines) computes WCAG 2.1 relative-luminance contrast for every text-role token in BOTH themes, composites white@alpha dark tokens over `--bg-primary`, asserts ≥4.5 for text roles, prints DECORATIVE for the documented-low tokens, and exits 1 on any text-role failure. Verified: exits 0 against the final AA palette; FAIL path confirmed exit 1.
- `03-token-usage-audit.md` resolves Research Open Question 1: classifies all 34 faint + 5 ghost + 81 muted src usages into TEXT (promote) vs decorative (keep), with an exhaustive per-usage action list for Plan 03-01.

## Task Commits

1. **Task 1: Install motion@^12.40.0** - `b17bbcb` (chore)
2. **Task 2: WCAG contrast-check script** - `780d0bf` (feat)
3. **Task 3: faint/ghost/muted usage audit** - `f9b67e8` (docs)

## Files Created/Modified
- `package.json` / `package-lock.json` - added motion ^12.40.0 dependency
- `scripts/contrast-check.mjs` - repeatable WCAG AA contrast gate, single source for 03-01 token values
- `.planning/phases/03-shared-foundation/03-token-usage-audit.md` - per-usage promote/keep decision table

## Decisions Made
- **Dark `--text-muted` value fix over per-file edits:** current `rgba(255,255,255,0.3)` ≈ 2.92 FAILS AA; nudging to `0.45` ≈ 4.50 fixes all 81 muted usages with a single globals.css line. Logged for 03-01.
- **Strategy A + B split:** of 34 `--text-faint` usages, 24 are information-bearing (captions, footer text, 10px uppercase labels, descriptions) → promote to `--text-muted`; 10 are decorative (gradient divider, social glyphs, scroll label, drag hint) → keep. Of 5 `--text-ghost`, 2 promote, 3 stay (large display numerals + toggled tab).
- **Script is the canonical palette:** 03-01 edits globals.css to match `contrast-check.mjs` constants, then re-runs the script as the gate.

## Deviations from Plan

None - plan executed exactly as written. The plan's `<interfaces>` target values were confirmed by the script's computed ratios (primary 19.75/17.06, secondary 5.33/9.90, muted 4.50/4.55, accents 4.94/5.45/5.24). The audit additionally surfaced that current live token definitions (dark muted 0.3, light faint #94a3b8) sit below AA — captured as the 03-01 action list rather than edited here (this plan touches no source/CSS by design).

## Issues Encountered
None. (Pre-existing uncommitted changes in phases 04/05 planning dirs were left untouched and never staged — out of scope per the per-task individual-staging protocol.)

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - this plan produces a dependency install plus two artifacts (script + audit); no UI/data stubs introduced.

## Next Phase Readiness
- Plan 03-01 (globals.css token edits) is fully unblocked: it has the exact final token values (in `contrast-check.mjs`), the exhaustive per-usage relabel list (in `03-token-usage-audit.md`), and a green re-runnable verification gate.
- `motion` is available for the Phase 3 motion-primitive plans.

## Self-Check: PASSED

All 3 created/modified artifacts present on disk; all 3 task commits (b17bbcb, 780d0bf, f9b67e8) found in git history.

---
*Phase: 03-shared-foundation*
*Completed: 2026-06-12*
