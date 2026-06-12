"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { EASE_SIGNATURE } from "@/lib/motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!mounted) return null;

  const isLight = theme === "light";

  // Spring for the knob slide; instant under reduced motion.
  const knobTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 500, damping: 32, mass: 0.7 };

  // Cross-fade/rotate/scale for the sun↔moon swap; instant under reduced motion.
  const iconTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: EASE_SIGNATURE };

  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-md transition-colors duration-500 cursor-pointer group hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      {/* Track background */}
      <motion.div
        className="absolute inset-0.5 rounded-full"
        initial={false}
        animate={{ backgroundColor: isLight ? "rgba(254, 243, 199, 0.2)" : "rgba(255, 255, 255, 0.03)" }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: EASE_SIGNATURE }}
      />

      {/* Sliding circle with sun/moon */}
      <motion.div
        className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center"
        initial={false}
        animate={{
          x: isLight ? 28 : 2,
          backgroundColor: isLight ? "rgb(251, 191, 36)" : "rgba(255, 255, 255, 0.8)",
          boxShadow: isLight
            ? "0 10px 15px -3px rgba(251, 191, 36, 0.3)"
            : "0 10px 15px -3px rgba(255, 255, 255, 0.1)",
        }}
        transition={knobTransition}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLight ? (
            <motion.svg
              key="sun"
              className="w-3.5 h-3.5 absolute text-amber-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              initial={reduceMotion ? false : { opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.5 }}
              transition={iconTransition}
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </motion.svg>
          ) : (
            <motion.svg
              key="moon"
              className="w-3.5 h-3.5 absolute text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              initial={reduceMotion ? false : { opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.5 }}
              transition={iconTransition}
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
