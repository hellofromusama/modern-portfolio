"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import ScenePoster from "@/components/three/ScenePoster";

// ssr:false is legal here because this file is a client component. The live
// experience owns a WebGL Canvas, so it must never render on the server; the
// poster paints instantly underneath it (zero CLS) while the chunk loads.
const SpaceExperience = dynamic(
  () => import("@/components/three/space/SpaceExperience"),
  { ssr: false, loading: () => <ScenePoster variant="hero" /> }
);

/**
 * /space — a DESIGN-AGNOSTIC "outer space" scroll experience PROTOTYPE.
 *
 * Full-screen, noindex (see ./layout.tsx), and strictly additive — it does not
 * touch the live homepage or any shared component. prefers-reduced-motion falls
 * back to a STATIC poster (no flythrough / no continuous motion).
 */
export default function SpacePage() {
  const [mounted, setMounted] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {mounted && prefersReduced ? (
        // Reduced-motion: static full-screen poster, no live flythrough.
        <ScenePoster variant="hero" />
      ) : (
        <SpaceExperience />
      )}
    </main>
  );
}
