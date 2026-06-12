# Phase 1: Content Centralization - Research

**Researched:** 2026-06-12
**Domain:** Next.js 15 App Router — typed content-layer extraction + `generateStaticParams`/`generateMetadata` retrofit on a live, SEO-indexed site (additive, zero-deletion refactor)
**Confidence:** HIGH (source shapes captured from actual files line-by-line; Next.js 15 patterns verified against official docs + project research/ARCHITECTURE.md)

## Summary

The phase collapses content that lives in **four divergent places** into one typed `src/content/*` module. Critically — and this is the highest-leverage finding — the four sources are **NOT identical copies**. The homepage grid has **6** projects, the detail object has **7** (adds `modern-portfolio`), the JSON-LD ItemList has **6** (a different 6 — includes `modern-portfolio`, omits `kashmir-fund`), and `sitemap.ts` lists **8** project URLs. "Preserve byte-for-byte, zero deletions" therefore means **union-preserve every entry across all four sources, with each consumer continuing to emit exactly the set it emits today** — not "make them all the same." Flattening to a single 8-project array that every consumer renders would *add* URLs to the JSON-LD ItemList and *add* a card to the homepage grid, which is a behavioral change the success criteria (criterion 4: "unchanged in URL space"; criterion 2: "ZERO deletions") tolerate as additive only if intentional — but silently is a regression risk. The safe design is a single source-of-truth array of all 8 entries **plus per-consumer selection/ordering metadata** so each reader reproduces its current output exactly.

Second key finding: `projects/[id]/page.tsx` is **already a server component** (`export default async function`, `params: Promise<{id}>`, `notFound()` on miss) — NOT a client component. The `<additional_context>` hypothesis that it might need a server-wrapper/client-island split is **false for this page**. It has no `"use client"`, no hooks, no event handlers — it can take `generateStaticParams` + `generateMetadata` directly with zero restructuring. (The homepage `page.tsx` IS a client component, but it stays client; it just imports the array instead of declaring it inline — a client component can import a plain TS data module fine.)

**Primary recommendation:** Create `src/content/{types.ts, projects.ts, skills.ts}` + a `src/content/seo.ts` JSON-LD builder. Define one `projects` array (all 8 entries, each carrying every field any consumer needs) plus explicit per-consumer projections (`homeGridProjects`, `sitemapProjects`, `itemListProjects`) that reproduce today's exact sets/order. Snapshot all four sources to a baseline artifact BEFORE editing; diff after. Add `generateStaticParams`/`generateMetadata` to the already-server `projects/[id]` page. Gate on `tsc --noEmit` + lint + build + both-theme smoke + zero-deletion diff.

## User Constraints (from STATE.md / PROJECT.md / REQUIREMENTS.md)

> No CONTEXT.md exists for this phase (status: "Ready to plan", discuss not yet run). Constraints below are extracted from PROJECT.md, STATE.md, and REQUIREMENTS.md and carry locked-decision authority.

### Locked Decisions
- **Additive only — zero deletions.** No existing page, project, slug, skill, JSON-LD entity, or SEO asset may be removed. Existing entries preserved **verbatim** (byte-for-byte). A prior from-scratch rebuild was rolled back same-day; a dropped project or changed slug is a same-day-rollback offense.
- **Enhance, never rebuild.** Move literals into modules; do NOT paraphrase, "clean up," or reorganize existing files beyond repointing them at the content module.
- **No framework changes.** Next.js 15 App Router + Tailwind v4 CSS-first + TypeScript. No new content system (no CMS, no MDX collections) — a plain typed TS module is the chosen pattern.
- **Verification gate (SHIP-01, cross-cutting):** every phase passes `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke in BOTH themes before being marked complete. `next.config.ts` ignores TS/ESLint errors during build, so `tsc`/`lint` MUST be run explicitly — a green `next build` proves nothing.
- **Frozen SEO contracts:** all `public/` filenames and route paths are frozen; URLs unchanged in URL space. robots/IndexNow/AI-SEO routes untouched.

### Claude's Discretion
- Exact module file layout under `src/content/` (this research recommends `types.ts`, `projects.ts`, `skills.ts`, `seo.ts`).
- Whether to use a `src/lib/` baseline-snapshot script vs. a committed JSON artifact vs. a one-off node script (this research recommends a committed baseline JSON + a diff check).
- Shape of the per-consumer projection helpers (selection arrays vs. filter predicates vs. flags on each entry).
- Whether `expertise/page.tsx` `technicalExpertise` is centralized in this phase or left in place. **Recommendation:** the phase goal names "skills" and lists `expertise/page.tsx skills ~line 20" as an investigation target, but FOUND-01 only requires the home grid + projects/[id] + JSON-LD + sitemap to share one module. The `technicalExpertise` object is a *different shape* and only feeds the expertise page + its own JSON-LD. Recommend: centralize the **homepage `skills` array** into `content/skills.ts` (it is part of FOUND-01's "skills"), and leave `technicalExpertise` in `expertise/page.tsx` for this phase unless the planner wants to scope it in. Document the decision either way.

### Deferred Ideas (OUT OF SCOPE for Phase 1)
- Appending the 5 AI projects + AI skill domains (AICON-04/05) — that is **Phase 2**. Phase 1 only builds the centralized spine; it must not add the AI entries.
- Touching any visual/animation component, 3D, motion library — Phases 3-5.
- Security fixes (test-openai, VisitorTracker) — Phase 6 (FIX-01/02). FIX-03 (this phase) is the `generateStaticParams`/`generateMetadata` retrofit only.
- Re-enabling strict build (`ignoreBuildErrors`) — Phase 6.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | All projects/skills/expertise content in a single typed `src/content/` module consumed by home grid, projects/[id], layout JSON-LD, sitemap — every entry preserved verbatim, diff-verified | Source shapes captured below (Runtime/Content Inventory); union-preservation design + baseline-diff technique in Validation Architecture |
| FIX-03 | projects/[id] implements `generateStaticParams` + `generateMetadata` from centralized source (every slug preserved) | Page is already a server async component — direct retrofit, no restructure (Pattern 1, Code Examples). All 7 detail slugs must appear in `generateStaticParams` |
| SEO-01 | All existing routes, slugs, JSON-LD entities, sitemap entries, robots rules, AI-SEO/IndexNow routes unchanged in URL space | Per-consumer projection preserves exact emitted sets; baseline-diff gate; Rich Results validation (Common Pitfalls, Validation Architecture) |
| SHIP-01 | tsc + lint + build + both-theme smoke pass before phase marked complete | Validation Architecture + Common Pitfall "Verification theater" |

## Project Constraints (from CLAUDE.md)

The project `CLAUDE.md` is GSD-managed (PROJECT/STACK/CONVENTIONS/ARCHITECTURE sections). Actionable directives the planner must honor:

- **GSD workflow enforcement:** no direct repo edits outside a GSD command (`/gsd:execute-phase`). Edits happen through the execution workflow.
- **Naming/convention rules (CONVENTIONS section):**
  - Components: `PascalCase.tsx` in flat `src/components/` (no subfolders). New content modules go in `src/content/` (a NEW dir — acceptable, it is data not components).
  - Static page data is declared as plain `const` arrays/objects of literals — the content module continues that idiom, just hoisted to its own file.
  - `Record<string, T>` for lookup maps; string-literal unions for constrained values; `<Name>Props` interfaces.
  - Import alias: `@/*` → `./src/*` for cross-tree imports (`@/content/projects`); siblings use relative imports.
  - Quote style is mixed per-file — match the file you edit.
  - 2-space indent, semicolons always, trailing commas in multiline literals.
  - No JSDoc/TSDoc unless asked.
- **Theming:** components reference CSS custom properties (`var(--*)`), never hardcode theme colors. (Relevant only if any rendering markup is touched; the content module itself is themeless data.)
- **SEO metadata convention:** JSON-LD rendered as `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`. `generateMetadata` is **not currently used anywhere** — `projects/[id]` will be the first; follow Next 15 async-params signature.
- **Build caveat:** `eslint.ignoreDuringBuilds` + `typescript.ignoreBuildErrors` are `true` — run `tsc`/`lint` manually; do NOT rely on build to catch type drift in the new strictly-typed module.

## Runtime / Content State Inventory

> This is a refactor that moves stored content literals. The canonical question: after the four sources are repointed at one module, does every consumer still emit the exact same slugs, URLs, JSON-LD entities, and skill strings it emits today? The table below is the baseline every migration task must preserve.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Home grid projects** (`src/app/page.tsx` line 37, `const projects`) | **6 entries**, ids in order: `kashmir-fund`, `n8n-automation`, `voice-ai-agent`, `erp-system`, `netsuite-integration`, `cloud-infrastructure`. Fields per entry: `{ id, title, description, tech[], category }`. **Does NOT include `modern-portfolio`.** | Move to `content/projects.ts`; expose a `homeGridProjects` projection that reproduces these 6 in this order |
| **Project detail object** (`src/app/projects/[id]/page.tsx` line 4, `const projects`) | **7 entries**, keys: `kashmir-fund`, `n8n-automation`, `voice-ai-agent`, `erp-system`, `netsuite-integration`, **`modern-portfolio`**, `cloud-infrastructure`. Richer fields: `{ title, subtitle, description, longDescription, tech[], category, timeline, team, features[], challenges[], results[], gradient }` + optional `liveUrl` (only `kashmir-fund` has `liveUrl: "https://iamstandingwithkashmir.org"`). | Move to `content/projects.ts` as the **superset of fields**; `generateStaticParams` must emit all **7** keys. `getProject(id)` lookup replaces inline record access |
| **JSON-LD ItemList** (`src/app/layout.tsx` line 494, `projectsListData`) | **6 ListItems**, `numberOfItems: 6`. Set: `n8n-automation`, `voice-ai-agent`, `erp-system`, `netsuite-integration`, `cloud-infrastructure`, `modern-portfolio`. **Omits `kashmir-fund`.** Each item is a `SoftwareApplication` with its OWN curated `name`/`description` (e.g. "Enterprise N8N Automation Platform", "reducing manual processes by 70%") that DIFFER from the grid/detail copy, plus `applicationCategory` (BusinessApplication / DeveloperApplication / WebApplication) and `url`. | Build `itemListProjects` projection / `buildItemListSchema()` in `content/seo.ts` that reproduces these exact 6 items, their order, their curated SEO copy, their `applicationCategory`, and `numberOfItems: 6`. **The JSON-LD names/descriptions are NOT the grid descriptions — they are a separate field set that must be carried verbatim.** |
| **Sitemap project URLs** (`src/app/sitemap.ts`) | **8 project URLs** in this order: `n8n-automation`, `voice-ai-agent`, `erp-system`, `netsuite-integration`, `cloud-infrastructure` (all priority 0.8), `modern-portfolio` (0.7), `kashmir-fund` (0.7). Plus non-project URLs (core pages + 2 blog articles) that are out of scope but must remain untouched. | `sitemapProjects` projection reproduces these 8 entries with exact `priority` + `changeFrequency: 'monthly'`. Non-project sitemap entries stay hardcoded/untouched |
| **Homepage skills** (`src/app/page.tsx` line 82, `const skills`) | **4 entries**: `Frontend` (accent blue), `Backend` (violet), `Cloud & DevOps` (emerald), `Specializations` (amber). Each `{ title, accent, items[] }`, 4 items each. `accentMap` (line 89) maps accent→Tailwind classes and stays in `page.tsx` (it is render config, not content). | Move `skills` to `content/skills.ts`; keep `accentMap` in `page.tsx` |
| **Expertise `technicalExpertise`** (`src/app/expertise/page.tsx` line 20) | **6 categories**: `frontend_mastery`, `backend_mastery`, `ai_integration`, `enterprise_solutions`, `cloud_devops`, `industry_expertise`. Each has `category`, `description`, `technologies[]` of `{ name, level, experience, specializations[], projects, achievements[] }`. Plus `certifications` (line 397, 5 certs) and a derived `expertiseSchema` JSON-LD (line 431) computed FROM `technicalExpertise`. | **Recommend OUT OF SCOPE for centralization this phase** (different shape, only feeds one page + its own schema). If centralized, must preserve all 6 categories + 5 certs verbatim and keep the derived-schema logic. Decide explicitly. |
| **SEO mirror `knowsAbout`** (`src/app/layout.tsx` line 175) | ~40-item flat skill string array feeding the Person schema. | **OUT OF SCOPE** — this is an SEO mirror, an append-target for Phase 2 (AICON-05). Do NOT touch in Phase 1. Note it exists so the planner knows it is a *separate* skill list not unified by FOUND-01. |

**Divergence summary (the load-bearing fact):** Across the 4 in-scope project sources, the **union is 7 distinct project ids** (`kashmir-fund, n8n-automation, voice-ai-agent, erp-system, netsuite-integration, cloud-infrastructure, modern-portfolio`). No single source contains all 7 in the same form:
- `kashmir-fund` is in grid(6), detail(7), sitemap(8) — but **absent from JSON-LD ItemList(6)**.
- `modern-portfolio` is in detail(7), JSON-LD(6), sitemap(8) — but **absent from the home grid(6)**.
- The JSON-LD copy for each project is **curated SEO text distinct from the grid/detail descriptions**.

The centralized model must store the **superset (all 7 projects, all fields including the JSON-LD-specific `seoName`/`seoDescription`/`applicationCategory`)** and let each consumer **select + order** its current subset. A naive "one array, everyone renders it" approach silently changes 3 of the 4 outputs.

**Nothing found in these categories** (verified — this is a code-literal refactor, not a service migration):
- Stored data (databases/datastores): None — no DB; content is TS literals only.
- Live service config (UI/DB-resident): None affected — IndexNow/robots/sitemap are code-generated; no external dashboard stores these slugs.
- OS-registered state: None.
- Secrets/env vars: None — content module has no secrets.
- Build artifacts: None requiring action — `.next/` regenerates; no published package carries these slugs.

## Standard Stack

No new dependencies. This phase is a pure TypeScript refactor using framework built-ins already in the project.

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| TypeScript | 5.9.2 (already installed) | Strict typing of the content module catches drift `next build` ignores | Project already strict-mode; typed content is the safety net replacing absent tests |
| Next.js | 15.5.12 (already installed) | `generateStaticParams`, `generateMetadata`, `MetadataRoute.Sitemap`, JSON-LD `<script>` — all framework-native | Already the framework; these are the canonical App Router content/SEO primitives |
| React | 19.2.4 (already installed) | Server components consume the module directly | n/a — no React API change |

### Supporting
None. No CMS, no MDX (`@next/mdx`), no `contentlayer`, no `zod`. The project research/ARCHITECTURE.md explicitly recommends a hand-rolled typed module over a content system: "the data is small, additive, and already exists as TS literals." Adding `zod` for runtime validation would be over-engineering for build-time-static data — `tsc --noEmit` is the validation.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain typed TS module | MDX / contentlayer / CMS | Massively heavier; data is tiny and additive; rejected by project architecture research |
| `tsc` as validator | `zod` runtime schemas | Runtime cost + ceremony for static build-time data; `tsc --noEmit` already gives compile-time guarantees |
| Per-consumer projection arrays | Single shared array all consumers render | Single array silently changes 3 of 4 current outputs (adds JSON-LD items, adds a grid card) — violates "unchanged" |

**Installation:** None required.

**Version verification:** No packages added; existing versions confirmed from STACK section of CLAUDE.md (TypeScript 5.9.2, Next 15.5.12, React 19.2.4). Skipped `npm view` — no install in this phase.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── content/                  # NEW — single source of truth (pure TS, server-safe, no JSX)
│   ├── types.ts              #   Project, Skill interfaces (+ ProjectSeo fields)
│   ├── projects.ts           #   all 7 projects (superset of fields) + projections + getProject()
│   ├── skills.ts             #   homepage skills[] (4 groups)
│   └── seo.ts                #   buildItemListSchema() reproducing layout JSON-LD exactly
├── app/
│   ├── page.tsx              #   imports homeGridProjects + skills (was inline)  [stays "use client"]
│   ├── projects/[id]/page.tsx#   imports projects/getProject; + generateStaticParams + generateMetadata
│   ├── layout.tsx            #   projectsListData ← buildItemListSchema() (was inline literal)
│   └── sitemap.ts            #   project URLs ← sitemapProjects (non-project URLs untouched)
└── .planning/phases/01-content-centralization/
    └── baseline/             #   baseline snapshot artifacts (slugs, JSON-LD, sitemap URLs) for diff gate
```

### Pattern 1: `projects/[id]` is already a server component — direct retrofit (no island split)
**What:** The detail page is `export default async function ProjectDetail({ params }: { params: Promise<{ id }> })` with `notFound()` — already server-side, already Next-15 async-params. It has no `"use client"`, no hooks, no handlers.
**When to use:** Here — add `generateStaticParams` and `generateMetadata` as sibling exports; no restructuring, no client-island wrapper needed. (The `<additional_context>` server-wrapper-split hypothesis applies to *client* pages; it does NOT apply to this page.)
**Example:**
```typescript
// app/projects/[id]/page.tsx — add these exports; body unchanged except sourcing `projects` from content/
import { projects, getProject } from "@/content/projects";

export function generateStaticParams() {
  return Object.keys(projects).map((id) => ({ id })); // OR projects.map(p => ({ id: p.id })) if array
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = getProject(id);
  if (!p) return {};                               // unknown → page still notFound()s in the component
  return { title: p.title, description: p.description };
}
```
> Acceptance: `generateStaticParams` returns **exactly 7** params (`kashmir-fund, n8n-automation, voice-ai-agent, erp-system, netsuite-integration, modern-portfolio, cloud-infrastructure`); every one resolves (no 404 in `next build` output).

### Pattern 2: Superset source + per-consumer projections (preserves divergent outputs)
**What:** Store every project once with ALL fields any consumer needs (grid fields + detail fields + JSON-LD `seoName`/`seoDescription`/`applicationCategory`/`url` + sitemap `priority`). Then export named projections that select & order each consumer's current subset.
**When to use:** Always here — it is the only design that reproduces 6/7/6/8 divergent outputs from one source.
**Example:**
```typescript
// content/projects.ts
export const projects: Project[] = [ /* all 7, superset of fields, verbatim copy */ ];
export const getProject = (id: string) => projects.find(p => p.id === id);

// home grid: exactly the 6 ids in current order, grid fields only
export const homeGridProjects = ["kashmir-fund","n8n-automation","voice-ai-agent",
  "erp-system","netsuite-integration","cloud-infrastructure"]
  .map(id => getProject(id)!);

// sitemap: 8 entries w/ priority (note kashmir-fund + modern-portfolio at 0.7)
export const sitemapProjects = [
  ...["n8n-automation","voice-ai-agent","erp-system","netsuite-integration","cloud-infrastructure"]
     .map(id => ({ ...getProject(id)!, priority: 0.8 })),
  { ...getProject("modern-portfolio")!, priority: 0.7 },
  { ...getProject("kashmir-fund")!, priority: 0.7 },
];

// JSON-LD ItemList: the OTHER 6 (no kashmir-fund), curated SEO copy, in current order
export const itemListProjects = ["n8n-automation","voice-ai-agent","erp-system",
  "netsuite-integration","cloud-infrastructure","modern-portfolio"].map(id => getProject(id)!);
```

### Pattern 3: JSON-LD builder reproduces the schema shape exactly
**What:** `content/seo.ts` exposes `buildItemListSchema()` returning the identical object today's `projectsListData` literal produces — same `@context/@type/@id/name/description`, `numberOfItems: 6`, and each `SoftwareApplication` with its curated `seoName`/`seoDescription`/`applicationCategory`/`url`/`author`.
**When to use:** layout.tsx imports it instead of holding the literal; output must be byte-identical (diff gate).
**Anti-pattern:** reusing the grid `description` for the JSON-LD `description` — they DIFFER. Carry the JSON-LD copy as distinct fields (`seoName`, `seoDescription`, `applicationCategory`) on each project.

### Anti-Patterns to Avoid
- **One flat array everyone renders:** silently adds `modern-portfolio` to the home grid and `kashmir-fund` to the JSON-LD ItemList — output drift. Use projections.
- **Paraphrasing while moving:** any copy edit breaks "verbatim." Move literals untouched.
- **Trusting `next build`:** it ignores type/lint errors. Run `tsc --noEmit` + `lint` + the diff gate.
- **Reordering entries:** order is observable (sitemap order, ItemList `position`, grid order). Preserve order per consumer.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Static param generation for dynamic route | Manual route list / hardcoded prerender | `generateStaticParams` | Framework-native; prerenders every slug; single source from content array |
| Per-project `<head>` metadata | Manual `<head>` tags / `next/head` (`AdvancedSEO.tsx` dead pattern) | `generateMetadata` (async-params) | App Router canonical; `next/head` is a no-op here |
| Sitemap XML | String templating | `MetadataRoute.Sitemap` (already used) | Type-safe; framework serializes |
| Content validation | Custom invariants / zod | `tsc --noEmit` against `types.ts` | Compile-time, zero runtime, already in stack |
| Proving zero deletions | Eyeballing the diff | Baseline snapshot + automated diff (Validation Architecture) | Manual review misses one entry in 7×N fields |

**Key insight:** Everything this phase needs is a Next.js 15 built-in already present in the codebase. The only "new" code is plain typed data + thin projections. The risk is not capability — it is *fidelity* (preserving divergent outputs verbatim), which is a verification problem, not an implementation one.

## Common Pitfalls

### Pitfall 1: Silent content loss / drift during centralization (project PITFALLS #4 — the phase's #1 risk)
**What goes wrong:** Consolidating 4 divergent sources drops an entry, alters a slug, changes a JSON-LD `name`/`description`, or shrinks the sitemap. Breaks indexed URLs, Rich Results, sitemap. Same-day-rollback offense.
**Why it happens:** No tests; `ignoreBuildErrors: true` masks type drift; "it builds" ≠ "all entries survived." The sources genuinely differ (6/7/6/8), so a "make them consistent" instinct *changes* outputs.
**How to avoid:** Snapshot all four sources to a baseline artifact BEFORE editing (slug lists, the rendered JSON-LD ItemList JSON, the sitemap URL set, the skills strings). Build the module, repoint consumers, then diff generated output vs. baseline — require **zero deletions/changes** to existing entries. Validate JSON-LD with Google Rich Results Test.
**Warning signs:** project/skill count drops vs. baseline; a `projects/[id]` URL 404s; Rich Results loses ItemList; sitemap URL set shrinks; `numberOfItems` ≠ 6.

### Pitfall 2: `generateStaticParams` misses a slug (FIX-03 regression)
**What goes wrong:** Building params from the home grid (6) or JSON-LD set (6) instead of the detail object (7) drops `modern-portfolio` or `kashmir-fund` → that detail URL 404s.
**How to avoid:** Build `generateStaticParams` from the **full 7-project superset** (the detail object's key set), not from a consumer projection. Verify `next build` output lists all 7 `/projects/*` routes as prerendered.
**Warning signs:** fewer than 7 project routes in build output; a known slug 404s on hard refresh.

### Pitfall 3: JSON-LD copy substitution
**What goes wrong:** Using the grid/detail `description` for the ItemList `description` (they differ — "reducing manual processes by 70%..." vs. the grid's "A mining company was losing 120 hrs/week...").
**How to avoid:** Store the JSON-LD's curated `name`/`description`/`applicationCategory` as distinct fields; the builder emits those, not the grid copy. Diff the serialized schema against baseline.

### Pitfall 4: Verification theater (project PITFALLS #8)
**What goes wrong:** Green `next build` while types/SEO are broken — `ignoreBuildErrors`/`ignoreDuringBuilds` are `true`.
**How to avoid:** Run `npm ci` (node_modules may be absent) → `npx tsc --noEmit` → `npm run lint` → `npm run build` → hard-refresh smoke of `/`, a `/projects/[id]`, both themes. Build alone is not the gate.

### Pitfall 5: Client-component import confusion
**What goes wrong:** Worrying a `"use client"` page (homepage) can't import the content module, or that the module needs `"use client"`.
**How to avoid:** The content module is plain data (no React) — importable from server OR client. `page.tsx` stays `"use client"` and just imports `homeGridProjects`/`skills`. No directive on the content files.

## Code Examples

### Sitemap consuming the projection (non-project URLs untouched)
```typescript
// app/sitemap.ts
import { sitemapProjects } from "@/content/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.usamajaved.com.au';
  const currentDate = new Date().toISOString();
  return [
    /* ...core pages + blog articles EXACTLY as today (untouched)... */
    ...sitemapProjects.map(p => ({
      url: `${baseUrl}/projects/${p.id}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: p.priority,
    })),
  ];
}
```
> Acceptance: emitted project URL set + order + priorities identical to baseline (8 URLs).

### Layout JSON-LD from builder
```typescript
// app/layout.tsx
import { buildItemListSchema } from "@/content/seo";
const projectsListData = buildItemListSchema(); // === the current literal, numberOfItems: 6
// ...rendered as before: <script type="application/ld+json"
//      dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsListData) }} />
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `params` sync object | `params: Promise<{id}>` (await it) | Next.js 15 | Already adopted in detail page; `generateMetadata` must use async-params too |
| `next/head` for per-page SEO (`AdvancedSEO.tsx`) | `metadata` / `generateMetadata` exports | App Router (Next 13+) | `next/head` is a no-op in App Router — do NOT model the retrofit on the dead `AdvancedSEO.tsx` |
| Inline duplicated content literals | Single typed content module + projections | This phase | Eliminates 4-way manual sync; makes Phase 2 AI-append a one-place edit |

**Deprecated/outdated:** `next/head` pattern (`AdvancedSEO.tsx`) — dead code, do not reuse.

## Open Questions

1. **Is `expertise/page.tsx` `technicalExpertise` in scope for centralization this phase?**
   - What we know: FOUND-01 lists the home grid + projects/[id] + JSON-LD + sitemap as the four consumers. The phase goal text and `<additional_context>` mention `expertise/page.tsx skills ~line 20` as an investigation target.
   - What's unclear: whether `technicalExpertise` (a different, richer shape feeding only the expertise page + its derived schema) must move into `content/` now.
   - Recommendation: Centralize the **homepage `skills` array** (clearly part of FOUND-01's "skills"). Leave `technicalExpertise` in place this phase (different consumer, different shape, no duplication with the four FOUND-01 sources). Planner should make this an explicit decision in the plan; if scoped in, preserve all 6 categories + 5 certs verbatim and keep the derived `expertiseSchema` logic.

2. **Do we intentionally normalize the divergences (e.g., add `kashmir-fund` to the JSON-LD ItemList) or strictly preserve?**
   - What we know: success criterion 2 = "ZERO deletions, every entry preserved verbatim"; criterion 4 = "unchanged in URL space." Additions are technically allowed (additive mandate) but changing JSON-LD set membership is a behavioral change.
   - Recommendation: **Strictly preserve current outputs** in Phase 1 (do NOT normalize). Normalizing risk-trades a clean spine for an unverified SEO change. Any intentional unification should be a separate, explicit, owner-visible decision — not a side effect of centralization.

## Validation Architecture

> nyquist_validation is `true` in config. No test framework exists (Wave 0 must establish the validation harness — but as scripts, not a full test suite, since V2-04 defers vitest/Playwright).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed (no vitest/jest/playwright; V2-04 defers a real suite) |
| Config file | none — see Wave 0 |
| Quick run command | `npx tsc --noEmit` (type-level validation of the content module) |
| Full suite command | `npm ci && npx tsc --noEmit && npm run lint && npm run build` |

### Phase Requirements → Validation Map
| Req ID | Behavior | Validation Type | Automated Command | Exists? |
|--------|----------|-----------------|-------------------|---------|
| FOUND-01 | All 4 consumers render from one module; zero literal duplication | static + diff | grep for inline `const projects` in page.tsx/[id]/layout (should be gone) + baseline diff | ❌ Wave 0 (diff script) |
| FOUND-01 | Every existing entry preserved byte-for-byte | snapshot diff | `node scripts/content-baseline-diff.mjs` (compares baseline vs. generated slugs/JSON-LD/sitemap) | ❌ Wave 0 |
| FIX-03 | `generateStaticParams` emits all 7 slugs, all resolve | build output check | `npm run build` → assert 7 `/projects/*` prerendered routes; grep build log | ❌ Wave 0 (assertion script) |
| FIX-03 | `generateMetadata` returns title/description per slug | type + smoke | `npx tsc --noEmit` + manual view-source of 2 project pages | partial (tsc exists) |
| SEO-01 | JSON-LD ItemList unchanged (6 items, curated copy, numberOfItems 6) | snapshot diff + Rich Results | diff serialized `buildItemListSchema()` vs. baseline; Google Rich Results Test (manual) | ❌ Wave 0 |
| SEO-01 | Sitemap project URL set/order/priority unchanged (8) | snapshot diff | diff generated sitemap project URLs vs. baseline | ❌ Wave 0 |
| SHIP-01 | tsc + lint + build clean; both-theme smoke | gate | `npm ci && npx tsc --noEmit && npm run lint && npm run build` + manual | partial |

### Baseline-Snapshot Diff Technique (the definition of done)
**Before any edit** (Wave 0), capture a baseline artifact under `.planning/phases/01-content-centralization/baseline/`:
1. **Slug lists:** the 6 grid ids, the 7 detail keys, the 6 JSON-LD ItemList urls, the 8 sitemap project urls — as committed JSON/text.
2. **Serialized JSON-LD:** `JSON.stringify(projectsListData)` from current `layout.tsx` (the exact 6-item ItemList) → `baseline/itemlist.json`.
3. **Sitemap project URLs:** the project-URL subset with priorities → `baseline/sitemap-projects.json`.
4. **Skills strings:** the 4 grid skill groups + their items → `baseline/skills.json`.

**After repointing**, regenerate the same four artifacts from the new module-backed consumers and **diff**. Gate = **zero deletions, zero modifications** to existing entries (Phase 1 adds nothing — AI entries are Phase 2). A simple node script (`scripts/content-baseline-diff.mjs`) that imports the projections and `JSON.stringify`-compares against the committed baselines, exiting non-zero on any delta, is the automatable gate. (Importing `.ts` content from a node script needs `tsx`/`ts-node` or building first; alternatively diff the rendered `/sitemap.xml` and view-source JSON-LD from a running `next build && next start`.)

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (the content module must always type-check).
- **Per wave merge:** `npm run lint` + the baseline-diff script.
- **Phase gate:** `npm ci && npx tsc --noEmit && npm run lint && npm run build` green + zero-deletion diff + both-theme manual smoke (`/`, a `/projects/[id]` hard-refresh) + Google Rich Results Test on `/` and a project page before `/gsd:verify-work`.

### Wave 0 Gaps
- [ ] `.planning/phases/01-content-centralization/baseline/{slugs,itemlist,sitemap-projects,skills}.json` — capture current outputs BEFORE editing (REQ FOUND-01/SEO-01)
- [ ] `scripts/content-baseline-diff.mjs` — regenerate + diff vs. baseline, exit non-zero on any deletion/change (REQ FOUND-01/SEO-01)
- [ ] Build-output assertion: confirm 7 `/projects/*` routes prerendered (REQ FIX-03)
- [ ] No test framework install needed (V2-04 defers vitest/Playwright); validation is scripts + manual Rich Results, not a unit suite

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | tsc/lint/build/scripts | ✓ (per STACK) | v22.22.2 local | — |
| npm | install + scripts | ✓ | lockfile v3 | — |
| TypeScript | `tsc --noEmit` gate | ✓ (devDep) | 5.9.2 | — |
| ESLint | `npm run lint` | ✓ | 9.36.0 flat | — |
| `tsx`/`ts-node` | running the diff script against `.ts` content | ✗ (not in deps) | — | Diff the rendered `/sitemap.xml` + view-source JSON-LD from `next build && next start` instead of importing `.ts` directly; OR add `tsx` as a devDep for the script |
| Google Rich Results Test | JSON-LD validation | ✓ (web tool) | — | manual |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** `tsx`/`ts-node` for importing content `.ts` in the diff script — fall back to diffing rendered route output, or have the planner add `tsx` as a devDependency in Wave 0 (low risk, dev-only).

## Sources

### Primary (HIGH confidence)
- Actual source files read line-by-line: `src/app/page.tsx` (projects L37, skills L82), `src/app/projects/[id]/page.tsx` (full 7-entry object L4, already async server component), `src/app/sitemap.ts` (8 project URLs), `src/app/layout.tsx` (JSON-LD ItemList L494 = 6 items, `knowsAbout` L175), `src/app/expertise/page.tsx` (6 categories L20, certs L397, derived schema L431)
- `.planning/REQUIREMENTS.md` — FOUND-01, FIX-03, SEO-01, SHIP-01
- `.planning/STATE.md` + CLAUDE.md (PROJECT/STACK/CONVENTIONS) — locked constraints, additive mandate, build caveat
- `.planning/research/ARCHITECTURE.md` — content-module-as-source pattern, projection fan-out, `generateStaticParams`/`generateMetadata` from content (Pattern 2; verified against Next.js JSON-LD + dynamic-routes official docs cited therein)
- `.planning/research/PITFALLS.md` #4 (silent content loss) and #8 (verification theater)

### Secondary (MEDIUM confidence)
- Next.js 15 App Router conventions (`generateStaticParams`, `generateMetadata` async-params, `MetadataRoute.Sitemap`) — established framework docs, corroborated by existing project usage and research/ARCHITECTURE.md sources.

### Tertiary (LOW confidence)
- None — all claims grounded in read source or project research docs.

## Metadata

**Confidence breakdown:**
- Source/content inventory: HIGH — captured from actual files; entry counts/slugs/fields verified directly.
- Architecture (projections + retrofit): HIGH — projects/[id] confirmed server-async by reading the file; pattern matches project research.
- Validation/diff technique: HIGH on approach, MEDIUM on tooling (`tsx` availability for the script is the only soft spot — fallback documented).
- Skills-scope decision: MEDIUM — flagged as an Open Question for the planner/owner to resolve.

**Research date:** 2026-06-12
**Valid until:** 2026-07-12 (stable refactor domain; only risk is the codebase changing — re-snapshot if source files are edited before planning)
