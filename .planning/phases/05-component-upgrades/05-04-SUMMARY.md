---
phase: 05-component-upgrades
plan: 04
subsystem: ui
tags: [motion, motion-v12, animation, navigation, themetoggle, accessibility, focus-trap, reduced-motion, aria]

# Dependency graph
requires:
  - phase: 05-03
    provides: "InteractiveButton (variant/size/href API) used by Nav's Hire-Me CTA; EASE_SIGNATURE from @/lib/motion; reduced-motion parity pattern"
  - phase: 03-shared-foundation
    provides: "lib/motion.ts presets (EASE_SIGNATURE [0.16,1,0.3,1])"
provides:
  - "Navigation on motion v12: scroll-aware glass preserved + AnimatePresence mobile menu (open AND close choreography) + full keyboard a11y (aria-expanded/controls, Escape-to-close, focus trap + restore, background inert/aria-hidden) + motion scaleX underline replacing imperative DOM style mutation"
  - "ThemeToggle on motion v12: spring-driven knob slide + AnimatePresence sun/moon swap, focus-visible ring; ALL localStorage + data-theme + mounted-guard logic preserved verbatim"
  - "Net-new a11y floor on both: focus-visible rings (token --accent-blue), reduced-motion short-circuits to instant"
affects: [05-component-upgrades-wave5, page.tsx, fund-me, ideas, team, budget, contact]

# Tech tracking
tech-stack:
  added: []  # motion@^12.40.0 already present
  patterns:
    - "AnimatePresence height/opacity for enter+exit menu choreography (replaces conditional mount/unmount with no exit animation)"
    - "Manual focus trap via keydown Tab-cycling + first-item focus on open + toggle-restore on close (no external focus-trap lib)"
    - "Background inert: mark every top-level <body> child that isn't the <nav> with inert + aria-hidden while menu open, restore on cleanup"
    - "Motion scaleX underline via whileHover variants on a wrapping motion.div — declarative, replaces e.currentTarget.style mutation"
    - "AnimatePresence mode='wait' for icon cross-fade (rotate/scale) keyed on theme"

key-files:
  created:
    - .planning/phases/05-component-upgrades/05-04-SUMMARY.md
  modified:
    - src/components/Navigation.tsx
    - src/components/ThemeToggle.tsx

key-decisions:
  - "Focus trap implemented manually (keydown Tab-cycle + getFocusable filter + first/last wrap) rather than adding a focus-trap dependency — keeps zero new deps and matches the project's hand-rolled convention"
  - "Background made inert by iterating document.body.children and skipping the <nav> (a fixed sibling of page content), applying inert + aria-hidden to the rest, restored in the effect cleanup — avoids coupling Navigation to other components' DOM"
  - "Underline moved to a motion.span scaleX (origin-left) driven by whileHover variants on a wrapping motion.div; active-page links animate scaleX:1 directly (no hover variant) so the active underline stays pinned"
  - "currentPage prop retained (7 call sites pass it) but unused — active state derives from usePathname(); silenced the lone no-unused-vars warning with a targeted eslint-disable to keep the public API intact AND lint clean"
  - "ThemeToggle knob uses a spring (stiffness 500, damping 32, mass 0.7) for the slide and AnimatePresence mode='wait' for the sun/moon rotate/scale swap; theming contract (localStorage + setAttribute data-theme + mounted guard) copied verbatim"

patterns-established:
  - "Pattern 1: overlay/menu a11y = aria-expanded/controls + Escape-close-with-focus-restore + manual Tab focus-trap + background inert/aria-hidden"
  - "Pattern 2: hover underlines use motion scaleX variants, never imperative inline-style mutation"

requirements-completed: [VIS-05, VIS-06]

# Metrics
duration: 5 min
completed: 2026-06-12
---

# Phase 5 Plan 4: Navigation + ThemeToggle Elevation Summary

**Navigation re-built on motion v12 with an AnimatePresence open/close mobile menu, full keyboard accessibility (aria-expanded/controls, Escape-to-close, manual focus trap + restore, inert background), and a declarative scaleX motion underline replacing imperative DOM mutation; ThemeToggle elevated with a spring knob slide + AnimatePresence sun/moon swap while every byte of its localStorage/data-theme theming contract is preserved.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-12T06:54:16Z
- **Completed:** 2026-06-12T06:59:03Z
- **Tasks:** 2
- **Files modified:** 2 (source) + 1 (summary)

## Accomplishments
- `Navigation.tsx`: mobile menu wrapped in `AnimatePresence` (height/opacity enter AND exit via signature easing) replacing the old conditional mount/unmount that had no exit animation.
- Net-new keyboard accessibility (VIS-05 floor): toggle gets `aria-expanded`/`aria-controls="mobile-menu"`; `Escape` closes and restores focus to the toggle; focus is trapped within the open panel (first item focused on open, Tab/Shift+Tab cycle within); the rest of the page is made `inert` + `aria-hidden` while open; `focus-visible` rings (`--accent-blue`) on every link/button.
- Per-link underline converted from `e.currentTarget.style`/`ref` DOM mutation to a `motion.span` scaleX (origin-left) driven by `whileHover` variants on a wrapping `motion.div`; active-page underline pinned to scaleX:1. Scroll-aware glass, all nav items (incl. AI Engineering), ThemeToggle, and Hire-Me `InteractiveButton` CTA preserved.
- `ThemeToggle.tsx`: knob slide is now a spring (stiffness 500 / damping 32 / mass 0.7); sun↔moon swap is an `AnimatePresence mode="wait"` rotate/scale/opacity cross-fade; track + knob colors animated. `focus-visible` ring added. `mounted` guard, `localStorage.theme` read/write, and `document.documentElement.setAttribute("data-theme", …)` preserved verbatim.
- `useReducedMotion()` honored on both: menu still opens/closes and theme still swaps, just instantly with no motion flourish.

## Task Commits

Each task was committed atomically (`--no-verify`, explicit per-file staging — parallel-executor protocol):

1. **Task 1: Navigation — AnimatePresence menu + a11y + motion underline** - `0bbd1b8` (feat)
2. **Task 2: ThemeToggle — motion-spring knob/icon, logic preserved** - `27e27dc` (feat)

**Plan metadata:** `[see final commit]` (docs: complete plan)

## Files Created/Modified
- `src/components/Navigation.tsx` - motion v12 AnimatePresence mobile menu (open+close), aria-expanded/controls, Escape-to-close with focus restore, manual Tab focus-trap, background-inert effect, motion scaleX underline, focus-visible rings; scroll-aware glass + all items + ThemeToggle + Hire-Me CTA + currentPage prop preserved.
- `src/components/ThemeToggle.tsx` - spring knob translate, AnimatePresence sun/moon rotate-scale swap, animated track/knob colors, focus-visible ring; mounted guard + localStorage + data-theme setAttribute preserved verbatim; reduced-motion-aware.

## Decisions Made
See `key-decisions` frontmatter. Headlines: focus trap is hand-rolled (no new dep); background is made inert by iterating `document.body.children` and skipping the fixed `<nav>`, restored on cleanup; underline is a motion scaleX variant (active links pin to 1); `currentPage` kept (7 call sites) but the resulting unused-var warning is silenced with a targeted eslint-disable so the public API and lint cleanliness both hold; ThemeToggle theming contract copied verbatim.

### Focus-trap approach (requested by plan output)
A single `useEffect` gated on `isMobileMenuOpen` queries focusable descendants of the menu panel (`menuRef`), focuses the first on open, and installs a `keydown` listener: `Escape` closes the menu and calls `toggleRef.current?.focus()` to restore focus; `Tab`/`Shift+Tab` wrap focus between the first and last focusable items (and re-enter the panel if focus has escaped). No external focus-trap library — consistent with the project's hand-rolled convention.

### Making the menu background inert (requested by plan output)
Because the `<nav>` is `position: fixed` and a sibling of the page content in `<body>`, the same effect iterates `document.body.children`, skips the element that is (or contains) the `<nav>`, and sets `inert` + `aria-hidden="true"` on every other top-level child. The effect's cleanup removes both attributes from exactly the elements it inerted, so the background is restored on close/unmount. `inert` removes that content from the tab order, pointer events, and the accessibility tree, guaranteeing focus stays in the menu.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Silenced unused `currentPage` prop lint warning without breaking the public API**
- **Found during:** Task 1 (Navigation lint)
- **Issue:** `NavigationProps.currentPage` is passed by 7 call sites but never read by the component (active state derives from `usePathname()`), producing a `@typescript-eslint/no-unused-vars` warning. CONVENTIONS require lint-clean (05-03 set this precedent by removing an unused import). Removing the prop would break 7 callers.
- **Fix:** Kept the prop in `NavigationProps` and the destructure, added a documented `// eslint-disable-next-line @typescript-eslint/no-unused-vars` above the function so the backward-compatible API surface is preserved while lint stays clean.
- **Files modified:** src/components/Navigation.tsx
- **Verification:** `next lint --file src/components/Navigation.tsx` → "No ESLint warnings or errors".
- **Committed in:** `0bbd1b8` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 lint-hygiene / API-preservation).
**Impact on plan:** Cosmetic lint cleanup that preserves an existing public prop; no behavior or API change, no scope creep. (Note: the pre-existing warning predates this plan — the original Navigation already declared `currentPage` unused — but lint-clean is a CONVENTIONS requirement so it was addressed.)

## Issues Encountered
None. Working tree had the parallel 05-02 agent's uncommitted `.planning/STATE.md` edit and untracked `05-02-SUMMARY.md`; per the parallel-executor protocol these were left untouched and only my two source files were staged explicitly. CRLF line-ending warnings on commit are benign (Windows autocrlf).

## Verification
- `npx tsc --noEmit` → no `Navigation.tsx` / `ThemeToggle.tsx` errors (pre-existing unrelated errors elsewhere remain, none in these files).
- `next lint` → clean on both files.
- `npm run build` → succeeds across all 38 routes (proves no call-site break in page.tsx, fund-me, ideas, team, budget, contact, success).
- `rg "AnimatePresence" src/components/Navigation.tsx` → match (4); `rg "aria-expanded|aria-controls"` → match (2); `rg "e\.currentTarget\.style"` → NONE.
- `rg "setAttribute\(.data-theme|localStorage" src/components/ThemeToggle.tsx` → 4 matches (logic intact); `mounted` guard present.
- `rg "focus-visible"` → both files match.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Navigation (VIS-05) and ThemeToggle (VIS-06) are upgraded on motion v12 with full a11y and the theming contract intact; Wave 5 can proceed.
- No blockers. Manual smoke (05-09 gate): Tab through nav for rings, open/close mobile menu (Esc closes, focus trapped, aria-expanded toggles, background inert), verify both light/dark themes persist across reload.

## Self-Check: PASSED

- Files: FOUND src/components/Navigation.tsx, src/components/ThemeToggle.tsx, .planning/phases/05-component-upgrades/05-04-SUMMARY.md
- Commits: FOUND 0bbd1b8 (feat Navigation), 27e27dc (feat ThemeToggle)

---
*Phase: 05-component-upgrades*
*Completed: 2026-06-12*
