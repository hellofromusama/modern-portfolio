---
phase: quick-260702-mol
plan: 01
type: execute
wave: 1
depends_on: []
autonomous: true
requirements: [260702-mol]
files_modified:
  - src/lib/spaceMode.ts
  - src/components/SpaceModeLauncher.tsx
  - src/app/layout.tsx
  - src/components/three/space/ShellHUD.tsx
  - src/components/three/space/SpaceHUD.tsx
  - src/components/three/space/SpaceExperienceClient.tsx
  - src/app/page.tsx
  - src/app/HomeClassic.tsx
  - src/app/services/ServicesClassic.tsx
  - src/app/services/page.tsx
  - src/app/expertise/ExpertiseClassic.tsx
  - src/app/expertise/page.tsx
  - src/app/tech-stack/TechStackClassic.tsx
  - src/app/tech-stack/page.tsx
  - src/app/developer-australia/DeveloperAustraliaClassic.tsx
  - src/app/developer-australia/page.tsx
  - src/app/blog/BlogClassic.tsx
  - src/app/blog/page.tsx
  - src/app/projects/[id]/ProjectClassic.tsx
  - src/app/projects/[id]/page.tsx
  - src/app/contact/ContactClassic.tsx
  - src/app/contact/page.tsx
  - src/app/budget/BudgetClassic.tsx
  - src/app/budget/page.tsx
  - src/app/ideas/IdeasClassic.tsx
  - src/app/ideas/page.tsx
  - src/app/fund-me/FundMeClassic.tsx
  - src/app/fund-me/page.tsx
  - src/app/fund-me/success/SuccessClassic.tsx
  - src/app/fund-me/success/page.tsx
  - src/app/team/TeamClassic.tsx
  - src/app/team/page.tsx
  - src/app/llm-training-dashboard/DashboardClassic.tsx
  - src/app/llm-training-dashboard/page.tsx
  - .planning/quick/260702-mol-space-mode-toggle-classic-from-master-de/space-mode-toggle-smoke.mjs

must_haves:
  truths:
    - "Any of the 13 gated routes + homepage, loaded with NO space-mode cookie (bots, first visit), renders the CLASSIC version — real crawlable DOM, no WebGL canvas."
    - "The SAME URL, requested with cookie space-mode=on, renders the space-dive version server-side on first load (WebGL canvas + the --space-scroll CSS var are present)."
    - "The Space Mode entry launcher appears on EVERY classic page via the ROOT LAYOUT (including nav-less classic routes like /services, /expertise, /blog, /llm-training-dashboard), not via per-page Navigation."
    - "Clicking the global floating Space Mode launcher writes the space-mode cookie and enters space mode via router.refresh() (no full-document reload / white flash)."
    - "Clicking the toggle-back control in the space HUD (ShellHUD + SpaceHUD) clears the space-mode cookie (max-age=0) and returns the whole site to classic."
    - "Classic bodies are byte-identical to master; space-dive bodies and /space are unchanged (additive only)."
    - "The PAGE mode decision is SSR-only (server reads the cookie in each wrapper) — the client never reads document.cookie to decide the PAGE render, so there is no hydration mismatch. The launcher's cookie read governs ONLY its own chrome visibility, after mount."
  artifacts:
    - path: "src/lib/spaceMode.ts"
      provides: "Server-only getSpaceMode() (await cookies()) + SPACE_COOKIE constant"
      contains: "export async function getSpaceMode"
    - path: "src/components/SpaceModeLauncher.tsx"
      provides: "Global floating client ENTER launcher (fixed bottom-right): writes document.cookie + router.refresh(); mounted-guard hides itself in space mode. Chrome only — never gates page content."
      contains: "router.refresh()"
    - path: "src/components/three/space/SpaceExperienceClient.tsx"
      provides: "Client ssr:false wrapper around SpaceExperience for the home space render (NEW — does not touch /space)"
      contains: "ssr: false"
    - path: "src/app/HomeClassic.tsx"
      provides: "The current classic homepage body, moved verbatim ('use client')"
      contains: "use client"
    - path: "src/app/page.tsx"
      provides: "Server wrapper: getSpaceMode() ? space home : HomeClassic"
      contains: "getSpaceMode"
  key_links:
    - from: "src/app/*/page.tsx (13 wrappers + home)"
      to: "src/lib/spaceMode.ts"
      via: "await getSpaceMode() decides <XDive/> vs <XClassic/>"
      pattern: "getSpaceMode\\(\\)"
    - from: "src/components/SpaceModeLauncher.tsx"
      to: "document.cookie (space-mode)"
      via: "writeSpaceCookie(true) + router.refresh()"
      pattern: "space-mode"
    - from: "src/app/layout.tsx"
      to: "src/components/SpaceModeLauncher.tsx"
      via: "mounted once in <body>, renders site-wide on every route"
      pattern: "SpaceModeLauncher"
    - from: "src/components/three/space/ShellHUD.tsx / SpaceHUD.tsx"
      to: "document.cookie (space-mode) clear"
      via: "inline toggle-back button (max-age=0) + router.refresh()"
      pattern: "space-mode"
---

<objective>
Build the site-wide "Space Mode" toggle. Classic pages (restored verbatim from git `master`) are the DEFAULT; a single `space-mode` cookie flips the whole site to the already-built space-dive versions. The cookie is read SSR (no flash, no hydration mismatch); bots send no cookie so they always get the classic render (SEO byte-identical to today's classic output).

Purpose: One additive cookie switch turns the entire portfolio into its space-dive alter-ego without deleting or degrading any existing content.
Output: A server `getSpaceMode()` helper + a global floating Space Mode launcher mounted in the root layout (present on every classic page, including nav-less ones), 13 `<Route>Classic.tsx` bodies restored from master and gated in their wrappers, a gated homepage, a toggle-back control in the space HUD, and a Playwright smoke script.
</objective>

<execution_context>
Karpathy guidelines apply (surgical, minimal, verbatim restore, no refactors). Follow `~/.claude/skills/karpathy-guidelines`.
This is a quick task — no execute-plan/summary templates required. Commit at the end only if the user asks.
</execution_context>

<context>
@.planning/quick/260702-mol-space-mode-toggle-classic-from-master-de/260702-mol-RESEARCH.md
@src/app/services/page.tsx
@src/app/contact/page.tsx
@src/app/projects/[id]/page.tsx
@src/app/page.tsx
@src/app/space/page.tsx
@src/app/layout.tsx
@src/components/ThemeToggle.tsx
@src/components/three/space/ShellHUD.tsx
@src/components/three/space/SpaceHUD.tsx

<facts_verified>
- Branch: feature/space-scroll-prototype. All 13 target routes are ALREADY server wrappers that render `<XDive/>`; NO `<Route>Classic.tsx` exists yet. Dive files confirmed present for all 13.
- ENTRY REACHABILITY (checker-verified vs master): the shared `Navigation.tsx` is NOT universal. Only 7 classic pages render it (/, /contact, /budget, /ideas, /fund-me, /fund-me/success, /team); 3 render their own inline nav (tech-stack, developer-australia, projects/[id]); and 4 render NO nav at all (services, expertise, blog, llm-training-dashboard). Therefore the Space Mode ENTRY point is a GLOBAL floating launcher mounted in the ROOT LAYOUT — NOT per-page Navigation. Per-route nav presence is IRRELEVANT to reachability.
- master body types (git show master:src/app/<route>/page.tsx):
  - Type A (SERVER, no "use client"): services (metadata+JSON-LD), expertise (metadata+JSON-LD), developer-australia (metadata+2 JSON-LD), blog (metadata+JSON-LD), tech-stack (plain server, NO metadata/JSON-LD), projects/[id] (has generateMetadata+generateStaticParams, NO JSON-LD).
  - Type B (CLIENT, "use client", no metadata/JSON-LD): contact, budget, ideas, fund-me, fund-me/success, team, llm-training-dashboard.
- The two blog ARTICLE routes (blog/ai-developer-perth, blog/best-developer-perth) were never converted — they stay classic already and are OUT of scope. Only /blog index is gated. They must STAY statically rendered — do NOT make the root layout read cookies (see constraints).
- `next.config.ts` has NO `output:'export'`; strict build is ON (ignoreBuildErrors removed in Phase 06-07) — tsc + lint errors DO fail `npm run build`.
- ThemeToggle uses localStorage + data-theme (separate system — do NOT touch it). Its `mounted`-guard (return null pre-hydration) is the pattern the launcher reuses.
- src/app/space/page.tsx is `"use client"` + `dynamic(() => import(".../SpaceExperience"), { ssr:false, loading: () => <ScenePoster variant="hero" /> })` inside `<main style={{background:"#05060a"}}>`. HARD CONSTRAINT: do NOT edit this file — create a NEW SpaceExperienceClient wrapper instead (tiny intentional duplication of the ssr:false boundary is the accepted cost of not editing /space).
- Root layout renders `{children}` then `<ConditionalFooter />` inside `<body>`; the footer is ALWAYS present via the layout. The launcher mounts here as a sibling floating island.
</facts_verified>
</context>

<constraints>
- ADDITIVE only. Reuse existing components by import. NO new npm dependencies (no playwright in package.json). Nothing deployed.
- Do NOT edit /space/page.tsx, the space engine leaf files (SpaceExperience, CameraRig, meshes, SpacePageShell), or shared widgets EXCEPT the integration points explicitly required here: `src/app/layout.tsx` (mount the global `<SpaceModeLauncher/>` in `<body>` — do NOT alter its metadata / JSON-LD / fonts / `<head>` / body structure) and `ShellHUD.tsx` + `SpaceHUD.tsx` (add the inline toggle-back button). These are the sanctioned integration surface.
- Do NOT edit `Navigation.tsx` or any restored per-page nav. The entry point is the global launcher, so per-route nav presence is irrelevant to reachability. The restored classic bodies keep whatever nav (or none) master had, verbatim.
- Classic bodies MUST be byte-identical to master (verbatim restore; do NOT refactor master's inline `const` data to import from `@/content/*`). Space-dive bodies MUST stay unchanged.
- Cookie contract (load-bearing): name `space-mode`; value `on`/`off`; `path=/`; `max-age≈31536000` to set, `max-age=0` to clear; `samesite=lax`; add `secure` on HTTPS; NEVER `httpOnly`.
- SSR-only PAGE mode decision. NEVER read `document.cookie` during client render to choose the PAGE mode (hydration mismatch). The launcher may read the cookie AFTER mount to govern ONLY its own visibility (chrome), never page content.
- Keep the root layout a STATIC server component. Do NOT call `cookies()`/`getSpaceMode()` inside layout.tsx — that would opt EVERY route (including the two static blog articles) out of static rendering. The launcher is a self-contained client island; the layout just mounts it.
- `cookies()` is async in Next 15 — `await` it; wrapper page functions become `async`. `ssr:false` only inside client components.
</constraints>

<tasks>

<task type="auto">
  <name>Task 1: Shared getSpaceMode() helper + global SpaceModeLauncher (root layout) + toggle-back in both HUDs</name>
  <files>src/lib/spaceMode.ts, src/components/SpaceModeLauncher.tsx, src/app/layout.tsx, src/components/three/space/ShellHUD.tsx, src/components/three/space/SpaceHUD.tsx</files>
  <action>
  1. Create `src/lib/spaceMode.ts` (SERVER-only — imports next/headers):
     ```ts
     import { cookies } from "next/headers";
     export const SPACE_COOKIE = "space-mode";
     export async function getSpaceMode(): Promise<boolean> {
       const store = await cookies();
       return store.get(SPACE_COOKIE)?.value === "on";
     }
     ```
  2. Create `src/components/SpaceModeLauncher.tsx` (`"use client"`) — the GLOBAL floating ENTER launcher. SSR-safe design (b) chosen: chrome-only, never gates page content, no hydration mismatch. Reuse the codebase `mounted`-guard convention (like ThemeToggle):
     ```tsx
     "use client";
     import { useState, useEffect } from "react";
     import { useRouter } from "next/navigation";
     export default function SpaceModeLauncher() {
       const [mounted, setMounted] = useState(false);
       const [inSpace, setInSpace] = useState(false);
       const router = useRouter();
       useEffect(() => {
         setInSpace(document.cookie.split("; ").some((c) => c === "space-mode=on"));
         setMounted(true);
       }, []);
       // Chrome only: render nothing until mounted (identical to SSR markup -> no hydration mismatch),
       // and hide when a fresh load lands in space mode (the space HUD owns the exit control).
       if (!mounted || inSpace) return null;
       const enter = () => {
         document.cookie = `space-mode=on; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax${
           location.protocol === "https:" ? "; secure" : ""
         }`;
         router.refresh();
       };
       return (
         <button onClick={enter} aria-label="Enter Space Mode" /* fixed bottom-right, tokenized */>
           Space Mode
         </button>
       );
     }
     ```
     Position it `fixed` bottom-right (e.g. `position:fixed; right:1rem; bottom:1rem; zIndex:50`) as a small pill styled ENTIRELY from the site tokens so it is theme-aware in both themes: background `var(--bg-elevated)` (or `var(--bg-card)`), text `var(--text-secondary)`, border `1px solid var(--border-default)` (hover `var(--border-hover)`), focus-visible ring `var(--accent-blue)`, `cursor-pointer`, `backdrop-blur-md`, rounded pill, small padding. Optionally add a mount-in fade using the `mounted` flag to match the site's chrome. CRITICAL: the launcher's cookie read decides ONLY its own visibility (chrome) AFTER mount — it NEVER decides the page render. PAGE mode is still decided SSR by `getSpaceMode()` in each wrapper. Because server + first client render both produce `null`, there is no hydration mismatch. Do NOT read document.cookie during render.
     ACCEPTED minor edge (do NOT "fix" it): if a user enters space via the launcher in the SAME session, the launcher (a persistent layout client island) may remain visible until the next full navigation — harmless (clicking it in space just re-sets the cookie + refresh). On FRESH space-page loads the mount-time cookie check correctly hides it, which is the common path. Do NOT hide it by making the root layout read cookies() (that forces every route dynamic — forbidden by constraints).
  3. Mount the launcher GLOBALLY in `src/app/layout.tsx` so it appears on EVERY route in classic mode (single sanctioned entry insertion point): add `import SpaceModeLauncher from "@/components/SpaceModeLauncher";` and render `<SpaceModeLauncher />` inside `<body>`, immediately AFTER `<ConditionalFooter />` (a sibling of the `#main-content` wrapper, so it floats above all page content). Additive ONLY — do not alter the metadata, JSON-LD `<script>` blocks, fonts, `<head>`, skip-link, `#main-content` wrapper, or footer. The root layout STAYS a static server component (the launcher is a self-contained client island; layout does NOT read cookies), so no route becomes dynamic from this change and the two static blog article routes stay static. Do NOT edit Navigation.tsx or any restored page nav.
  4. ShellHUD.tsx AND SpaceHUD.tsx: in the top-right toggles group (the `☾`/`♪` button row, ShellHUD ~line 220-235, SpaceHUD ~line 216-231), add ONE inline toggle-back button that clears the cookie and refreshes. To stay consistent with the plain-DOM HUD (which uses the inline `btn` style, not tokens), INLINE the logic rather than importing the launcher: add `import { useRouter } from "next/navigation";`, get `const router = useRouter();`, and a button using the existing `btn` style (color `#9aa1b2`) with onClick that sets `document.cookie = "space-mode=off; path=/; max-age=0; samesite=lax" + (location.protocol==="https:"?"; secure":"")` then `router.refresh()`. aria-label "Return to classic site". Label: a short glyph/text e.g. "◄ Classic". Do NOT touch the theme-accent/sound toggles or any rAF logic. The cookie NAME must be exactly `space-mode`.
  </action>
  <verify>
    <automated>npx tsc --noEmit && npm run lint</automated>
  </verify>
  <done>spaceMode.ts + SpaceModeLauncher.tsx exist and type-check; layout.tsx mounts `<SpaceModeLauncher/>` in `<body>` (renders site-wide, hidden only when a fresh load is in space mode); layout metadata / JSON-LD / fonts / head unchanged and layout stays a static server component; ShellHUD + SpaceHUD each render a cookie-clearing toggle-back button; tsc + lint clean. Navigation.tsx NOT edited. No existing behavior removed.</done>
</task>

<task type="auto">
  <name>Task 2: Restore + gate the 6 Type A (server) routes</name>
  <files>src/app/services/ServicesClassic.tsx, src/app/services/page.tsx, src/app/expertise/ExpertiseClassic.tsx, src/app/expertise/page.tsx, src/app/tech-stack/TechStackClassic.tsx, src/app/tech-stack/page.tsx, src/app/developer-australia/DeveloperAustraliaClassic.tsx, src/app/developer-australia/page.tsx, src/app/blog/BlogClassic.tsx, src/app/blog/page.tsx, src/app/projects/[id]/ProjectClassic.tsx, src/app/projects/[id]/page.tsx</files>
  <action>
  Routes: services, expertise, tech-stack, developer-australia, blog, projects/[id]. For EACH:
  1. `git show master:src/app/<route>/page.tsx` and save the body verbatim as `<Route>Classic.tsx` in the same directory (ServicesClassic, ExpertiseClassic, TechStackClassic, DeveloperAustraliaClassic, BlogClassic, ProjectClassic).
  2. Keep it a SERVER component — do NOT add "use client" (these are static JSX; some render the client `<Navigation/>` as a child, some render their own inline nav, and some — services, expertise, blog — render NO nav at all: restore EXACTLY as master, do not add or remove nav).
  3. STRIP from the Classic file (they already live in the wrapper): `export const metadata`, `export async function generateMetadata`, `export function generateStaticParams`, and any JSON-LD `<script type="application/ld+json">` blocks. Keep every visible JSX element and inline `const` data array EXACTLY as on master (verbatim — do NOT repoint master's inline arrays to `@/content/*`). Rename the default export to `<Route>Classic`. NOTE: tech-stack master has NO metadata/JSON-LD — strip nothing, just rename export. developer-australia has TWO JSON-LD blocks — strip both.
  4. projects/[id]: the classic body needs `project` data. Give `ProjectClassic` the SAME prop signature ProjectDive.tsx uses (mirror its `{ project }` prop and its `Project` type import exactly), and have the wrapper pass `<ProjectClassic project={project} />` just as it passes `<ProjectDive project={project} />`. Restore master's body to read from that prop (or from `getProject(id)` if master did so — match master).
  5. Gate each wrapper `page.tsx` (KEEP its existing metadata / generateMetadata / generateStaticParams / JSON-LD / sr-only): make the default export `async`, add `import { getSpaceMode } from "@/lib/spaceMode";` and `import <Route>Classic from "./<Route>Classic";`, then render:
     `const space = await getSpaceMode();` and return `space ? (<>{JSON-LD + sr-only(space-only) + <XDive/>}</>) : (<XClassic/>)`. Render JSON-LD in BOTH modes (structured data is mode-independent) but render the wrapper's `sr-only` crawl block ONLY in space mode (classic body is already crawlable — avoid duplicate copy). Follow the exact shape in RESEARCH section 1 (the ServicesPage example).
  NOTE (reachability): do NOT add a Space Mode entry control to any of these classic bodies. Some render no nav at all — that is correct and matches master. Space Mode entry is provided EXCLUSIVELY by the global `<SpaceModeLauncher/>` mounted in the root layout (Task 1), which is present on all of them regardless of nav.
  </action>
  <verify>
    <automated>npx tsc --noEmit && npm run lint && npm run build</automated>
  </verify>
  <done>6 `<Route>Classic.tsx` server files exist (verbatim master bodies, SEO exports stripped); 6 wrappers are async and render `getSpaceMode() ? Dive : Classic`; projects/[id] keeps generateStaticParams+generateMetadata in the wrapper and passes `project` to ProjectClassic; build succeeds (routes now dynamic ƒ — expected/acceptable). Classic files diff clean vs master body (minus stripped SEO exports).</done>
</task>

<task type="auto">
  <name>Task 3: Restore + gate the 7 Type B (client) routes</name>
  <files>src/app/contact/ContactClassic.tsx, src/app/contact/page.tsx, src/app/budget/BudgetClassic.tsx, src/app/budget/page.tsx, src/app/ideas/IdeasClassic.tsx, src/app/ideas/page.tsx, src/app/fund-me/FundMeClassic.tsx, src/app/fund-me/page.tsx, src/app/fund-me/success/SuccessClassic.tsx, src/app/fund-me/success/page.tsx, src/app/team/TeamClassic.tsx, src/app/team/page.tsx, src/app/llm-training-dashboard/DashboardClassic.tsx, src/app/llm-training-dashboard/page.tsx</files>
  <action>
  Routes: contact, budget, ideas, fund-me, fund-me/success, team, llm-training-dashboard. For EACH:
  1. `git show master:src/app/<route>/page.tsx` and save verbatim as the Classic file: ContactClassic, BudgetClassic, IdeasClassic, FundMeClassic, SuccessClassic (in fund-me/success/), TeamClassic, DashboardClassic (in llm-training-dashboard/).
  2. KEEP "use client" — these are interactive (emailjs forms, useState, canvas, Stripe). STRIP NOTHING (client pages never had metadata/JSON-LD). Keep their self-rendered `<Navigation/>` (where master had it) and all logic verbatim; llm-training-dashboard renders NO nav on master — keep it that way. Rename ONLY the default export to `<Route>Classic`.
  3. Gate each wrapper `page.tsx` (KEEP its existing server metadata + any sr-only block the branch added): make the default export `async`, add `import { getSpaceMode } from "@/lib/spaceMode";` + `import <Route>Classic from "./<Route>Classic";`, then `const space = await getSpaceMode();` and return `space ? (<>{sr-only(space-only) + <XDive/>}</>) : (<XClassic/>)`. A server wrapper rendering a client `<XClassic/>` child is fine. Render the wrapper's `sr-only` block only in space mode.
  4. NOTE fund-me/success and team wrappers currently have no metadata (they just import the Dive) — gating still applies: async + getSpaceMode + Classic/Dive branch.
  NOTE (reachability): do NOT add a Space Mode entry control to any classic body (e.g. llm-training-dashboard has no nav). Entry is the global root-layout `<SpaceModeLauncher/>` (Task 1) on every page.
  </action>
  <verify>
    <automated>npx tsc --noEmit && npm run lint && npm run build</automated>
  </verify>
  <done>7 `<Route>Classic.tsx` client files exist (verbatim master bodies, "use client" kept, nothing stripped, export renamed); 7 wrappers are async and render `getSpaceMode() ? Dive : Classic`; build succeeds. Classic files diff clean vs master (export name only).</done>
</task>

<task type="auto">
  <name>Task 4: Gate the homepage — HomeClassic + SpaceExperienceClient + server page wrapper</name>
  <files>src/app/HomeClassic.tsx, src/components/three/space/SpaceExperienceClient.tsx, src/app/page.tsx</files>
  <action>
  1. Move the CURRENT `src/app/page.tsx` body verbatim into `src/app/HomeClassic.tsx` (keep "use client"; it already renders `AISeoContent` + `Navigation` + Hero3D etc.). Rename the default export `Home` → `HomeClassic`. Do NOT change its content.
  2. Create `src/components/three/space/SpaceExperienceClient.tsx` — a NEW `"use client"` wrapper that reuses the space engine BY IMPORT without touching /space:
     ```tsx
     "use client";
     import dynamic from "next/dynamic";
     import ScenePoster from "@/components/three/ScenePoster";
     const SpaceExperience = dynamic(
       () => import("@/components/three/space/SpaceExperience"),
       { ssr: false, loading: () => <ScenePoster variant="hero" /> }
     );
     export default function SpaceExperienceClient() {
       return <main style={{ background: "#05060a" }}><SpaceExperience /></main>;
     }
     ```
     (This intentionally mirrors the body of /space/page.tsx so we do NOT edit /space. /space stays standalone.)
  3. Replace `src/app/page.tsx` with a SERVER wrapper (remove "use client"):
     ```tsx
     import { getSpaceMode } from "@/lib/spaceMode";
     import HomeClassic from "./HomeClassic";
     import AISeoContent from "@/components/AISeoContent";
     import SpaceExperienceClient from "@/components/three/space/SpaceExperienceClient";
     export default async function Home() {
       const space = await getSpaceMode();
       if (space) return (<><AISeoContent /><SpaceExperienceClient /></>);
       return <HomeClassic />;
     }
     ```
  Home JSON-LD / metadata / fonts in root `layout.tsx` stay UNCHANGED and apply to `/` in both modes — the ONLY edit to layout.tsx is Task 1's `<SpaceModeLauncher/>` mount; do not alter anything else in it. Classic already includes its own `AISeoContent`, so it is only added explicitly in the space branch. Entry to space from the classic homepage is the global launcher (Task 1), not the homepage's own Navigation.
  </action>
  <verify>
    <automated>npx tsc --noEmit && npm run lint && npm run build</automated>
  </verify>
  <done>HomeClassic.tsx holds the old homepage verbatim ("use client", export HomeClassic); SpaceExperienceClient.tsx exists (new, ssr:false, /space/page.tsx untouched); page.tsx is an async server wrapper rendering classic-or-space by cookie; build succeeds (/ now dynamic ƒ).</done>
</task>

<task type="auto">
  <name>Task 5: Author Playwright smoke script + run full hard gate</name>
  <files>.planning/quick/260702-mol-space-mode-toggle-classic-from-master-de/space-mode-toggle-smoke.mjs</files>
  <action>
  1. Author `space-mode-toggle-smoke.mjs` (ES module, `import { chromium } from "playwright"`) in the quick-task directory. It is ORCHESTRATOR-run later via a scratchpad Playwright install — the executor must NOT add playwright to package.json and must NOT `npm install` it. The script:
     - Takes BASE_URL from `process.env.BASE_URL || "http://localhost:3000"`.
     - For ~3 gated routes (`/services`, `/contact`, `/projects/kashmir-fund`) AND the homepage `/`, asserts the three SSR states:
       (a) DEFAULT (fresh context, NO cookie) → CLASSIC: page has NO `<canvas>` and the computed `--space-scroll` var is absent/empty (classic marker present, e.g. the classic real DOM).
       (b) Set cookie `space-mode=on` (path=/) via `context.addCookies`, reload the SAME url → DIVE: a `<canvas>` exists AND `getComputedStyle(document.documentElement).getPropertyValue("--space-scroll")` is present (non-empty), proving SSR read the cookie on first load.
       (c) Clear the cookie (`context.clearCookies()` or set max-age=0), reload → CLASSIC again (no canvas).
     - LAUNCHER CHECK (proves the global entry works on a NAV-LESS classic route): on `/services` (a classic page that renders NO in-page nav) in the DEFAULT/no-cookie state, wait for and assert the floating launcher button is present and visible — locate by `page.getByRole("button", { name: /Enter Space Mode/i })` or `page.locator('[aria-label="Enter Space Mode"]')`. Then CLICK it and assert the page transitions to DIVE (a `<canvas>` appears and `--space-scroll` becomes present), proving the root-layout launcher enters space mode WITHOUT relying on any page nav. Reset the context/cookie afterward.
     - Exit non-zero with a clear PASS/FAIL line per route/check on any failed assertion; exit 0 when all pass.
  2. Executor validation is `node --check` ONLY (syntax parse — it will not resolve the playwright import, which is expected/fine).
  3. Run the HARD gate over the whole change: `npx tsc --noEmit` (0 errors), `npm run lint` (0 new), `npm run build` (exit 0 — the 13 routes + `/` now render dynamic `ƒ`, which is expected and acceptable per RESEARCH pitfall 1/2; the two static blog ARTICLE routes must remain static, confirming the layout was NOT made dynamic). Report the results.
  </action>
  <verify>
    <automated>node --check ".planning/quick/260702-mol-space-mode-toggle-classic-from-master-de/space-mode-toggle-smoke.mjs" && npx tsc --noEmit && npm run lint && npm run build</automated>
  </verify>
  <done>smoke script exists and passes `node --check`; playwright is NOT in package.json; tsc clean, lint clean (0 new), build exit 0 with the gated routes shown as dynamic ƒ (blog articles still static). The script proves classic-default / cookie→dive / clear→classic on 3 routes + homepage AND that the global launcher is present on the nav-less /services classic page and clicking it enters space mode, when the orchestrator runs it.</done>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` → 0 errors introduced by this change.
- `npm run lint` → 0 new problems on touched files.
- `npm run build` → exit 0; the 13 gated routes + `/` are marked dynamic (`ƒ`) — expected (cookies() opts out of static prerender; projects/[id] generateStaticParams goes inert — acceptable per RESEARCH). The two static blog ARTICLE routes stay static — confirming layout.tsx was NOT made dynamic.
- `git diff master -- src/app/<route>/*Classic.tsx` conceptually equals the master body minus the stripped SEO exports (Type A) or minus only the export rename (Type B) — verbatim content.
- No new dependency in package.json (grep playwright → absent).
- /space/page.tsx, SpaceExperience, CameraRig, meshes, SpacePageShell unchanged (git diff empty for those). layout.tsx changes ONLY by mounting `<SpaceModeLauncher/>` in `<body>` (metadata/JSON-LD/fonts/head untouched); it stays a static server component (no cookies() in layout → no route forced dynamic by it). Navigation.tsx unchanged.
- Manual/orchestrator smoke (space-mode-toggle-smoke.mjs): default=classic (no canvas), cookie→dive (canvas + --space-scroll), clear→classic, on 3 routes + homepage; PLUS the global launcher is present on the nav-less /services classic page and clicking it enters space mode.
</verification>

<success_criteria>
- One server `getSpaceMode()` reads the `space-mode` cookie; every one of the 13 wrappers + `/` renders `getSpaceMode() ? Dive : Classic`.
- Classic default: no cookie → classic everywhere (bots get byte-identical SEO content).
- Cookie flip: `space-mode=on` renders the dive SSR on first load (no flash); the global floating launcher (mounted in the root layout, present on EVERY classic page incl. nav-less routes like /services, /expertise, /blog, /llm-training-dashboard) enters, HUD toggle-back clears.
- Additive + verbatim: 13 Classic bodies match master; space bodies + /space untouched; Navigation.tsx untouched; no new deps; nothing deployed.
- tsc + lint + build all green (gated routes dynamic ƒ expected; blog articles still static).
</success_criteria>

<output>
Quick task — no SUMMARY template required. Report the gate results (tsc/lint/build) and the smoke-script path. Commit only if the user asks.

Notes for the executor:
- Classic in-page nav is EXACTLY as on master: some classic routes render the shared `<Navigation/>`, others have their own inline nav (tech-stack, developer-australia, projects/[id]), and 4 render NO nav at all (services, expertise, blog, llm-training-dashboard). Restore verbatim — do NOT add or remove nav on any of them. This matches the real live classic site today. The footer is ALWAYS present via the root layout, and Space Mode entry does NOT depend on any page's nav: the global `<SpaceModeLauncher/>` in the root layout is the single entry point on every page.
- Context budget: Tasks 2 + 3 restore 13 verbatim bodies — heavy. If context gets tight, it is OK to CHECKPOINT after Task 3 and resume Tasks 4-5 in a fresh window (the hard gate re-runs anyway).
</output>
</parameter>
</invoke>
