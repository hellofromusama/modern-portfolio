---
phase: 02-append-ai-content
plan: 01
subsystem: content
tags: [ai-projects, mcp, ollama, netsuite, langgraph, n8n, json-ld, sitemap, seo]

# Dependency graph
requires:
  - phase: 01-content-centralization
    provides: "Keyed projects map + projectList/getProject + homeGrid/itemList/sitemap projections + buildItemListSchema + content-diff zero-deletion gate"
provides:
  - "5 new AI Project entries in the centralized keyed map (mcp-netsuite-ollama-bridge flagship + 4 others)"
  - "Grown projections: detail 7->12, home grid 6->11, sitemap 7->12, JSON-LD ItemList 6->7"
  - "numberOfItems bumped 6->7 to stay === itemListProjects.length"
  - "5 new /projects/<slug> routes ready to materialize via generateStaticParams (Phase 1 wiring)"
affects: [02-04, ai-engineering-page, navigation, build-verification, sitemap, json-ld]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Append-only content growth: new map entries + explicit id appends to hand-listed projections; existing entries untouched (content-diff gate enforces zero deletions)"
    - "Manual-discipline invariant: seo.ts numberOfItems literal MUST equal itemListProjects.length; bumped in lockstep with the array"
    - "Curated high-signal ItemList: only the production flagship (MCP bridge) joins JSON-LD; personal/architecture projects appear in grid + sitemap only"

key-files:
  created: []
  modified:
    - "src/content/projects.ts - 5 AI entries appended to map + ids appended to all 3 projections"
    - "src/content/seo.ts - numberOfItems 6->7 + stale comment corrected"

key-decisions:
  - "Only mcp-netsuite-ollama-bridge added to itemListProjects (curated high-signal ItemList per orchestrator decision); other 4 in grid + sitemap only"
  - "longDescription for the MCP flagship framed Problem -> Architecture -> Trade-offs -> Impact per plan; personal/architecture projects describe capability and design intent, no fabricated production metrics"
  - "Sitemap priorities: 0.8 for production/work (MCP bridge, n8n workflows), 0.7 for personal/architecture (LinkedIn agent, social generator, healthcare voice agent)"

patterns-established:
  - "Append-only projection growth keeps the content-diff gate green while surfacing new content across detail/grid/sitemap/JSON-LD from one source"
  - "numberOfItems literal kept === itemListProjects.length (research Pitfall 1 — diff gate only enforces >=, so under-count must be caught manually)"

requirements-completed: [AICON-04, SEO-02, SHIP-01]

# Metrics
duration: 12min
completed: 2026-06-12
---

# Phase 02 Plan 01: Append AI Content Summary

**Five new AI projects (MCP NetSuite-Ollama bridge flagship + LinkedIn agent, self-learning social generator, n8n marketing workflows, healthcare voice-agent architecture) appended to the centralized content source, growing detail/grid/sitemap/JSON-LD projections with zero changes to the existing 7 entries.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-06-12T01:55Z (approx)
- **Completed:** 2026-06-12T02:08Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Appended 5 fully-populated AI Project entries (12 detail fields + 4 grid fields each; MCP flagship additionally carries seoName/seoDescription/applicationCategory) inside the keyed map without touching any of the 7 baseline entries.
- Grew all three hand-listed projections: homeGridProjects 6->11, sitemapProjects 7->12, itemListProjects 6->7 (MCP flagship only); detail map 7->12.
- Bumped seo.ts numberOfItems 6->7 to stay exactly equal to itemListProjects.length, satisfying the JSON-LD ItemList invariant.
- content-diff stayed green (zero deletions) across both task commits; tsc reports no errors originating in projects.ts or seo.ts.

## Task Commits

Each task was committed atomically (--no-verify, own files staged explicitly per parallel-execution rules):

1. **Task 1: Append the 5 AI Project entries to the keyed map** - `911e51a` (feat)
2. **Task 2: Append ids to the 3 projections + bump numberOfItems 6->7** - `b91e163` (feat)

## Files Created/Modified
- `src/content/projects.ts` - 5 new AI entries appended to the `satisfies Record<string, Project>` map; their ids appended to homeGridProjects (all 5), sitemapProjects (all 5, with priorities), and itemListProjects (MCP flagship only).
- `src/content/seo.ts` - numberOfItems literal bumped 6->7; stale "stays literal 6" comment corrected to document the lockstep invariant with itemListProjects.length.

## Decisions Made
- Curated ItemList: only `mcp-netsuite-ollama-bridge` joins the JSON-LD ItemList; the four personal/architecture projects appear in the home grid and sitemap but not the high-signal schema (per orchestrator decision noted in the plan).
- Content grounded strictly in the plan's verified facts: the MCP flagship's longDescription follows Problem -> Architecture -> Trade-offs -> Impact and uses the exact 6-step loop, v1/v2 split, three production challenges, and three fixes from the plan; personal/architecture projects describe capability and design intent rather than invented metrics (technical audience).
- Sitemap priorities assigned 0.8 (production/work) vs 0.7 (personal/architecture) matching sitemapPriority on the entries.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected stale comment in seo.ts**
- **Found during:** Task 2 (numberOfItems bump)
- **Issue:** The seo.ts header comment asserted "numberOfItems stays the literal 6 ... even if later waves append projects" — directly contradicting the plan-mandated bump to 7 and the invariant numberOfItems === itemListProjects.length. Leaving it would mislead future editors into reverting the count.
- **Fix:** Rewrote the comment to document that numberOfItems is a manual literal that MUST equal itemListProjects.length, bumped 6->7 in lockstep with the ItemList in Phase 02.
- **Files modified:** src/content/seo.ts
- **Verification:** content-diff green; numberOfItems value verified === 7 === itemListProjects.length via source-count check.
- **Committed in:** `b91e163` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 doc-correctness bug)
**Impact on plan:** Comment-only correction keeping documentation consistent with the mandated code change. No scope creep; no behavior change.

## Issues Encountered
- A runtime count-verification script using `node --input-type=module` against the .ts files failed on extensionless ESM import resolution (`projects` not found from `seo.ts`). Resolved by verifying projection counts via regex over the source files instead — confirmed homeGrid 11 / itemList 7 / sitemap 12 / numberOfItems 7, MCP present in ItemList. This is a tooling quirk, not a code defect; tsc and content-diff both pass.

## Known Stubs
None. All 5 entries are fully populated with real, plan-verified content and are wired into the live consumers via the projection arrays. No empty/placeholder data flows to any UI.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The 5 new slugs exist as map keys and are now in the sitemap + grid + (flagship) ItemList projections. They will materialize as `/projects/<slug>` detail routes via the Phase 1 generateStaticParams wiring at build time (verified in 02-04's build gate).
- Parallel plans 02-02 (skills/layout) and 02-03 (AiBridgeDiagram/ai-engineering/Navigation) own disjoint files; no contention. 02-02 has already landed (`2994493`).
- numberOfItems === itemListProjects.length invariant restored at 7 — future appends to the ItemList must bump both together.

## Self-Check: PASSED

- FOUND: .planning/phases/02-append-ai-content/02-01-SUMMARY.md
- FOUND: commit 911e51a (Task 1)
- FOUND: commit b91e163 (Task 2)
- FOUND: mcp-netsuite-ollama-bridge slug in src/content/projects.ts
- FOUND: numberOfItems: 7 in src/content/seo.ts

---
*Phase: 02-append-ai-content*
*Completed: 2026-06-12*
