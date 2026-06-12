---
phase: 2
slug: append-ai-content
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-12
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This repo has NO unit-test framework (deferred to V2-04). Validation = the
> Phase-1 content-diff gate + tsc + lint + build + count assertions + grep gate + curl smoke.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | NONE (no vitest/jest; deferred to V2-04) — gate-based validation |
| **Config file** | none — `scripts/content-diff.mjs` + `baseline.json` exist from Phase 1 |
| **Quick run command** | `node scripts/content-diff.mjs` (zero-deletion gate, <1s) |
| **Full suite command** | `node ./node_modules/typescript/bin/tsc --noEmit && npm run lint && npm run build && node scripts/content-diff.mjs` |
| **Estimated runtime** | ~30-60 seconds (build-dominated) |

> Compiler gotcha: use `node ./node_modules/typescript/bin/tsc --noEmit` — `npx tsc` resolves to an unrelated global (Phase-1 deviation).

---

## Sampling Rate

- **After every task commit:** Run `node scripts/content-diff.mjs` (must stay green) + `tsc --noEmit` on touched files.
- **After every plan wave:** Run the full suite (tsc + lint + build + diff).
- **Before `/gsd:verify-work`:** Full suite green + grep gate clean + count assertions verified + both-theme smoke.
- **Max feedback latency:** ~60 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | AICON-04 | type + shape | `node ./node_modules/typescript/bin/tsc --noEmit src/content/projects.ts` | ✅ | ⬜ pending |
| 2-01-02 | 01 | 1 | SEO-02 | diff gate | `node scripts/content-diff.mjs` | ✅ | ⬜ pending |
| 2-02-01 | 02 | 1 | AICON-05 | diff gate | `node scripts/content-diff.mjs` | ✅ | ⬜ pending |
| 2-02-02 | 02 | 1 | SEO-02 | type | `node ./node_modules/typescript/bin/tsc --noEmit src/app/layout.tsx` | ✅ | ⬜ pending |
| 2-03-01 | 03 | 1 | AICON-03 | type + theme grep | `node ./node_modules/typescript/bin/tsc --noEmit src/components/AiBridgeDiagram.tsx` | ✅ | ⬜ pending |
| 2-03-02 | 03 | 1 | AICON-01/02, SEO-02 | type | `node ./node_modules/typescript/bin/tsc --noEmit src/app/ai-engineering/page.tsx` | ✅ | ⬜ pending |
| 2-03-03 | 03 | 1 | AICON-01 | type | `node ./node_modules/typescript/bin/tsc --noEmit src/components/Navigation.tsx` | ✅ | ⬜ pending |
| 2-04-01 | 04 | 2 | SHIP-01, AICON-06, SEO-02 | full suite + grep | `tsc --noEmit && npm run lint && node scripts/content-diff.mjs && npm run build && rg -i "horizon|interview" src/` | ✅ | ⬜ pending |
| 2-04-02 | 04 | 2 | SEO-02 | curl smoke | `curl -s http://localhost:3000/ai-engineering` + sitemap + detail routes | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

No Wave-0 scripts needed: the zero-deletion gate (`scripts/content-diff.mjs`) and reference snapshot (`.planning/phases/01-content-centralization/baseline.json`) were built in Phase 1 and run green now. Confirmed: `content-diff: zero deletions, all entries preserved`. The gate already tolerates additions (membership-not-count; `numberOfItems` checked as `>=`).

---

## Count Assertions (before -> after)

| Surface | Before | After | Source of truth |
|---------|--------|-------|-----------------|
| keyed map / detail routes | 7 | **12** | `projects.ts` map keys; build manifest |
| home grid cards | 6 | **11** | `homeGridProjects.length` |
| JSON-LD ItemList | 6 | **7** | `itemListProjects.length` === `numberOfItems` (seo.ts) |
| sitemap `/projects/` URLs | 7 | **12** | `sitemapProjects.length`; `/sitemap.xml` |
| skill groups | 4 | **4 + AI groups** | `skills.ts` length |
| content-diff gate | green | **green** | `node scripts/content-diff.mjs` |
| Horizon/interview in src/ | (n/a) | **0 matches** | `rg -i "horizon|interview" src/` |

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Both-theme rendering of /ai-engineering + diagram | SHIP-01 | Theme correctness is a CSS-var/`data-theme` visual property; not curl-assertable | `npm run start`, open /ai-engineering, toggle theme, confirm diagram + text adapt and stay readable in dark AND light |
| Home grid + skill groups visual (no % bars) | AICON-05 | Visual layout assertion | Open /, confirm 11 cards + AI skill groups as dot+text lists |

*Curl smoke provides 200-status + substring evidence; the owner checkpoint (auto-approved on that evidence) covers theme correctness.*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none — Phase-1 gate handles it)
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-06-12
