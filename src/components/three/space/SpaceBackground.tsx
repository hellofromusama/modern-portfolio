"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

interface SpaceBackgroundProps {
  /** prefers-reduced-motion: freeze the slow sky rotation. */
  reduced: boolean;
}

/**
 * Real BackSide sky SPHERE (design spec) — a big r=900 inverted sphere wearing the
 * self-hosted Milky Way photo, `fog:false` so the fog never washes it out. SRGB
 * color space is load-bearing (without it the stars render grey/washed). Rotates
 * very slowly for a living cosmos. useTexture suspends → render inside <Suspense>.
 */
export default function SpaceBackground({ reduced }: SpaceBackgroundProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const tex = useTexture("/space/2k_stars_milky_way.jpg");
  tex.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    if (reduced || !meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.002;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[900, 60, 40]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} />
    </mesh>
  );
}
