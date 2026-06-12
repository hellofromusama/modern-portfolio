'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAnimationGate } from '@/hooks/useAnimationGate';
import { useThemeColors } from '@/hooks/useThemeColors';

// Parse a resolved theme token (hex "#rgb"/"#rrggbb" or an rgb/rgba string) into
// an "r, g, b" channel triplet so an alpha can be interpolated at draw time.
function hexToRGBTriplet(input: string, fallback: string): string {
  const v = (input || '').trim();
  if (!v) return fallback;
  const rgbMatch = v.match(/rgba?\(([^)]+)\)/i);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(',').map((p) => p.trim());
    if (parts.length >= 3) return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
    return fallback;
  }
  let hex = v.replace('#', '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (hex.length !== 6) return fallback;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return fallback;
  return `${r}, ${g}, ${b}`;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  connections: number[];
  brightness: number;
  type: 'idea' | 'node' | 'spark';
}

interface Props {
  className?: string;
}

export default function IdeaNetworkCanvas({ className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const nodesRef = useRef<Node[]>([]);
  const timeRef = useRef(0);
  // Cached CSS size + bounding rect — read ONCE on mount/resize, never per frame
  // (research VIS-03: per-frame getBoundingClientRect() forces layout/jank).
  const rectRef = useRef({ width: 0, height: 0, left: 0, top: 0 });

  // Theme-reactive colors (closed accent set). Amber sparks map to --accent-emerald:
  // no --accent-amber token exists and the plan forbids adding a new color family,
  // so the sparks reuse emerald (the third, otherwise-unused accent) for a distinct
  // theme-aware identity. Read on mount + data-theme flip via the hook, never per-frame.
  const colors = useThemeColors(['--accent-violet', '--accent-blue', '--accent-emerald']);
  const rgbRef = useRef({
    violet: hexToRGBTriplet(colors['--accent-violet'], '139, 92, 246'),
    blue: hexToRGBTriplet(colors['--accent-blue'], '59, 130, 246'),
    spark: hexToRGBTriplet(colors['--accent-emerald'], '251, 191, 36'),
  });
  rgbRef.current.violet = hexToRGBTriplet(colors['--accent-violet'], '139, 92, 246');
  rgbRef.current.blue = hexToRGBTriplet(colors['--accent-blue'], '59, 130, 246');
  rgbRef.current.spark = hexToRGBTriplet(colors['--accent-emerald'], '251, 191, 36');

  // PERF-04: pause the rAF loop off-screen / on tab blur / under reduced motion.
  const { shouldAnimate } = useAnimationGate(canvasRef);
  // gateRef mirrors shouldAnimate so the long-lived rAF closure reads the
  // LATEST value (closures capture by value — Pitfall #2 stale-closure fix).
  const gateRef = useRef(false);
  const drawRef = useRef<(() => void) | null>(null);
  const runningRef = useRef(false);

  const init = useCallback((w: number, h: number) => {
    const nodes: Node[] = [];
    const nodeCount = 60;

    // Create main idea nodes (larger, brighter)
    for (let i = 0; i < 6; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 4 + Math.random() * 3,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        connections: [],
        brightness: 0.8 + Math.random() * 0.2,
        type: 'idea',
      });
    }

    // Create connection nodes
    for (let i = 6; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 1.5 + Math.random() * 2,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.03,
        connections: [],
        brightness: 0.3 + Math.random() * 0.4,
        type: 'node',
      });
    }

    // Create spark particles
    for (let i = 0; i < 20; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: 0.8 + Math.random() * 1,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.05 + Math.random() * 0.05,
        connections: [],
        brightness: 0.5 + Math.random() * 0.5,
        type: 'spark',
      });
    }

    // Build connections (nearest neighbors)
    const maxDist = Math.min(w, h) * 0.25;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].type === 'spark') continue;
      const distances: { idx: number; dist: number }[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j || nodes[j].type === 'spark') continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          distances.push({ idx: j, dist });
        }
      }
      distances.sort((a, b) => a.dist - b.dist);
      nodes[i].connections = distances.slice(0, 4).map(d => d.idx);
    }

    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Cache CSS size + offset so neither the draw loop nor mousemove re-reads
      // the layout. DPR capped at 2; setTransform(dpr,...) RESETS the matrix each
      // resize (no compounding scale — replaces the old ctx.scale which
      // multiplied and would accumulate if resize fired repeatedly).
      rectRef.current = {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Re-seed nodes against the CSS-pixel size (backing store / DPR aside).
      init(rect.width, rect.height);
    };

    resize();
    window.addEventListener('resize', resize);

    // Refresh only the cached OFFSET on scroll (cheap; size is unchanged so we
    // skip the canvas-resize/re-seed path). Keeps mouse mapping correct without
    // a per-frame getBoundingClientRect.
    const refreshOffset = () => {
      const rect = canvas.getBoundingClientRect();
      rectRef.current.left = rect.left;
      rectRef.current.top = rect.top;
    };
    window.addEventListener('scroll', refreshOffset, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      // Use cached offsets; scroll/resize refresh them via the listeners below.
      const r = rectRef.current;
      mouseRef.current.x = e.clientX - r.left;
      mouseRef.current.y = e.clientY - r.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let animId: number;

    const draw = () => {
      // Cached CSS size — NO per-frame getBoundingClientRect (research VIS-03).
      const w = rectRef.current.width;
      const h = rectRef.current.height;
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      // Theme-reactive channel triplets read fresh each frame from the ref (the
      // ref is updated by useThemeColors on data-theme flips; cheap string read).
      const violet = rgbRef.current.violet;
      const blue = rgbRef.current.blue;
      const spark = rgbRef.current.spark;

      // Update and rebuild connections dynamically
      const maxDist = Math.min(w, h) * 0.22;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Mouse interaction
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / 180);

          if (n.type === 'idea') {
            n.vx += dx * influence * 0.0008;
            n.vy += dy * influence * 0.0008;
          } else if (n.type === 'spark') {
            // Sparks orbit around mouse
            if (dist < 150) {
              n.vx += (-dy / dist) * 0.05 * influence;
              n.vy += (dx / dist) * 0.05 * influence;
            }
          } else {
            n.vx += dx * influence * 0.0004;
            n.vy += dy * influence * 0.0004;
          }
        }

        // Move
        n.x += n.vx;
        n.y += n.vy;

        // Damping (preserved ×0.995) + physics polish: clamp speed so sustained
        // mouse attraction/orbit can't accelerate a node into jitter, giving a
        // smoother settle. Sparks keep a higher ceiling so their orbit stays
        // lively; idea/node types settle gently. No force/behavior removed.
        n.vx *= 0.995;
        n.vy *= 0.995;
        const maxSpeed = n.type === 'spark' ? 2.4 : 1.4;
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > maxSpeed) {
          const s = maxSpeed / speed;
          n.vx *= s;
          n.vy *= s;
        }

        // Wrap around edges
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;

        // Update pulse
        n.pulsePhase += n.pulseSpeed;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.type === 'spark') continue;

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          if (m.type === 'spark') continue;

          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            const pulse = (Math.sin(t * 2 + i * 0.5) + 1) * 0.5;

            // Gradient connection lines
            if (n.type === 'idea' || m.type === 'idea') {
              const grad = ctx.createLinearGradient(n.x, n.y, m.x, m.y);
              grad.addColorStop(0, `rgba(${violet}, ${alpha * (1 + pulse * 0.5)})`);
              grad.addColorStop(1, `rgba(${blue}, ${alpha * (1 + pulse * 0.5)})`);
              ctx.strokeStyle = grad;
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = `rgba(${violet}, ${alpha * 0.5})`;
              ctx.lineWidth = 0.5;
            }

            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();

            // Traveling pulse along connection
            if (n.type === 'idea' && dist < maxDist * 0.6) {
              const pulsePos = ((t * 0.5 + i * 0.3) % 1);
              const px = n.x + (m.x - n.x) * pulsePos;
              const py = n.y + (m.y - n.y) * pulsePos;
              ctx.beginPath();
              ctx.arc(px, py, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${violet}, ${alpha * 3})`;
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const pulse = Math.sin(n.pulsePhase) * 0.5 + 0.5;
        const r = n.radius * (1 + pulse * 0.3);

        if (n.type === 'idea') {
          // Glow
          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 6);
          glow.addColorStop(0, `rgba(${violet}, ${0.15 * n.brightness})`);
          glow.addColorStop(0.5, `rgba(${violet}, ${0.05 * n.brightness})`);
          glow.addColorStop(1, `rgba(${violet}, 0)`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 6, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          // Core
          const coreGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
          coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * n.brightness})`);
          coreGrad.addColorStop(0.4, `rgba(${violet}, ${0.8 * n.brightness})`);
          coreGrad.addColorStop(1, `rgba(${violet}, ${0.3 * n.brightness})`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = coreGrad;
          ctx.fill();
        } else if (n.type === 'spark') {
          // Small bright sparks
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * (0.5 + pulse * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${spark}, ${0.4 * n.brightness * (0.5 + pulse * 0.5)})`;
          ctx.fill();
        } else {
          // Regular nodes
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${violet}, ${0.3 * n.brightness * (0.7 + pulse * 0.3)})`;
          ctx.fill();

          // Subtle ring
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 1, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${violet}, ${0.1 * n.brightness})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Mouse cursor glow
      if (mouse.active) {
        const cursorGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 120
        );
        cursorGlow.addColorStop(0, `rgba(${violet}, 0.08)`);
        cursorGlow.addColorStop(0.5, `rgba(${blue}, 0.03)`);
        cursorGlow.addColorStop(1, `rgba(${violet}, 0)`);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
        ctx.fillStyle = cursorGlow;
        ctx.fill();
      }

      // Draw-then-check: one final static frame is always painted above; only
      // re-schedule while the gate is open (PERF-04). When false the canvas
      // freezes on a correct frame and schedules nothing further.
      if (gateRef.current) {
        animId = requestAnimationFrame(draw);
      } else {
        runningRef.current = false;
      }
    };

    drawRef.current = draw;

    // Always paint one settle frame; loop only continues if gated open.
    runningRef.current = true;
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', refreshOffset);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      drawRef.current = null;
      runningRef.current = false;
    };
  }, [init]);

  // Mirror shouldAnimate into gateRef and re-arm an idle loop when it flips true.
  useEffect(() => {
    gateRef.current = shouldAnimate;
    if (shouldAnimate && !runningRef.current && drawRef.current) {
      runningRef.current = true;
      drawRef.current();
    }
  }, [shouldAnimate]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
