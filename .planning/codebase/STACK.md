# Technology Stack

**Analysis Date:** 2026-06-10

## Languages

**Primary:**
- TypeScript 5.9.2 (`typescript` ^5) - All app code: pages, components, API routes (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**
- CSS - Tailwind v4 CSS-first configuration in `src/app/globals.css` (no `tailwind.config.*` file exists; v4 uses `@theme` in CSS)
- JSON - Training data at `data/query-scenarios.json`, AI/SEO datasets in `public/*.json`

## Runtime

**Environment:**
- Node.js (local dev machine runs v22.22.2; `@types/node` pins ^20)
- No `engines` field in `package.json`, no `.nvmrc` - Node version is unconstrained
- Next.js server runtime (API routes use Node runtime; no `export const runtime = 'edge'` declarations)

**Package Manager:**
- npm (lockfileVersion 3)
- Lockfile: present (`package-lock.json`)

## Frameworks

**Core:**
- Next.js 15.5.12 (`next` ^15.5.12) - App Router (`src/app/`), API route handlers, `next/font`, `next/script`, metadata API
- React 19.2.4 / React DOM 19.2.4 - UI layer

**Testing:**
- Not detected. No test framework, no test files, no test script in `package.json`

**Build/Dev:**
- Next.js built-in bundler (no custom webpack/turbopack config)
- PostCSS via `postcss.config.mjs` - single plugin: `@tailwindcss/postcss` 4.1.13
- Tailwind CSS 4.1.13 (devDependency) - styling system
- ESLint 9.36.0 flat config (`eslint.config.mjs`) extending `next/core-web-vitals` + `next/typescript` via `FlatCompat` (`eslint-config-next` 15.5.4)

## Key Dependencies

**Critical (runtime):**
- `stripe` 18.5.0 - Server-side Stripe SDK, used only in `src/app/api/create-checkout/route.ts` (pinned API version `2024-06-20`)
- `@stripe/stripe-js` 7.9.0 - Installed but **unused** (no `loadStripe` import anywhere; checkout uses server-created session URL redirect)
- `nodemailer` 7.0.6 - Gmail SMTP transport in `src/app/api/send-email/route.ts`
- `@emailjs/browser` 4.4.1 - Client-side email in `src/app/contact/page.tsx` and `src/app/ideas/page.tsx`
- `@types/nodemailer` 7.0.1 - Misplaced in `dependencies` (should be devDependency); harmless

**Notable absences (relevant to the UI upgrade milestone):**
- No `framer-motion`, no `three`, no `@react-three/fiber`, no `gsap`. All animation is hand-rolled:
  - "3D" hero is a custom Canvas **2D** particle scene: `src/components/Hero3DScene.tsx` (raw `canvas.getContext("2d")`)
  - `src/components/Hero3D.tsx`, `src/components/InteractiveGlobe.tsx`, `src/components/IdeaNetworkCanvas.tsx`, `src/components/ScrollReveal.tsx`, `src/components/AnimatedIcons.tsx` are CSS/canvas based
- **Version compatibility for planned additions:** React 19.2.4 requires `framer-motion`/`motion` v11.11+ (v12 recommended) and `@react-three/fiber` v9.x (v8 does NOT support React 19). Plain `three` has no React constraint. No peer-dependency blockers otherwise; npm lockfile v3 is standard.

## Configuration

**Environment:**
- No `.env*` files committed (confirmed absent from repo root)
- Env vars read directly via `process.env` in API routes (see INTEGRATIONS.md for full list)
- Hardcoded fallbacks exist in code (e.g., `EMAIL_USER` defaults to a Gmail address in `src/app/api/send-email/route.ts`)

**Build (`next.config.ts`):**
- `reactStrictMode: true`, `compress: true`, `poweredByHeader: false`
- **`eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`** - lint/type errors do NOT fail builds; expect latent type errors when refactoring
- `compiler.removeConsole` in production
- Image optimization: AVIF/WebP, `domains: ['usamajaved.com']`, 1-year cache TTL, SVG allowed with CSP sandbox
- `experimental.scrollRestoration: true`
- Extensive custom `headers()`: security headers (X-Frame-Options, Referrer-Policy, Permissions-Policy), immutable caching for static assets, and content-type/cache headers for AI discovery files (`/llms.txt`, `/llms-full.txt`, `/ai.txt`, `/humans.txt`, `/feed.xml`)
- `redirects()`: `/home`, `/portfolio`, `/about` → `/` (permanent)
- `rewrites()`: `/.llms` → `/api/llms`

**TypeScript (`tsconfig.json`):**
- `strict: true`, target ES2017, `moduleResolution: "bundler"`, `jsx: "preserve"`
- Path alias: `@/*` → `./src/*`

**ESLint (`eslint.config.mjs`):**
- Flat config; ignores `node_modules`, `.next`, `out`, `build`, `next-env.d.ts`

## Styling System

- Tailwind CSS v4 via PostCSS plugin only - **no `tailwind.config.js/ts`**; theme customization lives in `src/app/globals.css`
- Class-based utility styling throughout components; some inline `style` props for CSS variables (e.g., `--canvas-opacity` in `src/components/Hero3D.tsx`)

## Fonts

Loaded via `next/font/google` in `src/app/layout.tsx`:
- Geist (`--font-geist-sans`), preloaded, swap
- Geist Mono (`--font-geist-mono`), preloaded, swap
- Space Grotesk (`--font-space-grotesk`), preloaded, swap

## Scripts

```bash
npm run dev     # next dev
npm run build   # next build
npm run start   # next start
npm run lint    # eslint (no path args - relies on flat config)
```

## Platform Requirements

**Development:**
- Node.js 20+ (types target Node 20; v22 in use locally), npm

**Production:**
- Vercel Edge Network (per `README.md`); standard Next.js serverless deployment
- No CI pipeline (`.github/` contains only `copilot-instructions.md` and `instructions/codacy.instructions.md` - no workflows)

---

*Stack analysis: 2026-06-10*
