---
phase: 06-hardening-ship
plan: 02
subsystem: ui
tags: [typescript, discriminated-union, type-safety, seo, server-component, strict-build]

# Dependency graph
requires:
  - phase: 05-content-polish
    provides: visually-tokenized /expertise page (05-07) whose content/JSON-LD must be preserved
provides:
  - Explicit ExpertiseCategory/Technology/Sector typed shape for the technicalExpertise data
  - src/app/expertise/page.tsx passing npx tsc --noEmit with zero errors (18 -> 0)
  - src/app/expertise/page.tsx passing npm run lint with zero findings (1 -> 0)
affects: [06-05, strict-build, tsc-burndown]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Typed module-scope page data via interface + Record<string, T> annotation so Object.entries/Object.values narrow"
    - "Optional members (technologies?/sectors?) guarded by existing optional-chaining render structure rather than discriminated union"

key-files:
  created:
    - .planning/phases/06-hardening-ship/06-02-SUMMARY.md
  modified:
    - src/app/expertise/page.tsx

key-decisions:
  - "Used approach (b) - single interface with optional technologies?/sectors? - over a discriminated union, because the JSX already conditionally renders one or the other via optional chaining (lower-risk, zero render-structure change)"
  - "Annotated the const as Record<string, ExpertiseCategory> so Object.entries/Object.values yield the typed category, fixing TS2339 at the source and letting all inner map params narrow automatically (TS7006)"
  - "Removed the unused categoryIndex destructured parameter to clear the 1 lint no-unused-vars finding (it was never referenced; keys use key={key})"

patterns-established:
  - "Pattern 1: Type module-scope page-data objects explicitly with an interface + Record annotation when they are iterated, so union-property and implicit-any errors clear at once without touching content"

requirements-completed: [SHIP-02]

# Metrics
duration: ~9min
completed: 2026-06-12
---

# Phase 6 Plan 02: Type technicalExpertise to clear 18 union-type errors Summary

**Typed the /expertise page's technicalExpertise data with Technology/Sector/ExpertiseCategory interfaces (Record<string, ExpertiseCategory>), clearing all 18 tsc union-property + implicit-any errors and 1 lint finding with byte-identical content and JSON-LD.**

## Performance

- **Duration:** ~9 min
- **Started:** 2026-06-12
- **Completed:** 2026-06-12
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Declared three interfaces (`Technology`, `Sector`, `ExpertiseCategory`) capturing the real nested shapes of the expertise data, with `technologies?`/`sectors?` and the nested `specializations`/`applications`/`achievements` members
- Annotated `technicalExpertise` as `Record<string, ExpertiseCategory>` so `Object.entries`/`Object.values` and `.technologies?`/`.sectors?` accesses narrow correctly — all 18 errors (10x TS7006 implicit-any map params, 4x... TS2339 missing-property) cleared
- Removed the single unused `categoryIndex` parameter, clearing the file's 1 lint problem
- Verified via git diff that the change is type-only: no rendered text, metadata export, certifications data, or expertise JSON-LD object values were touched

## Task Commits

Each task was committed atomically:

1. **Task 1: Declare explicit type for technicalExpertise and narrow accesses** - `e6e64e1` (fix)
2. **Task 2: Verify content + JSON-LD preservation via diff** - no new code (content-preservation gate; covered by `e6e64e1`)

_Task 2 is a verification gate that adds no code, so it shares the Task 1 commit._

## Files Created/Modified
- `src/app/expertise/page.tsx` - Added `Technology`, `Sector`, `ExpertiseCategory` interfaces; annotated `technicalExpertise` const as `Record<string, ExpertiseCategory>`; removed unused `categoryIndex` param. Type-only refactor.

## Decisions Made
- **Optional-member interface over discriminated union:** The render JSX already uses `category.technologies?.map(...) || category.sectors?.map(...)`, so a single `ExpertiseCategory` interface with both as optional members fits the existing structure exactly — no discriminant or render change needed. Lower risk for a content-frozen page.
- **`Record<string, ExpertiseCategory>` annotation:** Fixes the union-property errors at the data declaration, which propagates the correct element types into every `.map()` callback, auto-clearing the TS7006 implicit-any params without per-param annotations.

## Deviations from Plan

None - plan executed exactly as written. The 1 lint problem the plan anticipated ("likely no-unused-vars / no-explicit-any") was indeed a `no-unused-vars` on `categoryIndex` and was cleared as instructed in Task 1's scope.

## Issues Encountered
None. The root-cause analysis in the plan was accurate — typing the data object cleared all 18 tsc errors in a single edit; the inner map params narrowed automatically with no stragglers needing explicit annotation.

## Known Stubs
None. No hardcoded empty values, placeholders, or unwired data sources were introduced; all data and rendering are unchanged from before the refactor.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- expertise/page.tsx is now tsc- and lint-clean. Combined with 06-01 (api routes), the overall tsc error count reaches 0, removing the last type blocker before 06-05 flips the strict build flags.
- Content, metadata, and expertise JSON-LD are byte-identical — no SEO regression risk from this change.

## Self-Check: PASSED

- FOUND: `.planning/phases/06-hardening-ship/06-02-SUMMARY.md`
- FOUND: `src/app/expertise/page.tsx`
- FOUND: commit `e6e64e1`

---
*Phase: 06-hardening-ship*
*Completed: 2026-06-12*
