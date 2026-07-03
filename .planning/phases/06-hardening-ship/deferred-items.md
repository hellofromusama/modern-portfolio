# Phase 06 Deferred Items

Out-of-scope discoveries logged during execution. These are NOT fixed in their discovering plan (scope-boundary rule) and are tracked here for a future plan/phase.

## 06-07 — Strict-build warnings (non-blocking, out of scope)

- **`metadata.viewport` / `metadata.themeColor` / `metadata.colorScheme` export warnings (Next.js 15 advisory).** The strict `npm run build` (after the SHIP-02 flag flip) emits `⚠ Unsupported metadata viewport/themeColor/colorScheme is configured in metadata export in /<route>` for ~25 routes (every page exporting these three keys in its `metadata` object). Next.js 15 wants them moved to a separate `export const viewport: Viewport = {...}`.
  - **Status:** WARNING only — the strict build exits 0; these do NOT fail the build and are NOT type/lint errors. They are the build's analog of the pre-existing `images.domains` deprecation warning the 06-07 plan explicitly scoped OUT.
  - **Scope:** Touches the root `layout.tsx` + every page's `metadata` export — a cross-cutting metadata refactor, unrelated to the strict-flip's tsc/lint enforcement. Out of scope for 06-07 (which only removes the two `ignore*` flags + authors verify-prod.sh).
  - **Recommendation:** Address as a small dedicated cleanup (move `viewport`/`themeColor`/`colorScheme` into `export const viewport: Viewport` in `layout.tsx` and any per-page overrides) in 06-08 polish or a follow-up. No functional or SEO impact today.

- **`images.domains` deprecation** (pre-existing, flagged out of scope by the 06-07 plan context): Next.js recommends `images.remotePatterns` over `images.domains`. Left untouched per plan directive.

## quick-260703-l5n — Pre-existing hydration mismatch under prefers-reduced-motion

- **React error #418 (`<html>` hydration mismatch) when `prefers-reduced-motion: reduce` is emulated.** During the 260703-l5n Playwright smoke, loading `/` under `reducedMotion: 'reduce'` throws `Minified React error #418; ...args[]=HTML` as a pageerror — in BOTH space mode AND classic mode (no space/scene code mounted), on the prod build.
  - **Status:** PRE-EXISTING and unrelated to the 260703-l5n scene changes (all of which live inside the `ssr:false` R3F canvas and cannot alter SSR HTML). Proven by the classic-mode reproduction where none of the changed files load.
  - **Likely source:** something reconciling an attribute/class on `<html>` differently when the reduced-motion media query matches during hydration (args point at the `HTML` element).
  - **Impact:** Console error only under reduced-motion; page renders fully and scroll still works (smoke (d) brightness/interaction checks pass).
  - **Recommendation:** Dedicated small debug task — reproduce with a dev build under `page.emulateMedia({ reducedMotion: 'reduce' })` to get the full mismatch diff.
