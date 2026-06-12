"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { transitions } from "@/lib/motion";

interface InteractiveButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
}

export default function InteractiveButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  external = false,
}: InteractiveButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const variantStyles: Record<string, { bg: string; color: string; border: string; glow: string }> = {
    primary: {
      bg: "var(--btn-primary-bg)",
      color: "var(--btn-primary-text)",
      border: "none",
      glow: "var(--btn-primary-shadow)",
    },
    secondary: {
      bg: "transparent",
      color: "var(--btn-secondary-text)",
      border: "1px solid var(--btn-secondary-border)",
      glow: "var(--border-subtle)",
    },
    ghost: {
      bg: "transparent",
      color: "var(--text-muted)",
      border: "none",
      glow: "var(--border-subtle)",
    },
  };

  const sizes: Record<string, string> = {
    sm: "px-5 py-2 text-xs",
    md: "px-7 py-3 text-sm",
    lg: "px-9 py-4 text-base",
  };

  const s = variantStyles[variant];

  const buttonStyle: React.CSSProperties = {
    background: s.bg,
    color: s.color,
    border: s.border,
    // Glow lift via box-shadow on hover; transform handled by motion whileHover.
    boxShadow: isHovered ? `0 4px 12px ${s.glow}` : "none",
  };

  // Restraint: subtle 1px lift on hover, tiny scale-down on tap. Dropped when
  // reduced motion is requested (color/focus states still apply).
  const whileHover = reduce ? undefined : { y: -1 };
  const whileTap = reduce ? undefined : { scale: 0.98 };

  const props = {
    ref,
    className:
      "relative overflow-hidden rounded-xl font-medium tracking-wide transition-colors duration-300 cursor-pointer inline-flex items-center gap-2 " +
      "outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
      "focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-[var(--bg-primary)] " +
      `${sizes[size]} ${className}`,
    style: buttonStyle,
    whileHover,
    whileTap,
    transition: transitions.quick,
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onClick: handleClick,
  };

  const inner = (
    <>
      {isHovered && !reduce && (
        <span
          aria-hidden="true"
          className="absolute pointer-events-none transition-opacity duration-200"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${s.glow} 0%, transparent 70%)`,
            left: mousePos.x - 60,
            top: mousePos.y - 60,
          }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        {...props}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {inner}
      </motion.a>
    );
  }
  return <motion.button {...props}>{inner}</motion.button>;
}
