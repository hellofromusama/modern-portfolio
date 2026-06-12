# Phase 06 Deferred Items

Out-of-scope discoveries logged during execution. These are NOT fixed in their discovering plan (scope-boundary rule) and are tracked here for a future plan/phase.

## 06-07 — Strict-build warnings (non-blocking, out of scope)

- **`metadata.viewport` / `metadata.themeColor` / `metadata.colorScheme` export warnings (Next.js 15 advisory).** The strict `npm run build` (after the SHIP-02 flag flip) emits `⚠ Unsupported metadata viewport/themeColor/colorScheme is configured in metadata export in /<route>` for ~25 routes (every page exporting these three keys in its `metadata` object). Next.js 15 wants them moved to a separate `export const viewport: Viewport = {...}`.
  - **Status:** WARNING only — the strict build exits 0; these do NOT fail the build and are NOT type/lint errors. They are the build's analog of the pre-existing `images.domains` deprecation warning the 06-07 plan explicitly scoped OUT.
  - **Scope:** Touches the root `layout.tsx` + every page's `metadata` export — a cross-cutting metadata refactor, unrelated to the strict-flip's tsc/lint enforcement. Out of scope for 06-07 (which only removes the two `ignore*` flags + authors verify-prod.sh).
  - **Recommendation:** Address as a small dedicated cleanup (move `viewport`/`themeColor`/`colorScheme` into `export const viewport: Viewport` in `layout.tsx` and any per-page overrides) in 06-08 polish or a follow-up. No functional or SEO impact today.

- **`images.domains` deprecation** (pre-existing, flagged out of scope by the 06-07 plan context): Next.js recommends `images.remotePatterns` over `images.domains`. Left untouched per plan directive.
