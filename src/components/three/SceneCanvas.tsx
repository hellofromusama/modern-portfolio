"use client";

import { useCallback, useRef, useState } from "react";
import { Canvas, type RootState } from "@react-three/fiber";
import { useAnimationGate } from "@/hooks/useAnimationGate";
import ThemedScene from "./ThemedScene";
import ScenePoster from "./ScenePoster";

interface SceneCanvasProps {
  className?: string;
}

/**
 * The single-GL-context Canvas provider.
 *
 * - DPR clamped to [1, 2] EXPLICITLY so the pixel budget is provable (PERF).
 * - frameloop bound to Phase 3's `useAnimationGate`: "always" only when the
 *   wrapper is on-screen, the tab is visible, and reduced-motion is off;
 *   "never" otherwise (the render loop fully stops — no idle GPU cost).
 * - A `webglcontextlost` handler degrades to the static ScenePoster instead of
 *   crashing; `webglcontextrestored` flips back.
 *
 * Exactly ONE <Canvas> is mounted — never multiple GL contexts.
 */
export default function SceneCanvas({ className }: SceneCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { shouldAnimate, prefersReduced } = useAnimationGate(wrapRef);
  const [contextLost, setContextLost] = useState(false);

  const onCreated = useCallback((state: RootState) => {
    const canvas = state.gl.domElement;

    canvas.addEventListener(
      "webglcontextlost",
      (e: Event) => {
        // Prevent the default so the context can (potentially) be restored,
        // and swap to the poster meanwhile.
        e.preventDefault();
        setContextLost(true);
      },
      { passive: false }
    );

    canvas.addEventListener("webglcontextrestored", () => {
      setContextLost(false);
    });
  }, []);

  // Context-loss -> static poster (no crash, no error.tsx).
  if (contextLost) return <ScenePoster className={className} />;

  return (
    <div ref={wrapRef} className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        dpr={[1, 2]}
        frameloop={shouldAnimate ? "always" : "never"}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={onCreated}
      >
        <ThemedScene paused={!shouldAnimate || prefersReduced} />
      </Canvas>
    </div>
  );
}
