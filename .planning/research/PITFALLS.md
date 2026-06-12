# Pitfalls Research

**Domain:** Adding heavy 3D/WebGL + motion UI to an existing production Next.js 15 App Router site with live SEO equity
**Researched:** 2026-06-12
**Confidence:** HIGH (project-specific pitfalls grounded in CONCERNS.md; ecosystem pitfalls verified against Next.js docs + Core Web Vitals 2026 guidance)

> Scope note: This is a brownfield "wow-factor upgrade" on a LIVE, indexed site (usamajaved.com.au). The dominant failure mode is **regression** — breaking ranked pages, CWV, or working flows in pursuit of polish — not greenfield mistakes. Pitfalls below are ordered by blast radius.

## Critical Pitfalls

### Pitfall 1: WebGL/Canvas mounts during SSR → hydration mismatch white-screens a ranked page

**What goes wrong:**
`three` and `@react-three/fiber` touch browser-only globals (`window`, `document`, `WebGLRenderingContext`) at import/render time. Rendered inside an App Router Server Component or a `'use client'` component that still server-renders, you get "Text content does not match server-rendered HTML" hydration errors — or a hard crash. Because there are **no error boundaries** in this repo (`CONCERNS.md`: no `error.tsx`/`global-error.tsx`/`not-found.tsx`), a single throw white-screens the entire route — including indexed blog/SEO pages.

**Why it happens:**
Developers drop `<Canvas>` straight into a page and assume `'use client'` is enough. It isn't — `'use client'` components still render on the server for the initial HTML. The R3F `<Canvas>` and any WebGL renderer must be excluded from SSR entirely.

**How to avoid:**
- Load every R3F tree via `next/dynamic(() => import('./Scene'), { ssr: false })`, with the importing wrapper marked `'use client'`. The Canvas file itself is `'use client'`.
- Provide a non-WebGL `loading`/fallback (static poster image or the current Canvas-2D frame) so the SSR HTML and first paint are never empty — this also protects LCP (Pitfall 3).
- Add `error.tsx` (route-level) and `global-error.tsx` so a WebGL failure degrades to a fallback instead of a white screen. This is a milestone gap already flagged in CONCERNS.md — treat it as a hard prerequisite for shipping 3D.
- Wrap each 3D component in its own error boundary so one failed canvas never takes down the page chrome or below-fold SEO content.

**Warning signs:**
"Hydration failed" / "did not match" console errors; flashes of empty space then pop-in; `ReferenceError: window is not defined` in `next build` or Vercel build logs; the page works in dev (client nav) but crashes on hard refresh / from Googlebot's cold load.

**Phase to address:** Foundation phase (error boundaries + dynamic-import 3D wrapper pattern) — must land **before** any component gets a WebGL upgrade.

---

### Pitfall 2: Three.js bundle bloat regresses LCP/INP on every page and tanks CWV-driven rankings

**What goes wrong:**
`three` is ~150KB+ gzipped before R3F, drei, and post-processing. Pulled into the shared/client bundle (or imported eagerly from a layout-level component), it inflates JS on **every route**, including text pages that never show 3D. More JS on the main thread = slower LCP and worse INP. With INP being the most-failed Core Web Vital in 2026 (≥200ms threshold) and Google using CWV as a ranking signal, this directly threatens the site's existing SEO equity.

**Why it happens:**
A `<Hero3D>` imported by the homepage that statically imports three; a shared `<Navigation>` or `<Footer>` that accidentally pulls a motion/3D helper into the common chunk; drei convenience imports (`import { OrbitControls, Environment, ... } from '@react-three/drei'`) that drag in large subsystems; barrel-file imports that defeat tree-shaking. Bundle cost is invisible in dev (unminified, cached) and only shows up in field data weeks later.

**How to avoid:**
- Dynamic-import all 3D with `{ ssr: false }` so three lands in a **route-specific** chunk, never the shared bundle. Verify which routes actually ship three.
- Import drei/three submodules narrowly; avoid `examples/jsm` barrels. Audit with `@next/bundle-analyzer` and set a budget (e.g. homepage client JS delta < X KB).
- Keep `motion` (Framer/`motion` v12) tree-shakeable — prefer `m` + `LazyMotion` with `domAnimation` features over the full `motion` import, especially in components used site-wide (Navigation, Footer, cards).
- Treat text/SEO routes (blog posts, expertise, services) as a **no-WebGL zone** — they get CSS/motion polish only, not three.
- Lab-test with Lighthouse AND check field data (CrUX / Search Console Core Web Vitals report) before and after; lab green can still mean field regression.

**Warning signs:**
`First Load JS shared by all` growing in `next build` output; bundle-analyzer showing three/drei in the common chunk or on text routes; Lighthouse TBT/INP climbing; Search Console "Core Web Vitals" report moving URLs from Good → Needs Improvement after deploy.

**Phase to address:** The phase introducing three/R3F — gate it on a bundle-budget check; re-verify in every subsequent visual phase.

---

### Pitfall 3: 3D/animated hero steals the LCP slot → LCP blows past 2.5s on the most important page

**What goes wrong:**
The hero is usually the LCP element. Replacing a fast static/Canvas-2D hero with a WebGL scene that needs three to download, parse, compile shaders, and render the first frame pushes LCP well past the 2.5s "Good" threshold — on the homepage, the page that matters most for recruiters and ranking. CLS also spikes if the canvas reflows content when it finally mounts.

**Why it happens:**
"Lazy load the hero" instinct backfires — the LCP element must be prioritized, not deferred. Devs defer the whole 3D scene with no reserved space or poster, so the browser has nothing to paint as LCP until WebGL is ready, and layout shifts when it arrives.

**How to avoid:**
- Render an immediate, lightweight LCP element: a real `next/image` poster (with `priority`/`fetchpriority="high"`) or a CSS/gradient hero that paints instantly; mount WebGL **on top** afterward as enhancement.
- Reserve exact dimensions for the canvas container (fixed aspect/height) so 3D mounting causes **zero** CLS.
- Cap and defer shader/particle work so first meaningful paint isn't blocked on heavy GPU init.
- Measure LCP element identity in Lighthouse — confirm the LCP is the poster/text, not the canvas.

**Warning signs:**
Lighthouse reports the `<canvas>` as the LCP element; LCP > 2.5s on `/`; CLS > 0.1 on hero mount; visible "jump" when the 3D scene appears.

**Phase to address:** Hero/homepage upgrade phase — LCP and CLS budgets in the phase's success criteria.

---

### Pitfall 4: Content centralization silently drops or drifts existing entries (SEO + JSON-LD regression)

**What goes wrong:**
Content today is duplicated 4 ways (page.tsx, projects/[id]/page.tsx, layout JSON-LD, sitemap.ts; skills in page.tsx + expertise). Centralizing into one `src/data/` source while simultaneously **appending 5 AI projects + AI skills** is the milestone's #1 maintenance risk (per PROJECT.md). A copy-paste consolidation easily loses an entry, alters a slug, or changes JSON-LD shape — which breaks indexed URLs, Rich Results, and the sitemap. Owner mandate is **additive only, entries preserved verbatim**; a dropped project or changed `projects/[id]` slug is a same-day-rollback offense (a prior rebuild was already rolled back).

**Why it happens:**
Manual reconciliation of 4 divergent sources has no safety net — there are **no tests** and `ignoreBuildErrors: true` masks type drift. "It builds" ≠ "all 12 projects and every skill survived with identical slugs and JSON-LD."

**How to avoid:**
- Snapshot the **current** rendered output first: list every project id/slug, every skill string, and dump the 7 layout JSON-LD blocks and `sitemap.ts` URLs as a baseline artifact before refactoring.
- Build the centralized data model, then **diff** generated JSON-LD / sitemap / slug list against the baseline — require zero deletions/changes to existing entries (new AI entries are additive deltas only).
- Type the data source strictly and run `npx tsc --noEmit` (build won't catch it). Validate JSON-LD with Google Rich Results Test after the change.
- Confirm `generateStaticParams`/`generateMetadata` for `projects/[id]` still emits every existing id (also a flagged bug to fix here).

**Warning signs:**
Project/skill count drops vs. baseline; a `projects/[id]` URL 404s; Rich Results test loses a schema type; sitemap URL set shrinks; Search Console "Pages" report shows newly-excluded URLs after deploy.

**Phase to address:** Content-centralization phase — baseline-and-diff gate is the phase's definition of done.

---

### Pitfall 5: Animations never pause off-screen + ignore `prefers-reduced-motion` → battery drain, thermals, jank, accessibility failure

**What goes wrong:**
All three current canvases run `requestAnimationFrame` forever even when scrolled away, none honor `prefers-reduced-motion` (CONCERNS.md). Upgrading to WebGL multiplies the cost: continuous GPU work off-screen drains mobile batteries, heats phones (thermal throttling degrades the whole page's INP), and burns desktop CPU/GPU. Ignoring reduced-motion is a WCAG 2.3.3 / motion-sickness accessibility failure and a vestibular-trigger risk.

**Why it happens:**
RAF loops are mounted once and forgotten; `IntersectionObserver` gating and a reduced-motion branch are "polish" that gets skipped under deadline. The cost is invisible on a dev desktop with a discrete GPU.

**How to avoid:**
- Standardize one hook/wrapper that (a) pauses the RAF loop via `IntersectionObserver` when the canvas is off-screen and resumes on re-entry, and (b) renders a **single static frame / poster** and disables the loop entirely when `prefers-reduced-motion: reduce`.
- Also pause on `document.visibilitychange` (background tab) and respect a coarse-pointer/mobile budget (lower particle counts, cap DPR at 2 — already flagged uncapped-DPR perf bugs).
- This is called out as "the single highest-leverage perf+a11y fix" — make it a shared primitive, not per-component reinvention.

**Warning signs:**
Phone gets hot / fan spins on the page; battery stats show the tab as high-drain; DevTools Performance shows RAF firing while canvas is off-screen; enabling OS "reduce motion" still animates; INP worse on mid-tier Android than desktop.

**Phase to address:** Foundation/animation-primitive phase — build the pause+reduced-motion wrapper before mass component upgrades; every upgraded component must consume it.

---

### Pitfall 6: Accessibility regressions — unlabeled canvases, keyboard traps, contrast failures, motion with no escape

**What goes wrong:**
"World-class UI" that fails WCAG. Current gaps (CONCERNS.md): canvases lack `aria-hidden`/`role`, `InteractiveGlobe` is drag-only with no keyboard path, low-contrast `--text-faint`/10–11px labels likely fail AA, no skip-to-content link. WebGL/motion upgrades typically make these worse — more decorative animation, more pointer-only interaction, lower-contrast "moody" palettes — turning a polish milestone into an accessibility regression that also hurts SEO (accessibility and CWV both feed page experience).

**Why it happens:**
Visual ambition optimizes for screenshots, not screen readers or keyboards. Designers chase low-contrast aesthetics; interaction is prototyped mouse-first.

**How to avoid:**
- Mark all decorative canvases `aria-hidden="true"`; give meaningful ones `role="img"` + label. Add a skip-to-content link in layout.
- Any pointer-driven interactive 3D (globe) needs a keyboard-operable alternative or must be demoted to non-interactive decoration — no keyboard traps, visible focus states preserved.
- Enforce WCAG AA contrast on the new palette in **both** themes (CSS-variable theming — Pitfall 7); audit `--text-faint` and small uppercase labels specifically.
- Respect reduced-motion (Pitfall 5) and ensure no essential content is conveyed only via motion.

**Warning signs:**
axe/Lighthouse a11y score drops; keyboard-only tab-through skips or traps on globe/interactive elements; contrast checker fails on faint text; screen reader announces bare "canvas".

**Phase to address:** Each component-upgrade phase carries an a11y check; a dedicated a11y-hardening pass before deploy.

---

### Pitfall 7: WebGL doesn't read CSS custom properties → 3D ignores theme toggle, breaks in one mode

**What goes wrong:**
Theming is `data-theme` + CSS custom properties (`--bg-*`, `--text-*`), NOT Tailwind `dark:`. WebGL materials/shaders take numeric colors, not CSS variable strings — `new THREE.Color('var(--bg-primary)')` silently fails. Result: the 3D scene is hardcoded to one theme and looks broken (invisible, wrong, or low-contrast) in the other, undermining the theme toggle and creating contrast failures (Pitfall 6) in light mode.

**Why it happens:**
Devs hardcode hex colors in materials during dev (in dark mode), never test the toggle, and there's no automatic bridge from CSS variables into WebGL.

**How to avoid:**
- Read resolved theme tokens at runtime via `getComputedStyle(document.documentElement).getPropertyValue('--x')`, feed them into `THREE.Color`, and **re-read + update materials on `data-theme` change** (observe the attribute or subscribe to the existing theme state).
- Keep a single theme→3D color map so both themes are defined explicitly; smoke-test every 3D scene in BOTH light and dark (already a milestone verification requirement).
- Avoid per-frame `getComputedStyle` (layout thrash) — read on theme change only and cache.

**Warning signs:**
Scene looks great in dark, washed-out/invisible in light (or vice versa); toggling theme doesn't change 3D colors; `THREE.Color` warnings about unparseable color; per-frame style reads in the profiler.

**Phase to address:** The phase wiring 3D theming; verification = manual smoke in both themes per phase (existing gate).

---

### Pitfall 8: Verification theater — `next build` passes while everything is broken

**What goes wrong:**
`next.config.ts` sets `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`. A green `next build` proves nothing about types, lint, or correctness. Combined with zero tests, the team ships type errors (e.g. the masked Stripe `apiVersion` mismatch), broken JSON-LD, dropped content, or a hero that crashes from Googlebot's cold load — and only finds out from rankings/field data.

**Why it happens:**
"Build passed → ship it" is the natural heuristic, and it's actively wrong here. The masking flags make the one available gate meaningless for correctness.

**How to avoid:**
- Per-phase gate (per PROJECT.md): `npx tsc --noEmit` + `npm run lint` + `npm run build` + **manual smoke in both themes** + hard-refresh test (not just client nav) of `/`, a blog post, `/projects/[id]`, `/contact`, `/fund-me`.
- Run `npm ci` first (`node_modules` not installed locally; lockfile-faithful install).
- Add at least Playwright smoke tests for the critical routes during the milestone; verify JSON-LD via Rich Results Test and CWV via Lighthouse + Search Console.
- Burn down errors and re-enable the ignore flags as an end-state goal.

**Warning signs:**
Reliance on "build is green"; no `tsc`/lint in the loop; bugs only found in production; `test-apis`/Stripe type errors resurfacing.

**Phase to address:** Every phase (it's the verification protocol); a hardening phase to re-enable strict build.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Static-import three into a component | Less wiring | three lands in shared bundle, regresses CWV on all routes | Never — always `dynamic({ ssr: false })` |
| Hardcode hex colors in 3D materials | Fast to prototype | Breaks theme toggle, light-mode contrast fails | Only in throwaway spikes, never shipped |
| Skip IntersectionObserver pause "for now" | Ship sooner | Battery/thermal drain, INP regression, a11y fail | Never on mobile-first site |
| Manual copy-paste content centralization | No tooling needed | Silent entry loss / slug drift / JSON-LD break = rollback | Never — baseline-and-diff required |
| Leave `ignoreBuildErrors: true` on | Builds stay green | Type/lint/SEO breakage ships silently | Tolerable mid-milestone IF `tsc`+lint run manually; re-enable strict before done |
| Full `motion` import in shared components | Simpler imports | Bundle bloat on every route | Only in a single isolated 3D route; use `LazyMotion` elsewhere |
| Defer the hero entirely (lazy LCP) | Smaller initial JS | LCP > 2.5s, CLS spike on homepage | Never for the LCP element — poster + reserved space instead |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `@react-three/fiber` v9 + Next 15 App Router | Rendering `<Canvas>` server-side; assuming `'use client'` disables SSR | `next/dynamic(..., { ssr: false })` + client fallback poster |
| React 19.2.4 | Pulling R3F/motion versions that predate React 19 support | R3F v9 + motion v12 only (PROJECT constraint); verify peer deps before install |
| CSS-variable theming → WebGL | `THREE.Color('var(--x)')` | Resolve via `getComputedStyle`, re-read on `data-theme` change |
| `next/image` for new posters | Domain not in config; `images.domains` deprecated + wrong host (`usamajaved.com` vs `.com.au`) | Fix `remotePatterns` with correct host before adding remote images |
| JSON-LD after content refactor | Trusting build; shape drifts | Diff against baseline + Google Rich Results Test |
| Stripe v18 (fund-me, untouched-but-fragile) | Restyling fund-me trips the masked `apiVersion` type error | Test checkout in Stripe test mode after any fund-me UI change; don't touch `apiVersion` casually |
| IndexNow / `public/` SEO files | Renaming/moving an indexed public file or route | Treat all `public/` filenames + route paths as frozen contracts; add alongside, never rename |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Uncapped DPR on 3D | Phone renders 9x pixels at dpr-3, melts | Cap DPR at 2 (already done in IdeaNetworkCanvas) | Any high-DPI / mobile device |
| Per-frame gradient/object allocation | GC pauses, INP jank | Precompute/cache gradients & geometries; reuse on resize only | Mid-tier mobile, long sessions |
| O(n²) particle/connection loops per frame | Frame time climbs with node count | Spatial grid / precomputed neighbor lists (init already builds one, then ignores it) | More particles, smaller devices |
| RAF runs off-screen / in background tab | Battery drain, thermal throttle of whole page | IntersectionObserver + visibilitychange pause | Always on long pages / mobile |
| three in shared bundle | All routes slow, INP fails | Route-level dynamic import + bundle budget | Immediately, site-wide |
| Lab-green / field-red CWV | Lighthouse passes, Search Console regresses | Check CrUX/Search Console field data, not just Lighthouse | Weeks after deploy, in rankings |

## Security Mistakes

(Carried from CONCERNS.md — "fix in passing" per PROJECT.md, not the milestone's focus, but restyling these files is the moment to guard them.)

| Mistake | Risk | Prevention |
|---------|------|------------|
| Restyle `/test-apis` UI, leave `/api/test-openai` open | Unauthenticated paid-OpenAI proxy + leaks key prefix (`keyUsed.substring(0,10)`) | Gate behind admin token / `NODE_ENV!=='production'`; remove `keyUsed` field — keep route (owner: remove nothing) |
| Touch VisitorTracker visuals, leave fan-out | Client-triggered AI training routes = API spend scales with traffic/bots | Move to server-side cron; add per-IP rate limit; wrap `JSON.parse` in try/catch |
| Restyle contact form, leave `/api/send-email` raw | HTML injection into email + spam relay; hardcoded EmailJS public key abuse | Escape input, validate payload, rate-limit; move EmailJS IDs to `NEXT_PUBLIC_*` + domain allowlist |
| Loosen `dangerouslyAllowSVG` CSP during UI work | Reopens SVG-via-optimizer risk | Do NOT loosen the strict CSP; it's the mitigation |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Wow-factor over clarity | Recruiter stunned but can't find "is he a senior dev + AI engineer?" in 3s (the Core Value) | Motion serves the message; AI-engineer proof is legible without interaction |
| 3D as load-blocking gate | User stares at empty hero on slow/mobile | Instant poster/text first; 3D enhances on top |
| Pointer-only interactive globe | Keyboard/touch users locked out | Keyboard alt or demote to decoration |
| Aggressive motion everywhere | Motion sickness, distraction, "tries too hard" | Reduced-motion honored; restraint; pause off-screen |
| Inconsistent polish | Some components elite, others dated → looks unfinished | Shared primitives (motion wrapper, card, type scale) applied uniformly across all 17 components |

## "Looks Done But Isn't" Checklist

- [ ] **3D hero:** Often missing SSR-safe dynamic import + fallback — verify hard-refresh (not client nav) on `/` doesn't flash/crash, and an error boundary exists.
- [ ] **Theme toggle + 3D:** Often missing light-mode handling — verify every 3D scene smoke-tested in BOTH themes for contrast and visibility.
- [ ] **Animations:** Often missing off-screen pause + reduced-motion — verify RAF stops when scrolled away and OS reduce-motion renders a static frame.
- [ ] **Content centralization:** Often missing entries/slugs — verify project & skill counts, `projects/[id]` slugs, JSON-LD blocks, and sitemap URLs match the pre-refactor baseline (additive deltas only).
- [ ] **Bundle:** Often missing budget check — verify three/drei is NOT in the shared chunk and NOT on text/SEO routes (bundle-analyzer).
- [ ] **CWV:** Often missing field verification — verify LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.1 in Lighthouse AND watch Search Console after deploy.
- [ ] **Accessibility:** Often missing canvas labels + keyboard paths — verify axe/Lighthouse a11y, skip link, no keyboard traps, AA contrast in both themes.
- [ ] **Verification:** Often missing real gates — verify `tsc --noEmit` + `lint` ran (build ignores them) before calling a phase done.
- [ ] **SEO assets:** Often missing — verify no `public/` file or route path was renamed/moved (IndexNow/sitemap contracts frozen).
- [ ] **Fund-me/Stripe:** Often missing post-restyle test — verify a Stripe test-mode checkout still completes after fund-me visual changes.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Dropped/changed content after centralization | HIGH (if shipped & indexed) | Restore from baseline snapshot/git; re-add missing entries verbatim; resubmit sitemap; request re-index of affected URLs |
| CWV regression in field data | MEDIUM–HIGH | Identify offending chunk via bundle-analyzer; move 3D to dynamic route chunk; add poster LCP; redeploy; wait 28d for CrUX to recover |
| Hydration crash white-screen | LOW (if caught pre-deploy) | Convert to `dynamic({ ssr: false })`; add error boundary; the boundary itself prevents future white-screens |
| 3D broken in one theme | LOW | Wire `getComputedStyle` token bridge + re-read on theme change |
| Off-screen RAF drain | LOW | Drop the shared IntersectionObserver+reduced-motion wrapper into each component |
| Renamed SEO/public file breaking indexed URL | MEDIUM | Restore original path or add a redirect; the file is a frozen contract — prevention >> cure |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Hydration / WebGL crash (1) | Foundation (error boundaries + dynamic 3D wrapper) | Hard-refresh `/` + ranked page, no hydration errors, boundary catches forced throw |
| Bundle bloat / CWV (2) | three/R3F introduction phase | bundle-analyzer: three absent from shared & text routes; budget met |
| Hero LCP/CLS (3) | Homepage/hero upgrade | Lighthouse LCP ≤ 2.5s, CLS ≤ 0.1, LCP element = poster not canvas |
| Content drift/loss (4) | Content-centralization phase | Diff vs. baseline = zero deletions; Rich Results pass; sitemap URL set intact |
| Off-screen RAF + reduced-motion (5) | Animation-primitive (foundation) phase | RAF pauses off-screen; reduce-motion → static frame; both verified in profiler/OS setting |
| A11y regression (6) | Each component phase + a11y hardening | axe/Lighthouse a11y; keyboard pass; AA contrast both themes; skip link present |
| 3D ignores theme (7) | 3D theming phase | Smoke both themes; tokens flow from CSS vars into materials and update on toggle |
| Verification theater (8) | Every phase + strict-build hardening | `tsc --noEmit` + lint clean; smoke both themes; (end) ignore flags re-enabled |

## Sources

- C:\Users\Usama.Javed\Desktop\modern-portfolio\.planning\codebase\CONCERNS.md — project-specific perf, a11y, security, fragility audit (HIGH confidence, primary source)
- C:\Users\Usama.Javed\Desktop\modern-portfolio\.planning\PROJECT.md — constraints, additive-only mandate, React 19 / R3F v9 / motion v12 pins
- [Next.js — Hydration error reference](https://nextjs.org/docs/messages/react-hydration-error) (HIGH)
- [Three.js with Next.js Integration Guide (2026)](https://threejsresources.com/frameworks/three-js-nextjs) — dynamic-import `{ ssr: false }` pattern (MEDIUM, verified against Next docs)
- [Core Web Vitals 2026: LCP/INP/CLS optimization guide](https://www.digitalapplied.com/blog/core-web-vitals-2026-inp-lcp-cls-optimization-guide) — INP most-failed metric, lazy-load LCP trap, thresholds (MEDIUM)
- [Fix LCP, INP & CLS in 2026 (with benchmarks)](https://dev.to/dharanidharan_d_tech/fix-lcp-inp-cls-in-2026-the-complete-core-web-vitals-guide-with-real-benchmarks-54cl) — bundle/lazy-load CWV impact (MEDIUM)
- WCAG 2.3.3 (Animation from Interactions) / `prefers-reduced-motion` — accessibility/motion baseline (HIGH, established standard)

---
*Pitfalls research for: heavy 3D/motion UI upgrade on a live SEO-equity Next.js site*
*Researched: 2026-06-12*
