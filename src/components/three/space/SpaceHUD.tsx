"use client";

import { SECTIONS } from "./waypoints";

/**
 * Fixed glassmorphic navigation overlay for the /space experience (PROTOTYPE).
 *
 * A PLAIN DOM overlay (NOT inside the Canvas) so it uses real CSS tokens/fonts.
 * The scroll-progress bar is driven PURELY from the `--space-scroll` CSS var set
 * by CameraRig each frame — scaleX transform, zero React re-render. All colors
 * and fonts come from theme tokens, so it follows data-theme in both modes.
 * Design-agnostic stand-in: links are visual anchor stubs for the prototype.
 */
export default function SpaceHUD() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {/* Glassmorphic top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.5rem",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-subtle)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <span
          className="font-[family-name:var(--font-space-grotesk)]"
          style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)" }}
        >
          UJ
        </span>

        {/* Section links (prototype anchor stubs) */}
        <nav style={{ display: "flex", gap: "1.5rem", pointerEvents: "auto" }}>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="font-[family-name:var(--font-geist-mono)]"
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Scroll-progress indicator — driven purely by the --space-scroll CSS var. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "2px",
          transformOrigin: "left",
          transform: "scaleX(var(--space-scroll, 0))",
          background: "linear-gradient(90deg, var(--accent-blue), var(--accent-violet))",
        }}
      />
    </div>
  );
}
