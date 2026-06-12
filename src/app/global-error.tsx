"use client";

import { useEffect } from "react";

/**
 * Root-level error boundary (Next.js App Router convention).
 * global-error.tsx replaces the ENTIRE root layout when it renders, so it
 * must provide its own <html>/<body> shell. Because it sits outside the
 * layout, the theme CSS variables are not reliably scoped here — use
 * LITERAL hex values so the fallback is always legible regardless of theme.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="en-AU">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          padding: "2rem",
          textAlign: "center",
          background: "#0a0a0f",
          color: "#fff",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ maxWidth: "28rem", color: "#a1a1aa", margin: 0 }}>
          A critical error occurred. Please try reloading the page.
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
            border: "1px solid #ffffff22",
            background: "#fff",
            color: "#0a0a0f",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
