"use client";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import ShootingStars from "./ShootingStars";
import { warp } from "./warpState";

/**
 * Two foreground THREE.Points star layers (mid + near) over the photo sky.
 *
 * Each layer owns a STATIC BufferGeometry (positions in a spread cube + per-point
 * color by star temperature) computed ONCE. A shared soft round additive sprite is
 * the point texture. Motion (skipped when reduced): opacity twinkle + a slight
 * mouse-parallax rotation. Zero per-particle CPU writes per frame.
 */

interface LayerConfig {
  count: number;
  size: number;
  spread: number;
  zMin: number;
  zMax: number;
  baseOpacity: number;
  twinkleBase: number;
  twinkleAmp: number;
  twinkleFreq: number;
  twinklePhase: number;
  rotYFactor: number;
  rotXFactor: number;
}

const MID: LayerConfig = {
  count: 900, size: 1.7, spread: 460, zMin: -280, zMax: 50, baseOpacity: 0.7,
  twinkleBase: 0.55, twinkleAmp: 0.14, twinkleFreq: 2.1, twinklePhase: 1.5,
  rotYFactor: 0.035, rotXFactor: 0,
};
const NEAR: LayerConfig = {
  count: 360, size: 2.8, spread: 320, zMin: -240, zMax: 40, baseOpacity: 0.9,
  twinkleBase: 0.7, twinkleAmp: 0.2, twinkleFreq: 3.0, twinklePhase: 0,
  rotYFactor: 0.06, rotXFactor: 0.03,
};

// 64px radial-gradient sprite (white core -> transparent) — the soft round point.
function makeSoftStarTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.3, "rgba(255,255,255,0.5)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Per-point color weighted by star temperature (blue-white / yellow / orange / red /
// blue-giant), scaled by a random brightness.
function starColor(): [number, number, number] {
  const r = Math.random();
  let c: [number, number, number];
  if (r < 0.55) c = [0.78 + Math.random() * 0.22, 0.86 + Math.random() * 0.14, 1.0];
  else if (r < 0.75) c = [1, 0.95, 0.8 + Math.random() * 0.12];
  else if (r < 0.9) c = [1, 0.82, 0.58];
  else if (r < 0.97) c = [1, 0.6, 0.5];
  else c = [0.62, 0.76, 1.0];
  const b = 0.55 + Math.random() * 0.45;
  return [c[0] * b, c[1] * b, c[2] * b];
}

interface StarLayerProps {
  cfg: LayerConfig;
  softTex: THREE.CanvasTexture;
  mouse: RefObject<{ x: number; y: number }>;
  reduced: boolean;
}

function StarLayer({ cfg, softTex, mouse, reduced }: StarLayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(cfg.count * 3);
    const colors = new Float32Array(cfg.count * 3);
    for (let i = 0; i < cfg.count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * cfg.spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * cfg.spread;
      positions[i * 3 + 2] = cfg.zMin + Math.random() * (cfg.zMax - cfg.zMin);
      const [cr, cg, cb] = starColor();
      colors[i * 3] = cr;
      colors[i * 3 + 1] = cg;
      colors[i * 3 + 2] = cb;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [cfg]);

  useFrame((state) => {
    const pts = pointsRef.current;
    const mat = matRef.current;
    if (!pts || !mat) return;
    if (reduced) {
      mat.opacity = cfg.baseOpacity;
      return;
    }
    const time = state.clock.elapsedTime;
    mat.opacity = cfg.twinkleBase + Math.sin(time * cfg.twinkleFreq + cfg.twinklePhase) * cfg.twinkleAmp;
    pts.rotation.y = mouse.current.x * cfg.rotYFactor;
    if (cfg.rotXFactor) pts.rotation.x = mouse.current.y * cfg.rotXFactor;
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        ref={matRef}
        size={cfg.size}
        map={softTex}
        vertexColors
        sizeAttenuation
        transparent
        opacity={cfg.baseOpacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Warp-speed streak layer — ONE lineSegments built once (~240 segments at MID-like
 * star positions, each stretched 16 units along the travel/z axis, vertexColors
 * bright-head -> dim-tail). The only per-frame work is a single material-opacity
 * write from warp.intensity (fed by the mounted camera rig) — branchless per-star,
 * no geometry updates.
 */
const STREAK_COUNT = 240;
const STREAK_LEN = 16;

function WarpStreaks({ reduced }: { reduced: boolean }) {
  const matRef = useRef<THREE.LineBasicMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(STREAK_COUNT * 6);
    const colors = new Float32Array(STREAK_COUNT * 6);
    for (let i = 0; i < STREAK_COUNT; i++) {
      const x = (Math.random() - 0.5) * 460;
      const y = (Math.random() - 0.5) * 460;
      const z = -280 + Math.random() * 330;
      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z + STREAK_LEN; // head (toward the camera)
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z; // tail
      // Near-white head vertex -> dim tail vertex.
      colors[i * 6] = 0.8;
      colors[i * 6 + 1] = 0.86;
      colors[i * 6 + 2] = 1.0;
      colors[i * 6 + 3] = 0.08;
      colors[i * 6 + 4] = 0.1;
      colors[i * 6 + 5] = 0.16;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  useFrame(() => {
    const mat = matRef.current;
    if (!mat) return;
    mat.opacity = reduced ? 0 : warp.intensity * 0.5;
  });

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial
        ref={matRef}
        vertexColors
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

interface StarfieldProps {
  mouse: RefObject<{ x: number; y: number }>;
  reduced: boolean;
}

export default function Starfield({ mouse, reduced }: StarfieldProps) {
  const softTex = useMemo(() => makeSoftStarTexture(), []);
  return (
    <>
      <StarLayer cfg={MID} softTex={softTex} mouse={mouse} reduced={reduced} />
      <StarLayer cfg={NEAR} softTex={softTex} mouse={mouse} reduced={reduced} />
      <WarpStreaks reduced={reduced} />
      <ShootingStars softTex={softTex} reduced={reduced} />
    </>
  );
}
