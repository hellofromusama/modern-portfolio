# Coding Conventions

**Analysis Date:** 2026-06-10

## Naming Patterns

**Files:**
- Components: PascalCase `.tsx` in flat `src/components/` (no subfolders) — `Navigation.tsx`, `ThemeToggle.tsx`, `ScrollReveal.tsx`, `FundMeWidget.tsx`
- Pages: Next.js App Router convention — `src/app/<route>/page.tsx` with kebab-case route directories (`fund-me/`, `tech-stack/`, `developer-australia/`, `llm-training-dashboard/`)
- API routes: `src/app/api/<kebab-case>/route.ts` — `api/send-email/route.ts`, `api/create-checkout/route.ts`
- Dynamic routes: `src/app/projects/[id]/page.tsx`
- Special files: `src/app/sitemap.ts`, `src/app/robots.ts` (Next.js metadata routes)

**Functions:**
- camelCase for handlers and helpers: `handleScroll`, `isActivePage`, `toggle` (`src/components/Navigation.tsx`, `src/components/ThemeToggle.tsx`)
- Component functions: PascalCase, declared with `export default function Name()` — not arrow consts

**Variables:**
- camelCase: `navItems`, `blogPosts`, `accentMap`, `isMobileMenuOpen`
- Boolean state prefixed `is`/`has`/`scrolled`/`mounted`: `isVisible`, `hasAnimated`, `mounted`
- Static page data declared as plain `const` arrays of object literals inside the component or at module scope (see `projects` and `skills` in `src/app/page.tsx`, `blogPosts` in `src/app/blog/page.tsx`)

**Types:**
- Props interfaces: `<ComponentName>Props` — `NavigationProps`, `ScrollRevealProps`
- Secondary exports in the same file use inline object-literal prop types instead of named interfaces (see `StaggerReveal`, `AnimatedCounter`, `MagneticHover` in `src/components/ScrollReveal.tsx`)
- String literal unions for constrained values: `useState<"dark" | "light">`, `direction?: "up" | "down" | "left" | "right" | "none"`
- `Record<string, T>` for lookup maps: `accentMap: Record<string, { dot: string; text: string }>` in `src/app/page.tsx`

## Component Patterns

**'use client' usage:**
- ALL 17 components in `src/components/` are client components (`"use client"` first line). There are no shared server components.
- Pages split two ways:
  - **Client pages** (interactive): `src/app/page.tsx`, `contact/page.tsx`, `budget/page.tsx`, `fund-me/page.tsx`, `ideas/page.tsx`, `team/page.tsx`, `test-apis/page.tsx`, `llm-training-dashboard/page.tsx` — start with `"use client"`, CANNOT export `metadata`
  - **Server pages** (content/SEO): `blog/page.tsx`, `blog/*/page.tsx`, `expertise/page.tsx`, `services/page.tsx`, `developer-australia/page.tsx` — no directive, DO export `export const metadata: Metadata`
- Quote style for the directive is inconsistent (`"use client"` and `'use client'` both occur) — match the file you are editing

**Component structure (canonical, from `src/components/ThemeToggle.tsx` / `Navigation.tsx`):**
```tsx
"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); /* ... */ }, []);

  if (!mounted) return null; // hydration guard — standard pattern here

  return ( /* JSX */ );
}
```
- `mounted` state + `if (!mounted) return null` (or opacity fade-in) is the standard hydration-mismatch guard for anything touching `localStorage`/`window`
- Default props via destructuring defaults: `({ className = "", delay = 0, once = true })`
- Multiple related components exported from one file: default export + named exports (`ScrollReveal` default plus `StaggerReveal`, `AnimatedCounter`, `MagneticHover`, `TextReveal`, `ParallaxSection` in `src/components/ScrollReveal.tsx`)

**Heavy/client-only components are lazy-loaded** with `next/dynamic` and `ssr: false` plus a pulse skeleton (see top of `src/app/page.tsx`):
```tsx
const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  loading: () => <div className="animate-pulse h-[92vh]" style={{ background: 'var(--bg-card)' }}></div>,
  ssr: false
});
```

## Tailwind / Styling

**Setup:** Tailwind CSS v4 via `@import "tailwindcss"` in `src/app/globals.css`; PostCSS plugin `@tailwindcss/postcss` in `postcss.config.mjs`. No `tailwind.config` file — v4 CSS-first config with `@theme inline` block in `globals.css`.

**Design tokens (CSS custom properties, `src/app/globals.css`):**
- Backgrounds: `--bg-primary` (#0a0a0f dark), `--bg-secondary`, `--bg-card`, `--bg-card-hover`, `--bg-elevated`, `--bg-nav`
- Text hierarchy: `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-muted`, `--text-faint`, `--text-ghost`
- Borders: `--border-subtle`, `--border-default`, `--border-hover`
- Buttons: `--btn-primary-bg/text/shadow`, `--btn-secondary-border/text`
- Accents: `--accent-blue` (#60a5fa), `--accent-violet` (#a78bfa), `--accent-emerald` (#34d399)
- Misc: `--gradient-divider`, `--shadow-card`, `--canvas-opacity`

**Token consumption pattern — THE key convention:** layout/spacing/sizing via Tailwind utility classes, theme colors via inline `style` referencing CSS variables:
```tsx
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
     style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
```
Do NOT hardcode theme colors in className for themed surfaces. Tailwind color utilities (`bg-blue-400`, `text-amber-400`) are used only for accent dots/badges that look fine in both themes (see `accentMap` in `src/app/page.tsx`).

**Dark mode approach:**
- Dark is the default theme (`:root` in `globals.css`); light theme overrides under `[data-theme="light"]`
- `src/components/ThemeToggle.tsx` sets `document.documentElement.setAttribute("data-theme", ...)` and persists choice to `localStorage.theme`
- NOT Tailwind `dark:` variant — theming flows entirely through the CSS custom properties above. New UI must use the tokens to be theme-aware.

**Other styling conventions:**
- Glassmorphism utilities: `bg-white/[0.04]`, `border-white/[0.1]`, `backdrop-blur-md`
- Arbitrary values common: `h-[92vh]`, `ease-[cubic-bezier(0.16,1,0.3,1)]`, `font-[family-name:var(--font-space-grotesk)]`
- Fonts: `next/font/google` (Geist, Geist_Mono, Space_Grotesk) exposed as CSS variables `--font-geist-sans`, `--font-geist-mono`, `--font-space-grotesk` in `src/app/layout.tsx`
- Hover color changes on tokenized elements done via `onMouseEnter`/`onMouseLeave` mutating `e.currentTarget.style.color` (see nav links in `src/components/Navigation.tsx`)

## Animations

No animation library (no Framer Motion/GSAP). All animation is hand-rolled in `src/components/ScrollReveal.tsx`:
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

**Formatting:**
- No Prettier config. Formatting relies on VSCode `editor.formatOnSave` + ESLint autofix (`.vscode/settings.json`)
- 2-space indentation, semicolons always, trailing commas in multiline literals
- Quotes are mixed per file (double in `ScrollReveal.tsx`/`layout.tsx`, single in `Navigation.tsx`/API routes) — match surrounding file

**Linting:**
- ESLint 9 flat config: `eslint.config.mjs` extends `next/core-web-vitals` + `next/typescript` via `FlatCompat`; ignores `node_modules`, `.next`, `out`, `build`, `next-env.d.ts`
- No custom rules added

## Import Organization

**Order (observed, e.g. `src/app/page.tsx`):**
1. React / framework (`react`, `next/link`, `next/navigation`, `next/dynamic`, `next/font/google`)
2. Third-party (`nodemailer`, `stripe`)
3. Internal components

**Path Aliases:**
- `@/*` → `./src/*` (`tsconfig.json`). Pages import via `@/components/Navigation`; components import siblings relatively (`./ThemeToggle`). Follow that split.

## Error Handling

- API routes (`src/app/api/*/route.ts`): whole handler wrapped in `try/catch`; success returns `NextResponse.json({ success: true, ... })`; failure logs `console.error(...)` and returns `NextResponse.json({ success: false, message }, { status: 500 })` — see `src/app/api/send-email/route.ts`
- Env vars read with `process.env.X || 'fallback'` inline (no central config module)
- Client components: defensive null checks (`if (!el) return`) rather than error boundaries; no error boundary components exist

## Logging

**Framework:** plain `console` only. `next.config.ts` sets `compiler.removeConsole` in production, so console calls are stripped from client bundles in prod builds.

## Comments

- Section-divider comments in JSX and CSS: `{/* Sliding circle with sun/moon */}`, `/* ============ THEME SYSTEM ============ */`
- Inline explanatory comments for non-obvious logic (`// Ease out cubic`, `// Check prefers-reduced-motion`)
- No JSDoc/TSDoc anywhere — do not add unless asked

## Module Design

**Exports:** default export per component/page; supplementary named exports allowed from the same file. No barrel files (`index.ts`) — import each component directly.

**Server/client boundary rule of thumb in this repo:** anything in `src/components/` is client; server logic lives only in `src/app/api/*/route.ts`, `layout.tsx`, metadata-exporting pages, `sitemap.ts`, `robots.ts`.

---

*Convention analysis: 2026-06-10*
