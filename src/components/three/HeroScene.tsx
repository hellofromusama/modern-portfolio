"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Icosahedron, Edges, Float } from "@react-three/drei";
import { damp } from "maath/easing";
import { useThemeColors } from "@/hooks/useThemeColors";
import HeroParticles from "./HeroParticles";

/** 05-00 spike decision: 2000 particles (overdraw-safest band end), bloom OFF. */
const PARTICLE_COUNT = 2000;

interface HeroSceneProps {
  /** `!shouldAnimate || prefersReduced`, forwarded from SceneCanvas. */
  paused: boolean;
  /**
   * Optional normalized pointer ref (-1..1) threaded from Hero3D for subtle
   * camera parallax. Read on the frame loop only — no DOM reads per frame.
   */
  mouse?: RefObject<{ x: number; y: number }>;
}

/**
 * Concept A — "Icosahedron Evolution + Particle Field".
 *
 * The brand motif (the existing canvas-2D icosahedron) raised to real WebGL:
 * a crisp <Edges> wireframe over a faint solid fill, gently floating, suspended
 * in the GPU <points> field. ALL colors flow from useThemeColors -> THREE.Color
 * keyed on the resolved token object (recompute once per data-theme flip, never
 * per-frame, hardcoded hex only as the pre-mount hydration fallback), so the
 * scene reacts to theme toggles with NO mesh remount.
 *
 * Every motion (group spin, Float, mouse parallax) is gated by `paused` so
 * reduced-motion / off-screen / tab-blur / low-power degrade to a static frame
 * (the SceneCanvas frameloop also stops — second line of defense).
 */
export default function HeroScene({ paused, mouse }: HeroSceneProps) {
  const t = useThemeColors(["--accent-blue", "--accent-violet"]);

  const edge = useMemo(
    () => new THREE.Color(t["--accent-blue"] || "#60a5fa"),
    [t]
  );
  const accent = useMemo(
    () => new THREE.Color(t["--accent-violet"] || "#a78bfa"),
    [t]
  );

  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (paused || !group.current) return;

    // Slow signature rotation of the whole motif.
    group.current.rotation.y += delta * 0.15;

    // Subtle, restrained mouse parallax — frame-rate-independent damping toward
    // the normalized pointer. Reads the cached ref (no per-frame DOM access).
    const m = mouse?.current;
    if (m) {
      damp(group.current.rotation, "x", m.y * 0.12, 0.4, delta);
      damp(group.current.position, "x", m.x * 0.25, 0.4, delta);
      damp(state.camera.position, "z", 6, 0.5, delta);
    }
  });

  return (
    <group ref={group}>
      <Float speed={1} rotationIntensity={0.4} floatIntensity={0.6} enabled={!paused}>
        <Icosahedron args={[1.4, 0]}>
          {/* Faint inner solid in the second accent + crisp theme-colored edges. */}
          <meshBasicMaterial transparent opacity={0.04} color={accent} />
          <Edges color={edge} />
        </Icosahedron>
      </Float>

      <HeroParticles count={PARTICLE_COUNT} paused={paused} color={edge} />
    </group>
  );
}
