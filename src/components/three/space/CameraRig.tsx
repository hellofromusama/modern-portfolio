"use client";

import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { damp } from "maath/easing";
import { CAMERA_END_Z, CAMERA_START_Z } from "./waypoints";

interface CameraRigProps {
  /** Normalized -1..1 pointer ref threaded from SpaceExperience (Hero3D pattern). */
  mouse: RefObject<{ x: number; y: number }>;
  /** When true, skip the mouse-parallax damp (scroll z is still applied). */
  paused: boolean;
}

/**
 * Scroll-driven forward camera flight. MUST render inside <ScrollControls>.
 *
 * The scroll offset (0..1) lerps the camera from CAMERA_START_Z toward
 * CAMERA_END_Z so scrolling flies the camera FORWARD (-Z) PAST the 5 planets.
 * Subtle mouse parallax nudges x/y via frame-rate-independent damping (reads the
 * cached ref only — no per-frame DOM reads). Scroll progress is mirrored to the
 * `--space-scroll` CSS var for the HUD (cheap, no React re-render). Logic-only.
 */
export default function CameraRig({ mouse, paused }: CameraRigProps) {
  const scroll = useScroll();

  useFrame((state, delta) => {
    // Scroll drives z ALWAYS (even paused/blurred) so a static frame stays coherent.
    const z = CAMERA_START_Z + (CAMERA_END_Z - CAMERA_START_Z) * scroll.offset;
    state.camera.position.z = z;

    if (!paused) {
      const m = mouse.current;
      damp(state.camera.position, "x", m.x * 1.2, 0.4, delta);
      damp(state.camera.position, "y", m.y * 0.8, 0.4, delta);
    }

    // Publish scroll progress for the DOM HUD (no re-render).
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--space-scroll", String(scroll.offset));
    }
  });

  return null;
}
