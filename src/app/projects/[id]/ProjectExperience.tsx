"use client";

import Link from "next/link";
import SpacePageShell from "@/components/three/space/SpacePageShell";
import { anchorToPosition, type SpaceStop } from "@/components/three/space/shellSpec";
import type { Project } from "@/content/types";

/**
 * /projects/[id] as a data-driven space dive — floats the project detail for ANY id.
 * All copy comes VERBATIM from the passed Project (title/subtitle/description/
 * longDescription/tech/features/challenges/results). Every CTA and the liveUrl are
 * real working anchors. Renders the reusable <SpacePageShell>.
 */

const NARROW = "min(92vw, 640px)";
const WIDE = "min(92vw, 1100px)";

export default function ProjectExperience({ project }: { project: Project }) {
  const heroPanel = (
    <div className="space-panel space-hero">
      <p className="space-mono space-eyebrow">◦ {project.category}</p>
      <h1 className="space-h1">{project.title}</h1>
      <p className="space-sub">{project.subtitle}</p>
      <p className="space-body">{project.description}</p>
      <div className="space-chips">
        <span className="space-chip">Timeline · {project.timeline}</span>
        <span className="space-chip">Team · {project.team}</span>
      </div>
      {project.liveUrl && (
        <a
          className="space-cta"
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Live Website →
        </a>
      )}
      <p className="space-mono space-hint">SCROLL TO DIVE · CLICK A PLANET TO TRAVEL ↓</p>
    </div>
  );

  const techPanel = (
    <div className="space-panel">
      <p className="space-mono space-card-label" style={{ color: "#60a5fa" }}>
        01 — TECHNOLOGY STACK
      </p>
      <h2 className="space-h2">Technology Stack</h2>
      <div className="space-chips">
        {project.tech.map((tech) => (
          <span key={tech} className="space-chip">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );

  const overviewPanel = (
    <div className="space-panel">
      <p className="space-mono space-card-label" style={{ color: "#a78bfa" }}>
        02 — PROJECT OVERVIEW
      </p>
      <h2 className="space-h2">Project Overview</h2>
      <p className="space-body" style={{ whiteSpace: "pre-line" }}>
        {project.longDescription}
      </p>
    </div>
  );

  const featuresPanel = (
    <div className="space-wide">
      <div className="space-section-head">
        <p className="space-mono" style={{ color: "#34d399" }}>
          03 — KEY FEATURES
        </p>
        <h2 className="space-h2">Key Features</h2>
      </div>
      <ul className="space-card-list">
        {project.features.map((feature, index) => (
          <li key={index}>• {feature}</li>
        ))}
      </ul>
    </div>
  );

  const impactPanel = (
    <div className="space-wide">
      <div className="space-section-head">
        <p className="space-mono" style={{ color: "#fbbf24" }}>
          04 — CHALLENGES &amp; RESULTS
        </p>
        <h2 className="space-h2">Challenges Solved &amp; Results Achieved</h2>
      </div>
      <div className="space-grid space-grid-projects">
        <div className="space-card">
          <p className="space-mono space-card-label" style={{ color: "#fbbf24" }}>
            CHALLENGES SOLVED
          </p>
          <ul className="space-card-list">
            {project.challenges.map((challenge, index) => (
              <li key={index}>• {challenge}</li>
            ))}
          </ul>
        </div>
        <div className="space-card">
          <p className="space-mono space-card-label" style={{ color: "#34d399" }}>
            RESULTS ACHIEVED
          </p>
          <ul className="space-card-list">
            {project.results.map((result, index) => (
              <li key={index}>• {result}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const ctaPanel = (
    <div className="space-panel">
      <p className="space-mono space-card-label">05 — FINAL APPROACH</p>
      <h2 className="space-h2">Interested in Similar Solutions?</h2>
      <p className="space-body">
        I can help you build similar high-performance solutions tailored to your specific needs.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.5rem" }}>
        <Link className="space-cta" href="/contact">
          Discuss Your Project →
        </Link>
        <Link
          className="space-cta"
          href="/#projects"
          style={{ background: "transparent", color: "#ece9e4", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          View More Projects
        </Link>
      </div>
    </div>
  );

  const stops: SpaceStop[] = [
    {
      id: "hero",
      label: "",
      anchor: 0.0,
      position: anchorToPosition(0.0, 0, 1),
      planet: { texture: "/space/2k_earth_daymap.jpg", radius: 6.5, tint: 0x5a9bff },
      contentWidth: NARROW,
      content: heroPanel,
    },
    {
      id: "tech",
      label: "Tech",
      anchor: 0.2,
      position: anchorToPosition(0.2, 0, 1),
      planet: { texture: "/space/2k_neptune.jpg", radius: 5.0, tint: 0x3a6ff0 },
      contentWidth: NARROW,
      content: techPanel,
    },
    {
      id: "overview",
      label: "Overview",
      anchor: 0.4,
      position: anchorToPosition(0.4, 0, 1),
      planet: { texture: "/space/2k_jupiter.jpg", radius: 7.5, tint: 0xe0a86a },
      contentWidth: WIDE,
      content: overviewPanel,
    },
    {
      id: "features",
      label: "Features",
      anchor: 0.6,
      position: anchorToPosition(0.6, 0, 1),
      contentWidth: WIDE,
      content: featuresPanel,
    },
    {
      id: "impact",
      label: "Impact",
      anchor: 0.8,
      position: anchorToPosition(0.8, 0, 1),
      planet: { texture: "/space/2k_saturn.jpg", radius: 4.4, tint: 0xd8c79a, ring: true },
      contentWidth: WIDE,
      content: impactPanel,
    },
    {
      id: "contact",
      label: "Contact",
      anchor: 1.0,
      position: anchorToPosition(1.0, 0, 1),
      planet: { texture: "/space/2k_venus_surface.jpg", radius: 4.0, tint: 0xe8c98a },
      contentWidth: NARROW,
      content: ctaPanel,
    },
  ];

  return <SpacePageShell stops={stops} />;
}
