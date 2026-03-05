"use client";

import React from "react";

/* ---------------------------------------------------------------------------
 * Shared types, constants & keyframe styles
 * --------------------------------------------------------------------------- */

interface IconProps {
  className?: string;
  size?: number;
}

const CYCLE_MS = 3000;
const HALF_MS = CYCLE_MS / 2;

/**
 * Inject the keyframes once into the document head.
 * Works safely with SSR because it guards on `typeof document`.
 */
const STYLE_ID = "animated-icons-keyframes";

function ensureKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes ai-fade-in {
      0%   { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes ai-fade-out {
      0%   { opacity: 1; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

/* ---------------------------------------------------------------------------
 * Shared wrapper that renders two cross-fading SVG path groups
 * --------------------------------------------------------------------------- */

interface MorphIconProps extends IconProps {
  pathA: React.ReactNode;
  pathB: React.ReactNode;
  /** Extra SVG attributes forwarded to the root <svg> */
  svgProps?: React.SVGProps<SVGSVGElement>;
}

function MorphIcon({ className, size = 24, pathA, pathB, svgProps }: MorphIconProps) {
  React.useEffect(() => {
    ensureKeyframes();
  }, []);

  const dur = `${CYCLE_MS}ms`;
  const half = `${HALF_MS}ms`;

  /*
   * State A: visible 0 -> HALF, hidden HALF -> CYCLE
   * State B: hidden 0 -> HALF, visible HALF -> CYCLE
   *
   * We achieve this with two groups whose opacity alternates via CSS
   * animation with appropriate delays.
   *
   * Group A: fade-out at 0s, fade-in at HALF — but CSS animation
   * iteration-count:infinite replays automatically.
   *
   * Simpler approach: one animation that goes 1 -> 0 -> 1 for A,
   * and 0 -> 1 -> 0 for B over the full cycle duration.
   */

  const sharedGroupStyle: React.CSSProperties = {
    animationDuration: dur,
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...svgProps}
    >
      {/* State A */}
      <g
        style={{
          ...sharedGroupStyle,
          animationName: "ai-fade-out",
          animationDelay: half,
          opacity: 1,
          animationFillMode: "both",
          animationDirection: "alternate",
        }}
      >
        {pathA}
      </g>

      {/* State B */}
      <g
        style={{
          ...sharedGroupStyle,
          animationName: "ai-fade-in",
          animationDelay: half,
          opacity: 0,
          animationFillMode: "both",
          animationDirection: "alternate",
        }}
      >
        {pathB}
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * 1. LoadingSuccess — spinner circle <-> checkmark
 * --------------------------------------------------------------------------- */

export function LoadingSuccess(props: IconProps) {
  return (
    <MorphIcon
      {...props}
      pathA={
        <>
          <circle cx="12" cy="12" r="9" strokeDasharray="40 20" />
        </>
      }
      pathB={
        <>
          <circle cx="12" cy="12" r="9" />
          <polyline points="8 12 11 15 16 9" />
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------------------
 * 2. PlayPause — play triangle <-> pause bars
 * --------------------------------------------------------------------------- */

export function PlayPause(props: IconProps) {
  return (
    <MorphIcon
      {...props}
      pathA={<polygon points="6,4 20,12 6,20" />}
      pathB={
        <>
          <line x1="8" y1="5" x2="8" y2="19" />
          <line x1="16" y1="5" x2="16" y2="19" />
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------------------
 * 3. LockUnlock — locked padlock <-> unlocked padlock
 * --------------------------------------------------------------------------- */

export function LockUnlock(props: IconProps) {
  return (
    <MorphIcon
      {...props}
      pathA={
        <>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </>
      }
      pathB={
        <>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0" />
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------------------
 * 4. MenuClose — hamburger menu <-> X close
 * --------------------------------------------------------------------------- */

export function MenuClose(props: IconProps) {
  return (
    <MorphIcon
      {...props}
      pathA={
        <>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </>
      }
      pathB={
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------------------
 * 5. MailOpen — closed envelope <-> open envelope
 * --------------------------------------------------------------------------- */

export function MailOpen(props: IconProps) {
  return (
    <MorphIcon
      {...props}
      pathA={
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <polyline points="3,5 12,13 21,5" />
        </>
      }
      pathB={
        <>
          <path d="M3 10l9 6 9-6" />
          <path d="M3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9" />
          <path d="M3 10l9-7 9 7" />
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------------------
 * 6. EyeHidden — open eye <-> eye with slash
 * --------------------------------------------------------------------------- */

export function EyeHidden(props: IconProps) {
  return (
    <MorphIcon
      {...props}
      pathA={
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
        </>
      }
      pathB={
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------------------
 * 7. MicMuted — active microphone <-> muted microphone
 * --------------------------------------------------------------------------- */

export function MicMuted(props: IconProps) {
  return (
    <MorphIcon
      {...props}
      pathA={
        <>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <line x1="12" y1="17" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </>
      }
      pathB={
        <>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <line x1="12" y1="17" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------------------
 * 8. WifiOff — wifi signal <-> no signal
 * --------------------------------------------------------------------------- */

export function WifiOff(props: IconProps) {
  return (
    <MorphIcon
      {...props}
      pathA={
        <>
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M5 12.55a11 11 0 0 1 14 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1" fill="currentColor" />
        </>
      }
      pathB={
        <>
          <path d="M1.42 9a16 16 0 0 1 21.16 0" strokeDasharray="4 3" />
          <path d="M5 12.55a11 11 0 0 1 14 0" strokeDasharray="4 3" />
          <circle cx="12" cy="20" r="1" fill="currentColor" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------------------
 * 9. BellSilent — bell <-> bell with slash
 * --------------------------------------------------------------------------- */

export function BellSilent(props: IconProps) {
  return (
    <MorphIcon
      {...props}
      pathA={
        <>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </>
      }
      pathB={
        <>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------------------
 * 10. HeartBroken — full heart <-> broken heart
 * --------------------------------------------------------------------------- */

export function HeartBroken(props: IconProps) {
  return (
    <MorphIcon
      {...props}
      pathA={
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      }
      pathB={
        <>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          <polyline points="12,5.67 10,10 14,12 12,17" />
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------------------
 * 11. SunMoon — sun <-> crescent moon
 * --------------------------------------------------------------------------- */

export function SunMoon(props: IconProps) {
  return (
    <MorphIcon
      {...props}
      pathA={
        <>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </>
      }
      pathB={
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      }
    />
  );
}

/* ---------------------------------------------------------------------------
 * 12. CodeTerminal — code brackets <-> terminal prompt
 * --------------------------------------------------------------------------- */

export function CodeTerminal(props: IconProps) {
  return (
    <MorphIcon
      {...props}
      pathA={
        <>
          <polyline points="16,18 22,12 16,6" />
          <polyline points="8,6 2,12 8,18" />
        </>
      }
      pathB={
        <>
          <polyline points="4,17 10,11 4,5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------------------
 * Showcase grid
 * --------------------------------------------------------------------------- */

const ALL_ICONS: { name: string; Component: React.FC<IconProps> }[] = [
  { name: "LoadingSuccess", Component: LoadingSuccess },
  { name: "PlayPause", Component: PlayPause },
  { name: "LockUnlock", Component: LockUnlock },
  { name: "MenuClose", Component: MenuClose },
  { name: "MailOpen", Component: MailOpen },
  { name: "EyeHidden", Component: EyeHidden },
  { name: "MicMuted", Component: MicMuted },
  { name: "WifiOff", Component: WifiOff },
  { name: "BellSilent", Component: BellSilent },
  { name: "HeartBroken", Component: HeartBroken },
  { name: "SunMoon", Component: SunMoon },
  { name: "CodeTerminal", Component: CodeTerminal },
];

export function AnimatedIconShowcase({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: "2rem",
        padding: "2rem",
      }}
    >
      {ALL_ICONS.map(({ name, Component }) => (
        <div
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Component size={48} />
          <span
            style={{
              fontSize: "0.75rem",
              opacity: 0.7,
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}
