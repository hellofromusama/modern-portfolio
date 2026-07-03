---
phase: quick-260703-jyh
plan: 01
subsystem: ui
tags: [logo, scroll-morph, navigation, space-mode, hud, accessibility, reduced-motion]
requires:
  - Existing `scrolled` state (window.scrollY > 20) in Navigation.tsx
  - Existing --space-scroll rAF tick loops in SpaceHUD/ShellHUD (task 260703-fse state)
provides:
  - Anthropic-style scroll logo morph "Usama Javed" -> "UJ" in classic mode (Navigation.tsx)
  - Same morph on the gradient wordmark in space mode (SpaceHUD on /, ShellHUD on /services etc.)
  - Shared .space-logo-seg / .space-logo-collapsed CSS contract in space-dom.css
affects: [Navigation, SpaceHUD, ShellHUD, space-dom.css]
tech-stack:
  added: []
  patterns:
    - Segmented wordmark (U / sama&nbsp; / J / aved) with max-width+opacity collapse; nbsp INSIDE the first collapse span
    - Per-segment gradient (.space-logo-grad) because background-clip:text through inline-block overflow-hidden descendants is unreliable
    - rAF classList toggle with hysteresis (0.05 in / 0.03 out) on a ref — zero per-frame React state
key-files:
  created: []
  modified:
    - src/components/Navigation.tsx
    - src/components/three/space/SpaceHUD.tsx
    - src/components/three/space/ShellHUD.tsx
    - src/components/three/space/space-dom.css
decisions:
  - "Classic collapse driven by existing `scrolled` state via inline segStyle — SSR renders expanded wordmark (scrolled=false initial), no flash, SEO intact"
  - "Space gradient applied per segment (.space-logo-grad), not on the parent — cross-engine background-clip:text reliability; ramp restart invisible at 1.4rem"
  - "Design-hook findings (gradient-text, layout-transition on max-width) classified intentional: brand gradient is pre-existing, collapse fires once per threshold crossing (not continuous layout thrash) — plan-locked approach"
metrics:
  duration: ~14 min
  completed: 2026-07-03
  tasks: 3
  files: 4
---

# Quick Task 260703-jyh: Anthropic-Style Scroll Logo Morph Summary

**One-liner:** Top-left logo reads "Usama Javed" at page top and smoothly collapses to "UJ" on scroll — bidirectional, in both classic nav (scrolled-state inline collapse) and space mode (rAF hysteresis class toggle on --space-scroll), reduced-motion crossfade, SSR-expanded, 10/10 Playwright smoke on the fresh :3005 prod build.

## What Was Done

### Task 1 — Classic mode (Navigation.tsx) — commit 02e1846
- Logo Link children segmented into `U` + collapsible `sama&nbsp;` + `J` + collapsible `aved` inside an `aria-hidden` nowrap span; Link gained `aria-label="Usama Javed — home"` (className/style/focusRing untouched).
- `segStyle` computed inline from existing `scrolled` + `reduceMotion` state: `maxWidth: scrolled ? 0 : '4em'`, opacity 0/1, `max-width 0.45s cubic-bezier(0.16,1,0.3,1)` (EASE_SIGNATURE) + `opacity 0.3s ease`; reduced motion = opacity transition only.
- `&nbsp;` lives INSIDE the first collapse span (trailing normal space would be trimmed → "UsamaJaved"; leading space on J would survive collapse → "U J").

### Task 2 — Space mode (SpaceHUD + ShellHUD + space-dom.css) — commit f612356
- Both HUDs (kept in sync): top-left block gained `ref={logoBlockRef}` + `.space-logo-block`; the old inline-gradient "UJ" span became a segmented `.space-logo` wordmark (`aria-label="Usama Javed"`), gradient moved to per-segment `.space-logo-grad`.
- Inside each existing rAF `tick()` after `t` is read: `classList.add/remove("space-logo-collapsed")` with 0.05/0.03 hysteresis — no React state, no new rAF loop.
- space-dom.css: `.space-logo-grad` gradient, `.space-logo-seg` collapse transitions (max-width 0.5s EASE_SIGNATURE + opacity 0.35s), `.space-logo-collapsed` collapse, sub-label opacity crossfade (hidden while wordmark expanded, fades in when collapsed), `prefers-reduced-motion` opacity-only override, and `.space-logo { font-size: 1.05rem !important }` inside the existing 640px block.

### Task 3 — Build gate + smoke — no new source commit (Tasks 1-2 committed all four files)
- Stopped the stale :3005 prod server via EXACT match `(Get-NetTCPConnection -LocalPort 3005 -State Listen).OwningProcess` → PID 32452, command line verified as this repo's `next start` before kill.
- `rm -rf .next` + `npm run build` (strict lint+types in-build): exit 0, all routes incl. 12 /projects/* SSG.
- Fresh `npx next start -p 3005` running in background; HTTP 200.
- Smoke `logo-morph-smoke.mjs` (scratchpad pw-record, Playwright 1.61.1, NOT in repo): **10/10 PASS**, including the checker's folded-in improvement — at 375px space-mode scroll top (wordmark expanded = widest) the SpacePagesMenu trigger boundingBox satisfies `box.x >= 0 && box.x + box.width <= 375`, in addition to `scrollWidth <= 375`.

## Verification Results

| Gate | Result |
|------|--------|
| npx tsc --noEmit | exit 0 (Tasks 1 and 2) |
| npx eslint (3 touched TSX files) | exit 0 |
| npm run build (strict, clean .next) | exit 0 |
| Smoke 1. classic expanded at top + SSR wordmark | PASS |
| Smoke 2. classic collapses to UJ after scroll | PASS |
| Smoke 3. classic re-expands at top | PASS |
| Smoke 4. aria-label intact after scroll cycle | PASS |
| Smoke 5. space / expanded at dive start | PASS |
| Smoke 6. space / collapsed at 30% dive | PASS |
| Smoke 7. ShellHUD /services expand -> collapse | PASS |
| Smoke 8. reduced motion: both states reachable (classic + space) | PASS |
| Smoke 9. mobile 375px classic: single-line logo, clears hamburger | PASS |
| Smoke 10. mobile 375px space: no overflow + PAGES trigger in [0,375] | PASS |

## Deviations from Plan

### Auto-fixed / handled

**1. [Rule 3 - Blocking] Design-hook redirection artifacts cleaned**
- **Found during:** Task 3 (git status before docs commit)
- **Issue:** Four empty 0-byte files (`(null)`, `,`, `0.05)`, `UJ`) appeared in the repo root during Task 2 — shell-redirection artifacts of the post-edit design hook scanning content containing `> UJ` / `t > 0.05)`, not project files.
- **Fix:** Deleted; tree clean.
- **Files modified:** none (deletions of junk only)

**2. Commit granularity:** plan's Task 3 said "commit the four source files" in one commit; orchestrator constraints required per-task atomic commits, so Tasks 1 and 2 each committed their own files (02e1846, f612356). Task 3 produced no repo source changes (smoke script is scratchpad-only).

Otherwise: plan executed exactly as written, including the locked spacing rule, hysteresis values, and per-segment gradient decision.

## Design-Hook Findings (intentional, not suppressed)

- `gradient-text` on `.space-logo-grad`: the site's pre-existing brand gradient logo, moved verbatim from inline styles — intentional.
- `layout-transition` on `.space-logo-seg` max-width: the plan-locked collapse mechanism; transitions fire once per threshold crossing on a few-em inline span, not continuous layout animation — intentional.
- `side-tab:134` pre-exists in an untouched section of space-dom.css — out of scope.

## Known Stubs

None — no placeholder data or unwired components introduced.

## Server State

`npx next start -p 3005` (fresh build) LEFT RUNNING at http://localhost:3005 for the owner's manual pass (visual smoothness both modes, gradient continuity on the segmented wordmark, sub-label crossfade taste).

## Self-Check: PASSED

- src/components/Navigation.tsx — FOUND (contains `aria-label="Usama Javed — home"`)
- src/components/three/space/SpaceHUD.tsx — FOUND (contains `space-logo-collapsed`)
- src/components/three/space/ShellHUD.tsx — FOUND (contains `space-logo-collapsed`)
- src/components/three/space/space-dom.css — FOUND (contains `.space-logo-seg`)
- Commit 02e1846 — FOUND
- Commit f612356 — FOUND
