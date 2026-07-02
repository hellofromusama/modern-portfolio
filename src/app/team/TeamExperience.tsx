"use client";

import SpacePageShell from "@/components/three/space/SpacePageShell";
import { anchorToPosition, type SpaceStop } from "@/components/three/space/shellSpec";
import TeamSection from "@/components/TeamSection";

/**
 * /team as a space dive floating the REAL <TeamSection/> VERBATIM. Mirrors /space's
 * TeamContent: the .space-team scope (space-dom.css) transparent-izes TeamSection's
 * <section> and neutralizes its lg:sticky column so the 2-col layout resolves inside
 * the width-bounded transformed <Html> — WITHOUT editing TeamSection.tsx. The team
 * stop is interactive:true so the panel settles and Usama's LinkedIn/X/GitHub social
 * links (target="_blank") are clickable. (The "#" placeholder socials on the two
 * juniors are inert by design — unchanged.)
 */

const NARROW = "min(92vw, 640px)";
const WIDE = "min(92vw, 1100px)";

const heroPanel = (
  <div className="space-panel space-hero">
    <p className="space-mono space-eyebrow">◦ TEAM</p>
    <h1 className="space-h1">Our team.</h1>
    <p className="space-body">Meet the talented individuals who make our vision a reality</p>
    <p className="space-mono space-hint">SCROLL TO DIVE · CLICK A PLANET TO TRAVEL ↓</p>
  </div>
);

const teamPanel = (
  <div className="space-team space-wide">
    <TeamSection />
  </div>
);

const STOPS: SpaceStop[] = [
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
    id: "team",
    label: "Team",
    anchor: 1.0,
    position: anchorToPosition(1.0, 0, 1),
    planet: { texture: "/space/2k_saturn.jpg", radius: 4.4, tint: 0xd8c79a, ring: true },
    contentWidth: WIDE,
    content: teamPanel,
    interactive: true, // settle the dive so the social links are stable to click
  },
];

export default function TeamExperience() {
  return <SpacePageShell stops={STOPS} scrollVh={420} />;
}
