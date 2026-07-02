"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Global floating "Space Mode" ENTER launcher — mounted once in the root layout so
 * it appears on EVERY classic page (including nav-less routes like /services, /blog).
 *
 * SSR-safe by design: server render + first client render both produce `null` (the
 * mounted-guard, mirroring ThemeToggle), so there is NO hydration mismatch. The
 * cookie read AFTER mount governs ONLY this launcher's own visibility (chrome) — it
 * NEVER decides the page render. Page mode is decided SSR by getSpaceMode() in each
 * wrapper. Clicking writes the space-mode cookie + router.refresh() (no full reload).
 */
export default function SpaceModeLauncher() {
  const [mounted, setMounted] = useState(false);
  const [inSpace, setInSpace] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setInSpace(document.cookie.split("; ").some((c) => c === "space-mode=on"));
    setMounted(true);
  }, []);

  // Chrome only: render nothing until mounted (identical to SSR markup -> no
  // hydration mismatch), and hide when a fresh load lands in space mode (the space
  // HUD owns the exit control).
  if (!mounted || inSpace) return null;

  const enter = () => {
    document.cookie = `space-mode=on; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax${
      location.protocol === "https:" ? "; secure" : ""
    }`;
    router.refresh();
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
        opacity: mounted ? 1 : 0,
      }}
    >
      Space Mode
    </button>
  );
}
