<!-- GSD:project-start source:PROJECT.md -->
## Project

**Usama Javed Portfolio — World-Class Upgrade**

The live personal portfolio of Usama Javed (usamajaved.com.au) — Senior Full Stack Developer & AI Engineer in Perth. A feature-rich Next.js 15 site with hand-built 3D/canvas animations, a blog, services, fund-me widget, and extensive AI-SEO infrastructure. This milestone upgrades every component to a world-class modern UI standard and adds his AI engineering experience — without removing anything that exists today.

**Core Value:** A visitor (recruiter, client, hiring manager) is visually stunned within 3 seconds and immediately understands Usama is both a senior full-stack developer AND a production AI engineer — every existing capability preserved, every pixel elevated.

### Constraints

- **Compatibility**: React 19.2.4 — requires @react-three/fiber v9 and motion v12 if added; verify all new deps support React 19
- **Tech stack**: Next.js 15 App Router + Tailwind v4 CSS-first + TS — no framework changes
- **Content**: Additive only; existing entries preserved verbatim when centralizing
- **Privacy**: No Horizon Digital research or interview-prep content anywhere public
- **Performance**: Animations must pause off-screen and respect prefers-reduced-motion; mobile performance is first-class
- **Verification**: tsc + lint + build + manual smoke in BOTH themes per phase (build alone passes with errors)
- **Deploy**: Vercel project `modern-portfolio` (serves usamajaved.com.au); production deploy gated on owner approval
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.9.2 (`typescript` ^5) - All app code: pages, components, API routes (`src/**/*.ts`, `src/**/*.tsx`)
- CSS - Tailwind v4 CSS-first configuration in `src/app/globals.css` (no `tailwind.config.*` file exists; v4 uses `@theme` in CSS)
- JSON - Training data at `data/query-scenarios.json`, AI/SEO datasets in `public/*.json`
## Runtime
- Node.js (local dev machine runs v22.22.2; `@types/node` pins ^20)
- No `engines` field in `package.json`, no `.nvmrc` - Node version is unconstrained
- Next.js server runtime (API routes use Node runtime; no `export const runtime = 'edge'` declarations)
- npm (lockfileVersion 3)
- Lockfile: present (`package-lock.json`)
## Frameworks
- Next.js 15.5.12 (`next` ^15.5.12) - App Router (`src/app/`), API route handlers, `next/font`, `next/script`, metadata API
- React 19.2.4 / React DOM 19.2.4 - UI layer
- Not detected. No test framework, no test files, no test script in `package.json`
- Next.js built-in bundler (no custom webpack/turbopack config)
- PostCSS via `postcss.config.mjs` - single plugin: `@tailwindcss/postcss` 4.1.13
- Tailwind CSS 4.1.13 (devDependency) - styling system
- ESLint 9.36.0 flat config (`eslint.config.mjs`) extending `next/core-web-vitals` + `next/typescript` via `FlatCompat` (`eslint-config-next` 15.5.4)
## Key Dependencies
- `stripe` 18.5.0 - Server-side Stripe SDK, used only in `src/app/api/create-checkout/route.ts` (pinned API version `2024-06-20`)
- `@stripe/stripe-js` 7.9.0 - Installed but **unused** (no `loadStripe` import anywhere; checkout uses server-created session URL redirect)
- `nodemailer` 7.0.6 - Gmail SMTP transport in `src/app/api/send-email/route.ts`
- `@emailjs/browser` 4.4.1 - Client-side email in `src/app/contact/page.tsx` and `src/app/ideas/page.tsx`
- `@types/nodemailer` 7.0.1 - Misplaced in `dependencies` (should be devDependency); harmless
- No `framer-motion`, no `three`, no `@react-three/fiber`, no `gsap`. All animation is hand-rolled:
- **Version compatibility for planned additions:** React 19.2.4 requires `framer-motion`/`motion` v11.11+ (v12 recommended) and `@react-three/fiber` v9.x (v8 does NOT support React 19). Plain `three` has no React constraint. No peer-dependency blockers otherwise; npm lockfile v3 is standard.
## Configuration
- No `.env*` files committed (confirmed absent from repo root)
- Env vars read directly via `process.env` in API routes (see INTEGRATIONS.md for full list)
- Hardcoded fallbacks exist in code (e.g., `EMAIL_USER` defaults to a Gmail address in `src/app/api/send-email/route.ts`)
- `reactStrictMode: true`, `compress: true`, `poweredByHeader: false`
- **`eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`** - lint/type errors do NOT fail builds; expect latent type errors when refactoring
- `compiler.removeConsole` in production
- Image optimization: AVIF/WebP, `domains: ['usamajaved.com']`, 1-year cache TTL, SVG allowed with CSP sandbox
- `experimental.scrollRestoration: true`
- Extensive custom `headers()`: security headers (X-Frame-Options, Referrer-Policy, Permissions-Policy), immutable caching for static assets, and content-type/cache headers for AI discovery files (`/llms.txt`, `/llms-full.txt`, `/ai.txt`, `/humans.txt`, `/feed.xml`)
- `redirects()`: `/home`, `/portfolio`, `/about` → `/` (permanent)
- `rewrites()`: `/.llms` → `/api/llms`
- `strict: true`, target ES2017, `moduleResolution: "bundler"`, `jsx: "preserve"`
- Path alias: `@/*` → `./src/*`
- Flat config; ignores `node_modules`, `.next`, `out`, `build`, `next-env.d.ts`
## Styling System
- Tailwind CSS v4 via PostCSS plugin only - **no `tailwind.config.js/ts`**; theme customization lives in `src/app/globals.css`
- Class-based utility styling throughout components; some inline `style` props for CSS variables (e.g., `--canvas-opacity` in `src/components/Hero3D.tsx`)
## Fonts
- Geist (`--font-geist-sans`), preloaded, swap
- Geist Mono (`--font-geist-mono`), preloaded, swap
- Space Grotesk (`--font-space-grotesk`), preloaded, swap
## Scripts
## Platform Requirements
- Node.js 20+ (types target Node 20; v22 in use locally), npm
- Vercel Edge Network (per `README.md`); standard Next.js serverless deployment
- No CI pipeline (`.github/` contains only `copilot-instructions.md` and `instructions/codacy.instructions.md` - no workflows)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Components: PascalCase `.tsx` in flat `src/components/` (no subfolders) — `Navigation.tsx`, `ThemeToggle.tsx`, `ScrollReveal.tsx`, `FundMeWidget.tsx`
- Pages: Next.js App Router convention — `src/app/<route>/page.tsx` with kebab-case route directories (`fund-me/`, `tech-stack/`, `developer-australia/`, `llm-training-dashboard/`)
- API routes: `src/app/api/<kebab-case>/route.ts` — `api/send-email/route.ts`, `api/create-checkout/route.ts`
- Dynamic routes: `src/app/projects/[id]/page.tsx`
- Special files: `src/app/sitemap.ts`, `src/app/robots.ts` (Next.js metadata routes)
- camelCase for handlers and helpers: `handleScroll`, `isActivePage`, `toggle` (`src/components/Navigation.tsx`, `src/components/ThemeToggle.tsx`)
- Component functions: PascalCase, declared with `export default function Name()` — not arrow consts
- camelCase: `navItems`, `blogPosts`, `accentMap`, `isMobileMenuOpen`
- Boolean state prefixed `is`/`has`/`scrolled`/`mounted`: `isVisible`, `hasAnimated`, `mounted`
- Static page data declared as plain `const` arrays of object literals inside the component or at module scope (see `projects` and `skills` in `src/app/page.tsx`, `blogPosts` in `src/app/blog/page.tsx`)
- Props interfaces: `<ComponentName>Props` — `NavigationProps`, `ScrollRevealProps`
- Secondary exports in the same file use inline object-literal prop types instead of named interfaces (see `StaggerReveal`, `AnimatedCounter`, `MagneticHover` in `src/components/ScrollReveal.tsx`)
- String literal unions for constrained values: `useState<"dark" | "light">`, `direction?: "up" | "down" | "left" | "right" | "none"`
- `Record<string, T>` for lookup maps: `accentMap: Record<string, { dot: string; text: string }>` in `src/app/page.tsx`
## Component Patterns
- ALL 17 components in `src/components/` are client components (`"use client"` first line). There are no shared server components.
- Pages split two ways:
- Quote style for the directive is inconsistent (`"use client"` and `'use client'` both occur) — match the file you are editing
- `mounted` state + `if (!mounted) return null` (or opacity fade-in) is the standard hydration-mismatch guard for anything touching `localStorage`/`window`
- Default props via destructuring defaults: `({ className = "", delay = 0, once = true })`
- Multiple related components exported from one file: default export + named exports (`ScrollReveal` default plus `StaggerReveal`, `AnimatedCounter`, `MagneticHover`, `TextReveal`, `ParallaxSection` in `src/components/ScrollReveal.tsx`)
## Tailwind / Styling
- Backgrounds: `--bg-primary` (#0a0a0f dark), `--bg-secondary`, `--bg-card`, `--bg-card-hover`, `--bg-elevated`, `--bg-nav`
- Text hierarchy: `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-muted`, `--text-faint`, `--text-ghost`
- Borders: `--border-subtle`, `--border-default`, `--border-hover`
- Buttons: `--btn-primary-bg/text/shadow`, `--btn-secondary-border/text`
- Accents: `--accent-blue` (#60a5fa), `--accent-violet` (#a78bfa), `--accent-emerald` (#34d399)
- Misc: `--gradient-divider`, `--shadow-card`, `--canvas-opacity`
- Dark is the default theme (`:root` in `globals.css`); light theme overrides under `[data-theme="light"]`
- `src/components/ThemeToggle.tsx` sets `document.documentElement.setAttribute("data-theme", ...)` and persists choice to `localStorage.theme`
- NOT Tailwind `dark:` variant — theming flows entirely through the CSS custom properties above. New UI must use the tokens to be theme-aware.
- Glassmorphism utilities: `bg-white/[0.04]`, `border-white/[0.1]`, `backdrop-blur-md`
- Arbitrary values common: `h-[92vh]`, `ease-[cubic-bezier(0.16,1,0.3,1)]`, `font-[family-name:var(--font-space-grotesk)]`
- Fonts: `next/font/google` (Geist, Geist_Mono, Space_Grotesk) exposed as CSS variables `--font-geist-sans`, `--font-geist-mono`, `--font-space-grotesk` in `src/app/layout.tsx`
- Hover color changes on tokenized elements done via `onMouseEnter`/`onMouseLeave` mutating `e.currentTarget.style.color` (see nav links in `src/components/Navigation.tsx`)
## Animations
- `ScrollReveal` — IntersectionObserver + inline opacity/transform transition; signature easing `cubic-bezier(0.16, 1, 0.3, 1)`
- `StaggerReveal` — wraps children with incrementing `delay`
- `AnimatedCounter` — `requestAnimationFrame` count-up with ease-out cubic, triggered at `threshold: 0.5`
- `MagneticHover` — mousemove transform; `TextReveal` — per-character stagger; `ParallaxSection` — passive scroll listener
- Page fade-in via `@keyframes page-fade-in` on `body` in `globals.css`
- **Accessibility rule:** every animation respects `prefers-reduced-motion` — components check `window.matchMedia("(prefers-reduced-motion: reduce)")` and `globals.css` has a global reduced-motion kill switch. New animations must do the same.
- Mount-in animations use the `mounted` state toggling `opacity-100 translate-y-0` vs `opacity-0 -translate-y-4` classes (see `<nav>` in `Navigation.tsx`)
## SEO Metadata
- Root: massive `export const metadata: Metadata` in `src/app/layout.tsx` with `metadataBase`, title `template` (`'%s | Usama Javed - Perth\'s Leading Developer'`), openGraph, twitter, robots, alternates/canonical, keywords array
- Per-page: server pages export their own `export const metadata: Metadata = { title, description, keywords: [...] }` (see `src/app/blog/page.tsx`, `src/app/services/page.tsx`). No `generateMetadata` is used anywhere.
- Structured data: seven JSON-LD blocks (Person, ProfilePage, ProfessionalService, WebSite, FAQPage, ItemList, WebPage/Speakable) rendered in `<head>` of `src/app/layout.tsx` via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`
- `src/app/sitemap.ts` and `src/app/robots.ts` are Next.js metadata route files
- AI/LLM SEO is a first-class concern: `public/llms.json`, `public/.well-known/*`, `src/components/AISeoContent.tsx`, custom headers for `/llms.txt` etc. in `next.config.ts`
- Client pages cannot export metadata — if a new page needs unique SEO, make it a server page and isolate interactivity into client components
## Code Style
- No Prettier config. Formatting relies on VSCode `editor.formatOnSave` + ESLint autofix (`.vscode/settings.json`)
- 2-space indentation, semicolons always, trailing commas in multiline literals
- Quotes are mixed per file (double in `ScrollReveal.tsx`/`layout.tsx`, single in `Navigation.tsx`/API routes) — match surrounding file
- ESLint 9 flat config: `eslint.config.mjs` extends `next/core-web-vitals` + `next/typescript` via `FlatCompat`; ignores `node_modules`, `.next`, `out`, `build`, `next-env.d.ts`
- No custom rules added
## Import Organization
- `@/*` → `./src/*` (`tsconfig.json`). Pages import via `@/components/Navigation`; components import siblings relatively (`./ThemeToggle`). Follow that split.
## Error Handling
- API routes (`src/app/api/*/route.ts`): whole handler wrapped in `try/catch`; success returns `NextResponse.json({ success: true, ... })`; failure logs `console.error(...)` and returns `NextResponse.json({ success: false, message }, { status: 500 })` — see `src/app/api/send-email/route.ts`
- Env vars read with `process.env.X || 'fallback'` inline (no central config module)
- Client components: defensive null checks (`if (!el) return`) rather than error boundaries; no error boundary components exist
## Logging
## Comments
- Section-divider comments in JSX and CSS: `{/* Sliding circle with sun/moon */}`, `/* ============ THEME SYSTEM ============ */`
- Inline explanatory comments for non-obvious logic (`// Ease out cubic`, `// Check prefers-reduced-motion`)
- No JSDoc/TSDoc anywhere — do not add unless asked
## Module Design
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- App Router (`src/app/`) with file-based routing; one dynamic segment (`projects/[id]`)
- Heavy client-side interactivity via `"use client"` pages + custom Canvas 2D animation components (no Three.js / WebGL — all visuals are hand-rolled 2D canvas with manual 3D projection)
- Aggressive AI-SEO layer: 7 JSON-LD schema blocks in the root layout, an invisible `sr-only` semantic content component, `llms.txt`-family discovery files, and bot-segmented robots rules
- Dynamic imports with `ssr: false` to defer heavy canvas/visual components (`next/dynamic` in `src/app/page.tsx`, `src/components/Hero3D.tsx`, `src/app/fund-me/page.tsx`, `src/app/ideas/page.tsx`)
- Theming via CSS custom properties on `:root` / `[data-theme="light"]` in `src/app/globals.css`, toggled by `src/components/ThemeToggle.tsx`
## Layers
- Purpose: Global HTML shell, fonts, metadata, structured data, footer composition
- Location: `src/app/layout.tsx` (689 lines)
- Contains: Three Google fonts (Geist, Geist Mono, Space Grotesk as CSS variables), full `Metadata` export (OpenGraph, Twitter, robots, alternates, verification), 7 inline JSON-LD `<script>` blocks (Person, ProfilePage, ProfessionalService w/ reviews, WebSite, FAQPage, ItemList of projects, WebPage+Speakable), geo/Dublin Core meta tags, AI discovery `<link>`/`<meta>` hints
- Used by: every route; renders `{children}` then `<ConditionalFooter />`
- Purpose: One file per route; each page is self-contained (own content data, own JSON-LD where applicable)
- Location: `src/app/**/page.tsx`
- Client pages (`"use client"`): `/` (`src/app/page.tsx`), `/budget`, `/contact`, `/fund-me`, `/fund-me/success`, `/ideas`, `/llm-training-dashboard`, `/team`, `/test-apis`
- Server pages (no directive, export `metadata`): `/blog`, `/blog/ai-developer-perth`, `/blog/best-developer-perth`, `/developer-australia`, `/expertise`, `/services`, `/tech-stack`, `/projects/[id]`
- Note: client pages CANNOT export `metadata` — SEO for those depends on the root layout defaults
- Purpose: Reusable UI, animation primitives, SEO content layers
- Location: `src/components/` (flat, 18 files)
- Server components: `AISeoContent.tsx`, `AdvancedSEO.tsx` (currently unused — see below), `LastUpdated.tsx`
- All others are `"use client"`
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
## Data Flow
- Local `useState`/`useRef` only — no global store, no context providers
- Theme state: `localStorage("theme")` + `data-theme` attribute on `<html>`, set in `src/components/ThemeToggle.tsx`; consumed purely through CSS variables in `src/app/globals.css`
- Animation state lives in refs (mutable, no re-renders) driven by `requestAnimationFrame`
## Key Abstractions — Visual/Animation Components (detailed)
- Wrapper for the homepage hero. Tracks normalized mouse position (-1..1) in a `useRef` via a window `mousemove` listener (no re-renders)
- Dynamically imports `Hero3DScene` with `ssr: false`; passes the mouse ref down as a prop
- Text overlay (name, role, CTAs via `InteractiveButton`, stats) animates in with pure CSS transitions gated on an `isLoaded` state flag; staggered with Tailwind `delay-*` classes
- Has a local `styled-jsx` keyframe (`gradient-flow`) animating the gradient text on "Javed"
- Canvas opacity is themed via `var(--canvas-opacity)` (1 dark / 0.6 light)
- **Technology: Canvas 2D + requestAnimationFrame + manual 3D math. NOT WebGL, NOT Three.js**
- Single `<canvas>` filling the hero; DPR-aware resize (`canvas.width = clientWidth * dpr`, `ctx.setTransform`)
- Render loop draws, per frame: (1) faded dot grid background; (2) 8 floating wireframe triangles/diamonds drifting vertically; (3) 100 pulsing particles with edge-wrap and proximity lines (<120px, O(n²) pair check); (4) a wireframe **icosahedron** — 12 hardcoded vertices + 30 edges, rotated on 3 axes by time + smoothed mouse, perspective-projected (`scale = 350/(350+z)`), edges drawn with depth-based alpha and blue→violet linear gradients, vertices with 3-layer radial-gradient glow; (5) 3 elliptical orbiting dashed rings (via `ctx.scale(1, 0.3)`) with orbiting dots; (6) a 200px radial-gradient cursor glow
- Mouse parallax: lerped (`smooth += (target - smooth) * 0.05`); shifts the icosahedron center ±50px and rotation phase
- Cleanup: `cancelAnimationFrame` + resize listener removal in effect teardown
- **Technology: Canvas 2D + rAF, manual spherical math.** Used on `/fund-me` (line 181), dynamically imported with `ssr: false`
- Draws a wireframe globe: latitude lines every 30° (-60..60), longitude lines every 30°, brighter equator — each polyline built from `latLonToXYZ()` samples, rotated by `rotateX`/`rotateY`, perspective-projected; back-face segments dimmed via z-based alpha (color strings use an `"ALPHA"` placeholder replaced per-segment)
- 31 hardcoded city points (`POINTS_OF_PRESENCE` lat/lon array, line 11) drawn as pulsing glowing dots (per-index pulse rates); 15 `CONNECTIONS` index pairs (line 52) rendered as great-circle arcs (slerp interpolation, 40 steps, lifted 8% above surface) with a traveling brightness pulse (`Math.exp(-dist²·60)`)
- Interaction: Pointer Events with `setPointerCapture` for drag-to-rotate (x clamped to ±π/2); auto-rotates `y += 0.003`/frame when not dragging; `touchAction: "none"` for mobile
- Sizing: `ResizeObserver` on the container drives a `dimensions` state; accepts optional `size` prop
- **Technology: Canvas 2D + rAF particle network.** Used as the `/ideas` page background (line 161), dynamically imported with `ssr: false`
- Three node types: 6 large "idea" nodes (white/violet radial-gradient cores + 6r glow), ~54 "node" connectors, 20 amber "sparks"
- Physics per frame: mouse attraction (idea/node types pulled toward cursor proportional to `1 - dist/180`), sparks **orbit** the cursor (tangential velocity), velocity damping ×0.995, edge wrap-around
- Connections drawn dynamically between non-spark nodes within `min(w,h)*0.22`, with violet→blue gradients when an idea node is involved, plus small traveling pulse dots along idea connections; 120px cursor glow when mouse active
- DPR capped at 2; `init()` re-seeds nodes on resize
- `ScrollReveal` (default): IntersectionObserver toggles opacity/transform with a CSS transition (`cubic-bezier(0.16,1,0.3,1)`); props `delay`, `direction` (up/down/left/right/none), `distance`, `duration`, `once`, `threshold`; respects `prefers-reduced-motion` (renders visible immediately). This is the workhorse — wrapped around nearly every section on every client page
- `StaggerReveal`: maps children into `ScrollReveal`s with incremental delays
- `AnimatedCounter`: IntersectionObserver-triggered rAF count-up with ease-out-cubic; used for homepage stats
- `MagneticHover`: mousemove-driven `translate()` toward cursor (strength prop), springs back on leave
- `TextReveal`: per-character span fade/slide-in with `charDelay` stagger
- `ParallaxSection`: passive scroll listener applying `translateY(scrolled * speed)`; respects reduced-motion
- **Technology: pure CSS keyframe cross-fade between two SVG path groups — no JS animation loop**
- `MorphIcon` wrapper renders one `<svg>` with two `<g>` groups (state A / state B) whose opacities alternate via `ai-fade-in`/`ai-fade-out` keyframes (3000ms cycle, `animation-direction: alternate`); keyframes injected once into `document.head` (`ensureKeyframes()`, guarded by element id `animated-icons-keyframes` and `typeof document`)
- 12 exported icons: `LoadingSuccess`, `PlayPause`, `LockUnlock`, `MenuClose`, `MailOpen`, `EyeHidden`, `MicMuted`, `WifiOff`, `BellSilent`, `HeartBroken`, `SunMoon`, `CodeTerminal`; plus `AnimatedIconShowcase` grid
- Current consumers: only `src/app/fund-me/page.tsx` (`HeartBroken`, `LoadingSuccess`, `LockUnlock`)
- Polymorphic button/anchor (renders `<a>` if `href` given): variants `primary`/`secondary`/`ghost` styled entirely from CSS variables (`--btn-primary-bg` etc.), sizes `sm`/`md`/`lg`
- Two effects: (1) click **ripple** — appends `{x,y,id}` to state, span animated by local `styled-jsx` keyframe `ripple-expand` (0→300px over 0.6s), removed via `setTimeout`; (2) hover **cursor-follow glow** — 120px radial gradient positioned at tracked `mousePos`; plus `translateY(-1px)` lift + box-shadow on hover
- Used pervasively for CTAs across pages
- Sets `data-theme` attribute on `document.documentElement` + persists to `localStorage("theme")`; default dark
- Pure CSS-transition slider: a circle translates across a pill track (`cubic-bezier(0.16,1,0.3,1)`, 500ms); sun and moon SVGs cross-fade/rotate/scale inside the knob
- `mounted` guard returns `null` pre-hydration to avoid SSR mismatch
- Rendered inside `src/components/Navigation.tsx` (desktop line 122, mobile line 170)
## Entry Points
## API Route Architecture
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
- **`src/app/sitemap.ts`:** `MetadataRoute.Sitemap` listing all marketing routes + 7 project URLs + 2 blog articles with priorities; uses `new Date().toISOString()` for every `lastModified`
- **`src/app/robots.ts`:** `MetadataRoute.Robots` with three bot tiers — traditional crawlers (allowed, `/api/` `/test-apis` etc. disallowed), AI *search* bots explicitly allowed (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Applebot, DuckAssistBot, PhindBot, YouBot...), AI *training* bots fully blocked (GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider, meta-externalagent, cohere-ai...)
- **Structured data:** centralized in `src/app/layout.tsx` (7 schemas, lines 131–605); page-level JSON-LD also embedded in server pages (`src/app/blog/page.tsx` line 82, `src/app/expertise/page.tsx` line 431)
- **`src/components/AISeoContent.tsx`:** server component rendering an `sr-only` semantic article (question-form H2s, citation-length paragraphs, microdata `itemProp`s) — invisible to users, crawlable by bots; mounted at the top of `src/app/page.tsx`
- **`src/components/AdvancedSEO.tsx`:** prop-driven SEO/schema component using `next/head` — **currently imported by NO page** (dead code; uses the Pages-Router `Head` pattern which is a no-op in App Router). Do not model new SEO work on it
- **`src/components/LastUpdated.tsx`:** freshness-signal timestamp rendered at the bottom of the homepage
- **`next.config.ts`:** custom headers giving `llms.txt`/`llms-full.txt`/`feed.xml` correct content types and `X-Robots-Tag`; redirects `/home|/portfolio|/about → /`; rewrite `/.llms → /api/llms`
- **`public/` discovery files:** `llms.txt`, `llms-full.txt`, `llms-ctx.txt`, `llms-ctx-full.txt`, `ai.txt`, `ai-context.md`, `humans.txt`, `feed.xml`, `manifest.json`, `sitemap-australia.xml`, plus JSON training datasets
## Error Handling
- API: validate input → check service config → call → catch → JSON error with status code
- Pages: `notFound()` in `src/app/projects/[id]/page.tsx` for unknown ids
- Client forms: `submitStatus: "idle" | "success" | "error"` state pattern (see `src/app/ideas/page.tsx`, `src/app/contact/page.tsx`)
- Animations: `prefers-reduced-motion` checks in `ScrollReveal` and `ParallaxSection`; all rAF loops cancel on unmount
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
