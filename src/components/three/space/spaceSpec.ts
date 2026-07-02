// Single source of truth for the Space-Journey design (README values verbatim).
//
// Pure module — NO "use client". Consumed by both the R3F scene
// (Planet/CameraRig/SpaceContent) and the plain-DOM HUD, so it must stay
// framework-agnostic and side-effect-free.
//
// All numeric values (planet coords/tints/radii, section anchors, camera range)
// are copied EXACTLY from the finalized Claude Design README + the prototype's
// `class Component` loop. Do not re-derive.

export type SpaceSectionId =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "team"
  | "contact";

export interface SectionAnchor {
  id: SpaceSectionId;
  /** Nav label (Hero has no nav link — empty label). */
  label: string;
  /** Scroll anchor t in 0..1 — the "arrival" point along the dive. */
  anchor: number;
  /** World position [wx, 1, wz] where wz = (30 + anchor*-262) - 34. */
  position: [number, number, number];
}

// Section anchors along the dive. wz = (30 + anchor*-262) - 34.
export const SECTION_ANCHORS: SectionAnchor[] = [
  { id: "hero", label: "", anchor: 0.0, position: [0, 1, -4] },
  { id: "about", label: "About", anchor: 0.2, position: [5, 1, -56.4] },
  { id: "skills", label: "Skills", anchor: 0.4, position: [0, 1, -108.8] },
  { id: "projects", label: "Projects", anchor: 0.6, position: [0, 1, -161.2] },
  { id: "team", label: "Team", anchor: 0.8, position: [-5, 1, -213.6] },
  { id: "contact", label: "Contact", anchor: 1.0, position: [0, 1, -266] },
];

export interface PlanetSpec {
  id: string;
  texture: string;
  radius: number;
  position: [number, number, number];
  /** Atmosphere-shell tint (THREE hex number), or null for no atmosphere/glow. */
  tint: number | null;
  ring?: boolean;
  /** Section anchor t this body sits at (drives click-to-fly). */
  anchor: number;
}

// The 6 named bodies — EXACT README coords/tints/radii.
export const PLANETS: PlanetSpec[] = [
  { id: "neptune", texture: "/space/2k_neptune.jpg", radius: 5.0, position: [10, -5, -66], tint: 0x3a6ff0, anchor: 0.0 },
  { id: "earth", texture: "/space/2k_earth_daymap.jpg", radius: 8.2, position: [-14, 0, -34], tint: 0x5a9bff, anchor: 0.2 },
  { id: "venus", texture: "/space/2k_venus_surface.jpg", radius: 2.4, position: [12, 6, -78], tint: 0xe8c98a, anchor: 0.4 },
  { id: "moon", texture: "/space/2k_moon.jpg", radius: 1.7, position: [-12, -6, -70], tint: null, anchor: 0.4 },
  { id: "saturn", texture: "/space/2k_saturn.jpg", radius: 4.4, position: [11, 3, -186], tint: 0xd8c79a, ring: true, anchor: 0.8 },
  { id: "jupiter", texture: "/space/2k_jupiter.jpg", radius: 9.5, position: [0, -2, -262], tint: 0xe0a86a, anchor: 1.0 },
];

// Saturn ring texture (self-hosted color/alpha strip).
export const SATURN_RING_TEXTURE = "/space/2k_saturn_ring_alpha.png";

// Asteroid field (Projects stop). 8 seeded bodies cycling 3 rock textures.
export const ASTEROIDS = {
  count: 8,
  textures: ["/space/2k_mercury.jpg", "/space/2k_moon.jpg", "/space/2k_mars.jpg"],
  anchor: 0.6,
} as const;

// Camera dive range (forward = decreasing z): camZ = 30 + t*(-262) → 30 → -232.
export const CAMERA_START_Z = 30;
export const CAMERA_END_Z = -232;
// Tall scroll driver height (README 640vh spacer).
export const SCROLL_VH = 640;
// Perspective vertical FOV.
export const FOV = 60;

// Card accent cycle shared by Skills + Projects (design tokens).
export const ACCENT_CYCLE = ["#60a5fa", "#a78bfa", "#34d399", "#fbbf24"] as const;
