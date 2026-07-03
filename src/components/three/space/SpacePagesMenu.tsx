"use client";

import { useState } from "react";

const MONO = "var(--font-jetbrains-mono), ui-monospace, monospace";

// All 10 site pages as PLAIN <a href> links: a full page load re-reads the
// space-mode cookie server-side, so each target renders as its own dive.
const PAGES: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Expertise", href: "/expertise" },
  { label: "Tech Stack", href: "/tech-stack" },
  { label: "Team", href: "/team" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Budget", href: "/budget" },
  { label: "Ideas", href: "/ideas" },
  { label: "Fund Me", href: "/fund-me" },
];

/**
 * Shared PAGES glass dropdown for BOTH HUDs (SpaceHUD + ShellHUD). The HUD root
 * layer is pointerEvents:none, so the trigger AND the open menu both set
 * pointerEvents:auto explicitly. Styled to match the existing HUD mono buttons.
 */
export default function SpacePagesMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", pointerEvents: "auto" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open pages menu"
        style={{
          pointerEvents: "auto",
          cursor: "pointer",
          background: "transparent",
          border: "none",
          fontFamily: MONO,
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: open ? "#ffffff" : "#9aa1b2",
        }}
      >
        Pages ▾
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            right: 0,
            zIndex: 20,
            pointerEvents: "auto",
            minWidth: "180px",
            maxHeight: "min(60vh, 420px)",
            overflowY: "auto",
            padding: "0.5rem",
            borderRadius: "14px",
            background: "rgba(18, 22, 36, 0.85)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.13)",
          }}
        >
          {PAGES.map((p) => (
            <a
              key={p.href}
              href={p.href}
              role="menuitem"
              style={{
                display: "block",
                padding: "0.45rem 0.9rem",
                fontFamily: MONO,
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#9aa1b2",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#9aa1b2";
              }}
            >
              {p.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
