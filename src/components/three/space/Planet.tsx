"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { SpaceSection } from "./waypoints";

interface PlanetProps {
  section: SpaceSection;
  /** Theme-resolved color (THREE.Color) for this waypoint's accent token. */
  color: THREE.Color | string;
  /** When true, Float + self-rotation stop (off-screen / tab-blur / reduced-motion). */
  paused: boolean;
}

/**
 * A glowing rim-lit placeholder planet at a waypoint (design-agnostic stand-in).
 *
 * Wrapped in drei <Float> for weightless drift, with a slow self-rotation in
 * useFrame. A larger faint additive halo shell fakes an atmospheric glow. Colors
 * come entirely from the theme token resolved at the parent — no hardcoded hex.
 */
export default function Planet({ section, color, paused }: PlanetProps) {
  const mesh = useRef<THREE.Mesh>(null);

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
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
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
