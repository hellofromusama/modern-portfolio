"use client";

import type { CSSProperties } from "react";
import SpacePageShell from "@/components/three/space/SpacePageShell";
import { anchorToPosition, type SpaceStop } from "@/components/three/space/shellSpec";
import { ACCENT_CYCLE } from "@/components/three/space/spaceSpec";
import { services, processSteps } from "@/content/services";

/**
 * /services as a space dive: the EXISTING services catalog floated verbatim as
 * fading cards over the cosmos. Builds a stops[] config from src/content/services.ts
 * (same source the server page uses for metadata + JSON-LD + sr-only) and renders
 * the reusable <SpacePageShell>. Every CTA is a real working <a href="/contact">.
 */

const NARROW = "min(92vw, 640px)";
const WIDE = "min(92vw, 1100px)";

// Short HUD nav labels (chrome); the full category name is the verbatim panel heading.
const CATEGORY_NAV = ["Web", "AI", "Enterprise"];

function accentStyle(accent: string): CSSProperties {
  return { "--card-accent": accent } as CSSProperties;
}

function HeroPanel() {
  return (
    <div className="space-panel space-hero">
      <p className="space-mono space-eyebrow">◦ PERTH, WESTERN AUSTRALIA — SERVICES</p>
      <h1 className="space-h1">Web Development &amp; SEO Services I Provide</h1>
      <p className="space-body">
        Expert full stack development services in Perth, Western Australia. Custom web applications,
        AI integration, and enterprise solutions for businesses across Australia.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1rem" }}>
        <a className="space-cta" href="/contact">
          Get Free Consultation →
        </a>
        <a className="space-cta" href="#services" style={{ background: "transparent", color: "#ece9e4", border: "1px solid rgba(255,255,255,0.2)" }}>
          View All Services
        </a>
      </div>
      <p className="space-mono space-hint">SCROLL TO DIVE · CLICK A PLANET TO TRAVEL ↓</p>
    </div>
  );
}

function CategoryPanel({ index }: { index: number }) {
  const category = services[index];
  const accent = ACCENT_CYCLE[index % ACCENT_CYCLE.length];
  return (
    <div className="space-wide">
      <div className="space-section-head">
        <p className="space-mono" style={{ color: accent }}>
          {String(index + 1).padStart(2, "0")} — SERVICES
        </p>
        <h2 className="space-h2">{category.category}</h2>
        <p className="space-body">{category.description}</p>
      </div>
      <div className="space-grid space-grid-projects">
        {category.items.map((service) => (
          <div key={service.name} className="space-card" style={accentStyle(accent)}>
            <h3 className="space-proj-title">{service.name}</h3>
            <p className="space-body space-proj-desc">{service.description}</p>
            <ul className="space-card-list" style={{ marginTop: "0.6rem" }}>
              {service.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem", fontSize: "0.8rem" }}>
              <span style={{ color: "#9aa1b2" }}>{service.timeframe}</span>
              <span style={{ color: "#34d399", fontWeight: 600 }}>{service.priceRange}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessPanel() {
  return (
    <div className="space-wide">
      <div className="space-section-head">
        <p className="space-mono">04 — PROCESS</p>
        <h2 className="space-h2">How I Work With Perth Clients</h2>
      </div>
      <div className="space-grid space-grid-skills">
        {processSteps.map((step) => (
          <div key={step.step} className="space-card">
            <p className="space-mono space-card-label" style={{ color: "#60a5fa" }}>
              STEP {step.step}
            </p>
            <h3 className="space-proj-title">{step.title}</h3>
            <p className="space-body space-proj-desc">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaPanel() {
  return (
    <div className="space-panel">
      <p className="space-mono space-card-label">05 — FINAL APPROACH</p>
      <h2 className="space-h2">Ready to Start Your Web Development Project?</h2>
      <p className="space-body">
        Get a free consultation and detailed proposal for your Perth business. No obligation, just
        expert advice and transparent pricing.
      </p>
      <a className="space-cta" href="/contact">
        Start Your Project Today →
      </a>
    </div>
  );
}

const STOPS: SpaceStop[] = [
  {
    id: "hero",
    label: "",
    anchor: 0.0,
    position: anchorToPosition(0.0, 0, 1),
    planet: { texture: "/space/2k_earth_daymap.jpg", radius: 6.5, tint: 0x5a9bff },
    contentWidth: NARROW,
    content: <HeroPanel />,
  },
  {
    id: "services-web",
    label: CATEGORY_NAV[0],
    anchor: 0.2,
    position: anchorToPosition(0.2, 0, 1),
    planet: { texture: "/space/2k_jupiter.jpg", radius: 7.5, tint: 0xe0a86a },
    contentWidth: WIDE,
    content: <CategoryPanel index={0} />,
  },
  {
    id: "services-ai",
    label: CATEGORY_NAV[1],
    anchor: 0.4,
    position: anchorToPosition(0.4, 0, 1),
    planet: { texture: "/space/2k_neptune.jpg", radius: 5.0, tint: 0x3a6ff0 },
    contentWidth: WIDE,
    content: <CategoryPanel index={1} />,
  },
  {
    id: "services-enterprise",
    label: CATEGORY_NAV[2],
    anchor: 0.6,
    position: anchorToPosition(0.6, 0, 1),
    planet: { texture: "/space/2k_saturn.jpg", radius: 4.4, tint: 0xd8c79a, ring: true },
    contentWidth: WIDE,
    content: <CategoryPanel index={2} />,
  },
  {
    id: "process",
    label: "Process",
    anchor: 0.8,
    position: anchorToPosition(0.8, 0, 1),
    contentWidth: WIDE,
    content: <ProcessPanel />,
  },
  {
    id: "start",
    label: "Start",
    anchor: 1.0,
    position: anchorToPosition(1.0, 0, 1),
    planet: { texture: "/space/2k_venus_surface.jpg", radius: 4.0, tint: 0xe8c98a },
    contentWidth: NARROW,
    content: <CtaPanel />,
  },
];

export default function ServicesExperience() {
  return <SpacePageShell stops={STOPS} />;
}
