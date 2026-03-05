"use client";

import { useRef, useEffect } from "react";

export default function Hero3DScene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.clientWidth;
    const h = () => canvas.clientHeight;

    // Particles
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number; pulse: number }[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * 1600,
        y: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        hue: Math.random() > 0.5 ? 220 : 260,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Icosahedron vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const icoVerts = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ];
    const shapePoints = icoVerts.map(v => {
      const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      return { x: v[0] / len * 130, y: v[1] / len * 130, z: v[2] / len * 130 };
    });

    const edges = [
      [0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],
      [2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],
      [4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],[7,8],[7,10],
      [8,9],[10,11]
    ];

    // Floating geometric shapes (triangles, squares)
    const floatingShapes: { x: number; y: number; size: number; rotation: number; rotSpeed: number; type: string; alpha: number; vy: number }[] = [];
    for (let i = 0; i < 8; i++) {
      floatingShapes.push({
        x: Math.random() * 1600,
        y: Math.random() * 1000,
        size: Math.random() * 20 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        type: Math.random() > 0.5 ? "triangle" : "diamond",
        alpha: Math.random() * 0.06 + 0.02,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }

    let time = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w(), h());
      time += 0.005;

      // Smooth mouse lerp
      smoothMouseX += (mouse.current.x - smoothMouseX) * 0.05;
      smoothMouseY += (mouse.current.y - smoothMouseY) * 0.05;

      const cx = w() / 2 + smoothMouseX * 50;
      const cy = h() / 2 - smoothMouseY * 50;

      // Background gradient dots grid
      const gridSize = 60;
      for (let gx = 0; gx < w(); gx += gridSize) {
        for (let gy = 0; gy < h(); gy += gridSize) {
          const distFromCenter = Math.sqrt((gx - w()/2) ** 2 + (gy - h()/2) ** 2);
          const maxDist = Math.sqrt((w()/2) ** 2 + (h()/2) ** 2);
          const dotAlpha = 0.03 * (1 - distFromCenter / maxDist);
          if (dotAlpha > 0.005) {
            ctx.beginPath();
            ctx.arc(gx, gy, 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(148, 163, 184, ${dotAlpha})`;
            ctx.fill();
          }
        }
      }

      // Floating geometric shapes
      floatingShapes.forEach(shape => {
        shape.rotation += shape.rotSpeed;
        shape.y += shape.vy;
        if (shape.y < -30) shape.y = h() + 30;
        if (shape.y > h() + 30) shape.y = -30;

        ctx.save();
        ctx.translate(shape.x + smoothMouseX * 10, shape.y + smoothMouseY * 10);
        ctx.rotate(shape.rotation);
        ctx.strokeStyle = `rgba(148, 163, 184, ${shape.alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();

        if (shape.type === "triangle") {
          const s = shape.size;
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.866, s * 0.5);
          ctx.lineTo(-s * 0.866, s * 0.5);
          ctx.closePath();
        } else {
          const s = shape.size;
          ctx.moveTo(0, -s);
          ctx.lineTo(s, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s, 0);
          ctx.closePath();
        }
        ctx.stroke();
        ctx.restore();
      });

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        if (p.x < 0) p.x = w();
        if (p.x > w()) p.x = 0;
        if (p.y < 0) p.y = h();
        if (p.y > h()) p.y = 0;

        const pulseAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${pulseAlpha})`;
        ctx.fill();
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(148,163,184,${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Rotate and project icosahedron
      const cosA = Math.cos(time + smoothMouseX * 0.5);
      const sinA = Math.sin(time + smoothMouseX * 0.5);
      const cosB = Math.cos(time * 0.7 + smoothMouseY * 0.5);
      const sinB = Math.sin(time * 0.7 + smoothMouseY * 0.5);
      const cosC = Math.cos(time * 0.3);
      const sinC = Math.sin(time * 0.3);

      const projected = shapePoints.map(p => {
        // Rotate Y
        let x = p.x * cosA - p.z * sinA;
        let z = p.x * sinA + p.z * cosA;
        let y = p.y;
        // Rotate X
        const y2 = y * cosB - z * sinB;
        const z2 = y * sinB + z * cosB;
        // Rotate Z
        const x2 = x * cosC - y2 * sinC;
        const y3 = x * sinC + y2 * cosC;
        // Perspective
        const scale = 350 / (350 + z2);
        return { x: cx + x2 * scale, y: cy + y3 * scale, z: z2, scale };
      });

      // Draw edges with depth-based styling
      edges.forEach(([a, b]) => {
        const pa = projected[a];
        const pb = projected[b];
        const avgZ = (pa.z + pb.z) / 2;
        const alpha = 0.06 + (avgZ + 130) / 260 * 0.18;

        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);

        // Gradient edge color
        const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
        grad.addColorStop(0, `rgba(96, 165, 250, ${alpha})`);
        grad.addColorStop(1, `rgba(167, 139, 250, ${alpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1 + (avgZ + 130) / 260 * 0.5;
        ctx.stroke();
      });

      // Draw vertices with glow
      projected.forEach((p) => {
        const alpha = 0.2 + (p.z + 130) / 260 * 0.6;
        const size = 2.5 * p.scale;

        // Outer glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 5);
        gradient.addColorStop(0, `rgba(124, 58, 237, ${alpha * 0.25})`);
        gradient.addColorStop(0.5, `rgba(96, 165, 250, ${alpha * 0.1})`);
        gradient.addColorStop(1, `rgba(124, 58, 237, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core point
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
        ctx.fill();
      });

      // Orbiting rings
      for (let r = 0; r < 3; r++) {
        const ringRadius = 180 + r * 45;
        const ringAlpha = 0.05 - r * 0.012;
        const ringAngle = time * (0.3 + r * 0.1);
        const hue = [220, 260, 160][r];

        ctx.beginPath();
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ringAngle + r * 1.2);
        ctx.scale(1, 0.3);
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.restore();
        ctx.strokeStyle = `hsla(${hue}, 60%, 65%, ${ringAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small orbiting dots on rings
        for (let d = 0; d < 3; d++) {
          const angle = ringAngle * 2 + (d * Math.PI * 2) / 3;
          const dotX = cx + Math.cos(angle + r * 1.2) * ringRadius;
          const dotY = cy + Math.sin(angle + r * 1.2) * ringRadius * 0.3;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 70%, 70%, ${ringAlpha * 3})`;
          ctx.fill();
        }
      }

      // Mouse cursor trail effect
      const mouseScreenX = (smoothMouseX + 1) / 2 * w();
      const mouseScreenY = (1 - (smoothMouseY + 1) / 2) * h();
      const cursorGrad = ctx.createRadialGradient(mouseScreenX, mouseScreenY, 0, mouseScreenX, mouseScreenY, 200);
      cursorGrad.addColorStop(0, "rgba(96, 165, 250, 0.03)");
      cursorGrad.addColorStop(1, "rgba(96, 165, 250, 0)");
      ctx.beginPath();
      ctx.arc(mouseScreenX, mouseScreenY, 200, 0, Math.PI * 2);
      ctx.fillStyle = cursorGrad;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [mouse]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
