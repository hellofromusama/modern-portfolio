"use client";

import dynamic from "next/dynamic";
import ScenePoster from "@/components/three/ScenePoster";

// ssr:false is legal here because this is a client component. The dive owns a WebGL
// Canvas, so it must never render on the server; the poster paints instantly
// underneath it (zero CLS) while the chunk loads. Mirrors ServicesDive.tsx.
const DashboardExperience = dynamic(() => import("./DashboardExperience"), {
  ssr: false,
  loading: () => <ScenePoster variant="hero" />,
});

export default function DashboardDive() {
  return (
    <main style={{ background: "#05060a" }}>
      <DashboardExperience />
    </main>
  );
}
