"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { inSphere } from "maath/random";

interface HeroParticlesProps {
  /** Particle count. 05-00 spike chose 2000 (overdraw-safest band end). */
  count?: number;
  /** When true the field stops rotating (off-screen / tab-blur / reduced-motion). */
  paused?: boolean;
  /** Theme-tinted point color (a THREE.Color from useThemeColors at the parent). */
  color?: THREE.Color | string;
}

/**
 * The hero's GPU particle field — ONE <points> draw call regardless of count.
 *
 * The position buffer is computed ONCE via maath/random.inSphere (correct
 * in-sphere distribution) and is STATIC — it is NEVER mutated per frame. Motion
 * is achieved by cheaply rotating the WHOLE field's transform in useFrame, so
 * there is zero per-particle CPU work on the hot path (research Pattern 2 /
 * Pitfall 4). Additive feel comes from a small point size + depthWrite={false}.
 */
export default function HeroParticles({
  count = 2000,
  paused = false,
  color = "#60a5fa",
}: HeroParticlesProps) {
  const ref = useRef<THREE.Points>(null);

  // STATIC buffer — computed once per `count`, never written on a frame.
  const positions = useMemo(
    () => inSphere(new Float32Array(count * 3), { radius: 3 }) as Float32Array,
    [count]
  );

  useFrame((_, delta) => {
    if (paused || !ref.current) return;
    // Animate the whole field cheaply (one transform write, not N positions).
    ref.current.rotation.y += delta * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        color={color}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}
