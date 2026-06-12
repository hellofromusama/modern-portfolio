---
phase: 05-component-upgrades
plan: 09
subsystem: testing
tags: [ship-01, verification-gate, lighthouse, lcp, cls, bundle-gate, content-diff, contrast-check, smoke, both-theme, residual-literal-sweep, phase-final]

# Dependency graph
requires:
  - phase: 05-01
    provides: "WebGL hero + scene-injection; the LCP/CLS surface this gate measures (observed LCP 689ms / CLS 0 baseline; simulated-LCP animation artifact characterized)"
  - phase: 05-02
    provides: "InteractiveGlobe + IdeaNetworkCanvas (DPR-correct, theme-reactive, gated) — smoked in context on /ideas + /fund-me"
  - phase: 05-03
    provides: "ScrollReveal-family + InteractiveButton on motion v12 — reduced-motion parity verified by mechanism"
  - phase: 05-04
    provides: "Navigation + ThemeToggle upgrades (focus-visible rings, AnimatePresence menu)"
  - phase: 05-07
    provides: "Pages group A token pass (home, projects/[id], expertise, services, tech-stack, developer-australia)"
  - phase: 05-08
    provides: "Pages group B token pass (blog, budget, contact, team, ideas, fund-me)"
provides:
  - "Full automated SHIP-01 gate run + recorded VERBATIM results (tsc 29-error baseline unchanged / lint 93 baseline unchanged / build 50/50 green / bundle-gate exit 0 / content-diff exit 0 / contrast-check exit 0)"
  - "Two regression fixes the parallel waves' skip-build mandate let slip: /blog server-component prerender crash + the last residual glass literal (ThemeToggle pill track)"
  - "All-route smoke evidence: 17 routes HTTP 200 + content markers + both data-theme palettes confirmed in served CSS"
  - "Honest Lighthouse LCP/CLS evidence: CLS=0 + observed LCP 1360ms (≤2.5s); simulated LCP 15.6s documented as the same animation artifact 05-01 characterized (LCP-element null, 31 reqs settle ~2s)"
  - "Phase-5 shared-state reconciliation: completed_plans recalc from on-disk SUMMARYs, ROADMAP Phase 5 marked Complete, VIS-*/PERF-02/SHIP-01 requirement checkboxes consistent"
affects: [phase-06-hardening-ship, milestone-end-preview-deploy]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Server-component-safe hover: pure-CSS Tailwind arbitrary hover variants (hover:[background:var(--token)]) replace JS onMouseEnter/Leave style-mutation on server-rendered pages — event handlers cannot cross the server→client prop boundary"
    - "Honest headless LCP evidence: report trace-OBSERVED LCP (trustworthy) alongside the inflated Lantern simulated LCP, with the artifact explained (null LCP-element attribution + perpetual WebGL frameloop defeating the quiet-window heuristic) — never fabricate a passing number"
    - "Wave-final reconciliation: recalc completed_plans from on-disk SUMMARY count (single source of truth) rather than trusting a drifted counter left by parallel executors"

key-files:
  created:
    - .planning/phases/05-component-upgrades/05-09-SUMMARY.md
    - .planning/phases/05-component-upgrades/05-09-lighthouse-home.json
    - .planning/phases/05-component-upgrades/deferred-items.md
  modified:
    - src/app/blog/page.tsx
    - src/components/ThemeToggle.tsx

key-decisions:
  - "The /blog prerender crash (onMouseEnter/Leave on a server component) is a Rule-1 bug introduced by 05-08's token pass under the parallel skip-build mandate. Fixed by replacing JS style-mutation hover with pure-CSS Tailwind arbitrary hover variants (hover:[background:var(--bg-card-hover)] hover:[border-color:var(--border-hover)]) — identical token-driven visuals, no client boundary, /blog prerenders again. The gate (which 05-08 skipped) is exactly what caught it."
  - "The ThemeToggle pill track was the ONLY remaining bg-white/[0 | border-white/[0 glass literal in src/. Rather than record it as an 'intentional exception', tokenized it to var(--bg-card)/var(--border-subtle) (frosted backdrop-blur + animated motion.div track-fill preserved) so the VIS-06 grep gate is genuinely clean. Knob-glyph colors (sun text-amber-900 / moon text-slate-700) intentionally kept — content-on-colored-knob contrast, not theme chrome, not in the grep target set."
  - "VisitorCounter.tsx (bg-slate-900/80 dark-only chrome, mounted on homepage) is OUT of Phase-5 scope — last edited in pre-Phase-3 commit b8bc111, not in the VIS-06 enumerated set, not claimed by any 05-0x plan. Logged to deferred-items.md for Phase 6 rather than auto-fixed (SCOPE BOUNDARY: only fix issues caused by this plan's changes)."
  - "Lighthouse simulated LCP (15.6s here, 22.7s in 05-01) is a stable, reproducible ANIMATION ARTIFACT, not a user-perceived paint. Reported the trace-OBSERVED LCP (1360ms) + CLS (0) as the load-bearing signals; the simulated number is documented transparently, never used to claim pass/fail. Real-device field LCP confirmation belongs to the milestone-end preview deploy."
  - "Human-verify checkpoint AUTO-APPROVED on headless evidence (auto_advance + _auto_chain_active both true). The owner's live visual both-theme/reduced-motion/keyboard pass happens at the Phase-6 milestone-end preview deploy; this gate collected maximum machine-verifiable evidence (gates, smoke, LH, both-theme CSS, code-verified mechanisms)."

patterns-established:
  - "Pattern: a phase-final verification plan owns shared-state reconciliation — recalc completed_plans from the on-disk SUMMARY count, fix counter drift left by parallel executors, mark the phase Complete in ROADMAP, and align requirement checkboxes."
  - "Pattern: the SHIP-01 gate is the safety net for parallel waves that skip npm run build — run it wave-final and treat any failure as a Rule-1 bug to auto-fix before the checkpoint."

requirements-completed: [PERF-02, SHIP-01]

# Metrics
duration: 9 min
completed: 2026-06-12
---

# Phase 5 Plan 9: SHIP-01 Verification Gate + Phase-Final Reconciliation Summary

**The Phase-5 SHIP-01 gate run green with verbatim evidence (tsc 29-error baseline unchanged, lint 93 baseline unchanged, build 50/50, bundle-gate/content-diff/contrast-check all exit 0, src/ glass-literal sweep clean) — catching and auto-fixing two regressions the parallel skip-build mandate had let slip (a /blog server-component prerender crash + the last ThemeToggle glass literal), with all 17 routes smoked HTTP-200 + both data-theme palettes confirmed in served CSS, honest Lighthouse evidence (CLS=0, observed LCP 1360ms ≤ 2.5s; simulated 15.6s documented as the same animation artifact 05-01 characterized), and Phase 5 reconciled to complete.**

## Performance

- **Duration:** ~9 min
- **Started:** 2026-06-12T07:15:31Z
- **Completed:** 2026-06-12T07:25:29Z
- **Tasks:** 1 auto (full gate) + 1 checkpoint (human-verify, auto-approved on evidence)
- **Files modified:** 2 source (blog, ThemeToggle) + 3 planning artifacts (summary, LH JSON, deferred-items)

## Accomplishments

### Task 1 — Full automated gate (VERBATIM results)

| Gate | Command | Result |
|------|---------|--------|
| **tsc** | `npx tsc --noEmit` | **29 errors, ALL baseline** — 11 in 4 api/* files + 18 in expertise/page.tsx (Phase-6-owned); **0 new** in any Phase-5 file. Count + file-set identical to the documented baseline. |
| **lint** | `npm run lint` | **93 problems** (down from the Phase-3 baseline of 96 — 05-03's motion-v12 rewrites cleaned 3); every one a pre-existing `no-unescaped-entities`/`no-unused-vars`/`no-explicit-any`/`no-img-element` pattern git-blaming to pre-Phase-3 `b8bc111`. **0 new** problems on any Phase-5-upgraded file (HeroScene/HeroParticles/SceneCanvas/ClientScene/ScenePoster/Hero3D/ScrollReveal/InteractiveButton/InteractiveGlobe/IdeaNetworkCanvas/Navigation/ThemeToggle/FundMeWidget/AnimatedIcons/Footer/FAQ all lint-clean). |
| **build** | `npm run build` | **exit 0** — Compiled in 6.5s, **50/50 static pages generated**, /blog prerenders, 12 /projects/[id] slugs SSG, /ai-engineering + /scene-harness static. (First failed with a /blog crash — fixed, see Deviations.) |
| **bundle-gate** | `node scripts/bundle-gate.mjs` | **exit 0** — "three confined to canvas routes [/page, /scene-harness/page] across 38 routes". Manifest: **0 three/fiber/drei eager chunks on /page** (9 chunks, none three). Homepage 172 kB First Load vs text routes 103-106 kB confirms route-split. |
| **content-diff** | `node scripts/content-diff.mjs` | **exit 0** — "zero deletions, all entries preserved". |
| **contrast-check** | `node scripts/contrast-check.mjs` | **exit 0** — all text-role tokens meet WCAG AA in BOTH themes (dark/light). |
| **residual-literal sweep** | grep `bg-white/[0`, `border-white/[0`, slate chrome, accent rgba | **CLEAN** after 2 fixes — 0 glass literals remain in all of src/; the named accent rgba (`rgba(96,165,250`, `rgba(139,92,246`) absent from InteractiveGlobe + IdeaNetworkCanvas (already tokenized in 05-02). |

### Task 2 — Smoke + LCP/CLS evidence (checkpoint, auto-approved)

**All-route smoke (prod build, `npm start` :3210):** 17 routes all **HTTP 200** — `/`, `/expertise`, `/services`, `/blog`, `/blog/ai-developer-perth`, `/blog/best-developer-perth`, `/budget`, `/team`, `/tech-stack`, `/ideas`, `/contact`, `/developer-australia`, `/fund-me`, `/ai-engineering`, and 3 project slugs (`kashmir-fund`, `n8n-automation`, `voice-ai-agent`). Content markers verified: homepage "Usama Javed" + JSON-LD; /ai-engineering MCP/NetSuite/Ollama/TechArticle (ESIA narrative); /expertise Technical Expertise + JSON-LD; /fund-me fund content; /projects/kashmir-fund Kashmir + JSON-LD.

**Both-theme palettes in served CSS** (`/_next/static/css/3e933273b1a71fb4.css`, 74,869 bytes, served on every route): `[data-theme=light]` block ships with `--bg-primary:#f8fafc`, `--bg-card:#fffc...`, `--text-primary:#0f172a`, `--border-subtle:#0f172a14`; dark `:root` ships `--bg-primary:#0a0a0f`, `--accent-blue:#60a5fa` (light `#2563eb` AA-corrected). Hard-refresh both-theme correctness structurally guaranteed.

**Hero SSR structure:** 5 sized `animate-pulse` placeholders (zero-CLS hero loading view), **0 `<canvas>` in SSR HTML**, **0 eager three `<script>`** (the only "three" SSR matches are the English word in body copy).

**Lighthouse 13.4.0 (mobile, simulate throttling, prod build, `/`):**

| Signal | Value | Source | Verdict |
|--------|-------|--------|---------|
| **CLS** | **0** | machine-verified | zero-CLS goal MET |
| **Observed LCP** | **1360 ms** | trace `observedLargestContentfulPaint` | **≤ 2.5s budget MET** |
| Observed FCP | 256 ms | trace | fast |
| Observed first paint | 145 ms | trace | fast |
| Observed load | 200 ms | trace | fast |
| Observed last visual change | 2745 ms | trace | — |
| Simulated FCP | 1.1 s | Lantern | sane |
| **Simulated LCP** | **15.6 s** | Lantern | **ANIMATION ARTIFACT — see note** |
| Performance score | 61 | (depressed by the simulated-LCP artifact) | — |

**On the simulated LCP (honest note, consistent with 05-01):** the `largest-contentful-paint-element` audit came back **null** (Lighthouse could not attribute an LCP element), all **31** network requests settle by ~2s, and the inflation tracks the perpetual WebGL frameloop + CSS animations (`animate-gradient-flow`/`ping`/`pulse`) defeating Lantern's network-and-CPU quiet-window heuristic. FCP is sane (256ms observed / 1.1s simulated); only the LCP estimate inflates. The trustworthy trace-observed signals — **observed LCP 1360ms, FCP 256ms, CLS 0** — confirm the page paints fast and stable. 05-01 saw the same pattern (observed 689ms vs simulated 22.7s); this run reproduces it (observed 1360ms vs simulated 15.6s), proving it's a stable artifact, not a real paint regression. Field LCP confirmation belongs to the milestone-end preview deploy.

**Inherently-manual judgments — MECHANISMS code-verified** (the checkpoint's reduced-motion / WebGL-disabled / off-screen-pause matrix, auto-approved on evidence):
- **Reduced-motion:** `globals.css:162` global kill switch + `useAnimationGate` `shouldAnimate = !prefersReduced && inView && tabVisible` (the one `useReducedMotion()` source).
- **Off-screen + tab-blur pause (PERF-02):** `inView` (IntersectionObserver) + `tabVisible` (visibilitychange) → `SceneCanvas` binds `frameloop` to the gate (`paused = !shouldAnimate || prefersReduced`, line 67) — the WebGL loop STOPS off-screen/background-tab.
- **WebGL-disabled fallback:** `ClientScene` wires `isWebGLAvailable` + `IslandBoundary fallback={<ScenePoster/>}` + dynamic `ssr:false` loading poster — no white-screen on no-WebGL/context-loss.
- **Theme-reactive scenes:** `HeroScene` colors flow from `useThemeColors` → `THREE.Color` (reconcile on `data-theme`, no remount).

## Task Commits

1. **Task 1 fix A — /blog server-component prerender crash** - `a193dc0` (fix) — `src/app/blog/page.tsx`
2. **Task 1 fix B — ThemeToggle residual glass literal** - `ba2e79e` (fix) — `src/components/ThemeToggle.tsx`

**Plan metadata:** see final docs commit (SUMMARY + STATE + ROADMAP + REQUIREMENTS + deferred-items + LH JSON).

_No per-task feature commits — this is a verification-only plan; the two commits are Rule-1 bug fixes the gate surfaced._

## Files Created/Modified
- `src/app/blog/page.tsx` (modified) — removed 4 illegal `onMouseEnter`/`onMouseLeave` handlers from the server-rendered category buttons + post-grid articles; replaced with pure-CSS Tailwind arbitrary hover variants. Restores `/blog` prerender.
- `src/components/ThemeToggle.tsx` (modified) — pill track `bg-white/[0.04] border-white/[0.1]` → `var(--bg-card)`/`var(--border-subtle)` (theme-aware), hover `var(--border-hover)`; backdrop-blur + animated track-fill preserved. The last src/ glass literal, now clean.
- `.planning/phases/05-component-upgrades/05-09-lighthouse-home.json` (created) — full Lighthouse 13 mobile prod-build report for `/`.
- `.planning/phases/05-component-upgrades/deferred-items.md` (created) — VisitorCounter out-of-scope residual + the tsc/lint baselines, all flagged for Phase 6.

## Decisions Made
See `key-decisions` frontmatter. Headlines: the /blog crash + ThemeToggle literal were Rule-1 fixes the skipped-build parallel waves let slip (the gate is the net that caught them); VisitorCounter is out-of-scope (deferred, not fixed); the simulated LCP is an honestly-documented artifact (observed LCP + CLS are the load-bearing signals); checkpoint auto-approved on evidence with the owner's live visual pass deferred to the milestone preview deploy.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] /blog server-component prerender crash (onMouseEnter/Leave on a server page)**
- **Found during:** Task 1 (`npm run build` — first run failed)
- **Issue:** 05-08's token pass added inline `onMouseEnter`/`onMouseLeave` style-mutation handlers (lines 203-204, 222-223) to `/blog`, which is a **server component** (exports `metadata`, no `"use client"`). Server components cannot pass event handlers to client/DOM props → `next build` prerender of `/blog` crashed with "Event handlers cannot be passed to Client Component props", exiting the build. 05-08 skipped `npm run build` per the parallel mandate, so it slipped through.
- **Fix:** Replaced the 4 JS handlers with pure-CSS Tailwind arbitrary hover variants (`hover:[background:var(--bg-card-hover)] hover:[border-color:var(--border-hover)]`) — identical token-driven hover visuals, no client boundary needed. Swept all 8 server pages (projects/[id], expertise, services, tech-stack, developer-australia, blog, blog/*) → all now have 0 event handlers.
- **Files modified:** `src/app/blog/page.tsx`
- **Verification:** `npm run build` → exit 0, 50/50 static pages, /blog prerenders.
- **Committed in:** `a193dc0`

**2. [Rule 1 - Bug / VIS-06 conformance] Last residual glass literal on the ThemeToggle pill track**
- **Found during:** Task 1 (residual-literal grep sweep)
- **Issue:** `ThemeToggle.tsx:45` still carried `bg-white/[0.04] border-white/[0.1]` — the ONLY remaining `bg-white/[0 | border-white/[0` glass literal in all of src/. The VIS-06 grep gate explicitly targets these in upgraded files; ThemeToggle was upgraded in 05-04 but the pill track was left.
- **Fix:** Tokenized to `var(--bg-card)`/`var(--border-subtle)` (background + border via `style`), hover `var(--border-hover)`; `backdrop-blur-md` + the animated `motion.div` track-fill overlay preserved (frosted look intact, now correct in both themes). Knob-glyph colors (`text-amber-900` sun / `text-slate-700` moon) intentionally retained — content-on-colored-knob contrast, not theme chrome, not in the grep target set.
- **Files modified:** `src/components/ThemeToggle.tsx`
- **Verification:** src/ glass-literal sweep now fully clean; tsc + lint clean on ThemeToggle; build green 50/50.
- **Committed in:** `ba2e79e`

### Out-of-scope discoveries (logged, NOT fixed)

- **VisitorCounter.tsx** (`bg-slate-900/80` dark-only chrome, homepage-mounted) — out of Phase-5 scope (last edited pre-Phase-3 `b8bc111`, not in the VIS-06 set, unclaimed by any 05-0x plan). Logged to `deferred-items.md` for Phase 6 per the SCOPE BOUNDARY rule.

---

**Total deviations:** 2 auto-fixed (both Rule 1 - Bug; #2 doubles as VIS-06 grep-gate conformance) + 1 out-of-scope item deferred.
**Impact on plan:** Both fixes were essential — #1 is the difference between a passing and a crashing build (the gate's entire purpose), #2 closes the last residual literal so the VIS-06 grep gate is genuinely clean. No scope creep: the verification-only mandate held, and the one tempting out-of-scope item (VisitorCounter) was correctly deferred rather than fixed.

## Issues Encountered
- **`npm run build` crashed on first run** (`/blog` server-component prerender) — root-caused to 05-08's onMouseEnter handlers and fixed (Deviation #1). This is exactly the regression the wave-final gate exists to catch after parallel waves skip `npm run build`.
- **MSYS `/tmp` vs Node `os.tmpdir()` path mismatch** reading the Lighthouse JSON (same as 05-01) — resolved with `cygpath -w`. Cosmetic.
- **Lighthouse simulated LCP inflated to 15.6s** by the always-on frameloop defeating Lantern's quiet-window (LCP-element null, 31 reqs settle ~2s) — resolved by reporting the trace-observed LCP (1360ms) + CLS (0) as the trustworthy signals; documented honestly. Reproduces 05-01's pattern, confirming a stable artifact not a regression.
- **Shared-state drift:** STATE.md had `completed_plans: 25` but `current_plan: 05-04` (stale), and ROADMAP showed Phase 5 plans 07/08/09 unchecked + "0/10 Not started". Reconciled from the on-disk SUMMARY count (9 → 10 after this plan's docs commit).
- Windows CRLF line-ending warnings on commit — cosmetic.

## Known Stubs
None. This is a verification + reconciliation plan; the two source edits are bug fixes (removed illegal handlers / tokenized a literal), no new hardcoded empty/placeholder values introduced. Full src/ stub/glass-literal sweep is clean.

## User Setup Required
None — no external service configuration required. (The owner's live visual both-theme/reduced-motion/keyboard verification happens at the Phase-6 milestone-end preview deploy, per SHIP-02; this gate collected maximum machine-verifiable evidence in its place.)

## Next Phase Readiness
- **Phase 5 is COMPLETE** (10/10 plans). All VIS-01..07, PERF-01..04, and the cross-cutting SHIP-01 gate are green and reconciled. Every component + all 12 page surfaces are token-conformant in both themes; the signature WebGL hero is route-split, zero-CLS, fast-observed-LCP.
- **Phase 6 (Hardening & Ship)** picks up the deferred debt: re-enable strict build (`ignoreBuildErrors`/`ignoreDuringBuilds` → false) and clear the 29 tsc + 93 lint baseline problems (`deferred-items.md`), tokenize VisitorCounter, fix FIX-01/FIX-02 (test-openai key exposure + VisitorTracker throttling), add VIS-08 View Transitions, then the owner-approved production deploy (SHIP-02) — at which point the live visual both-theme/reduced-motion/keyboard pass (and a real-device field-LCP check) happens on the preview deploy.
- No blockers.

## Self-Check: PASSED

All claims verified:
- Files present: `05-09-SUMMARY.md`, `05-09-lighthouse-home.json`, `deferred-items.md`, `src/app/blog/page.tsx`, `src/components/ThemeToggle.tsx`.
- Both fix commits found in git history: `a193dc0` (fix /blog prerender), `ba2e79e` (fix ThemeToggle glass literal).
- Gates re-confirmed green: tsc 29 baseline (0 new), lint 93 baseline (0 new on Phase-5 files), build 50/50 exit 0, bundle-gate exit 0, content-diff exit 0, contrast-check exit 0, src/ glass-literal sweep clean.
- Smoke: 17 routes HTTP 200; both data-theme palettes in served CSS; 0 eager three on /page; CLS 0 + observed LCP 1360ms (Lighthouse).

---
*Phase: 05-component-upgrades*
*Completed: 2026-06-12*
