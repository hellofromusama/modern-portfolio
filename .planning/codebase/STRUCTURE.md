# Codebase Structure

**Analysis Date:** 2026-06-10

## Directory Layout

```
modern-portfolio/
├── src/
│   ├── app/                          # Next.js 15 App Router (routes + globals)
│   │   ├── layout.tsx                # Root layout: fonts, metadata, 7 JSON-LD schemas, ConditionalFooter
│   │   ├── page.tsx                  # Homepage (client) — projects[] + skills[] arrays live HERE
│   │   ├── globals.css               # Tailwind v4 import + CSS-variable theme system (dark/light)
│   │   ├── sitemap.ts                # MetadataRoute.Sitemap (all routes + project/blog URLs)
│   │   ├── robots.ts                 # MetadataRoute.Robots (AI search bots allowed, training bots blocked)
│   │   ├── favicon.ico / icon.png / apple-icon.png
│   │   ├── api/                      # 12 API routes (route.ts each)
│   │   │   ├── ai-training/route.ts          # LLM training submissions (reads data/query-scenarios.json)
│   │   │   ├── ai-verification/route.ts
│   │   │   ├── australia-seo/route.ts
│   │   │   ├── auto-llm-training/route.ts    # Automated daily batches (reads data/query-scenarios.json)
│   │   │   ├── budget-estimate/route.ts      # OpenAI → Grok fallback chain
│   │   │   ├── create-checkout/route.ts      # Stripe Checkout session
│   │   │   ├── indexnow/route.ts             # IndexNow ping
│   │   │   ├── llms/route.ts                 # Serves LLM context (/.llms rewrite target)
│   │   │   ├── schedule-training/route.ts
│   │   │   ├── send-email/route.ts           # nodemailer SMTP
│   │   │   ├── test-free-llm/route.ts
│   │   │   └── test-openai/route.ts
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog index (server) — blogPosts[] + categories[] inline
│   │   │   ├── ai-developer-perth/page.tsx   # SEO article (server)
│   │   │   └── best-developer-perth/page.tsx # SEO article (server)
│   │   ├── budget/page.tsx           # AI budget calculator (client)
│   │   ├── contact/page.tsx          # Contact form (client)
│   │   ├── developer-australia/page.tsx      # Australia SEO landing (server)
│   │   ├── expertise/page.tsx        # technicalExpertise{} + certifications[] live HERE (server)
│   │   ├── fund-me/
│   │   │   ├── page.tsx              # Donations (client) — uses InteractiveGlobe + AnimatedIcons
│   │   │   └── success/page.tsx      # Post-checkout confirmation (client)
│   │   ├── ideas/page.tsx            # Ideas page (client) — IdeaNetworkCanvas background
│   │   ├── llm-training-dashboard/page.tsx   # Training status dashboard (client)
│   │   ├── projects/[id]/page.tsx    # Project detail (server, async params) — full projects{} record HERE
│   │   ├── services/page.tsx         # Services catalog (server)
│   │   ├── team/page.tsx             # Team page (client)
│   │   ├── tech-stack/page.tsx       # techStack[] + features[] inline (server)
│   │   └── test-apis/page.tsx        # Dev API tester (client, robots-disallowed)
│   └── components/                   # Flat shared components dir (18 files, PascalCase.tsx)
│       ├── AdvancedSEO.tsx           # Prop-driven SEO comp — UNUSED (Pages-Router Head pattern)
│       ├── AISeoContent.tsx          # sr-only AI-crawlable content layer (server; on homepage)
│       ├── AnimatedIcons.tsx         # 12 CSS cross-fade morph SVG icons + showcase grid
│       ├── ConditionalFooter.tsx     # usePathname gate around Footer + FundMeWidget (in layout)
│       ├── FAQ.tsx                   # Homepage FAQ accordion (dynamic import, ssr:false)
│       ├── Footer.tsx                # Site footer
│       ├── FundMeWidget.tsx          # Floating donation widget (global via ConditionalFooter)
│       ├── GoogleAnalytics.tsx       # GA snippet
│       ├── Hero3D.tsx                # Hero wrapper: mouse ref + text overlay; loads Hero3DScene
│       ├── Hero3DScene.tsx           # Canvas 2D rAF scene: icosahedron, particles, rings
│       ├── IdeaNetworkCanvas.tsx     # Canvas 2D rAF particle network (ideas page bg)
│       ├── InteractiveButton.tsx     # Ripple + cursor-glow CTA button/anchor
│       ├── InteractiveGlobe.tsx      # Canvas 2D drag-rotatable wireframe globe (fund-me)
│       ├── LastUpdated.tsx           # Freshness timestamp (server)
│       ├── Navigation.tsx            # Fixed top nav + ThemeToggle (most pages)
│       ├── ScrollReveal.tsx          # ScrollReveal + StaggerReveal + AnimatedCounter + MagneticHover + TextReveal + ParallaxSection
│       ├── TeamSection.tsx           # Homepage team block
│       ├── ThemeToggle.tsx           # data-theme + localStorage dark/light switch
│       ├── VisitorCounter.tsx        # Visitor count display
│       └── VisitorTracker.tsx        # Visit tracking
├── data/
│   └── query-scenarios.json          # AI-training query scenarios (consumed by 2 API routes)
├── public/                           # Static assets served at site root
│   ├── llms.txt / llms-full.txt / llms-ctx.txt / llms-ctx-full.txt   # LLM discovery files
│   ├── ai.txt / ai-context.md / humans.txt                            # AI/author discovery
│   ├── ai-training-dataset.txt / ai-scenarios-comprehensive.json      # Training datasets
│   ├── australia-seo.json / australian-business-directory.json / conversational-ai-optimization.json
│   ├── feed.xml / manifest.json / sitemap-australia.xml / robots.txt
│   ├── usamajaved-indexnow-key-2026.txt                               # IndexNow key file
│   ├── .well-known/                  # CORS-enabled well-known files (headers in next.config.ts)
│   ├── team/                         # Team member images
│   └── *.svg                         # Default Next.js svgs
├── next.config.ts                    # Headers (llms.txt content types, caching, security), redirects, /.llms rewrite
├── tsconfig.json                     # strict; paths: "@/*" → "./src/*"
├── package.json                      # next ^15.5, react ^19.2, stripe, nodemailer, @emailjs/browser; tailwindcss ^4 (dev)
├── postcss.config.mjs                # @tailwindcss/postcss (Tailwind v4 — no tailwind.config file)
├── eslint.config.mjs                 # Flat config, eslint-config-next
├── usama-javed-perth-developer.llm   # LLM training artifact
├── *.md (15 files)                   # SEO/setup guides (STRIPE_SETUP_GUIDE.md, SEO_IMPLEMENTATION_SUMMARY.md, …)
└── .planning/codebase/               # GSD analysis docs (this directory)
```

## Directory Purposes

**`src/app/`:**
- Purpose: every route, the root layout, global CSS, and metadata routes (sitemap/robots)
- Contains: `page.tsx` per route (kebab-case directory = URL segment), `route.ts` per API endpoint
- Key files: `layout.tsx` (SEO hub), `page.tsx` (homepage + canonical projects/skills arrays), `globals.css` (theme variables)

**`src/components/`:**
- Purpose: ALL shared components — flat, no subdirectories, no barrel file (`index.ts` does not exist; import each file directly)
- Contains: UI components, animation primitives, SEO content components
- Key files: `ScrollReveal.tsx` (multi-export animation toolkit), `Hero3DScene.tsx` / `InteractiveGlobe.tsx` / `IdeaNetworkCanvas.tsx` (canvas scenes), `Navigation.tsx`

**`data/`:**
- Purpose: JSON consumed server-side by API routes only (NOT page content)
- Key files: `query-scenarios.json`

**`public/`:**
- Purpose: static assets and the AI/SEO discovery file suite; everything here is publicly fetchable at `/<filename>`
- Note: `public/robots.txt` coexists with `src/app/robots.ts` — the App Router metadata route takes precedence for `/robots.txt`

**Root `*.md` files:**
- Purpose: operational/SEO playbooks and training-data documents (not imported by code)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: root shell — fonts, metadata, structured data, footer
- `src/app/page.tsx`: homepage composition

**Configuration:**
- `next.config.ts`: headers/redirects/rewrites, image config, `removeConsole`, `ignoreBuildErrors`
- `tsconfig.json`: `@/*` path alias, strict mode
- `postcss.config.mjs`: Tailwind v4 via PostCSS plugin (theme tokens live in `src/app/globals.css`, not a tailwind.config)

**Core Logic:**
- Content data: inline `const`s in each `src/app/**/page.tsx` (see "Where to Add New Code")
- Server logic: `src/app/api/*/route.ts`
- Theme system: `src/app/globals.css` (`:root` + `[data-theme="light"]` variable sets, including `--canvas-opacity` for canvas scenes)

**Testing:**
- No test framework, no test files, no test config exists in this codebase
- Manual API testing page: `src/app/test-apis/page.tsx`

## Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (`InteractiveGlobe.tsx`, `ScrollReveal.tsx`)
- Routes: framework-mandated lowercase `page.tsx` / `route.ts` / `layout.tsx` / `sitemap.ts` / `robots.ts`

**Directories:**
- Route segments: kebab-case matching the URL (`fund-me/`, `tech-stack/`, `llm-training-dashboard/`)
- Dynamic segment: `[id]` (only one: `projects/[id]`)

**Imports:**
- Always use the `@/` alias: `import Navigation from '@/components/Navigation'`
- Components within `src/components/` use relative imports between siblings (`import InteractiveButton from "./InteractiveButton"`)
- Heavy/canvas components are imported via `next/dynamic` with `ssr: false` and a pulsing `var(--bg-card)` skeleton as `loading`

**Component conventions:**
- Client components start with `"use client"` (double quotes in most files, single in some — both occur)
- One default export per component file; secondary helpers as named exports (pattern: `ScrollReveal.tsx` exports `StaggerReveal`, `AnimatedCounter`, `MagneticHover`, `TextReveal`, `ParallaxSection`; `AnimatedIcons.tsx` exports 12 icons + showcase)
- Theme-aware styling via inline `style={{ background: 'var(--bg-card)' }}` mixed with Tailwind utility classes — never hardcode theme colors

## Where to Add New Code

**New page/route:**
- Create `src/app/<kebab-name>/page.tsx`
- Server page if static content (export `const metadata: Metadata`); client page if interactive (`"use client"`, no metadata export)
- Add `<Navigation currentPage="<name>" />` at top; wrap sections in `ScrollReveal`
- Register the URL in `src/app/sitemap.ts`

**New project (ADD, don't remove existing):**
1. Append to `projects` array in `src/app/page.tsx` (line 37) — card data: `{ id, title, description, tech[], category }`
2. Append matching key to the `projects` record in `src/app/projects/[id]/page.tsx` (line 4) — detail data: `{ title, subtitle, description, longDescription, tech[], category, timeline, team, features[], challenges[], results[], gradient }` (optional `liveUrl`)
3. Add URL entry to `src/app/sitemap.ts`
4. Optionally append to `projectsListData.itemListElement` JSON-LD in `src/app/layout.tsx` (line 494) and bump `numberOfItems`

**New skill/expertise content (ADD, don't remove existing):**
- Homepage card: append to `skills` array in `src/app/page.tsx` (line 82) — `{ title, accent, items[] }` (accent must exist in `accentMap`: blue/violet/emerald/amber)
- Deep-dive: append to `technicalExpertise` object in `src/app/expertise/page.tsx` (line 20) — categories contain `technologies[]` with `{ name, level, experience, specializations[] }`; certifications at line 397
- SEO mirrors: `knowsAbout` array in `src/app/layout.tsx` (line 175) and the lists inside `src/components/AISeoContent.tsx`

**New visual/animation component:**
- Create `src/components/<Name>.tsx` with `"use client"`
- Follow the canvas pattern (`Hero3DScene.tsx` / `IdeaNetworkCanvas.tsx`): refs for mutable state, DPR-aware resize, rAF loop with `cancelAnimationFrame` cleanup, theme via CSS variables, respect `prefers-reduced-motion`
- Consume via `next/dynamic` with `ssr: false` in the page

**New API endpoint:**
- Create `src/app/api/<kebab-name>/route.ts`; export async `GET`/`POST(request: NextRequest)`; return `NextResponse.json(...)`; guard missing env vars with a 503 (pattern: `getStripe()` in `src/app/api/create-checkout/route.ts`)
- Note `/api/` is robots-disallowed automatically by `src/app/robots.ts`

**New blog post:**
- Create `src/app/blog/<slug>/page.tsx` (server, with `metadata`); add card to `blogPosts` in `src/app/blog/page.tsx` (line 20); add URL to `src/app/sitemap.ts`

**Utilities:**
- No `lib/` or `utils/` directory exists. Small helpers are defined inside the file that uses them (e.g., `latLonToXYZ`/`rotateY` in `InteractiveGlobe.tsx`). If a shared module becomes necessary, `src/lib/` would fit the `@/*` alias, but creating it is a new convention.

## Special Directories

**`public/`:**
- Purpose: static + AI discovery files
- Generated: No (hand-maintained)
- Committed: Yes

**`data/`:**
- Purpose: server-read JSON for AI-training APIs
- Generated: No
- Committed: Yes

**`.next/`:**
- Purpose: build output
- Generated: Yes
- Committed: No

**`.planning/codebase/`:**
- Purpose: GSD analysis documents
- Generated: By mapping agents
- Committed: Yes

---

*Structure analysis: 2026-06-10*
