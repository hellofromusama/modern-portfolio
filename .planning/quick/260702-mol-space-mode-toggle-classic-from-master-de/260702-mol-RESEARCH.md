# Quick Task: Site-wide "Space Mode" Toggle (classic = default, cookie flips to space) — Research

**Researched:** 2026-07-02
**Domain:** Next.js 15.5.12 App Router — cookie-driven SSR variant switching
**Confidence:** HIGH (verified against repo + stable Next 15 APIs; repo already uses the Next 15 async `params: Promise` pattern, confirming the runtime)

## Summary

Every route on `feature/space-scroll-prototype` has already been flipped to the space-dive version: each `page.tsx` is a server wrapper (metadata + JSON-LD + `sr-only` SEO) that renders `<XDive/>`. The homepage `/` is the **only** route still classic (it's a `"use client"` page; the space home lives at `/space`). `master` holds every original classic body.

The clean pattern: keep each `page.tsx` as a **server** wrapper, have it `await cookies()` to read a single `space-mode` cookie, and render `spaceMode ? <XDive/> : <XClassic/>`. Bots send no cookie → they always get the classic (default) render, so **SEO content is byte-identical to today's classic output**. The tradeoff: reading `cookies()` opts each route out of static prerender (○ → ƒ dynamic). For a portfolio's traffic this is negligible; it's the standard, correct cost of per-request personalization. The toggle button sets `document.cookie` then calls `router.refresh()` — no full reload, no white flash, and the next server render sees the new cookie.

**Primary recommendation:** Per-page `await cookies()` read via one shared `getSpaceMode()` helper; classic default; `document.cookie` + `router.refresh()` toggle; restore classic bodies from `master` as `<Route>Classic` components using the two recipes below. Do **not** use middleware rewrites or a layout provider — both are heavier and buy nothing here.

## User Constraints (from task brief)

- Classic pages (restored from `master`) are the **DEFAULT**; a cookie flips the whole site to the space-dive versions already built.
- SSR must read the cookie so the correct version renders on first load (no client-only decision).
- Do NOT write app code in this research — snippets + recipe + recommendation only.
- CLAUDE.md: Karpathy guidelines (surgical, minimal, verbatim content restore, no refactors). `tsc --noEmit` + `lint` + `build` are the gate (build alone passes with errors — `ignoreBuildErrors` is now OFF after Phase 06-07, so type errors DO fail the build again). Additive-only; zero content deletion. Both-theme smoke required.

## 1. Cookie-driven classic/space SSR switch

**One shared helper** (server-only), e.g. `src/lib/spaceMode.ts`:

```ts
import { cookies } from "next/headers";

export const SPACE_COOKIE = "space-mode";

// Next 15: cookies() is ASYNC — must await. No cookie (bots, first visit) => false => classic.
export async function getSpaceMode(): Promise<boolean> {
  const store = await cookies();
  return store.get(SPACE_COOKIE)?.value === "on";
}
```

**Each server wrapper** (services shown; identical shape for blog/expertise/etc.):

```tsx
import type { Metadata } from "next";
import { getSpaceMode } from "@/lib/spaceMode";
import ServicesDive from "./ServicesDive";
import ServicesClassic from "./ServicesClassic";
import { services, processSteps } from "@/content/services";

export const metadata: Metadata = { /* …unchanged… */ };

export default async function ServicesPage() {          // now async
  const space = await getSpaceMode();
  const serviceSchema = { /* …unchanged JSON-LD… */ };

  return (
    <>
      {/* JSON-LD renders in BOTH modes — structured data is mode-independent */}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {space ? (
        <>
          {/* sr-only crawl copy ONLY in space mode — classic already has real crawlable DOM */}
          <div className="sr-only">{/* …existing sr-only block… */}</div>
          <ServicesDive />
        </>
      ) : (
        <ServicesClassic />
      )}
    </>
  );
}
```

**Dynamic-rendering / SEO / caching impact (quantified):**
- `await cookies()` forces the route from static (○) to **dynamic (ƒ)** — rendered per request in a serverless function on Vercel instead of served as prebuilt HTML. Full-page CDN/static caching is lost; expect slightly higher TTFB + occasional cold starts. At this site's traffic this is immaterial.
- **Crawlability is preserved.** Googlebot/Bingbot/AI crawlers send **no `space-mode` cookie** → `getSpaceMode()` returns `false` → the classic body renders → the HTML a bot receives (metadata, JSON-LD, visible copy, `sr-only`) is the same content shipped today. Google does not penalize dynamic rendering; `generateMetadata`/`metadata` still run server-side.
- `projects/[id]` uses `generateStaticParams` (12 slugs SSG). Adding `cookies()` makes it dynamic and **`generateStaticParams` stops emitting static pages** (no error, just no prebuild). Flag; acceptable.
- **`output: 'export'` is NOT set** (verified — `grep output next.config.ts` = 0). Good: `cookies()` is incompatible with static export. Do not add `output:'export'` while this feature exists.

**Lighter alternatives (compared, rejected):**
| Approach | Verdict |
|----------|---------|
| **Per-page `cookies()`** (recommended) | Surgical, one helper, SSR-correct, bots get classic. Cost: routes go dynamic. |
| **Middleware rewrite** (`/services` → space route group by cookie) | Needs a parallel `(space)` route tree — duplicate structure, more moving parts. Still forces dynamic. No benefit. Reject. |
| **Root `layout.tsx` cookie + Context provider** | A layout can't choose which *page* component renders; page still needs the decision. Reading `cookies()` in layout makes the whole subtree dynamic anyway. Reject. |
| **PPR (Partial Prerendering)** | Could keep a static shell + dynamic cookie island → preserves static for bots. But experimental in 15.x. Note as future optimization only. |

## 2. The toggle button (no flash)

**Winner: `document.cookie` + `router.refresh()`** — no full reload, no white flash. `router.refresh()` refetches the current route's RSC payload; because the cookie was set synchronously first, the refresh request carries it, the server re-renders the *other* mode, and React reconciles the subtree in place (the Dive's `ssr:false` `ScenePoster` paints instantly under the loading canvas). A Route Handler + `window.location.reload()` also works but causes a full-document reload = visible flash — reject.

```tsx
"use client";
import { useRouter } from "next/navigation";

const SPACE_COOKIE = "space-mode";
function writeSpaceCookie(on: boolean) {
  const secure = location.protocol === "https:" ? "; secure" : "";
  // path=/ is REQUIRED so the choice applies site-wide; max-age=0 clears it (back to classic default)
  document.cookie =
    `${SPACE_COOKIE}=${on ? "on" : "off"}; path=/; max-age=${on ? 60 * 60 * 24 * 365 : 0}; samesite=lax${secure}`;
}

export default function SpaceModeButton({ enter }: { enter: boolean }) {
  const router = useRouter();
  return (
    <button
      onClick={() => { writeSpaceCookie(enter); router.refresh(); }}
      aria-label={enter ? "Enter Space Mode" : "Return to classic site"}
    >
      {enter ? "Space Mode" : "Classic"}
    </button>
  );
}
```

**Placement:**
- **Classic `Navigation.tsx`** (already `"use client"`): drop `<SpaceModeButton enter />` into the desktop cluster next to `<ThemeToggle />` (around line 232) and into the mobile menu's theme row (around line 305). Style with tokens to match nav links.
- **Space HUD** (`ShellHUD.tsx` line ~219-235 and `SpaceHUD.tsx` line ~215-231, both `"use client"`): add a toggle-back control (`enter={false}`) in the top-right toggles group beside the theme/sound buttons, using the existing inline `btn` style. Clearing the cookie (`max-age=0`) returns the whole site to classic.

Both HUDs already `useState`/`useRef`; just add `import { useRouter } from "next/navigation"` and reuse the helper (or inline the two lines to avoid a shared client import in the plain-DOM HUD).

## 3. Restoring classic bodies from master — per-type recipe

Mechanics: `git show master:src/app/<route>/page.tsx` → save the visual JSX + local data **verbatim** as `<Route>Classic.tsx`. What you strip differs by original type.

### Type A — was a SERVER page (had its own `metadata`/JSON-LD/`generateMetadata`)
Routes: **services, expertise, blog, blog/ai-developer-perth, blog/best-developer-perth, developer-australia, tech-stack, projects/[id]**.
1. `git show master:src/app/services/page.tsx > src/app/services/ServicesClassic.tsx`.
2. **Keep it a server component — do NOT add `"use client"`.** These bodies are static JSX (they render the client `<Navigation/>` as a child, which is legal from a server component). No hooks.
3. **Strip:** `export const metadata`, `export async function generateMetadata`, `generateStaticParams`, and any JSON-LD `<script>` blocks — those already live in the wrapper `page.tsx` (verified present on branch). Keep the visible JSX + inline `const` data arrays exactly as on master (verbatim restore; do not refactor master's inline `services` array to import from `@/content/*` — minimal-change).
4. Rename the default export to `ServicesClassic`.
5. `projects/[id]`: the classic body took `project` data — restore it to read from `getProject(id)` the same way the wrapper already does, or have the wrapper pass `project` as a prop (`<ProjectClassic project={project} />`), mirroring how it already passes `<ProjectDive project={project} />`. Keep `generateStaticParams`/`generateMetadata` in the **wrapper** (aware they go inert once `cookies()` is added — see Pitfall 2).

### Type B — was a CLIENT page (`"use client"`, no metadata, self-renders `<Navigation/>`)
Routes: **budget, ideas, fund-me, fund-me/success, contact, team, llm-training-dashboard**.
1. `git show master:src/app/contact/page.tsx > src/app/contact/ContactClassic.tsx`.
2. **Keep `"use client"`** — these are interactive (emailjs form, `useState`, canvas). They MUST stay client.
3. **Nothing to strip** — client pages never had `metadata`. Keep their self-rendered `<Navigation/>` and all logic verbatim.
4. Rename the default export to `ContactClassic`.
5. The branch wrapper `page.tsx` is already a **server** component that added a *new* page-level `metadata` + `sr-only` (a bonus classic never had). It renders `space ? <ContactDive/> : <ContactClassic/>`. A server wrapper rendering a client `ContactClassic` child is fine.

**Rule of thumb:** Type A classic = server, strip SEO exports. Type B classic = client, strip nothing.

## 4. Homepage `/` special case

Current `src/app/page.tsx` = classic client home (Hero3D + sections + `Navigation` + `AISeoContent`). Space home = the `/space` experience (`SpaceExperience`). Heavy home SEO/JSON-LD lives in **root `layout.tsx`** (7 schemas) — leave it there, unchanged; it applies to `/` in both modes.

Recipe:
1. Move today's `src/app/page.tsx` body → `src/app/HomeClassic.tsx` (`"use client"`, unchanged — it already renders `AISeoContent`).
2. Extract the tiny space client wrapper (the `dynamic(() => import(".../SpaceExperience"), { ssr:false, loading: ScenePoster })` + `<main>`) — it already exists as the body of `src/app/space/page.tsx`. Reuse it as a shared `SpaceExperienceClient` used by both `/space/page.tsx` and the home wrapper (avoids duplicating the `ssr:false` boundary).
3. New `src/app/page.tsx` = **server** wrapper (remove `"use client"`):

```tsx
import { getSpaceMode } from "@/lib/spaceMode";
import HomeClassic from "./HomeClassic";
import AISeoContent from "@/components/AISeoContent";
import SpaceExperienceClient from "@/components/three/space/SpaceExperienceClient";

export default async function Home() {
  const space = await getSpaceMode();
  if (space) return (<><AISeoContent /><SpaceExperienceClient /></>); // sr-only crawl copy in space mode
  return <HomeClassic />;                                              // classic already includes AISeoContent
}
```

- `/space` stays a standalone route (its own `noindex` layout is scoped to that segment only — verified). The `noindex` does **not** leak to `/`; `/` keeps its indexable root-layout metadata. And since bots get classic at `/`, `/` is always crawled as the classic home.
- `/` becomes dynamic (cookies). Home was already effectively client-rendered (`Hero3D` is `dynamic ssr:false`), so this is not a meaningful perf change; root-layout metadata still SSRs.

## 5. Pitfalls (enumerated)

1. **Dynamic-rendering cost.** All toggled routes go ○→ƒ: per-request serverless render, no full-page CDN cache, slightly higher TTFB / cold starts. Fine for this traffic. Mitigation if ever needed: PPR (experimental) or route cache headers.
2. **`generateStaticParams` goes inert** on `projects/[id]` once `cookies()` is added — no build error, but no prebuilt slugs. Expected.
3. **Cookie attributes are load-bearing.** Name `space-mode`; **`path=/`** (site-wide — omitting it is the classic "toggle doesn't stick across routes" bug); `max-age≈31536000` to persist, `max-age=0` to clear; `samesite=lax`; add `secure` on HTTPS; **never `httpOnly`** (client must set it via `document.cookie`; the server only reads it).
4. **Hydration mismatch.** The server decides the mode from the cookie and emits that HTML; the client hydrates the *same* HTML. **Never read `document.cookie` during client render to decide the mode** — that produces server≠client output → hydration error + flash. The only client action is set-cookie-then-`router.refresh()`. Keep the decision server-only.
5. **`cookies()` is async in Next 15** — must `await`; a missing `await` returns a Promise and silently mis-evaluates. Wrapper page functions become `async`.
6. **Wrapper must be a server component.** The home classic page is `"use client"` and cannot call `cookies()`. The new `page.tsx` wrapper must be server (no `"use client"`); the classic body moves to its own client file. Same for every Type B route (wrapper server, classic body client child).
7. **`ssr:false` boundary.** `dynamic(..., { ssr:false })` is legal only inside a client component — the Dive/`SpaceExperienceClient` wrappers already are `"use client"`. Do not put `ssr:false` in the server wrapper; just render `<XDive/>`.
8. **No static export.** `output:'export'` is absent (good) and must stay absent — it's incompatible with `cookies()`.
9. **`sr-only` duplicate content.** Render the wrapper's `sr-only` block **only in space mode**; in classic mode the visible DOM is already crawlable, so emitting both duplicates copy to bots.
10. **Two independent toggles.** Theme = `localStorage` + `data-theme` attribute (client-applied, no SSR dependency). Space = **cookie** (SSR needs it on first render). Keep them separate — do not "unify" space into localStorage (SSR can't read localStorage) nor theme into a cookie (unnecessary, and would make every route dynamic for theme too).
11. **`router.refresh()` resets space scroll/HUD.** Switching modes remounts the subtree; the `--space-scroll` var and camera reset to 0. Acceptable; note in UX.
12. **Build gate is strict now.** `typescript.ignoreBuildErrors` was removed in Phase 06-07 — `async` page signatures and the new imports must be genuinely type-clean or `npm run build` fails. Run `tsc --noEmit` + `lint` + `build` + both-theme smoke.

## Environment Availability

Code-only change; no new external dependencies. `next@15.5.12`, React 19.2.4, no middleware present (verified). No new packages required.

## Validation (nyquist enabled — no test framework in repo)

No test framework exists (CLAUDE.md confirms). Validation = the project's standing gate: `npx tsc --noEmit` (0 new errors), `npm run lint` (0 new), `npm run build` (exit 0, dynamic routes render), plus manual smoke: (a) default load = classic on every route (curl with no cookie); (b) `space-mode=on` cookie = dive renders SSR'd on first load; (c) toggle in nav enters space with no reload/flash; (d) toggle-back in HUD clears cookie → classic; (e) both themes; (f) a Playwright smoke already exists from task 260702-j59 — extend it with a cookie-set + toggle assertion.

## Sources

- **Repo (HIGH):** `src/app/**` (branch wrappers already server + `<XDive/>`), `master` classic bodies via `git show`, `next.config.ts` (no `output`, no middleware), `package.json` (`next ^15.5.12`), `src/app/space/page.tsx` + `layout.tsx` (client `ssr:false` wrapper + scoped `noindex`), `projects/[id]/page.tsx` (`params: Promise` = confirmed Next 15 async runtime).
- **Next.js 15 App Router (HIGH, stable):** `cookies()` is async and opts routes into dynamic rendering; `useRouter().refresh()` refetches server components with the current request cookies and reconciles without a full reload. Consistent with the repo's existing async-`params` usage.

## Metadata

- Cookie SSR switch: **HIGH** — direct, documented Next 15 behavior; repo already on the Next 15 async runtime.
- Toggle no-flash mechanism: **HIGH** — `document.cookie` + `router.refresh()` is the standard pattern.
- Restore recipes: **HIGH** — derived from actual `master` vs branch diffs inspected here.
- Dynamic-render perf magnitude: **MEDIUM** — qualitatively certain; exact TTFB numbers not benchmarked.

**Valid until:** ~30 days (stable APIs).
