// Stable module path kept for importers — the real spec now lives in spaceSpec.ts
// (the single source of truth for the finalized Space-Journey design). This file
// re-exports it so any lingering `./waypoints` import resolves to the new shape.
export * from "./spaceSpec";
