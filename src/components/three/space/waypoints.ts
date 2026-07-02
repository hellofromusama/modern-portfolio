// Shared contract for the /space scroll experience (PROTOTYPE).
//
// Pure module — NO "use client". Consumed by both the R3F scene (Planet/CameraRig)
// and the plain-DOM HUD, so it must stay framework-agnostic and side-effect-free.
//
// The 5 sections are laid out along -Z with ALTERNATING lateral offsets so the
// scroll-driven camera (flying forward from CAMERA_START_Z toward CAMERA_END_Z)
// sweeps PAST each glowing planet rather than straight through it.

export interface SpaceSection {
  id: string;
  label: string;
  position: [number, number, number];
  colorVar: "--accent-blue" | "--accent-violet" | "--accent-emerald";
  texture: string; // absolute /space/*.jpg diffuse map for this waypoint's body
}

export const SECTIONS: SpaceSection[] = [
  { id: "about", label: "About", position: [3, 0.5, -8], colorVar: "--accent-blue", texture: "/space/2k_earth_daymap.jpg" },
  { id: "projects", label: "Projects", position: [-4, -0.5, -28], colorVar: "--accent-violet", texture: "/space/2k_jupiter.jpg" },
  { id: "skills", label: "Skills", position: [4, 0.8, -48], colorVar: "--accent-emerald", texture: "/space/2k_mars.jpg" },
  { id: "team", label: "Team", position: [-3, -0.8, -68], colorVar: "--accent-blue", texture: "/space/2k_neptune.jpg" },
  { id: "contact", label: "Contact", position: [2, 0.3, -88], colorVar: "--accent-violet", texture: "/space/2k_moon.jpg" },
];

// ScrollControls page count — one virtual page per waypoint span.
export const SCROLL_PAGES = 5;

// Camera z-flight range (forward = decreasing z). Ends just past the last planet.
export const CAMERA_START_Z = 8;
export const CAMERA_END_Z = -95;
