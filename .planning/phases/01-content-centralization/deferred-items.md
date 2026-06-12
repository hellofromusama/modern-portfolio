# Deferred Items — Phase 01 Content Centralization

Out-of-scope discoveries logged during execution. NOT fixed here (scope boundary:
only auto-fix issues directly caused by the current task's changes).

## Pre-existing tsc errors (latent, `typescript.ignoreBuildErrors: true`)

Discovered during 01-02 execution when running `npx tsc --noEmit`. These exist in
files NOT touched by the content-centralization module and predate this plan. The
PROJECT.md / STACK.md explicitly note that `next.config.ts` ignores TS errors during
build, so these are latent. The new `src/content/*` module is type-clean.

- `src/app/api/ai-training/route.ts` (358, 368) — implicit any + fetch overload
- `src/app/api/auto-llm-training/route.ts` (39, 43, 51, 59, 67, 70, 75) — null/assignment
- `src/app/api/budget-estimate/route.ts` (37) — `userMessage` not defined
- `src/app/api/create-checkout/route.ts` (14) — Stripe apiVersion literal mismatch
- `src/app/expertise/page.tsx` (440–586) — union narrowing + implicit any params
- `src/app/projects/[id]/page.tsx` (346, 348) — `liveUrl` only on one union member

Note: `src/app/projects/[id]/page.tsx` is a Wave 2 consumer-repointing target. Once it
imports the centralized typed `Project` (which declares `liveUrl?`), its two `liveUrl`
errors resolve naturally. The expertise/api errors are unrelated to content and belong
to later cleanup, not this phase.
