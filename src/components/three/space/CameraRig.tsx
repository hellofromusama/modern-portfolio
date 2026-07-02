"use client";

import type { RefObject } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CAMERA_END_Z, CAMERA_START_Z } from "./spaceSpec";

interface CameraRigProps {
  /** Native-scroll progress 0..1 (updated by SpaceExperience's scroll listener). */
  progress: RefObject<number>;
  /** Normalized -1..1 pointer ref threaded from SpaceExperience (Hero3D pattern). */
  mouse: RefObject<{ x: number; y: number }>;
  /** prefers-reduced-motion: kill autonomous sway, use the faster 0.5 ease. */
  reduced: boolean;
  /** Camera-tracking pointLight moved each frame (owned by the host). */
  moveLight?: RefObject<THREE.PointLight | null>;
}

/**
 * Scroll-driven forward camera dive — EXACT design math.
 *
 * An internal eased `t` chases the scroll target every frame
 * (`t += (target - t) * (reduced ? 0.5 : 0.07)`); the ease IS the smoothing, so
 * the camera position is SET directly (no extra damp). Camera flies from z=30 to
 * z=-232 with a gentle sway + mouse parallax and a straight-down-−z lookAt (clean
 * dolly, not a 360 pan). `t` is published to `--space-scroll` for the HUD.
 */
export default function CameraRig({ progress, mouse, reduced, moveLight }: CameraRigProps) {
  const tRef = useRef(0);

  useFrame((state) => {
    const target = progress.current;
    tRef.current += (target - tRef.current) * (reduced ? 0.5 : 0.07);
    const t = tRef.current;
    const time = state.clock.elapsedTime;
    const mouseX = mouse.current.x;
    const mouseY = mouse.current.y;

    // camZ = 30 + t * (-262): flies z 30 -> -232 (deeper = further along).
    const camZ = CAMERA_START_Z + t * (CAMERA_END_Z - CAMERA_START_Z);
    const camX = (reduced ? 0 : Math.sin(t * Math.PI * 2) * 1.6) + mouseX * 3.2;
    const camY = (reduced ? 1 : 1 + Math.sin(time * 0.3) * 0.4) + mouseY * 2.2;

    state.camera.position.set(camX, camY, camZ);
    state.camera.lookAt(mouseX * 2.4, 1 + mouseY * 1.8, camZ - 60);

    if (moveLight?.current) {
      moveLight.current.position.set(camX, camY, camZ - 8);
    }

    // Publish eased scroll progress for the DOM HUD (no React re-render).
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--space-scroll", String(t));
    }
  });

  return null;
}
