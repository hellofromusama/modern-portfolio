"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

/**
 * Real equirectangular Milky Way sky (replaces the procedural Starfield).
 *
 * Sets the loaded JPG as scene.background (three projects the 2:1 equirect for us)
 * and scene.environment (subtle real starlight on the planets). The mapping +
 * SRGB color space are load-bearing: without SRGBColorSpace the stars render
 * grey/washed. Texture is self-hosted from public/space (never hotlinked).
 * useTexture suspends, so this must render inside a <Suspense> boundary.
 */
export default function SpaceBackground() {
  const { scene } = useThree();
  const tex = useTexture("/space/2k_stars_milky_way.jpg");

  useEffect(() => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace; // REQUIRED or stars look grey/washed
    scene.background = tex;
    scene.environment = tex;
    return () => {
      scene.background = null;
      scene.environment = null;
    };
  }, [tex, scene]);

  return null;
}
