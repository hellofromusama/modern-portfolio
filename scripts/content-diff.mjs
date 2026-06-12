// content-diff.mjs
//
// ZERO-DELETION GATE. Re-extracts the five content projections from the LIVE
// source files and compares them against the frozen baseline.json. Exits 1 on
// ANY missing or changed baseline entry; exits 0 when every baseline entry is
// still present and unchanged. ADDITIONS ARE ALLOWED (Phase 2 appends new AI
// projects/skills later) — only deletions and modifications fail.
//
// Every later migration plan (Wave 1, 2a, 2b ...) runs `node scripts/content-diff.mjs`
// after its edits to prove nothing existing was lost.
//
// DUAL-SOURCE EXTRACTION (forward-compatibility):
//   The extraction logic lives in content-baseline.mjs's extractAll(), which is
//   imported here (no duplication). extractAll() reads each projection from the
//   CENTRALIZED module first (src/content/projects.ts, src/content/skills.ts,
//   src/content/seo.ts, src/content/sitemap.ts) and FALLS BACK to the original
//   page file (src/app/page.tsx, src/app/layout.tsx, src/app/projects/[id]/page.tsx,
//   src/app/sitemap.ts) when the centralized file does not yet exist. Both paths
//   parse as TEXT regex — never importing .ts/.tsx. This is why the gate keeps
//   working before AND after Wave 1 moves the literals into src/content/*.
//
// Uses only node:fs / node:path / node:url. Zero new dependencies.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { extractAll } from "./content-baseline.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const baselinePath = join(
  ROOT,
  ".planning",
  "phases",
  "01-content-centralization",
  "baseline.json"
);
const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
const live = extractAll();

const violations = [];
const del = (what) => violations.push(`DELETED: ${what}`);
const chg = (what) => violations.push(`CHANGED: ${what}`);

// 1. homeGrid — every baseline id must still be present (additions allowed).
{
  const liveIds = new Set(live.homeGrid);
  for (const id of baseline.homeGrid) {
    if (!liveIds.has(id)) del(`homeGrid project "${id}"`);
  }
}

// 2. detailKeys — every baseline detail key must still resolve.
{
  const liveKeys = new Set(live.detailKeys);
  for (const key of baseline.detailKeys) {
    if (!liveKeys.has(key)) del(`detail map key "${key}"`);
  }
}

// 3. itemList — numberOfItems must be >= baseline; every baseline item
//    (matched by url) must still be present with byte-identical name,
//    description, applicationCategory.
{
  if (live.itemList.numberOfItems < baseline.itemList.numberOfItems) {
    chg(
      `itemList.numberOfItems dropped from ${baseline.itemList.numberOfItems} to ${live.itemList.numberOfItems}`
    );
  }
  const liveByUrl = new Map(live.itemList.items.map((i) => [i.url, i]));
  for (const item of baseline.itemList.items) {
    const found = liveByUrl.get(item.url);
    if (!found) {
      del(`itemList entry "${item.url}"`);
      continue;
    }
    for (const field of ["name", "description", "applicationCategory"]) {
      if (found[field] !== item[field]) {
        chg(
          `itemList "${item.url}" field "${field}": "${item[field]}" -> "${found[field]}"`
        );
      }
    }
  }
}

// 4. sitemapProjects — every baseline {slug, priority} must still be present
//    and unchanged.
{
  const liveBySlug = new Map(live.sitemapProjects.map((s) => [s.slug, s]));
  for (const entry of baseline.sitemapProjects) {
    const found = liveBySlug.get(entry.slug);
    if (!found) {
      del(`sitemap project "${entry.slug}"`);
      continue;
    }
    if (found.priority !== entry.priority) {
      chg(
        `sitemap "${entry.slug}" priority: ${entry.priority} -> ${found.priority}`
      );
    }
  }
}

// 5. skills — every baseline group title + its items must still be present
//    unchanged (order within a group preserved).
{
  const liveByTitle = new Map(live.skills.map((g) => [g.title, g]));
  for (const group of baseline.skills) {
    const found = liveByTitle.get(group.title);
    if (!found) {
      del(`skills group "${group.title}"`);
      continue;
    }
    for (const item of group.items) {
      if (!found.items.includes(item)) {
        del(`skills item "${item}" in group "${group.title}"`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error("content-diff: FAILURES detected (existing content lost/changed):");
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}

console.log("content-diff: zero deletions, all entries preserved");
process.exit(0);
