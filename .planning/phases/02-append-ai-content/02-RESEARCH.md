# Phase 2: Append AI Content - Research

**Researched:** 2026-06-12
**Domain:** Content-data append into an existing centralized typed content module (Next.js 15 App Router) + inline SVG architecture diagram + JSON-LD/sitemap propagation
**Confidence:** HIGH (every claim verified against the actual source files in `src/content/`, `src/app/`, `scripts/`; no library-API uncertainty — this is an in-repo append task, not a new-dependency task)

## Summary

Phase 1 already built exactly the machine this phase needs. `src/content/projects.ts` is a keyed superset map with five named projections; `src/content/skills.ts` is a 4-group array; `src/content/seo.ts` builds the JSON-LD ItemList from the superset; `sitemap.ts` and `projects/[id]/page.tsx` already consume the projections with `generateStaticParams` + `generateMetadata`. **Adding the 5 AI projects and AI skill groups is almost entirely a data-append exercise** — append project entries to the keyed map, add their ids to the projection arrays you want them to appear in, and append `Skill` groups to the skills array. The detail page, sitemap, static params, and per-project metadata then flow automatically with zero JSX changes. The content-diff gate explicitly allows additions (verified in `scripts/content-diff.mjs` — it checks baseline membership, never exact counts, and `itemList.numberOfItems` is checked as `>=` baseline).

Three things require deliberate engineering beyond appends: (1) the **AI Engineering Experience section + SVG diagram** (AICON-01/02/03) is net-new JSX, not data — it needs a home, and the strongest recommendation is a **new server route `/ai-engineering`** so it can export its own `metadata` and JSON-LD (client pages cannot); (2) the **`Skill.accent` type is a closed 4-value union** (`blue|violet|emerald|amber`) and `accentMap` in `page.tsx` has exactly those 4 keys — new AI skill groups must reuse those 4 accents (no type/map change needed) rather than introduce new colors; (3) **`buildItemListSchema()` hardcodes `numberOfItems: 6`** — if you add an AI project to the `itemListProjects` projection you MUST bump that literal to match, or the gate's byte-shape is internally inconsistent (the gate itself only enforces `>=`, but the JSON-LD would under-count its own array).

**Primary recommendation:** Append the 5 projects to the keyed map with full detail-field population (12 fields are render-critical — see Detail-Page Field Inventory); add all 5 ids to `homeGridProjects` and `sitemapProjects`; add the production flagships to `itemListProjects` and bump `numberOfItems` to match; append AI `Skill` groups reusing the 4 existing accents; build the Experience section + inline SVG as a **new server route `/ai-engineering`** added to `Navigation.tsx` `navItems`; run `node scripts/content-diff.mjs` (must stay green) + `tsc` + `lint` + `build` as the SHIP-01 gate.

## User Constraints (from project mandate — no CONTEXT.md exists for this phase)

> `has_context: false` confirmed via `init phase-op 2`. The binding constraints come from PROJECT.md / REQUIREMENTS.md / CLAUDE.md (treated with locked-decision authority).

### Locked Decisions (from PROJECT.md + REQUIREMENTS.md)
- **Additive only.** Zero deletions of existing pages, projects, slugs, skills, or SEO assets. Existing entries preserved verbatim. Enforced by `scripts/content-diff.mjs` (the definition of done).
- **No Horizon Digital / interview-prep content anywhere public** (AICON-06). This is private/reputational-risk material — it is the *source* for the work but must NOT appear on the site.
- **Do not invent metrics.** The verified-facts block in the phase brief is the ONLY source of truth for ESIA/MCP claims. No fabricated numbers (the audience is technical and will disprove them).
- **No framework changes.** Next.js 15.5.12 App Router + React 19.2.4 + Tailwind v4 CSS-first + TS. (Note: `npm view next version` = 16.2.9 exists — do NOT upgrade; stay on 15.x.)
- **Both themes must work.** New UI must use CSS custom-property tokens (`var(--text-muted)` etc.), never hardcoded theme colors. SHIP-01 requires manual smoke in BOTH themes.

### Claude's Discretion
- Where the AI Engineering experience section lives (new route vs. section) — research recommends new route `/ai-engineering` (see Architecture Patterns).
- Which projections each new project appears in (grid / itemList / sitemap) — research recommends all-grid + all-sitemap, flagships-to-itemList (see Projection Append Map).
- SVG diagram visual treatment (static vs. subtle animated reveal) — static inline JSX SVG recommended; animation deferred to later motion phases.
- Skill-group granularity (how many groups the 10 AI domains collapse into).

### Deferred Ideas (OUT OF SCOPE for Phase 2)
- Loom/video walkthroughs (V2-01), real observability/trace screenshots (V2-02), custom cursor (V2-03), test suite (V2-04).
- WebGL hero, motion v12, R3F, design-token tightening — those are Phases 3-6, NOT this phase.
- Animation of the SVG diagram beyond a trivial static render (motion infra lands Phase 3+).

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AICON-01 | AI Engineering section: ESIA MCP story, Ollama↔NetSuite via OAuth+RESTlet, 6-step flow visual | New `/ai-engineering` server route (Architecture Patterns); 6-step flow as ordered SVG/numbered list using verified facts |
| AICON-02 | v1→v2 LangGraph evolution + 3 production fixes as a production-engineering narrative | Narrative copy on `/ai-engineering`; mirrors FEATURES.md Problem→Architecture→Trade-offs→Impact framing |
| AICON-03 | Architecture diagram (SVG) of the MCP bridge | Inline JSX SVG component, CSS-var themed (Code Examples + SVG Diagram Pattern) |
| AICON-04 | 5 new AI projects APPENDED with detail pages, existing untouched | Append to keyed map in `projects.ts`; detail page auto-renders via `getProject` + `generateStaticParams` (Detail-Page Field Inventory) |
| AICON-05 | AI skill domains APPENDED, grouped by domain, tied to real projects, no % bars | Append `Skill` groups to `skills.ts` reusing the 4 closed-union accents (Skills Append section) |
| AICON-06 | No Horizon Digital / interview-prep content visible | Constraint, not a build target — verification step (grep the build output for forbidden strings) |
| SEO-02 | New AI content gets metadata, JSON-LD, sitemap from centralized source | `generateMetadata`/`generateStaticParams` auto-cover detail pages; append to `itemListProjects`+bump `numberOfItems`; append to `sitemapProjects`; new route exports own metadata + optionally JSON-LD; optionally append to layout `knowsAbout` |
| SHIP-01 | tsc + lint + build + both-theme smoke before complete | Cross-cutting gate; add `node scripts/content-diff.mjs` as the zero-deletion proof (Validation Architecture) |

## Standard Stack

**No new dependencies.** This phase adds zero packages — it appends to existing typed modules and adds one route + one SVG component using primitives already in the repo.

### Core (already present, verified)
| Module / API | Version | Purpose | Why Standard (here) |
|--------------|---------|---------|---------------------|
| `src/content/projects.ts` | in-repo | Keyed `Project` superset + 5 projections | The single source Phase 1 built; all consumers read it |
| `src/content/skills.ts` | in-repo | `Skill[]` (4 groups) | Home skills consumer; append target for AICON-05 |
| `src/content/seo.ts` `buildItemListSchema()` | in-repo | Emits JSON-LD ItemList from superset | The SEO-02 propagation path for projects |
| `src/app/projects/[id]/page.tsx` | in-repo | Detail page; `generateStaticParams`+`generateMetadata` already wired | New projects render with zero edits to this file |
| `src/app/sitemap.ts` | in-repo | Maps `sitemapProjects` projection | New sitemap entries flow from the projection |
| Next.js | 15.5.12 | App Router, metadata route, server components | Locked — no upgrade (16.x exists, do not use) |
| React | 19.2.4 | UI | Locked |
| Tailwind v4 + CSS vars | 4.1.13 | Theming via `globals.css` tokens | New JSX must use tokens, not `dark:` variant |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| New `/ai-engineering` server route | Section on home `page.tsx` | Home is a `"use client"` page — CANNOT export `metadata`/JSON-LD (Next.js rule). A section there gets no dedicated SEO and bloats the largest client bundle. New server route is strictly better for AICON-01 + SEO-02. |
| Inline JSX SVG diagram | Imported `.svg` asset / `next/image` | Inline JSX lets the SVG reference CSS vars (`stroke="var(--accent-blue)"`) so it themes automatically in both modes; a flat asset can't. Inline wins. |
| New AI skill groups reuse 4 accents | Extend `accent` union + `accentMap` | Extending the union touches `types.ts` AND `page.tsx` accentMap AND the skills extractor regex tolerance — more surface, more risk. Reusing blue/violet/emerald/amber is zero-risk and visually consistent. |

**Installation:** none.

**Version verification:** `npm view next version` → 16.2.9 (latest, DO NOT adopt — locked to 15.5.12). `tsc` local = 5.9.2 (run as `node ./node_modules/typescript/bin/tsc --noEmit`; `npx tsc` resolves to an unrelated global — known Phase 1 gotcha).

## Architecture Patterns

### Recommended location for the AI Engineering section — NEW SERVER ROUTE

**Recommendation: create `src/app/ai-engineering/page.tsx` as a server component (no `"use client"`).** Concrete rationale, all verified:

1. **SEO-02 needs metadata + JSON-LD.** Per ARCHITECTURE.md and CONVENTIONS.md, *client pages cannot export `metadata`*. The home page (`src/app/page.tsx`) is `"use client"`. Putting the ESIA story there means it inherits only root-layout defaults — no dedicated title/description/canonical, no page-level JSON-LD. A server route exports its own `export const metadata` and can render an inline `<script type="application/ld+json">` (the established pattern in `blog/page.tsx` and `expertise/page.tsx`).
2. **The SVG diagram and narrative are static** — they have no interactivity, so a server component is the natural fit (no client bundle cost).
3. **It is purely additive** — a brand-new route adds zero risk to existing pages and satisfies the additive-only mandate trivially.
4. **It mirrors the existing pattern** — `/expertise`, `/services`, `/tech-stack`, `/developer-australia` are all server + metadata content pages. `/ai-engineering` slots in identically.

**Navigation wiring (what adding a nav link entails):** `src/components/Navigation.tsx` line 32 has a flat `navItems` array:
```ts
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/ideas', label: 'Ideas' },
  { href: '/contact', label: 'Contact' },
  { href: '/budget', label: 'Budget' },
  { href: '/fund-me', label: 'Fund Me' },
];
```
Adding `{ href: '/ai-engineering', label: 'AI Engineering' }` is the ONLY change needed — both desktop (line 76 `.map`) and mobile (line 145 `.map`) render from this same array, and `isActivePage` (line 26) already handles `pathname.startsWith(path)` for active-state highlighting. No other nav edits. (Optionally also link it from the home page near the projects/skills sections, but the nav item is the required piece.)

> **Caveat — the detail page renders its OWN inline nav, not `Navigation.tsx`.** `projects/[id]/page.tsx` (lines 28-50) hardcodes a slate-gradient `<nav>` that does NOT include the new link and is NOT theme-tokenized. That is pre-existing and out of scope to fix here; just be aware the new nav item won't appear on project detail pages. Do not "fix" it in this phase (Phase 5 owns nav/visual upgrades).

### Pattern 1: Append to the keyed superset map
**What:** Add each new project as a `"slug": { id, ...fields }` entry inside the `const projects = { ... } satisfies Record<string, Project>` object in `projects.ts`.
**When:** For all 5 AICON-04 projects.
**Why it works:** `projectList = Object.values(projects)` (auto-includes new entries), `getProject` resolves them O(1), `generateStaticParams` (detail page line 6-8) auto-generates their routes, `generateMetadata` (line 10-15) auto-builds their `<title>`/description. **No edit to the detail page is needed.**

### Pattern 2: Opt each project into projections explicitly
**What:** The projection arrays (`homeGridProjects`, `itemListProjects`, `sitemapProjects`) are hand-listed id arrays. A new map entry does NOT auto-appear in them — you add its id to the projections you want.
**Why this is correct:** Phase 1 deliberately decoupled "exists in map" from "appears in consumer X" to preserve the 6/7/6/7 divergence. Appending = add ids to the chosen projection arrays (see Projection Append Map below).

### Pattern 3: Server content page with own metadata + JSON-LD
**What:** New `/ai-engineering` page follows `blog/page.tsx`/`expertise/page.tsx`: `export const metadata`, optional inline `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />`.

### Anti-Patterns to Avoid
- **Putting the AI section on the client home page.** Loses metadata/JSON-LD (SEO-02), bloats the client bundle. Use a server route.
- **Inventing a 5th skill accent.** The union is closed; reuse the 4. Adding one ripples into `types.ts` + `accentMap` + the gate's tolerance.
- **Appending to `itemListProjects` without bumping `numberOfItems`.** The `6` literal in `seo.ts` would then under-count its own `itemListElement` array — a self-inconsistent schema.
- **Editing the detail page JSX to special-case AI projects.** Not needed and risks regressing the existing 7. The superset fields render generically.
- **Touching existing entries' copy.** Any change to a baseline name/description/priority fails the diff gate (CHANGED).

## Projection Append Map (the core decision for AICON-04 / SEO-02)

For each of the 5 new projects, decide membership per projection. Recommendation (additions only — all GROWTH, gate-safe):

| Projection (file) | Current | Append the 5? | Recommendation & rationale |
|-------------------|---------|---------------|----------------------------|
| keyed map / `projectList` / `getProject` | 7 | **YES — all 5** | Required: this is what creates the detail routes (AICON-04). → 12 detail routes |
| `homeGridProjects` (home grid) | 6 | **YES — all 5** | The grid is where visitors see "production AI engineer" — the Core Value. Renders all of `homeGridProjects` with no slice (verified `page.tsx` line 214: direct `.map`, no `.slice`). Requires `gridTitle/gridDescription/gridTech/gridCategory` populated. → 11 grid cards |
| `sitemapProjects` (sitemap) | 7 | **YES — all 5** | SEO-02 explicitly wants the 5 detail pages in the sitemap. Add `{ id, priority }` (use 0.8 for production ESIA/work projects, 0.7 for personal). → 12 sitemap project URLs |
| `itemListProjects` (JSON-LD ItemList) | 6 | **Flagships only (recommend 2-3)** | The ItemList is curated "featured" SEO copy needing `seoName/seoDescription/applicationCategory`. Add the production-credible ones (MCP NetSuite-Ollama Bridge definitely; n8n Marketing Workflows; optionally Healthcare Voice Agent). Personal experiments (LinkedIn auto-apply, social generator) can stay out. **If you add N, set `numberOfItems: 6 + N`** in `seo.ts`. |
| `knowsAbout` (layout.tsx Person JSON-LD, line 176) | ~60 terms | **Optional but recommended for SEO-02** | Appending AI domain terms (MCP, RAG, LangGraph, vector databases, FastAPI, AWS Bedrock, etc.) strengthens the Person schema's skill signal. Pure addition; gate doesn't track this array, so it's safe and high-value-per-effort. |

**`applicationCategory` for new ItemList entries** must be one of the closed union: `"BusinessApplication" | "DeveloperApplication" | "WebApplication"`. MCP bridge / n8n workflows → `BusinessApplication`; voice agent → `BusinessApplication`; dev tooling → `DeveloperApplication`.

## Detail-Page Field Inventory (which `Project` fields the new entries MUST populate)

Verified by reading `src/app/projects/[id]/page.tsx`. Every new project entry MUST populate these to render well — missing any non-optional field is a TS error or an empty section:

| Field | Type | Where it renders | Required? |
|-------|------|------------------|-----------|
| `id` | string | route key, sitemap, grid `key` | YES |
| `title` | string | h1 (line 73) + `generateMetadata` title | YES |
| `subtitle` | string | h2 (line 77) | YES |
| `description` | string | hero paragraph (line 81) + metadata description | YES |
| `longDescription` | string | Overview, `whitespace-pre-line` (line 155) — use `\n\n` for paragraphs | YES |
| `tech` | string[] | Technology Stack pills (line 138) | YES (≥1) |
| `category` | string | hero badge (line 68) | YES |
| `timeline` | string | "Timeline" stat (line 87) | YES |
| `team` | string | "Team Size" stat (line 91) | YES |
| `features` | string[] | Key Features list (line 163) | YES (≥1) |
| `challenges` | string[] | Challenges Solved cards (line 182) | YES (≥1) |
| `results` | string[] | Results Achieved cards (line 193) | YES (≥1) |
| `gradient` | string | hero panel `bg-gradient-to-br ${gradient}` (line 101/119) — Tailwind classes like `"from-blue-500 to-purple-600"` | YES |
| `liveUrl` | string? | optional clickable live panel (line 96) | OPTIONAL — omit for projects with no public URL (most personal AI experiments) |

Grid-only fields (`gridTitle/gridDescription/gridTech/gridCategory`) are required ONLY if the project is in `homeGridProjects` (it should be). SEO fields (`seoName/seoDescription/applicationCategory`) required ONLY if in `itemListProjects`. `sitemapPriority` on the entry is informational; the actual sitemap priority comes from the `sitemapProjects` array's `priority` value.

> **Content mapping note:** Use the FEATURES.md case-study framing (Problem→Architecture→Trade-offs→Impact) to fill `challenges` (the problems/constraints — e.g., NetSuite script execution limits) and `results` (the impact — e.g., 250-record batching restored throughput). Pull every claim from the verified-facts block; do not invent metrics (AICON / out-of-scope mandate on fake metrics).

## Skills Append (AICON-05)

**Append new `Skill` groups to the `skills: Skill[]` array in `src/content/skills.ts`.** The shape is fixed:
```ts
interface Skill { title: string; accent: "blue" | "violet" | "emerald" | "amber"; items: string[]; }
```
**Hard constraint: `accent` is a closed 4-value union and `accentMap` in `page.tsx` (lines 39-44) has exactly those 4 keys.** New AI groups MUST reuse `blue|violet|emerald|amber` — do not invent a colour. The existing 4 groups have exactly 4 items each, but **the home renderer (`page.tsx` line 150 `skills.map`) does not require 4 items** — it maps whatever is there. (The *baseline gate* asserted 4 items per *baseline* group, but that assertion is in the baseline GENERATOR, not the diff gate — new groups can have any item count. Verified: `content-diff.mjs` skills check (lines 108-122) only verifies baseline groups/items still present; it never counts new groups or their items.)

The 10 AI domains from the brief should collapse into a sensible number of grouped `Skill` entries (Claude's discretion), e.g.:
- **AI Agents & Protocols** (amber): MCP / A2A / ACP, LangGraph, CrewAI, AutoGen, OpenAI Agents SDK, Semantic Kernel
- **RAG & Retrieval** (blue): RAG pipelines, vector DBs (Chroma/Pinecone/Milvus/OpenSearch/pgvector), embeddings & rerankers
- **LLM Engineering** (violet): LLM memory architectures, prompt engineering & injection defense, FastAPI/Python
- **AI Infrastructure & Observability** (emerald): AWS AI stack (Bedrock/OpenSearch Serverless/Lambda/Fargate/Aurora pgvector), LangSmith/Langfuse/Phoenix/Ragas/OpenTelemetry

"Tie to real projects" (AICON-05) and "no percentage bars" are satisfied automatically: the home skills renderer is a simple dot+text list (no bars), and the items reference the same technologies used in the appended projects.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| New project → detail route | A new page/route per project | Append to keyed map; `generateStaticParams` (line 6) auto-creates routes | Phase 1 already wired this; manual routes duplicate the system |
| New project → `<title>`/description | Per-project metadata literals | `generateMetadata` (line 10) reads `getProject` | Already automatic |
| New project → sitemap URL | Hand-write sitemap entry | Add to `sitemapProjects` array; `sitemap.ts` maps it (line 85) | Projection already mapped |
| New project → JSON-LD ItemList item | Hand-write a `ListItem` literal | Add id to `itemListProjects` + bump `numberOfItems` | `buildItemListSchema` maps it (seo.ts line 22) |
| Zero-deletion proof | Manual diff/eyeballing | `node scripts/content-diff.mjs` | The frozen gate is the definition of done |
| Theme-correct SVG colors | Two SVGs (light/dark) | One inline SVG using `var(--accent-*)` / `currentColor` | CSS vars resolve per-theme automatically |

**Key insight:** Phase 1 turned "add a project" from a 4-file synchronized edit into a 1-3 line append. The entire value of this phase's design is leaning on that — resist re-deriving anything the projections already handle.

## SVG Architecture Diagram Pattern (AICON-03)

**Recommendation: an inline JSX SVG, either inside `ai-engineering/page.tsx` or as a small server component `src/components/AiBridgeDiagram.tsx`.** Theme it with CSS variables so both modes work with one source (matches the project's "components NEVER hardcode theme colors" rule).

The 6-step flow (verified facts) to render as labeled nodes/arrows:
`Marketing UI (NL question)` → `MCP Server` → `OAuth + NetSuite API` → `SuiteScript RESTlet → NetSuite DB` → `Ollama LLM (format)` → `Answer in UI`.

### Code Example: theme-aware inline SVG (CSS-var stroke/fill)
```tsx
// Source: pattern derived from this repo's CSS-var theming convention
// (globals.css tokens; AnimatedIcons.tsx inline-SVG approach). Server component.
export default function AiBridgeDiagram() {
  return (
    <svg viewBox="0 0 800 200" role="img"
         aria-label="MCP bridge: marketing UI to NetSuite via OAuth and RESTlet, formatted by Ollama"
         className="w-full h-auto">
      {/* boxes use token colors so they theme automatically */}
      <g stroke="var(--border-default)" fill="var(--bg-card)">
        <rect x="10" y="70" width="130" height="60" rx="8" />
        {/* ...more nodes... */}
      </g>
      <g fill="var(--text-primary)" fontSize="12"
         fontFamily="var(--font-space-grotesk)" textAnchor="middle">
        <text x="75" y="105">Marketing UI</text>
      </g>
      {/* arrows / accents use accent tokens */}
      <line x1="140" y1="100" x2="180" y2="100"
            stroke="var(--accent-blue)" strokeWidth="2" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3"
                orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--accent-blue)" /></marker>
      </defs>
    </svg>
  );
}
```
Keep it STATIC for this phase. Animated reveal needs the motion infra that lands in Phase 3+ (out of scope; Deferred). Provide `role="img"` + `aria-label` for accessibility (PERF-03 is a later phase, but free here).

## Common Pitfalls

### Pitfall 1: `numberOfItems: 6` literal drift
**What goes wrong:** You append an AI project to `itemListProjects` but leave `numberOfItems: 6` in `seo.ts`. The JSON-LD claims 6 items but emits 7+ `itemListElement`s.
**Why:** `numberOfItems` was deliberately hardcoded (seo.ts comment lines 11-13) so Phase-1 appends elsewhere couldn't silently change it. That protection now requires a manual bump when YOU intend to grow it.
**How to avoid:** Whenever you add an id to `itemListProjects`, set `numberOfItems: 6 + (count added)`. The diff gate only enforces `>=` (won't catch under-count), so this is a manual discipline.
**Warning sign:** `itemListProjects.length !== numberOfItems`.

### Pitfall 2: `npx tsc` resolves to the wrong compiler
**What goes wrong:** `npx tsc --noEmit` pulls an unrelated global package (documented Phase-1 deviation).
**How to avoid:** Run `node ./node_modules/typescript/bin/tsc --noEmit` (verified working, v5.9.2).

### Pitfall 3: build masks type/lint errors
**What goes wrong:** `next.config.ts` sets `typescript.ignoreBuildErrors: true` + `eslint.ignoreDuringBuilds: true`, so `npm run build` passes even with errors.
**How to avoid:** SHIP-01 requires running `tsc --noEmit` AND `npm run lint` EXPLICITLY, separately from build (STATE.md blocker confirms this).
**Pre-existing noise:** `tsc --noEmit` surfaces latent errors in unrelated `api/*` and `expertise/page.tsx` files (logged to `deferred-items.md`). Do NOT fix them; verify only that YOUR new files are clean.

### Pitfall 4: editing baseline content
**What goes wrong:** Reformatting or tweaking an existing project's copy fails the gate (`CHANGED`).
**How to avoid:** Append only. Never touch the 7 existing map entries, the 4 existing skill groups, or existing projection ids/priorities.

### Pitfall 5: skills extractor regex and new groups
**What goes wrong:** Worry that adding groups breaks the gate's skills extractor.
**Reality (verified):** `extractSkills` (content-baseline.mjs line 262) reads the `const skills = [ ... ];` block via a global group regex — but `skills.ts` exports `const skills: Skill[] = [...]`. The slice marker is `"const skills = ["`; the file has `const skills: Skill[] = [`. **Confirm the extractor still matches after append** — it uses `sliceBetween(text, "const skills = [", "];")`. The current file has the type annotation `const skills: Skill[] = [`, so `"const skills = ["` will NOT match and it falls back to scanning the whole file (`source = block ?? text`), which still finds all groups. The gate currently passes (verified: `content-diff: zero deletions`), so appending groups in the same shape is safe. Just keep new groups in the identical `{ title, accent, items: [...] }` literal form.

## State of the Art

Not applicable — this is an in-repo append task on a 2026 Next.js 15 codebase. No deprecated APIs in play. The only "currency" note: Next.js 16.2.9 is the latest release but the project is LOCKED to 15.5.12 (no framework changes). The `params: Promise<{id}>` + `await params` pattern in the detail page is the current Next 15 convention and is correctly used.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node + local TypeScript | tsc gate | ✓ | 5.9.2 (`node ./node_modules/typescript/bin/tsc`) | — |
| npm | build/lint | ✓ | (lockfile v3 present) | — |
| `node_modules` installed | tsc/lint/build | ✓ | 416 pkgs (Phase 1 ran `npm install`) | re-run `npm install` if absent |
| `scripts/content-diff.mjs` | zero-deletion gate | ✓ | runs green now | — |
| `baseline.json` | gate reference | ✓ | `01-content-centralization/baseline.json` (frozen 6/7/6/7/4) | — |

**Missing dependencies with no fallback:** none. **All external services (Stripe/OpenAI/SMTP) are irrelevant to this content-append phase.**

## Validation Architecture

> `nyquist_validation: true` in config.json — section included. **Note: this repo has NO test framework** (STACK.md: "No test framework, no test files, no test script"). Validation here is the content-diff gate + tsc + lint + build + count assertions + curl smoke, NOT a unit-test suite. Building a test framework is explicitly Deferred (V2-04).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | NONE (no vitest/jest; deferred to V2-04) |
| Config file | none |
| Quick run command | `node scripts/content-diff.mjs` (zero-deletion gate, <1s) |
| Full suite command | `node ./node_modules/typescript/bin/tsc --noEmit && npm run lint && npm run build && node scripts/content-diff.mjs` |

### Phase Requirements → Validation Map
| Req ID | Behavior | Validation Type | Command / Check |
|--------|----------|-----------------|-----------------|
| AICON-04 | 5 projects appended, detail routes render | build route table | `npm run build` shows **12** `/projects/[id]` prerendered routes (7→12) |
| AICON-04 | existing 7 untouched | zero-deletion gate | `node scripts/content-diff.mjs` exits 0 |
| AICON-05 | AI skill groups appended | gate + visual | gate green (4 baseline groups intact); home shows new groups; no % bars |
| AICON-01/02/03 | `/ai-engineering` renders, in nav | build + smoke | route in build manifest; nav link present both themes |
| SEO-02 | sitemap has 12 project URLs | count assertion | curl `/sitemap.xml` → **12** `/projects/` URLs (7→12) |
| SEO-02 | JSON-LD ItemList grows | count assertion | `numberOfItems === itemListProjects.length` (e.g. 6→8 if 2 flagships added) |
| SEO-02 | new detail pages have metadata | smoke | view-source on a new `/projects/<slug>` → correct `<title>`/description |
| AICON-06 | no forbidden content | grep gate | `grep -ri "horizon digital\|interview prep" .next/ src/` → no matches |
| SHIP-01 | gates green both themes | full suite | tsc + lint + build clean on phase files; manual smoke dark + light |

### Count Assertions (the explicit before→after table)
| Surface | Before | After (recommended) | Source of truth |
|---------|--------|---------------------|-----------------|
| keyed map / detail routes | 7 | **12** | `projects.ts` map keys; build manifest |
| home grid cards | 6 | **11** | `homeGridProjects` length |
| JSON-LD ItemList | 6 | **6 + flagships added** (set `numberOfItems` to match) | `itemListProjects` length === `numberOfItems` |
| sitemap `/projects/` URLs | 7 | **12** | `sitemapProjects` length; `/sitemap.xml` |
| skill groups | 4 | **4 + AI groups** | `skills.ts` length |
| content-diff gate | green | **green** (additions only) | `node scripts/content-diff.mjs` |

### Sampling Rate
- **Per task / commit:** `node scripts/content-diff.mjs` (must stay green) + `tsc --noEmit` on touched files.
- **Per wave merge:** full suite (tsc + lint + build + diff).
- **Phase gate:** full suite green + manual both-theme smoke + count assertions verified before `/gsd:verify-work`.

### Wave 0 Gaps
- None for test infrastructure (no framework, by design — deferred). The validation tooling (`content-diff.mjs`, `baseline.json`) already exists from Phase 1 and runs green.
- One thing to verify in Wave 0: confirm `scripts/content-diff.mjs` still exits 0 BEFORE any edits (baseline sanity) — verified now: "content-diff: zero deletions, all entries preserved".

## Open Questions

1. **How many of the 5 projects belong in `itemListProjects` (curated JSON-LD)?**
   - What we know: All 5 go in the map, grid, and sitemap. The ItemList is curated "featured" SEO copy.
   - What's unclear: Whether personal experiments (LinkedIn auto-apply, social generator) should appear in the featured JSON-LD or only production work.
   - Recommendation: Include production/work flagships (MCP bridge, n8n workflows, optionally voice agent); leave personal experiments out of ItemList but keep them in grid + sitemap + detail. Planner/owner can adjust; whatever N is chosen, set `numberOfItems = 6 + N`.

2. **Should AI skill domains also be appended to `expertise/page.tsx` `technicalExpertise` and/or `AISeoContent.tsx`?**
   - What we know: AICON-05 says "APPENDED to existing skills/expertise"; ARCHITECTURE.md notes skills live in multiple places (`page.tsx` skills, `expertise/page.tsx` `technicalExpertise`, layout `knowsAbout`, `AISeoContent`).
   - What's unclear: The centralized `skills.ts` only feeds the HOME skills section; `expertise/page.tsx` was NOT centralized in Phase 1 (its `technicalExpertise` object is still inline and has pre-existing tsc errors).
   - Recommendation: For Phase 2, append to centralized `skills.ts` (home) + layout `knowsAbout` (JSON-LD, high SEO value, gate-safe). Treat `expertise/page.tsx` enrichment as OPTIONAL/nice-to-have — it has latent type errors (deferred-items.md) and isn't centralized; the planner should decide whether to touch it given the additive-only, low-risk preference. The core AICON-05 requirement is satisfied by the home skills append.

3. **Diagram as inline-in-page vs. separate component?**
   - Recommendation: A separate server component `AiBridgeDiagram.tsx` keeps `ai-engineering/page.tsx` readable and is reusable, but inline is also fine. Low stakes — planner's choice.

## Sources

### Primary (HIGH confidence — read directly this session)
- `src/content/types.ts`, `src/content/projects.ts`, `src/content/skills.ts`, `src/content/seo.ts` — the append targets and exact shapes
- `src/app/projects/[id]/page.tsx` — detail render + `generateStaticParams`/`generateMetadata` (field inventory)
- `src/app/sitemap.ts`, `src/app/page.tsx` (grid + skills + accentMap), `src/app/layout.tsx` (knowsAbout) — consumers
- `src/components/Navigation.tsx` — nav wiring
- `scripts/content-diff.mjs` + `scripts/content-baseline.mjs` — gate behavior (additions allowed; `>=` numberOfItems; membership-not-count)
- `.planning/phases/01-content-centralization/01-02-SUMMARY.md`, `STATE.md`, `REQUIREMENTS.md`, `.planning/config.json`, project `CLAUDE.md`
- Live runs: `content-diff.mjs` → green; `tsc --version` → 5.9.2; `npm view next version` → 16.2.9 (locked out)

### Secondary (MEDIUM confidence)
- `.planning/codebase/ARCHITECTURE.md`, `.planning/research/FEATURES.md` — page patterns + case-study framing

### Tertiary (LOW confidence)
- None — every claim in this document is grounded in directly-read repo source.

## Metadata

**Confidence breakdown:**
- Append mechanics (projects/skills/projections): HIGH — verified line-by-line against actual modules and the diff gate.
- Detail-page field requirements: HIGH — read the JSX directly.
- SEO-02 propagation (metadata/JSON-LD/sitemap): HIGH — the wiring already exists and is verified; only `numberOfItems` needs manual care.
- New-route recommendation: HIGH — grounded in the Next.js client-vs-server metadata rule + existing server-page precedent.
- SVG diagram pattern: MEDIUM-HIGH — pattern is sound and matches repo conventions; exact visual is design-discretion.
- Skill-group granularity: MEDIUM — shape is fixed; grouping is editorial discretion.

**Research date:** 2026-06-12
**Valid until:** ~2026-07-12 (stable — in-repo task, no fast-moving external deps; re-verify only if Phase 1 modules change).
