# Architecture

**Analysis Date:** 2026-06-10

## Pattern Overview

**Overall:** Next.js 15 App Router monolith — a single-deployment portfolio/marketing site with co-located API routes. No database; all page content is hardcoded in component files, and external state lives in third-party services (Stripe, OpenAI, SMTP).

**Key Characteristics:**
- App Router (`src/app/`) with file-based routing; one dynamic segment (`projects/[id]`)
- Heavy client-side interactivity via `"use client"` pages + custom Canvas 2D animation components (no Three.js / WebGL — all visuals are hand-rolled 2D canvas with manual 3D projection)
- Aggressive AI-SEO layer: 7 JSON-LD schema blocks in the root layout, an invisible `sr-only` semantic content component, `llms.txt`-family discovery files, and bot-segmented robots rules
- Dynamic imports with `ssr: false` to defer heavy canvas/visual components (`next/dynamic` in `src/app/page.tsx`, `src/components/Hero3D.tsx`, `src/app/fund-me/page.tsx`, `src/app/ideas/page.tsx`)
- Theming via CSS custom properties on `:root` / `[data-theme="light"]` in `src/app/globals.css`, toggled by `src/components/ThemeToggle.tsx`

## Layers

**Root Layout (server):**
- Purpose: Global HTML shell, fonts, metadata, structured data, footer composition
- Location: `src/app/layout.tsx` (689 lines)
- Contains: Three Google fonts (Geist, Geist Mono, Space Grotesk as CSS variables), full `Metadata` export (OpenGraph, Twitter, robots, alternates, verification), 7 inline JSON-LD `<script>` blocks (Person, ProfilePage, ProfessionalService w/ reviews, WebSite, FAQPage, ItemList of projects, WebPage+Speakable), geo/Dublin Core meta tags, AI discovery `<link>`/`<meta>` hints
- Used by: every route; renders `{children}` then `<ConditionalFooter />`

**Pages (mixed server/client):**
- Purpose: One file per route; each page is self-contained (own content data, own JSON-LD where applicable)
- Location: `src/app/**/page.tsx`
- Client pages (`"use client"`): `/` (`src/app/page.tsx`), `/budget`, `/contact`, `/fund-me`, `/fund-me/success`, `/ideas`, `/llm-training-dashboard`, `/team`, `/test-apis`
- Server pages (no directive, export `metadata`): `/blog`, `/blog/ai-developer-perth`, `/blog/best-developer-perth`, `/developer-australia`, `/expertise`, `/services`, `/tech-stack`, `/projects/[id]`
- Note: client pages CANNOT export `metadata` — SEO for those depends on the root layout defaults

**Components (mostly client):**
- Purpose: Reusable UI, animation primitives, SEO content layers
- Location: `src/components/` (flat, 18 files)
- Server components: `AISeoContent.tsx`, `AdvancedSEO.tsx` (currently unused — see below), `LastUpdated.tsx`
- All others are `"use client"`

**API Routes:**
- Purpose: Server-side integrations (Stripe, email, LLM calls, SEO automation)
- Location: `src/app/api/*/route.ts` (12 routes)
- Depends on: env vars (`STRIPE_SECRET_KEY`, `OPENAI_API_KEY`, SMTP creds, etc.), `data/query-scenarios.json`

## Route Map (complete)

| Route | File | Rendering | Purpose |
|-------|------|-----------|---------|
| `/` | `src/app/page.tsx` | Client | Homepage: Hero3D, about/stats, skills, projects grid, team, contact CTA, FAQ |
| `/blog` | `src/app/blog/page.tsx` | Server + metadata | Blog index; `blogPosts` + `categories` arrays inline; Blog JSON-LD |
| `/blog/ai-developer-perth` | `src/app/blog/ai-developer-perth/page.tsx` | Server + metadata | SEO article page |
| `/blog/best-developer-perth` | `src/app/blog/best-developer-perth/page.tsx` | Server + metadata | SEO article page |
| `/budget` | `src/app/budget/page.tsx` | Client | AI budget calculator; posts to `/api/budget-estimate` |
| `/contact` | `src/app/contact/page.tsx` | Client | Contact form; posts to `/api/send-email` |
| `/developer-australia` | `src/app/developer-australia/page.tsx` | Server + metadata | Australia-wide SEO landing page |
| `/expertise` | `src/app/expertise/page.tsx` | Server + metadata | Skills deep-dive; `technicalExpertise` object (line 20) + `certifications` (line 397) + expertise JSON-LD (line 431) |
| `/fund-me` | `src/app/fund-me/page.tsx` | Client | Donation page; uses `InteractiveGlobe`, `AnimatedIcons` (HeartBroken/LoadingSuccess/LockUnlock); posts to `/api/create-checkout` |
| `/fund-me/success` | `src/app/fund-me/success/page.tsx` | Client | Post-Stripe-checkout confirmation |
| `/ideas` | `src/app/ideas/page.tsx` | Client | Ideas pitch page with `IdeaNetworkCanvas` background + idea submission form |
| `/llm-training-dashboard` | `src/app/llm-training-dashboard/page.tsx` | Client | Dashboard for AI-training API status (`/api/ai-training`, `/api/auto-llm-training`) |
| `/projects/[id]` | `src/app/projects/[id]/page.tsx` | Server (async) | Project detail; `params` is `Promise<{id}>` (Next 15 pattern), `notFound()` on unknown id. NO `generateStaticParams`, NO `generateMetadata` |
| `/services` | `src/app/services/page.tsx` | Server + metadata | Services catalog |
| `/team` | `src/app/team/page.tsx` | Client | Team page (images in `public/team/`) |
| `/tech-stack` | `src/app/tech-stack/page.tsx` | Server + metadata | `techStack` + `features` arrays inline |
| `/test-apis` | `src/app/test-apis/page.tsx` | Client | Dev utility to manually hit `/api/test-openai`, `/api/test-free-llm`; disallowed in robots |
| `/sitemap.xml` | `src/app/sitemap.ts` | Metadata route | See SEO section |
| `/robots.txt` | `src/app/robots.ts` | Metadata route | See SEO section |

Valid `projects/[id]` ids (keys of the `projects` object in `src/app/projects/[id]/page.tsx`): `kashmir-fund`, `n8n-automation`, `voice-ai-agent`, `erp-system`, `netsuite-integration`, `cloud-infrastructure` (plus any listed in `src/app/sitemap.ts` — note sitemap also lists `modern-portfolio` which must exist in the object or will 404; verify before editing).

## Data Flow

**Content (static):**
1. All page content is hardcoded as `const` arrays/objects INSIDE page components — there is no CMS, no `data/` content layer for pages, no shared content module
2. The homepage projects grid: `projects` array in `src/app/page.tsx` (line 37) → cards link to `/projects/{id}`
3. Project detail content: separate, richer `projects` record in `src/app/projects/[id]/page.tsx` (line 4) — **the two lists are duplicated and must be kept in sync manually**, along with `projectsListData` JSON-LD in `src/app/layout.tsx` (line 494) and URLs in `src/app/sitemap.ts`
4. Skills content: `skills` array in `src/app/page.tsx` (line 82) for the homepage; `technicalExpertise` object in `src/app/expertise/page.tsx` (line 20) for the deep-dive; `knowsAbout` array in `src/app/layout.tsx` (line 175) and `AISeoContent.tsx` lists for SEO. **To ADD new AI/skill content, append to these arrays/objects — do not remove existing entries**
5. The only JSON data file: `data/query-scenarios.json`, consumed by `src/app/api/ai-training/route.ts` and `src/app/api/auto-llm-training/route.ts`

**Interactive flows (client → API):**
1. Contact form (`src/app/contact/page.tsx`) → `POST /api/send-email` → nodemailer SMTP
2. Budget calculator (`src/app/budget/page.tsx`) → `POST /api/budget-estimate` → tries OpenAI, then x.ai (Grok), then a third fallback via raw `fetch`
3. Fund-me donations (`src/app/fund-me/page.tsx`, `src/components/FundMeWidget.tsx`) → `POST /api/create-checkout` → Stripe Checkout session (lazy `getStripe()` init guarding missing keys) → redirect → `/fund-me/success`
4. LLM training dashboard → `GET/POST /api/ai-training`, `/api/auto-llm-training`, `/api/schedule-training`

**State Management:**
- Local `useState`/`useRef` only — no global store, no context providers
- Theme state: `localStorage("theme")` + `data-theme` attribute on `<html>`, set in `src/components/ThemeToggle.tsx`; consumed purely through CSS variables in `src/app/globals.css`
- Animation state lives in refs (mutable, no re-renders) driven by `requestAnimationFrame`

## Key Abstractions — Visual/Animation Components (detailed)

**`src/components/Hero3D.tsx` (client, 120 lines):**
- Wrapper for the homepage hero. Tracks normalized mouse position (-1..1) in a `useRef` via a window `mousemove` listener (no re-renders)
- Dynamically imports `Hero3DScene` with `ssr: false`; passes the mouse ref down as a prop
- Text overlay (name, role, CTAs via `InteractiveButton`, stats) animates in with pure CSS transitions gated on an `isLoaded` state flag; staggered with Tailwind `delay-*` classes
- Has a local `styled-jsx` keyframe (`gradient-flow`) animating the gradient text on "Javed"
- Canvas opacity is themed via `var(--canvas-opacity)` (1 dark / 0.6 light)

**`src/components/Hero3DScene.tsx` (client, 307 lines):**
- **Technology: Canvas 2D + requestAnimationFrame + manual 3D math. NOT WebGL, NOT Three.js**
- Single `<canvas>` filling the hero; DPR-aware resize (`canvas.width = clientWidth * dpr`, `ctx.setTransform`)
- Render loop draws, per frame: (1) faded dot grid background; (2) 8 floating wireframe triangles/diamonds drifting vertically; (3) 100 pulsing particles with edge-wrap and proximity lines (<120px, O(n²) pair check); (4) a wireframe **icosahedron** — 12 hardcoded vertices + 30 edges, rotated on 3 axes by time + smoothed mouse, perspective-projected (`scale = 350/(350+z)`), edges drawn with depth-based alpha and blue→violet linear gradients, vertices with 3-layer radial-gradient glow; (5) 3 elliptical orbiting dashed rings (via `ctx.scale(1, 0.3)`) with orbiting dots; (6) a 200px radial-gradient cursor glow
- Mouse parallax: lerped (`smooth += (target - smooth) * 0.05`); shifts the icosahedron center ±50px and rotation phase
- Cleanup: `cancelAnimationFrame` + resize listener removal in effect teardown

**`src/components/InteractiveGlobe.tsx` (client, 480 lines):**
- **Technology: Canvas 2D + rAF, manual spherical math.** Used on `/fund-me` (line 181), dynamically imported with `ssr: false`
- Draws a wireframe globe: latitude lines every 30° (-60..60), longitude lines every 30°, brighter equator — each polyline built from `latLonToXYZ()` samples, rotated by `rotateX`/`rotateY`, perspective-projected; back-face segments dimmed via z-based alpha (color strings use an `"ALPHA"` placeholder replaced per-segment)
- 31 hardcoded city points (`POINTS_OF_PRESENCE` lat/lon array, line 11) drawn as pulsing glowing dots (per-index pulse rates); 15 `CONNECTIONS` index pairs (line 52) rendered as great-circle arcs (slerp interpolation, 40 steps, lifted 8% above surface) with a traveling brightness pulse (`Math.exp(-dist²·60)`)
- Interaction: Pointer Events with `setPointerCapture` for drag-to-rotate (x clamped to ±π/2); auto-rotates `y += 0.003`/frame when not dragging; `touchAction: "none"` for mobile
- Sizing: `ResizeObserver` on the container drives a `dimensions` state; accepts optional `size` prop

**`src/components/IdeaNetworkCanvas.tsx` (client, 327 lines):**
- **Technology: Canvas 2D + rAF particle network.** Used as the `/ideas` page background (line 161), dynamically imported with `ssr: false`
- Three node types: 6 large "idea" nodes (white/violet radial-gradient cores + 6r glow), ~54 "node" connectors, 20 amber "sparks"
- Physics per frame: mouse attraction (idea/node types pulled toward cursor proportional to `1 - dist/180`), sparks **orbit** the cursor (tangential velocity), velocity damping ×0.995, edge wrap-around
- Connections drawn dynamically between non-spark nodes within `min(w,h)*0.22`, with violet→blue gradients when an idea node is involved, plus small traveling pulse dots along idea connections; 120px cursor glow when mouse active
- DPR capped at 2; `init()` re-seeds nodes on resize

**`src/components/ScrollReveal.tsx` (client, 292 lines) — animation primitive library, 5 exports:**
- `ScrollReveal` (default): IntersectionObserver toggles opacity/transform with a CSS transition (`cubic-bezier(0.16,1,0.3,1)`); props `delay`, `direction` (up/down/left/right/none), `distance`, `duration`, `once`, `threshold`; respects `prefers-reduced-motion` (renders visible immediately). This is the workhorse — wrapped around nearly every section on every client page
- `StaggerReveal`: maps children into `ScrollReveal`s with incremental delays
- `AnimatedCounter`: IntersectionObserver-triggered rAF count-up with ease-out-cubic; used for homepage stats
- `MagneticHover`: mousemove-driven `translate()` toward cursor (strength prop), springs back on leave
- `TextReveal`: per-character span fade/slide-in with `charDelay` stagger
- `ParallaxSection`: passive scroll listener applying `translateY(scrolled * speed)`; respects reduced-motion

**`src/components/AnimatedIcons.tsx` (client, 477 lines):**
- **Technology: pure CSS keyframe cross-fade between two SVG path groups — no JS animation loop**
- `MorphIcon` wrapper renders one `<svg>` with two `<g>` groups (state A / state B) whose opacities alternate via `ai-fade-in`/`ai-fade-out` keyframes (3000ms cycle, `animation-direction: alternate`); keyframes injected once into `document.head` (`ensureKeyframes()`, guarded by element id `animated-icons-keyframes` and `typeof document`)
- 12 exported icons: `LoadingSuccess`, `PlayPause`, `LockUnlock`, `MenuClose`, `MailOpen`, `EyeHidden`, `MicMuted`, `WifiOff`, `BellSilent`, `HeartBroken`, `SunMoon`, `CodeTerminal`; plus `AnimatedIconShowcase` grid
- Current consumers: only `src/app/fund-me/page.tsx` (`HeartBroken`, `LoadingSuccess`, `LockUnlock`)

**`src/components/InteractiveButton.tsx` (client, 147 lines):**
- Polymorphic button/anchor (renders `<a>` if `href` given): variants `primary`/`secondary`/`ghost` styled entirely from CSS variables (`--btn-primary-bg` etc.), sizes `sm`/`md`/`lg`
- Two effects: (1) click **ripple** — appends `{x,y,id}` to state, span animated by local `styled-jsx` keyframe `ripple-expand` (0→300px over 0.6s), removed via `setTimeout`; (2) hover **cursor-follow glow** — 120px radial gradient positioned at tracked `mousePos`; plus `translateY(-1px)` lift + box-shadow on hover
- Used pervasively for CTAs across pages

**`src/components/ThemeToggle.tsx` (client, 81 lines):**
- Sets `data-theme` attribute on `document.documentElement` + persists to `localStorage("theme")`; default dark
- Pure CSS-transition slider: a circle translates across a pill track (`cubic-bezier(0.16,1,0.3,1)`, 500ms); sun and moon SVGs cross-fade/rotate/scale inside the knob
- `mounted` guard returns `null` pre-hydration to avoid SSR mismatch
- Rendered inside `src/components/Navigation.tsx` (desktop line 122, mobile line 170)

## Entry Points

**`src/app/layout.tsx`:** root shell — fonts, metadata, JSON-LD, `<ConditionalFooter />`
**`src/components/Navigation.tsx`:** fixed top nav used by most pages (accepts `currentPage` prop); `navItems` = Home, Ideas, Contact, Budget, Fund Me; scroll-aware backdrop blur; embeds `ThemeToggle`. Note: `src/app/projects/[id]/page.tsx` renders its OWN inline `<nav>` instead (older slate-gradient style, not theme-variable based)
**`src/components/ConditionalFooter.tsx`:** client; `usePathname()`; hides `Footer` + `FundMeWidget` on `/fund-kashmir*` paths; otherwise rendered globally from layout

## API Route Architecture

All routes are `route.ts` files exporting `GET`/`POST` handlers with `NextRequest`/`NextResponse`. No shared middleware, no auth layer, no shared API utility module — each route is self-contained.

| Route | Method(s) | Integration |
|-------|-----------|-------------|
| `src/app/api/create-checkout/route.ts` | POST | Stripe SDK (`stripe` package), lazy `getStripe()` returning null when `STRIPE_SECRET_KEY` unset → 503 |
| `src/app/api/send-email/route.ts` | POST | nodemailer SMTP transport |
| `src/app/api/budget-estimate/route.ts` | POST | Raw `fetch` to OpenAI → x.ai (Grok) → fallback chain |
| `src/app/api/ai-training/route.ts` | GET/POST | Multi-provider LLM training submissions; reads `data/query-scenarios.json` |
| `src/app/api/auto-llm-training/route.ts` | GET/POST | Automated daily training batches; reads `data/query-scenarios.json` |
| `src/app/api/schedule-training/route.ts` | — | Training scheduler |
| `src/app/api/ai-verification/route.ts` | — | AI bot verification data |
| `src/app/api/australia-seo/route.ts` | — | Australia SEO JSON payload |
| `src/app/api/indexnow/route.ts` | GET/POST | Pings `api.indexnow.org` for instant indexing (key file: `public/usamajaved-indexnow-key-2026.txt`) |
| `src/app/api/llms/route.ts` | GET | Serves LLM context (rewrite target of `/.llms` in `next.config.ts`) |
| `src/app/api/test-openai/route.ts` | GET | OpenAI connectivity test (used by `/test-apis`) |
| `src/app/api/test-free-llm/route.ts` | GET | Free LLM connectivity test |

## SEO Architecture

This codebase treats AI-search SEO as a first-class subsystem:

- **`src/app/sitemap.ts`:** `MetadataRoute.Sitemap` listing all marketing routes + 7 project URLs + 2 blog articles with priorities; uses `new Date().toISOString()` for every `lastModified`
- **`src/app/robots.ts`:** `MetadataRoute.Robots` with three bot tiers — traditional crawlers (allowed, `/api/` `/test-apis` etc. disallowed), AI *search* bots explicitly allowed (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Applebot, DuckAssistBot, PhindBot, YouBot...), AI *training* bots fully blocked (GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider, meta-externalagent, cohere-ai...)
- **Structured data:** centralized in `src/app/layout.tsx` (7 schemas, lines 131–605); page-level JSON-LD also embedded in server pages (`src/app/blog/page.tsx` line 82, `src/app/expertise/page.tsx` line 431)
- **`src/components/AISeoContent.tsx`:** server component rendering an `sr-only` semantic article (question-form H2s, citation-length paragraphs, microdata `itemProp`s) — invisible to users, crawlable by bots; mounted at the top of `src/app/page.tsx`
- **`src/components/AdvancedSEO.tsx`:** prop-driven SEO/schema component using `next/head` — **currently imported by NO page** (dead code; uses the Pages-Router `Head` pattern which is a no-op in App Router). Do not model new SEO work on it
- **`src/components/LastUpdated.tsx`:** freshness-signal timestamp rendered at the bottom of the homepage
- **`next.config.ts`:** custom headers giving `llms.txt`/`llms-full.txt`/`feed.xml` correct content types and `X-Robots-Tag`; redirects `/home|/portfolio|/about → /`; rewrite `/.llms → /api/llms`
- **`public/` discovery files:** `llms.txt`, `llms-full.txt`, `llms-ctx.txt`, `llms-ctx-full.txt`, `ai.txt`, `ai-context.md`, `humans.txt`, `feed.xml`, `manifest.json`, `sitemap-australia.xml`, plus JSON training datasets

## Error Handling

**Strategy:** per-route try/catch returning `NextResponse.json({ error }, { status })`; graceful degradation when env keys are missing (e.g., Stripe 503 instead of crash)

**Patterns:**
- API: validate input → check service config → call → catch → JSON error with status code
- Pages: `notFound()` in `src/app/projects/[id]/page.tsx` for unknown ids
- Client forms: `submitStatus: "idle" | "success" | "error"` state pattern (see `src/app/ideas/page.tsx`, `src/app/contact/page.tsx`)
- Animations: `prefers-reduced-motion` checks in `ScrollReveal` and `ParallaxSection`; all rAF loops cancel on unmount

## Cross-Cutting Concerns

**Logging:** `console.log/error` only; stripped in production by `compiler.removeConsole` in `next.config.ts`
**Validation:** inline per-route (manual field checks); no schema library
**Authentication:** none — all API routes are public (robots disallows `/api/`, but no auth guard)
**Theming:** CSS custom properties (`src/app/globals.css`, 142 lines) — components NEVER hardcode theme colors; they reference `var(--bg-card)`, `var(--text-muted)`, etc. New components must follow this
**Build config caveat:** `next.config.ts` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true` — type errors will NOT fail the build

---

*Architecture analysis: 2026-06-10*
