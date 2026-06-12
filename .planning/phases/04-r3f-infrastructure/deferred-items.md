# Deferred Items — Phase 04 R3F Infrastructure

Out-of-scope discoveries logged during execution (NOT fixed — outside the touching plan's scope).

## Pre-existing `tsc --noEmit` errors (discovered during 04-02)

These exist independently of Plan 04-02's files and are non-blocking by design
(`typescript.ignoreBuildErrors: true` in `next.config.ts`). Logged for awareness only.

- `src/app/api/ai-training/route.ts` — TS7006 (implicit any `example`), TS2769 (fetch body `void`)
- `src/app/api/auto-llm-training/route.ts` — TS18047 / TS2322 (results.* possibly null / assignment to `null`)
- `src/app/api/budget-estimate/route.ts` — TS2304 (`userMessage` not found)
- `src/app/api/create-checkout/route.ts` — TS2322 (Stripe apiVersion literal mismatch `2024-06-20` vs `2025-08-27.basil`)
- `src/app/expertise/page.tsx` — TS2339 / TS7006 (`technologies` not on union, implicit any `tech`)

None are in `src/lib/webgl.ts` or `src/components/three/*` (all five Plan 04-02 files type-check clean).
