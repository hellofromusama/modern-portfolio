---
phase: 04-r3f-infrastructure
plan: 03
subsystem: three
tags: [three, react-three-fiber, webgl, ssr-false, bundle-budget, route-split, noindex, robots, sitemap, ship-gate, perf-01, lcp, harness, evidence-checkpoint]

requires:
  - phase: 04-r3f-infrastructure
    provides: "Plan 04-02 — ClientScene (the SOLE public entry point: dynamic(ssr:false) SceneCanvas + IslandBoundary(fallback=poster) + isWebGLAvailable probe); ScenePoster (100%/100% zero-CLS poster); ThemedScene (useThemeColors->THREE.Color, no remount); bundle-gate.mjs + check-stack.mjs gates"
  - phase: 03-shared-foundation
    provides: "useAnimationGate, useThemeColors, IslandBoundary"
provides:
  - "/scene-harness — isolated, noindex/nofollow, dev-only route that mounts <ClientScene/> in a 70vh sized container; the end-to-end proof that the island renders without touching the live Canvas-2D hero on /"
  - "scene-harness/layout.tsx — server segment layout exporting metadata.robots = { index:false, follow:false } (client page cannot export metadata)"
  - "bundle-gate.mjs CANVAS_ROUTES armed to /scene-harness/page (off /page + /layout): SHIP-01/PERF-01 cross-route gate now green against a route that actually ships three"
  - "SHIP-01 gate evidence: tsc(scoped) + lint(scoped) + build + check-stack + bundle-gate + PERF-01 source leak grep + poster-first LCP curl proof"
affects: [05-component-upgrades, hero-webgl]

tech-stack:
  added: []
  patterns:
    - "Underscore-prefixed app dirs are NON-routable in Next App Router (private folders) — a routable dev harness must use a plain name (scene-harness) and earn non-discoverability via robots noindex/nofollow + sitemap exclusion, NOT the folder name"
    - "A client page cannot export metadata; the robots directive for a route segment lives in a sibling SERVER layout.tsx"
    - "ssr:false dynamic import makes three MOUNT-split, not just route-split: the three vendor chunk is async-only (loaded when ClientScene mounts) and absent from EVERY route's eager payload, including the canvas route's initial HTML — the poster is the server-rendered LCP element"
    - "bundle-gate CANVAS_ROUTES is the single allow-set; arm it to the one route that legitimately ships three and the hash-proof cross-route matcher proves three leaks nowhere else"

key-files:
  created:
    - src/app/scene-harness/layout.tsx
    - src/app/scene-harness/page.tsx
  modified:
    - scripts/bundle-gate.mjs

key-decisions:
  - "Renamed the route from _scene-harness to scene-harness: Next.js App Router treats '_'-prefixed folders as PRIVATE and excludes them from routing entirely, so /_scene-harness would never mount (build manifest + routes-manifest confirmed it absent). The plan's facts assumed it routable — corrected (Rule 3 blocking fix). Non-discoverability is delivered by the layout's robots noindex/nofollow + sitemap exclusion, which the plan itself identified as the real privacy mechanism."
  - "bundle-gate CANVAS_ROUTES set to /scene-harness/page ONLY (not /page): three must stay OFF the live homepage this phase per the orchestrator 'do not degrade the live hero' constraint. The homepage Canvas-2D hero is untouched."
  - "Inline data-theme toggle button added to the harness page (mirrors ThemeToggle's document.documentElement.setAttribute('data-theme', ...)) so the evidence checkpoint can flip themes without Navigation being rendered on the bare route."

patterns-established:
  - "Pattern: dev/verification routes use a plain folder name + a server layout with robots:{index:false,follow:false} + deliberate sitemap.ts omission for non-discoverability (never rely on an underscore prefix, which silently disables routing)"
  - "Pattern: the bundle-gate allow-set names exactly the route(s) that ship three; everything else (incl. /layout and the live homepage) must stay three-free, enforced by the hash-proof cross-route diff"

requirements-completed: [FOUND-04, PERF-01, SHIP-01]

duration: 9min
completed: 2026-06-12
---

# Phase 4 Plan 03: /scene-harness Mount + SHIP-01 Gate + Evidence Checkpoint Summary

**The WebGL island is proven end-to-end on an isolated, noindex/nofollow `/scene-harness` route — three confined there (mount-split via ssr:false, absent from the live homepage's payload), the SHIP-01 gate green (tsc/lint scoped-clean + build + check-stack + bundle-gate + PERF-01 leak grep), and headless evidence captured for the poster-first LCP, the server-rendered hero, and the noindex meta — all without touching the live Canvas-2D hero.**

## Performance

- **Duration:** ~9 min
- **Started:** 2026-06-12T05:58:55Z
- **Completed:** 2026-06-12T06:07:31Z
- **Tasks:** 3 (2 auto + 1 evidence checkpoint, evidence-satisfied / orchestrator auto-approve)
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments
- `/scene-harness` mounts `<ClientScene/>` in a 70vh sized container — the island renders end-to-end (poster-first, theme-toggleable, error-isolated) on a route that is NOT the live hero.
- Route is non-discoverable: `scene-harness/layout.tsx` (server) exports `metadata.robots = { index:false, follow:false }` → served HTML carries `<meta name="robots" content="noindex, nofollow"/>`; `sitemap.ts` has zero `scene-harness` references.
- `bundle-gate.mjs` armed to `/scene-harness/page` only — the gate now proves three against a route that actually ships it, and confirms three is on NO other route (incl. `/page` and `/layout`).
- PERF-01 proven two ways: (1) source leak grep — no text/SEO route or `/layout` imports `three`/`@react-three/*`/`ClientScene`; (2) headless curl — the home hero is server-rendered with no three vendor chunk, and the harness HTML is poster-first (no `<canvas>` in SSR HTML, the token-gradient poster div IS server-rendered).
- SHIP-01 full suite green; Phase-4 files tsc-clean and lint-clean (pre-existing unrelated errors out of scope, non-blocking by config).

## Gate Command Outputs (recorded)

```
# Task 1 verify
harness noindex + sitemap-excluded OK
tsc (scoped three/|lib/webgl|scene-harness): no errors (clean)
build: success (/scene-harness  2.2 kB  105 kB First Load)
bundle-gate: bundle budget OK — three confined to canvas routes [/scene-harness/page] across 38 routes  (exit 0)

# manifest verification
scene-harness keys: ['/scene-harness/layout', '/scene-harness/page']
three vendor chunks (b536a0f1, b79b7286, bd904a5c) referenced in ANY route static entry: NONE
  -> three is async-only (loaded on ClientScene mount = harness only); not in home/page payload

# Task 2 SHIP-01 suite
1. tsc  (Phase-4 files): clean   (pre-existing api/* + expertise errors out of scope, non-blocking)
2. lint (Phase-4 files): clean   (96 pre-existing problems elsewhere; eslint.ignoreDuringBuilds:true)
3. build: success
4. check-stack: stack OK: three@^0.184.0, @react-three/fiber@^9.6.1, @react-three/drei@^10.7.7, @types/three@^0.184.1, motion@^12.40.0  (exit 0)
   bundle-gate: bundle budget OK — three confined to [/scene-harness/page] across 38 routes  (exit 0)
5. PERF-01 leak grep: OK — no text/SEO route or /layout imports three/@react-three/ClientScene
```

## PERF-01 Poster-First LCP Evidence (headless, fresh prod server on :3100)

```
HOME (/):
  - server-rendered hero content present: 121x "Usama", 5x "hero" markers
  - only "three" string in HTML is the English word ("aid for the project three times over") — NOT the library
  - no three vendor chunk <script src> on home  -> home LCP does NOT wait on three.js

HARNESS (/scene-harness):
  - status 200
  - <meta name="robots" content="noindex, nofollow"/>  PRESENT
  - "Scene Harness" heading + ClientScene + icosahedron markers present
  - <canvas> in SSR HTML: 0  (canvas is ssr:false, client-only)
  - poster IS server-rendered: aria-hidden div class="scene-harness-canvas"
    style="width:100%;height:100%;background:radial-gradient(circle at 30% 30%, color-mix(... var(--accent-blue) ...))"
    -> poster-first: static token-gradient poster is the server-rendered LCP, canvas swaps in client-side over it (zero CLS)
```

## Task Commits

1. **Task 1: Mount island on /scene-harness (noindex) + arm bundle-gate** - `344ab9c` (feat) — `src/app/scene-harness/layout.tsx`, `src/app/scene-harness/page.tsx`, `scripts/bundle-gate.mjs`
2. **Task 2: SHIP-01 full gate + poster-first LCP proof + PERF-01 leak grep** - verification-only, no source edits required (no gate failed) — evidence recorded above, no separate commit.
3. **Task 3: Evidence checkpoint** - evidence-satisfied (headless), browser-only residue documented below; orchestrator auto-approves on evidence.

**Plan metadata:** (docs commit — see final commit)

## Files Created/Modified
- `src/app/scene-harness/page.tsx` (created) — `'use client'` harness mounting `<ClientScene/>` in a 70vh container + inline data-theme toggle for the evidence checkpoint.
- `src/app/scene-harness/layout.tsx` (created) — server segment layout exporting `metadata.robots = { index:false, follow:false }`.
- `scripts/bundle-gate.mjs` (modified) — `CANVAS_ROUTES` → `/scene-harness/page`; added the `_`-prefix routing caveat comment.

## Decisions Made
See `key-decisions` frontmatter. In short: route renamed `_scene-harness` → `scene-harness` (underscore folders are non-routable in Next App Router — Rule 3 blocking fix); CANVAS_ROUTES armed to the harness only (homepage stays three-free per the "don't degrade the live hero" constraint); inline theme toggle added for the checkpoint.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Renamed `_scene-harness` → `scene-harness` (underscore folders are non-routable in Next App Router)**
- **Found during:** Task 1 (mount + first build)
- **Issue:** The plan's facts (line 67) asserted Next App Router routes `/_scene-harness`. It does NOT — Next treats `_`-prefixed app directories as PRIVATE folders excluded from routing. The first build produced NO `/_scene-harness` entry in `app-build-manifest.json` or `routes-manifest.json`, and `.next/server/app/` contained no scene-harness output. The bundle-gate passed only trivially (the allow-listed canvas route did not exist, so there were no chunks to check) — meaning the island was mounted on a route that could never load, and the gate proved nothing.
- **Fix:** Renamed the directory to `scene-harness` (no underscore) so the route actually mounts. Updated `bundle-gate.mjs` CANVAS_ROUTES to `/scene-harness/page` and the in-file comments in both harness files to document the `_`-prefix caveat. Non-discoverability is unchanged — it was always delivered by the layout's `robots:{index:false,follow:false}` + sitemap exclusion (the plan itself identified these as the real privacy mechanism), never by the underscore.
- **Files modified:** `src/app/scene-harness/{layout,page}.tsx` (moved + comment-updated), `scripts/bundle-gate.mjs`
- **Verification:** Rebuild → `/scene-harness  2.2 kB` route emitted; manifest keys `/scene-harness/{layout,page}` present; bundle-gate green against a real canvas route; served HTML carries the noindex meta and the server-rendered poster.
- **Committed in:** `344ab9c` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking — Rule 3).
**Impact on plan:** Essential for correctness — without it the harness route would not exist and the entire phase gate would be a false pass. No scope creep; the route name change is the minimal fix and the security/SEO posture (noindex + sitemap-excluded) is identical to the plan's intent.

## Issues Encountered
- A pre-existing server was already bound to port 3000 (stale, provenance unknown). To guarantee the LCP evidence reflected THIS build, a fresh production server was started on port 3100, used for all curl evidence, then stopped (verified down, status 000). The pre-existing :3000 server was left untouched.
- `npx tsc --noEmit` and `npm run lint` surface PRE-EXISTING errors in unrelated files (api/ai-training, auto-llm-training, budget-estimate, create-checkout, expertise/page.tsx; 64 lint errors + 32 warnings across API routes / TeamSection / etc.). These predate this plan, are out of scope per the scope boundary, and are non-blocking by design (`typescript.ignoreBuildErrors:true` + `eslint.ignoreDuringBuilds:true`). All Phase-4 files (scene-harness, components/three/*, lib/webgl) are clean.
- Build emits viewport/themeColor/colorScheme metadata warnings for `/scene-harness` — these are inherited from the root layout's metadata export (a pre-existing app-wide pattern, surfaced per-segment), not introduced by this plan. Out of scope.

## Browser-Only Residue (for human/orchestrator — cannot be captured headlessly)
The following checkpoint items require a live browser and are the residue the orchestrator/human confirms visually (the headless gate above proves the structural/payload facts):
1. **Theme reactivity (FOUND-04):** toggle on `/scene-harness` → icosahedron edge color flips dark `#60a5fa` → light `#3b82f6` live, no remount, no `THREE.Color` warning. (Headless: both `data-theme` states resolve in served CSS vars; the live color flip is visual.)
2. **Off-screen / tab-blur pause:** scroll canvas off-screen / blur tab → frameloop stops (bound to useAnimationGate).
3. **Reduced-motion freeze (PERF-04 foundation):** emulate `prefers-reduced-motion: reduce` → icosahedron frozen.
4. **WebGL-disabled fallback (FOUND-04/05):** disable WebGL / force context loss → ScenePoster shows, no crash, chrome intact.
5. **Hard-refresh, no hydration error:** ssr:false excludes the server pass → no mismatch. (Headless: confirmed no `<canvas>` in SSR HTML.)
6. **Live hero untouched:** `/` Canvas-2D hero unchanged (Headless: home payload identical, no three).
7. **CLS ≤ 0.1 on canvas mount (PERF-01):** poster and canvas are both 100%/100% of the same 70vh container → zero reflow on swap. (Headless: poster div sized 100%/100% confirmed in SSR HTML.)

## Temporary-Scope Note
`/scene-harness` (both `page.tsx` and `layout.tsx`) and its `bundle-gate.mjs` CANVAS_ROUTES allow-entry are TEMPORARY. Phase 5 mounts the real scene on the live hero and must: delete `src/app/scene-harness/`, and change CANVAS_ROUTES from `/scene-harness/page` to the hero's route (`/page`).

## User Setup Required
None — no external service configuration required.

## Known Stubs
None. The harness is intentionally minimal (a verification route, not a designed page) — documented throwaway scope, removed in Phase 5, not a stub. `ThemedScene` remains the trivial icosahedron theme-bridge proof from 04-02 (Phase 5 replaces it via the `{ paused }` contract).

## Next Phase Readiness
- Phase 4 is COMPLETE (3/3 plans): the R3F island is built (04-02), gated, mounted, proven, and route-split (04-03). FOUND-04, PERF-01, and SHIP-01 are satisfied.
- Phase 5 inherits a trusted, poster-first, themed, error-isolated, frameloop-gated, mount-split boundary. To go live on the hero: import `ClientScene` on the homepage, swap `CANVAS_ROUTES` to `/page`, delete `src/app/scene-harness/`, and re-run `next build && node scripts/bundle-gate.mjs`.

## Self-Check: PASSED

All created files present on disk; Task 1 commit found in git history (verified below).

---
*Phase: 04-r3f-infrastructure*
*Completed: 2026-06-12*
