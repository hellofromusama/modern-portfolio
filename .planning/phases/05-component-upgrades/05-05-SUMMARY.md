---
phase: 05-component-upgrades
plan: 05
subsystem: ui
tags: [motion, motion-v12, animation, accordion, animatepresence, faq, team, footer, reduced-motion, tokens]

# Dependency graph
requires:
  - phase: 05-03
    provides: "ScrollReveal/StaggerReveal re-implemented on motion v12 with identical prop surfaces (FAQ/TeamSection/Footer wrap ScrollReveal and inherit the upgrade automatically)"
  - phase: 03-shared-foundation
    provides: "lib/motion.ts presets (EASE_SIGNATURE, transitions.base/quick) — the single easing/duration source consumed here"
provides:
  - "FAQ accordion smoothed on motion v12 (AnimatePresence + height:auto) with the FAQPage JSON-LD preserved verbatim and the category filter intact"
  - "TeamSection featured-member cross-fade (AnimatePresence opacity+scale) and progress dots (animate width + backgroundColor) smoothed on motion, with auto-cycle + hover-pin + grayscale photo + fallback all preserved"
  - "Footer token-driven hover unification (token color on Pages/Connect links + brand) while retaining the translate-x identity"
  - "Reduced-motion parity across all three: accordion toggles instantly, cross-fade/dots resolve with duration 0"
affects: [05-component-upgrades-wave5, page.tsx, team, ConditionalFooter, 05-09-verification-gate]

# Tech tracking
tech-stack:
  added: []  # motion@12.40.0 already present from earlier waves
  patterns:
    - "AnimatePresence + animate height:auto replaces max-height CSS transitions for content-accurate accordion open/collapse"
    - "AnimatePresence keyed on the displayed entity (cross-fade) instead of rendering all entities and toggling opacity classes"
    - "motion animate={{ ... }} on inline-styled indicators (progress dots) replaces Tailwind transition-all for token-driven width/color animation"
    - "useReducedMotion() early-return (initial={false} / transition duration 0) for static end-state parity"

key-files:
  created:
    - .planning/phases/05-component-upgrades/05-05-SUMMARY.md
  modified:
    - src/components/FAQ.tsx
    - src/components/TeamSection.tsx
    - src/components/Footer.tsx

key-decisions:
  - "FAQ accordion uses AnimatePresence + animate height:auto (content-accurate) rather than the fixed max-h-[300px] CSS transition, removing the clipping risk for long answers; honors useReducedMotion via initial={false} + transition duration 0"
  - "TeamSection photo cross-fade refactored from all-members-absolute + opacity-class toggle to a single AnimatePresence child keyed on displayedMember.id — cleaner cross-fade and fewer mounted <img> nodes, with the onError fallback-swap, grayscale->color hover, and name overlay preserved per-displayed-member"
  - "Progress dots converted to motion.button animating width + backgroundColor (token values) so the active-dot grow/recolor rides the signature easing (transitions.quick)"
  - "Footer left fully tokenized (it already was); the only change is the standard hover treatment — token color via onMouseEnter/onMouseLeave (the established Navigation pattern) keeping the existing translate-x lift identity. No motion library added to Footer (light-touch, no feature change)"

patterns-established:
  - "Pattern 1: accordion/expand uses AnimatePresence + height:auto, not CSS max-height — accurate to content height, reduced-motion via duration 0"
  - "Pattern 2: featured/carousel cross-fade keys a single AnimatePresence child on the active id rather than toggling opacity across all rendered items"

requirements-completed: [VIS-06, VIS-07]

# Metrics
duration: 6 min
completed: 2026-06-12
---

# Phase 5 Plan 5: Footer + FAQ + TeamSection Elevation Summary

**FAQ accordion and TeamSection photo cross-fade + progress dots smoothed on motion v12 (AnimatePresence/height:auto, opacity+scale, animated width/color), Footer hover unified to token color — every feature (category filter, FAQPage JSON-LD verbatim, auto-cycle, hover-pin, grayscale photo) preserved, reduced-motion parity throughout, build green across all routes.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-12T06:54:28Z
- **Completed:** 2026-06-12T07:00:14Z
- **Tasks:** 2
- **Files modified:** 3 (source) + 1 (summary)

## Accomplishments
- `FAQ.tsx` accordion rebuilt on motion v12: `AnimatePresence initial={false}` wrapping a `motion.div` that animates `height: 0 -> auto` + `opacity` on open and back on close (`transitions.base` easing). The fixed `max-h-[300px]` clip is gone — answers of any length expand accurately. The card gets a subtle `whileHover y:-1` lift. `useReducedMotion()` short-circuits to an instant toggle (`initial={false}`, `transition.duration 0`). Category filter, open/close state, and the FAQPage JSON-LD `<script>` block are untouched (verbatim).
- `TeamSection.tsx` featured-member photo now cross-fades via `AnimatePresence` keyed on `displayedMember.id` (opacity + scale 1.05->1), and the progress dots are `motion.button`s animating `width` (6<->24) and `backgroundColor` (`--border-subtle`<->`--accent-blue`) on the signature easing. Auto-cycle timer, hover-to-pin, grayscale->color hover, `onError` fallback swap, and the name overlay are all preserved. Reduced-motion resolves both with duration 0.
- `Footer.tsx` (light touch) unified link hover to the standard token treatment: Pages links and Connect links recolor `--text-muted -> --text-primary` on hover (and the brand `UJ -> --accent-blue`) via the established `onMouseEnter/onMouseLeave` pattern, keeping the existing `translate-x-0.5` lift identity. No feature change; it was already fully tokenized.
- Verification green: `tsc --noEmit` clean for all three files; `next lint` clean on FAQ + Footer (TeamSection has one pre-existing `<img>` LCP warning, see Issues); JSON-LD present; no residual `bg-white/[0`, `border-white/[0`, or `rgba(` literals in any of the three; `useReducedMotion` present in FAQ + TeamSection; `npm run build` compiled successfully across all routes.

## Task Commits

Each task was committed atomically (parallel-executor protocol: `--no-verify`, explicit per-file staging):

1. **Task 1: FAQ — motion accordion + token pass (JSON-LD preserved)** - `fe1ac26` (feat)
2. **Task 2: TeamSection + Footer — motion smoothing + hover unification** - `ff40457` (feat)

**Plan metadata:** see final docs commit.

## Files Created/Modified
- `src/components/FAQ.tsx` - motion v12 accordion (`AnimatePresence` + `height:auto`), `whileHover` lift, `useReducedMotion` parity; JSON-LD + category filter preserved verbatim.
- `src/components/TeamSection.tsx` - `AnimatePresence` photo cross-fade keyed on displayed member; `motion.button` progress dots animating width/backgroundColor; auto-cycle + hover-pin + grayscale + fallback preserved; `useReducedMotion` parity.
- `src/components/Footer.tsx` - token-driven hover color on links + brand via `onMouseEnter/Leave`, retaining translate-x identity.

## Decisions Made
See `key-decisions` frontmatter. Headlines: FAQ uses content-accurate `height:auto` (drops the `max-h-[300px]` clip); TeamSection cross-fade keys a single `AnimatePresence` child on the active id (fewer mounted `<img>` nodes); progress dots animate token width/color on signature easing; Footer kept motion-free (light touch) — hover uses the established `onMouseEnter/Leave` token pattern.

## Deviations from Plan

None - plan executed exactly as written.

The plan's optional suggestion to consider `next/image` for the TeamSection photos was explicitly gated on it being "trivial; otherwise leave the `<img>` as-is." It is non-trivial here because the `<img>` carries an `onError` fallback-swap that manipulates `nextElementSibling.style.display` (a DOM pattern `next/image` does not support cleanly) and swapping to a fixed-layout `Image` risked CLS in the 550px sticky frame. Per the plan, the `<img>` was left as-is. This is not a deviation — it is the plan's specified default branch.

## Issues Encountered

**Pre-existing `<img>` LCP lint warning in TeamSection (out of scope, deferred).** `next lint` reports `@next/next/no-img-element` at the team photo `<img>`. This warning pre-existed this plan — the `<img>` was last touched in commit `e377ef1` (plan 03-01) and the element count is unchanged by this work (still a single `<img>`). The plan explicitly permits leaving the `<img>` as-is (next/image was optional, only-if-trivial). `eslint.ignoreDuringBuilds: true` means it does not fail the build, which compiled successfully. **Deferred:** migrating the team photo to `next/image` (requires reworking the `onError` fallback into a React state-driven fallback to avoid CLS) is a candidate for a future a11y/perf polish plan, out of scope for this token/motion pass.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Three more of the remaining-17 components elevated to the new design language (VIS-06, VIS-07) with zero feature loss and reduced-motion parity.
- File-disjoint from parallel waves 05-04 (Navigation/ThemeToggle) and 05-06 (AnimatedIcons/FundMeWidget) — no shared files touched.
- 05-09 manual gate items: verify in both themes — FAQ expand/collapse smooth, Team cross-fade smooth, Footer correct in light mode.
- No blockers.

## Self-Check: PASSED

- Files: FOUND src/components/FAQ.tsx, src/components/TeamSection.tsx, src/components/Footer.tsx, .planning/phases/05-component-upgrades/05-05-SUMMARY.md
- Commits: FOUND fe1ac26 (feat FAQ accordion), ff40457 (feat TeamSection + Footer)

---
*Phase: 05-component-upgrades*
*Completed: 2026-06-12*
