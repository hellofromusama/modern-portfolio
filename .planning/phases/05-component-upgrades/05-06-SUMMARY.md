---
phase: 05-component-upgrades
plan: 06
subsystem: ui
tags: [animated-icons, fundme-widget, theme-tokens, reduced-motion, motion-v12, css-keyframes, vis-06, vis-07]

# Dependency graph
requires:
  - phase: 05-component-upgrades (05-03)
    provides: motion v12 dependency + useReducedMotion pattern established on InteractiveButton/ScrollReveal
provides:
  - AnimatedIcons cross-fade now reduced-motion-safe with a deterministic static freeze (State A visible)
  - FundMeWidget fully de-hacked from hardcoded pink/purple/blue gradients + slate-900 to theme tokens (theme-correct in both light and dark)
  - FundMeWidget always-on ping/pulse/bounce/spin tamed (slower/subtler) and gated behind useReducedMotion() + a CSS reduced-motion guard
affects: [05-09 verification gate, future component-token-audit work]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Token-driven accent gradients via inline style with var(--accent-violet)->var(--accent-blue) where Tailwind v4 arbitrary gradient utilities are not theme-aware"
    - "color-mix(in srgb, var(--accent-*) N%, transparent) for soft tinted panel headers that follow the theme"
    - "Dual-layer reduced-motion: useReducedMotion() conditionally drops animation classes AND a component-local @media (prefers-reduced-motion: reduce) freeze as defence-in-depth"

key-files:
  created:
    - .planning/phases/05-component-upgrades/05-06-SUMMARY.md
  modified:
    - src/components/AnimatedIcons.tsx
    - src/components/FundMeWidget.tsx

key-decisions:
  - "FundMeWidget accent gradient mapped to linear-gradient(135deg, var(--accent-violet), var(--accent-blue)) — preserves the warm/playful violet->blue identity while being theme-correct in both modes"
  - "Panel chrome mapped: bg=var(--bg-elevated), border=var(--border-hover), header tint=color-mix violet/blue at 18%, header divider=var(--border-default), text=--text-primary/secondary/tertiary"
  - "Used inline style for token gradients (not Tailwind classes) because Tailwind v4 here themes via CSS custom properties, not dark: variants or arbitrary gradient utilities"
  - "Calmed motion via new *-calm keyframes (ping 3s/1.6x, pulse 3s 0.7 opacity floor, bounce 2s -15%) and slowed sparkle spins (8s/10s) rather than removing the delight entirely"
  - "AnimatedIcons strokes were already stroke=currentColor (tokenized) — added an explicit reduced-motion freeze pinning State A visible/State B hidden for a deterministic still icon"

patterns-established:
  - "Reduced-motion gating: prefer useReducedMotion() to conditionally render/strip animation classes, backed by a local @media (prefers-reduced-motion: reduce) CSS guard"
  - "Theme-token gradients in playful UI: inline style var(--accent-*) + color-mix for tints to stay warm yet theme-aware"

requirements-completed: [VIS-06, VIS-07]

# Metrics
duration: 4 min
completed: 2026-06-12
---

# Phase 5 Plan 6: AnimatedIcons + FundMeWidget Elevation Summary

**FundMeWidget de-hacked from hardcoded pink/purple/blue + slate-900 to theme tokens (theme-correct in both modes) with calmed, reduced-motion-gated animations; AnimatedIcons given a deterministic reduced-motion freeze — identity and /fund-me navigation preserved.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-12T06:54:48Z
- **Completed:** 2026-06-12T06:58:12Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- FundMeWidget is now the biggest token win of the wave: every hardcoded `pink-500`/`purple-600`/`blue-600`/`slate-900` literal replaced with `--accent-violet`/`--accent-blue`/`--bg-elevated`/`--border-*`/`--text-*` tokens, so it finally reads correctly in light mode instead of being dark-only.
- All four always-on FundMeWidget motions (`ping`/`pulse`/`bounce`/`spin`) were calmed (slower cadence, gentler amplitude) and gated behind `useReducedMotion()` plus a local `@media (prefers-reduced-motion: reduce)` freeze; the click-time heart-rain delight and overlay no-op under reduced motion (navigate straight to `/fund-me`).
- Widget identity preserved: 💖 button, ✨/⭐ sparkles, glow ring, expand panel, and the `/fund-me` navigation all intact; Stripe/checkout untouched.
- AnimatedIcons cross-fade kept verbatim (efficient CSS-keyframe approach) with an added reduced-motion freeze that pins State A visible / State B hidden via `ai-morph-a`/`ai-morph-b` classes; strokes were already `currentColor` (VIS-06 confirmed, not changed).

## Task Commits

Each task was committed atomically (`--no-verify`, parallel-executor mode):

1. **Task 1: AnimatedIcons — reduced-motion guard + tokenized strokes** - `fb7d686` (feat)
2. **Task 2: FundMeWidget — token de-hack + tamed/gated animations** - `6794fde` (feat)

## Files Created/Modified
- `src/components/AnimatedIcons.tsx` - Added `@media (prefers-reduced-motion: reduce)` rule to the injected keyframe CSS and `ai-morph-group`/`ai-morph-a`/`ai-morph-b` classes to the two cross-fade groups for a deterministic static freeze. Keyframe cross-fade and all 12 icons + showcase preserved. Strokes already `currentColor`.
- `src/components/FundMeWidget.tsx` - Replaced all hardcoded gradient/panel color literals with theme tokens; added `useReducedMotion()` gating + calmed `*-calm` keyframes + a CSS reduced-motion guard; preserved heart button, sparkles, glow, expand panel, and `/fund-me` navigation; added an `aria-label` to the floating button.

## FundMeWidget Token Mapping (recorded per plan output spec)

| Element                          | Before (hardcoded)                                          | After (token)                                                                                  |
| -------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Main button / pulse / glow / CTA | `from-pink-500 via-purple-600 to-blue-600` (+ hover steps) | `linear-gradient(135deg, var(--accent-violet), var(--accent-blue))` (`ACCENT_GRADIENT`)        |
| Click-overlay flash              | `from-pink-500 via-purple-500 to-blue-500`                 | `linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-blue) 100%)` (`ACCENT_GRADIENT_SOFT`) |
| Expand panel background          | `bg-slate-900/95`                                           | `var(--bg-elevated)` (+ `backdrop-blur-xl`)                                                     |
| Panel border                     | `border-pink-500/50`                                       | `var(--border-hover)`                                                                           |
| Panel header tint                | `from-pink-500/20 to-purple-500/20`                        | `linear-gradient(135deg, color-mix(... --accent-violet 18%), color-mix(... --accent-blue 18%))` |
| Panel header divider             | `border-pink-500/30`                                       | `var(--border-default)`                                                                         |
| Tooltip arrow                    | `border-t-purple-600`                                       | `borderTopColor: var(--accent-blue)`                                                            |
| Panel heading / body / muted     | `text-white` / `text-slate-300` / `text-slate-400`        | `--text-primary` / `--text-secondary` / `--text-tertiary`                                       |

Motion mapping: `animate-ping`->`ping-calm` (3s, 1.6x scale), `animate-pulse`->`pulse-calm` (3s, 0.7 opacity floor), `animate-bounce`->`bounce-calm` (2s, -15%), `spin-slow` 3s->8s, `spin-reverse` 4s->10s; all stripped when `useReducedMotion()` is true and frozen by a local reduced-motion media query.

## Decisions Made
- Mapped the warm violet->blue identity onto `--accent-violet`/`--accent-blue` rather than introducing a new pink token, keeping the widget warm/playful while theme-correct.
- Used inline `style` with `var(--...)` for gradients because this project themes through CSS custom properties (not Tailwind `dark:`/arbitrary gradient utilities), per CONVENTIONS.
- Kept the AnimatedIcons keyframe approach verbatim (already efficient); only added a deterministic reduced-motion freeze since strokes were already tokenized.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added `aria-label` to FundMeWidget floating button**
- **Found during:** Task 2 (FundMeWidget rewrite)
- **Issue:** The floating button's only content is an emoji (💖) when collapsed, leaving it without an accessible name for screen readers — an accessibility correctness gap for a primary CTA.
- **Fix:** Added `aria-label="Open fund-me support widget"` to the `<button>`.
- **Files modified:** src/components/FundMeWidget.tsx
- **Verification:** Lint clean; element now has an accessible name; no behavior change.
- **Committed in:** 6794fde (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical).
**Impact on plan:** Minor accessibility hardening within the touched component. No scope creep; Stripe/checkout untouched as required.

## Issues Encountered
- None. Full `npm run build` was intentionally skipped to avoid build-lock contention with parallel executors (05-04/05-05); per-file `tsc --noEmit` and `eslint` are both clean on the two owned files, and the phase build is validated once after all wave agents complete.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Both VIS-06/VIS-07 components elevated, token-conformant, and reduced-motion-respecting.
- Ready for the 05-09 manual verification gate (confirm FundMeWidget reads correctly in light mode and animations calm/still under reduced motion).
- File-disjoint from 05-04 (Navigation/ThemeToggle) and 05-05 (Footer/FAQ/TeamSection) — no shared-file conflicts.

---
*Phase: 05-component-upgrades*
*Completed: 2026-06-12*

## Self-Check: PASSED
- FOUND: src/components/AnimatedIcons.tsx
- FOUND: src/components/FundMeWidget.tsx
- FOUND: .planning/phases/05-component-upgrades/05-06-SUMMARY.md
- FOUND commit: fb7d686 (Task 1 — AnimatedIcons)
- FOUND commit: 6794fde (Task 2 — FundMeWidget)
