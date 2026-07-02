"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAnimationGate } from "@/hooks/useAnimationGate";
import { CAMERA_START_Z, SCROLL_PAGES, SECTIONS } from "./waypoints";
import type { SpaceSection } from "./waypoints";
import SpaceBackground from "./SpaceBackground";
import CameraRig from "./CameraRig";
import Planet from "./Planet";
import SpaceHUD from "./SpaceHUD";
import TeamSection from "@/components/TeamSection";
import "./space-dom.css";

/**
 * Dedicated single-GL-context host for the /space scroll experience (PROTOTYPE).
 *
 * Native-scroll driven: a FIXED full-screen Canvas sits behind a tall transparent
 * spacer, so ordinary page scroll (window.scrollY) sets a 0..1 progress ref that
 * CameraRig reads to fly the camera. Owns a normalized mouse ref (Hero3D pattern)
 * and useAnimationGate gating (frameloop stops off-screen / tab-blur / reduced
 * motion). Scene colors flow from theme tokens via useThemeColors -> THREE.Color.
 */
export default function SpaceExperience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const progress = useRef(0);

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

  // Native scroll -> 0..1 progress ref (passive; no re-render). Drives CameraRig.
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
    <>
      {/* Fixed full-screen canvas layer (the cosmos stays put; the page scrolls).
          pointerEvents:none so DOM links above stay clickable; zIndex:0 behind content. */}
      <div
        ref={wrapRef}
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--bg-primary)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          frameloop={shouldAnimate ? "always" : "never"}
          camera={{ position: [0, 0, CAMERA_START_Z], fov: 60 }}
        >
          <ambientLight intensity={0.35} />
          <pointLight position={[0, 0, 6]} intensity={30} color={blue} />

          <CameraRig progress={progress} mouse={mouse} paused={paused} />

          {/* Texture-consuming nodes suspend (useTexture) — R3F does NOT wrap
              children in Suspense automatically, so provide one here. */}
          <Suspense fallback={null}>
            <SpaceBackground />
            {SECTIONS.map((s) => (
              <Planet key={s.id} section={s} color={colorFor(s.colorVar)} paused={paused} />
            ))}
          </Suspense>
        </Canvas>
      </div>

      {/* Real content scroll layer (zIndex:1 above the fixed cosmos) — the verbatim
          TeamSection drives the scroll length. The scoped space-dom.css transparent-izes
          only its <section> shell so the cosmos shows through. */}
      <div className="space-dom-content" style={{ position: "relative", zIndex: 1 }}>
        {/* intro spacer: reveal the cosmos before content scrolls in */}
        <div style={{ height: "80vh", pointerEvents: "none" }} aria-hidden />
        <TeamSection />
        {/* outro spacer: keep flying past the remaining planets */}
        <div style={{ height: `${(SCROLL_PAGES - 1) * 100}vh`, pointerEvents: "none" }} aria-hidden />
      </div>

      {/* DOM HUD — fixed overlay on top; reads --space-scroll set by CameraRig. */}
      <SpaceHUD />
    </>
  );
}
