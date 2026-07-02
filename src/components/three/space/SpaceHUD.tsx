"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SECTION_ANCHORS } from "./spaceSpec";

// Nav links = sections with a label (Hero has none).
const NAV = SECTION_ANCHORS.filter((s) => s.label);

function flyTo(anchor: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: anchor * max, behavior: "smooth" });
}

const MONO = "var(--font-jetbrains-mono), ui-monospace, monospace";
const DISPLAY = "var(--font-space-grotesk), system-ui, sans-serif";
const btn: React.CSSProperties = {
  pointerEvents: "auto",
  cursor: "pointer",
  background: "transparent",
  border: "none",
  color: "#f0eee9",
  fontSize: "1.1rem",
};

/**
 * The persistent flat HUD overlay for /space (plain DOM above the Canvas).
 *
 * Reads the eased `--space-scroll` var set by CameraRig on a rAF loop to drive the
 * right-edge FLIGHT gauge + percent and the active nav link, without React
 * re-renders. Nav links smooth-scroll to section anchors; the theme toggle swaps
 * the HUD accent (#60a5fa <-> #fbbf24); the sound toggle ramps an ambient
 * three-sine drone (off by default).
 */
export default function SpaceHUD() {
  const [alt, setAlt] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const router = useRouter();

  // Clear the space-mode cookie (max-age=0) and refresh -> whole site returns to classic.
  const exitSpace = useCallback(() => {
    document.cookie =
      "space-mode=off; path=/; max-age=0; samesite=lax" +
      (location.protocol === "https:" ? "; secure" : "");
    router.refresh();
  }, [router]);

  const gaugeFillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const audioRef = useRef<{ ctx: AudioContext; gain: GainNode; oscs: OscillatorNode[] } | null>(null);

  const accent = alt ? "#fbbf24" : "#60a5fa";

  // rAF: --space-scroll -> gauge height + percent + active nav (no re-render).
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const t =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--space-scroll")
        ) || 0;
      if (gaugeFillRef.current) gaugeFillRef.current.style.height = `${t * 100}%`;
      if (percentRef.current)
        percentRef.current.textContent = String(Math.round(t * 100)).padStart(2, "0");
      let nearest = 0;
      let best = Infinity;
      for (let i = 0; i < NAV.length; i++) {
        const d = Math.abs(NAV[i].anchor - t);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      navRefs.current.forEach((el, i) => {
        if (el) el.style.color = i === nearest ? "#ffffff" : "#9aa1b2";
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggleSound = useCallback(() => {
    setAudioOn((on) => {
      const next = !on;
      try {
        if (next) {
          if (!audioRef.current) {
            const Ctx =
              window.AudioContext ||
              (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const ctx = new Ctx();
            const gain = ctx.createGain();
            gain.gain.value = 0;
            gain.connect(ctx.destination);
            const oscs = [55, 82.4, 110].map((f) => {
              const o = ctx.createOscillator();
              o.type = "sine";
              o.frequency.value = f;
              o.connect(gain);
              o.start();
              return o;
            });
            audioRef.current = { ctx, gain, oscs };
          }
          const { ctx, gain } = audioRef.current;
          if (ctx.state === "suspended") ctx.resume();
          gain.gain.cancelScheduledValues(ctx.currentTime);
          gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 1.2);
        } else if (audioRef.current) {
          const { ctx, gain } = audioRef.current;
          gain.gain.cancelScheduledValues(ctx.currentTime);
          gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        }
      } catch {
        /* Web Audio unsupported — ignore, drone just stays off. */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.oscs.forEach((o) => o.stop());
          audioRef.current.ctx.close();
        } catch {
          /* already closed */
        }
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        ["--hud-accent" as string]: accent,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.5rem",
          gap: "1rem",
        }}
      >
        {/* Top-left: monogram + label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: "1.4rem",
              background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            UJ
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#9aa1b2",
              lineHeight: 1.3,
            }}
          >
            Usama Javed
            <br />
            Creative Dev
          </span>
        </div>

        {/* Top-center: glass nav */}
        <nav
          style={{
            display: "flex",
            gap: "1.25rem",
            padding: "0.5rem 1rem",
            borderRadius: "100px",
            background: "rgba(18, 22, 36, 0.38)",
            backdropFilter: "blur(18px) saturate(1.25)",
            WebkitBackdropFilter: "blur(18px) saturate(1.25)",
            border: "1px solid rgba(255, 255, 255, 0.13)",
          }}
        >
          {NAV.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                navRefs.current[i] = el;
              }}
              onClick={() => flyTo(s.anchor)}
              style={{
                ...btn,
                fontFamily: MONO,
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#9aa1b2",
              }}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Top-right: theme + sound toggles */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            onClick={exitSpace}
            aria-label="Return to classic site"
            style={{
              ...btn,
              color: "#9aa1b2",
              fontFamily: MONO,
              fontSize: "0.68rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            ◄ Classic
          </button>
          <button
            onClick={() => setAlt((a) => !a)}
            aria-label="Toggle theme accent"
            style={{ ...btn, color: accent }}
          >
            {alt ? "☀" : "☾"}
          </button>
          <button
            onClick={toggleSound}
            aria-label="Toggle ambient sound"
            style={{ ...btn, color: audioOn ? accent : "#9aa1b2" }}
          >
            {audioOn ? "♫" : "♪"}
          </button>
        </div>
      </div>

      {/* Right edge: vertical FLIGHT gauge + percent */}
      <div
        style={{
          position: "absolute",
          right: "1.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            color: "#8b93a6",
            writingMode: "vertical-rl",
          }}
        >
          FLIGHT
        </span>
        <div
          style={{
            position: "relative",
            width: "4px",
            height: "180px",
            borderRadius: "100px",
            background: "rgba(255, 255, 255, 0.1)",
            overflow: "hidden",
          }}
        >
          <div
            ref={gaugeFillRef}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "0%",
              borderRadius: "100px",
              background: "linear-gradient(to top, #60a5fa, #a78bfa)",
            }}
          />
        </div>
        <span
          style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.1em", color: "#9aa1b2" }}
        >
          <span ref={percentRef}>00</span>%
        </span>
      </div>

      {/* Bottom progress bar — driven purely by --space-scroll. */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "2px",
          transformOrigin: "left",
          transform: "scaleX(var(--space-scroll, 0))",
          background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
        }}
      />
    </div>
  );
}
