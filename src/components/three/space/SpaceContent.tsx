"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { ACCENT_CYCLE, SECTION_ANCHORS, type SpaceSectionId } from "./spaceSpec";

type SectionAnchor = (typeof SECTION_ANCHORS)[number];
import { getProject } from "@/content/projects";
import skills from "@/content/skills";
import TeamSection from "@/components/TeamSection";

/**
 * The 6 portfolio sections floating as real HTML in the shared camera space via
 * drei <Html transform>, anchored at each section's world position (spaceSpec).
 *
 * The design is a WRAPPER: glass panels + tokens + fonts styled here, but the
 * CONTENT TEXT is reused VERBATIM — Skills from skills.ts (8 groups), Projects from
 * projects.ts (7 ids, grid* fields), Team = <TeamSection/> unedited, Hero/About/
 * Contact use the exact README copy. Every <Html> gets an explicit inline width so
 * content lays out coherently inside the transformed (width-less) 3D ancestor.
 */

// Projects: the 7 ids in order — gridTitle/gridDescription/gridCategory verbatim.
const PROJECT_IDS = [
  "kashmir-fund",
  "n8n-automation",
  "voice-ai-agent",
  "erp-system",
  "netsuite-integration",
  "cloud-infrastructure",
  "mcp-netsuite-ollama-bridge",
];

// Per-section explicit panel width (Hero/About/Contact narrow, grids wide).
const WIDTHS: Record<SpaceSectionId, string> = {
  hero: "min(92vw, 640px)",
  about: "min(92vw, 640px)",
  skills: "min(92vw, 1100px)",
  projects: "min(92vw, 1100px)",
  team: "min(92vw, 1100px)",
  contact: "min(92vw, 640px)",
};

function accentStyle(accent: string): CSSProperties {
  return { "--card-accent": accent } as CSSProperties;
}

// Smooth camera dive to a section anchor — the exact SpaceHUD flyTo pattern.
function flyTo(anchor: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: anchor * max, behavior: "smooth" });
}

function HeroContent() {
  return (
    <div className="space-panel space-hero">
      <p className="space-mono space-eyebrow">◦ N 31.95° · E 115.86° — PERTH, AUSTRALIA</p>
      <h1 className="space-h1">Usama Javed</h1>
      <p className="space-sub">Perth&apos;s Senior Full-Stack Developer &amp; AI Engineer</p>
      <p className="space-body">
        8+ years building enterprise solutions on cloud platforms · 50+ projects across Australia
      </p>
      <div className="space-chips">
        <span className="space-chip">50+ Projects</span>
        <span className="space-chip">8+ Years</span>
        <span className="space-chip">20+ Technologies</span>
      </div>
      <div>
        <button className="space-cta space-cta-btn" onClick={() => flyTo(0.6)}>
          View My Work
        </button>
        <button className="space-cta-secondary" onClick={() => flyTo(1.0)}>
          Get In Touch
        </button>
      </div>
      <p className="space-mono space-hint">SCROLL TO DIVE · CLICK A PLANET TO TRAVEL ↓</p>
    </div>
  );
}

function AboutContent() {
  return (
    <div className="space-panel">
      <p className="space-mono space-card-label">01 — HOME PLANET</p>
      <h2 className="space-h2">The developer behind the work</h2>
      <p className="space-body">
        Senior Full-Stack Developer with 8+ years delivering 50+ enterprise projects — from
        humanitarian platforms to AI agents and cloud-native ERP systems. Based in Perth, building
        for clients across Australia.
      </p>
      <div className="space-chips">
        <span className="space-chip">50+ Projects</span>
        <span className="space-chip">8+ Years</span>
        <span className="space-chip">20+ Technologies</span>
        <span className="space-chip">100% Satisfaction</span>
      </div>
    </div>
  );
}

function SkillsContent() {
  return (
    <div className="space-wide">
      <div className="space-section-head">
        <p className="space-mono">02 — SKILLS CONSTELLATION</p>
        <h2 className="space-h2">Skills Constellation</h2>
      </div>
      <div className="space-grid space-grid-skills">
        {skills.map((group, i) => {
          const accent = ACCENT_CYCLE[i % ACCENT_CYCLE.length];
          return (
            <div key={group.title} className="space-card" style={accentStyle(accent)}>
              <p className="space-mono space-card-label" style={{ color: accent }}>
                {group.title}
              </p>
              <ul className="space-card-list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectsContent() {
  return (
    <div className="space-wide">
      <div className="space-section-head">
        <p className="space-mono">03 — SELECTED PROJECTS</p>
        <h2 className="space-h2">Selected Projects</h2>
      </div>
      <div className="space-grid space-grid-projects">
        {PROJECT_IDS.map((id, i) => {
          const p = getProject(id);
          if (!p) return null;
          const accent = ACCENT_CYCLE[i % ACCENT_CYCLE.length];
          return (
            // Plain <a> (not Link): a full page load re-reads the space-mode cookie
            // server-side, so the target /projects/[id] renders as a dive.
            <a
              key={id}
              href={`/projects/${id}`}
              className="space-proj-card"
              style={accentStyle(accent)}
            >
              <p className="space-mono space-card-label" style={{ color: accent }}>
                {p.gridCategory}
              </p>
              <h3 className="space-proj-title">{p.gridTitle}</h3>
              <p className="space-body space-proj-desc">{p.gridDescription}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function TeamContent() {
  // TeamSection rendered VERBATIM. The .space-team scope (space-dom.css) transparent-
  // izes its <section> and neutralizes its lg:sticky so the 2-col layout resolves
  // inside the width-bounded transformed <Html> — WITHOUT editing TeamSection.tsx.
  return (
    <div className="space-team space-wide">
      <TeamSection />
    </div>
  );
}

function ContactContent() {
  return (
    <div className="space-panel">
      <p className="space-mono space-card-label">05 — FINAL APPROACH</p>
      <h2 className="space-h2">Let&apos;s work together</h2>
      <p className="space-body">Have a mission in mind? Let&apos;s build something that travels well.</p>
      <a className="space-cta" href="mailto:hellofromusama@gmail.com">
        hellofromusama@gmail.com →
      </a>
      <p className="space-links">
        <a href="https://github.com/hellofromusama" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>{" "}
        ·{" "}
        <a
          href="https://www.linkedin.com/in/hellofromusama/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>{" "}
        · <a href="mailto:hellofromusama@gmail.com">Email</a>
      </p>
      <p className="space-mono space-footer">50+ PROJECTS DELIVERED · 100% CLIENT SATISFACTION</p>
    </div>
  );
}

function contentFor(id: SpaceSectionId): ReactNode {
  switch (id) {
    case "hero":
      return <HeroContent />;
    case "about":
      return <AboutContent />;
    case "skills":
      return <SkillsContent />;
    case "projects":
      return <ProjectsContent />;
    case "team":
      return <TeamContent />;
    case "contact":
      return <ContactContent />;
  }
}

/**
 * One floated section. drei <Html transform> projects EVERY panel onto the screen
 * regardless of depth, so without a distance fade all 6 overlap. We reproduce the
 * design's exact opacity curve (README): fade-in far, full on arrival, fade-out as
 * the camera passes — driven each frame from the live camera z (no React re-render).
 */
function FadingSection({ anchor }: { anchor: SectionAnchor }) {
  const ref = useRef<HTMLDivElement>(null);
  const worldZ = anchor.position[2];

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
    // Don't let an invisible panel eat clicks meant for a planet behind it.
    el.style.pointerEvents = op > 0.5 ? "auto" : "none";
  });

  return (
    <Html
      transform
      occlude={false}
      position={anchor.position}
      distanceFactor={10}
      pointerEvents="auto"
      style={{ width: WIDTHS[anchor.id] }}
      className="space-html"
      zIndexRange={[0, 0]}
      prepend={false}
    >
      <div ref={ref} style={{ opacity: 0, willChange: "opacity" }}>
        {contentFor(anchor.id)}
      </div>
    </Html>
  );
}

export default function SpaceContent() {
  return (
    <>
      {SECTION_ANCHORS.map((anchor) => (
        <FadingSection key={anchor.id} anchor={anchor} />
      ))}
    </>
  );
}
