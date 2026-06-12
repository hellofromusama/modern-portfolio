# Phase 6: Enhancements, Hardening & Ship - Research

**Researched:** 2026-06-12
**Domain:** Strict-build debt burndown (tsc + ESLint), security gating of paid AI routes, View Transitions progressive enhancement, a11y hardening, Vercel production deploy
**Confidence:** HIGH (tsc/lint inventories run directly against the repo; View Transitions + deploy verified against official Next.js/Vercel docs; FIX-01/FIX-02 designs verified against actual route source)

## Summary

The dominant work item in this phase is the **strict-build burndown, not the features**. Running the real gates against the current tree (node_modules present, Next 15.5.12) yields **29 `tsc --noEmit` errors across 5 files** and **96 ESLint problems (64 errors, 32 warnings) across 24 files** — of which **only 4 are auto-fixable** with `eslint --fix` (all `prefer-const`). The other ~92 lint findings and all 29 type errors are manual. Re-enabling `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` (SHIP-02) is gated on clearing *all* of these, and phases 3–5 will add new TS/JSX surface that must also be clean — so the count at this phase's start will be **≥** today's baseline. Treat this as the largest task block and sequence it first.

The security/bug items are small, well-scoped code edits. FIX-01 (gate `test-openai` + audit the other test/training routes, remove the `keyUsed` key-prefix leak) and FIX-02 (stop `VisitorTracker` from firing paid AI endpoints from every visitor browser) are both achievable with **zero new dependencies** using an env-flag + shared-secret-header pattern server-side and an env-flag + `sessionStorage` guard client-side. For VIS-08 (View Transitions), the robust progressive-enhancement path on a live site is **native cross-document CSS `@view-transition`** (zero JS, no experimental flags, auto-degrades) rather than React's `<ViewTransition>` component, which is **still canary/experimental as of mid-2026**. A11y is a grep/axe-driven checklist over what phases 3–5 build. Deploy is a `vercel` preview → owner review → `vercel --prod` flow with the domain alias staying intact.

**Primary recommendation:** Sequence as (1) strict-build burndown — biggest block, do first and re-run the gates continuously; (2) FIX-01 + FIX-02 zero-dep gating; (3) VIS-08 via native CSS `@view-transition` + reduced-motion kill switch; (4) a11y checklist pass; (5) `vercel` preview → owner-approved `vercel --prod`. Re-enable the two `ignore*` flags only as the final SHIP-02 step, after the gates are green.

## User Constraints

> No `CONTEXT.md` exists for this phase yet (`.planning/phases/06-hardening-ship/` was created by this research run; no `*-CONTEXT.md` present). Constraints below are drawn from `CLAUDE.md` (PROJECT.md/STACK.md blocks) and the phase brief, and carry the same authority as locked decisions.

### Locked Decisions (from PROJECT.md / brief)
- **REMOVE NOTHING.** Owner directive: all flagged/experimental routes (`test-openai`, `test-free-llm`, `ai-training`, `auto-llm-training`, `schedule-training`, `llm-training-dashboard`, `test-apis`) are **guarded with auth, never deleted**. Functionality preserved for the owner.
- **No framework changes.** Next.js 15 App Router + Tailwind v4 CSS-first + TypeScript. No migration off any of these.
- **React 19.2.4** — any added dep must support React 19 (R3F v9, motion v12). VIS-08 must not require an incompatible React.
- **Verification is tsc + lint + build + manual smoke in BOTH themes per phase.** "Build alone passes with errors" is explicitly called out as insufficient — this phase ends that verification theater by re-enabling strict build.
- **Deploy:** Vercel project `modern-portfolio` (serves usamajaved.com.au). **Production deploy gated on owner approval.**
- **Privacy:** No Horizon Digital / interview-prep content anywhere public.
- **Animations** must pause off-screen and respect `prefers-reduced-motion`; mobile is first-class.

### Claude's Discretion
- Exact VIS-08 implementation (native CSS `@view-transition` recommended below over the experimental React component or `next-view-transitions` lib).
- Order of file-by-file tsc/lint cleanup, and whether to use targeted `eslint-disable` for genuinely-intentional patterns vs. real fixes (prefer real fixes; reserve disables for false positives only).
- A11y fix specifics within the WCAG AA / keyboard-nav floor.

### Deferred Ideas (OUT OF SCOPE)
- Rate limiting via Upstash/Redis or Vercel WAF (CONCERNS.md recommends it, but FIX-02 is solvable zero-dep; full rate-limit infra is a larger separate effort).
- Stripe webhook handler, error/not-found boundaries, EmailJS env migration, image `remotePatterns` fix — all flagged in CONCERNS.md but not in this phase's requirement IDs. Note them; don't expand scope.
- Centralized `src/config/site.ts` for hardcoded URLs (CONCERNS.md) — not a phase-6 requirement.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **SHIP-02** | Re-enable strict build (remove `ignoreBuildErrors` + `ignoreDuringBuilds`); clear ALL pre-existing tsc + lint debt | Exact inventory below: **29 tsc errors / 5 files**, **96 lint problems / 24 files (4 auto-fixable)**. This is the biggest block. |
| **FIX-01** | Gate `test-openai` (+ audit sibling test/training routes) behind env flag + auth header; remove key-prefix leak; preserve owner functionality | Zero-dep gate pattern below; exact leak is `keyUsed: process.env.OPENAI_API_KEY.substring(0,10)+'...'` at `test-openai/route.ts:38` (also a `substring(0,7)` console.log leak at `auto-llm-training/route.ts:37`). |
| **FIX-02** | Rate-limit / gate `VisitorTracker` so visitor browsers stop firing paid AI endpoints | `VisitorTracker.tsx:79,92` fires `/api/schedule-training` + `/api/auto-llm-training`. Env-flag + `sessionStorage` once-per-session design below; serverless in-memory limiter caveat noted. |
| **VIS-08** | View Transitions as progressive enhancement, reduced-motion safe | Native CSS `@view-transition` recommended (degrades cleanly, no experimental flag); React `<ViewTransition>` is canary-only as of mid-2026. Reduced-motion CSS kill switch from official Next.js guide. |
| **SHIP-01** | Owner-approved production deploy + post-deploy verification | Vercel CLI `vercel` (preview) → owner review → `vercel --prod`; domain alias persists; post-deploy curl checklist below. |

## Project Constraints (from CLAUDE.md)

- GSD workflow enforced: file edits must go through a GSD command (`/gsd:execute-phase` etc.) — relevant to *how* the plan executes, not what it contains.
- `"use client"` first line for client components; quote style matches the file being edited (mixed single/double across the repo).
- Theming flows through CSS custom properties (`--bg-*`, `--text-*`, `--accent-*`), **not** Tailwind `dark:`. Any new VIS-08 or a11y CSS must be theme-token-aware and work in both `:root` (dark) and `[data-theme="light"]`.
- `prefers-reduced-motion` is a hard accessibility rule — every animation (incl. View Transitions) must honor it. A global kill switch already exists in `globals.css:134`.
- No Prettier; 2-space indent, semicolons, trailing commas in multiline. No JSDoc unless asked.
- `mounted`-guard pattern (`if (!mounted) return null`) for anything touching `localStorage`/`window` (relevant to FIX-02 client edit).

## Standard Stack

This phase adds **no runtime dependencies**. All five requirements are solvable with the existing toolchain. Verified installed versions:

### Core (already installed — verified via node_modules)
| Tool | Version (verified) | Purpose | Why Standard |
|------|--------------------|---------|--------------|
| TypeScript | 5.x (`tsc` present; `npx tsc --noEmit` runs) | SHIP-02 type gate | Already the project's type checker; strict mode on in `tsconfig` |
| ESLint | 9.x flat config | SHIP-02 lint gate | `npm run lint` = `eslint` (already migrated off `next lint`) |
| Next.js | 15.5.12 (verified `npx next --version`) | Build, App Router, native VT works without flags | Locked framework |
| Vercel CLI | 48.1.6 (verified `vercel --version`) | SHIP-01 deploy | Project hosts on Vercel `modern-portfolio` |

### Supporting (consider; not required)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next-view-transitions` (shuding) | latest | Wraps the experimental React VT for App Router | ONLY if a JS-driven shared-element morph between routes is required. For VIS-08 progressive enhancement, native CSS is preferred — do not add unless a morph genuinely needs it. |
| `@axe-core/cli` or `axe DevTools` | latest | Automated a11y audit | Optional dev-time a11y check; the brief asks for grep/build-automatable points, achievable without adding a dep. |

### Alternatives Considered (VIS-08)
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| **Native CSS `@view-transition` (RECOMMENDED)** | React `<ViewTransition>` component | React component is **experimental/canary-only as of mid-2026** (react@canary, not stable). It needs `experimental.viewTransition: true` in `next.config.ts` and ties navigation animation to React's transition cycle. More power (shared-element morphs, Suspense reveals) but more risk on a live site. Use only if a morph is specifically wanted. |
| Native CSS `@view-transition` | `next-view-transitions` lib | Extra dependency wrapping the same experimental surface; "aimed at basic use cases," explicitly limited around Suspense/streaming. Native CSS has zero deps and degrades to no-op where unsupported (Chrome/Edge 126+, Safari support landing; Firefox still behind/in progress). |

**No install step.** If (and only if) a route-morph is required and discretion lands on the React path:
```bash
# OPTIONAL — only if the experimental React ViewTransition path is chosen
# (sets experimental.viewTransition: true in next.config.ts; no package install needed —
#  App Router already uses React canary that ships <ViewTransition>)
```

**Version verification performed:** `npx next --version` → 15.5.12 (matches lockfile). `vercel --version` → 48.1.6. `node` → v22.22.2, `npm` → 10.9.7. Stripe installed 18.5.0 (its types expect apiVersion `'2025-08-27.basil'` — see FIX/strict-build note).

## Architecture Patterns

### Strict-Build Burndown (SHIP-02) — the main event

**Measured baseline (run directly against the repo on 2026-06-12, node_modules present):**

**`npx tsc --noEmit` → 29 errors across 5 files:**
| File | Errors | Error codes | Fix difficulty |
|------|--------|-------------|----------------|
| `src/app/expertise/page.tsx` | 18 | TS2339 (union has no `technologies`/`sectors`), TS7006 (implicit any params) | MEDIUM — needs a discriminated union or typed shape for the expertise data so `.technologies`/`.sectors` narrow correctly; then param types follow. Largest single file. |
| `src/app/api/auto-llm-training/route.ts` | 7 | TS18047 (`results.openai` etc. possibly null), TS2322 (assigning object to `null`-typed field) | LOW-MED — the `results` object literal infers each provider field as `null`; give it an explicit interface/type so assignments + `.success` access type-check. |
| `src/app/api/ai-training/route.ts` | 2 | TS7006 (implicit any `example`), TS2769 (fetch body is `void`) | LOW-MED — type the map param; the `void`-body is a real bug (a function returning void is passed as `body`). |
| `src/app/api/create-checkout/route.ts` | 1 | TS2322 — `apiVersion: '2024-06-20'` not assignable to `'2025-08-27.basil'` | LOW but **behavioral** — Stripe v18 type-pins the API version literal. Bump the string to `'2025-08-27.basil'` (matches installed SDK) and smoke-test checkout in Stripe test mode (CONCERNS.md flags this as fragile). |
| `src/app/api/budget-estimate/route.ts` | 1 | TS2304 — `userMessage` not defined | LOW — a genuine undefined-variable bug (line 37); fix the reference. |

**`npm run lint` (= `eslint`) → 96 problems (64 errors, 32 warnings) across 24 files; only 4 auto-fixable:**
| Rule | Count | Auto-fixable? | Approach |
|------|-------|---------------|----------|
| `react/no-unescaped-entities` | 34 | No | Escape `'`/`"`/`>` in JSX copy (`&apos;`, `&quot;`, etc.). Mechanical but spread across many pages. |
| `@typescript-eslint/no-unused-vars` | 30 | No | Remove unused vars/imports; for intentionally-unused catch bindings use `catch {}` (ES2019) or prefix `_error`. Many are `catch (error)` that never use `error` — overlaps with logging cleanup. |
| `@typescript-eslint/no-explicit-any` | 26 | No | Replace `any` with real types (often the same shapes needed for the tsc fixes — do these together). |
| `prefer-const` | 4 | **Yes** (`eslint --fix`) | The only auto-fixable group: `Hero3DScene.tsx:185-187` (`x`,`z`,`y`), `InteractiveGlobe.tsx:265` (`startTime`). |
| `@next/next/no-img-element` | 2 | No | `TeamSection.tsx:165`, one other — swap `<img>` for `next/image` (or justify with targeted disable). |

Heaviest lint files: `api/ai-training/route.ts` (15), `llm-training-dashboard/page.tsx` (13), `budget/page.tsx` (12), `api/auto-llm-training/route.ts` (12), `ideas/page.tsx` (7).

**Recommended structure for the burndown:**
1. `eslint --fix` first (clears the 4 `prefer-const`, costs nothing).
2. Group by file, and **fix tsc + lint together per file** — the `no-explicit-any` lint and the TS7006/TS2339 type errors are the *same* underlying "this data has no type" problem in `expertise/page.tsx` and the training routes.
3. Re-run **both** gates after each file (`npx tsc --noEmit && npm run lint`) — the gate is the regression net (no test framework exists).
4. **Only after both gates are clean**, flip the two flags in `next.config.ts` (`typescript.ignoreBuildErrors` → remove/`false`, `eslint.ignoreDuringBuilds` → remove/`false`) and run `npm run build` to confirm a strict build passes. This is the SHIP-02 completion gate.

> **Phases 3–5 assumption:** those phases run first and will add new components/pages (WebGL hero, AI case studies, centralized content). New `.tsx`/`.ts` surface = new tsc/lint surface. The baseline above is the *floor*; plan capacity for additional findings introduced by 3–5. If phases 3–5 keep their own files gate-clean (phase 01's `deferred-items.md` shows the centralized `src/content/*` module was kept clean), the increment stays small.

### FIX-01 — Gate the test/training routes (zero new deps)

**Exact issues confirmed in source:**
- `test-openai/route.ts` is a public GET that calls OpenAI on every hit and returns `keyUsed: process.env.OPENAI_API_KEY.substring(0, 10) + '...'` (**line 38** — the key-prefix leak) plus raw OpenAI error bodies (line 41–47).
- Secondary leak: `auto-llm-training/route.ts:37` `console.log('🔑 API Key format:', ...substring(0, 7) + '...')` — stripped in prod by `compiler.removeConsole`, but remove it anyway.
- `test-free-llm/route.ts`, `ai-training/route.ts` are unguarded; `auto-llm-training` + `schedule-training` are gated only by `AI_TRAINING_ENABLED`/`AUTO_SUBMIT_DAILY` env flags (no auth — anyone can POST when enabled).

**Recommended pattern (one tiny shared guard, no dependency):**
```ts
// src/lib/admin-guard.ts  (new ~12-line file; matches the project's inline-config style)
import { NextRequest, NextResponse } from 'next/server';

// Returns a 401/403 response if the request is not an authorized admin/owner call,
// otherwise null (proceed). Preserves functionality for the owner via a shared secret.
export function requireAdmin(request: NextRequest): NextResponse | null {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected) {
    // No token configured → route is effectively disabled in prod (fail closed).
    return NextResponse.json({ status: 'disabled' }, { status: 403 });
  }
  const provided = request.headers.get('x-admin-token');
  if (provided !== expected) {
    return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
  }
  return null;
}
```
Apply at the top of each test/training handler:
```ts
export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  // ...existing logic, minus the keyUsed field...
}
```
- **Remove** the `keyUsed` field from `test-openai` entirely; return a boolean `ok` instead of any key bytes.
- Owner keeps functionality by calling with `x-admin-token: <ADMIN_API_TOKEN>` (set in Vercel env). The `/test-apis` and `/llm-training-dashboard` UIs can read the token from a `NEXT_PUBLIC_*` value only if the owner accepts client exposure — **preferred**: keep these dashboards owner-local / behind the header and don't ship the token to the client. Discretion call; default to fail-closed.
- New env var: `ADMIN_API_TOKEN` (document it; add to Vercel project settings).

### FIX-02 — Stop visitor browsers firing paid endpoints (zero new deps)

**Exact trigger:** `VisitorTracker.tsx` fires `fetch('/api/schedule-training')` (line 79, every 3rd visit) and `fetch('/api/auto-llm-training')` (line 92, on first daily visit, after a 5s delay). Both are paid AI fan-outs driven by *visitor* browsers — cost scales with traffic.

**Minimal-change design (preferred): remove the client fan-out entirely.** The cleanest fix is to **delete the two `fetch` blocks** from `VisitorTracker` (the component's visible counter/toast behavior is unaffected — those fetches are fire-and-forget background calls). Training then only runs when the owner triggers it (FIX-01 admin call) or via a future Vercel Cron. This is the lowest-risk, zero-dependency option and matches CONCERNS.md's recommendation ("move visitor-triggered training calls server-side / cron instead of client fan-out").

**If the owner wants to keep client-triggered training** (less ideal), gate it defensively:
```ts
// inside trackVisitor(), replacing the two fetch blocks:
const TRAINING_FROM_CLIENT =
  process.env.NEXT_PUBLIC_CLIENT_TRAINING === 'true'; // default OFF
const ONCE_KEY = 'usamajaved_training_fired';
if (
  TRAINING_FROM_CLIENT &&
  !sessionStorage.getItem(ONCE_KEY)          // once per browser session
) {
  sessionStorage.setItem(ONCE_KEY, '1');
  fetch('/api/schedule-training', { method: 'POST', /* ... */ }).catch(() => {});
}
```
- **Default OFF** via `NEXT_PUBLIC_CLIENT_TRAINING` (absent → no calls). Owner opts in explicitly.
- `sessionStorage` `once-per-session` guard collapses refresh-spam to one call per tab session (the current code uses no such guard and can fire per visit/day).
- Also wrap the existing `JSON.parse(existingData)` at `VisitorTracker.tsx:29` in try/catch (CONCERNS.md fragile-area bug — corrupt localStorage currently kills the effect silently).

**Server-side rate-limit caveat (important for the plan):** A naive in-memory limiter (`Map<ip, timestamp>`) **does not work reliably on Vercel serverless** — each invocation may run in a fresh, ephemeral instance, so the Map resets and concurrent instances don't share state. Real per-IP rate limiting needs shared state (Upstash Redis / Vercel KV / Vercel WAF) — which is **deferred** (out of scope, see Deferred Ideas). The defensible zero-dep posture for this phase is: **env-flag default-off + shared-secret header (FIX-01) + remove/guard the client fan-out (FIX-02)**, which removes the abuse surface without needing a distributed limiter.

### VIS-08 — View Transitions, native CSS, reduced-motion safe

**Recommended: native cross-document CSS `@view-transition`.** Add to `globals.css`:
```css
/* Opt into cross-document (MPA) view transitions — progressive enhancement.
   Unsupported browsers (Firefox today) simply navigate normally, no animation. */
@view-transition {
  navigation: auto;
}

/* Example default crossfade is automatic; customize per-element with view-transition-name.
   MUST respect reduced motion — kill all VT animation when requested: */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
}
```
- **Why this over the React component:** native CSS is zero-JS, zero-dependency, needs no `experimental.viewTransition` flag, and degrades to a normal instant navigation where unsupported — the textbook progressive-enhancement profile for a live site. The React `<ViewTransition>` component is **still experimental (react@canary) as of mid-2026** and would couple animation to React's transition cycle and an experimental Next config flag.
- **Reduced-motion** is handled by the single media-query block above (pattern lifted from the official Next.js View Transitions guide). This satisfies the project's hard `prefers-reduced-motion` rule.
- **Theme-awareness:** any `view-transition-name`d element and custom keyframes must read CSS tokens so both `:root` and `[data-theme="light"]` look correct.
- **Scope note:** cross-document VT applies to full-page App Router navigations. Keep transitions subtle (crossfade / short slide) — FEATURES.md flags scroll-jacking and maximal motion as anti-features; VIS-08 should be restraint-first.

### Anti-Patterns to Avoid
- **Adding `eslint-disable` to hit zero instead of fixing.** Reserve disables for genuine false positives; the gate's value is real type/lint safety, not a green number.
- **Flipping the `ignore*` flags before the gates are clean.** That just moves the failure into `next build` and re-creates verification theater.
- **Deleting the experimental routes to "fix" the security finding.** Owner mandate is guard-not-delete.
- **In-memory per-IP rate limiter on serverless.** Resets per invocation; gives false confidence.
- **Choosing the experimental React `<ViewTransition>` for a live-site progressive enhancement** when native CSS does the job with no experimental surface.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Distributed per-IP rate limiting | A `Map<ip,ts>` in module scope | (Deferred) Upstash Redis / Vercel KV / Vercel WAF | Serverless instances are ephemeral and not shared — in-memory limiters silently don't limit. |
| Cross-route page transition engine | Manual `document.startViewTransition` + mount/unmount tracking | Native CSS `@view-transition` | Browser does the snapshot/animate/degrade for free; manual coordination is exactly what the API replaces. |
| Admin auth | A bespoke session system | Shared-secret `x-admin-token` header check | Single owner, internal routes — a shared secret is proportionate; full auth is over-engineering here. |
| Escaping JSX entities | Find/replace heuristics | Let `react/no-unescaped-entities` point to each one | The rule enumerates exact locations; fix at source. |

**Key insight:** every requirement in this phase is deliberately a *small, dependency-free* change — except the strict-build burndown, which is large but mechanical. Don't let the small items grow into infra projects (rate-limit stacks, auth systems); the abuse surface is closed by gating + removing the client fan-out.

## Common Pitfalls

### Pitfall 1: Underestimating the burndown because "build passes"
**What goes wrong:** `next build` is green today (flags ignore errors), so the work looks small. It isn't — 29 type errors + 92 manual lint fixes are hidden behind the flags.
**Why it happens:** `ignoreBuildErrors`/`ignoreDuringBuilds` mask everything.
**How to avoid:** Run `npx tsc --noEmit` and `npm run lint` (NOT `next build`) as the real gate, continuously, file-by-file.
**Warning signs:** Treating SHIP-02 as a config one-liner. It's the bulk of the phase.

### Pitfall 2: Stripe apiVersion bump breaks checkout
**What goes wrong:** Fixing `create-checkout/route.ts:14` to `'2025-08-27.basil'` (required for the tsc error) silently changes Stripe API behavior.
**Why it happens:** The literal is a real API-version pin, not just a type annoyance.
**How to avoid:** After the change, run a Stripe **test-mode** checkout end-to-end before deploy. CONCERNS.md flags this file as fragile.
**Warning signs:** Donations failing on the fund-me success redirect.

### Pitfall 3: Phases 3–5 add fresh tsc/lint debt
**What goes wrong:** The burndown is planned against today's 29/96 baseline, but 3–5 land first and add files.
**How to avoid:** Re-run both gates at this phase's *start* to get the true count; budget extra. Ideally have 3–5 keep their own files gate-clean (01's `src/content/*` precedent).
**Warning signs:** Count higher than 29/96 when phase 6 opens.

### Pitfall 4: View Transitions animate under reduced-motion
**What goes wrong:** `@view-transition { navigation: auto; }` without the reduced-motion override animates for motion-sensitive users — a WCAG/PROJECT.md violation.
**How to avoid:** Ship the `@media (prefers-reduced-motion: reduce)` kill block in the *same* change as enabling VT.

### Pitfall 5: Production deploy clobbers the domain alias
**What goes wrong:** A misconfigured `vercel --prod` from an unlinked dir or wrong project detaches `usamajaved.com.au`/`www`.
**How to avoid:** Confirm `vercel link` points at project `modern-portfolio`; deploy a **preview** first (`vercel` with no `--prod`); verify the preview; then `vercel --prod`. Domains attached at the project level persist across prod deploys — verify post-deploy with curl (below).

## Code Examples

### Run the real gates (SHIP-02)
```bash
# Source: project package.json (lint = eslint) + tsconfig (strict)
npx eslint --fix          # clears the 4 prefer-const auto-fixables
npx tsc --noEmit          # 29 errors today, 5 files
npm run lint              # 96 problems today, 24 files
# After both are clean and flags removed from next.config.ts:
npm run build             # strict build must pass — SHIP-02 done
```

### FIX-01 admin guard usage (owner preserves functionality)
```bash
# Owner-only call after gating (token set in Vercel env as ADMIN_API_TOKEN):
curl -H "x-admin-token: $ADMIN_API_TOKEN" https://www.usamajaved.com.au/api/test-openai
```

### VIS-08 native CSS (globals.css) — see Architecture Patterns block above.
Source: https://nextjs.org/docs/app/guides/view-transitions (reduced-motion CSS), MDN View Transition API.

### SHIP-01 deploy + verify
```bash
# Source: https://vercel.com/docs/cli/deploy
vercel link                      # ensure linked to project "modern-portfolio" (once)
vercel                           # PREVIEW deploy → share URL for owner review
# ...owner approves...
vercel --prod                    # PRODUCTION deploy to usamajaved.com.au + www
```

## State of the Art

| Old Approach | Current Approach (mid-2026) | When Changed | Impact |
|--------------|------------------------------|--------------|--------|
| `next lint` | `eslint` directly (`npm run lint`) | Deprecated 15.5, removed in 16 | **Already migrated** — project's `package.json` uses `"lint": "eslint"`. No action needed; just be aware `next build` no longer lints in 16. |
| JS page-transition libs (barba, manual `startViewTransition`) | Native CSS `@view-transition` (cross-document) + React `<ViewTransition>` for SPA morphs | Interop 2025 / browser support Chrome 126+, Safari | Native CSS is the robust progressive-enhancement choice; React component still canary. |
| `images.domains` | `images.remotePatterns` | Deprecated in Next 15 | CONCERNS.md flags `domains: ['usamajaved.com']` (also wrong host) — **out of scope** for phase 6 but will surface as a build warning. |
| Stripe apiVersion `'2024-06-20'` | `'2025-08-27.basil'` (matches `stripe@18.5.0`) | Stripe SDK v18 | Required for the strict-build tsc fix; re-test checkout. |

**Deprecated/outdated:**
- `next lint` (gone in 16) — project already off it.
- `experimental.scrollRestoration` and other config in `next.config.ts` are fine for 15.5; don't touch unrelated config during the burndown.

## Open Questions

1. **What additional tsc/lint surface will phases 3–5 add?**
   - What we know: today's floor is 29 tsc / 96 lint. Phase 01 kept its `src/content/*` clean.
   - What's unclear: the WebGL hero (R3F v9) + new case-study pages from 3–5 could add typed-prop and `any` surface.
   - Recommendation: re-measure both gates at phase-6 start; size the burndown against *that* number, not 29/96.

2. **Does the owner want client-triggered training kept (gated) or removed entirely?**
   - Recommendation: default to **removing** the two `VisitorTracker` fetch blocks (cleanest, matches CONCERNS.md); keep the gated `sessionStorage` variant only if the owner explicitly wants client triggering.

3. **Should the admin token be exposed to the `/test-apis` + `/llm-training-dashboard` UIs?**
   - Recommendation: fail closed — keep dashboards owner-local or require the header manually; don't ship `ADMIN_API_TOKEN` to the client unless the owner accepts it.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All build/gate steps | ✓ | v22.22.2 | — |
| npm | Scripts, install | ✓ | 10.9.7 | — |
| TypeScript (`tsc`) | SHIP-02 type gate | ✓ | 5.x (node_modules) | — |
| ESLint | SHIP-02 lint gate | ✓ | 9.x (node_modules) | — |
| Next.js | Build / native VT | ✓ | 15.5.12 | — |
| Vercel CLI | SHIP-01 deploy | ✓ | 48.1.6 | Vercel dashboard / git push deploy |
| node_modules | Running gates locally | ✓ | installed | `npm ci` if a clean tree is needed |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None blocking. (Vercel deploy could fall back to git-push if CLI auth is an issue, but CLI is present and is the planned path.)

## Validation Architecture

> `.planning/config.json` does not exist (no `workflow.nyquist_validation` key); treated as enabled per the default rule. **Caveat: there is no test framework in the repo** — the "Quick run" / "Full suite" commands below are the gate commands (tsc/lint/build), not a unit-test runner. Adding a test framework is **not** a phase-6 requirement; Wave 0 below proposes the *minimum* viable validation given that reality.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | **None present.** Validation = `tsc --noEmit` + `eslint` + `next build` + manual smoke (both themes) |
| Config file | `tsconfig.json` (strict), `eslint.config.mjs` (flat) — no test config |
| Quick run command | `npx tsc --noEmit && npm run lint` |
| Full suite command | `npx tsc --noEmit && npm run lint && npm run build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SHIP-02 | Zero tsc errors | type-gate | `npx tsc --noEmit` (expect exit 0) | ✅ tooling |
| SHIP-02 | Zero lint problems | lint-gate | `npm run lint` (expect 0 problems) | ✅ tooling |
| SHIP-02 | Strict build passes with flags removed | build-gate | `npm run build` | ✅ tooling |
| FIX-01 | Gated route rejects unauth request | smoke | `curl -s -o /dev/null -w "%{http_code}" .../api/test-openai` → 401/403 | ❌ Wave 0 (manual curl) |
| FIX-01 | Gated route works with token | smoke | `curl -H "x-admin-token: $TOK" .../api/test-openai` → 200 | ❌ Wave 0 (manual curl) |
| FIX-01 | No key bytes in any response | grep | response JSON contains no `keyUsed`/key substring | ❌ Wave 0 (manual/grep) |
| FIX-02 | Visitor load triggers no paid fetch | manual | DevTools Network on page load → no `/api/auto-llm-training` or `/api/schedule-training` | ❌ manual-only (browser) |
| VIS-08 | Reduced-motion disables VT | manual | OS reduce-motion on → instant navigation, no animation | ❌ manual-only (browser) |
| SHIP-01 | Prod routes 200 + correct content | smoke | curl checklist below | ❌ Wave 0 (post-deploy script) |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit && npm run lint` (the quick gate — this is the regression net since no unit tests exist).
- **Per wave merge:** add `npm run build`.
- **Phase gate:** full suite green + manual smoke in BOTH themes + post-deploy curl checklist before sign-off.

### Wave 0 Gaps
- [ ] A `scripts/verify-prod.sh` (or inline checklist) curling prod routes post-deploy: `/`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/fund-me`, plus a JSON-LD presence check on `/` and an unauth `401/403` check on `/api/test-openai`.
- [ ] Manual a11y/keyboard smoke checklist (axe pass + tab-through) — see A11y checklist below.
- [ ] Framework install: **not required** for this phase. If desired later, Playwright smoke tests for `/`, `/contact`, `/fund-me`, `/budget` (CONCERNS.md suggestion) — out of scope here.

*(The gate commands fully cover SHIP-02; FIX-01/FIX-02/VIS-08/SHIP-01 verification is curl + manual browser checks, appropriate given no test runner exists.)*

## A11y Hardening Checklist (scoped to phases 3–5 output)

> Phases 3–5 build the WebGL hero, AI sections, case studies, centralized content. Audit *their* output plus the existing gaps CONCERNS.md catalogues. Automatable points marked **[auto]** (grep/axe/build); rest are manual.

- [ ] **[auto-grep]** Every `<canvas>` has `aria-hidden="true"` (decorative) or `role="img"` + `aria-label`. Current gap: all three canvases lack it (`Hero3DScene`, `InteractiveGlobe`, `IdeaNetworkCanvas`).
- [ ] **[auto-grep]** Decorative animated elements (`animate-ping` status dot `Hero3D.tsx:46`, scroll indicator) have `aria-hidden`.
- [ ] **[manual]** `InteractiveGlobe` (drag-only) has a keyboard alternative or is `aria-hidden` with content available elsewhere.
- [ ] **[auto-grep]** `VisitorTracker` toast has `aria-live="polite"` and a text alternative (not emoji-only) — `VisitorTracker.tsx:134`.
- [ ] **[manual]** Skip-to-content link added in `layout.tsx` (currently absent).
- [ ] **[manual]** All interactive elements keyboard-reachable with a visible focus ring (theme toggle, nav, cards, buttons) — both themes.
- [ ] **[auto-axe]** WCAG AA color contrast passes in BOTH `:root` (dark) and `[data-theme="light"]` — audit the low-contrast tokens (`--text-faint`, 10–11px uppercase labels `Hero3D.tsx:95,105`).
- [ ] **[auto-grep]** `prefers-reduced-motion` honored by every motion source incl. new VIS-08 VT and any phase 3–5 WebGL hero (kill switch exists `globals.css:134`; canvases currently don't check).
- [ ] **[auto-grep]** Every meaningful `<img>`/`next/image` has `alt`; decorative images have `alt=""`.
- [ ] **[manual]** `next/image` used for team photos (`public/team/`) — `no-img-element` lint already flags `TeamSection.tsx:165`.

## Post-Deploy Verification Checklist (SHIP-01)

After `vercel --prod`, confirm:
- [ ] `curl -I https://www.usamajaved.com.au/` → 200; `https://usamajaved.com.au/` redirects/serves (apex + www both mapped to `modern-portfolio`).
- [ ] `curl https://www.usamajaved.com.au/sitemap.xml` → valid XML, expected routes present.
- [ ] `curl https://www.usamajaved.com.au/robots.txt` → bot tiers intact (AI search allowed, training blocked).
- [ ] `curl https://www.usamajaved.com.au/llms.txt` → `Content-Type: text/markdown`; `/.llms` rewrite serves `/api/llms`.
- [ ] `curl -s https://www.usamajaved.com.au/ | grep 'application/ld+json'` → 7 JSON-LD blocks present (validate with Google Rich Results test).
- [ ] `curl -s -o /dev/null -w "%{http_code}" https://www.usamajaved.com.au/api/test-openai` → **401/403** (FIX-01 gate live); no `keyUsed` in body.
- [ ] DevTools Network on a fresh visit → **no** `/api/auto-llm-training` or `/api/schedule-training` calls (FIX-02).
- [ ] `/fund-me` Stripe checkout works in the live flow (or verified in test mode pre-deploy).
- [ ] IndexNow key file `https://www.usamajaved.com.au/usamajaved-indexnow-key-2026.txt` still served.
- [ ] View Transitions animate in Chrome, instant-navigate under OS reduced-motion.

## Sources

### Primary (HIGH confidence)
- Direct repo measurement (`npx tsc --noEmit`, `npm run lint`/`npx eslint`) on 2026-06-12 — exact 29 tsc / 96 lint inventories, per-file/per-rule breakdowns.
- Actual source files: `test-openai/route.ts`, `VisitorTracker.tsx`, `auto-llm-training/route.ts`, `schedule-training/route.ts`, `test-free-llm/route.ts`, `next.config.ts`, `robots.ts`, `eslint.config.mjs`, `package.json`.
- `.planning/codebase/CONCERNS.md`, `INTEGRATIONS.md`; `.planning/phases/01-content-centralization/deferred-items.md` (debt precedent); `.planning/research/FEATURES.md`.
- Next.js View Transitions guide: https://nextjs.org/docs/app/guides/view-transitions (reduced-motion CSS, native vs React component) — fetched, lastUpdated 2026-05-13.
- Verified versions: `npx next --version` 15.5.12, `vercel --version` 48.1.6, node v22.22.2, npm 10.9.7, stripe 18.5.0.
- Vercel CLI deploy docs: https://vercel.com/docs/cli/deploy

### Secondary (MEDIUM confidence)
- Next.js 15.5 release / `next lint` deprecation: https://nextjs.org/blog/next-15-5 ; codemod `next-lint-to-eslint-cli`.
- React `<ViewTransition>` experimental/canary status (mid-2026): https://react.dev/reference/react/ViewTransition ; React Labs 2025-04 ; multiple 2026 write-ups confirming canary-only.
- Browser support for `@view-transition`: Chrome/Edge 126+, Safari supported, Firefox in progress — MDN + Chrome for Developers 2025.
- `next-view-transitions` (shuding): https://github.com/shuding/next-view-transitions (basic-use-case caveat).

### Tertiary (LOW confidence)
- Community page-transition guides (72technologies, glance, dev.to) — corroborate native-vs-React framing; not relied on for decisions.

## Metadata

**Confidence breakdown:**
- Strict-build inventory (SHIP-02): **HIGH** — measured directly against the repo, per-file and per-rule.
- FIX-01 / FIX-02 design: **HIGH** — verified against actual route/component source; zero-dep patterns are standard.
- VIS-08: **HIGH** on the recommendation (native CSS, reduced-motion) — verified against official Next.js guide + React canary status; **MEDIUM** on exact browser-version coverage (moves over time).
- A11y checklist: **HIGH** for the gaps (from CONCERNS.md audit) — **but** scoped to phases 3–5 output which doesn't exist yet (assumptions noted).
- Deploy (SHIP-01): **HIGH** — Vercel CLI present and verified; standard preview→prod flow.

**Research date:** 2026-06-12
**Valid until:** ~2026-07-12 for stable items (tsc/lint counts, route source); ~2026-06-26 for fast-moving items (View Transitions browser support, React component stability, Next 16 status). Re-run the tsc/lint gates at phase start — counts WILL change once phases 3–5 land.
