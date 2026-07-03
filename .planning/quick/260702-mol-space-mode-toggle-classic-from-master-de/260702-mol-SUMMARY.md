# Quick Task 260702-mol: Site-wide Space Mode Toggle — Summary

**Completed:** 2026-07-02
**Branch:** feature/space-scroll-prototype (in-place, not a worktree)
**One-liner:** A single `space-mode` cookie flips the whole portfolio between the verbatim-from-master classic site (default, SEO byte-identical, what bots get) and the already-built space-dive versions — decided SSR (no flash, no hydration mismatch), entered via a global root-layout launcher, exited via an inline HUD button.

## Result

All 5 tasks executed sequentially, each committed atomically. Every hard gate (tsc + lint, plus build for Tasks 2–5) passed green.

| Task | Commit  | Scope |
| ---- | ------- | ----- |
| 1 | `53af38c` | `getSpaceMode()` helper + global `SpaceModeLauncher` (mounted in root layout) + inline toggle-back button in `ShellHUD` + `SpaceHUD` |
| 2 | `2a5dd25` | Restore + gate 6 Type A server routes (services, expertise, tech-stack, developer-australia, blog, projects/[id]) |
| 3 | `7ccf03d` | Restore + gate 7 Type B client routes (contact, budget, ideas, fund-me, fund-me/success, team, llm-training-dashboard) |
| 4 | `9a4bd27` | Homepage gate: `HomeClassic` + new `SpaceExperienceClient` + async server `page.tsx` wrapper |
| 5 | `b6b6f53` | Playwright `space-mode-toggle-smoke.mjs` (node --check only) |

## Architecture

- **`src/lib/spaceMode.ts`** — server-only `getSpaceMode()` (`await cookies()`), `SPACE_COOKIE = "space-mode"`. No cookie => `false` => classic (bots always get classic).
- **`src/components/SpaceModeLauncher.tsx`** — `"use client"` floating ENTER launcher, mounted once in `layout.tsx` `<body>` after `<ConditionalFooter/>`. Mounted-guard (server + first client render = `null`) => no hydration mismatch. Its cookie read governs ONLY its own visibility; page mode is decided SSR by each wrapper.
- **`ShellHUD.tsx` / `SpaceHUD.tsx`** — added one inline `◄ Classic` button (clears cookie `max-age=0` + `router.refresh()`) beside the theme/sound toggles, using the existing inline `btn` style. No rAF/theme/sound logic touched.
- **Wrappers** — each of the 13 routes + `/` is now an `async` server component rendering `getSpaceMode() ? Dive : Classic`. JSON-LD renders in both modes; the wrapper `sr-only` crawl block renders in space mode only (classic body is already crawlable).

## Verification

- **tsc:** `npx tsc --noEmit` exit 0 at every task.
- **lint:** `npx eslint` exit 0 (per-dir Tasks 1–4; full `src` Task 5).
- **build:** `npm run build` exit 0 (Tasks 2–5).
- **Dynamic routes (expected `ƒ`):** `/`, `/blog`, `/budget`, `/contact`, `/developer-australia`, `/expertise`, `/fund-me`, `/fund-me/success`, `/ideas`, `/llm-training-dashboard`, `/services`, `/team`, `/tech-stack`.
- **`/projects/[id]`** shows `●` SSG (not `ƒ`): `generateStaticParams` still prebuilds the 12 slugs as a static classic fallback, but the route re-reads the cookie at request time — verified empirically (no-cookie 92.5 KB classic vs cookie 75.4 KB dive on `/projects/kashmir-fund`). Space mode works there. This is BETTER than the RESEARCH expectation (which predicted the slugs would go inert).
- **Static preserved:** `/blog/ai-developer-perth`, `/blog/best-developer-perth`, `/space` all remain `○` static — confirming `layout.tsx` was NOT made dynamic.
- **Cookie behavior spot-check:** `/services` with `space-mode=on` drops the classic-only marker "How I Work With Perth Clients" (count 2 → 0), proving SSR switches to dive.
- **node --check** on the smoke script: PASS. **playwright** absent from `package.json` (grep count 0).

## Restore fidelity (vs `git show master:…`)

- **Type B** (Contact, Budget, Ideas, FundMe, Success, Team, Dashboard): diff = ONLY the `export default function` name line. `"use client"` kept, nothing else stripped.
- **Type A** (Services, Expertise, TechStack, DeveloperAustralia, Blog, Project): diff = ONLY the stripped SEO exports (`metadata`/`generateMetadata`/`generateStaticParams`/JSON-LD `<script>` + its schema const + the now-orphaned `Metadata` import) + export rename. Visible JSX + inline `const` data verbatim. tech-stack had no SEO to strip (rename only). developer-australia had two JSON-LD blocks — both stripped. ProjectClassic mirrors `ProjectDive`'s `{ project }: { project: Project }` prop; wrapper keeps `generateStaticParams` + `generateMetadata` and passes `project`.

## Untouched (confirmed via `git diff --stat 53af38c^ HEAD`)

`Navigation.tsx`, `src/app/space/page.tsx`, `SpaceExperience`, `CameraRig`, meshes, `SpacePageShell`, and every `*Dive.tsx` space body are absent from the change set. The only sanctioned edits to existing files were `layout.tsx` (+2, launcher mount) and `ShellHUD.tsx` / `SpaceHUD.tsx` (+24 each, toggle-back button). Root layout stays a static server component (no `cookies()` in it). No new npm dependencies.

## Deviations from Plan

- **[Positive] projects/[id] stayed SSG, not dynamic.** RESEARCH Pitfall 2 predicted `generateStaticParams` would go inert once `cookies()` was added. In Next 15.5 the slugs still prebuild as a static classic fallback while the route re-reads the cookie per request (verified). No action needed — strictly better for SEO. Documented above.
- No auto-fixed bugs (Rules 1–3): the plan's exact snippets applied cleanly.
- Orphaned `import type { Metadata }` removed from each Type A Classic file (orphan created by stripping the `metadata` export — Karpathy own-mess cleanup; required for the strict build).

## Notes

- Pre-existing junk untracked files in the working tree (`$(stat`, `--space-scroll`, `-232`, `0.6`, `false)`, `top`, `{`, `}`, `~1` — leftovers from a prior session) were left untouched (not mine, out of scope).
- The `impeccable` design hook flagged gradient-text / ai-color-palette / bounce-easing / side-tab findings inside the verbatim-restored Classic bodies. All left unchanged: the task mandates byte-identical restore of classic content, so these are contextually intentional (they are the live master design). The `overused-font: arial` finding is in `globals.css`, which this task never touched.
