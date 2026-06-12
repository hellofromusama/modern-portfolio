import type { Variants, Transition } from "motion/react";

/**
 * Shared motion v12 presets — the single easing/duration source for the 17
 * components. No "use client": this is plain data (no hooks/state), safely
 * imported by both server and client modules.
 *
 * Consumers honor `useReducedMotion()` — when reduced, swap `y: 40 -> y: 0`
 * (no transform) so motion respects prefers-reduced-motion. This module is
 * consumed by the ScrollReveal rewrite in Phase 5.
 */

/** Matches the existing signature easing `cubic-bezier(0.16, 1, 0.3, 1)`. */
export const EASE_SIGNATURE = [0.16, 1, 0.3, 1] as const;

/** Shared transitions: `base` (0.7s) for sections, `quick` (0.4s) for micro-interactions. */
export const transitions = {
  base: { duration: 0.7, ease: EASE_SIGNATURE } satisfies Transition,
  quick: { duration: 0.4, ease: EASE_SIGNATURE } satisfies Transition,
} as const;

/** Fade-and-rise variant: hidden (opacity 0, y 40) -> visible (opacity 1, y 0). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

/** Container variant factory that staggers child reveals by `gap` seconds. */
export const stagger = (gap = 0.1): Variants => ({
  visible: { transition: { staggerChildren: gap } },
});
