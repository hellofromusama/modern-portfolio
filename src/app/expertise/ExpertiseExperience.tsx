"use client";

import type { CSSProperties } from "react";
import SpacePageShell from "@/components/three/space/SpacePageShell";
import { anchorToPosition, type SpaceStop, type ShellPlanet } from "@/components/three/space/shellSpec";
import { ACCENT_CYCLE } from "@/components/three/space/spaceSpec";
import { technicalExpertise, certifications, type ExpertiseCategory } from "./expertiseData";

/**
 * /expertise as a space dive: the EXISTING technical-expertise catalog + certifications
 * floated verbatim as glass panels over the cosmos. Builds a stops[] config from
 * expertiseData.ts (same source the server page uses for metadata + JSON-LD + sr-only)
 * and renders the reusable <SpacePageShell>. The single CTA is a real <a href="/contact">.
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
  { texture: "/space/2k_moon.jpg", radius: 2.4, tint: null },
];

// Short HUD nav labels per category (chrome); the full name is the verbatim panel heading.
const CATEGORY_NAV = ["Frontend", "Backend", "AI/ML", "Enterprise", "Cloud", "Industry"];

const CATEGORY_ENTRIES = Object.entries(technicalExpertise);

function accentStyle(accent: string): CSSProperties {
  return { "--card-accent": accent } as CSSProperties;
}

function HeroPanel() {
  return (
    <div className="space-panel space-hero">
      <p className="space-mono space-eyebrow">◦ PERTH, WESTERN AUSTRALIA — EXPERTISE</p>
      <h1 className="space-h1">Technical Expertise &amp; Specializations</h1>
      <p className="space-body">
        Master-level expertise in modern web technologies, AI integration, and enterprise solutions.
        8+ years of proven experience delivering complex projects across various industries.
      </p>
      <div className="space-chips">
        <span className="space-chip">50+ Projects Completed</span>
        <span className="space-chip">8+ Years Experience</span>
        <span className="space-chip">20+ Technologies Mastered</span>
        <span className="space-chip">5 Professional Certifications</span>
      </div>
      <p className="space-mono space-hint">SCROLL TO DIVE · CLICK A PLANET TO TRAVEL ↓</p>
    </div>
  );
}

function CategoryPanel({ index, category }: { index: number; category: ExpertiseCategory }) {
  const accent = ACCENT_CYCLE[index % ACCENT_CYCLE.length];
  return (
    <div className="space-wide">
      <div className="space-section-head">
        <p className="space-mono" style={{ color: accent }}>
          {String(index + 1).padStart(2, "0")} — EXPERTISE
        </p>
        <h2 className="space-h2">{category.category}</h2>
        <p className="space-body">{category.description}</p>
      </div>
      <div className="space-grid space-grid-projects">
        {category.technologies?.map((tech, i) => {
          const cardAccent = ACCENT_CYCLE[i % ACCENT_CYCLE.length];
          return (
            <div key={tech.name} className="space-card" style={accentStyle(cardAccent)}>
              <h3 className="space-proj-title">{tech.name}</h3>
              <p className="space-body space-proj-desc" style={{ margin: "0.2rem 0" }}>
                <span style={{ color: cardAccent, fontWeight: 600 }}>{tech.level}</span> · {tech.experience}
                {tech.projects ? ` · ${tech.projects}` : ""}
              </p>
              <ul className="space-card-list" style={{ marginTop: "0.6rem" }}>
                {tech.specializations.map((spec) => (
                  <li key={spec}>• {spec}</li>
                ))}
              </ul>
              {tech.achievements && (
                <ul className="space-card-list" style={{ marginTop: "0.5rem" }}>
                  {tech.achievements.map((ach) => (
                    <li key={ach} style={{ color: "#34d399" }}>✦ {ach}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        {category.sectors?.map((sector, i) => {
          const cardAccent = ACCENT_CYCLE[i % ACCENT_CYCLE.length];
          return (
            <div key={sector.name} className="space-card" style={accentStyle(cardAccent)}>
              <h3 className="space-proj-title">{sector.name}</h3>
              <p className="space-body space-proj-desc" style={{ margin: "0.2rem 0" }}>
                <span style={{ color: cardAccent, fontWeight: 600 }}>{sector.level}</span> · {sector.experience}
              </p>
              <ul className="space-card-list" style={{ marginTop: "0.6rem" }}>
                {sector.applications.map((app) => (
                  <li key={app}>• {app}</li>
                ))}
              </ul>
              {sector.achievements && (
                <ul className="space-card-list" style={{ marginTop: "0.5rem" }}>
                  {sector.achievements.map((ach) => (
                    <li key={ach} style={{ color: "#60a5fa" }}>✦ {ach}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CertificationsPanel() {
  return (
    <div className="space-wide">
      <div className="space-section-head">
        <p className="space-mono">07 — CREDENTIALS</p>
        <h2 className="space-h2">Professional Certifications</h2>
      </div>
      <div className="space-grid space-grid-skills">
        {certifications.map((cert) => (
          <div key={cert.name} className="space-card">
            <h3 className="space-proj-title">{cert.name}</h3>
            <p className="space-body space-proj-desc">{cert.issuer}</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.6rem", fontSize: "0.8rem" }}>
              <span style={{ color: "#9aa1b2" }}>{cert.year}</span>
              <span style={{ color: "#34d399", fontWeight: 600 }}>{cert.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaPanel() {
  return (
    <div className="space-panel">
      <p className="space-mono space-card-label">08 — FINAL APPROACH</p>
      <h2 className="space-h2">Ready to Leverage This Expertise for Your Project?</h2>
      <p className="space-body">
        Get a free technical consultation to discuss how my expertise can solve your specific challenges.
      </p>
      <a className="space-cta" href="/contact">
        Schedule Expert Consultation →
      </a>
    </div>
  );
}

function buildStops(): SpaceStop[] {
  const stops: SpaceStop[] = [];
  // hero + 6 categories + certifications + CTA
  const total = 1 + CATEGORY_ENTRIES.length + 2;
  const anchorAt = (i: number) => (total > 1 ? i / (total - 1) : 0);
  let planetIdx = 0;
  const nextPlanet = () => (planetIdx < PLANETS.length ? PLANETS[planetIdx++] : null);

  // Hero
  stops.push({
    id: "hero",
    label: "",
    anchor: anchorAt(0),
    position: anchorToPosition(anchorAt(0), 0, 1),
    planet: nextPlanet(),
    contentWidth: NARROW,
    content: <HeroPanel />,
  });

  // Categories
  CATEGORY_ENTRIES.forEach(([key, category], i) => {
    const idx = i + 1;
    stops.push({
      id: key,
      label: CATEGORY_NAV[i] ?? category.category,
      anchor: anchorAt(idx),
      position: anchorToPosition(anchorAt(idx), 0, 1),
      planet: nextPlanet(),
      contentWidth: WIDE,
      content: <CategoryPanel index={i} category={category} />,
    });
  });

  // Certifications
  const certIdx = 1 + CATEGORY_ENTRIES.length;
  stops.push({
    id: "certifications",
    label: "Certs",
    anchor: anchorAt(certIdx),
    position: anchorToPosition(anchorAt(certIdx), 0, 1),
    planet: nextPlanet(),
    contentWidth: WIDE,
    content: <CertificationsPanel />,
  });

  // CTA
  const ctaIdx = total - 1;
  stops.push({
    id: "cta",
    label: "Hire",
    anchor: anchorAt(ctaIdx),
    position: anchorToPosition(anchorAt(ctaIdx), 0, 1),
    planet: nextPlanet(),
    contentWidth: NARROW,
    content: <CtaPanel />,
  });

  return stops;
}

const STOPS = buildStops();

export default function ExpertiseExperience() {
  return <SpacePageShell stops={STOPS} scrollVh={Math.max(420, STOPS.length * 110)} />;
}
