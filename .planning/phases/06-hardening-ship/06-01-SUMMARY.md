---
phase: 06-hardening-ship
plan: 01
subsystem: api
tags: [typescript, eslint, stripe, strict-build, type-safety]

# Dependency graph
requires:
  - phase: 05-component-upgrades
    provides: 29-error tsc baseline measured at phase start (11 in these 4 api/* files + 18 in expertise)
provides:
  - "Four AI/payment API routes (auto-llm-training, ai-training, create-checkout, budget-estimate) pass npx tsc --noEmit with ZERO errors (down from 11)"
  - "Same four files pass npm run lint with ZERO problems (down from ~32)"
  - "Stripe SDK pinned to apiVersion '2025-08-27.basil' matching stripe@18.5.0 — genuinely type-clean, no `as any` band-aid"
affects: [06-05, 06-07, SHIP-02, strict-build-flip]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Provider-result interfaces (ProviderResult / TrainingResults) replace null-inferred object literals to satisfy strict null checks"
    - "Awaited<ReturnType<typeof fn>> to derive a TrainingData type from an existing factory without duplicating the shape"
    - "catch (error: unknown) + narrowed local shape (no `as any`) for SDK error fields"
    - "Bare `catch {}` (ES2019) for intentionally-unused error bindings"

key-files:
  created: []
  modified:
    - src/app/api/auto-llm-training/route.ts
    - src/app/api/ai-training/route.ts
    - src/app/api/create-checkout/route.ts
    - src/app/api/budget-estimate/route.ts

key-decisions:
  - "Typed catch error as `unknown` + narrowed local shape `{ type?, code?, statusCode?, message? }` in create-checkout instead of `as any` — keeps the strict-build flip (06-07) genuinely clean"
  - "Derived ai-training's TrainingData via `Awaited<ReturnType<typeof getTrainingData>>` rather than hand-writing a parallel interface, so the type stays in lockstep with the factory"
  - "Hoisted `userMessage` to outer POST scope in budget-estimate so the catch-block fallback can reference it (root cause of TS2304 was block-scoped destructuring)"

patterns-established:
  - "Pattern: no-explicit-any lint and TS7006/TS18047 type errors are the same untyped-data problem — fixed together per file via real interfaces, never eslint-disable"
  - "Pattern: TS2769 `void` fetch body fixed by building the FormData/payload into a variable first, then passing that variable as body (never the void-returning method call)"

requirements-completed: [SHIP-02]

# Metrics
duration: 7min
completed: 2026-06-12
---

# Phase 6 Plan 01: API-Route Type & Lint Burndown Summary

**Cleared all 11 tsc errors and ~32 lint problems across the four AI/payment API routes — including the Stripe apiVersion bump to the SDK-pinned '2025-08-27.basil' literal — with real types (no `as any`), so the 06-07 strict-build flip stands on genuinely clean files.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-12T08:03:46Z
- **Completed:** 2026-06-12T08:10:58Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- `auto-llm-training/route.ts`: declared `ProviderResult` + `TrainingResults` + `TrainingScenario` interfaces, annotated the `results` const → cleared all 7 errors (5× TS18047 possibly-null access + 2× TS2322 object-to-null assignment); typed the 6 scenario helpers; removed the `console.log('🔑 API Key format:', ...substring(0,7))` key-prefix leak.
- `ai-training/route.ts`: typed the `example`/`conv` map callbacks (TS7006) and fixed the real TS2769 bug — `new FormData().append(...)` returns `void` and was being passed as the fetch `body`; now builds `uploadForm` then passes it. `TrainingData = Awaited<ReturnType<typeof getTrainingData>>` feeds all provider submitters.
- `create-checkout/route.ts`: bumped Stripe `apiVersion` `'2024-06-20'` → `'2025-08-27.basil'` (TS2322 fix, matches stripe@18.5.0); typed the catch error as `unknown` with a narrowed shape; 503 null-guard preserved verbatim. Type-check-only validation — no live charge.
- `budget-estimate/route.ts`: hoisted `userMessage` to the outer POST scope so the catch fallback resolves (TS2304); `ChatMessage` interface types the `conversationHistory` params and map callbacks (4× no-explicit-any). OpenAI→Grok→fallback chain preserved.
- Result: owned files report **0 tsc errors** and **0 lint problems**; `git diff package.json package-lock.json` empty (no new deps).

## Task Commits

Each task was committed atomically (`--no-verify`, explicit per-file staging):

1. **Task 1: Type the two training routes + remove console key leak** - `5973077` (fix)
2. **Task 2: Stripe apiVersion bump + budget-estimate undefined var + lint** - `adea759` (fix)

**Plan metadata:** see final docs commit below.

## Files Created/Modified
- `src/app/api/auto-llm-training/route.ts` - Provider-result interfaces, typed helpers, removed API-key-prefix console leak
- `src/app/api/ai-training/route.ts` - TrainingConversation/TrainingData types, fixed void FormData fetch body, bare-catch hygiene
- `src/app/api/create-checkout/route.ts` - Stripe apiVersion '2025-08-27.basil', unknown-typed catch with narrowed shape
- `src/app/api/budget-estimate/route.ts` - Hoisted userMessage, ChatMessage-typed conversation history

## Decisions Made
- Used `error: unknown` + a narrowed local shape in create-checkout rather than the file's original `error: any` — the 06-07 strict-build flip depends on these being genuinely clean, and `as any`/`error: any` would re-introduce the exact lint the plan asked to clear.
- Derived `TrainingData` from the existing `getTrainingData` factory via `Awaited<ReturnType<...>>` instead of hand-authoring a parallel interface, eliminating drift.
- Root cause of the budget-estimate TS2304 was the `{ userMessage }` destructuring being block-scoped to the `try`; the catch fallback `generateFallbackEstimate(userMessage)` referenced it out of scope. Hoisted `let userMessage = ''` to the function body — minimal, behavior-preserving.

## Deviations from Plan

None - plan executed exactly as written. All fixes matched the plan's documented root-cause analysis (TS18047/TS2322 via interfaces, TS7006/TS2769 in ai-training, TS2322 apiVersion bump, TS2304 hoist). No Rule 1-4 deviations were required.

## Issues Encountered
- Speculatively added an unused `ConversationMessage` interface in ai-training during typing; eslint flagged it (`no-unused-vars`) and it was removed before the Task 1 commit. No impact on the committed result.

## User Setup Required
None - no external service configuration required. The Stripe apiVersion change is a type-check-only validation; any live test-mode smoke is a 06-05/deploy concern, not this plan.

## Next Phase Readiness
- **Strict-build flip (06-07) unblocked for the api/* half of SHIP-02:** all four owned files are genuinely tsc- and lint-clean with no suppressions.
- **Parallel-execution note:** at completion, overall `npx tsc --noEmit` reports **0** errors (exit 0), not the plan-predicted 18. The remaining 18 belonged to `expertise/page.tsx` (owned by 06-02), which finished in parallel (commit `ecc6ba8`). My 4 files contributed exactly the 11 errors the plan scoped; their removal is confirmed by `tsc 2>&1 | grep -E "api/(auto-llm-training|ai-training|create-checkout|budget-estimate)" → 0`.
- **Shared state:** `.planning/STATE.md` shows a parallel-executor modification in the working tree (06-02/06-03/06-05 also running); 06-07 reconciles. This plan touched only its 4 owned source files.

## Self-Check: PASSED

All 4 modified source files present; SUMMARY present; both task commits (`5973077`, `adea759`) found in git log.

---
*Phase: 06-hardening-ship*
*Completed: 2026-06-12*
