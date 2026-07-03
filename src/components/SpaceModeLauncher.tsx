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
    <button
      onClick={enter}
      aria-label="Enter Space Mode"
      className="fixed right-4 bottom-4 z-50 px-4 py-2 rounded-full text-sm backdrop-blur-md transition-all duration-500 cursor-pointer hover:[border-color:var(--border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      style={{
        background: "var(--bg-elevated)",
        color: "var(--text-secondary)",
        border: "1px solid var(--border-default)",
      }}
    >
      Space Mode
    </button>
  );
}
