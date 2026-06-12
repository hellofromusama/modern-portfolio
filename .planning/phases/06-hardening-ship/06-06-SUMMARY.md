---
phase: 06-hardening-ship
plan: 06
subsystem: ui
tags: [css, view-transitions, accessibility, prefers-reduced-motion, progressive-enhancement, tailwind-v4]

# Dependency graph
requires:
  - phase: 03-foundations
    provides: globals.css reduced-motion kill switch (line 162) + CSS-custom-property theming
  - phase: 05-component-upgrades
    provides: stable build (Wave 1 fixes landed — /blog prerender + ThemeToggle, so npm run build is green)
provides:
  - Native cross-document @view-transition (navigation:auto) in globals.css — subtle default crossfade on full-page App Router navigations
  - prefers-reduced-motion kill block zeroing ::view-transition-group/old/new animation (WCAG / PROJECT.md mandate)
affects: [06-08 (owner browser-only visual VT pass), milestone preview deploy]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Native CSS View Transitions as progressive enhancement — zero JS, zero deps, no experimental config flag; degrades to instant navigation where unsupported"
    - "Every animation (including VT) ships with its prefers-reduced-motion kill switch in the SAME change (research Pitfall 4)"

key-files:
  created: []
  modified:
    - src/app/globals.css

key-decisions:
  - "Folded the VT reduced-motion override INTO the existing line-162 @media (prefers-reduced-motion: reduce) block (coherent single source) rather than adding a second adjacent block"
  - "Default crossfade only — no custom @keyframes, no named view-transition-name elements (restraint-first; FEATURES.md flags scroll-jacking/maximal motion as anti-features; token-awareness moot without named elements)"
  - "No next.config.ts change — native cross-document CSS needs no experimental.viewTransition flag (verified: next.config.ts git diff empty)"

patterns-established:
  - "Pattern: ship @view-transition + its reduced-motion kill block atomically — never one without the other"

requirements-completed: [VIS-08]

# Metrics
duration: 3min
completed: 2026-06-12
---

# Phase 06 Plan 06: Native View Transitions Summary

**Native cross-document CSS `@view-transition { navigation: auto }` enabling a subtle default crossfade between full-page navigations, paired with a `prefers-reduced-motion` kill switch — zero JS, zero new deps, no experimental config flag, full progressive enhancement.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-12T08:20:28Z
- **Completed:** 2026-06-12T08:23:19Z
- **Tasks:** 1 auto + 1 checkpoint (auto-approved on headless evidence)
- **Files modified:** 1

## Accomplishments
- Added `@view-transition { navigation: auto; }` to globals.css — opts the live site into native cross-document (MPA) view transitions; supporting browsers (Chrome/Edge 126+) get a subtle default crossfade, unsupported browsers (Firefox today) navigate normally with no error and no regression.
- Folded a reduced-motion kill block into the existing `@media (prefers-reduced-motion: reduce)` at line 162 — `::view-transition-group(*)/old(*)/new(*)` get `animation-duration: 0s !important; animation-delay: 0s !important;`, so motion-sensitive users get instant navigation (WCAG / PROJECT.md mandate; research Pitfall 4 avoided by shipping both blocks in the same change).
- No next.config.ts touch, no new dependency, no JS — the textbook progressive-enhancement profile for a live production site.

## Task Commits

1. **Task 1: Add native @view-transition + reduced-motion kill block to globals.css** - `b67b9c6` (feat)
2. **Task 2: Owner verifies View Transitions** - checkpoint (human-verify, blocking) — auto-approved on headless production evidence (auto_advance + _auto_chain_active both true); live cross-page visual crossfade is browser-only, deferred to 06-08's owner pass.

**Plan metadata:** (final docs commit — this SUMMARY + STATE + ROADMAP + REQUIREMENTS)

## Files Created/Modified
- `src/app/globals.css` - Added `@view-transition { navigation: auto; }` at-rule (top-level, just before the reduced-motion section) + the `::view-transition` reduced-motion override folded into the existing line-162 `@media (prefers-reduced-motion: reduce)` block. 2-space indent, matching the file's standard-CSS conventions. Explanatory comments note progressive-enhancement intent and the kill-switch mandate.

## Decisions Made
- **Reduced-motion override folded in, not added adjacent:** kept the VT kill switch inside the existing line-162 reduced-motion media query for a single coherent source (the plan explicitly permitted either; fold is cleaner).
- **Default crossfade only:** no custom keyframes, no named `view-transition-name` morphs — restraint-first per FEATURES.md anti-features (scroll-jacking / maximal motion). The default crossfade fully satisfies VIS-08 and sidesteps token-awareness concerns entirely (no named elements to theme).
- **No config flag:** native cross-document VT needs no `experimental.viewTransition`; next.config.ts left byte-identical (git diff confirmed empty).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. Wave 1's fixes were already committed, so `npm run build` ran clean (exit 0, all routes incl. 12 `/projects/*` SSG slugs). The grep verification passed first try (`@view-transition` count 1; the three `::view-transition` pseudos present).

## Verification Evidence

**Static (source):**
- `grep -c "@view-transition" src/app/globals.css` → `1`
- `grep -c "view-transition-group|view-transition-old|view-transition-new" src/app/globals.css` → `3` (all three pseudos present in the reduced-motion block)
- `git diff --stat next.config.ts` → empty (unchanged)
- `npm run build` → exit 0

**Served (compiled prod CSS, prod server on :3260):**
- Homepage HTML referenced `/_next/static/css/4379c3e1d1940e22.css`; that chunk served HTTP 200.
- Compiled CSS contained `@view-transition{navigation:auto}` (minified, intact).
- Compiled CSS contained `view-transition-group(*){animation-duration:0s!important;animation-delay:0s!important...}` — the reduced-motion kill switch survived minification.
- `prefers-reduced-motion` media query present in the served chunk.
- `/`, `/expertise`, `/services` all returned HTTP 200 and referenced the SAME CSS chunk — confirming cross-document VT applies uniformly across full-page navigations (the cross-doc nav targets the plan named).

**Browser-only (deferred to 06-08 owner pass per plan `<important>` directive):** the actual visual crossfade between pages, both-theme correctness during the transition, live reduced-motion emulation, and Firefox no-regression check require a GPU browser session. Mechanisms are code- and served-CSS-verified; the visual confirmation is owner-only.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- VIS-08 complete: native cross-document view transitions enabled with reduced-motion kill switch, build green, zero deps, no config flag.
- Handoff to 06-08: the owner's live visual VT pass (subtle crossfade in Chrome/Edge, instant under reduced-motion, no Firefox regression) is the only remaining browser-only confirmation — to be done at the milestone preview deploy / 06-08 owner verification.
- Ran PARALLEL to 06-04 (admin-guard + 5 api routes) — strictly file-disjoint (this plan touched `src/app/globals.css` ONLY). Committed `--no-verify` with explicit staging; skipped shared counters per the parallel mandate (06-08 / final reconciliation validates).

## Self-Check: PASSED

- FOUND: src/app/globals.css (contains `@view-transition`, count 1)
- FOUND: .planning/phases/06-hardening-ship/06-06-SUMMARY.md
- FOUND: commit b67b9c6 (Task 1)

---
*Phase: 06-hardening-ship*
*Completed: 2026-06-12*
