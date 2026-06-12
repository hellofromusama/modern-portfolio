// content-baseline.mjs
//
// One-time (re-runnable) snapshot of the FOUR divergent content sources plus
// the homepage skills into baseline.json. This is the frozen reference every
// later migration plan diffs against to prove ZERO content was lost.
//
// IMPORTANT: This script parses the source .ts/.tsx files as TEXT (regex
// extraction). It NEVER imports them. No tsx/ts-node, no new dependencies.
// Only node:fs / node:path / node:url are used.
//
// Dual-source lookup (forward-compatible with Wave 1+):
//   After Wave 1 the literals move OUT of the page files and INTO src/content/*.
//   Each extractor therefore tries the centralized module file FIRST
//   (src/content/projects.ts, src/content/skills.ts, src/content/seo.ts,
//    src/content/sitemap.ts) and FALLS BACK to the original page file when the
//   centralized file does not yet exist. Both paths extract by TEXT regex.
//   This means the SAME extractAll() drives both the baseline generator (now,
//   pre-migration) and content-diff.mjs (later, post-migration) unchanged.

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const p = (...parts) => join(ROOT, ...parts);

// Read the first source file that exists from a prioritized list.
// Returns { text, path } or throws if none exist.
function readFirst(candidates) {
  for (const rel of candidates) {
    const abs = p(...rel.split("/"));
    if (existsSync(abs)) {
      return { text: readFileSync(abs, "utf8"), path: rel };
    }
  }
  throw new Error(
    `content extraction: none of these source files exist: ${candidates.join(", ")}`
  );
}

// Slice the substring between a start marker and the first occurrence of an
// end marker that appears AFTER the start marker.
function sliceBetween(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  if (start === -1) return null;
  const after = start + startMarker.length;
  const end = text.indexOf(endMarker, after);
  if (end === -1) return null;
  return text.slice(after, end);
}

// ---------------------------------------------------------------------------
// Extractors — each returns one projection. Each tries centralized src/content/*
// first, then falls back to the original page file.
// ---------------------------------------------------------------------------

// homeGrid: ordered list of project ids from the home page projects array.
function extractHomeGrid() {
  const { text } = readFirst([
    "src/content/projects.ts",
    "src/app/page.tsx",
  ]);
  // Grab the `const projects = [ ... ];` block, then collect id: "<slug>".
  const block = sliceBetween(text, "const projects = [", "];");
  const source = block ?? text;
  const ids = [];
  const re = /id:\s*["']([a-z0-9-]+)["']/g;
  let m;
  while ((m = re.exec(source)) !== null) ids.push(m[1]);
  return ids;
}

// detailKeys: ordered top-level slug keys from the project detail map.
function extractDetailKeys() {
  const { text } = readFirst([
    "src/content/projects.ts",
    "src/app/projects/[id]/page.tsx",
  ]);
  // Limit to the `const projects = { ... }` region (up to `export default`).
  const start = text.indexOf("const projects = {");
  const end = text.indexOf("export default");
  const region =
    start !== -1
      ? text.slice(start, end !== -1 ? end : undefined)
      : text;
  const keys = [];
  const re = /^\s{2}["']([a-z0-9-]+)["']:\s*\{/gm;
  let m;
  while ((m = re.exec(region)) !== null) keys.push(m[1]);
  return keys;
}

// Helper (builder shape): ordered id list for the ItemList projection, read
// from the `export const itemListProjects ... = [ ... ].map(...)` literal in
// src/content/projects.ts. Falls back to [] if absent (literal shape in use).
function extractItemListOrder() {
  const projPath = p("src", "content", "projects.ts");
  if (!existsSync(projPath)) return [];
  const text = readFileSync(projPath, "utf8");
  const block = sliceBetween(text, "itemListProjects", ".map");
  if (block === null) return [];
  const ids = [];
  const re = /["']([a-z0-9-]+)["']/g;
  let m;
  while ((m = re.exec(block)) !== null) ids.push(m[1]);
  return ids;
}

// Helper (builder shape): per-project curated seo fields from src/content/
// projects.ts, keyed by the project's `id`. Returns { [id]: { name,
// description, applicationCategory } } for every entry that has seoName.
function extractProjectSeoFields() {
  const projPath = p("src", "content", "projects.ts");
  const out = {};
  if (!existsSync(projPath)) return out;
  const text = readFileSync(projPath, "utf8");
  // Split into per-project entries on the `id: "<slug>",` lines, then pull the
  // seo fields that follow within the same entry.
  const entryRe = /id:\s*["']([a-z0-9-]+)["']([\s\S]*?)(?=\n {2}["'][a-z0-9-]+["']:\s*\{|\n} satisfies)/g;
  let e;
  while ((e = entryRe.exec(text)) !== null) {
    const id = e[1];
    const body = e[2];
    const name = body.match(/seoName:\s*["']([^"']*)["']/);
    const description = body.match(/seoDescription:\s*["']([^"']*)["']/);
    const applicationCategory = body.match(/applicationCategory:\s*["']([^"']*)["']/);
    if (name) {
      out[id] = {
        name: name[1],
        description: description ? description[1] : "",
        applicationCategory: applicationCategory ? applicationCategory[1] : "",
      };
    }
  }
  return out;
}

// itemList: JSON-LD ItemList — numberOfItems + each item's curated fields.
//
// Dual-source / dual-shape, to survive Wave 1 centralization:
//   (a) ORIGINAL literal shape (src/app/layout.tsx, or a literal seo.ts):
//       a `const projectsListData = { ... }` block whose items carry the curated
//       name/description/url/applicationCategory as single-quoted literals in
//       document order.
//   (b) BUILDER shape (src/content/seo.ts after Wave 1): seo.ts no longer holds
//       the curated copy as literals — buildItemListSchema() maps over
//       itemListProjects and reads each project's seo* fields. In that case the
//       curated copy lives VERBATIM in src/content/projects.ts (seoName /
//       seoDescription / applicationCategory). We extract it from there, ordered
//       by the itemListProjects id list declared in projects.ts, and build the
//       same { name, description, url, applicationCategory } shape so the strict
//       byte comparison against baseline.json is unchanged.
function extractItemList() {
  const { text } = readFirst([
    "src/content/seo.ts",
    "src/app/layout.tsx",
  ]);

  const start = text.indexOf("const projectsListData = {");
  if (start === -1) {
    throw new Error("itemList: could not locate projectsListData block");
  }
  const region = text.slice(start);
  const numMatch = region.match(/numberOfItems:\s*(\d+)/);
  const numberOfItems = numMatch ? Number(numMatch[1]) : null;

  // Shape (a): try to read curated literals directly from this block.
  const items = [];
  const itemRe =
    /name:\s*'([^']*)',\s*\n\s*description:\s*'([^']*)',\s*\n\s*url:\s*'([^']*)',\s*\n\s*applicationCategory:\s*'([^']*)'/g;
  const blockEnd = region.indexOf("\n  };");
  const scope = blockEnd !== -1 ? region.slice(0, blockEnd) : region;
  let m;
  while ((m = itemRe.exec(scope)) !== null) {
    items.push({
      name: m[1],
      description: m[2],
      url: m[3],
      applicationCategory: m[4],
    });
  }

  // Shape (b): builder pattern — no literal items in seo.ts. Reconstruct the
  // ItemList from the centralized superset in projects.ts, ordered by the
  // itemListProjects id list. Strict byte comparison is preserved because the
  // curated copy in projects.ts is the SAME verbatim text.
  if (items.length === 0) {
    const order = extractItemListOrder();
    const seoBy = extractProjectSeoFields();
    for (const id of order) {
      const seo = seoBy[id];
      if (!seo) continue;
      items.push({
        name: seo.name,
        description: seo.description,
        url: `https://www.usamajaved.com.au/projects/${id}`,
        applicationCategory: seo.applicationCategory,
      });
    }
  }

  return { numberOfItems, items };
}

// Helper (builder shape): ordered { slug, priority } read from the
// `export const sitemapProjects ... = [ { id, priority }, ... ]` literal in
// src/content/projects.ts. Falls back to [] if absent (literal page shape).
function extractSitemapProjectsFromContent() {
  const projPath = p("src", "content", "projects.ts");
  if (!existsSync(projPath)) return [];
  const text = readFileSync(projPath, "utf8");
  // Slice the sitemapProjects array body, then capture each { id, priority }.
  const block = sliceBetween(text, "export const sitemapProjects", "];");
  if (block === null) return [];
  const out = [];
  const re = /id:\s*["']([a-z0-9-]+)["']\s*,\s*priority:\s*([\d.]+)/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    out.push({ slug: m[1], priority: Number(m[2]) });
  }
  return out;
}

// sitemapProjects: ordered { slug, priority } for every /projects/<slug> entry.
//
// Dual-source / dual-shape, to survive Wave 2 centralization:
//   (a) ORIGINAL literal shape (src/app/sitemap.ts pre-migration): each project
//       entry is a hand-written object literal with a `${baseUrl}/projects/<slug>`
//       url and a `priority:` field, in emitted order.
//   (b) BUILDER shape (src/app/sitemap.ts after Wave 2): the project entries are
//       produced by `sitemapProjects.map(...)` over the centralized projection —
//       no literal /projects/<slug> blocks remain in sitemap.ts. In that case the
//       slug+priority pairs live VERBATIM in src/content/projects.ts; we read them
//       from there in declared order so the strict byte comparison against
//       baseline.json (same slugs, same priorities, same order) is unchanged.
function extractSitemapProjects() {
  const { text } = readFirst([
    "src/content/sitemap.ts",
    "src/app/sitemap.ts",
  ]);
  const out = [];
  // Shape (a): each sitemap entry is an object with url + ... + priority. Capture
  // the slug from the url and the priority that follows within the same literal.
  const re =
    /\/projects\/([a-z0-9-]+)`?,[\s\S]*?priority:\s*([\d.]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push({ slug: m[1], priority: Number(m[2]) });
  }

  // Shape (b): builder pattern — no literal /projects/<slug> blocks in sitemap.ts.
  // Reconstruct from the centralized sitemapProjects projection in projects.ts.
  if (out.length === 0) {
    return extractSitemapProjectsFromContent();
  }
  return out;
}

// skills: ordered groups with title + 4 items each from the homepage skills.
function extractSkills() {
  const { text } = readFirst([
    "src/content/skills.ts",
    "src/app/page.tsx",
  ]);
  const block = sliceBetween(text, "const skills = [", "];");
  const source = block ?? text;
  const groups = [];
  // Each group: { title: "X", accent: "y", items: ["a","b","c","d"] }
  const groupRe =
    /title:\s*["']([^"']+)["'][\s\S]*?items:\s*\[([^\]]*)\]/g;
  let m;
  while ((m = groupRe.exec(source)) !== null) {
    const title = m[1];
    const items = [];
    const itemRe = /["']([^"']+)["']/g;
    let im;
    while ((im = itemRe.exec(m[2])) !== null) items.push(im[1]);
    groups.push({ title, items });
  }
  return groups;
}

// ---------------------------------------------------------------------------
// Public API: extractAll() — shared by this generator and content-diff.mjs.
// ---------------------------------------------------------------------------
export function extractAll() {
  return {
    homeGrid: extractHomeGrid(),
    detailKeys: extractDetailKeys(),
    itemList: extractItemList(),
    sitemapProjects: extractSitemapProjects(),
    skills: extractSkills(),
  };
}

// Self-asserting count guard. Protects against the source drifting since
// research (6 home / 7 detail / 6 itemList / 8 sitemap / 4 skills).
function assertExpectedCounts(b) {
  const fail = (msg) => {
    throw new Error(`content-baseline assertion failed: ${msg}`);
  };
  if (b.homeGrid.length !== 6)
    fail(`homeGrid expected 6 ids, got ${b.homeGrid.length}: ${b.homeGrid}`);
  if (b.detailKeys.length !== 7)
    fail(`detailKeys expected 7 keys, got ${b.detailKeys.length}: ${b.detailKeys}`);
  if (!b.detailKeys.includes("modern-portfolio"))
    fail(`detailKeys must include "modern-portfolio"`);
  if (b.itemList.numberOfItems !== 6)
    fail(`itemList.numberOfItems expected 6, got ${b.itemList.numberOfItems}`);
  if (b.itemList.items.length !== 6)
    fail(`itemList.items expected 6, got ${b.itemList.items.length}`);
  if (b.itemList.items.some((i) => i.url.includes("kashmir-fund")))
    fail(`kashmir-fund must be ABSENT from itemList`);
  // NOTE: The live sitemap.ts has exactly 7 /projects/<slug> entries
  // (n8n-automation, voice-ai-agent, erp-system, netsuite-integration,
  //  cloud-infrastructure, modern-portfolio, kashmir-fund). The plan's
  //  interface text said "8" but its own slug enumeration lists 7 — the
  //  verified source count is 7. The baseline snapshots reality.
  if (b.sitemapProjects.length !== 7)
    fail(`sitemapProjects expected 7 entries, got ${b.sitemapProjects.length}`);
  if (b.skills.length !== 4)
    fail(`skills expected 4 groups, got ${b.skills.length}`);
  for (const g of b.skills) {
    if (g.items.length !== 4)
      fail(`skills group "${g.title}" expected 4 items, got ${g.items.length}`);
  }
}

// Top-level guard: running this file DIRECTLY writes baseline.json.
// Importing it (from content-diff.mjs) only exposes extractAll().
const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === join(process.argv[1]);

if (isMain) {
  const baseline = extractAll();
  assertExpectedCounts(baseline);
  const outPath = p(
    ".planning",
    "phases",
    "01-content-centralization",
    "baseline.json"
  );
  writeFileSync(outPath, JSON.stringify(baseline, null, 2) + "\n", "utf8");
  console.log(
    `content-baseline: wrote ${outPath}\n` +
      `  homeGrid=${baseline.homeGrid.length} detailKeys=${baseline.detailKeys.length} ` +
      `itemList=${baseline.itemList.numberOfItems}/${baseline.itemList.items.length} ` +
      `sitemap=${baseline.sitemapProjects.length} skills=${baseline.skills.length}`
  );
}
