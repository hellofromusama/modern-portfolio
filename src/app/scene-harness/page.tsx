"use client";

import { useState } from "react";
import ClientScene from "@/components/three/ClientScene";

/**
 * Isolated, dev-only verification harness for the WebGL island (FOUND-04 /
 * PERF-01 / SHIP-01 evidence route). NOT a designed page — it is throwaway.
 *
 * It is the ONE route that mounts <ClientScene/> this phase, proving the island
 * renders end-to-end (poster-first, theme-reactive, frameloop-gated,
 * error-isolated) WITHOUT touching the live Canvas-2D hero on `/`.
 *
 * Non-discoverable: the sibling server layout sets robots noindex/nofollow and
 * this route is intentionally absent from sitemap.ts / robots.ts / Navigation.
 *
 * TEMPORARY: Phase 5 swaps the real scene onto the live hero and DELETES this
 * directory + its bundle-gate allow-entry.
 */
export default function SceneHarnessPage() {
  // Inline theme flip so the evidence checkpoint can toggle data-theme without
  // depending on Navigation (which is not rendered on this bare route). Mirrors
  // ThemeToggle's mechanism: it sets data-theme on <html>; the CSS-var bridge
  // (useThemeColors) repaints the icosahedron edge color with no remount.
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "1.5rem",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
          Scene Harness (dev-only)
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Isolated ClientScene mount. Toggle the theme and watch the icosahedron
          edge color change live with no remount.
        </p>
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border-default)",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
        >
          Toggle theme (current: {theme})
        </button>
      </div>

      {/* Sized container so the canvas (and the poster it sits on) have real
          dimensions — poster is 100%/100% of this box, so canvas→poster swap
          is zero-CLS. */}
      <div style={{ width: "100%", height: "70vh", position: "relative" }}>
        <ClientScene className="scene-harness-canvas" />
      </div>
    </main>
  );
}
