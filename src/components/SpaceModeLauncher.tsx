"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global floating "Space Mode" ENTER launcher — mounted once in the root layout so
 * it appears on EVERY classic page (including nav-less routes like /services, /blog).
 *
 * SSR-safe: server render + first client render both produce `null` (mounted-guard,
 * like ThemeToggle) -> no hydration mismatch. It hides whenever the space experience
 * is showing — the always-space `/space` route, or any route carrying the space-mode
 * cookie. Entering does a FULL page reload (NOT router.refresh) so every persistent
 * layout island — this launcher AND the classic footer + fund-me widget — re-reads
 * the cookie and disappears; the space HUD's "Classic" button owns the exit.
 */
export default function SpaceModeLauncher() {
  const [mounted, setMounted] = useState(false);
  const [inSpace, setInSpace] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setInSpace(document.cookie.split("; ").some((c) => c === "space-mode=on"));
    setMounted(true);
  }, []);

  // Chrome only: nothing until mounted (matches SSR markup), and hidden whenever the
  // space experience is on screen (the /space route or a space-mode cookie).
  if (!mounted || inSpace || pathname === "/space") return null;

  const enter = () => {
    document.cookie = `space-mode=on; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax${
      location.protocol === "https:" ? "; secure" : ""
    }`;
    window.location.reload();
  };

  return (
    // Slot rationale: the fixed Navigation occupies top-0 with an h-16 row, and
    // VisitorTracker.tsx (classic homepage) already sits at fixed top-20 right-4 z-50
    // (a ~5s "Welcome back" toast). top-36 (9rem) right-4 is the first clear
    // right-edge slot below BOTH — same slot on every viewport so mobile users can
    // always see and tap it (py-2.5 keeps the tap target ~44px tall).
    <button
      onClick={enter}
      aria-label="Enter Space Mode"
      className="space-launcher fixed top-36 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm backdrop-blur-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      style={{
        background: "var(--bg-elevated)",
        color: "var(--text-secondary)",
      }}
    >
      <span className="launcher-rocket relative inline-flex" aria-hidden="true">
        {/* Rocket silhouette: body + fins + window circle, currentColor so it themes. */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          <circle cx="15" cy="9" r="1.4" />
        </svg>
        <span className="launcher-flame" />
      </span>
      Space Mode
      {/* CSS-only animation (repo precedent: Hero3D's styled-jsx gradient-flow).
          Decorative glow shadows use fixed accent rgba — acceptable on both themes;
          all structural colors stay on CSS variables. */}
      <style jsx>{`
        .space-launcher {
          border: 1px solid var(--border-default);
          animation: launcher-float 3s ease-in-out infinite,
            launcher-glow 1.2s ease-in-out infinite;
          transition: border-color 0.3s ease;
        }
        .space-launcher:hover {
          border-color: var(--border-hover);
        }
        .launcher-rocket {
          transition: transform 0.3s ease;
        }
        .space-launcher:hover .launcher-rocket {
          transform: rotate(-8deg) translateY(-3px);
        }
        .launcher-flame {
          position: absolute;
          left: 4px;
          bottom: -3px;
          width: 6px;
          height: 8px;
          border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
          background: linear-gradient(
            to bottom,
            var(--accent-blue),
            var(--accent-violet)
          );
          filter: blur(1px);
          transform-origin: top center;
          animation: launcher-thruster 1.2s ease-in-out infinite;
        }
        @keyframes launcher-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        @keyframes launcher-thruster {
          0%,
          100% {
            opacity: 0.45;
            transform: scaleY(0.7);
          }
          50% {
            opacity: 1;
            transform: scaleY(1.15);
          }
        }
        @keyframes launcher-glow {
          0%,
          100% {
            box-shadow: 0 0 10px rgba(96, 165, 250, 0.22),
              0 0 22px rgba(167, 139, 250, 0.12);
          }
          50% {
            box-shadow: 0 0 16px rgba(96, 165, 250, 0.4),
              0 0 30px rgba(167, 139, 250, 0.22);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .space-launcher,
          .launcher-rocket,
          .launcher-flame {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </button>
  );
}
