---
phase: 06-hardening-ship
plan: 07
subsystem: infra
tags: [strict-build, next-config, tsc, eslint, verify-prod, fix-01, fix-02, ship-02, ship-01]

# Dependency graph
requires:
  - phase: 06-hardening-ship (06-01)
    provides: api/* routes tsc + lint clean (the strict-build flip stands on these)
  - phase: 06-hardening-ship (06-02)
    provides: expertise/page.tsx tsc + lint clean
  - phase: 06-hardening-ship (06-03)
    provides: 16-file lint sweep clean (incl. test-apis TestResults interface)
  - phase: 06-hardening-ship (06-04)
    provides: requireAdmin fail-closed gate on /api/test-openai (FIX-01)
  - phase: 06-hardening-ship (06-05)
    provides: VisitorTracker paid-endpoint fan-out removed (FIX-02)
  - phase: 06-hardening-ship (06-06)
    provides: globals.css @view-transition (build stays green)
provides:
  - "next.config.ts strict: eslint.ignoreDuringBuilds + typescript.ignoreBuildErrors REMOVED — next build now enforces tsc + lint as a hard gate (SHIP-02)"
  - "Strict-green build proven over a verified-clean tree (tsc-exit:0 + lint-exit:0 captured BEFORE the flip, build-exit:0 after)"
  - "scripts/verify-prod.sh — reusable BASE_URL-parameterized post-deploy checklist emitting one PASS/FAIL line per check, exit non-zero on any failure (06-08 log-grep contract)"
  - "FIX-01 confirmed live: unauth GET /api/test-openai -> 403, no keyUsed bytes"
  - "FIX-02 confirmed live: no homepage-loaded chunk references /api/schedule-training or /api/auto-llm-training (only the code-split owner /llm-training-dashboard chunk does)"
affects: [06-08 (deploy + owner browser pass), vercel-deploy, milestone-ship]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "STOP-on-dirty-tree strict-flip: capture tsc-exit + lint-exit VERBATIM before removing the ignore flags; never flip over a non-zero tree (that just moves the failure into next build = re-created theater)"
    - "verify-prod.sh occurrence-counting (grep -o | grep -c .) not line-counting — robust against minified single-line served HTML"

key-files:
  created:
    - scripts/verify-prod.sh
    - .planning/phases/06-hardening-ship/deferred-items.md
  modified:
    - next.config.ts
    - src/app/test-apis/page.tsx

key-decisions:
  - "Removed both ignore* blocks entirely (cleaner than setting false); all other next.config.ts keys left byte-identical"
  - "Auto-fixed the one strict-tsc regression (test-apis openai?: unknown -> Record<string, unknown>) as its own commit BEFORE the flip, so the flip lands over a genuinely-clean tree — honors the gate's intent without burying anything in next build"
  - "verify-prod.sh JSON-LD + keyUsed checks count OCCURRENCES not matching lines (the served HTML/JSON is minified to one line, so grep -c under-counts to 1)"
  - "viewport/themeColor/colorScheme metadata-export warnings logged to deferred-items.md (non-blocking, out of scope — analog of the images.domains warning the plan scoped out)"

patterns-established:
  - "Pattern: prove the pre-flip tree clean with explicit echo exit-code lines; the strict flag flip is a separate atomic commit from any repair"
  - "Pattern: FIX-02 verified at the chunk level — assert NO homepage-loaded chunk (shared + app/page + app/layout) contains the paid endpoints; the owner dashboard chunk legitimately does and is code-split off the homepage"

requirements-completed: [SHIP-02, SHIP-01]

# Metrics
duration: 18min
completed: 2026-06-12
---

# Phase 6 Plan 07: Strict-Build Flip + Full Gate + verify-prod.sh Summary

**Removed the two `ignore*` flags from next.config.ts so `next build` now enforces tsc + lint as a hard gate (SHIP-02), proven strict-green over a verified-clean tree, plus a reusable PASS/FAIL-emitting `scripts/verify-prod.sh` post-deploy checklist — with FIX-01 (unauth /api/test-openai -> 403, no keyUsed) and FIX-02 (no homepage chunk fires the paid AI endpoints) confirmed live against the local strict prod build.**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-06-12T08:16:00Z
- **Completed:** 2026-06-12T08:34:00Z
- **Tasks:** 2
- **Files modified:** 4 (2 created, 2 modified)

## Accomplishments
- **Pre-flip gate captured VERBATIM over a clean tree:** `npx tsc --noEmit; echo tsc-exit:$?` and `npm run lint; echo lint-exit:$?` both printed `:0` — but only AFTER auto-fixing the single strict-tsc regression that the parallel skip-build mandate let slip (see Deviations). The flags were NOT flipped over the initial dirty tree.
- **SHIP-02 strict flip:** removed `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true` from next.config.ts; flag grep returns 0; all other keys (images, headers, redirects, rewrites, compiler, experimental) byte-identical (`git diff` = 6 deletions only).
- **Strict-green build proven:** `npm run build; echo build-exit:$?` -> `build-exit:0`. The build now runs `Linting and checking validity of types ...` (previously skipped) as a hard gate and passes — 50/50 static pages, 12 `/projects/*` SSG slugs, all API routes present.
- **scripts/verify-prod.sh authored:** bash, `BASE_URL` as `$1` (default `https://www.usamajaved.com.au`), 7 checks each emitting one `PASS`/`FAIL` line, exit non-zero on any failure. Verified GREEN against the local strict prod build: **7/7 PASS, exit 0.**
- **FIX-01 confirmed live:** unauth `GET /api/test-openai` -> `403 {"status":"disabled"}`, `keyUsed` occurrence count = 0 (fail-closed requireAdmin runs as the first statement, before any OpenAI fetch).
- **FIX-02 confirmed live:** every homepage-loaded chunk (6 shared + app/page + app/layout) contains 0 references to `/api/schedule-training` or `/api/auto-llm-training`; the VisitorTracker chunk (`8455.*.js`) is clean. The only chunk with those strings is the code-split owner-only `/llm-training-dashboard/page` chunk, which is NOT loaded on a visitor's homepage.
- **Both-theme structural smoke:** the served compiled CSS (`/_next/static/css/4379c3e1...css`) carries BOTH palettes — dark `:root{--bg-primary:#0a0a0f}` and `[data-theme=light]{--bg-primary:#f8fafc}`; `/`, `/expertise`, `/services` all reference the SAME chunk (uniform both-theme palette across routes). 6 spot-checked routes (`/`, `/expertise`, `/services`, `/ai-engineering`, `/projects/kashmir-fund`, `/blog`) all HTTP 200.

## Task Commits

Each task was committed atomically (`--no-verify`, explicit per-file staging):

1. **Task 1 (Rule-1 pre-flip repair): type TestResults.openai** - `e65e217` (fix)
2. **Task 1 (strict flip): remove ignore* flags** - `df0338d` (feat)
3. **Task 2: scripts/verify-prod.sh** - `51d89ff` (feat)

**Plan metadata:** see final docs commit.

## Files Created/Modified
- `next.config.ts` - Removed `eslint.ignoreDuringBuilds` + `typescript.ignoreBuildErrors` blocks; strict build now enforces tsc + lint. All other keys byte-identical.
- `scripts/verify-prod.sh` - New post-deploy/pre-deploy checklist: 7 PASS/FAIL checks (/ 200, sitemap valid+routes, robots tiers, llms.txt text/markdown, ~7 JSON-LD blocks, /api/test-openai unauth 401/403+no keyUsed, IndexNow key file 200); occurrence-counting; exit non-zero on any fail.
- `src/app/test-apis/page.tsx` - `openai?: unknown` -> `openai?: Record<string, unknown>` (Rule-1 fix: `unknown` failed the `&&` JSX guard under strict tsc).
- `.planning/phases/06-hardening-ship/deferred-items.md` - Logged out-of-scope viewport/themeColor/colorScheme metadata-export warnings + the pre-existing images.domains deprecation.

## Decisions Made
- **Removed both ignore* blocks entirely** rather than setting them `false` — cleaner config, zero behavior difference, and the flag grep proves 0 `: true` ignore flags remain.
- **Repaired the one regression BEFORE flipping, as a separate commit.** The plan's STOP-on-dirty-tree gate exists so a Wave-1/2 regression isn't buried inside `next build`. The regression here was a single, fully-understood strict-tsc type error in an 06-03-owned file. The GSD-correct path: auto-fix it (Rule 1 - Bug), commit it on its own, re-confirm `tsc-exit:0` + `lint-exit:0` over the now-genuinely-clean tree, THEN flip. Nothing is buried — the pre-flip exit codes are real zeros.
- **Occurrence-counting in verify-prod.sh.** `grep -c` counts matching LINES; the served homepage HTML and the JSON API body are minified onto a single line, so `grep -c 'application/ld+json'` reported 1 for 14 real occurrences. Switched the JSON-LD and keyUsed checks to `grep -o ... | grep -c .` (one match per line). This also hardens the FIX-01 keyUsed assertion against a future inline leak.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Strict-tsc regression in test-apis/page.tsx blocking the pre-flip gate**
- **Found during:** Task 1 (pre-flip `npx tsc --noEmit`)
- **Issue:** `npx tsc --noEmit` returned `tsc-exit:1` with `src/app/test-apis/page.tsx(79,13): error TS2322: Type 'unknown' is not assignable to type 'ReactNode'`. 06-03 had typed `TestResults.openai` as `unknown`; the `{results.openai && (<div>...)}` JSX guard at line 79 makes `unknown` flow to a render position, which strict tsc rejects. This was the one regression the plan's STOP gate is designed to catch — but it is a single, well-understood type error, not a structural failure.
- **Fix:** Changed `openai?: unknown` -> `openai?: Record<string, unknown>` (a truthy-narrowable object type, valid as a `&&` JSX guard; the value is still `JSON.stringify`'d for display, and the `data` from `response.json()` plus the error-fallback object both satisfy it).
- **Files modified:** src/app/test-apis/page.tsx
- **Verification:** `npx tsc --noEmit` re-run -> `tsc-exit:0`; `npm run lint` -> `lint-exit:0`. Committed as `e65e217` BEFORE the flag flip, so the flip lands over a verified-clean tree.
- **Committed in:** e65e217 (separate pre-flip commit)

**2. [Rule 1 - Bug] verify-prod.sh under-counted JSON-LD blocks (line-count vs occurrence-count)**
- **Found during:** Task 2 (first run of verify-prod.sh against local prod)
- **Issue:** The script's JSON-LD check used `grep -c 'application/ld+json'`, which counts matching LINES. The served homepage HTML is minified to one line, so 14 real occurrences (7 `<script type="application/ld+json">` tags) reported as 1 — a false FAIL. The keyUsed check had the same latent flaw.
- **Fix:** Added a `count_occ` helper (`grep -o -F | grep -c .`) and switched both the JSON-LD and keyUsed checks to occurrence-counting.
- **Files modified:** scripts/verify-prod.sh
- **Verification:** Re-ran -> JSON-LD reports 7, full script 7/7 PASS exit 0. Manually confirmed 7 `<script type="application/ld+json">` opening tags in the served HTML and `keyUsed` occurrence = 0.
- **Committed in:** 51d89ff (part of the Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 Rule 1 - Bug).
**Impact on plan:** Both fixes were necessary for correctness and are in-scope to this plan's own gate (one unblocked the strict pre-flip; one corrected the verify script this task authored). No scope creep, no new deps, no architectural change. The strict flip itself landed exactly as written over a genuinely-clean tree.

## Issues Encountered
- The strict `npm run build` emits `⚠ Unsupported metadata viewport/themeColor/colorScheme is configured in metadata export` for ~25 routes. These are Next.js 15 WARNINGS (advisory to move those keys to a `viewport` export), NOT type/lint errors — the build exits 0. Out of scope per the plan (analog of the explicitly-excluded `images.domains` warning). Logged to `deferred-items.md` for a future cleanup; no functional or SEO impact today.

## Known Stubs
None. No hardcoded empty values, placeholders, or unwired data introduced. verify-prod.sh queries live endpoints; the test-apis type change is a renderable-type tightening only.

## User Setup Required
None for this plan. (Reminder from 06-04: `ADMIN_API_TOKEN` is the owner-set secret that enables the owner-only test/training routes in production; unset = fail-closed 403, which is what makes FIX-01's verify-prod.sh check pass.)

## Next Phase Readiness
- **SHIP-02 closed:** strict build genuinely enforces tsc + lint and is green. The two ignore flags are gone.
- **06-08 deploy ready:** `scripts/verify-prod.sh` is the reusable post-deploy checklist — run `scripts/verify-prod.sh <preview-url>` after the Vercel deploy and grep its PASS/FAIL lines.
- **SHIP-01 automated half closed; browser-only half deferred to 06-08:** the LIVE both-theme VISUAL pass and the a11y KEYBOARD pass (Tab-through, focus rings, no traps) are browser-only and remain the owner's 06-08 human-action checkpoint against the preview URL. This plan proved the STRUCTURAL both-theme smoke (both palettes ship in the served CSS) and the automated FIX-01/FIX-02 gates.
- **Only 06-08 (deploy) remains in Phase 6.**

## Self-Check: PASSED

- FOUND: next.config.ts (0 ignoreBuildErrors/ignoreDuringBuilds flags)
- FOUND: scripts/verify-prod.sh
- FOUND: src/app/test-apis/page.tsx (openai?: Record<string, unknown>)
- FOUND: .planning/phases/06-hardening-ship/06-07-SUMMARY.md
- FOUND: commit e65e217 (Rule-1 pre-flip fix)
- FOUND: commit df0338d (strict flip)
- FOUND: commit 51d89ff (verify-prod.sh)

---
*Phase: 06-hardening-ship*
*Completed: 2026-06-12*
