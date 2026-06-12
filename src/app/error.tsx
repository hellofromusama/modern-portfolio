"use client";

import { useEffect } from "react";

/**
 * Route-level client error boundary (Next.js App Router convention).
 * Catches render/runtime errors in the route segment and renders a
 * themed recovery screen with a reset() retry. Uses the theme CSS
 * variables so it adapts to both dark and light themes.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "2rem",
        textAlign: "center",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <h1
        style={{
          fontSize: "var(--text-3xl, 1.875rem)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        Something went wrong
      </h1>
      <p style={{ maxWidth: "28rem", color: "var(--text-muted)" }}>
        An unexpected error occurred while rendering this page. You can try
        again — if it keeps happening, please come back shortly.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          marginTop: "0.5rem",
          padding: "0.625rem 1.5rem",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          cursor: "pointer",
          border: "none",
          background: "var(--btn-primary-bg)",
          color: "var(--btn-primary-text)",
          boxShadow: "var(--btn-primary-shadow)",
        }}
      >
        Try again
      </button>
    </div>
  );
}
