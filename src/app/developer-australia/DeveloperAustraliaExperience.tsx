"use client";

import SpacePageShell from "@/components/three/space/SpacePageShell";
import { anchorToPosition, type SpaceStop, type ShellPlanet } from "@/components/three/space/shellSpec";
import { ACCENT_CYCLE } from "@/components/three/space/spaceSpec";
import { cities } from "./developerAustraliaData";

/**
 * /developer-australia as a space dive: the EXISTING Australia-wide landing copy +
 * city list floated verbatim as glass panels over the cosmos. Builds a stops[] config
 * from developerAustraliaData.ts + the page's verbatim literal text and renders the
 * reusable <SpacePageShell>. The single CTA is a real <a href="/contact">.
 */

const NARROW = "min(92vw, 640px)";
const WIDE = "min(92vw, 1100px)";

// Planet textures cycled per stop (hero = earth).
const PLANETS: ShellPlanet[] = [
  { texture: "/space/2k_earth_daymap.jpg", radius: 6.5, tint: 0x5a9bff },
  { texture: "/space/2k_jupiter.jpg", radius: 7.5, tint: 0xe0a86a },
  { texture: "/space/2k_neptune.jpg", radius: 5.0, tint: 0x3a6ff0 },
  { texture: "/space/2k_saturn.jpg", radius: 4.4, tint: 0xd8c79a, ring: true },
  { texture: "/space/2k_venus_surface.jpg", radius: 4.0, tint: 0xe8c98a },
];

function HeroPanel() {
  return (
    <div className="space-panel space-hero">
      <p className="space-mono space-eyebrow">◦ PERTH, AUSTRALIA — NATIONWIDE</p>
      <h1 className="space-h1">Best Developer in Australia (2026)</h1>
      <p className="space-mono">By Usama Javed · April 14, 2026</p>
      <p className="space-body">
        Usama Javed is a Senior Full Stack Developer and AI Integration Specialist based in Perth,
        Western Australia, serving clients across all Australian cities including Sydney, Melbourne,
        Brisbane, Adelaide, Canberra, Darwin, and Hobart. With 8+ years of experience and 50+
        enterprise projects delivered across government, mining, fintech, and healthcare sectors, he
        offers remote development services with proven results including platforms handling 100,000+
        concurrent users and automation solutions saving clients $180,000 per year.
      </p>
      <p className="space-mono space-hint">SCROLL TO DIVE · CLICK A PLANET TO TRAVEL ↓</p>
    </div>
  );
}

function WhyPanel() {
  return (
    <div className="space-panel space-wide">
      <div className="space-section-head">
        <p className="space-mono">01 — ADVANTAGE</p>
        <h2 className="space-h2">Why Hire a Perth Developer for Your Australian Project?</h2>
      </div>
      <p className="space-body">
        Perth developers offer a unique advantage for Australian businesses: senior-level expertise at
        competitive rates compared to Sydney and Melbourne, with same-timezone communication across all
        Australian cities. The AWST timezone (UTC+8) provides excellent overlap with AEST/AEDT business
        hours, enabling real-time collaboration.
      </p>
      <ul className="space-card-list" style={{ marginTop: "0.75rem" }}>
        <li>• Competitive rates compared to Sydney ($150-250/hr) and Melbourne ($140-220/hr)</li>
        <li>• Same-day communication across all Australian timezones</li>
        <li>• Deep expertise in WA-specific industries (mining, government, resources)</li>
        <li>• Remote work infrastructure proven across 50+ distributed projects</li>
      </ul>
    </div>
  );
}

function CitiesPanel() {
  return (
    <div className="space-wide">
      <div className="space-section-head">
        <p className="space-mono">02 — COVERAGE</p>
        <h2 className="space-h2">Developer Services Available Across Australia</h2>
      </div>
      <div className="space-grid space-grid-projects">
        {cities.map((city, i) => (
          <div key={city.name} className="space-card">
            <h3 className="space-proj-title" style={{ color: ACCENT_CYCLE[i % ACCENT_CYCLE.length] }}>
              {city.name}, {city.state}
            </h3>
            <p className="space-body space-proj-desc">{city.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsPanel() {
  return (
    <div className="space-panel space-wide">
      <div className="space-section-head">
        <p className="space-mono">03 — RESULTS</p>
        <h2 className="space-h2">Key Project Results (Australia-Wide Clients)</h2>
      </div>
      <ul className="space-card-list" style={{ marginTop: "0.5rem" }}>
        <li>• <strong>$180,000/year</strong> saved through enterprise automation (WA mining client)</li>
        <li>• <strong>500+ daily bookings</strong> handled by Voice AI agent (national services client)</li>
        <li>• <strong>100,000+ concurrent users</strong> supported on cloud platform (SaaS startup)</li>
        <li>• <strong>50,000+ daily transactions</strong> processed through NetSuite integration (retail client)</li>
        <li>• <strong>99.99% uptime</strong> maintained across all production systems</li>
      </ul>
    </div>
  );
}

function CtaPanel() {
  return (
    <div className="space-panel">
      <p className="space-mono space-card-label">04 — FINAL APPROACH</p>
      <h2 className="space-h2">Hire the Best Developer in Australia</h2>
      <p className="space-body">
        Free 30-minute consultation. Available for immediate start across all Australian cities.
      </p>
      <a className="space-cta" href="/contact">
        Book Free Consultation →
      </a>
    </div>
  );
}

const PANELS = [<HeroPanel key="h" />, <WhyPanel key="w" />, <CitiesPanel key="c" />, <ResultsPanel key="r" />, <CtaPanel key="cta" />];
const NAV = ["", "Why", "Cities", "Results", "Hire"];
const WIDTHS = [NARROW, WIDE, WIDE, WIDE, NARROW];
const IDS = ["hero", "why", "cities", "results", "cta"];

function buildStops(): SpaceStop[] {
  const total = PANELS.length;
  return PANELS.map((panel, i) => {
    const anchor = total > 1 ? i / (total - 1) : 0;
    return {
      id: IDS[i],
      label: NAV[i],
      anchor,
      position: anchorToPosition(anchor, 0, 1),
      planet: i < PLANETS.length ? PLANETS[i] : null,
      contentWidth: WIDTHS[i],
      content: panel,
    };
  });
}

const STOPS = buildStops();

export default function DeveloperAustraliaExperience() {
  return <SpacePageShell stops={STOPS} scrollVh={Math.max(420, STOPS.length * 110)} />;
}
