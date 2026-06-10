# Testing Patterns

**Analysis Date:** 2026-06-10

## Test Framework

**None.** This repo has no automated tests of any kind:
- No test runner installed (`package.json` devDependencies contain only ESLint, TypeScript, Tailwind tooling — no jest/vitest/playwright/cypress)
- No `*.test.*` or `*.spec.*` files anywhere in `src/`
- No `jest.config.*`, `vitest.config.*`, or `playwright.config.*`
- No `__tests__/` directories, no fixtures, no mocks
- No CI test pipeline: `.github/` contains only `copilot-instructions.md` and `instructions/codacy.instructions.md` — there is no `.github/workflows/` directory

Do not invent test patterns when working here. If a phase requires adding tests, a framework must be chosen and installed first (Vitest + React Testing Library would fit the Next.js 15 / React 19 stack; this is a recommendation, not an existing convention).

## Manual verification page

`src/app/test-apis/page.tsx` is a client page used as an ad-hoc manual test harness for the API routes (e.g. `api/test-openai/route.ts`, `api/test-free-llm/route.ts`). This is the closest thing to "tests" in the repo — browser-driven, manual.

## Lint Setup

**Config:** `eslint.config.mjs` (ESLint 9 flat config)
- Extends `next/core-web-vitals` and `next/typescript` via `FlatCompat` from `@eslint/eslintrc`
- Ignores: `node_modules/**`, `.next/**`, `out/**`, `build/**`, `next-env.d.ts`
- No custom rules, no Prettier integration

**Run:**
```bash
npm run lint        # runs bare `eslint` (lints cwd under flat config)
npx eslint src/     # explicit, equivalent in practice
```

## Typecheck Setup

- `tsconfig.json`: `strict: true`, `noEmit: true`, `skipLibCheck: true`, bundler module resolution, `@/*` → `./src/*` alias
- **No `typecheck` npm script exists.** Run manually:
```bash
npx tsc --noEmit
```

## CRITICAL: Build does NOT verify correctness

`next.config.ts` disables both gates during builds:

```ts
eslint: {
  ignoreDuringBuilds: true,
},
typescript: {
  ignoreBuildErrors: true,
},
```

This means `npm run build` will SUCCEED even with type errors and lint violations. A green build is not evidence that the code is type-safe or lint-clean. Lint and typecheck must be run explicitly (see workflow below). Be aware that latent type errors may already exist in the codebase — if `npx tsc --noEmit` reports pre-existing errors in files you did not touch, scope your verification to your changed files rather than attempting a drive-by cleanup.

## NPM Scripts

```bash
npm run dev      # next dev — local dev server (default http://localhost:3000)
npm run build    # next build — production build (type/lint errors IGNORED, see above)
npm run start    # next start — serve production build
npm run lint     # eslint
```

## Safe Verification Workflow

With no tests, verification for any change is: typecheck + lint + build + manual smoke test.

```bash
# 1. Typecheck (not enforced anywhere else)
npx tsc --noEmit

# 2. Lint
npm run lint

# 3. Production build (catches build-time issues: bad imports, invalid
#    metadata exports, server/client boundary violations like exporting
#    `metadata` from a 'use client' page)
npm run build

# 4. Manual smoke test
npm run dev
```

**Manual smoke checklist (browser):**
- Home `/` renders: Hero3D lazy-loads, ScrollReveal animations fire, no hydration errors in console
- Theme toggle: switch dark ↔ light (sets `data-theme` on `<html>`, persists in `localStorage`), verify pages remain readable in BOTH themes — theming is via CSS variables, so untokenized colors break light mode silently
- Navigation: desktop links + mobile menu toggle
- Any page you touched, in both themes and at mobile width
- If API routes were touched: exercise via `/test-apis` page or `curl`; note `api/send-email/route.ts` and `api/create-checkout/route.ts` need env vars (`EMAIL_USER`/`EMAIL_PASS`, Stripe keys) — `.env` files exist locally per `.gitignore`; never commit them

**Hydration-sensitive areas (highest regression risk):**
- Components reading `localStorage`/`window` rely on the `mounted` guard pattern (`src/components/ThemeToggle.tsx`, `Navigation.tsx`) — removing those guards causes hydration mismatches
- `next/dynamic` with `ssr: false` wrappers in `src/app/page.tsx` — converting these to static imports will break SSR for canvas/3D components

**SEO-sensitive areas:** changes to `src/app/layout.tsx` JSON-LD blocks, `sitemap.ts`, `robots.ts`, or `next.config.ts` headers affect live search/AI indexing for usamajaved.com.au — verify JSON-LD still parses (paste into a JSON validator) after edits.

## Coverage

**Requirements:** None enforced. No coverage tooling installed.

## Test Types

**Unit Tests:** Not present
**Integration Tests:** Not present
**E2E Tests:** Not present (manual browser verification only)

---

*Testing analysis: 2026-06-10*
