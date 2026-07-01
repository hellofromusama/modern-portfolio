"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { inSphere } from "maath/random";

interface StarfieldProps {
  /** When true all layers stop rotating (off-screen / tab-blur / reduced-motion). */
  paused: boolean;
  /** Theme-tinted star color (a THREE.Color resolved from tokens at the parent). */
  color?: THREE.Color | string;
}

// Parallax depth layers. Each is ONE static <Points> draw call; the different
// radii + rotation rates below create a sense of depth as the camera flies.
const LAYERS = [
  { count: 800, radius: 18, size: 0.06, rate: 0.012 },
  { count: 1500, radius: 45, size: 0.09, rate: 0.007 },
  { count: 2500, radius: 90, size: 0.14, rate: 0.004 },
] as const;

/**
 * Multi-layer parallax starfield — REUSES the HeroParticles pattern exactly.
 *
 * Each depth layer owns a STATIC maath/random.inSphere buffer computed ONCE
 * (never mutated per frame). Motion is a slow whole-layer rotation at a
 * DIFFERENT rate per layer (parallax) in a single useFrame — zero per-particle
 * CPU writes. Additive, depthWrite=false PointMaterial gives the glow.
 */
export default function Starfield({ paused, color = "#a78bfa" }: StarfieldProps) {
  const refs = useRef<(THREE.Points | null)[]>([]);

  // One static buffer per layer, computed once.
  const buffers = useMemo(
    () =>
      LAYERS.map(
        (l) => inSphere(new Float32Array(l.count * 3), { radius: l.radius }) as Float32Array
      ),
    []
  );

  useFrame((_, delta) => {
    if (paused) return;
    for (let i = 0; i < refs.current.length; i++) {
      const pts = refs.current[i];
      if (!pts) continue;
      // Whole-layer transform (one write), each layer at its own parallax rate.
      pts.rotation.y += delta * LAYERS[i].rate;
      pts.rotation.x += delta * LAYERS[i].rate * 0.4;
    }
  });

  return (
    <>
      {LAYERS.map((l, i) => (
        <Points
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          positions={buffers[i]}
          stride={3}
          frustumCulled={false}
        >
          <PointMaterial
            transparent
            size={l.size}
            sizeAttenuation
            depthWrite={false}
            color={color}
            blending={THREE.AdditiveBlending}
          />
        </Points>
      ))}
    </>
  );
}
