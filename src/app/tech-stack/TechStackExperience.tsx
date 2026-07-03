"use client";

import Link from "next/link";
import SpacePageShell from "@/components/three/space/SpacePageShell";
import { anchorToPosition, type SpaceStop, type ShellPlanet } from "@/components/three/space/shellSpec";
import { techStack, features } from "./techStackData";

/**
 * /tech-stack as a space dive: the EXISTING tech-stack catalog + features floated
 * verbatim as glass panels over the cosmos. Builds a stops[] config from
 * techStackData.ts (same source the server page's sr-only copy uses) and renders the
 * reusable <SpacePageShell>. Both footer CTAs are real working links.
 */

const NARROW = "min(92vw, 640px)";
const WIDE = "min(92vw, 1100px)";

// Planet textures cycled per stop (hero = earth). Stops beyond this set omit the planet.
const PLANETS: ShellPlanet[] = [
  { texture: "/space/2k_earth_daymap.jpg", radius: 6.5, tint: 0x5a9bff },
  { texture: "/space/2k_jupiter.jpg", radius: 7.5, tint: 0xe0a86a },
  { texture: "/space/2k_neptune.jpg", radius: 5.0, tint: 0x3a6ff0 },
  { texture: "/space/2k_saturn.jpg", radius: 4.4, tint: 0xd8c79a, ring: true },
  { texture: "/space/2k_mars.jpg", radius: 4.0, tint: 0xc1440e },
  { texture: "/space/2k_venus_surface.jpg", radius: 4.0, tint: 0xe8c98a },
  { texture: "/space/2k_mercury.jpg", radius: 3.4, tint: 0x9c8a7a },
];

// Short HUD nav labels per category (chrome); the full name is the verbatim panel heading.
const CATEGORY_NAV = ["Frontend", "Deploy", "Performance", "DevEx"];

function HeroPanel() {
  return (
    <div className="space-panel space-hero">
      <p className="space-mono space-eyebrow">◦ BEHIND THE SCENES — TECH STACK</p>
      <h1 className="space-h1">Tech Stack</h1>
      <p className="space-sub">Behind the Scenes of This Portfolio</p>
      <p className="space-body">
        This portfolio showcases modern web development practices using cutting-edge technologies
        for optimal performance, developer experience, and user satisfaction.
      </p>
      <p className="space-mono space-hint">SCROLL TO DIVE · CLICK A PLANET TO TRAVEL ↓</p>
    </div>
  );
}

function CategoryPanel({ index }: { index: number }) {
  const category = techStack[index];
  return (
    <div className="space-wide">
      <div className="space-section-head">
        <p className="space-mono">
          {String(index + 1).padStart(2, "0")} — {category.icon} STACK
        </p>
        <h2 className="space-h2">{category.category}</h2>
      </div>
      <div className="space-grid space-grid-projects">
        {category.technologies.map((tech) => (
          <div key={tech.name} className="space-card">
            <h3 className={`space-proj-title ${tech.color}`}>{tech.name}</h3>
            <p className="space-body space-proj-desc">{tech.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesPanel() {
  return (
    <div className="space-wide">
      <div className="space-section-head">
        <p className="space-mono">05 — CAPABILITIES</p>
        <h2 className="space-h2">Key Features &amp; Capabilities</h2>
      </div>
      <div className="space-grid space-grid-skills">
        {features.map((feature) => (
          <div key={feature.title} className="space-card">
            <div style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>{feature.icon}</div>
            <h3 className="space-proj-title">{feature.title}</h3>
            <p className="space-body space-proj-desc">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaPanel() {
  return (
    <div className="space-panel">
      <p className="space-mono space-card-label">06 — FINAL APPROACH</p>
      <h2 className="space-h2">Interested in Similar Architecture?</h2>
      <p className="space-body">
        I can help you build high-performance web applications using these modern technologies.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.5rem" }}>
        <a className="space-cta" href="/contact">
          Discuss Your Project →
        </a>
        <Link className="space-cta" href="/#projects" style={{ background: "transparent", color: "#ece9e4", border: "1px solid rgba(255,255,255,0.2)" }}>
          View More Projects
        </Link>
      </div>
    </div>
  );
}

function buildStops(): SpaceStop[] {
  const stops: SpaceStop[] = [];
  const total = 1 + techStack.length + 2; // hero + 4 categories + features + CTA
  const anchorAt = (i: number) => (total > 1 ? i / (total - 1) : 0);
  let planetIdx = 0;
  const nextPlanet = () => (planetIdx < PLANETS.length ? PLANETS[planetIdx++] : null);

  stops.push({
    id: "hero",
    label: "",
    anchor: anchorAt(0),
    position: anchorToPosition(anchorAt(0), 0, 1),
    planet: nextPlanet(),
    contentWidth: NARROW,
    content: <HeroPanel />,
  });

  techStack.forEach((category, i) => {
    const idx = i + 1;
    stops.push({
      id: `stack-${i}`,
      label: CATEGORY_NAV[i] ?? category.category,
      anchor: anchorAt(idx),
      position: anchorToPosition(anchorAt(idx), 0, 1),
      planet: nextPlanet(),
      contentWidth: WIDE,
      content: <CategoryPanel index={i} />,
    });
  });

  const featIdx = 1 + techStack.length;
  stops.push({
    id: "features",
    label: "Features",
    anchor: anchorAt(featIdx),
    position: anchorToPosition(anchorAt(featIdx), 0, 1),
    planet: nextPlanet(),
    contentWidth: WIDE,
    content: <FeaturesPanel />,
  });

  const ctaIdx = total - 1;
  stops.push({
    id: "cta",
    label: "Discuss",
    anchor: anchorAt(ctaIdx),
    position: anchorToPosition(anchorAt(ctaIdx), 0, 1),
    planet: nextPlanet(),
    contentWidth: NARROW,
    content: <CtaPanel />,
  });

  return stops;
}

const STOPS = buildStops();

export default function TechStackExperience() {
  return <SpacePageShell stops={STOPS} scrollVh={Math.max(420, STOPS.length * 110)} />;
}
