"use client";

import dynamic from "next/dynamic";
import ScenePoster from "@/components/three/ScenePoster";

// ssr:false is legal here because this file is a client component. The live
// experience owns a WebGL Canvas, so it must never render on the server; the
// poster paints instantly underneath it (zero CLS) while the chunk loads.
const SpaceExperience = dynamic(
  () => import("@/components/three/space/SpaceExperience"),
  { ssr: false, loading: () => <ScenePoster variant="hero" /> }
);

/**
 * /space — the full finalized Claude Design "Space-Journey Portfolio".
 *
 * Full-screen, noindex (see ./layout.tsx), strictly additive — it does not touch
 * the live homepage or any shared component (reuse-by-import only). Reduced motion
 * still RUNS the experience (scroll drives the camera; autonomous sway/float are
 * killed and the ease is faster) — it is NOT a static poster. That branch lives
 * inside SpaceExperience via the threaded `reduced` flag.
 */
export default function SpacePage() {
  return (
    <main style={{ background: "#05060a" }}>
      <SpaceExperience />
    </main>
  );
}
