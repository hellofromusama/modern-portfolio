"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const MONO = "var(--font-jetbrains-mono), ui-monospace, monospace";

/**
 * Intro loader — a full-screen #05060a overlay with a counter 0->100 (~1.5s) and
 * the label "CALIBRATING FLIGHT PATH", then a fade-out + unmount. Under reduced
 * motion it completes faster but still shows briefly. Cleans up its interval.
 */
export default function SpaceLoader() {
  const prefersReduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 7 + 3 + (prefersReduced ? 22 : 0);
      if (v >= 100) {
        setCount(100);
        clearInterval(id);
        setFading(true);
        setTimeout(() => setGone(true), 800);
      } else {
        setCount(Math.floor(v));
      }
    }, 45);
    return () => clearInterval(id);
  }, [prefersReduced]);

  if (gone) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "#05060a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        opacity: fading ? 0 : 1,
        transition: "opacity 800ms ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: "3rem", fontWeight: 700, color: "#f0eee9" }}>
        {String(count).padStart(3, "0")}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: "0.75rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#9aa1b2",
        }}
      >
        Calibrating Flight Path
      </div>
    </div>
  );
}
