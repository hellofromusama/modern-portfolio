"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

interface AnimationGateOptions {
  rootMargin?: string;
  threshold?: number;
}

/**
 * Single source of truth for whether an animation should run.
 *
 * Composes the three gates every animated component needs:
 *  - prefersReduced: from motion/react useReducedMotion (the ONE reduced-motion source)
 *  - inView:         IntersectionObserver on the supplied ref (off-screen = paused)
 *  - tabVisible:     document.visibilitychange (background tab = paused)
 *
 * shouldAnimate = !prefersReduced && inView && tabVisible
 *
 * Consume this once instead of hand-rolling matchMedia + IO + visibility loops
 * per component.
 */
export function useAnimationGate<T extends Element>(
  ref: React.RefObject<T | null>,
  opts?: AnimationGateOptions
): { shouldAnimate: boolean; prefersReduced: boolean; inView: boolean; tabVisible: boolean } {
  const rootMargin = opts?.rootMargin ?? "200px";
  const threshold = opts?.threshold ?? 0;

  // useReducedMotion is SSR-safe by design (returns null/false on server).
  const prefersReduced = useReducedMotion() ?? false;

  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  // IntersectionObserver: toggle inView as the element enters/leaves the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        setInView(entries[0]?.isIntersecting ?? false);
      },
      { rootMargin, threshold }
    );
    io.observe(el);

    return () => {
      io.disconnect();
    };
  }, [ref, rootMargin, threshold]);

  // Tab visibility: pause animation when the tab is backgrounded.
  useEffect(() => {
    const update = () => {
      setTabVisible(document.visibilityState === "visible");
    };
    update(); // seed once on mount (client-only)

    document.addEventListener("visibilitychange", update);
    return () => {
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return {
    shouldAnimate: !prefersReduced && inView && tabVisible,
    prefersReduced,
    inView,
    tabVisible,
  };
}
