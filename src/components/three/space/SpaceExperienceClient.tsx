"use client";

import dynamic from "next/dynamic";
import ScenePoster from "@/components/three/ScenePoster";

// NEW client wrapper for the home space render. Intentionally mirrors the body of
// /space/page.tsx so that route stays untouched (reuse-by-import of the engine).
// ssr:false is legal here because this file is a client component; the poster paints
// instantly underneath the WebGL canvas while the chunk loads (zero CLS).
const SpaceExperience = dynamic(
  () => import("@/components/three/space/SpaceExperience"),
  { ssr: false, loading: () => <ScenePoster variant="hero" /> }
);

export default function SpaceExperienceClient() {
  return (
    <main style={{ background: "#05060a" }}>
      <SpaceExperience />
    </main>
  );
}
