# Quick Task 260702-dq5: Photoreal "Real Space" /space — Research

**Researched:** 2026-07-02
**Domain:** Three.js / R3F equirectangular skybox + real planet textures + DOM-over-fixed-canvas (Next.js App Router)
**Confidence:** HIGH (all asset URLs verified HTTP 200; drei/R3F API confirmed against installed versions)

## Summary

The existing `/space` prototype already has the exact skeleton needed: a `position:fixed` full-screen R3F `<Canvas>` behind a tall transparent spacer, native `window.scrollY → progress` ref driving `CameraRig`, and a plain-DOM `SpaceHUD` overlaid at `zIndex:10`. Making it photoreal is **additive swaps**, not a rewrite:

1. Replace procedural `Starfield.tsx` (drei `<Points>`) with a **real equirectangular Milky Way JPG** set as `scene.background`.
2. Give `Planet.tsx` spheres a real **diffuse `map` texture** (Solar System Scope, CC-BY-4.0) instead of flat emissive color.
3. Replace the transparent spacer with the **real existing DOM sections** (starting with `<TeamSection/>` imported verbatim), each wrapped so its opaque `background` is neutralized to let the cosmos show through.

**Primary recommendation:** Use **Solar System Scope 2K JPGs** (CC-BY-4.0) for both the Milky Way skybox and the planet diffuse maps — they are already equirectangular 2:1, small (mobile-safe), and load with drei `useTexture`. NASA SVS Deep Star Maps are public-domain but only ship usable versions as heavy EXR (needs `EXRLoader`); keep them as a PD fallback only. Neutralize `TeamSection`'s `var(--bg-secondary)` section background with a scoped `!important` CSS rule (beats inline styles) — **no edit to the component**.

## Standard Stack

No new npm packages required. Everything uses the already-installed stack:

| Library | Installed | Purpose |
|---------|-----------|---------|
| three | ^0.184.0 | `TextureLoader`, `EquirectangularReflectionMapping`, `SRGBColorSpace` |
| @react-three/fiber | ^9.6.1 | `<Canvas>`, `useThree`, `useFrame` |
| @react-three/drei | ^10.7.7 | `useTexture` (planet maps), optional `<Environment>` |
| maath | ^0.10.8 | (no longer needed once Starfield is replaced; leave installed) |

**No KTX2/basis, no `@react-three/postprocessing`, no HDR/EXR loader needed** for the prototype — plain JPG diffuse maps are sufficient and mobile-safe.

## Asset 1 — Real Milky Way Starfield (equirectangular skybox)

**RECOMMENDED (primary): Solar System Scope — "Stars + Milky Way"** — already equirect 2:1 JPG, tiny, drop-in.

| Resolution | Direct URL (verified HTTP 200) | Use |
|-----------|-------------------------------|-----|
| 2K (2048×1024) | `https://www.solarsystemscope.com/textures/download/2k_stars_milky_way.jpg` | **mobile + default** |
| 8K (8192×4096) | `https://www.solarsystemscope.com/textures/download/8k_stars_milky_way.jpg` | desktop only (see mobile caveat) |

- **License:** Creative Commons Attribution 4.0 International (CC-BY-4.0). Verbatim from solarsystemscope.com/textures: *"Distributed under Attribution 4.0 International license: You may use, adapt, and share these textures for any purpose, even commercially."*
- **Required attribution:** `Textures by Solar System Scope (solarsystemscope.com), licensed CC BY 4.0`
- Save to `public/space/2k_stars_milky_way.jpg` (~1–2 MB) and `8k_...` (~10–15 MB, optional).

**PUBLIC-DOMAIN ALTERNATIVE (heavier): NASA SVS "Deep Star Maps 2020"** — https://svs.gsfc.nasa.gov/4851/
- Usable full-res files are **EXR only** (the only JPG, `starmap_2020_4k_print.jpg` at 41.8 KB, is a low-quality print thumbnail — NOT skybox-grade).
- 4K EXR `https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004851/starmap_2020_4k.exr` (34.3 MB, verified 200); 8K EXR 124.5 MB; 16K 422.9 MB.
- Would require `three/examples/jsm/loaders/EXRLoader` + offline conversion to JPG. **Only pursue if a public-domain source is mandated.**
- NASA credit line (public domain, credit requested): *"NASA/Goddard Space Flight Center Scientific Visualization Studio. Gaia DR2: ESA/Gaia/DPAC."*
- **ESO Milky Way panorama** (S. Brunier, CC-BY-4.0) — https://www.eso.org/public/images/eso0932a/ — also equirect; another CC alternative but larger/less convenient than Solar System Scope.

## Asset 2 — Real Planet Textures (diffuse maps)

**Solar System Scope, CC-BY-4.0** (same license/attribution as above). All are equirect diffuse maps for `MeshStandardMaterial.map`. Verified URL pattern: `https://www.solarsystemscope.com/textures/download/{res}_{body}.jpg` (2K JPGs are ~1–3 MB each, mobile-safe).

| Body | 2K URL filename | 8K available |
|------|-----------------|--------------|
| Earth (day) | `2k_earth_daymap.jpg` | yes |
| Mars | `2k_mars.jpg` | yes |
| Jupiter | `2k_jupiter.jpg` | yes |
| Neptune | `2k_neptune.jpg` | no (2K max) |
| Moon | `2k_moon.jpg` | no |
| Mercury / Venus / Saturn / Uranus / Sun | `2k_mercury.jpg` etc. | most 8K |

**Recommended 5-body → section mapping** (SECTIONS order in `waypoints.ts`):

| Section | Accent token | Planet | Why |
|---------|-------------|--------|-----|
| About | `--accent-blue` | **Earth** (`2k_earth_daymap.jpg`) | blue marble = home/identity, matches blue |
| Projects | `--accent-violet` | **Jupiter** (`2k_jupiter.jpg`) | most dramatic banded planet = flagship work |
| Skills | `--accent-emerald` | **Mars** (`2k_mars.jpg`) | strong texture/contrast (no green planet exists — see note) |
| Team | `--accent-blue` | **Neptune** (`2k_neptune.jpg`) | deep blue, cohesive |
| Contact | `--accent-violet` | **Moon** (`2k_moon.jpg`) | quiet, close, "landing" feel for the final section |

**Note on accent colors:** With REAL photo textures, keep `emissive` **off or ≤0.05** — the current `emissiveIntensity={0.6}` will wash the texture into a flat glow and kill the photoreal look. Let the real Milky Way `scene.environment` + the existing `pointLight` do the lighting. The theme accent token is best used only for the faint additive **halo shell** (already in `Planet.tsx`), not the planet body. No real planet is emerald-green — do not force a green tint; Mars with the emerald halo reads fine.

## Asset 3 — Equirectangular Skybox in R3F v9 + drei v10

**Preferred (explicit, no IBL side effects):** set `scene.background` directly. Correct color space and mapping are load-bearing.

```tsx
// SpaceBackground.tsx — replaces <Starfield/>
"use client";
import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

export default function SpaceBackground() {
  const { scene } = useThree();
  const tex = useTexture("/space/2k_stars_milky_way.jpg");
  useEffect(() => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;   // REQUIRED or stars look grey/washed
    scene.background = tex;
    scene.environment = tex;                 // optional: subtle real starlight on planets
    return () => { scene.background = null; scene.environment = null; };
  }, [tex, scene]);
  return null;
}
```

**Alternative (one-liner, drei):** `<Environment background files="/space/2k_stars_milky_way.jpg" />`. drei v10's `<Environment>` accepts `.jpg`/`.webp`/`.hdr`/`.exr`. `background` prop: `false` = env-map only, `true` = env + background, `"only"` = background but no env lighting. Use `background="only"` if you do NOT want the skybox tinting planet lighting. This is simplest but gives less control than the explicit `scene.background` approach.

- **Color space:** diffuse/color textures (skybox + planet `map`) MUST be `THREE.SRGBColorSpace`. `useTexture` does **not** auto-set this for you — set it explicitly (skybox above; for planet maps set `map.colorSpace = THREE.SRGBColorSpace`). Getting this wrong is the #1 "looks dull/grey" bug.
- **Mobile texture-size caveat:** many mobile GPUs cap `MAX_TEXTURE_SIZE` at 4096; an 8192-wide skybox will be silently downscaled or fail on those devices. **Ship 2K as default; gate 8K behind a desktop/`gl.capabilities.maxTextureSize >= 8192` check.** WebGL2 (three r184) handles NPOT/2:1 equirect fine — no power-of-two requirement.
- Keep the current `dpr={[1,2]}` cap.

## Asset 4 — DOM-over-fixed-canvas (import TeamSection VERBATIM)

The prototype already implements the pattern (fixed canvas `zIndex` behind, `SpaceHUD` `zIndex:10`). To scroll REAL sections over the cosmos:

**Stacking / interactivity:**
- Fixed canvas wrapper: keep `position:fixed; inset:0`, give it `zIndex:0` and **`pointerEvents:"none"`** so clicks/links pass through to content.
- Content sections: render in normal document flow with `position:relative; zIndex:1` (higher than canvas). `TeamSection`'s root `<section>` already has `relative z-10` — it will layer correctly with zero change.
- **Replace the tall spacer** with the real content: the existing `window.scrollY / (scrollHeight - innerHeight)` progress calc auto-adapts to whatever height the real DOM produces, so `CameraRig` keeps flying. (If you want the flight tuned to content, you may still want a leading/trailing spacer for pacing.)

**TeamSection background gotcha (the real blocker):** its root is
`<section ... style={{ background: 'var(--bg-secondary)' }}>` — an **inline** opaque background that would hide the cosmos. You cannot override an inline style from a parent's normal CSS, **but a stylesheet rule with `!important` beats inline styles that lack `!important`.** So neutralize it WITHOUT editing the component via a scoped wrapper + global rule:

```tsx
<div className="space-dom-content">
  <TeamSection />
</div>
```
```css
/* globals.css (or a scoped <style>) — makes only the SECTION shell transparent */
.space-dom-content > section { background: transparent !important; }
```
- Do **not** blanket-transparent everything: the inner photo card (`background: var(--bg-card)`), active name rows (`var(--bg-card)`), and the `from-black/80` name-gradient are desirable for readability over the starfield — leave them.
- Optionally add a subtle scrim (`background: linear-gradient(...)` on `.space-dom-content`, or per-section `backdrop-filter: blur(2px)`) if text contrast over bright Milky Way regions fails WCAG. The existing `SpaceHUD` glass bar is a good contrast reference.
- `TeamSection` is `"use client"` and pulls `motion/react` + `ScrollReveal` — all already in the bundle; importing it into the `/space` client tree is free.

## Don't Hand-Roll

| Problem | Don't build | Use instead |
|---------|------------|-------------|
| Star positions / Milky Way band | Procedural `<Points>` (current `Starfield.tsx`) | Real equirect JPG on `scene.background` |
| Planet surface detail | Flat/emissive color spheres | Real diffuse `map` from Solar System Scope |
| Equirect → cube background plumbing | Manual 6-face cubemap or inverted BackSide sphere | `scene.background = equirectTexture` (three does the projection) or drei `<Environment>` |
| Overriding an inline component style | Editing `TeamSection.tsx` | Scoped CSS `!important` rule |

## Common Pitfalls

1. **Wrong color space** → skybox/planets look grey/muddy. Set `.colorSpace = THREE.SRGBColorSpace` on every color texture (`useTexture` won't).
2. **8K on mobile** → texture silently downscaled or GPU OOM. Default 2K; feature-detect for 8K.
3. **`emissiveIntensity` left at 0.6** → washes out the new photo texture. Drop to ~0 and rely on lights + environment.
4. **Canvas eats pointer events** → links in `TeamSection` unclickable. `pointerEvents:"none"` on the fixed canvas wrapper.
5. **Inline `background` hides cosmos** → must use `!important` in a stylesheet (parent CSS alone loses to inline).
6. **Texture disposal** → on unmount, null out `scene.background`/`scene.environment` and let `useTexture`'s cache manage the rest; don't leak by re-creating loaders per frame.
7. **`/space` is `noindex`** (per its `layout.tsx`) — keep it that way; this is a prototype route, not the live homepage.

## Environment Availability

| Dependency | Available | Notes |
|-----------|-----------|-------|
| three / R3F v9 / drei v10 / maath | ✓ installed | versions confirmed in package.json |
| Solar System Scope CDN (textures) | ✓ | URLs verified HTTP 200 — download to `public/space/` at build/dev time, do NOT hotlink at runtime |
| NASA SVS (EXR fallback) | ✓ | 200, but EXR needs loader + conversion; not needed |
| KTX2 / basis / EXR loaders | ✗ / not needed | prototype uses plain JPG |

## Licensing / Attribution — where to put it

Download textures into `public/space/` (do not hotlink). Add attribution in **`public/space/CREDITS.md`** and a short code comment where the texture URLs are referenced:

```
public/space/CREDITS.md
────────────────────────
Milky Way skybox + planet textures: Solar System Scope
https://www.solarsystemscope.com/textures/  — licensed CC BY 4.0
(Optional PD alt: NASA/Goddard SVS Deep Star Maps 2020, https://svs.gsfc.nasa.gov/4851/;
 Gaia DR2: ESA/Gaia/DPAC.)
```

CC-BY-4.0 requires the attribution to be reasonably visible for a public site — a `CREDITS.md` plus a small credit line in the `/space` HUD/footer satisfies it. NASA imagery is public domain (credit requested, not legally required).

## Project Constraints (from CLAUDE.md / STATE.md)

- **Additive only** — do not touch the live homepage or shared components destructively; `/space` is an isolated prototype route. Import `TeamSection` verbatim (no edits).
- **React 19.2.4 / fiber v9 / drei v10** — no version changes; no new heavy deps.
- **prefers-reduced-motion** — `page.tsx` already falls back to a static `ScenePoster`; keep that. The real skybox is static anyway (no motion), so it can safely render in the reduced-motion path too if desired.
- **Mobile is first-class** — 2K default, feature-gate 8K.
- **Karpathy guidelines** — surgical swaps: `Starfield.tsx` → `SpaceBackground.tsx`, `Planet.tsx` gains `map`, spacer → real DOM. Don't restructure the working scroll/camera rig.
- **Verification** — tsc + lint + build + both-theme smoke; `next.config.ts` ignores TS/lint in build, so run `npx tsc --noEmit` + `npm run lint` explicitly.

## Sources

**Primary (HIGH):**
- solarsystemscope.com/textures — URLs + CC-BY-4.0 license (all sample URLs verified HTTP 200 via curl)
- svs.gsfc.nasa.gov/4851 — NASA Deep Star Maps 2020 (EXR resolutions + credit; verified 200)
- drei.docs.pmnd.rs/staging/environment — `<Environment>` background/files/path props, format support
- Installed package.json — three 0.184 / fiber 9.6.1 / drei 10.7.7 / maath 0.10.8
- Local source read: SpaceExperience/Starfield/Planet/CameraRig/SpaceHUD/waypoints/TeamSection + page.tsx

**Confidence:** Standard stack HIGH · Asset URLs HIGH (curl-verified) · DOM/skybox patterns HIGH · section→planet mapping is aesthetic recommendation (MEDIUM, adjustable).
