"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useThemeColors } from "@/hooks/useThemeColors";

interface ThemedSceneProps {
  paused: boolean;
}

/**
 * The theme bridge — a trivial rotating wireframe icosahedron whose colors come
 * from Phase 3's `useThemeColors` (CSS tokens), parsed to THREE.Color INSIDE the
 * Canvas.
 *
 * Passing a new `color` prop reconciles onto the existing material — toggling
 * `data-theme` updates the colors with NO remount of the mesh/geometry.
 *
 * Rotation only advances when `paused` is false; the parent SceneCanvas also
 * sets frameloop="never" off-screen, so this is the second line of defense.
 */
export default function ThemedScene({ paused }: ThemedSceneProps) {
  // Raw hex tokens (e.g. "#60a5fa"); {} before mount -> fall back to dark hex.
  const t = useThemeColors(["--accent-blue", "--accent-violet"]);

  const edge = useMemo(
    () => new THREE.Color(t["--accent-blue"] || "#60a5fa"),
    [t]
  );
  const fill = useMemo(
    () => new THREE.Color(t["--accent-violet"] || "#a78bfa"),
    [t]
  );

  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (paused || !mesh.current) return;
    mesh.current.rotation.x += delta * 0.3;
    mesh.current.rotation.y += delta * 0.4;
  });

  return (
    <>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshBasicMaterial color={edge} wireframe />
      </mesh>
      {/* Second token also reacts to theme, proving the bridge end-to-end. */}
      <ambientLight color={fill} intensity={0.8} />
    </>
  );
}
