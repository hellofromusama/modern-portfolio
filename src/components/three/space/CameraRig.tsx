"use client";

import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { damp } from "maath/easing";
import { CAMERA_END_Z, CAMERA_START_Z } from "./waypoints";

interface CameraRigProps {
  /** Native-scroll progress 0..1 (updated by SpaceExperience's scroll listener). */
  progress: RefObject<number>;
  /** Normalized -1..1 pointer ref threaded from SpaceExperience (Hero3D pattern). */
  mouse: RefObject<{ x: number; y: number }>;
  /** When true, skip the mouse-parallax damp (scroll z is still applied). */
  paused: boolean;
}

/**
 * Scroll-driven forward camera flight (native-scroll variant).
 *
 * Reads the page scroll progress (0..1) from a ref and damps the camera from
 * CAMERA_START_Z toward CAMERA_END_Z so scrolling flies the camera FORWARD (-Z)
 * PAST the 5 planets. Damping gives an inertial, weighty feel. Subtle mouse
 * parallax nudges x/y. Scroll progress is mirrored to the `--space-scroll` CSS
 * var for the HUD (cheap, no React re-render). Logic-only.
 */
export default function CameraRig({ progress, mouse, paused }: CameraRigProps) {
  useFrame((state, delta) => {
    const p = progress.current;
    const targetZ = CAMERA_START_Z + (CAMERA_END_Z - CAMERA_START_Z) * p;

    // Smoothly fly the camera toward the scroll target (frame-rate-independent).
    damp(state.camera.position, "z", targetZ, 0.18, delta);

    if (!paused) {
      const m = mouse.current;
      damp(state.camera.position, "x", m.x * 1.2, 0.4, delta);
      damp(state.camera.position, "y", m.y * 0.8, 0.4, delta);
    }

    // Publish scroll progress for the DOM HUD (no re-render).
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--space-scroll", String(p));
    }
  });

  return null;
}
