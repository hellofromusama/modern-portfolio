"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { SpaceStop } from "./shellSpec";

/**
 * Generic distance-opacity FadingSection — reproduces SpaceContent's EXACT opacity
 * curve + pointerEvents toggle (README values verbatim), but reads from a SpaceStop
 * instead of the hard-wired SECTION_ANCHORS. drei <Html transform> projects every
 * panel onto the screen regardless of depth, so without a distance fade all stops
 * overlap; we drive opacity each frame from the live camera z (no React re-render).
 */
function FadingSection({ stop }: { stop: SpaceStop }) {
  const ref = useRef<HTMLDivElement>(null);
  const worldZ = stop.position[2];

  useFrame((state) => {
    const el = ref.current;
    if (!el) return;
    const dist = state.camera.position.z - worldZ;
    let op: number;
    if (dist < 2 || dist > 130) op = 0;
    else if (dist >= 45) op = (70 - dist) / 25; // fade in
    else if (dist >= 18) op = 1; // arrival window
    else op = (dist - 3) / 15; // fade out
    op = Math.max(0, Math.min(1, op));
    el.style.opacity = String(op);
    // Don't let a faded panel eat clicks meant for a planet (or panel) behind it.
    el.style.pointerEvents = op > 0.5 ? "auto" : "none";
  });

  return (
    <Html
      transform
      occlude={false}
      position={stop.position}
      distanceFactor={10}
      pointerEvents="auto"
      style={{ width: stop.contentWidth }}
      className="space-html"
      zIndexRange={[0, 0]}
      prepend={false}
    >
      <div ref={ref} style={{ opacity: 0, willChange: "opacity" }}>
        {stop.content}
      </div>
    </Html>
  );
}

export default function ShellContent({ stops }: { stops: SpaceStop[] }) {
  return (
    <>
      {stops.map((stop) => (
        <FadingSection key={stop.id} stop={stop} />
      ))}
    </>
  );
}
