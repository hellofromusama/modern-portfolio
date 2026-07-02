"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import type { SpaceSection } from "./waypoints";

interface PlanetProps {
  section: SpaceSection;
  /** Theme-resolved color (THREE.Color) for this waypoint's accent token. */
  color: THREE.Color | string;
  /** When true, Float + self-rotation stop (off-screen / tab-blur / reduced-motion). */
  paused: boolean;
}

/**
 * A real photo-textured planet at a waypoint (Solar System Scope diffuse map).
 *
 * Wrapped in drei <Float> for weightless drift, with a slow self-rotation in
 * useFrame. The body wears a real SRGB diffuse map (emissive OFF so the photo
 * shows), lit by the scene environment + pointLight. A larger faint additive
 * halo shell fakes an atmospheric glow and keeps the theme accent (color prop).
 */
export default function Planet({ section, color, paused }: PlanetProps) {
  const mesh = useRef<THREE.Mesh>(null);

  // Real diffuse map. useTexture does NOT set color space — do it explicitly, or
  // the photo renders dull/grey. Inline assignment on the returned texture is fine.
  const map = useTexture(section.texture);
  map.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (paused || !mesh.current) return;
    mesh.current.rotation.y += delta * 0.2;
  });

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.5}
      floatIntensity={0.8}
      enabled={!paused}
      position={section.position}
    >
      <mesh ref={mesh}>
        <sphereGeometry args={[2.2, 48, 48]} />
        <meshStandardMaterial
          map={map}
          emissiveIntensity={0}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Faint additive halo shell — atmospheric glow. */}
      <mesh>
        <sphereGeometry args={[2.7, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </Float>
  );
}
