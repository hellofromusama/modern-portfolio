"use client";

interface ScenePosterProps {
  className?: string;
}

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
export default function ScenePoster({ className }: ScenePosterProps) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        width: "100%",
        height: "100%",
        // Base gradient from background tokens + a subtle accent glow from
        // --accent-blue at low opacity. All token-driven -> theme-reactive.
        background:
          "radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--accent-blue) 18%, transparent), transparent 60%), " +
          "linear-gradient(160deg, var(--bg-secondary), var(--bg-primary))",
      }}
    />
  );
}
