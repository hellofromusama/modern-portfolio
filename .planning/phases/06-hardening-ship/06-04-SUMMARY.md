---
phase: 06-hardening-ship
plan: 04
subsystem: api
tags: [security, auth, shared-secret, api-routes, next-server, fail-closed]

# Dependency graph
requires:
  - phase: 06-hardening-ship (06-01)
    provides: type-fixed api/* routes (NextRequest imports / handler signatures cleaned)
  - phase: 06-hardening-ship (06-03)
    provides: lint-clean api/* routes (no unused vars, real interfaces)
provides:
  - requireAdmin(request) shared-secret gate (src/lib/admin-guard.ts) — fail-closed 403 / 401 / null-proceed
  - all 5 test/training routes gated on EVERY exported handler (8 handlers total)
  - test-openai key-prefix leak (keyUsed) removed + raw OpenAI error-body passthrough removed
affects: [06-07 (curl smoke gate), 06-08 (final ship verification), vercel-deploy]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Shared-secret admin gate: first-statement guard returning NextResponse|null, applied to every exported handler"
    - "Fail-closed default: unset ADMIN_API_TOKEN => 403 disabled (never expose token/key)"

key-files:
  created:
    - src/lib/admin-guard.ts
  modified:
    - src/app/api/test-openai/route.ts
    - src/app/api/test-free-llm/route.ts
    - src/app/api/ai-training/route.ts
    - src/app/api/auto-llm-training/route.ts
    - src/app/api/schedule-training/route.ts

key-decisions:
  - "Fail-closed: missing ADMIN_API_TOKEN => 403 always, never a token/key leak"
  - "Guard-not-delete: owner feature preserved, callable with x-admin-token header; no token shipped to any client/UI"
  - "test-openai success payload returns ok: true instead of keyUsed; error path returns generic message + statusCode only"

patterns-established:
  - "requireAdmin is the FIRST statement of every exported route handler (GET and POST), before any route logic or env-flag checks"
  - "No-param GET()/POST() handlers given (request: NextRequest) so the guard can read the x-admin-token header"

requirements-completed: [FIX-01]

# Metrics
duration: 3min
completed: 2026-06-12
---

# Phase 6 Plan 4: requireAdmin Shared-Secret Gate Summary

**Fail-closed shared-secret admin gate (x-admin-token + ADMIN_API_TOKEN) applied as the first statement of all 8 handlers across the 5 test/training routes, plus removal of the test-openai key-prefix (keyUsed) and raw-error-body leaks — zero new dependencies.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-12T08:20:23Z
- **Completed:** 2026-06-12T08:23:17Z
- **Tasks:** 2
- **Files modified:** 6 (1 created, 5 modified)

## Accomplishments
- `src/lib/admin-guard.ts` — ~17-line `requireAdmin(request)` helper: fail-closed 403 when `ADMIN_API_TOKEN` unset, 401 on missing/wrong `x-admin-token`, `null` to proceed when authorized. Zero new deps.
- All 5 routes gated on EVERY exported handler — 8 handlers total (test-openai GET, test-free-llm POST, and GET+POST on each of ai-training / auto-llm-training / schedule-training). Each dual-handler route has exactly 2 guard call sites; the first-statement assertion totals 8.
- test-openai leak closed: `keyUsed` (first 10 bytes of `OPENAI_API_KEY`) removed → returns `ok: true`; raw OpenAI error-body passthrough removed → returns a generic `message` + `statusCode` only.
- All 6 owned files stay `tsc --noEmit` clean and `eslint` clean (exit 0, 0 problems).

## Task Commits

Each task was committed atomically (`--no-verify`, explicit per-file staging):

1. **Task 1: Create requireAdmin shared guard** - `8493a8f` (feat)
2. **Task 2: Gate all five routes + remove test-openai keyUsed leak** - `6c6afd7` (feat)

**Plan metadata:** see final docs commit.

## Files Created/Modified
- `src/lib/admin-guard.ts` - New `requireAdmin(request): NextResponse | null` shared-secret gate (fail-closed)
- `src/app/api/test-openai/route.ts` - GET gated; `keyUsed` removed (`ok: true`); generic error message (no raw OpenAI body); `NextRequest` import + param added
- `src/app/api/test-free-llm/route.ts` - POST gated; `NextRequest` import + param added
- `src/app/api/ai-training/route.ts` - GET + POST both gated; both given `(request: NextRequest)`; `NextRequest` import added
- `src/app/api/auto-llm-training/route.ts` - GET + POST both gated; both given `(request: NextRequest)`; `NextRequest` import added (existing `AI_TRAINING_ENABLED` flag preserved below the guard)
- `src/app/api/schedule-training/route.ts` - GET + POST both gated; both given `(request: NextRequest)`; `NextRequest` import added

## Decisions Made
- **Fail-closed** is the default: an unset `ADMIN_API_TOKEN` returns `403 {status:'disabled'}` and never echoes a token or key.
- **Guard-not-delete:** the owner-only test/training features are preserved and remain callable with the correct `x-admin-token` header; the token is never embedded in any client/UI page (the `/test-apis` + `/llm-training-dashboard` UIs are owner-local and supply the header manually, or remain non-functional in prod — acceptable for owner tools).
- test-openai success returns `ok: true` (boolean, no key bytes); error path returns `message: 'OpenAI API request failed'` + `statusCode` (no upstream error body).

## Deviations from Plan

**None - plan executed exactly as written.**

The guard was applied verbatim from the research-verified pattern, the keyUsed leak and raw-error passthrough were removed as specified, and all per-file/handler-count verifications pass.

## Issues Encountered

**Verify-count interpretation (not a deviation, no code change):** The plan's raw `grep -c requireAdmin` acceptance thresholds (single-handler `>=1`, dual-handler `==2`) are satisfied conceptually but the literal raw counts came back one higher per file (single=2, dual=3) because `requireAdmin` also appears on the `import` line in each file. The load-bearing, unambiguous assertions both pass exactly:
- Guard **call sites** (`const denied = requireAdmin`) per file = 1, 1, 2, 2, 2 — matching each file's exported-handler count exactly.
- First-statement assertion (`grep -A2` on each export) = **8** total, equal to the total handler count (1+1+2+2+2).
- `keyUsed` count in test-openai = **0**.

Wave 1 (06-01/06-03) had additionally stripped `NextRequest` from these imports and left all handlers param-less (including the single-handler routes), so every file needed `NextRequest` added back to its import and a `request: NextRequest` param added to each handler — done as part of the in-scope guard wiring.

## User Setup Required

**One environment variable must be configured for these owner-only routes to be reachable:**

- **`ADMIN_API_TOKEN`** — an owner-chosen strong random secret.
  - **Production:** Vercel project `modern-portfolio` → Settings → Environment Variables.
  - **Local dev:** add to `.env.local` (no `.env.local.example` exists in the repo and none was created — a real secret must never be committed).
  - **Behavior when unset:** all 5 routes fail closed (`403 {status:'disabled'}`), exposing no token or key. This is the safe default for production if the owner chooses not to enable the tools.
  - **Usage:** call the routes with header `x-admin-token: <ADMIN_API_TOKEN>` to reach the existing route logic.

## Next Phase Readiness
- FIX-01 complete; the unauthenticated paid-OpenAI GET and the unguarded training routes are now gated and leak-free.
- 06-07 can run its curl smoke gate: unauth `GET /api/test-openai` → 401/403 with no key bytes; with the `x-admin-token` header it reaches route logic.
- No blockers. `tsc` + `lint` remain clean on all owned files (the pre-existing 29-error tsc baseline in OTHER api/expertise files is out of scope for this plan and untouched).

## Self-Check: PASSED

All 7 files verified present (admin-guard + 5 routes + SUMMARY); both task commits (`8493a8f`, `6c6afd7`) verified in git log.

---
*Phase: 06-hardening-ship*
*Completed: 2026-06-12*
