"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * CSS-var -> string color bridge for canvas/WebGL consumers.
 *
 * Reads getComputedStyle(documentElement) ONCE on mount and again only when the
 * root `data-theme` attribute changes (via MutationObserver). Never reads
 * per-frame — animation loops should reference the cached map, not recompute it.
 *
 * Returns the raw token strings (e.g. "#60a5fa", "rgba(255,255,255,0.45)") which
 * work directly as a canvas `fillStyle`/`strokeStyle`; Phase 4 parses these to a
 * THREE.Color at the consumer.
 *
 * @param varNames CSS custom-property names, e.g. ["--accent-blue", "--text-primary"]
 * @returns Record mapping each varName to its resolved value (empty before mount)
 */
export function useThemeColors(varNames: string[]): Record<string, string> {
  const read = useCallback((): Record<string, string> => {
    const cs = getComputedStyle(document.documentElement);
    return Object.fromEntries(
      varNames.map((v) => [v, cs.getPropertyValue(v).trim()])
    );
  }, [varNames]);

  const [colors, setColors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initial read (client-only — getComputedStyle is unavailable on the server).
    setColors(read());

    // Re-read only when the theme attribute flips; cache otherwise.
    const ob = new MutationObserver(() => {
      setColors(read());
    });
    ob.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      ob.disconnect();
    };
  }, [read]);

  return colors;
}
