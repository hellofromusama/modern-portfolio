"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

/**
 * The scene lighting rig (design spec):
 *  - ambientLight   0x556680 @ 0.7  — cool fill
 *  - directionalLight 0xfff4e6 @ 2.1 at (30,18,42) — the "sun" giving terminators
 *  - scene.fog = FogExp2(0x05060a, 0.0052) — depth haze (sky sphere sets fog:false)
 *
 * The camera-tracking pointLight (0x88aaff) is owned by SpaceExperience (moved by
 * CameraRig each frame) so it can follow the camera without a per-frame prop.
 */
export default function SpaceLighting() {
  const { scene } = useThree();

  useEffect(() => {
    const prev = scene.fog;
    scene.fog = new THREE.FogExp2(0x05060a, 0.0052);
    return () => {
      scene.fog = prev ?? null;
    };
  }, [scene]);

  return (
    <>
      <ambientLight color={0x556680} intensity={0.7} />
      <directionalLight color={0xfff4e6} intensity={2.1} position={[30, 18, 42]} />
    </>
  );
}
