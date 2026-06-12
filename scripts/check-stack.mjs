// check-stack.mjs
//
// FOUND-04 SCRIPTED INSTALL GATE. Asserts the Phase-4 3D stack is present in
// package.json AND meets the minimum major-version floors — the install proof
// that survives lockfile churn AND silent major downgrades (e.g. a careless
// `npm install @react-three/fiber@8` that would break React 19).
//
// Five deps are required:
//   three            (presence only — three has no React constraint)
//   @react-three/fiber  (major >= 9 — v8 does NOT support React 19)
//   @react-three/drei   (major >= 10 — v10 is the React-19 / fiber-9 line)
//   @types/three     (presence only — devDependency)
//   motion           (major >= 12 — React-19-compatible animation lib, Phase 3)
//
// Mirrors the inline <verify> assertion in 04-01-PLAN.md Task 1 so the gate is
// re-runnable on every later Phase-4/5 plan. Exits 1 listing every offender
// (missing dep OR major below floor); exits 0 with "stack OK" otherwise.
//
// Uses only node:fs / node:path / node:url. Zero new dependencies. Node 22 ESM.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

// Strip any leading range operator (^ ~ >= > etc.) and read the first numeric
// segment as the major version. "^9.6.1" -> 9, ">=10.0.0" -> 10, "0.184.0" -> 0.
const major = (range) =>
  parseInt(String(range).replace(/^[^0-9]*/, "").split(".")[0], 10);

// [name, minMajor|null] — null = presence-only (no floor).
const REQUIRED = [
  ["three", null],
  ["@react-three/fiber", 9],
  ["@react-three/drei", 10],
  ["@types/three", null],
  ["motion", 12],
];

const violations = [];

for (const [name, floor] of REQUIRED) {
  const range = deps[name];
  if (!range) {
    violations.push(`MISSING: ${name} is not in dependencies or devDependencies`);
    continue;
  }
  if (floor !== null) {
    const maj = major(range);
    if (Number.isNaN(maj)) {
      violations.push(`UNPARSEABLE: ${name}@${range} — cannot read major version`);
    } else if (maj < floor) {
      violations.push(
        `BELOW FLOOR: ${name}@${range} (major ${maj}) — minimum major is ${floor}`
      );
    }
  }
}

if (violations.length > 0) {
  console.error("check-stack: FAILURES (3D stack missing or below version floor):");
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}

console.log(
  "stack OK:",
  REQUIRED.map(([name]) => `${name}@${deps[name]}`).join(", ")
);
process.exit(0);
