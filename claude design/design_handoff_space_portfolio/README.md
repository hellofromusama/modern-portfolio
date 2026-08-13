# Handoff: Space-Journey Portfolio (Usama Javed)

## Overview
A single-page, scroll-driven **WebGL space journey**. The visitor flies forward
through a real star field; each portfolio section (hero, about, skills, projects,
team, contact) is a piece of **real HTML content floating as a 3D object** in the
same camera space as a set of **real, photo-textured planets**. Scrolling dives the
camera deeper into space; clicking a planet flies the camera to that section.

This bundle is the **design reference**. The goal for Claude Code is to **recreate
this experience in the target codebase** — the user's `@react-three/fiber` (React +
Three.js) site — using that project's real content, routing, and component patterns,
and to build the **other pages** of the site in the same visual language. It is **not**
meant to be shipped as-is: the `.dc.html` file is a prototype built on a proprietary
preview runtime (`support.js`) and will not run in a normal React app.

## Fidelity
**High-fidelity.** Final look, motion system, colors, typography, camera math,
projection math, planet/texture choices, and interactions are all specified below and
should be reproduced faithfully. Content strings are real and can be used directly.

---

## Tech target (recommendation)
Rebuild with **@react-three/fiber** + **@react-three/drei**:
- `useTexture` / `TextureLoader` for the planet + sky textures (URLs below).
- A background sky `<mesh>`: big `sphereGeometry` (r≈900), `meshBasicMaterial` with the
  night-sky map on `THREE.BackSide`, `fog={false}`.
- Planets: `sphereGeometry` + `meshStandardMaterial map={...}`; one directional "sun"
  light + low ambient so each planet shows a day/night terminator.
- Camera dive: `ScrollControls` + `useScroll` (drei) — map `scroll.offset` (0→1) to the
  same camera path used here. Ease toward the target each frame in `useFrame`.
- Floating content: drei `<Html transform occlude={false}>` anchored at each section's
  3D world position, OR replicate the manual projection (below) over a normal DOM layer.
  Using `<Html transform>` is the idiomatic R3F way to make real HTML float in 3D.
- Click-to-fly: `onClick` on each planet mesh → animate `scroll` to that planet's offset.

---

## The motion system (reproduce exactly)

### Scroll → camera dive
- A tall scroll driver (here: a `640vh` spacer) produces `t = scrollY / maxScroll`, clamped 0–1.
- `t` is **eased** toward its target every frame: `t += (target - t) * 0.07` (0.5 if reduced-motion).
- Camera position:
  - `camZ = 30 + t * (-262)`   → flies from z=30 to z=-232 (deeper = further along).
  - `camX = sin(t·2π)·1.6 + mouseX·3.2`  (gentle sway + mouse parallax)
  - `camY = 1 + sin(time·0.3)·0.4 + mouseY·2.2`
  - `camera.lookAt(mouseX·2.4, 1 + mouseY·1.8, camZ - 60)` → looks straight down −z (a clean dolly/zoom-in, NOT a 360 pan).
- `mouseX/mouseY` are pointer position mapped to −1..1.

### Content as floating 3D objects (manual projection used in the prototype)
Each section is placed at a **world position** and projected to the screen every frame:
- `focal = (viewportHeight / 2) / tan(60°/2)`   (60° vertical FOV)
- Per section anchor `a` (see table): `worldZ = (30 + a·-262) - 34`, `worldY = 1`,
  `worldX ∈ {hero 0, about 5, skills 0, projects 0, team -5, contact 0}`.
- Each frame: `dist = camZ - worldZ` (skip if `<2` or `>130`).
  - `screenX = W/2 + (worldX - camX) · focal / dist`
  - `screenY = H/2 - (worldY - camY) · focal / dist`
  - `scale   = 34 / dist`  → equals 1 at the section's "arrival" point, grows as you approach, then flies past.
  - opacity: `dist≥45 → (70-dist)/25` (fade in) · `18–45 → 1` · `<18 → (dist-3)/15` (fade out).
  - `zIndex = round(2000 - dist·8)`.
  - transform: `translate(screenX, screenY) translate(-50%,-50%) scale(scale)`.
- In R3F this is exactly what drei `<Html transform>` does for you — prefer that.

### Section anchors (arrival points along the dive)
| Section  | anchor `t` | planet at that stop |
|----------|-----------|---------------------|
| Hero     | 0.0  | Neptune (deep-blue) |
| About    | 0.2  | **Earth** (home planet) |
| Skills   | 0.4  | Venus + Moon (nodes) |
| Projects | 0.6  | asteroid field (Mercury / Moon / Mars) |
| Team     | 0.8  | **Saturn** (with real rings) |
| Contact  | 1.0  | **Jupiter** (finale) |

---

## Real textures (public domain / CORS-enabled — verified loading)
Background night sky (NASA Tycho star map, incl. Milky Way band):
- `https://cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png`

Planets (three.js examples + jeromeetienne/threex.planets, both via jsDelivr):
- Earth: `https://cdn.jsdelivr.net/gh/mrdoob/three.js@r152/examples/textures/planets/earth_atmos_2048.jpg`
- Moon:  `https://cdn.jsdelivr.net/gh/mrdoob/three.js@r152/examples/textures/planets/moon_1024.jpg`
- Jupiter: `.../threex.planets@master/images/jupitermap.jpg`
- Mars:    `.../threex.planets@master/images/marsmap1k.jpg`
- Saturn:  `.../threex.planets@master/images/saturnmap.jpg`
- Saturn ring: `.../threex.planets@master/images/saturnringcolor.jpg`
- Venus:   `.../threex.planets@master/images/venusmap.jpg`
- Mercury: `.../threex.planets@master/images/mercurymap.jpg`
- Neptune: `.../threex.planets@master/images/neptunemap.jpg`
(base for the last group: `https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/`)

**For production**, download these into the repo's asset pipeline rather than hotlinking a CDN.

### Planet placement (x, y, z, radius, texture, atmosphere-tint)
- Neptune — (10, -5, -66) r5.0, tint `#3a6ff0`
- Earth   — (-14, 0, -34) r8.2, tint `#5a9bff`
- Venus   — (12, 6, -78) r2.4, tint `#e8c98a`
- Moon    — (-12, -6, -70) r1.7, no tint
- Asteroid field — 8 bodies, radii 1.0–2.8, random x∈±15 y∈±10, z from -104 to -150, textures cycle [Mercury, Moon, Mars]
- Saturn  — (11, 3, -186) r4.4, **ring**, tint `#d8c79a`
- Jupiter — (0, -2, -262) r9.5, tint `#e0a86a`

Planet build notes: `sphereGeometry(r, 64, 48)`, `meshStandardMaterial({ map, roughness:0.92, metalness:0.02 })`.
Atmosphere = a slightly larger back-side additive sphere (`r·1.04`, tint color, opacity 0.16) + a soft radial glow sprite.
Each planet sits in a group with a random axial tilt (`rotation.z ≈ 0.12–0.5`) and spins slowly on its own axis
(`spin ≈ 0.0016–0.0038 rad/frame`) plus a small vertical bob.

### Saturn ring
`ringGeometry(r·1.35, r·2.35, 110)` with UVs remapped radially so the ring-color strip maps across the ring width:
for each vertex `uv.x = (vertexRadius - inner) / (outer - inner)`. `meshBasicMaterial({ map: ringTex, side: DoubleSide, transparent, opacity:0.92 })`, laid flat (`rotation.x = π/2`) inside the tilt group.

### Foreground stars (parallax + twinkle, on top of the photo sky)
Two `THREE.Points` layers (soft round additive sprite as the point texture, per-point color by star temperature):
- mid: ~900 points, size 1.7, spread 460, z −280..50, opacity ~0.7
- near: ~360 points, size 2.8, spread 320, z −240..40, opacity ~0.9
Twinkle by oscillating layer opacity; rotate slightly with mouse for parallax. Star colors weighted:
55% blue-white, 20% yellow, 15% orange, 7% red, 3% blue-giant.

### Lighting
- `ambientLight(0x556680, 0.7)`
- `directionalLight(0xfff4e6, 2.1)` at (30, 18, 42) — the "sun", gives terminators
- a faint moving `pointLight(0x88aaff, 0.35)` tracking the camera
- `scene.fog = FogExp2(0x05060a, 0.0052)`; sky sphere has `fog:false`.

---

## Interactions & behavior
- **Scroll** = dive forward/back (two-way; down = zoom in, up = zoom out). Eased, weighty.
- **Click a planet** → raycast; if hit, smooth-scroll to that planet's anchor `t` so the camera flies there.
  Cursor becomes a pointer when hovering a planet.
- **Top nav** (About / Skills / Projects / Team / Contact) → smooth-scroll to that section's anchor.
- **Project cards**: hover lifts +14px, scales 1.04, adds a colored glow + border in the card's accent color.
- **Sound toggle (♪/♫)**: a soft ambient drone — three sine oscillators (55, 82.4, 110 Hz) through a gain node ramped to ~0.045. Off by default.
- **Theme toggle (☾/☀)**: swaps the HUD accent between `#60a5fa` and `#fbbf24`.
- **Loader**: a counter 0→100 over ~1.5s, then fades out ("CALIBRATING FLIGHT PATH").
- **Reduced motion** (`prefers-reduced-motion`): kill autonomous sway/float; motion happens only from user scroll; faster ease.

## State
- `t` (eased scroll progress 0–1) — the master driver for camera + projection.
- `mouseX/mouseY` — pointer parallax.
- `audioOn`, `theme` (alt accent) — UI toggles.
- Team photos: user-supplied images (see Assets).

---

## Screens / content (real copy)

### HUD (persistent, flat overlay — NOT projected)
- Top-left monogram **UJ** (gradient `#60a5fa → #a78bfa`), label "Usama Javed / CREATIVE DEV".
- Top-center glass nav: About · Skills · Projects · Team · Contact.
- Top-right: theme + sound buttons.
- Right edge: vertical flight gauge (fills `#60a5fa → #a78bfa` with scroll) + "FLIGHT" + percent.
- Bottom progress bar.

### Hero (t=0)
- Eyebrow: `◦ N 31.95°  ·  E 115.86°  —  PERTH, AUSTRALIA`
- H1: **Usama Javed**
- Sub: "Perth's Senior Full-Stack Developer & AI Engineer"
- Line: "8+ years building enterprise solutions on cloud platforms · 50+ projects across Australia"
- Chips: 50+ Projects · 8+ Years · 20+ Technologies
- Hint: "SCROLL TO DIVE · CLICK A PLANET TO TRAVEL ↓"

### About (t=0.2) — glass card
- Label "01 — HOME PLANET", H2 "The developer behind the work"
- Body: "Senior Full-Stack Developer with 8+ years delivering 50+ enterprise projects — from humanitarian platforms to AI agents and cloud-native ERP systems. Based in Perth, building for clients across Australia."
- Stat chips: 50+ Projects · 8+ Years · 20+ Technologies · 100% Satisfaction

### Skills (t=0.4) — "Skills Constellation", 8 glass cards
FRONTEND (React/Next.js 15, TypeScript, Tailwind, Vue/Nuxt) · BACKEND (Node.js, Python/Django, PostgreSQL/MongoDB, REST/GraphQL) · CLOUD & DEVOPS (AWS/Azure/GCP, Docker/Kubernetes, CI/CD, Terraform) · AI PROTOCOLS & AGENTS (MCP/A2A/ACP, LangChain/LangGraph, CrewAI/AutoGen) · RAG & RETRIEVAL (Vector DBs, Embeddings/Reranking, Hybrid Search) · LLM ENGINEERING (Fine-tuning/Prompting, Ollama/Local LLMs, Eval & Guardrails) · AI ON AWS & OBS (Bedrock/SageMaker, Observability, Cost/Latency) · SPECIALIZATIONS (NetSuite/SuiteScript, Workflow Automation, Voice AI). Card accent colors cycle `#60a5fa, #a78bfa, #34d399, #fbbf24`.

### Projects (t=0.6) — "Selected Projects", 7 cards (accent per card)
Fund for Azad Kashmir (Humanitarian donation platform) · N8N Automation Platform (Enterprise workflow automation) · Voice AI Booking Agent (AI/ML appointment scheduling) · Enterprise ERP System (Business management suite) · NetSuite Integration Suite (SuiteScripts & RESTlets) · Cloud Infrastructure Platform (Scalable microservices · DevOps) · MCP NetSuite-Ollama Bridge (Natural-language ERP · local LLM).

### Team (t=0.8) — "The Crew" (illustrative)
3 circular photo slots (drag-drop in prototype). Roles: Backend Engineer, Cloud Architect, AI Engineer. **Swap with real team.**

### Contact (t=1.0) — glass card
Label "05 — FINAL APPROACH", H2 "Let's work together", body "Have a mission in mind? Let's build something that travels well." CTA button `hello@usamajaved.com.au →` (gradient). Links: GitHub · LinkedIn · X. Footer: "50+ PROJECTS DELIVERED · 100% CLIENT SATISFACTION".

---

## Design tokens
- **Background**: `#05060a` (space black)
- **Text**: `#f0eee9` / body `#ece9e4`; muted `#9aa1b2`, `#8b93a6`, `#6f7688`
- **Accents**: blue `#60a5fa`, violet `#a78bfa`, green `#34d399`, amber `#fbbf24`
- **Planet tints**: Neptune `#3a6ff0`, Earth `#5a9bff`, Venus `#e8c98a`, Saturn `#d8c79a`, Jupiter `#e0a86a`
- **Glass panels**: `background: rgba(18,22,36,.38)`, `backdrop-filter: blur(18px) saturate(1.25)`, `border: 1px solid rgba(255,255,255,.13)`, radius 16–26px.
- **Type**: display/headings **Space Grotesk** (600/700); body **Inter** (400–600); mono labels **JetBrains Mono** (uppercase, letter-spacing .12–.34em).
- **Radii**: cards 16–18px, panels 22–26px, pills 100px.
- **Camera**: 60° FOV; dive z 30 → −232; ease 0.07.

## Assets
- Planet/sky textures: external CDN URLs listed above (public domain / open). Download into the repo for production.
- Team photos: supplied by the user (the prototype uses drag-drop `<image-slot>` placeholders with ids `crew1/2/3`).
- Fonts: Google Fonts — Space Grotesk, Inter, JetBrains Mono.
- No custom icon set; glyphs are Unicode (☾ ☀ ♪ ♫ ◦ →).

## Files in this bundle
- `Space Portfolio Prototype.dc.html` — the full interactive design reference (open in the prototype tool to view; it relies on `support.js`).
- `image-slot.js` — the drag-drop photo placeholder used for team photos (prototype only).
- `support.js` — the prototype runtime (present so the HTML can be opened locally; **not** for production).

> Read the logic inside `Space Portfolio Prototype.dc.html` (the `class Component` block) for the exact camera, projection, planet, and interaction code — all values above are drawn from it.
