---
phase: 06-hardening-ship
plan: 03
subsystem: testing
tags: [eslint, lint, next-image, react-no-unescaped-entities, typescript, no-explicit-any]

# Dependency graph
requires:
  - phase: 05-component-upgrades
    provides: "the upgraded pages/components whose pre-existing lint debt this plan clears"
provides:
  - "17 owned files lint-clean (the ~59 non-api-type, non-expertise lint problems cleared)"
  - "Both <img> elements migrated to next/image (no-img-element gone)"
  - "prefer-const auto-fixed in Hero3DScene; InteractiveGlobe confirmed already clean"
  - "Typed shapes replacing no-explicit-any in llm-training-dashboard and test-apis"
affects: [06-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "next/image with fill + sizes for object-cover fill images that keep an onError DOM-fallback"
    - "catch {} (optional-catch-binding) for genuinely-unused catch errors in API routes/client handlers"
    - "&apos;/&quot; JSX entity escaping that changes escape sequence only, never rendered/SEO glyph"

key-files:
  created:
    - .planning/phases/06-hardening-ship/06-03-SUMMARY.md
  modified:
    - src/components/Hero3DScene.tsx
    - src/app/llm-training-dashboard/page.tsx
    - src/app/budget/page.tsx
    - src/app/ideas/page.tsx
    - src/app/fund-me/success/page.tsx
    - src/components/TeamSection.tsx
    - src/app/team/page.tsx
    - src/components/AISeoContent.tsx
    - src/app/blog/page.tsx
    - src/app/contact/page.tsx
    - src/app/fund-me/page.tsx
    - src/app/test-apis/page.tsx
    - src/app/api/schedule-training/route.ts
    - src/app/api/test-free-llm/route.ts
    - src/app/api/test-openai/route.ts
    - src/app/api/ai-verification/route.ts

key-decisions:
  - "Both team <img> elements migrated to next/image fill (local public/team/ assets) rather than a disable — default per plan; onError fallback + grayscale hover preserved"
  - "no-explicit-any replaced with real interfaces (ProviderResult/SubmissionResults in dashboard, TestResults in test-apis) — zero eslint-disable used anywhere"
  - "Unused-request API params removed along with their now-unused NextRequest import (GET/POST handlers are valid without params)"

patterns-established:
  - "Pattern: fill-container <img> with onError fallback -> next/image fill + sizes, className drops w-full h-full (Image fill supplies them)"
  - "Pattern: entity-escaping SEO/JSON-LD copy is verified byte-identical via git diff before commit"

requirements-completed: [SHIP-02]

# Metrics
duration: 13min
completed: 2026-06-12
---

# Phase 6 Plan 03: Lint Sweep (remaining ~59 problems) Summary

**Cleared all lint findings in the 16 owned files (InteractiveGlobe was already clean) — entity escaping, real TypeScript shapes replacing `any`, unused-var removal, and two `<img>`→`next/image` migrations — with zero blanket disables and byte-identical rendered/SEO copy.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-06-12T08:04:07Z
- **Completed:** 2026-06-12T08:17:10Z
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments
- All 17 owned files pass `npm run lint` with zero findings (16 modified; InteractiveGlobe verified already clean so left untouched).
- `prefer-const` auto-fixed in Hero3DScene (x/z/y in the icosahedron projection map) via `npx eslint --fix`.
- Both `no-img-element` findings resolved: TeamSection and team/page `<img>` swapped to `next/image` with `fill` + `sizes`, preserving the `onError` DOM-fallback and grayscale-hover behavior.
- `no-explicit-any` eliminated with real interfaces: `ProviderResult`/`SubmissionResults` (dashboard), `TestResults` (test-apis) — no `eslint-disable` used.
- `react/no-unescaped-entities` cleared across llm-training-dashboard, budget, ideas, fund-me/success, blog, and AISeoContent — escape-sequence only, SEO/JSON-LD copy verified byte-identical via `git diff`.
- API test/schedule routes de-linted (unused `request` params + `NextRequest` imports removed, `catch {}` for unused bindings) without touching their security surface (06-04's domain).

## Task Commits

Each task was committed atomically:

1. **Task 1a: Auto-fix prefer-const (Hero3DScene)** - `eb6db45` (fix)
2. **Task 1b: Clear lint in 4 heavy client pages** - `1b7a47c` (fix)
3. **Task 2: Remaining components, pages, and api test routes** - `43bec9b` (fix)

**Plan metadata:** see final docs commit.

## Files Created/Modified
- `src/components/Hero3DScene.tsx` - prefer-const auto-fix (x/z/y → const)
- `src/app/llm-training-dashboard/page.tsx` - typed SubmissionResult/ProviderResult, `catch {}`, &quot;/&apos; escapes
- `src/app/budget/page.tsx` - removed unused Link import + EstimateResult interface, `catch {}`, quote/apostrophe escapes
- `src/app/ideas/page.tsx` - 7 apostrophe escapes (canvas wiring untouched)
- `src/app/fund-me/success/page.tsx` - 4 apostrophe escapes
- `src/components/TeamSection.tsx` - `<img>` → next/image fill, onError fallback preserved
- `src/app/team/page.tsx` - `<img>` → next/image fill, onError fallback preserved
- `src/components/AISeoContent.tsx` - 3 apostrophe escapes in sr-only SEO copy (byte-identical)
- `src/app/blog/page.tsx` - 2 apostrophe escapes (server component; no event handlers added)
- `src/app/contact/page.tsx` - removed unused Link import
- `src/app/fund-me/page.tsx` - removed unused Link + MagneticHover imports
- `src/app/test-apis/page.tsx` - typed TestResults shape, `catch {}`
- `src/app/api/schedule-training/route.ts` - removed unused POST request param + NextRequest import, `catch {}` ×3
- `src/app/api/test-free-llm/route.ts` - removed unused POST request param + NextRequest import, `catch {}`
- `src/app/api/test-openai/route.ts` - removed unused GET request param + NextRequest import
- `src/app/api/ai-verification/route.ts` - `catch {}` for unused error binding

## Decisions Made
- **next/image over disable for both team photos:** assets are local (`public/team/`), so `next/image` with `fill` is the correct fix; the existing `onError` fallback (DOM `display` toggle) and grayscale-hover transition are preserved verbatim.
- **Real types over disables for every `no-explicit-any`:** defined minimal interfaces matching actual usage (`ProviderResult.success/scenarios_submitted/message`, `TestResults.budget.response`). No `eslint-disable` anywhere in the sweep.
- **Removed unused `request`/`NextRequest` together:** in the four API routes the only consumer of `NextRequest` was the unused param, so both were dropped; Next.js GET/POST handlers are valid with no parameters.

## Deviations from Plan

### Observations vs. plan's measured counts (no action beyond the documented sweep)

**1. [Observation] InteractiveGlobe already lint-clean**
- **Found during:** Task 1 (prefer-const auto-fix step)
- **Issue:** Plan listed an InteractiveGlobe `prefer-const` at ~line 265, but the baseline lint showed InteractiveGlobe with zero findings (a parallel/prior fix had already cleared it). `npx eslint --fix` produced no change to that file.
- **Fix:** None needed — confirmed clean, left untouched (additive mandate). Only Hero3DScene's prefer-const remained and was auto-fixed.
- **Verification:** `npx eslint src/components/InteractiveGlobe.tsx` exits 0 with no edits.

**2. [Observation] TeamSection had 1 finding, not 3**
- **Found during:** Task 2
- **Issue:** Plan estimated TeamSection at 3 findings; baseline showed only the single `no-img-element`. The other two had already been resolved upstream.
- **Fix:** Resolved the one `no-img-element` (next/image). No other findings to clear.
- **Verification:** `npx eslint src/components/TeamSection.tsx` exits 0.

**3. [Observation] test-openai's finding was the unused `request` param, not a keyUsed leak**
- **Found during:** Task 2
- **Issue:** The keyUsed note warned against touching test-openai's security surface; verified its single lint finding was `'request' is defined but never used` (3:27), unrelated to keyUsed.
- **Fix:** Removed the unused `request` param + `NextRequest` import only. The keyUsed variable (06-04's edit) was not touched.
- **Verification:** `npx eslint src/app/api/test-openai/route.ts` exits 0; keyUsed line unchanged.

---

**Total deviations:** 0 auto-fixes required beyond the planned sweep; 3 observations where on-disk state differed from the plan's measured counts (all in this plan's favor — fewer/already-clean findings).
**Impact on plan:** None. The owned-file set and the zero-finding bar are met exactly. No `any` left behind, no blanket disables, no behavior change, no new dependencies (`git diff package.json` empty). The Fix-8 mid-execution split was NOT needed — Task 2 cleared cleanly in one pass.

## Issues Encountered
- llm-training-dashboard's `data` cast: the provider-results `.map` typed each entry `any` and accessed `.success/.scenarios_submitted/.message`. Converted the arrow to a block body with a single `data as ProviderResult | undefined` narrowing so the JSX property access is type-safe without re-introducing `any`. Lint + behavior verified unchanged.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- This plan's 17 files are lint-clean and ready for 06-05's `eslint.ignoreDuringBuilds: false` flip.
- Full-tree zero-lint depends on 06-01 (api type-routes: ai-training, auto-llm-training, budget-estimate, create-checkout) and 06-02 (expertise) completing their parallel sweeps; those files were intentionally excluded here.
- `keyUsed` security edit in test-openai remains for 06-04 (untouched here by design).

## Self-Check: PASSED

- All modified files verified present on disk.
- All three task commits (eb6db45, 1b7a47c, 43bec9b) verified in git log.
- No stubs introduced — every edit was lint-only (entity escaping, real types, unused-var removal, `<img>`→next/image). No empty/placeholder data wired to UI.

---
*Phase: 06-hardening-ship*
*Completed: 2026-06-12*
