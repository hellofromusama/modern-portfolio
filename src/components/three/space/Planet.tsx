"use client";

import { useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  ASTEROIDS,
  SATURN_RING_TEXTURE,
  type PlanetSpec,
} from "./spaceSpec";

// Soft radial-gradient sprite texture (white core -> transparent), built ONCE and
// shared by every planet glow. Client-only (document) — /space is dynamic ssr:false.
let glowTex: THREE.CanvasTexture | null = null;
function getGlowTexture(): THREE.CanvasTexture {
  if (glowTex) return glowTex;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.5)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  glowTex = new THREE.CanvasTexture(canvas);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}

// Smooth-scroll the page to a section anchor t (click-to-fly / nav share this).
function flyToAnchor(anchor: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: anchor * max, behavior: "smooth" });
}

// Fresnel rim atmosphere (classic Stemkoski-style back-side glow): rim brightness
// peaks at the silhouette and falls off inward, tinted per planet. Static effect —
// no useFrame work, safe under reduced motion.
const ATMOSPHERE_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPos = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const ATMOSPHERE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uCoef;
  uniform float uPower;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  void main() {
    float rim = pow(clamp(uCoef + dot(vNormal, normalize(-vViewPos)), 0.0, 1.0), uPower);
    gl_FragColor = vec4(uColor * rim, rim * uOpacity);
  }
`;

// Per-moon orbit params (index 0/1): opposing directions, offset phases, widening radii.
const MOON_SPEEDS = [0.7, -0.5];
const MOON_PHASES = [0.4, 2.6];
const MOON_ORBITS = [1.6, 2.1];

interface MoonsProps {
  /** Parent planet radius — drives moon size + orbit radii. */
  radius: number;
  count: number;
  /** Live hover state (ref, not state — read per frame). */
  hovered: RefObject<boolean>;
  reduced: boolean;
  /** Called once when fully faded out so the parent unmounts the subtree. */
  onHidden: () => void;
}

/**
 * 1-2 tiny orbiting moons, lazily mounted on planet hover. Opacity ramps toward 0.9
 * while hovered and back to 0 on hover end; when fully faded the parent unmounts the
 * subtree (zero draw calls unhovered). Orbit motion skips under reduced motion
 * (static angular positions, fade still allowed). Moons never intercept pointer
 * events so they cannot flicker the hover state or block click-to-fly.
 */
function Moons({ radius, count, hovered, reduced, onHidden }: MoonsProps) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const matRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const opacityRef = useRef(0);
  const hiddenRef = useRef(false);

  useFrame((state, delta) => {
    const target = hovered.current ? 0.9 : 0;
    opacityRef.current += (target - opacityRef.current) * Math.min(1, delta * 5);
    const o = opacityRef.current;
    for (let i = 0; i < count; i++) {
      const mesh = meshRefs.current[i];
      const mat = matRefs.current[i];
      if (!mesh || !mat) continue;
      mat.opacity = o;
      const a = reduced
        ? MOON_PHASES[i]
        : MOON_PHASES[i] + state.clock.elapsedTime * MOON_SPEEDS[i];
      const r = radius * MOON_ORBITS[i];
      mesh.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.22, Math.sin(a) * r);
    }
    if (!hovered.current && o < 0.02 && !hiddenRef.current) {
      hiddenRef.current = true;
      onHidden();
    }
  });

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshRefs.current[i] = m;
          }}
          raycast={() => null}
        >
          <sphereGeometry args={[radius * 0.1, 16, 12]} />
          <meshStandardMaterial
            ref={(m) => {
              matRefs.current[i] = m;
            }}
            color="#9aa3ad"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

/** Saturn's ring: a flat ring with UVs remapped radially so the color strip maps
 *  across the ring width. Separate component so useTexture stays unconditional. */
function SaturnRing({ radius }: { radius: number }) {
  const ringTex = useTexture(SATURN_RING_TEXTURE);
  ringTex.colorSpace = THREE.SRGBColorSpace;

  const geo = useMemo(() => {
    const inner = radius * 1.35;
    const outer = radius * 2.35;
    const g = new THREE.RingGeometry(inner, outer, 110);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const r = v.length();
      uv.setXY(i, (r - inner) / (outer - inner), 0.5);
    }
    uv.needsUpdate = true;
    return g;
  }, [radius]);

  return (
    <mesh geometry={geo} rotation={[Math.PI / 2, 0, 0]}>
      <meshBasicMaterial map={ringTex} side={THREE.DoubleSide} transparent opacity={0.92} />
    </mesh>
  );
}

interface PlanetProps {
  spec: PlanetSpec;
  /** prefers-reduced-motion: freeze axial spin + vertical bob. */
  reduced: boolean;
}

/**
 * A real photo-textured planet at its spec world position.
 *
 * A group (bob) contains a child TILT group (random axial tilt) holding the body
 * (SRGB diffuse, roughness 0.92 / metalness 0.02) and, for Saturn, the ring. If the
 * spec has a tint it also gets a back-side additive atmosphere shell + a soft
 * additive radial glow sprite. The body spins on its axis and the group bobs
 * vertically. Clicking the body flies the camera to that section's anchor; hover
 * shows a pointer cursor. Explicit tilt/spin/bob (NOT drei <Float>) per spec.
 */
export default function Planet({ spec, reduced }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const hoveredRef = useRef(false);
  const [moonsMounted, setMoonsMounted] = useState(false);

  // Tinted planets get orbital moons on hover (bigger bodies get 2); the untinted
  // moon body + all asteroids get none.
  const moonCount = spec.tint === null ? 0 : spec.radius >= 5 ? 2 : 1;

  const map = useTexture(spec.texture);
  map.colorSpace = THREE.SRGBColorSpace;

  // Fresnel rim atmosphere material, built ONCE per tint (static uniforms).
  const atmosphereMat = useMemo(() => {
    if (spec.tint === null) return null;
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(spec.tint) },
        uCoef: { value: 0.6 },
        uPower: { value: 3.5 },
        uOpacity: { value: 0.55 },
      },
      vertexShader: ATMOSPHERE_VERT,
      fragmentShader: ATMOSPHERE_FRAG,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [spec.tint]);

  // Seed random tilt / spin rate / bob phase ONCE so they are stable across renders.
  const seed = useMemo(
    () => ({
      tiltZ: 0.12 + Math.random() * 0.4,
      spin: 0.0016 + Math.random() * 0.0022,
      phase: Math.random() * Math.PI * 2,
    }),
    []
  );

  const y0 = spec.position[1];
  const glow = spec.tint !== null ? getGlowTexture() : null;

  useFrame((state) => {
    const g = groupRef.current;
    const b = bodyRef.current;
    if (reduced || !g || !b) return;
    b.rotation.y += seed.spin;
    b.rotation.x += seed.spin * 0.35;
    g.position.y = y0 + Math.sin(state.clock.elapsedTime * 0.5 + seed.phase) * 0.5;
  });

  return (
    <group ref={groupRef} position={spec.position}>
      {/* Tilt group — body + ring share the random axial tilt. */}
      <group rotation={[0, 0, seed.tiltZ]}>
        <mesh
          ref={bodyRef}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            flyToAnchor(spec.anchor);
          }}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            hoveredRef.current = true;
            if (moonCount > 0) setMoonsMounted(true);
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
            hoveredRef.current = false;
          }}
        >
          <sphereGeometry args={[spec.radius, 64, 48]} />
          <meshStandardMaterial map={map} roughness={0.92} metalness={0.02} />
        </mesh>

        {spec.ring && <SaturnRing radius={spec.radius} />}
      </group>

      {/* Hover-lazy orbital moons — inside the bob group, OUTSIDE the tilt group
          so orbits stay level-ish. Zero draw calls when not hovered. */}
      {moonsMounted && moonCount > 0 && (
        <Moons
          radius={spec.radius}
          count={moonCount}
          hovered={hoveredRef}
          reduced={reduced}
          onHidden={() => setMoonsMounted(false)}
        />
      )}

      {spec.tint !== null && atmosphereMat && (
        <>
          {/* Atmosphere shell — fresnel rim glow tinted to the planet. */}
          <mesh material={atmosphereMat}>
            <sphereGeometry args={[spec.radius * 1.15, 48, 32]} />
          </mesh>

          {/* Soft radial glow sprite. */}
          {glow && (
            <sprite scale={[spec.radius * 3.0, spec.radius * 3.0, 1]}>
              <spriteMaterial
                map={glow}
                color={spec.tint}
                transparent
                opacity={0.26}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
        </>
      )}
    </group>
  );
}

/**
 * The Projects asteroid field — 8 seeded rock bodies (radii 1.0–2.8, x ±15, y ±10,
 * z −104..−150) cycling the 3 rock textures, all sharing the Projects anchor 0.6 for
 * click-to-fly. Seeds are memoized once so they never jump between renders.
 */
export function Asteroids({ reduced }: { reduced: boolean }) {
  const specs = useMemo<PlanetSpec[]>(() => {
    const arr: PlanetSpec[] = [];
    for (let i = 0; i < ASTEROIDS.count; i++) {
      arr.push({
        id: `asteroid-${i}`,
        texture: ASTEROIDS.textures[i % ASTEROIDS.textures.length],
        radius: 1.0 + Math.random() * 1.8,
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          -104 - Math.random() * 46,
        ],
        tint: null,
        anchor: ASTEROIDS.anchor,
      });
    }
    return arr;
  }, []);

  return (
    <>
      {specs.map((s) => (
        <Planet key={s.id} spec={s} reduced={reduced} />
      ))}
    </>
  );
}
