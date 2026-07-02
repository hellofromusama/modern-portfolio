// Generic dive-shell contract — generalized from the /space design (spaceSpec.ts).
//
// Pure module — NO "use client". Consumed by both the R3F scene (SpacePageShell /
// ShellContent, which pass planet/position data to the reused leaf components) and
// route experiences that build a stops[] config, so it must stay framework-agnostic
// and side-effect-free. This is ADDITIVE: /space keeps using spaceSpec.ts unchanged.

import type { ReactNode } from "react";

/** A planet to render at a stop, reusing the /space <Planet> leaf verbatim. */
export interface ShellPlanet {
  texture: string;
  radius: number;
  /** Atmosphere-shell tint (THREE hex number), or null for no atmosphere/glow. */
  tint: number | null;
  ring?: boolean;
}

/** One stop along the dive: a floated content panel + optional planet. */
export interface SpaceStop {
  id: string;
  /** Nav label. "" = no HUD nav link (like the hero). */
  label: string;
  /** Scroll anchor t in 0..1 — the "arrival" point along the dive. */
  anchor: number;
  /** World position of the floated panel/planet. */
  position: [number, number, number];
  /** Omit/null = no planet at this stop. */
  planet?: ShellPlanet | null;
  /** Explicit CSS width for the <Html> panel (transformed ancestor is width-less). */
  contentWidth: string;
  content: ReactNode;
}

/**
 * Standard dive maps anchor -> z to match CameraRig (spaceSpec CAMERA_START_Z=30,
 * CAMERA_END_Z=-232). Verbatim the spaceSpec anchor formula: wz = (30 + t*-262) - 34.
 */
export function anchorToPosition(anchor: number, x = 0, y = 1): [number, number, number] {
  const wz = 30 + anchor * -262 - 34;
  return [x, y, wz];
}
