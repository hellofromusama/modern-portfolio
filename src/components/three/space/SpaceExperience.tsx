"use client";

import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useAnimationGate } from "@/hooks/useAnimationGate";
import { CAMERA_START_Z, FOV, PLANETS, SCROLL_VH } from "./spaceSpec";
import { spaceFontVars } from "./spaceFonts";
import SpaceBackground from "./SpaceBackground";
import CameraRig from "./CameraRig";
import Planet, { Asteroids } from "./Planet";
import SpaceHUD from "./SpaceHUD";
import "./space-dom.css";

/**
 * Single-GL-context host for the /space Space-Journey experience.
 *
 * A FIXED full-screen Canvas holds the whole cosmos; a tall transparent 640vh
 * scroll driver gives the page its height so native scroll (window.scrollY) sets a
 * 0..1 progress ref that CameraRig eases into the camera dive. Owns a normalized
 * mouse ref (Hero3D pattern). The frameloop is gated on inView && tabVisible (NOT
 * reduced-motion) so scroll still drives the camera under reduced motion — the
 * `reduced` flag only kills AUTONOMOUS motion (sway/bob/spin/twinkle) downstream.
 */
export default function SpaceExperience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const progress = useRef(0);
  const moveLight = useRef<THREE.PointLight>(null);

  const { inView, tabVisible, prefersReduced } = useAnimationGate(wrapRef);
  const reduced = prefersReduced;
  // Frameloop decoupled from reduced-motion: scroll must still drive the dive.
  const frameloop = inView && tabVisible ? "always" : "never";

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

  return (
    <div className={spaceFontVars}>
      {/* Fixed full-screen canvas layer. pointerEvents:auto so planet clicks/hover
          and the floated <Html> panels (Task 4) work; the 640vh driver below stays
          pointerEvents:none, and the HUD manages its own layer. */}
      <div
        ref={wrapRef}
        style={{
          position: "fixed",
          inset: 0,
          background: "#05060a",
          zIndex: 0,
          pointerEvents: "auto",
        }}
      >
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          frameloop={frameloop}
          camera={{ position: [0, 0, CAMERA_START_Z], fov: FOV, near: 0.1, far: 3000 }}
        >
          {/* Temporary lights — the full lighting rig (SpaceLighting) lands in Task 3. */}
          <ambientLight color={0x556680} intensity={0.7} />
          <pointLight ref={moveLight} color={0x88aaff} intensity={0.35} distance={200} decay={1.8} />

          <CameraRig progress={progress} mouse={mouse} reduced={reduced} moveLight={moveLight} />

          {/* Texture consumers suspend (useTexture) — provide the boundary here. */}
          <Suspense fallback={null}>
            <SpaceBackground reduced={reduced} />
            {PLANETS.map((p) => (
              <Planet key={p.id} spec={p} reduced={reduced} />
            ))}
            <Asteroids reduced={reduced} />
            {/* Task 4 inserts <SpaceContent /> here (floated <Html> sections). */}
          </Suspense>
          {/* Task 3 inserts <SpaceLighting /> + <Starfield /> here. */}
        </Canvas>
      </div>

      {/* Tall transparent scroll driver — gives the page its scroll height. Content
          now lives inside the Canvas via <Html> (Task 4). */}
      <div style={{ height: `${SCROLL_VH}vh`, pointerEvents: "none" }} aria-hidden />

      {/* DOM HUD — fixed overlay; reads --space-scroll set by CameraRig. */}
      <SpaceHUD />
      {/* Task 5 inserts <SpaceLoader /> here. */}
    </div>
  );
}
