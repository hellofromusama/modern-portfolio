---
phase: quick-260703-fse
plan: 01
subsystem: space-mode-ux
tags: [space-mode, launcher, navigation, mobile, touch, tailwind]
requires: [quick-260702-gkj, quick-260702-j59]
provides:
  - top-right animated rocket Space Mode launcher on every classic page
  - clickable space-mode contact links, project-card dive links, hero flyTo CTAs
  - shared PAGES glass dropdown in both HUDs (10 cross-page links)
  - window-level touch parallax + 375px-responsive HUD/panels
  - Tailwind v4 source-scan fix (.planning excluded) restoring ALL site CSS
affects: [classic homepage chrome, space-mode homepage, all dive pages]
tech-stack:
  added: []
  patterns:
    - "styled-jsx CSS-only animation with prefers-reduced-motion kill (Hero3D precedent)"
    - "plain <a href> cross-nav so the space-mode cookie is re-read server-side"
    - "@source not for Tailwind v4 scan exclusions"
key-files:
  created:
    - src/components/three/space/SpacePagesMenu.tsx
  modified:
    - src/components/SpaceModeLauncher.tsx
    - src/components/three/space/SpaceContent.tsx
    - src/components/three/space/SpaceHUD.tsx
    - src/components/three/space/ShellHUD.tsx
    - src/components/three/space/SpaceExperience.tsx
    - src/components/three/space/SpacePageShell.tsx
    - src/components/three/space/space-dom.css
    - src/app/globals.css
decisions:
  - "Launcher slot top-36 right-4 (below Navigation h-16 AND VisitorTracker's top-20 toast); same slot all viewports"
  - "X/Twitter omitted from contact links — no X URL exists anywhere in the codebase"
  - "Tailwind v4 scan excludes .planning via @source not (planning docs must never generate utilities)"
metrics:
  duration: "~2.5h wall (session interrupted by usage limit mid-Task-3)"
  completed: "2026-07-03"
---

# Quick Task 260703-fse: Space Mode UX Round (Top Rocket Launcher) Summary

**One-liner:** Animated top-right rocket launcher + fully clickable space-mode content (contact links, project-card dive links, hero flyTo CTAs, cross-page PAGES menu) + touch parallax and 375px-responsive HUD — plus a root-cause fix for Tailwind v4 silently compiling globals.css to empty.

## Tasks Completed

| Task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 1 | Rocket launcher — top position, CSS animation, theme + reduced-motion safe | 3c58de8 | SpaceModeLauncher.tsx |
| 2 | Clickable space content + PAGES menu + touch parallax + mobile CSS | f198282 | SpaceContent.tsx, SpacePagesMenu.tsx (new), SpaceHUD.tsx, ShellHUD.tsx, SpaceExperience.tsx, SpacePageShell.tsx, space-dom.css |
| 3 | Playwright smoke (desktop + mobile + light-theme) + Rule-1 build fix | f90e739 | globals.css (fix); space-ux-smoke.mjs (scratchpad, not repo) |

## What Was Built

- **Launcher (UX-01):** `fixed top-36 right-4 z-50` rocket button — inline currentColor rocket SVG + thruster flame, `launcher-float` bob + `launcher-glow` accent shadow pulse + `launcher-thruster` flame pulse, hover tilt on the inner rocket span, all killed under `prefers-reduced-motion`. Theme CSS vars only; `enter()` (cookie + full reload) byte-equivalent; hidden on /space and when the cookie is set.
- **Contact (UX-02):** real GitHub/LinkedIn (`target=_blank rel=noopener`) + Email anchors, X omitted (no URL exists in the codebase); CTA now `mailto:hellofromusama@gmail.com`. `.space-links a` inherits panel color with underline (no browser-default blue).
- **Projects (UX-03):** each card is a block `<a href="/projects/{id}">` — full page load re-reads the cookie server-side so the target renders as a dive.
- **Hero CTAs (UX-04):** "View My Work" → flyTo(0.6), "Get In Touch" → flyTo(1.0) using the exact SpaceHUD `window.scrollTo` pattern.
- **PAGES menu (UX-05):** new shared `SpacePagesMenu` glass dropdown (10 plain `<a href>` links, `aria-haspopup`/`aria-expanded`, scrollable `min(60vh,420px)`), rendered in BOTH HUD top-right clusters before "◄ Classic". Existing section-anchor nav untouched.
- **Mobile (UX-06):** `@media (max-width: 640px)` block — compact top bar, hidden sub-label, horizontally-scrollable section nav (max-width 62vw), shorter gauge, tighter panels, readability bump, stacked hero CTAs. Window-level passive `touchstart`/`touchmove` feed the SAME mouse ref CameraRig reads (no rig changes, NO preventDefault — native scroll drives the dive); touch handler publishes `--space-touch-x` for smoke observability.

## Verification Results

- `npx tsc --noEmit` — exit 0 (strict, no new errors)
- `npx eslint` on all touched src files — exit 0
- `npm run build` — exit 0 (strict lint+types; all routes incl. 12 /projects/* prerender)
- `space-ux-smoke.mjs` vs fresh prod build on :3005 — **exit 0, 21/21 PASS**:
  - 1a-1e classic `/`: nav + footer present; launcher visible at y=141 (top slot), rocket svg + "Space Mode" label
  - 2 launcher click enters space mode (`.space-hud-topbar` present)
  - 3a/3b project card `<a href=/projects/kashmir-fund>` navigates and renders as dive
  - 4a-4d GitHub/LinkedIn/mailto hrefs exact; links text "GitHub · LinkedIn · Email" (no X)
  - 5 "View My Work" flies to scrollY 2916 of max 4860 (> 0.3·max)
  - 6a/6b PAGES dropdown → /services renders as dive (cookie survived)
  - 7 light theme: launcher visible, background resolves to rgba(255,255,255,0.9) (light --bg-elevated)
  - 8 mobile 375px: launcher inside viewport, 42px tall
  - 9 no horizontal overflow at 375px; HUD nav right edge 204 ≤ 375
  - 10 touch parallax: `--space-touch-x` −0.787 at x=40 / +0.813 at x=340
  - 11 classic mobile intact: nav+footer, 0 HUD nodes, `--space-scroll` unset

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Tailwind v4 compiled globals.css to EMPTY (site-wide CSS loss in every build)**
- **Found during:** Task 3 (first smoke run: launcher y=19992, no padding, transparent bg — the entire built CSS was two font-only chunks)
- **Issue:** Tailwind v4 auto-scans all non-gitignored files, including `.planning/` markdown. Plan/summary docs contain Windows scratchpad paths (`...\f6c04630-...`); `\f6c046` parses as a CSS escape → code point 16171078 > U+10FFFF → `RangeError` inside the scanner's variable unescape, swallowed, output = empty CSS. **Pre-existing:** the same path string sits in the committed 260702-gkj PLAN/SUMMARY, so every build since then shipped unstyled; earlier smokes only asserted structure, not styling.
- **Fix:** `@source not "../../.planning";` in globals.css (planning docs must never generate utilities anyway). Isolated compile now emits 90KB with all tokens/utilities; rebuilt and re-smoked green.
- **Files modified:** src/app/globals.css
- **Commit:** f90e739

**2. [Rule 1 - Trivial] `.space-cta-secondary` declaration order corrected**
- Plan's CSS listed `font-weight: 600` before `font: inherit`; the `font` shorthand resets weight, so the order was swapped (`font: inherit` first). Same visual intent.

### Test-artifact adjustment (not a source change)

- Smoke check 2 clicks the launcher with `{ force: true }`: the infinite float-bob keyframe means the element's bounding box never passes Playwright's stability actionability check (30s timeout). Humans click bobbing buttons fine; force-click is the standard pattern for perpetually-animated elements (plan already prescribes force for check 3).

### Process notes

- Session was interrupted by a usage limit mid-Task-3 diagnosis; resumed and completed per coordinator instruction (Tasks 1-2 commits verified present, server reused then rebuilt for the CSS fix).
- During port-3005 cleanup, a too-loose `grep :3005` matched ports 30050-30059 and PID 40872 (an unrelated local listener) was force-killed by mistake before the correct PID (9736) was identified and killed. No repo impact; disclosed for transparency.

## MANUAL Owner Checks (flagged by plan)

The smoke only proves the launcher's `var(--bg-elevated)` resolves under `data-theme="light"`. Remaining light-theme visual judgments are MANUAL:
- Rocket glyph + label contrast/legibility on the light `--bg-elevated` pill
- The fixed rgba blue/violet glow-shadow pulse looking right against light backgrounds
- General both-theme visual pass of the launcher hover tilt/thruster flame

Prod server left RUNNING on http://localhost:3005 for immediate manual testing.

## Known Stubs

None — all new UI is wired to real data/links; no placeholder content introduced.

## Self-Check: PASSED

- src/components/three/space/SpacePagesMenu.tsx — FOUND
- src/components/SpaceModeLauncher.tsx contains "prefers-reduced-motion" — FOUND
- src/components/three/space/SpaceContent.tsx contains "https://github.com/hellofromusama" — FOUND
- space-dom.css contains "@media (max-width: 640px)" — FOUND
- SpaceExperience.tsx / SpacePageShell.tsx contain "touchmove" — FOUND
- Commits 3c58de8, f198282, f90e739 — FOUND on fix/space-mode-ux
