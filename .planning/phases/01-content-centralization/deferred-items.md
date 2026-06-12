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

## Pre-existing ESLint errors (latent, `eslint.ignoreDuringBuilds: true`)

Surfaced during the 01-05 SHIP-01 gate (`npm run lint`): 96 problems (64 errors, 32
warnings). ALL reside in files NOT touched by this phase (the gate confirmed zero lint
findings in `src/content/*`, `src/app/page.tsx`, `src/app/layout.tsx`,
`src/app/projects/[id]/page.tsx`, `src/app/sitemap.ts`). Masked at build time by
`eslint.ignoreDuringBuilds: true`. Belong to a later lint-cleanup phase (strict build
re-enabled in Phase 6), NOT content centralization.

- `src/app/api/*` (ai-training, ai-verification, auto-llm-training, budget-estimate,
  create-checkout, schedule-training, test-free-llm, test-openai) — `no-explicit-any`,
  `no-unused-vars`
- `src/app/blog/page.tsx`, `budget/page.tsx`, `contact/page.tsx`, `expertise/page.tsx`,
  `fund-me/page.tsx`, `fund-me/success/page.tsx`, `ideas/page.tsx`,
  `llm-training-dashboard/page.tsx`, `team/page.tsx`, `test-apis/page.tsx` —
  `react/no-unescaped-entities`, `no-unused-vars`, `no-explicit-any`, `no-img-element`
- `src/components/*` (AISeoContent, Hero3DScene, IdeaNetworkCanvas, InteractiveGlobe,
  Navigation, TeamSection) — `react/no-unescaped-entities`, `prefer-const`,
  `no-unused-vars`, `no-img-element`
