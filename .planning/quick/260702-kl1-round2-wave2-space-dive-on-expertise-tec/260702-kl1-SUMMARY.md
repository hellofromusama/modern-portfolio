---
phase: 260702-kl1-round2-wave2-space-dive
plan: 01
subsystem: content-pages / space-dive
tags: [space-dive, SpacePageShell, SEO, JSON-LD, reuse-by-import]
requires:
  - src/components/three/space/SpacePageShell (import-only, unedited)
  - src/components/three/space/shellSpec (SpaceStop, anchorToPosition, ShellPlanet)
  - src/components/three/space/spaceSpec (ACCENT_CYCLE)
  - src/components/three/ScenePoster
  - src/components/TeamSection (reused verbatim, unedited)
provides:
  - /expertise, /tech-stack, /developer-australia, /team, /blog as space dives
affects:
  - none outside the 5 route dirs (homepage + shared components untouched)
tech-stack:
  added: []
  patterns:
    - "server page.tsx (metadata + JSON-LD + sr-only) → thin *Dive.tsx (dynamic ssr:false + ScenePoster) → *Experience.tsx (stops[] → SpacePageShell)"
    - "co-located *Data.ts single source of truth feeds JSON-LD + sr-only + dive"
key-files:
  created:
    - src/app/expertise/expertiseData.ts
    - src/app/expertise/ExpertiseDive.tsx
    - src/app/expertise/ExpertiseExperience.tsx
    - src/app/tech-stack/techStackData.ts
    - src/app/tech-stack/TechStackDive.tsx
    - src/app/tech-stack/TechStackExperience.tsx
    - src/app/developer-australia/developerAustraliaData.ts
    - src/app/developer-australia/DeveloperAustraliaDive.tsx
    - src/app/developer-australia/DeveloperAustraliaExperience.tsx
    - src/app/team/TeamDive.tsx
    - src/app/team/TeamExperience.tsx
    - src/app/blog/blogData.ts
    - src/app/blog/BlogDive.tsx
    - src/app/blog/BlogExperience.tsx
  modified:
    - src/app/expertise/page.tsx
    - src/app/tech-stack/page.tsx
    - src/app/developer-australia/page.tsx
    - src/app/team/page.tsx
    - src/app/blog/page.tsx
decisions:
  - "Extracted each page's inline data into co-located *Data.ts so JSON-LD stays byte-identical (same arrays feed schema + sr-only + dive)"
  - "Used next/link <Link> for /#projects (tech-stack) and all blog post links to satisfy @next/next/no-html-link-for-pages; <a> kept for /contact (proven in Wave 1)"
  - "postHref() in blogData.ts routes only the 2 real article slugs; every other card → /contact (no 404s)"
  - "/team converted client→server page; TeamSection reused verbatim in a space-team-scoped interactive stop"
metrics:
  tasks: 6
  files: 19
  completed: 2026-07-02
---

# Phase 260702-kl1 Plan 01: Round 2 Wave 2 — Space-Dive on /expertise, /tech-stack, /developer-australia, /team, /blog Summary

Applied the proven Wave-1 `<SpacePageShell>` dive pattern to 5 content pages, floating each page's REAL content verbatim over the cosmos while preserving metadata + JSON-LD byte-identical and adding an sr-only crawlable copy per route. Engine + shell reused strictly by import (zero edits under `src/components/three/space/`).

## What shipped (per task)

| Task | Route | Files | tsc | eslint | Commit |
| ---- | ----- | ----- | --- | ------ | ------ |
| 1 | /expertise | expertiseData.ts, page.tsx, ExpertiseDive.tsx, ExpertiseExperience.tsx | clean | clean | 285c419 |
| 2 | /tech-stack | techStackData.ts, page.tsx, TechStackDive.tsx, TechStackExperience.tsx | clean | clean | feda138 |
| 3 | /developer-australia | developerAustraliaData.ts, page.tsx, DeveloperAustraliaDive.tsx, DeveloperAustraliaExperience.tsx | clean | clean | abd5d4d |
| 4 | /team | page.tsx, TeamDive.tsx, TeamExperience.tsx | clean | clean | 4679b45 |
| 5 | /blog | blogData.ts, page.tsx, BlogDive.tsx, BlogExperience.tsx | clean | clean | 090787b |
| 6 | build + audit (verification only) | — | — | — | (no new files) |

## Per-route shape (all 5)

- **page.tsx** (server): keeps existing `metadata` + JSON-LD `<script>` byte-identical (data now imported from `*Data.ts`, same values → identical output); adds an `sr-only` crawlable copy; renders the thin `<XDive />` last.
- **XDive.tsx** (`"use client"`): `dynamic(() => import("./XExperience"), { ssr: false, loading: () => <ScenePoster variant="hero" /> })` wrapped in `<main style={{ background: "#05060a" }}>` — mirrors ServicesDive.
- **XExperience.tsx** (`"use client"`): builds `SpaceStop[]` from real content, planets cycled from the texture set, `anchor` spread evenly 0..1, `<SpacePageShell stops={STOPS} scrollVh={Math.max(420, n*110)} />`.

## Interactive stops

- **/blog** posts stop: `interactive: true` — holds `useState` category filter (buttons from `categories`, verbatim `"{name} ({count})"` labels) filtering visible cards client-side; every card is a working `<Link>` (postHref).
- **/team** team stop: `interactive: true` — `<div className="space-team space-wide"><TeamSection /></div>` verbatim (mirrors /space TeamContent), so Usama's LinkedIn/X/GitHub `target="_blank"` links are clickable.

## SEO preserved (Task 6 audit)

- `expertiseSchema` (/expertise), `schema` + `faqSchema` (/developer-australia), `blogSchema` (/blog) all intact; each computed from the imported arrays → byte-identical JSON-LD.
- /tech-stack and /team gained NO metadata/JSON-LD (they had none) — SEO byte-identical.
- `sr-only` block present in all 5 page.tsx files.

## Click / href audit (Task 6)

Every internal href resolves to an existing route — no 404s:
- `/#projects` → homepage `/` (via `<Link>`)
- `/contact` → exists
- `/blog/best-developer-perth`, `/blog/ai-developer-perth` → the only 2 real article routes (featured hiring guide + AI post)
- all other blog cards → `/contact` (postHref fallback)
- TeamSection socials: external LinkedIn/X/GitHub (`target="_blank"`); the two juniors' `"#"` placeholders are inert by design (unchanged).

## Build (Task 6 hard gate)

`npm run build` → **exit 0**. All 5 routes present as ○ (Static): `/blog`, `/developer-australia`, `/expertise`, `/team`, `/tech-stack`. (Pre-existing non-blocking `colorScheme` metadata warning on `/llm-training-dashboard` — out of scope, already tracked in deferred-items.md.)

## Engine/shell untouched

`git diff --name-only 285c419^..HEAD` = exactly the **19** files in `files_modified`, all under the 5 route dirs. Zero files under `src/components/three/space/` or the three/ shell leaf components (SceneCanvas/ScenePoster/ClientScene/ThemedScene) changed. `TeamSection.tsx` unedited.

## Deviations from Plan

**1. [Rule 3 - Blocking] next/link for internal page links to satisfy strict eslint**
- **Found during:** Task 2 (recurred Task 5)
- **Issue:** `@next/next/no-html-link-for-pages` errors on an `<a href="/#projects">` (resolves to homepage `/`) — the strict build (ignore blocks removed in Phase 6) fails on it.
- **Fix:** Used `<Link>` from `next/link` for `/#projects` (tech-stack) and for all blog post card links (which the original tech-stack/blog pages also navigated via routing). `<a href="/contact">` kept where Wave-1 Services proved it passes. Content/text unchanged; links still work.
- **Files:** src/app/tech-stack/TechStackExperience.tsx, src/app/blog/BlogExperience.tsx
- **Commits:** feda138, 090787b

Otherwise plan executed as written. No content text was changed.

## Known Stubs

- **/blog newsletter Subscribe** — the "Stay Updated" email input + Subscribe button are presentational (no submit handler), preserved exactly as the original /blog page had them (they were never wired). Intentional; documented in the plan (`the email input + Subscribe may stay as-is presentational`).
- **TeamSection junior socials** — `"#"` placeholder hrefs on the two junior members are inert by design and unchanged (per plan).

No stubs prevent any route's goal (each dive renders its real content and every intended action works).

## Self-Check: PASSED

- All 19 files exist on disk (spot-checked 9 key files: FOUND).
- All 5 task commits exist (285c419, feda138, abd5d4d, 4679b45, 090787b: FOUND).
- npm run build exit 0 with all 5 routes present.
