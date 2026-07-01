"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAnimationGate } from "@/hooks/useAnimationGate";
import { CAMERA_START_Z, SCROLL_PAGES, SECTIONS } from "./waypoints";
import type { SpaceSection } from "./waypoints";
import Starfield from "./Starfield";
import CameraRig from "./CameraRig";
import Planet from "./Planet";

/**
 * Dedicated single-GL-context host for the /space scroll experience (PROTOTYPE).
 *
 * Owns ONE <Canvas> (does NOT touch the shared SceneCanvas), a normalized mouse
 * ref (Hero3D pattern), and the useAnimationGate gating so the frameloop stops
 * off-screen / on tab-blur / under prefers-reduced-motion. All scene colors flow
 * from theme tokens via useThemeColors -> THREE.Color (recomputed once per
 * data-theme flip, hardcoded hex only as the pre-mount fallback).
 */
export default function SpaceExperience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { shouldAnimate, prefersReduced } = useAnimationGate(wrapRef);
  const paused = !shouldAnimate || prefersReduced;

  // Normalized -1..1 pointer in a ref (no re-renders) — read on the frame loop.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Theme-color bridge: raw tokens -> THREE.Color, keyed on the resolved object.
  const t = useThemeColors(["--accent-blue", "--accent-violet", "--accent-emerald"]);
  const blue = useMemo(() => new THREE.Color(t["--accent-blue"] || "#60a5fa"), [t]);
  const violet = useMemo(() => new THREE.Color(t["--accent-violet"] || "#a78bfa"), [t]);
  const emerald = useMemo(() => new THREE.Color(t["--accent-emerald"] || "#34d399"), [t]);

  // Resolve a section's accent token to its memoized THREE.Color.
  const colorFor = useMemo(() => {
    const map: Record<SpaceSection["colorVar"], THREE.Color> = {
      "--accent-blue": blue,
      "--accent-violet": violet,
      "--accent-emerald": emerald,
    };
    return (v: SpaceSection["colorVar"]) => map[v];
  }, [blue, violet, emerald]);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        frameloop={shouldAnimate ? "always" : "never"}
        camera={{ position: [0, 0, CAMERA_START_Z], fov: 60 }}
        style={{ background: "var(--bg-primary)" }}
      >
        <ScrollControls pages={SCROLL_PAGES} damping={0.25}>
          <ambientLight intensity={0.35} />
          <pointLight position={[0, 0, 6]} intensity={30} color={blue} />

          <CameraRig mouse={mouse} paused={paused} />
          {SECTIONS.map((s) => (
            <Planet key={s.id} section={s} color={colorFor(s.colorVar)} paused={paused} />
          ))}

          <Starfield paused={paused} color={violet} />
        </ScrollControls>
      </Canvas>

      {/* --- HUD insertion point (SpaceHUD arrives in Task 3, AFTER the Canvas) --- */}
    </div>
  );
}
