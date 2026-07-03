"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Pooled comet streaks crossing the deep background every ~4-9s.
 *
 * A FIXED pool of slots (1 on coarse/small screens, 2 on desktop) is created once;
 * respawn = reposition + restart — zero per-spawn allocation. All scheduling flows
 * through state.clock.elapsedTime inside useFrame (no setInterval/setTimeout), so
 * the frameloop gate pauses everything for free. Spawns are CAMERA-RELATIVE because
 * the scene fog (FogExp2 0.0052) swallows anything ~250+ units from the camera.
 */

const TAIL_HEAD_COLOR = new THREE.Color(0.85, 0.92, 1.0);
const TAIL_TAIL_COLOR = new THREE.Color(0, 0, 0); // additive black = free fade-out

interface Slot {
  active: boolean;
  startTime: number;
  life: number;
  dist: number;
  origin: THREE.Vector3;
  dir: THREE.Vector3;
  nextSpawn: number;
}

interface ShootingStarsProps {
  /** Starfield's shared soft radial sprite — do not build a second texture. */
  softTex: THREE.CanvasTexture;
  reduced: boolean;
}

export default function ShootingStars({ softTex, reduced }: ShootingStarsProps) {
  // Pool size decided ONCE (client-only component — dynamic ssr:false upstream).
  const slotCount = useMemo(() => {
    const coarse =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    return coarse ? 1 : 2;
  }, []);

  const slots = useMemo<Slot[]>(
    () =>
      Array.from({ length: slotCount }, (_, i) => ({
        active: false,
        startTime: 0,
        life: 0,
        dist: 0,
        origin: new THREE.Vector3(),
        dir: new THREE.Vector3(),
        nextSpawn: i === 0 ? 2 : 7, // staggered first appearances
      })),
    [slotCount]
  );

  // Tail lines built once per slot: 2 vertices (head at local origin, tail vertex
  // rewritten at each spawn to -dir * tailLen), vertexColors white->black, additive.
  const tails = useMemo(
    () =>
      slots.map(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
        const colors = new Float32Array([
          TAIL_HEAD_COLOR.r, TAIL_HEAD_COLOR.g, TAIL_HEAD_COLOR.b,
          TAIL_TAIL_COLOR.r, TAIL_TAIL_COLOR.g, TAIL_TAIL_COLOR.b,
        ]);
        g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        const mat = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const line = new THREE.Line(g, mat);
        line.frustumCulled = false;
        return line;
      }),
    [slots]
  );

  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const headMatRefs = useRef<(THREE.SpriteMaterial | null)[]>([]);

  useFrame((state) => {
    if (reduced) {
      for (let i = 0; i < slots.length; i++) {
        const g = groupRefs.current[i];
        if (g) g.visible = false;
      }
      return;
    }
    const time = state.clock.elapsedTime;
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      const g = groupRefs.current[i];
      const headMat = headMatRefs.current[i];
      const tailMat = tails[i].material as THREE.LineBasicMaterial;
      if (!g || !headMat) continue;

      if (!s.active) {
        if (time < s.nextSpawn) {
          g.visible = false;
          continue;
        }
        // Spawn: reposition + restart (zero allocation).
        s.active = true;
        s.startTime = time;
        s.life = 1.5 + Math.random();
        s.dist = 90 + Math.random() * 50;
        const sideX = Math.random() < 0.5 ? 1 : -1;
        s.origin.set(
          sideX * (30 + Math.random() * 40),
          (Math.random() < 0.5 ? 1 : -1) * (10 + Math.random() * 40),
          state.camera.position.z - 110 - Math.random() * 50
        );
        // Mostly-x/y diagonal crossing back over the scene, slight z drift.
        s.dir
          .set(
            -sideX * (0.7 + Math.random() * 0.3),
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.3
          )
          .normalize();
        // Orient the tail once at spawn: rewrite the tail vertex to -dir * tailLen.
        const tailLen = 10 + Math.random() * 6;
        const pos = tails[i].geometry.attributes.position as THREE.BufferAttribute;
        pos.setXYZ(1, -s.dir.x * tailLen, -s.dir.y * tailLen, -s.dir.z * tailLen);
        pos.needsUpdate = true;
        g.visible = true;
      }

      const p = (time - s.startTime) / s.life;
      if (p >= 1) {
        s.active = false;
        s.nextSpawn = time + 4 + Math.random() * 5;
        g.visible = false;
        continue;
      }
      g.position.copy(s.origin).addScaledVector(s.dir, s.dist * p);
      const fade = Math.sin(Math.PI * p);
      headMat.opacity = fade;
      tailMat.opacity = fade;
    }
  });

  return (
    <>
      {slots.map((_, i) => (
        <group
          key={i}
          ref={(g) => {
            groupRefs.current[i] = g;
          }}
          visible={false}
        >
          <sprite scale={[1.6, 1.6, 1]} frustumCulled={false}>
            <spriteMaterial
              ref={(m) => {
                headMatRefs.current[i] = m;
              }}
              map={softTex}
              color="#cfe4ff"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
          <primitive object={tails[i]} />
        </group>
      ))}
    </>
  );
}
