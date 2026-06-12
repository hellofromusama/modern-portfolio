---
phase: 06-hardening-ship
plan: 08
status: checkpoint-pending
subsystem: infra
tags: [vercel, deploy, preview, verify-prod, ship-02, ship-01, deployment-protection, sso]

# Dependency graph
requires:
  - phase: 06-hardening-ship (06-07)
    provides: "next.config.ts strict build (tsc+lint hard gate) + scripts/verify-prod.sh (7-check PASS/FAIL post-deploy runner) proven 7/7 PASS over the local strict prod build"
  - phase: 06-hardening-ship (06-04)
    provides: "FIX-01 requireAdmin fail-closed gate on owner-only routes (403 when ADMIN_API_TOKEN unset)"
provides:
  - "Vercel PREVIEW deploy of modern-portfolio (NOT production) at modern-portfolio-rbvs1h408-hellofromusamas-projects.vercel.app, built from the strict-green tree"
  - "Correct project link verified: .vercel/project.json projectId prj_KuhGBqrfHqGkl4jk0NdRNjfYkYS0 (the project serving usamajaved.com.au + www), orgId team_eNMHs9JThdiZWBY23ivLSJIj"
  - "preview-checklist.log: verify-prod.sh run vs the live preview URL (SSO-walled, documented) AND vs the local strict prod build of the deployed tree = 7/7 PASS, 0 FAIL (authoritative gate evidence)"
  - "BLOCKING owner production-approval checkpoint reached (checkpoint:human-action, non-auto-approvable) — production NOT promoted"
affects: [06-08 (Task 3 prod promote on owner approval), vercel-deploy, milestone-ship]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Preview-first deploy (vercel deploy --yes, NO --prod) to avoid clobbering the usamajaved.com.au / www domain alias; production promote is a separate owner-gated step"
    - "When the Vercel preview URL is behind Deployment Protection (SSO), curl receives a 401 from Vercel's auth layer (not the app) — fall back to running verify-prod.sh against a LOCAL strict prod build of the exact deployed tree for authoritative all-PASS evidence"
    - "MANDATORY link verification: after vercel link, assert .vercel/project.json projectId == the known prod project before ANY deploy (wrong link = catastrophic clobber of the live domain)"

key-files:
  created:
    - .planning/phases/06-hardening-ship/preview-checklist.log
    - .planning/phases/06-hardening-ship/preview-deploy.log
  modified: []

key-decisions:
  - "Linked the cloned repo with the EXACT flags (vercel link --yes --project modern-portfolio --scope team_eNMHs9JThdiZWBY23ivLSJIj) and verified projectId prj_KuhGBqrfHqGkl4jk0NdRNjfYkYS0 in .vercel/project.json BEFORE deploying — guards against the catastrophic kashmir-fund-website mis-link"
  - "PREVIEW deploy only (vercel deploy --yes, NO --prod anywhere); production promote held for the owner human-action checkpoint per PROJECT.md (production deploy gated on owner approval)"
  - "Preview URL is behind Vercel SSO Deployment Protection -> curl gets 401 from the auth wall (not the app). No automation bypass secret is set in env, and toggling protection / disabling SSO is itself an owner dashboard action (not done unilaterally). Per the plan <important> directive, captured the SSO-401 evidence in the log, then ran verify-prod.sh against the LOCAL strict prod build of the exact deployed tree = 7/7 PASS, 0 FAIL as the authoritative checklist gate"
  - "ADMIN_API_TOKEN is NOT set in the Vercel project env (env ls row count 0) — this is the fail-closed-SAFE state: FIX-01 requireAdmin returns 403 'disabled' on owner-only routes until the owner sets it. Surfaced to the owner in the checkpoint; no code change"

patterns-established:
  - "Pattern: verify the .vercel link projectId against the known prod project id as a hard precondition before any vercel deploy"
  - "Pattern: SSO-walled preview -> local-strict-prod-build verify-prod.sh fallback for all-PASS evidence; the live SSO-401 run is logged separately and clearly labelled as the auth wall, not app failures"

requirements-completed: []  # SHIP-02 / SHIP-01 closure is gated on the owner checkpoint + (on approval) the production promote in Task 3 — NOT marked complete here

# Metrics
duration: 8min
completed: 2026-06-12
---

# Phase 6 Plan 08: Vercel PREVIEW Deploy + Checklist (checkpoint-pending) Summary

**Linked the cloned repo to the correct modern-portfolio Vercel project (projectId prj_KuhGBqrfHqGkl4jk0NdRNjfYkYS0, serves usamajaved.com.au), shipped a PREVIEW-only deploy (no --prod), and produced all-PASS verify-prod.sh evidence (7/7, 0 FAIL) — then STOPPED at the BLOCKING owner production-approval checkpoint. Production NOT promoted.**

## Performance

- **Duration:** ~8 min (deploy + verify; excludes pending owner checkpoint)
- **Started:** 2026-06-12T08:40:17Z
- **Completed (Task 1):** 2026-06-12T08:46:00Z
- **Tasks:** 1 of 3 complete (Task 2 = blocking owner checkpoint; Task 3 = post-approval prod promote)
- **Files modified:** 2 created (evidence logs); 0 source files (deploy + verify only)

## Accomplishments
- **Correct project link verified (catastrophic-if-wrong gate held):** `vercel link --yes --project modern-portfolio --scope team_eNMHs9JThdiZWBY23ivLSJIj` -> `.vercel/project.json` confirmed `projectId: prj_KuhGBqrfHqGkl4jk0NdRNjfYkYS0`, `orgId: team_eNMHs9JThdiZWBY23ivLSJIj`, `projectName: modern-portfolio` (NOT kashmir-fund-website). `.vercel` is gitignored (not committed).
- **PREVIEW deploy (no --prod):** `vercel deploy --yes` -> **https://modern-portfolio-rbvs1h408-hellofromusamas-projects.vercel.app** (status Ready, Environment **Preview**). The CLI itself confirmed the project ("To deploy to production (www.usamajaved.com.au), run `vercel --prod`"). `vercel ls` confirms the existing Production deployment (2 days old) is untouched.
- **Checklist evidence captured (preview-checklist.log):** verify-prod.sh was RUN twice and teed:
  1. vs the **live preview URL** — all public routes returned 401 from **Vercel SSO Deployment Protection** (`_vercel_sso_nonce` cookie, `X-Robots-Tag: noindex`), i.e. the auth wall, NOT the app. Documented in the log header.
  2. vs the **local strict prod build of the exact deployed tree** (`npm run build` -> build-exit:0, served on :3488) — **7/7 PASS, 0 FAIL, verify-exit:0**: `/` 200, sitemap.xml valid (24 routes), robots.txt tiers, llms.txt text/markdown, 7 JSON-LD blocks, `/api/test-openai` unauth -> 403 no keyUsed (FIX-01), IndexNow key file 200.
- **ADMIN_API_TOKEN state surfaced:** `vercel env ls` shows ADMIN_API_TOKEN is **not set** (only NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY exist). This is fail-closed-SAFE — FIX-01 returns 403 on owner-only routes until the owner adds it. Flagged to the owner in the checkpoint.
- **Production NOT promoted.** Stopped at the blocking `checkpoint:human-action` owner production-approval gate (also the SHIP-01 live both-theme visual + a11y keyboard closure).

## Task Commits

1. **Task 1: preview deploy + verify-prod checklist logs** - `70d970f` (chore)

**Task 2:** blocking owner checkpoint (no commit — awaiting owner approval).
**Task 3:** production promote (no commit — gated on Task 2 approval).
**Plan metadata (this SUMMARY + STATE/ROADMAP):** see docs commit.

## Files Created/Modified
- `.planning/phases/06-hardening-ship/preview-checklist.log` - verify-prod.sh runs: live preview URL (SSO-401, documented as the auth wall) + local strict prod build of the deployed tree (7/7 PASS, 0 FAIL).
- `.planning/phases/06-hardening-ship/preview-deploy.log` - full `vercel deploy --yes` output incl. the preview URL.
- `.vercel/project.json` - created by `vercel link` (gitignored, NOT committed) — projectId verified prj_KuhGBqrfHqGkl4jk0NdRNjfYkYS0.

## Decisions Made
- See `key-decisions` frontmatter: exact-flag link + projectId verification before deploy; preview-only (no --prod); SSO-walled preview -> local-strict-prod verify fallback; ADMIN_API_TOKEN unset = fail-closed-safe, surfaced to owner.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Preview URL behind Vercel SSO Deployment Protection — verify-prod.sh cannot reach the app via curl**
- **Found during:** Task 1 (running verify-prod.sh against the live preview URL)
- **Issue:** Every public route on the preview deploy returned `401` from Vercel's SSO auth layer (`Set-Cookie: _vercel_sso_nonce`, `X-Robots-Tag: noindex`) — not the application. verify-prod.sh therefore reported 6 FAILs that are SSO-wall artifacts, not app failures. No `VERCEL_AUTOMATION_BYPASS_SECRET` is present in env, and disabling SSO protection is an owner dashboard action (not done unilaterally).
- **Fix:** Per the plan `<important>` directive's documented fallback: (a) logged the SSO-401 run with a clear header explaining it is the auth wall; (b) ran `npm run build` (strict, build-exit:0) and served the exact deployed tree locally, then ran `verify-prod.sh http://localhost:3488` = **7/7 PASS, 0 FAIL, exit 0** as the authoritative checklist evidence. Note FIX-01 shows the real `403` here (vs the preview's incidental `401` from the SSO wall).
- **Files modified:** .planning/phases/06-hardening-ship/preview-checklist.log (evidence only)
- **Verification:** Local-prod section of the log: `=== 0 failure(s) ===`, verify-exit:0, 7 PASS lines.
- **Committed in:** 70d970f (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 Rule 3 - Blocking).
**Impact on plan:** No scope creep, no code change, no architectural change. The fallback is exactly the path the plan's `<important>` directive prescribed for preview SSO protection. The deploy itself landed exactly as written (preview-only, correct project, production untouched).

## Issues Encountered
- **Vercel auth token not readable from a JSON file on Windows** (the CLI stores it outside the candidate `auth.json` paths), so the Vercel REST API protection-settings probe could not be run with a bearer token. Not needed — the `curl` 401 + `_vercel_sso_nonce` cookie + `X-Robots-Tag: noindex` headers already prove SSO protection is on, and `vercel whoami` confirms the CLI is authenticated as hellofromusama.

## Known Stubs
None. No source files touched; only evidence logs created. The verify-prod.sh checks query live endpoints.

## User Setup Required
- **ADMIN_API_TOKEN should be set in Vercel project `modern-portfolio` (Settings -> Environment Variables)** before/with production deploy so the owner can call the FIX-01-gated owner-only test/training routes. Until set, those routes fail-closed with 403 ("disabled") — which is SAFE (no leak) and is what makes the FIX-01 verify-prod.sh check pass. Owner-only secret; never shipped to any client.
- **(Optional) To let CI/curl verify a future preview URL directly:** the owner can disable Deployment Protection for Preview, or generate a Protection Bypass for Automation secret and expose it as `VERCEL_AUTOMATION_BYPASS_SECRET` (Vercel dashboard -> Settings -> Deployment Protection). Not required for production verification (the live domain is public).

## Next Phase Readiness
- **Task 2 (owner checkpoint) is BLOCKING and pending.** The owner must do the live both-theme visual + a11y keyboard pass on the preview URL and explicitly approve before any `vercel --prod` (SHIP-01 + SHIP-02 closure). Preview URL: https://modern-portfolio-rbvs1h408-hellofromusamas-projects.vercel.app — NOTE it is SSO-protected, so the owner must be logged into Vercel (hellofromusama) in the browser to view it.
- **Task 3 (production promote) is gated on Task 2 approval.** On approval: `vercel --prod`, then `bash scripts/verify-prod.sh https://www.usamajaved.com.au` to confirm prod + domain alias intact.
- **No route/slug/SEO asset removed** (additive mandate held — deploy + verify only).

## Self-Check: PASSED

- FOUND: .planning/phases/06-hardening-ship/preview-checklist.log (8 PASS lines; local-prod section 7/7 PASS 0 FAIL)
- FOUND: .planning/phases/06-hardening-ship/preview-deploy.log (preview URL captured)
- FOUND: .vercel/project.json projectId prj_KuhGBqrfHqGkl4jk0NdRNjfYkYS0 (gitignored, not committed)
- FOUND: commit 70d970f (Task 1 evidence logs)
- VERIFIED: preview deploy Environment=Preview (vercel ls); Production deployment untouched (2d old)
- VERIFIED: NO --prod flag run; production NOT promoted

---
*Phase: 06-hardening-ship*
*Completed (Task 1): 2026-06-12 — checkpoint-pending on owner production approval*
