---
phase: 05-component-upgrades
plan: 03
subsystem: ui
tags: [motion, motion-v12, animation, scrollreveal, interactivebutton, accessibility, reduced-motion]

# Dependency graph
requires:
  - phase: 03-shared-foundation
    provides: "lib/motion.ts presets (EASE_SIGNATURE [0.16,1,0.3,1], transitions {base,quick}, fadeUp, stagger)"
  - phase: 05-01
    provides: "Wave 2 WebGL hero landed first; this Wave-3 plan re-implements the page-level motion primitives the hero CTAs and section reveals sit on"
provides:
  - "ScrollReveal (default) + StaggerReveal, AnimatedCounter, MagneticHover, TextReveal, ParallaxSection re-implemented on motion v12 with IDENTICAL prop surfaces and named exports"
  - "InteractiveButton hover-lift/glow/tap on motion v12 with restraint, preserved variant/size/href API + --btn-* token styling, plus a net-new focus-visible ring"
  - "Reduced-motion parity: every reveal/interaction short-circuits to the static end-state (or final number / plain text / no transform)"
  - "Finalized backward-compatible public APIs for Waves 4-5 to verify against"
affects: [05-component-upgrades-wave4, 05-component-upgrades-wave5, page.tsx, fund-me, ideas, team, Footer, FAQ, TeamSection, Navigation]

# Tech tracking
tech-stack:
  added: []  # motion@^12.40.0 already present from earlier waves
  patterns:
    - "Declarative motion-v12 reveal API (whileInView + viewport={{once, amount}}) replacing per-component IntersectionObserver state machines"
    - "useReducedMotion() early-return for the static end-state (parity with the prior matchMedia early-return)"
    - "Shared signature easing imported from @/lib/motion (EASE_SIGNATURE) — single easing source, never re-derived"

key-files:
  created:
    - .planning/phases/05-component-upgrades/05-03-SUMMARY.md
  modified:
    - src/components/ScrollReveal.tsx
    - src/components/InteractiveButton.tsx

key-decisions:
  - "StaggerReveal kept the incremental-delay mapping (delay = baseDelay + i*staggerDelay) over a variants-stagger container — preserves the exact prop shape (staggerDelay/baseDelay/direction) and `once` semantics with zero API change; variants-stagger IS used internally for TextReveal's per-character reveal where it fits naturally"
  - "AnimatedCounter trigger moved from IntersectionObserver to motion onViewportEnter (viewport amount:0.5, once) keeping the rAF ease-out-cubic count-up; reduced motion sets the final number immediately"
  - "MagneticHover re-implemented with useSpring (soft damped, restraint) toward a capped cursor offset; desktop-only via matchMedia('(hover:hover) and (pointer:fine)'), skipped under reduced motion, springs back to 0 on leave"
  - "InteractiveButton ripple (styled-jsx keyframe) removed in favor of a clean motion whileTap scale:0.98; cursor-follow radial glow retained (hidden under reduced motion)"
  - "No prop additions to any export. The only net-new surface is InteractiveButton's focus-visible ring (Tailwind classes on both anchor + button forms), which is the VIS-04 a11y floor, not a prop"

patterns-established:
  - "Pattern 1: page-level reveals use motion whileInView+viewport instead of hand-rolled IntersectionObserver"
  - "Pattern 2: micro-interactions use transitions.quick from @/lib/motion so hover/tap match the signature easing"

requirements-completed: [VIS-04]

# Metrics
duration: 5 min
completed: 2026-06-12
---

# Phase 5 Plan 3: ScrollReveal + InteractiveButton on motion v12 Summary

**All 6 ScrollReveal-family primitives and InteractiveButton re-implemented on motion v12 (whileInView/variants/useSpring/whileHover-whileTap) with byte-for-byte prop surfaces, reduced-motion parity, signature easing from lib/motion, and a net-new focus-visible ring — zero call-site churn, build green across all 38 routes.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-12T06:45:27Z
- **Completed:** 2026-06-12T06:50:34Z
- **Tasks:** 2
- **Files modified:** 2 (source) + 1 (summary)

## Accomplishments
- `ScrollReveal.tsx` rewritten on motion v12: default `ScrollReveal` + `StaggerReveal`, `AnimatedCounter`, `MagneticHover`, `TextReveal`, `ParallaxSection` all preserved with identical prop surfaces and named exports.
- IntersectionObserver state machines replaced by declarative `whileInView` + `viewport={{ once, amount: threshold }}`; `direction`→offset mapping (`up:{y:distance}`, `down:{y:-distance}`, `left:{x:distance}`, `right:{x:-distance}`, `none:{}`) preserved.
- `InteractiveButton.tsx` now renders polymorphic `motion.a`/`motion.button` with `whileHover` (1px lift + box-shadow glow) and `whileTap` (scale 0.98), `transitions.quick` easing, retained `--btn-*` variant/size/href API, and a token-based `focus-visible` ring on both forms (VIS-04 a11y floor).
- Reduced-motion short-circuits everywhere: ScrollReveal/TextReveal render the static end-state, AnimatedCounter shows the final number, MagneticHover/ParallaxSection apply no transform, InteractiveButton drops hover/tap transforms (color/focus retained).

## Task Commits

Each task was committed atomically:

1. **Task 1: ScrollReveal.tsx motion v12 rewrite (all 6 exports)** - `d6625ad` (feat) + `15db990` (refactor: drop unused `transitions` import to clear the lone lint warning)
2. **Task 2: InteractiveButton.tsx motion hover/tap** - `a50b116` (feat)

_Note: 05-03 commits use `--no-verify` and explicit per-file staging (parallel-executor protocol)._

## Files Created/Modified
- `src/components/ScrollReveal.tsx` - motion v12 internals for all 6 exports; `whileInView`/`viewport`, `useSpring` magnetic hover, `useScroll`/`useTransform` parallax, variants-stagger TextReveal; `useReducedMotion` parity; `EASE_SIGNATURE` from `@/lib/motion`.
- `src/components/InteractiveButton.tsx` - polymorphic `motion.a`/`motion.button`, `whileHover`/`whileTap`, `transitions.quick`, focus-visible ring, reduced-motion-aware.

## Final Public APIs (for Waves 4-5)

Unchanged from before this plan — verify downstream against these:

- **ScrollReveal** (default): `{ children, className?, delay=0, direction='up'|'down'|'left'|'right'|'none', distance=40, duration=700(ms), once=true, threshold=0.1 }`
- **StaggerReveal**: `{ children: ReactNode[], className?, staggerDelay=100, direction='up'|..., baseDelay=0 }` — incremental-delay mapping retained.
- **AnimatedCounter**: `{ target, suffix='', duration=2000, className? }` — rAF count-up, ease-out-cubic, viewport amount 0.5.
- **MagneticHover**: `{ children, className?, strength=0.3 }` — desktop-only spring toward cursor.
- **TextReveal**: `{ text, className?, delay=0, charDelay=30 }` — per-character variants stagger.
- **ParallaxSection**: `{ children, className?, speed=0.2 }` — subtle scroll-linked translateY.
- **InteractiveButton** (default): `{ children, href?, onClick?, variant='primary'|'secondary'|'ghost', size='sm'|'md'|'lg', className?, external=false }` — polymorphic anchor/button; net-new focus-visible ring (no prop change).

## Decisions Made
See `key-decisions` frontmatter. Headlines: StaggerReveal keeps delay-mapping (not variants-stagger) for exact prop-shape preservation; variants-stagger is used internally only for TextReveal. AnimatedCounter trigger moved to `onViewportEnter`. InteractiveButton ripple replaced by motion `whileTap` scale. No prop additions anywhere; focus-visible ring is the only net-new surface (a11y floor, classes not props).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused `transitions` import in ScrollReveal**
- **Found during:** Task 1 (post-write lint)
- **Issue:** Imported `transitions` alongside `EASE_SIGNATURE` from `@/lib/motion` but only `EASE_SIGNATURE` was used → `@typescript-eslint/no-unused-vars` warning (CONVENTIONS require lint-clean). The `lib/motion` shared-easing key_link is satisfied by `EASE_SIGNATURE` alone.
- **Fix:** Dropped `transitions` from the ScrollReveal import.
- **Files modified:** src/components/ScrollReveal.tsx
- **Verification:** `next lint` → "No ESLint warnings or errors" on both files.
- **Committed in:** `15db990` (refactor)

---

**Total deviations:** 1 auto-fixed (1 bug/lint-hygiene).
**Impact on plan:** Cosmetic lint cleanup only; no behavior or API change. No scope creep.

## Issues Encountered

**Git race with the parallel 05-02 executor (resolved, no work lost).** While committing the Task-1 lint cleanup I ran `git commit --amend`, but between my Task-1 commit (`d6625ad`) and the amend, the parallel 05-02 agent had committed `InteractiveGlobe.tsx` (`861c4b7`) on top of mine. The amend therefore rewrote *their* commit and swept my 1-line ScrollReveal cleanup into it. Detected immediately via `git show --stat HEAD`. Repaired surgically: `git reset --soft 861c4b7` restored the parallel agent's commit with its original hash/message/date and InteractiveGlobe diff fully intact, leaving only my ScrollReveal cleanup staged; I then committed that as a separate `refactor` (`15db990`). Verified `git diff 861c4b7 6ebaf02` was exactly the single import line before resetting, so the parallel agent's work was provably preserved. The parallel agent's in-progress `IdeaNetworkCanvas.tsx` (uncommitted working-tree change) was never staged or touched throughout. **Lesson for parallel executors: never `--amend` once a parallel commit may have landed on HEAD — use a fresh fixup commit instead.**

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Both motion primitives are upgraded on motion v12 with finalized, backward-compatible public APIs; Waves 4-5 can verify against the API table above with zero expected churn.
- Verification green: `tsc --noEmit` clean for all ScrollReveal-family + InteractiveButton symbols (pre-existing unrelated errors remain only in `expertise/page.tsx`, which imports neither); `next lint` clean on both files; `npm run build` succeeds across all 38 routes (proves no call-site break in page.tsx, fund-me, ideas, team, Footer, FAQ, TeamSection, Navigation).
- No blockers.

## Self-Check: PASSED

- Files: FOUND src/components/ScrollReveal.tsx, src/components/InteractiveButton.tsx, .planning/phases/05-component-upgrades/05-03-SUMMARY.md
- Commits: FOUND d6625ad (feat ScrollReveal), 15db990 (refactor cleanup), a50b116 (feat InteractiveButton)

---
*Phase: 05-component-upgrades*
*Completed: 2026-06-12*
