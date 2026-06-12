"use client";

interface ScenePosterProps {
  className?: string;
  /**
   * Visual variant. "default" keeps the original Phase-4 backdrop; "hero" adds a
   * second, centered accent glow that mirrors the icosahedron-glow of the WebGL
   * hero so the canvas fades in over a matching backdrop with zero CLS.
   */
  variant?: "default" | "hero";
}

// Token-only backgrounds. Listed innermost (top) glow first per CSS layering.
const DEFAULT_BG =
  "radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--accent-blue) 18%, transparent), transparent 60%), " +
  "linear-gradient(160deg, var(--bg-secondary), var(--bg-primary))";

// Hero variant: a centered icosahedron-style glow (blue core + violet halo)
// over the same base gradient — all from tokens, so it follows data-theme.
const HERO_BG =
  "radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--accent-blue) 22%, transparent), transparent 55%), " +
  "radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--accent-violet) 12%, transparent), transparent 70%), " +
  "linear-gradient(160deg, var(--bg-secondary), var(--bg-primary))";

/**
 * Static, theme-token-driven poster for the WebGL island.
 *
 * Serves four roles, all without a single JS timer or animation loop:
 *  - the dynamic-import `loading` view (instantly painted -> the LCP element)
 *  - the IslandBoundary `fallback` (a render throw inside the Canvas degrades here)
 *  - the reduced-motion view
 *  - the WebGL-unavailable / context-loss view
 *
 * Fills its parent (100% x 100%) so mounting the live Canvas on top of it causes
 * ZERO layout shift (PERF-01). Theme-aware for free via CSS custom properties —
 * no hardcoded hex, so it follows `data-theme` automatically.
 */
export default function ScenePoster({
  className,
  variant = "default",
}: ScenePosterProps) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: variant === "hero" ? HERO_BG : DEFAULT_BG,
      }}
    />
  );
}
