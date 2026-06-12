"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "motion/react";
import { EASE_SIGNATURE } from "@/lib/motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

// Map a direction + distance to its hidden-state offset.
function directionOffset(
  direction: "up" | "down" | "left" | "right" | "none",
  distance: number
): { x?: number; y?: number } {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    case "none":
    default:
      return {};
  }
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 40,
  duration = 700,
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();

  // Reduced motion: render the static end-state immediately (parity with the
  // previous early-return that set isVisible to true with no transition).
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const offset = directionOffset(direction, distance);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: EASE_SIGNATURE,
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation wrapper
export function StaggerReveal({
  children,
  className = "",
  staggerDelay = 100,
  direction = "up" as "up" | "down" | "left" | "right" | "none",
  baseDelay = 0,
}: {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  baseDelay?: number;
}) {
  // Preserve the incremental-delay mapping (and `once` semantics via the inner
  // ScrollReveal default) so the prop shape and behavior stay identical while
  // each child now reveals on motion v12.
  return (
    <div className={className}>
      {children.map((child, i) => (
        <ScrollReveal key={i} delay={baseDelay + i * staggerDelay} direction={direction}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}

// Counter animation for stats
export function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
  className = "",
}: {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // rAF count-up with ease-out cubic, gated by viewport entry via motion's
  // onViewportEnter. Reduced motion shows the final number immediately.
  const runCountUp = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    if (reduce) {
      setCount(target);
      return;
    }

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  return (
    <motion.span
      className={className}
      // amount 0.5 mirrors the previous IntersectionObserver threshold.
      viewport={{ once: true, amount: 0.5 }}
      onViewportEnter={runCountUp}
    >
      {count}{suffix}
    </motion.span>
  );
}

// Magnetic hover effect for buttons/links
export function MagneticHover({
  children,
  className = "",
  strength = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Spring toward the cursor offset; springs back to 0 on leave. Restraint:
  // a soft, damped spring rather than a 1:1 follow.
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  // Desktop-only: skip the effect on touch devices or when reduced motion is on.
  const enabled =
    !reduce &&
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width / 2;
    const dy = e.clientY - rect.top - rect.height / 2;
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: "inline-block", x: enabled ? x : 0, y: enabled ? y : 0 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}

// Text reveal animation (character by character)
export function TextReveal({
  text,
  className = "",
  delay = 0,
  charDelay = 30,
}: {
  text: string;
  className?: string;
  delay?: number;
  charDelay?: number;
}) {
  const reduce = useReducedMotion();

  // Reduced motion: plain text, no per-character animation.
  if (reduce) {
    return (
      <span className={className} aria-label={text}>
        {text}
      </span>
    );
  }

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay / 1000,
        staggerChildren: charDelay / 1000,
      },
    },
  };

  const char: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: EASE_SIGNATURE },
    },
  };

  return (
    <motion.span
      className={className}
      aria-label={text}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {text.split("").map((c, i) => (
        <motion.span
          key={i}
          variants={char}
          style={{
            display: "inline-block",
            whiteSpace: c === " " ? "pre" : undefined,
          }}
        >
          {c}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Parallax scroll effect
export function ParallaxSection({
  children,
  className = "",
  speed = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Only engage the scroll-linked transform after mount and when motion is
  // allowed — keeps it gentle and respects reduced-motion (no transform).
  useEffect(() => {
    setEnabled(!reduce);
  }, [reduce]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle translateY across the element's scroll range. `speed` scales the
  // travel; kept intentionally small (anti-feature: no deep stacked parallax).
  const range = 100 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  return (
    <motion.div ref={ref} className={className} style={{ y: enabled ? y : 0 }}>
      {children}
    </motion.div>
  );
}
