# Phase 5 — Deferred Items

Out-of-scope discoveries logged during execution (NOT fixed in Phase 5 per the
SCOPE BOUNDARY rule: only auto-fix issues directly caused by the current task's
changes).

## 05-09 (Wave 6 — SHIP-01 gate)

### VisitorCounter.tsx — residual dark-only slate chrome (out of Phase-5 scope)

- **File:** `src/components/VisitorCounter.tsx:35`
- **Literal:** `bg-slate-900/80 backdrop-blur-md text-slate-300 ... border border-slate-700/50`
- **Mounted:** yes — homepage (`src/app/page.tsx:50`, dynamic import)
- **Why deferred:** VisitorCounter was last edited in the pre-Phase-3 baseline
  commit `b8bc111`; NO Phase-5 plan upgraded it. It is NOT in the VIS-06
  enumerated target set (ThemeToggle, Footer, FAQ, TeamSection, FundMeWidget,
  AnimatedIcons) and not claimed by any 05-0x plan. Its slate chrome is a
  dark-biased glass card that renders slightly off in light theme.
- **Impact:** cosmetic, low — a small fixed-corner counter widget; does not
  affect the named grep target set (`bg-white/[0`, `border-white/[0`), build,
  bundle, content, or contrast gates (all green).
- **Recommended owner:** Phase 6 (final cohesion/hardening pass) or a quick
  follow-up — tokenize to `var(--bg-card)/var(--border-subtle)/var(--text-muted)`
  to match the rest of the elevated site in both themes.

### tsc baseline (29 errors) + lint baseline (93 problems) — pre-existing, Phase-6-owned

- **tsc:** 29 errors, ALL in 5 documented baseline files
  (`api/ai-training` ×2, `api/auto-llm-training` ×7, `api/budget-estimate` ×1,
  `api/create-checkout` ×1, `expertise/page.tsx` ×18). Zero in any Phase-5 file.
- **lint:** 93 problems (down from the Phase-3 baseline of 96 — 05-03's motion-v12
  rewrites cleaned 3), all pre-existing `no-unescaped-entities` / `no-unused-vars`
  / `no-explicit-any` / `no-img-element` patterns git-blaming to pre-Phase-3
  commit `b8bc111`. Zero new problems on any Phase-5-upgraded file.
- **Owner:** Phase 6 re-enables strict build (`ignoreBuildErrors`/
  `ignoreDuringBuilds` → false) and clears this debt (per ROADMAP Phase 6 +
  REQUIREMENTS SHIP/FIX scope).
