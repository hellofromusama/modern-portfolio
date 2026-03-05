"use client";

import { useRef, useState, useCallback } from "react";

interface RipplePoint {
  x: number;
  y: number;
  id: number;
}

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
  const [ripples, setRipples] = useState<RipplePoint[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rippleId = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const id = ++rippleId.current;
      setRipples((prev) => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
      onClick?.();
    },
    [onClick]
  );

  const variantStyles: Record<string, { bg: string; color: string; border: string; ripple: string; glow: string }> = {
    primary: {
      bg: "var(--btn-primary-bg)",
      color: "var(--btn-primary-text)",
      border: "none",
      ripple: "rgba(0,0,0,0.15)",
      glow: "var(--btn-primary-shadow)",
    },
    secondary: {
      bg: "transparent",
      color: "var(--btn-secondary-text)",
      border: "1px solid var(--btn-secondary-border)",
      ripple: "var(--border-subtle)",
      glow: "var(--border-subtle)",
    },
    ghost: {
      bg: "transparent",
      color: "var(--text-muted)",
      border: "none",
      ripple: "var(--border-subtle)",
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
    transform: isHovered ? "translateY(-1px)" : "translateY(0)",
    boxShadow: isHovered ? `0 4px 12px ${s.glow}` : "none",
  };

  const props = {
    ref,
    className: `relative overflow-hidden rounded-xl font-medium tracking-wide transition-all duration-300 cursor-pointer inline-flex items-center gap-2 ${sizes[size]} ${className}`,
    style: buttonStyle,
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onClick: handleClick,
  };

  const inner = (
    <>
      {isHovered && (
        <div
          className="absolute pointer-events-none transition-opacity duration-200"
          style={{
            width: 120, height: 120, borderRadius: "50%",
            background: `radial-gradient(circle, ${s.glow} 0%, transparent 70%)`,
            left: mousePos.x - 60, top: mousePos.y - 60,
          }}
        />
      )}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x, top: ripple.y, width: 0, height: 0,
            background: s.ripple,
            transform: "translate(-50%, -50%)",
            animation: "ripple-expand 0.6s ease-out forwards",
          }}
        />
      ))}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <style jsx>{`
        @keyframes ripple-expand {
          to { width: 300px; height: 300px; opacity: 0; }
        }
      `}</style>
    </>
  );

  if (href) {
    return (
      <a {...props} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        {inner}
      </a>
    );
  }
  return <button {...props}>{inner}</button>;
}
