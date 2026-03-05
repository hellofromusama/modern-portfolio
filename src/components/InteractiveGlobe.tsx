"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";

interface InteractiveGlobeProps {
  className?: string;
  size?: number;
}

// Points of presence scattered across continents (lat, lon in degrees)
const POINTS_OF_PRESENCE: [number, number][] = [
  // North America
  [40.7, -74.0],   // New York
  [37.8, -122.4],  // San Francisco
  [47.6, -122.3],  // Seattle
  [33.9, -118.4],  // Los Angeles
  [45.5, -73.6],   // Montreal
  [25.8, -80.2],   // Miami
  [41.9, -87.6],   // Chicago
  [32.8, -96.8],   // Dallas
  // Europe
  [51.5, -0.1],    // London
  [48.9, 2.4],     // Paris
  [52.5, 13.4],    // Berlin
  [55.8, 37.6],    // Moscow
  [59.3, 18.1],    // Stockholm
  [41.4, 2.2],     // Barcelona
  [50.1, 14.4],    // Prague
  // Asia
  [35.7, 139.7],   // Tokyo
  [37.6, 127.0],   // Seoul
  [31.2, 121.5],   // Shanghai
  [22.3, 114.2],   // Hong Kong
  [1.3, 103.8],    // Singapore
  [13.8, 100.5],   // Bangkok
  [28.6, 77.2],    // New Delhi
  [19.1, 72.9],    // Mumbai
  // South America
  [-23.5, -46.6],  // Sao Paulo
  [-34.6, -58.4],  // Buenos Aires
  [-33.4, -70.7],  // Santiago
  // Africa
  [-33.9, 18.4],   // Cape Town
  [30.0, 31.2],    // Cairo
  [6.5, 3.4],      // Lagos
  // Oceania
  [-33.9, 151.2],  // Sydney
  [-36.8, 174.8],  // Auckland
];

// Connection arcs between pairs of points (indices into POINTS_OF_PRESENCE)
const CONNECTIONS: [number, number][] = [
  [0, 8],    // New York - London
  [1, 15],   // San Francisco - Tokyo
  [8, 11],   // London - Moscow
  [9, 14],   // Paris - Prague
  [15, 16],  // Tokyo - Seoul
  [17, 19],  // Shanghai - Singapore
  [0, 6],    // New York - Chicago
  [1, 3],    // San Francisco - LA
  [22, 23],  // New Delhi - Mumbai
  [24, 25],  // Sao Paulo - Buenos Aires
  [8, 9],    // London - Paris
  [19, 20],  // Singapore - Bangkok
  [5, 24],   // Miami - Sao Paulo
  [29, 27],  // Sydney - Cairo (long arc)
  [10, 15],  // Berlin - Tokyo
];

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function latLonToXYZ(
  lat: number,
  lon: number,
  radius: number
): [number, number, number] {
  const phi = degToRad(90 - lat);
  const theta = degToRad(lon);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

function rotateY(
  x: number,
  y: number,
  z: number,
  angle: number
): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos + z * sin, y, -x * sin + z * cos];
}

function rotateX(
  x: number,
  y: number,
  z: number,
  angle: number
): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x, y * cos - z * sin, y * sin + z * cos];
}

function project(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  perspective: number
): [number, number, number] {
  const scale = perspective / (perspective + z);
  return [cx + x * scale, cy - y * scale, z];
}

const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({
  className,
  size,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef({ x: -0.3, y: 0 });
  const dragRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });
  const animFrameRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const getRadius = useCallback(() => {
    if (size) return size / 2.5;
    const minDim = Math.min(dimensions.width, dimensions.height);
    return minDim / 2.5;
  }, [size, dimensions]);

  // Handle resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Mouse/touch events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerDown = (e: PointerEvent) => {
      dragRef.current.isDragging = true;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current.isDragging) return;
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;
      rotationRef.current.y += dx * 0.005;
      rotationRef.current.x += dy * 0.005;
      rotationRef.current.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, rotationRef.current.x)
      );
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      dragRef.current.isDragging = false;
      canvas.releasePointerCapture(e.pointerId);
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const radius = getRadius();
    const perspective = radius * 4;

    function transformPoint(
      x: number,
      y: number,
      z: number
    ): [number, number, number] {
      let [rx, ry, rz] = rotateX(
        x,
        y,
        z,
        rotationRef.current.x
      );
      [rx, ry, rz] = rotateY(rx, ry, rz, rotationRef.current.y);
      return project(rx, ry, rz, cx, cy, perspective);
    }

    function drawLine(
      ctx: CanvasRenderingContext2D,
      points3D: [number, number, number][],
      color: string,
      baseAlpha: number,
      lineWidth: number
    ) {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < points3D.length; i++) {
        const [px, py, pz] = transformPoint(...points3D[i]);
        // Back-face alpha: visible side is brighter
        const normalizedZ = pz / radius;
        const alpha = baseAlpha * (0.15 + 0.85 * Math.max(0, -normalizedZ / 2 + 0.5));
        if (alpha < 0.02) {
          started = false;
          continue;
        }
        ctx.strokeStyle = color.replace("ALPHA", alpha.toFixed(3));
        ctx.lineWidth = lineWidth;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }

    let startTime = performance.now();

    function render(time: number) {
      const elapsed = (time - startTime) / 1000;

      // Auto-rotate when not dragging
      if (!dragRef.current.isDragging) {
        rotationRef.current.y += 0.003;
      }

      // Clear
      ctx!.clearRect(0, 0, dimensions.width, dimensions.height);

      // Radial gradient background
      const bgGrad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.8);
      bgGrad.addColorStop(0, "rgba(30, 27, 75, 0.6)");
      bgGrad.addColorStop(0.5, "rgba(15, 13, 45, 0.3)");
      bgGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = bgGrad;
      ctx!.fillRect(0, 0, dimensions.width, dimensions.height);

      // Outer glow
      const glowGrad = ctx!.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.4);
      glowGrad.addColorStop(0, "rgba(96, 165, 250, 0.08)");
      glowGrad.addColorStop(0.5, "rgba(167, 139, 250, 0.04)");
      glowGrad.addColorStop(1, "rgba(167, 139, 250, 0)");
      ctx!.fillStyle = glowGrad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius * 1.4, 0, Math.PI * 2);
      ctx!.fill();

      // Draw latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        const segments: [number, number, number][] = [];
        for (let lon = 0; lon <= 360; lon += 3) {
          segments.push(latLonToXYZ(lat, lon, radius));
        }
        drawLine(
          ctx!,
          segments,
          `rgba(96, 165, 250, ALPHA)`,
          0.25,
          0.6
        );
      }

      // Draw longitude lines
      for (let lon = 0; lon < 360; lon += 30) {
        const segments: [number, number, number][] = [];
        for (let lat = -90; lat <= 90; lat += 3) {
          segments.push(latLonToXYZ(lat, lon, radius));
        }
        drawLine(
          ctx!,
          segments,
          `rgba(167, 139, 250, ALPHA)`,
          0.2,
          0.6
        );
      }

      // Equator (brighter)
      const eqSegments: [number, number, number][] = [];
      for (let lon = 0; lon <= 360; lon += 3) {
        eqSegments.push(latLonToXYZ(0, lon, radius));
      }
      drawLine(ctx!, eqSegments, `rgba(96, 165, 250, ALPHA)`, 0.4, 0.8);

      // Draw points of presence
      for (let i = 0; i < POINTS_OF_PRESENCE.length; i++) {
        const [lat, lon] = POINTS_OF_PRESENCE[i];
        const [x, y, z] = latLonToXYZ(lat, lon, radius);
        const [px, py, pz] = transformPoint(x, y, z);

        const normalizedZ = pz / radius;
        const visibility = Math.max(0, -normalizedZ / 2 + 0.5);
        if (visibility < 0.05) continue;

        // Pulsing effect - each dot pulses at a slightly different rate
        const pulseRate = 1.5 + (i % 7) * 0.3;
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * pulseRate + i * 1.3);

        const dotRadius = 2 + pulse * 1.5;
        const alpha = visibility * (0.6 + pulse * 0.4);

        // Glow around dot
        const dotGlow = ctx!.createRadialGradient(px, py, 0, px, py, dotRadius * 4);
        dotGlow.addColorStop(0, `rgba(96, 165, 250, ${(alpha * 0.5).toFixed(3)})`);
        dotGlow.addColorStop(1, "rgba(96, 165, 250, 0)");
        ctx!.fillStyle = dotGlow;
        ctx!.beginPath();
        ctx!.arc(px, py, dotRadius * 4, 0, Math.PI * 2);
        ctx!.fill();

        // Dot core
        ctx!.fillStyle = `rgba(200, 220, 255, ${alpha.toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(px, py, dotRadius, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Draw connection arcs
      for (let c = 0; c < CONNECTIONS.length; c++) {
        const [iA, iB] = CONNECTIONS[c];
        const [latA, lonA] = POINTS_OF_PRESENCE[iA];
        const [latB, lonB] = POINTS_OF_PRESENCE[iB];

        // Great circle interpolation
        const arcPoints: [number, number, number][] = [];
        const steps = 40;
        const pA = latLonToXYZ(latA, lonA, 1);
        const pB = latLonToXYZ(latB, lonB, 1);

        // Angle between points
        const dot = pA[0] * pB[0] + pA[1] * pB[1] + pA[2] * pB[2];
        const omega = Math.acos(Math.max(-1, Math.min(1, dot)));
        const sinOmega = Math.sin(omega);

        if (sinOmega < 0.001) continue;

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const sA = Math.sin((1 - t) * omega) / sinOmega;
          const sB = Math.sin(t * omega) / sinOmega;
          // Lift arc above sphere surface
          const lift = 1 + 0.08 * Math.sin(t * Math.PI);
          const ix = (pA[0] * sA + pB[0] * sB) * radius * lift;
          const iy = (pA[1] * sA + pB[1] * sB) * radius * lift;
          const iz = (pA[2] * sA + pB[2] * sB) * radius * lift;
          arcPoints.push([ix, iy, iz]);
        }

        // Animated pulse traveling along the arc
        const pulsePos = ((elapsed * 0.4 + c * 0.7) % 1.5) / 1.5;

        // Draw arc segments with traveling pulse
        for (let s = 0; s < arcPoints.length - 1; s++) {
          const t = s / arcPoints.length;
          const [ax, ay, az] = transformPoint(...arcPoints[s]);
          const [bx, by, bz] = transformPoint(...arcPoints[s + 1]);

          const midZ = (az + bz) / 2;
          const normalizedZ = midZ / radius;
          const visibility = Math.max(0, -normalizedZ / 2 + 0.5);
          if (visibility < 0.05) continue;

          // Pulse brightness
          const dist = Math.abs(t - pulsePos);
          const pulseBright = Math.exp(-dist * dist * 60);
          const arcAlpha = visibility * (0.08 + pulseBright * 0.7);

          const r = Math.round(96 + (167 - 96) * t);
          const g = Math.round(165 + (139 - 165) * t);
          const b = Math.round(250);

          ctx!.strokeStyle = `rgba(${r}, ${g}, ${b}, ${arcAlpha.toFixed(3)})`;
          ctx!.lineWidth = 1 + pulseBright * 2;
          ctx!.beginPath();
          ctx!.moveTo(ax, ay);
          ctx!.lineTo(bx, by);
          ctx!.stroke();
        }
      }

      // Inner sphere shading for depth
      const sphereShade = ctx!.createRadialGradient(
        cx - radius * 0.3,
        cy - radius * 0.3,
        0,
        cx,
        cy,
        radius
      );
      sphereShade.addColorStop(0, "rgba(96, 165, 250, 0.02)");
      sphereShade.addColorStop(0.7, "rgba(0, 0, 0, 0)");
      sphereShade.addColorStop(1, "rgba(96, 165, 250, 0.05)");
      ctx!.fillStyle = sphereShade;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx!.fill();

      animFrameRef.current = requestAnimationFrame(render);
    }

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [dimensions, getRadius]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: size ? `${size}px` : "100%",
        height: size ? `${size}px` : "100%",
        position: "relative",
        cursor: dragRef.current?.isDragging ? "grabbing" : "grab",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          touchAction: "none",
        }}
      />
    </div>
  );
};

export default InteractiveGlobe;
