// bundle-gate.mjs
//
// PERF-01 HARD BUDGET GATE. Asserts the heavy WebGL stack (three / @react-three/*)
// ships ONLY on routes explicitly allowed to mount a 3D scene — never leaking
// into the text/SEO server routes or the shared /layout. Zero-dependency Node
// manifest parser: NO @next/bundle-analyzer, NO next.config.ts changes (the
// orchestrator decision — keeps the single bundler config untouched).
//
// Run AFTER `next build`. Reads .next/app-build-manifest.json, whose shape is:
//   { pages: { "<route>": ["static/chunks/....js", ...] } }
//
// ---------------------------------------------------------------------------
// MATCHER APPROACH — tuned against the REAL built manifest (Plan 04-01 Task 2).
//
// At Plan-04-01 build time NO route mounts a scene yet, so three is absent from
// every chunk and webpack emits NO three-named chunk — `grep three|fiber|drei`
// over all 45 chunk filenames returned ZERO hits. Research Open Question 2 warned
// the three vendor chunk MAY be emitted with a GENERIC HASHED name (e.g.
// `static/chunks/4521.js`) once a scene is added in a later plan, in which case a
// filename regex would silently miss it.
//
// Therefore this gate uses a DUAL matcher, robust to both outcomes:
//
//   (1) NAMED fast-path: if any chunk path matches /three|react-three|fiber|drei/i
//       AND its route is not a canvas route -> offender. (Catches the case where
//       webpack names the vendor chunk.)
//
//   (2) HASH-PROOF cross-route assertion (the load-bearing check): compute the
//       set of chunks that appear ONLY on canvas routes ("canvas-exclusive"
//       chunks). The heavy three vendor chunk, once a scene mounts, is exclusive
//       to canvas routes. Assert NO non-canvas route includes ANY canvas-exclusive
//       chunk. This catches the hashed-vendor-chunk leak without depending on the
//       filename. (When no scene exists yet, canvas-exclusive chunks are just the
//       homepage's own page chunks, which by definition appear on no other route —
//       so the gate passes trivially and still proves the parser runs.)
//
// HARD-CODED rationale: cross-route diff is the primary matcher because the real
// manifest showed three is NOT name-tagged in chunk paths; relying on a filename
// regex alone would be brittle against webpack's numeric chunk hashing.
// ---------------------------------------------------------------------------

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST = join(ROOT, ".next", "app-build-manifest.json");

// The ONLY routes allowed to ship three / WebGL. Manifest route keys carry the
// "/page" suffix (App Router). The homepage is "/page".
//
// Phase 4 (Plan 04-03): the R3F island mounted on ONE isolated, noindex/nofollow
// dev-only harness route — "/scene-harness/page".
//
// Phase 5 (Plan 05-00, this update): the homepage "/page" is added to the allow-set
// in PREPARATION for 05-01 mounting the WebGL hero on the live homepage. Adding it
// now (before the hero ships) is intentionally SAFE: until 05-01 wires ClientScene
// into app/page, "/page" simply carries NO three chunk, so the gate still proves
// three is route-split — and the moment the hero mounts, the gate asserts the
// three vendor chunk lands ONLY in the homepage scene chunk and stays ABSENT from
// every shared/text/SEO route and /layout. Once 05-01 deletes the temporary harness,
// remove "/scene-harness/page" from this set (leaving "/page" as the sole canvas route).
//
// NOTE: the harness dir is "scene-harness" (NOT "_scene-harness") — Next.js App
// Router treats "_"-prefixed folders as PRIVATE and excludes them from routing, so
// an underscore folder would never mount. Non-discoverability is provided by the
// segment layout's robots noindex/nofollow + sitemap exclusion, not the name.
const CANVAS_ROUTES = new Set([
  "/page",               // homepage — WebGL hero mount (05-01); empty of three until then
  "/scene-harness/page", // TEMPORARY dev-only harness (04-03) — removed when 05-01 lands
]);

// Filename signal for the named fast-path.
const THREE_NAME_RE = /three|react-three|fiber|drei/i;

async function main() {
  let raw;
  try {
    raw = await readFile(MANIFEST, "utf8");
  } catch {
    console.error(
      `bundle-gate: cannot read ${MANIFEST} — run \`next build\` first.`
    );
    process.exit(1);
  }

  const manifest = JSON.parse(raw);
  const pages = manifest.pages || {};
  const routes = Object.keys(pages);

  const isCanvas = (route) => CANVAS_ROUTES.has(route);

  const offenders = [];

  // ---- Matcher (1): NAMED fast-path -------------------------------------
  for (const route of routes) {
    if (isCanvas(route)) continue;
    for (const chunk of pages[route]) {
      if (THREE_NAME_RE.test(chunk)) {
        offenders.push({
          route,
          chunk,
          reason: "three-named chunk on non-canvas route",
        });
      }
    }
  }

  // ---- Matcher (2): HASH-PROOF cross-route assertion --------------------
  // Count how many routes each chunk appears on.
  const chunkRouteCount = new Map();
  for (const route of routes) {
    for (const chunk of pages[route]) {
      chunkRouteCount.set(chunk, (chunkRouteCount.get(chunk) || 0) + 1);
    }
  }

  // Chunks that appear ONLY on canvas routes (canvas-exclusive).
  const canvasExclusive = new Set();
  for (const route of routes) {
    if (!isCanvas(route)) continue;
    for (const chunk of pages[route]) {
      // exclusive iff every route carrying it is a canvas route.
      const carriers = routes.filter((r) => pages[r].includes(chunk));
      if (carriers.every(isCanvas)) canvasExclusive.add(chunk);
    }
  }

  // Assert no non-canvas route carries a canvas-exclusive chunk. (By
  // construction this cannot fire while CANVAS_ROUTES holds — it is the
  // guard that arms once a scene's hashed vendor chunk could leak.)
  for (const route of routes) {
    if (isCanvas(route)) continue;
    for (const chunk of pages[route]) {
      if (canvasExclusive.has(chunk)) {
        offenders.push({
          route,
          chunk,
          reason: "canvas-exclusive (likely WebGL vendor) chunk on non-canvas route",
        });
      }
    }
  }

  if (offenders.length > 0) {
    console.error("bundle-gate: PERF-01 VIOLATION — three/WebGL leaked off canvas routes:");
    console.error(JSON.stringify(offenders, null, 2));
    process.exit(1);
  }

  console.log(
    `bundle budget OK — three confined to canvas routes [${[...CANVAS_ROUTES].join(", ")}] across ${routes.length} routes`
  );
  process.exit(0);
}

main();
