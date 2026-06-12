---
phase: 01-content-centralization
plan: 02
subsystem: api
tags: [content-source, typescript-interfaces, json-ld, projections, superset, zero-deletion-gate]

# Dependency graph
requires:
  - phase: 01-01
    provides: "baseline.json (6/7/6/7/4 frozen snapshot) + content-diff.mjs zero-deletion gate"
provides:
  - "src/content/types.ts — Project (superset) + Skill + ProjectSeoItem interfaces"
  - "src/content/projects.ts — keyed 7-project map, projectList[], getProject(), and the three projections: homeGridProjects (6), itemListProjects (6), sitemapProjects (7)"
  - "src/content/skills.ts — skills[] (4 groups) verbatim"
  - "src/content/seo.ts — buildItemListSchema() emitting the JSON-LD ItemList byte-for-byte from the superset"
affects: [01-03, 01-04, 01-05, content-centralization, wave-2, consumer-repointing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Superset + named projections: ONE keyed Project map stores every consumer's fields; projections reproduce each consumer's exact divergent subset/order"
    - "Distinct field families per consumer: detail (title/description/...) vs grid* vs seo* vs sitemapPriority — never reused across consumers"
    - "Builder reads the superset: buildItemListSchema() maps itemListProjects + per-project seo* fields rather than re-stating curated copy"
    - "Keyed object (`const projects = {`) as the canonical store so both detailKeys regex AND O(1) getProject are satisfied; `Object.values` yields the ordered array"

key-files:
  created:
    - src/content/types.ts
    - src/content/projects.ts
    - src/content/skills.ts
    - src/content/seo.ts
  modified:
    - scripts/content-baseline.mjs

key-decisions:
  - "Stored projects as a keyed map (slug -> Project) instead of a bare array: gives O(1) getProject and satisfies the diff gate's detailKeys regex (`^  \"slug\": {`), while `projectList = Object.values(projects)` exposes the ordered 7-array the plan asked for"
  - "sitemapProjects has 7 entries (not the plan prose's '8') — built from the verified baseline.json / live sitemap.ts; the '8' was a known plan typo corrected in Wave 0"
  - "buildItemListSchema() reads itemListProjects + each project's seo* fields (per the plan must_have / key_link) rather than carrying duplicate curated literals in seo.ts"
  - "Extended content-baseline.mjs extractItemList() to a dual-SHAPE extractor so the gate follows the curated ItemList copy to its new home (projects.ts) under the builder pattern — strict byte comparison against baseline preserved"

patterns-established:
  - "Wave 2 consumers import named projections (homeGridProjects, itemListProjects, sitemapProjects, getProject, projectList, skills, buildItemListSchema) — they must NOT re-derive subsets, the divergence is already encoded"
  - "The zero-deletion gate is dual-source AND dual-shape: it reads literal blocks (page files) OR reconstructs from the centralized superset (builder modules)"

requirements-completed: [FOUND-01]

# Metrics
duration: 8min
completed: 2026-06-12
---

# Phase 01 Plan 02: Content Centralization — Single Typed Source Summary

**A single `src/content/` module: one keyed 7-project superset (detail + grid* + seo* + sitemapPriority, all verbatim) plus named projections that reproduce each consumer's exact divergent output (6 grid / 7 detail / 6 itemList / 7 sitemap), the 4 skill groups, and a buildItemListSchema() that emits the JSON-LD ItemList byte-for-byte — zero new deps, content-diff gate green.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-06-12T01:14:12Z
- **Completed:** 2026-06-12T01:22:39Z
- **Tasks:** 2
- **Files modified:** 4 created, 1 modified

## Accomplishments
- Centralized all 7 projects into one keyed `Project` map carrying the SUPERSET of every consumer's fields, each literal copied byte-for-byte from the original source files.
- Encoded the deliberate 6/7/6/7 divergence as three named projections (`homeGridProjects`, `itemListProjects`, `sitemapProjects`) plus `getProject`/`projectList`, so no consumer's output changes when Wave 2 repoints them.
- Built `buildItemListSchema()` that reconstructs the JSON-LD ItemList from the superset and emits it byte-identically (verified at runtime via transpile: 6 items, correct names/urls/applicationCategory/author, correct wrapper).
- Centralized the 4 homepage skill groups verbatim.
- Kept the zero-deletion gate green (exit 0, 6/7/6/7/4 reproduced) by extending its ItemList extractor to follow the curated copy into the new builder-shaped module.

## The Project interface (field families)

`Project` is the superset; each family maps to ONE consumer and is never reused across consumers:

| Family | Fields | Source | Consumer |
|--------|--------|--------|----------|
| Identity | `id` | all | all |
| Detail | `title, subtitle, description, longDescription, tech[], category, timeline, team, features[], challenges[], results[], gradient, liveUrl?` | projects/[id]/page.tsx | project detail page |
| Grid | `gridTitle?, gridDescription?, gridTech?[], gridCategory?` | page.tsx | home grid (6; modern-portfolio has none) |
| SEO | `seoName?, seoDescription?, applicationCategory?` | layout.tsx ItemList | JSON-LD (6; kashmir-fund has none) |
| Sitemap | `sitemapPriority?` | sitemap.ts | sitemap |

Also exported: `Skill { title; accent: 'blue'\|'violet'\|'emerald'\|'amber'; items[] }`, `ProjectSeoItem`, `ApplicationCategory` union.

## Projection export names + exact id lists/order (for Wave 2)

Wave 2 consumer-repointing plans MUST import these names — the subsets/order are already correct:

- **`projectList: Project[]`** — all 7, detail-map order: `[kashmir-fund, n8n-automation, voice-ai-agent, erp-system, netsuite-integration, modern-portfolio, cloud-infrastructure]`.
- **`getProject(id): Project | undefined`** — O(1) resolver for any of the 7 ids.
- **`homeGridProjects: Project[]`** — 6, NO modern-portfolio: `[kashmir-fund, n8n-automation, voice-ai-agent, erp-system, netsuite-integration, cloud-infrastructure]`.
- **`itemListProjects: Project[]`** — 6, NO kashmir-fund, curated JSON-LD order: `[n8n-automation, voice-ai-agent, erp-system, netsuite-integration, cloud-infrastructure, modern-portfolio]`.
- **`sitemapProjects: { id; priority }[]`** — 7, emitted order: n8n/voice/erp/netsuite/cloud @0.8, modern-portfolio @0.7, kashmir-fund @0.7.
- **`skills: Skill[]`** (from `src/content/skills.ts`) — 4 groups: Frontend/blue, Backend/violet, Cloud & DevOps/emerald, Specializations/amber.
- **`buildItemListSchema()`** (from `src/content/seo.ts`) — returns the full `ItemList` object: `@context/@type/@id`, name 'Usama Javed Portfolio Projects', description, `numberOfItems: 6` (literal), and `itemListElement` of 6 `ListItem`s each wrapping a `SoftwareApplication { name, description, url, applicationCategory, operatingSystem: 'Web', author: { '@id': '.../#person' } }`.

## buildItemListSchema() output shape

Byte-identical to the current `projectsListData` literal in `src/app/layout.tsx`:
- Wrapper: `'@context':'https://schema.org'`, `'@type':'ItemList'`, `'@id':'https://www.usamajaved.com.au/#projects'`, `name:'Usama Javed Portfolio Projects'`, `description:'Featured enterprise projects by Usama Javed, Senior Full Stack Developer in Perth'`, `numberOfItems: 6`.
- `itemListElement[i]`: `{ '@type':'ListItem', position: i+1, item: { '@type':'SoftwareApplication', name: p.seoName, description: p.seoDescription, url: 'https://www.usamajaved.com.au/projects/'+p.id, applicationCategory: p.applicationCategory, operatingSystem: 'Web', author: { '@id':'https://www.usamajaved.com.au/#person' } } }` over `itemListProjects`.

## Task Commits

Each task was committed atomically:

1. **Task 1: types.ts + 7-project superset (projects.ts)** - `49f6326` (feat)
2. **Task 2: projections + skills.ts + seo.ts builder + gate extension** - `9135450` (feat)

**Plan metadata:** (final docs commit)

## Files Created/Modified
- `src/content/types.ts` - Project superset interface (5 field families), Skill, ProjectSeoItem, ApplicationCategory union. Pure data, no React/JSX.
- `src/content/projects.ts` - Keyed 7-project map (verbatim), `projectList` (Object.values), `getProject`, and the 3 projections (homeGridProjects 6, itemListProjects 6, sitemapProjects 7).
- `src/content/skills.ts` - 4 skill groups verbatim from page.tsx.
- `src/content/seo.ts` - `buildItemListSchema()` emitting the ItemList byte-for-byte from itemListProjects + per-project seo* fields.
- `scripts/content-baseline.mjs` - Extended `extractItemList()` to dual-shape: reads literal blocks OR reconstructs from projects.ts seo* fields under the builder pattern. Strict byte comparison preserved.

## Decisions Made
- **Keyed map over bare array.** A `const projects = { "slug": {...} }` map gives O(1) `getProject` and satisfies the gate's `detailKeys` regex (`^  "slug": {`); `projectList = Object.values(projects)` then yields the ordered 7-array the plan specified. A bare `Project[]` would have failed the detailKeys extractor.
- **sitemapProjects = 7, not 8.** Built from the verified `baseline.json` / live `sitemap.ts`. The plan prose's "8" is the known typo corrected in Wave 0; reality wins.
- **Builder reads the superset.** `buildItemListSchema()` maps `itemListProjects` and reads each project's `seo*` fields (honoring the plan must_have and the `seo.ts -> projects.ts` key_link) instead of duplicating curated copy in seo.ts.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing project dependencies**
- **Found during:** Task 1 (running the `npx tsc --noEmit` verify gate)
- **Issue:** `node_modules` did not exist in the project; the local TypeScript compiler (and thus the plan's primary `tsc --noEmit` gate) could not run. `npx tsc` resolved to an unrelated global package.
- **Fix:** Ran `npm install` (416 packages). Verified `tsc` runs via `node ./node_modules/typescript/bin/tsc --noEmit`.
- **Files modified:** none committed (node_modules is gitignored; package.json/lock unchanged).
- **Verification:** tsc runs; the new `src/content/*` files produce zero type errors.
- **Committed in:** n/a (no tracked files changed)

**2. [Rule 3 - Blocking] Extended the zero-deletion gate to read the builder-shaped ItemList**
- **Found during:** Task 2 (running `node scripts/content-diff.mjs` after creating seo.ts)
- **Issue:** Wave 0's `extractItemList()` assumed `src/content/seo.ts` would hold the ItemList as a single-quoted literal block. The plan instead specifies a `buildItemListSchema()` BUILDER that reads the superset — so seo.ts has no literal item copy, and the gate reported all 6 ItemList entries as DELETED (false positive).
- **Fix:** Extended `extractItemList()` to dual-SHAPE: if no literal items are found in the `projectsListData` block, it reconstructs the ItemList from the centralized superset — reading the curated `seoName`/`seoDescription`/`applicationCategory` from `src/content/projects.ts` in `itemListProjects` order. Added two helpers (`extractItemListOrder`, `extractProjectSeoFields`). The curated copy compared is the SAME verbatim text, so the strict byte comparison against baseline.json is unchanged (not weakened).
- **Files modified:** scripts/content-baseline.mjs
- **Verification:** `node scripts/content-diff.mjs` exits 0; `extractAll()` reports itemList 6/6 with byte-correct name/description/url/applicationCategory (n8n first, modern-portfolio last); all five projections reproduce baseline 6/7/6/7/4.
- **Committed in:** 9135450 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 3 - blocking).
**Impact on plan:** No scope change. (1) was environment setup required to run the plan's own gate. (2) makes the frozen gate follow the centralized content to its new builder-shaped home exactly as Wave 0's dual-source philosophy intended; the comparison stays byte-strict. The plan's content model (superset + projections + builder) is implemented as written.

## Issues Encountered
- The home-grid `id:` text-scan in the gate now counts 14 ids (the 7 map keys + the projection `.map` arrays). Harmless: the gate checks SET membership and allows additions — all 6 baseline grid ids are present, so it passes. Resolved by confirming the gate's intent (membership, not exact count) rather than reshaping the file.
- `npx tsc` pulled an unrelated global `tsc` package; switched to the local compiler at `node_modules/typescript/bin/tsc` for the real gate.

## Known Stubs
None. Every field is real, verbatim content copied from the existing source files — no placeholders, empty defaults, or TODO data. The module is data-only and is not yet wired to any consumer (intentional: Wave 2 repoints consumers; this plan is verified by tsc + content-diff alone, per the objective).

## Pre-existing (out-of-scope) issues
Logged to `deferred-items.md`: `npx tsc --noEmit` surfaces latent type errors in unrelated files (api/ai-training, api/auto-llm-training, api/budget-estimate, api/create-checkout, expertise/page.tsx, projects/[id]/page.tsx) — these predate this plan, are masked by `typescript.ignoreBuildErrors: true`, and are NOT in scope. The new `src/content/*` module is type-clean. (The two `projects/[id]/page.tsx` `liveUrl` errors will resolve naturally in Wave 2 when that page adopts the typed `Project`.)

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The single typed content source is ready. Wave 2 plans (01-03/04/05) can repoint each consumer to import the named projections above and run `node scripts/content-diff.mjs` to prove nothing changed.
- The gate now transparently supports both literal (pre-migration page files) and builder (post-migration src/content) shapes — Wave 2 edits will keep diffing correctly.

## Self-Check: PASSED

- FOUND: src/content/types.ts
- FOUND: src/content/projects.ts
- FOUND: src/content/skills.ts
- FOUND: src/content/seo.ts
- FOUND: .planning/phases/01-content-centralization/01-02-SUMMARY.md
- FOUND commit: 49f6326 (Task 1)
- FOUND commit: 9135450 (Task 2)

---
*Phase: 01-content-centralization*
*Completed: 2026-06-12*
