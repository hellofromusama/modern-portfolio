"use client";

import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useAnimationGate } from "@/hooks/useAnimationGate";
import { CAMERA_START_Z, FOV, SCROLL_VH } from "./spaceSpec";
import { spaceFontVars } from "./spaceFonts";
import SpaceBackground from "./SpaceBackground";
import CameraRig from "./CameraRig";
import Planet from "./Planet";
import Starfield from "./Starfield";
import SpaceLighting from "./SpaceLighting";
import ShellContent from "./ShellContent";
import ShellHUD from "./ShellHUD";
import SpaceLoader from "./SpaceLoader";
import type { SpaceStop } from "./shellSpec";
import "./space-dom.css";

interface SpacePageShellProps {
  stops: SpaceStop[];
  /** Tall scroll-driver height in vh (default = /space's SCROLL_VH). */
  scrollVh?: number;
}

/**
 * Generic single-GL-context dive host — generalized from SpaceExperience.
 *
 * A FIXED full-screen Canvas holds the whole cosmos; a tall transparent scroll
 * driver gives the page its height so native scroll (window.scrollY) sets a 0..1
 * progress ref that CameraRig eases into the camera dive. Owns a normalized mouse
 * ref (Hero3D pattern). The frameloop is gated on inView && tabVisible (NOT
 * reduced-motion) so scroll still drives the camera under reduced motion — the
 * `reduced` flag only kills AUTONOMOUS motion (sway/bob/spin/twinkle) downstream.
 *
 * All /space leaf components (CameraRig, SpaceBackground, Starfield, SpaceLighting,
 * Planet, SpaceLoader) are reused BY IMPORT, unchanged; only the data (planets +
 * floated content) comes from the `stops` prop.
 */
export default function SpacePageShell({ stops, scrollVh = SCROLL_VH }: SpacePageShellProps) {
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

  const navStops = stops
    .filter((s) => s.label)
    .map(({ id, label, anchor }) => ({ id, label, anchor }));

  return (
    <div className={spaceFontVars}>
      {/* Fixed full-screen canvas layer. pointerEvents:auto so planet clicks/hover
          (click-to-fly raycast) and the floated <Html> panels work; the scroll
          driver below stays pointerEvents:none, and the HUD manages its own layer. */}
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
          {/* Lighting rig (ambient + directional + fog) + camera-tracking pointLight. */}
          <SpaceLighting />
          <pointLight ref={moveLight} color={0x88aaff} intensity={0.35} distance={200} decay={1.8} />

          <CameraRig progress={progress} mouse={mouse} reduced={reduced} moveLight={moveLight} />

          {/* Foreground twinkle stars (local canvas texture — no Suspense needed). */}
          <Starfield mouse={mouse} reduced={reduced} />

          {/* Texture consumers suspend (useTexture) — provide the boundary here. */}
          <Suspense fallback={null}>
            <SpaceBackground reduced={reduced} />
            {stops
              .filter((s) => s.planet)
              .map((s) => (
                <Planet
                  key={s.id}
                  reduced={reduced}
                  spec={{
                    id: s.id,
                    texture: s.planet!.texture,
                    radius: s.planet!.radius,
                    position: s.position,
                    tint: s.planet!.tint,
                    ring: s.planet!.ring,
                    anchor: s.anchor,
                  }}
                />
              ))}
            {/* Floated REAL content via drei <Html transform>. */}
            <ShellContent stops={stops} />
          </Suspense>
        </Canvas>
      </div>

      {/* Tall transparent scroll driver — gives the page its scroll height. */}
      <div style={{ height: `${scrollVh}vh`, pointerEvents: "none" }} aria-hidden />

      {/* DOM HUD — fixed overlay; reads --space-scroll set by CameraRig. */}
      <ShellHUD navStops={navStops} />

      {/* Intro loader — covers everything until it counts to 100 and fades. */}
      <SpaceLoader />
    </div>
  );
}
