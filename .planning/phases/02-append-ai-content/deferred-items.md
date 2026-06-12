# Deferred Items — Phase 02 (append-ai-content)

Pre-existing issues confirmed during the 02-04 SHIP-01 gate. These are NOT caused by Phase 2 work (this phase touched no api/* or expertise files) and are out of scope per the executor scope boundary. They are the SAME set deferred in Phase 1 (01-05). Strict build is re-enabled in Phase 6, where these are owned.

## Pre-existing tsc --noEmit errors (deferred — do NOT fix in Phase 2)

- `src/app/api/ai-training/route.ts` (358, 368) — TS7006 implicit any + TS2769 fetch overload (void body)
- `src/app/api/auto-llm-training/route.ts` (39,43,51,59,67,70,75) — TS18047 possibly-null + TS2322 assignability
- `src/app/api/budget-estimate/route.ts` (37) — TS2304 Cannot find name 'userMessage'
- `src/app/api/create-checkout/route.ts` (14) — TS2322 Stripe apiVersion literal mismatch ("2024-06-20" vs "2025-08-27.basil")
- `src/app/expertise/page.tsx` (440–586) — TS2339 union property access + TS7006 implicit any (multiple)

Phase-touched files (projects.ts, seo.ts, skills.ts, layout.tsx, ai-engineering/page.tsx, AiBridgeDiagram.tsx, Navigation.tsx) produced ZERO tsc errors.

`next.config.ts` sets `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true`, so these do not fail `npm run build`; the SHIP-01 gate runs tsc + lint explicitly to surface them.
