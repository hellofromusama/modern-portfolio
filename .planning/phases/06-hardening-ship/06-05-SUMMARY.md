---
phase: 06-hardening-ship
plan: 05
subsystem: ui
tags: [react, localStorage, theming, css-custom-properties, cost-control]

# Dependency graph
requires:
  - phase: 05-component-upgrades
    provides: VisitorCounter deferred-items dark-only chrome flag (05-09 deferred-items.md)
provides:
  - VisitorTracker with the client-side paid-endpoint fan-out fully removed (no visitor browser fires /api/schedule-training or /api/auto-llm-training)
  - JSON.parse of stored visitor data guarded against corrupt localStorage
  - VisitorCounter chrome tokenized to CSS custom properties (renders in both themes)
affects: [06-hardening-ship, 06-07-runtime-network-verification, 06-08-owner-pass]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Guarded JSON.parse: try/catch around localStorage parse, falling through to fresh-state default rather than throwing inside an effect"
    - "Theme-token chrome via inline style referencing var(--bg-elevated)/var(--text-secondary)/var(--border-subtle) instead of dark-only slate literals"

key-files:
  created: []
  modified:
    - src/components/VisitorTracker.tsx
    - src/components/VisitorCounter.tsx

key-decisions:
  - "Removed the client-side paid-endpoint fan-out entirely (orchestrator decision, resolves research Open Q2) rather than shipping a gated sessionStorage opt-in variant — lowest-risk, zero-dependency path"
  - "Used --bg-elevated (not --bg-card) for the VisitorCounter background to preserve the visible floating-panel identity; --bg-card at 0.02 alpha would be too faint"

patterns-established:
  - "Pattern: localStorage reads inside effects must guard JSON.parse so corrupt data degrades to a fresh-state default instead of silently killing the effect"

requirements-completed: [FIX-02]

# Metrics
duration: 2min
completed: 2026-06-12
---

# Phase 6 Plan 5: Remove VisitorTracker Paid-Endpoint Fan-out + Tokenize VisitorCounter Summary

**VisitorTracker no longer fires the paid /api/schedule-training and /api/auto-llm-training calls from every visitor's browser, JSON.parse is crash-guarded, and the deferred VisitorCounter chrome is tokenized to render in both themes.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-06-12T08:04:09Z
- **Completed:** 2026-06-12T08:05:47Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Deleted both background fetch blocks in VisitorTracker (the every-3rd-visit `/api/schedule-training` POST and the first-daily-visit `/api/auto-llm-training` POST) — no visitor browser triggers a paid AI call anymore
- Wrapped `JSON.parse(existingData)` in try/catch so corrupt localStorage degrades to a fresh first-visit state instead of throwing and killing the whole `trackVisitor` effect
- Tokenized VisitorCounter's dark-only slate chrome (`bg-slate-900/80`, `text-slate-300`, `border-slate-700/50`) to `var(--bg-elevated)`/`var(--text-secondary)`/`var(--border-subtle)` so it renders correctly under both `:root` (dark) and `[data-theme="light"]`
- All visible toast/counter behavior preserved byte-for-byte

## Task Commits

Each task was committed atomically (parallel-wave executor, `--no-verify`, explicit per-file staging):

1. **Task 1: Remove paid-endpoint fetch blocks + guard JSON.parse** - `1e1443d` (fix)
2. **Task 2: Tokenize VisitorCounter chrome for both themes** - `e83266b` (fix)

## Files Created/Modified
- `src/components/VisitorTracker.tsx` - Removed both background paid-endpoint fetch blocks; guarded JSON.parse against corrupt localStorage; toast/counter behavior unchanged
- `src/components/VisitorCounter.tsx` - Replaced dark-only slate literals with CSS custom-property chrome (inline style); structure/content unchanged

## Decisions Made
- Removed the client-side fan-out entirely (orchestrator decision resolving research Open Q2) instead of a gated opt-in variant — zero new deps, lowest risk. The API routes remain server-side for the owner's FIX-01 admin call / future cron.
- Chose `--bg-elevated` for the counter background to keep the floating panel visibly distinct; `--bg-card` (0.02 alpha) would render nearly invisible.

## Deviations from Plan

None - plan executed exactly as written. The JSON.parse guard was specified in Task 1 and is documented above as planned work, not a deviation.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Source-level grep gate passes: `grep -cE "schedule-training|auto-llm-training" src/components/VisitorTracker.tsx` returns 0.
- VisitorCounter grep gate passes: `grep -cE "bg-slate-900|text-slate" src/components/VisitorCounter.tsx` returns 0.
- Runtime network confirmation (a fresh visit fires no paid AI call via DevTools/curl) is the 06-07/06-08 owner pass; this plan's gate is the source-level grep, which is met.

## Self-Check: PASSED
- FOUND: src/components/VisitorTracker.tsx (modified, grep gate 0)
- FOUND: src/components/VisitorCounter.tsx (modified, grep gate 0)
- FOUND commit: 1e1443d
- FOUND commit: e83266b

---
*Phase: 06-hardening-ship*
*Completed: 2026-06-12*
