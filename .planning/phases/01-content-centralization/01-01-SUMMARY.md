---
phase: 01-content-centralization
plan: 01
subsystem: testing
tags: [content-integrity, regex-extraction, node-esm, json-ld, sitemap, zero-deletion-gate]

# Dependency graph
requires: []
provides:
  - "baseline.json — frozen pre-migration snapshot of all 5 content projections (6 homeGrid / 7 detailKeys / 6 itemList / 7 sitemap / 4 skills)"
  - "scripts/content-baseline.mjs — re-runnable snapshot generator exposing extractAll()"
  - "scripts/content-diff.mjs — zero-deletion gate that later waves run after edits"
  - "extractAll() — shared dual-source (src/content/* then src/app/*) text-regex extractor"
affects: [01-02, 01-03, 01-04, 01-05, content-centralization, wave-1, wave-2]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Text-regex extraction of .ts/.tsx as plain text (no tsx/ts-node, zero deps)"
    - "Dual-source lookup: centralized module first, page-file fallback"
    - "isMain guard so a module both runs (writes baseline) and imports (exports extractAll)"

key-files:
  created:
    - scripts/content-baseline.mjs
    - scripts/content-diff.mjs
    - .planning/phases/01-content-centralization/baseline.json
  modified: []

key-decisions:
  - "Corrected sitemap count from plan's stated 8 to verified live 7 (plan miscounted; its own enumeration listed 7 slugs)"
  - "Single shared extractAll() in content-baseline.mjs imported by content-diff.mjs to avoid duplicated regex logic"
  - "Additions allowed / deletions+modifications forbidden — gate only fails on lost or changed baseline entries"

patterns-established:
  - "Zero-deletion gate: every migration plan runs `node scripts/content-diff.mjs` post-edit; exit 1 blocks the loss"
  - "Dual-source extractor survives the Wave 1 file move (literals page.tsx/layout.tsx -> src/content/*)"

requirements-completed: [SEO-01, FOUND-01]

# Metrics
duration: 7min
completed: 2026-06-12
---

# Phase 1 Plan 1: Content Baseline + Zero-Deletion Gate Summary

**Frozen baseline.json snapshot (6/7/6/7/4) plus a dual-source text-regex zero-deletion gate that fails on any lost or changed existing content — zero new dependencies.**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-06-12T09:04:00Z (approx, after plan load)
- **Completed:** 2026-06-12T09:11:00Z
- **Tasks:** 2
- **Files modified:** 3 created

## Accomplishments
- Captured every existing project slug, JSON-LD ItemList entity, sitemap URL, home-grid project, and homepage skill into a committed `baseline.json` BEFORE any source edit.
- Built `content-diff.mjs`: re-extracts live sources, compares against baseline as sets, exits 1 on any deletion/modification, exits 0 with only additions. Proven via a negative test (simulated `voice-ai-agent` deletion -> exit 1).
- Established a single shared `extractAll()` extractor with dual-source lookup so the SAME logic drives both the baseline generator now and the diff gate after Wave 1 moves literals into `src/content/*`.
- Zero npm dependencies added (sources parsed as text; no tsx/ts-node).

## baseline.json shape

```
{
  homeGrid:        string[6]   // ordered project ids from src/app/page.tsx
  detailKeys:      string[7]   // ordered detail-map keys (incl. modern-portfolio)
  itemList: {
    numberOfItems: 6,
    items: [{ name, description, url, applicationCategory } x6]  // kashmir-fund ABSENT
  },
  sitemapProjects: [{ slug, priority } x7]  // modern-portfolio & kashmir-fund 0.7, rest 0.8
  skills:          [{ title, items: string[4] } x4]  // Frontend/Backend/Cloud & DevOps/Specializations
}
```

The 6/7/6/7 divergence is intentional and preserved verbatim: the home grid omits modern-portfolio, the ItemList omits kashmir-fund, the detail map and sitemap each carry their fuller sets.

## Dual-source extraction strategy (content-diff.mjs)

`extractAll()` (in content-baseline.mjs, imported by content-diff.mjs) reads each projection from the CENTRALIZED module first and FALLS BACK to the original page file when the centralized file does not yet exist:

| Projection | Centralized (tried first) | Fallback (current) |
|------------|---------------------------|--------------------|
| homeGrid | src/content/projects.ts | src/app/page.tsx |
| detailKeys | src/content/projects.ts | src/app/projects/[id]/page.tsx |
| itemList | src/content/seo.ts | src/app/layout.tsx |
| sitemapProjects | src/content/sitemap.ts | src/app/sitemap.ts |
| skills | src/content/skills.ts | src/app/page.tsx |

Both paths parse as TEXT regex (never importing .ts/.tsx), so the gate keeps working before AND after Wave 1.

## Command later plans MUST run

After any content edit, every later plan (Wave 1, 2a, 2b ...) runs:

```
node scripts/content-diff.mjs
```

Exit 0 = "zero deletions, all entries preserved". Exit 1 = an existing baseline entry was lost or changed (printed as `DELETED:`/`CHANGED:` lines) — the migration must be fixed before proceeding. To intentionally re-baseline after an approved change, re-run `node scripts/content-baseline.mjs`.

## Task Commits

1. **Task 1: content-baseline.mjs + baseline.json** - `d503eeb` (feat)
2. **Task 2: content-diff.mjs zero-deletion gate** - `aed2b2c` (feat)

**Plan metadata:** (final docs commit)

## Files Created/Modified
- `scripts/content-baseline.mjs` - Re-runnable snapshot generator; exports `extractAll()`; self-asserting counts; `isMain` guard writes baseline.json on direct run.
- `scripts/content-diff.mjs` - Zero-deletion gate; imports `extractAll()`, diffs live vs baseline.json, exit 1 on any deletion/change.
- `.planning/phases/01-content-centralization/baseline.json` - Frozen 6/7/6/7/4 reference snapshot committed before any migration.

## Decisions Made
- **Corrected sitemap count 8 -> 7.** The plan's interface prose said "8 project URLs" but its own slug list enumerated only 7 (n8n, voice-ai, erp, netsuite, cloud, modern-portfolio, kashmir-fund), and the live `src/app/sitemap.ts` has exactly 7 `/projects/<slug>` entries. The baseline must snapshot reality, so the assertion now expects 7. Documented inline in the script.
- **Shared `extractAll()`** rather than duplicating regex logic across both scripts — single source of truth, guaranteed identical extraction between baseline and diff.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Sitemap expected count was wrong (8) — corrected to verified live count (7)**
- **Found during:** Task 1 (baseline generation)
- **Issue:** The plan asserted `sitemapProjects.length === 8`, but the live `src/app/sitemap.ts` contains exactly 7 `/projects/<slug>` entries. The plan's own slug enumeration also lists only 7. An 8-assertion would make a correct baseline throw.
- **Fix:** Changed the self-assertion to expect 7, with an inline comment explaining the discrepancy; adjusted the verification command's sitemap assertion to 7 accordingly.
- **Files modified:** scripts/content-baseline.mjs
- **Verification:** `node scripts/content-baseline.mjs` writes baseline with `sitemap=7` and all other counts (6/7/6/4) match; full assert command prints `baseline OK 6/7/6/7/4`.
- **Committed in:** d503eeb (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug — corrected an inaccurate expected count to match verified source).
**Impact on plan:** No scope change. The baseline now faithfully snapshots the true content set; the 7-vs-8 was a plan typo, not a content loss. All downstream plans diff against the accurate snapshot.

## Issues Encountered
- The `isMain` guard (comparing `fileURLToPath(import.meta.url)` to `process.argv[1]`) worked correctly on Windows — direct `node scripts/content-baseline.mjs` writes the file, while `import` from content-diff.mjs only exposes `extractAll()`. No path-normalization issue arose.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The zero-deletion gate is live and proven. Wave 1 (centralizing content into `src/content/*`) can proceed: after moving the literals, run `node scripts/content-diff.mjs` to prove nothing was lost. The extractor's dual-source lookup means it will automatically read the new `src/content/*` files once they exist.
- baseline.json is committed as the frozen reference — do NOT regenerate it during a migration; only re-baseline on an approved intentional content change.

## Self-Check: PASSED

- FOUND: scripts/content-baseline.mjs
- FOUND: scripts/content-diff.mjs
- FOUND: .planning/phases/01-content-centralization/baseline.json
- FOUND: .planning/phases/01-content-centralization/01-01-SUMMARY.md
- FOUND commit: d503eeb (Task 1)
- FOUND commit: aed2b2c (Task 2)

---
*Phase: 01-content-centralization*
*Completed: 2026-06-12*
