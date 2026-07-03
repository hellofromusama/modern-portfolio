"use client";

import dynamic from "next/dynamic";
import ScenePoster from "@/components/three/ScenePoster";
import type { Project } from "@/content/types";

// ssr:false is legal here because this is a client component (the server page cannot
// do it). The dive owns a WebGL Canvas — it must never render on the server; the
// poster paints instantly underneath while the chunk loads. Receives the plain
// (serializable) Project from the server page and forwards it to the experience.
const ProjectExperience = dynamic(() => import("./ProjectExperience"), {
  ssr: false,
  loading: () => <ScenePoster variant="hero" />,
});

export default function ProjectDive({ project }: { project: Project }) {
  return (
    <main style={{ background: "#05060a" }}>
      <ProjectExperience project={project} />
    </main>
  );
}
