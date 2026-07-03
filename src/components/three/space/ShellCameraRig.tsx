"use client";

import type { RefObject } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CAMERA_END_Z, CAMERA_START_Z } from "./spaceSpec";
import { updateWarp } from "./warpState";

interface ShellCameraRigProps {
  progress: RefObject<number>;
  mouse: RefObject<{ x: number; y: number }>;
  reduced: boolean;
  moveLight?: RefObject<THREE.PointLight | null>;
  /** Anchors of stops flagged `interactive` — the camera SETTLES when parked here. */
  interactiveAnchors?: number[];
}

/**
 * Shell camera dive — same EXACT math as the /space CameraRig (byte-identical when
 * no interactive stops), PLUS a "settle" behaviour: when the eased scroll `t` parks
 * near an interactive stop's anchor, the autonomous sway/bob and mouse parallax
 * damp toward zero so a floating FORM/CTA holds still and is easy to use. Showcase
 * stops keep the full gentle drift. Additive — /space's CameraRig is unchanged.
 */
export default function ShellCameraRig({
  progress,
  mouse,
  reduced,
  moveLight,
  interactiveAnchors = [],
}: ShellCameraRigProps) {
  const tRef = useRef(0);
  const settleRef = useRef(0);

  useFrame((state, delta) => {
    const target = progress.current;
    tRef.current += (target - tRef.current) * (reduced ? 0.5 : 0.07);
    updateWarp(tRef.current, delta);
    const t = tRef.current;
    const time = state.clock.elapsedTime;
    const mouseX = mouse.current.x;
    const mouseY = mouse.current.y;

    // Settle = 1 when parked within ~0.04 of an interactive anchor, ramping to 0 by ~0.12.
    let settleTarget = 0;
    for (const a of interactiveAnchors) {
      const s = 1 - THREE.MathUtils.clamp((Math.abs(t - a) - 0.04) / 0.08, 0, 1);
      if (s > settleTarget) settleTarget = s;
    }
    settleRef.current += (settleTarget - settleRef.current) * Math.min(1, delta * 6);
    const calm = 1 - settleRef.current; // 1 = full autonomous motion, 0 = held still
    const par = 1 - settleRef.current * 0.9; // damp mouse parallax when settled

    const camZ = CAMERA_START_Z + t * (CAMERA_END_Z - CAMERA_START_Z);
    const camX = (reduced ? 0 : Math.sin(t * Math.PI * 2) * 1.6 * calm) + mouseX * 3.2 * par;
    const camY = 1 + (reduced ? 0 : Math.sin(time * 0.3) * 0.4 * calm) + mouseY * 2.2 * par;

    state.camera.position.set(camX, camY, camZ);
    state.camera.lookAt(mouseX * 2.4 * par, 1 + mouseY * 1.8 * par, camZ - 60);

    if (moveLight?.current) {
      moveLight.current.position.set(camX, camY, camZ - 8);
    }

    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--space-scroll", String(t));
    }
  });

  return null;
}
