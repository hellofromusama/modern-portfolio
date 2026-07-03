---
phase: quick-260703-fse
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/SpaceModeLauncher.tsx
  - src/components/three/space/SpaceContent.tsx
  - src/components/three/space/SpaceHUD.tsx
  - src/components/three/space/ShellHUD.tsx
  - src/components/three/space/SpacePagesMenu.tsx
  - src/components/three/space/SpaceExperience.tsx
  - src/components/three/space/SpacePageShell.tsx
  - src/components/three/space/space-dom.css
autonomous: true
requirements: [UX-01-launcher, UX-02-contact-links, UX-03-project-links, UX-04-hero-ctas, UX-05-pages-menu, UX-06-mobile-touch]

must_haves:
  truths:
    - "A rocket-styled 'Space Mode' launcher floats near the TOP-right (top-36 right-4 — below the fixed Navigation AND clear of VisitorTracker's existing top-20 right-4 toast slot) on every classic page, clearly visible, animated (float/bob + thruster glow), and entering still sets the cookie + full-reloads into space mode"
    - "In homepage space mode, the contact panel's GitHub and LinkedIn are real clickable links (correct URLs, inheriting the panel's light text via .space-links a — not browser-default blue), the email CTA points to mailto:hellofromusama@gmail.com, and X is gone"
    - "In homepage space mode, every project card is a real link that navigates to /projects/[id] which renders as a space dive (cookie carries over)"
    - "The hero panel has 'View My Work' and 'Get In Touch' CTAs that smooth-fly the camera to the projects (0.6) and contact (1.0) anchors"
    - "Both SpaceHUD and ShellHUD have a PAGES menu (glass dropdown) with plain <a href> links to all 10 site pages; clicking Services lands on /services rendered as a dive; existing section-anchor nav is untouched"
    - "On a 375px-wide viewport the launcher is visible/tappable, the HUD top bar does not overflow horizontally, and touchmove drives the same camera parallax that mousemove drives on desktop — WITHOUT breaking native scrolling"
    - "Classic mode is unaffected: Navigation, Footer, and launcher all render, the space HUD chrome and --space-scroll var are ABSENT (canvas absence is NOT a valid signal — classic Hero3D renders its own 2D <canvas>); launcher is theme-correct in BOTH themes; tsc, lint, and build all pass"
  artifacts:
    - path: "src/components/SpaceModeLauncher.tsx"
      provides: "Top-positioned rocket launcher with CSS-only animation, reduced-motion + theme-var compliant"
      contains: "prefers-reduced-motion"
    - path: "src/components/three/space/SpaceContent.tsx"
      provides: "Clickable contact links, project card <a> links, hero flyTo CTAs"
      contains: "https://github.com/hellofromusama"
    - path: "src/components/three/space/SpacePagesMenu.tsx"
      provides: "Shared PAGES glass dropdown used by both HUDs (10 plain <a href> links)"
      exports: ["default"]
    - path: "src/components/three/space/space-dom.css"
      provides: ".space-links a inherit/underline styles + a.space-proj-card block-link styles + hero CTA classes + mobile (max-width 640px) HUD/panel media queries"
      contains: "@media (max-width: 640px)"
    - path: "src/components/three/space/SpaceExperience.tsx"
      provides: "Window-level touchmove -> normalized pointer ref (touch parallax) on homepage space mode"
      contains: "touchmove"
    - path: "src/components/three/space/SpacePageShell.tsx"
      provides: "Window-level touchmove -> normalized pointer ref (touch parallax) on all dive pages"
      contains: "touchmove"
  key_links:
    - from: "src/components/three/space/SpaceContent.tsx"
      to: "/projects/[id]"
      via: "project cards rendered as <a href={`/projects/${id}`}> block links"
      pattern: "href=\\{`/projects/\\$\\{id\\}`\\}"
    - from: "src/components/three/space/SpaceContent.tsx"
      to: "camera dive scroll"
      via: "hero CTAs call the SpaceHUD flyTo pattern (window.scrollTo anchor * max)"
      pattern: "window\\.scrollTo"
    - from: "src/components/three/space/SpaceHUD.tsx"
      to: "src/components/three/space/SpacePagesMenu.tsx"
      via: "import + render in HUD top bar"
      pattern: "SpacePagesMenu"
    - from: "src/components/three/space/ShellHUD.tsx"
      to: "src/components/three/space/SpacePagesMenu.tsx"
      via: "import + render in HUD top bar"
      pattern: "SpacePagesMenu"
    - from: "src/components/three/space/SpaceExperience.tsx"
      to: "src/components/three/space/CameraRig.tsx"
      via: "touchmove updates the SAME mouse ref CameraRig already reads (no rig changes)"
      pattern: "mouse\\.current\\.(x|y)"
---

<objective>
Space Mode UX round: move the launcher to the top and style it as an animated rocket; make the space-mode content actually clickable (contact links, project cards, hero CTAs); add cross-page PAGES navigation to both HUDs; make space mode responsive on mobile with touch-driven parallax.

Purpose: Space Mode currently looks like a demo — content can't be clicked, there's no way to reach other pages, mobile is broken/unresponsive to touch, and the launcher is an invisible pill at the bottom. This closes all owner-reported UX gaps.
Output: 7 modified files + 1 new shared component + a Playwright smoke proving every behavior.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md

Working branch: fix/space-mode-ux (from master, which has Space Mode live).
Diagnosis is CONFIRMED by the orchestrator — implement against it, do not re-investigate.

@src/components/SpaceModeLauncher.tsx
@src/components/three/space/SpaceContent.tsx
@src/components/three/space/SpaceHUD.tsx
@src/components/three/space/ShellHUD.tsx
@src/components/three/space/SpaceExperience.tsx
@src/components/three/space/SpacePageShell.tsx
@src/components/three/space/space-dom.css
@src/components/three/space/spaceSpec.ts

<interfaces>
Key facts the executor needs (already verified from source — no exploration needed):

From spaceSpec.ts:
- SECTION_ANCHORS: hero 0.0, about 0.2, skills 0.4, projects 0.6, team 0.8, contact 1.0
- CAMERA_START_Z = 30, CAMERA_END_Z = -232, SCROLL_VH = 640
- Contact panel z = -266; camera end z = -232 -> dist 34 = "arrival window" (opacity 1, pointerEvents auto at full scroll). Links were simply missing, not blocked.

From SpaceHUD.tsx (the flyTo pattern to reuse verbatim in hero CTAs):
```ts
function flyTo(anchor: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: anchor * max, behavior: "smooth" });
}
```

From SpaceExperience.tsx / SpacePageShell.tsx (identical pointer plumbing in both):
```ts
const mouse = useRef({ x: 0, y: 0 });
// mousemove handler: mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
//                    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
```
CameraRig/ShellCameraRig read `mouse.current.x/y` each frame — they need NO changes; only the hosts need a touch listener feeding the same ref. The tall scroll driver div is pointerEvents:none and the canvas wrapper sits at zIndex 0 behind it, so touch MUST be captured at window level.

From Navigation.tsx: fixed `top-0` bar with `h-16` inner row. IMPORTANT — src/components/VisitorTracker.tsx (mounted in HomeClassic.tsx) ALREADY occupies `fixed top-20 right-4 z-50` with a ~5s "Welcome back" toast on new-day homepage visits. The launcher therefore takes the NEXT slot down: Tailwind `top-36` (9rem) `right-4` — clears both the h-16 nav bar and the VisitorTracker toast. Do NOT move or edit VisitorTracker. navItems (classic): Home /, AI Engineering /ai-engineering, Ideas /ideas, Contact /contact, Budget /budget, Fund Me /fund-me.

CLASSIC-MODE DOM FACT (for the smoke): HomeClassic.tsx unconditionally renders Hero3D -> Hero3DScene, a real 2D `<canvas>` on the classic homepage. Canvas presence/absence CANNOT distinguish classic from space mode on `/`. The reliable space-mode markers are the HUD chrome (the `.space-hud-topbar` className hook added in Task 2E) and the `--space-scroll` CSS var (set only by CameraRig/ShellCameraRig).

Real social URLs (from Footer.tsx, reuse VERBATIM — there is NO X/Twitter URL anywhere in the codebase, omit X):
- GitHub: https://github.com/hellofromusama
- LinkedIn: https://www.linkedin.com/in/hellofromusama/
- Email: mailto:hellofromusama@gmail.com

HUD styling constants (match for the PAGES menu): MONO = "var(--font-jetbrains-mono), ui-monospace, monospace"; glass = background rgba(18,22,36,0.38) / backdrop-filter blur(18px) saturate(1.25) / border 1px solid rgba(255,255,255,0.13); inactive text #9aa1b2, active #ffffff.

HUD layer contract: root overlay is fixed, zIndex 10, pointerEvents:"none" — every interactive child sets pointerEvents:"auto" (the `btn` style const does this). The PAGES dropdown must do the same.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Rocket launcher — top position, CSS animation, theme + reduced-motion safe</name>
  <files>src/components/SpaceModeLauncher.tsx</files>
  <action>
Restyle and move SpaceModeLauncher. PRESERVE unchanged: the mounted-guard (`if (!mounted || inSpace || pathname === "/space") return null`), the cookie check, and `enter()` (set `space-mode=on` cookie + `window.location.reload()`).

Changes:
1. Position: `fixed top-36 right-4 z-50`. Rationale (document in a code comment): the fixed Navigation occupies top-0 h-16, and VisitorTracker.tsx (classic homepage) ALREADY sits at `fixed top-20 right-4 z-50` (a ~5s "Welcome back" toast) — `top-36` (9rem) is the first clear right-edge slot below both. Do NOT touch VisitorTracker. Keep the launcher at this slot on ALL viewports — on mobile it must remain visible and tappable (min ~44px tap height: keep py-2.5/px-4 or larger).
2. Content: inline rocket SVG (simple rocket silhouette — body + fins + window circle, `stroke="currentColor"` or fill using currentColor so it themes; ~18-20px) + a small thruster "flame" element under/behind it + the label "Space Mode". Keep `aria-label="Enter Space Mode"` and the existing focus-visible ring classes.
3. Theming: keep CSS variables only — background var(--bg-elevated), border 1px solid var(--border-default), color var(--text-secondary), hover border var(--border-hover); glow shadows keyed to var(--accent-blue)/var(--accent-violet). NO hardcoded palette hex (both themes must look right).
4. CSS-only animation via a local `<style jsx>` block (repo precedent: Hero3D's gradient-flow):
   - `float`: gentle translateY bob (±3px, ~3s ease-in-out infinite) on the whole button.
   - `thruster`: opacity/scale pulse (~1.2s infinite) on the flame element + a soft box-shadow glow pulse using color-mix or rgba of the accent (a fixed rgba(96,165,250,…) glow is acceptable for the shadow only — shadows are decorative on both themes).
   - hover: tilt (`rotate(-8deg)`) + slight lift `translateY(-3px)` via transition on a wrapper/transform (don't fight the bob keyframe — put hover transform on an inner span or pause the animation on hover).
   - MUST include `@media (prefers-reduced-motion: reduce) { … { animation: none; transition: none; } }` covering every animated rule.
5. No new copy beyond the existing "Space Mode" label. No new deps.
  </action>
  <verify>
    <automated>npx tsc --noEmit && npx eslint src/components/SpaceModeLauncher.tsx</automated>
  </verify>
  <done>Launcher renders fixed top-right (top-36 right-4 — clear of Navigation AND VisitorTracker's top-20 toast) with rocket SVG + "Space Mode" label, bob + thruster-glow animation, hover tilt, reduced-motion kill, theme vars only; enter() behavior byte-equivalent (cookie + reload); hidden on /space and when cookie set; VisitorTracker untouched.</done>
</task>

<task type="auto">
  <name>Task 2: Clickable space content + PAGES menu + touch parallax + mobile CSS</name>
  <files>src/components/three/space/SpaceContent.tsx, src/components/three/space/SpacePagesMenu.tsx, src/components/three/space/SpaceHUD.tsx, src/components/three/space/ShellHUD.tsx, src/components/three/space/SpaceExperience.tsx, src/components/three/space/SpacePageShell.tsx, src/components/three/space/space-dom.css</files>
  <action>
**A) SpaceContent.tsx — ContactContent (per diagnosis #2):**
- Replace `<p className="space-links">GitHub · LinkedIn · X</p>` with real anchors, OMITTING X (no X URL exists anywhere in the codebase):
  `<a href="https://github.com/hellofromusama" target="_blank" rel="noopener noreferrer">GitHub</a>` · `<a href="https://www.linkedin.com/in/hellofromusama/" target="_blank" rel="noopener noreferrer">LinkedIn</a>` · `<a href="mailto:hellofromusama@gmail.com">Email</a>` (keep the `space-links` class on the wrapping <p>).
- Change the `.space-cta` anchor: `href="mailto:hellofromusama@gmail.com"` and update the visible text to `hellofromusama@gmail.com →` (owner's real inbox — the old hello@usamajaved.com.au address is not his inbox).
- space-dom.css: there is NO `a { color: inherit }` reset in this stylesheet, so bare anchors render browser-default blue/underline. Add: `.space-links a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }` and `.space-links a:hover { color: #f0eee9; }` (matches the treatment a.space-proj-card gets in B).

**B) SpaceContent.tsx — ProjectsContent (per diagnosis #3):**
- Convert each project card from `<div className="space-proj-card">` to `<a href={`/projects/${id}`} className="space-proj-card">` (same children/style/key). No Link component needed — a full page load re-reads the space-mode cookie server-side so the target renders as a dive. Add to space-dom.css: `a.space-proj-card { display: block; text-decoration: none; color: inherit; cursor: pointer; }`.

**C) SpaceContent.tsx — HeroContent CTAs (per diagnosis #4):**
- Add a local `flyTo(anchor: number)` helper (EXACT SpaceHUD pattern — see interfaces) at module scope in SpaceContent.tsx.
- In HeroContent, below the chips, add a CTA row: `<button className="space-cta space-cta-btn" onClick={() => flyTo(0.6)}>View My Work</button>` and `<button className="space-cta-secondary" onClick={() => flyTo(1.0)}>Get In Touch</button>`. Labels "View My Work" / "Get In Touch" exist on the classic homepage — the ONLY new copy allowed besides PAGES menu labels.
- space-dom.css: `.space-cta-btn { border: none; cursor: pointer; font: inherit; font-weight: 600; }` (reuses .space-cta gradient look on a <button>) and `.space-cta-secondary { display:inline-block; margin: 1rem 0 0.75rem 0.6rem; padding: 0.75rem 1.4rem; border-radius: 100px; font-weight: 600; color: #ece9e4; background: transparent; border: 1px solid rgba(255,255,255,0.25); cursor: pointer; font: inherit; }` with hover border-color #60a5fa.

**D) NEW src/components/three/space/SpacePagesMenu.tsx (per diagnosis #5):**
- `"use client"` component, default export, no props (or optional accent). A "PAGES ▾" trigger button styled like the existing HUD mono buttons (MONO font, 0.68rem, letterSpacing 0.14em, uppercase, color #9aa1b2, pointerEvents auto, cursor pointer, background transparent, border none) toggling `open` state.
- When open: absolutely-positioned glass dropdown (position: relative wrapper; menu `position: absolute, top: calc(100% + 0.5rem), right: 0, zIndex 20, pointerEvents: "auto"`, glass = rgba(18,22,36,0.85) + blur(18px) + 1px solid rgba(255,255,255,0.13), borderRadius 14px, padding ~0.5rem, minWidth ~180px, `maxHeight: "min(60vh, 420px)", overflowY: "auto"` so it fits a 375x812 viewport).
- Contents: PLAIN `<a href>` links (full page load re-reads the cookie server-side → target renders as its dive), MONO styling, display block, padding ~0.45rem 0.9rem, color #9aa1b2, hover #ffffff:
  Home `/`, Services `/services`, Expertise `/expertise`, Tech Stack `/tech-stack`, Team `/team`, Blog `/blog`, Contact `/contact`, Budget `/budget`, Ideas `/ideas`, Fund Me `/fund-me`.
- `aria-expanded` + `aria-haspopup` on the trigger; close on outside click optional (links navigate away anyway).

**E) SpaceHUD.tsx + ShellHUD.tsx:**
- Import SpacePagesMenu and render it in the top-right cluster (before the "◄ Classic" button) in BOTH files. Do NOT touch the existing section-anchor glass nav, gauge, theme/sound toggles, or exitSpace.
- Add className hooks for mobile CSS (keep all inline styles as-is): `className="space-hud-topbar"` on the top-bar flex div, `className="space-hud-nav"` on the glass `<nav>`, `className="space-hud-sub"` on the "Usama Javed / Creative Dev" two-line span, `className="space-hud-gauge"` on the right-edge FLIGHT gauge container. Same hooks in both HUD files. (`.space-hud-topbar` doubles as the smoke's "space mode is on" DOM marker — canvas presence cannot distinguish modes on `/`.)

**F) Touch parallax — SpaceExperience.tsx AND SpacePageShell.tsx (per diagnosis #6b):**
- In the existing pointer useEffect of each host, additionally register window `touchmove` (and `touchstart` for the initial position) listeners with `{ passive: true }` — NO preventDefault (native scroll IS the dive; breaking it breaks everything). Handler: `const t = e.touches[0]; if (!t) return;` then the SAME normalization into the SAME ref: `mouse.current.x = (t.clientX / window.innerWidth) * 2 - 1; mouse.current.y = -(t.clientY / window.innerHeight) * 2 + 1;`. Window-level is REQUIRED: the scroll driver div is pointerEvents:none and touches land on it/document, not the canvas.
- For smoke observability, the touch handler (touch only, not mousemove) also publishes `document.documentElement.style.setProperty("--space-touch-x", mouse.current.x.toFixed(3))` — one cheap DOM write per finger move, nothing reads it per-frame.
- Clean up all listeners in the effect teardown. CameraRig/ShellCameraRig are NOT modified.

**G) Mobile responsive — space-dom.css (per diagnosis #6a):**
Append an `@media (max-width: 640px)` block (inline JSX styles need `!important` to be overridden — acceptable, scoped to space chrome):
- `.space-hud-topbar { padding: 0.7rem 0.75rem !important; gap: 0.5rem !important; }`
- `.space-hud-sub { display: none !important; }` (keep the UJ monogram)
- `.space-hud-nav { gap: 0.55rem !important; padding: 0.4rem 0.6rem !important; max-width: 62vw; overflow-x: auto; scrollbar-width: none; }` and `.space-hud-nav button { font-size: 0.58rem !important; letter-spacing: 0.1em !important; white-space: nowrap; }` — the section nav becomes a horizontally scrollable pill instead of overflowing 375px.
- `.space-hud-gauge { right: 0.6rem !important; }` and shrink its height (e.g. gauge bar 120px) if a simple rule reaches it; skip if it requires JSX changes beyond the className hook.
- Panels: `.space-panel { padding: 1.25rem 1.1rem; } .space-card { padding: 0.9rem 1rem; }` and, for readability of the distanceFactor-10 transform panels, modestly bump small text (`.space-body { font-size: 1.05rem; } .space-card-list li { font-size: 0.95rem; }`) — CSS ONLY; do NOT touch distanceFactor, Html props, or any 3D architecture.
- `.space-cta, .space-cta-secondary { display: block; margin-left: 0; text-align: center; }` so hero CTAs stack.
Content text remains verbatim — these are wrapper/chrome styles only.
  </action>
  <verify>
    <automated>npx tsc --noEmit && npx eslint src/components/three/space/SpaceContent.tsx src/components/three/space/SpacePagesMenu.tsx src/components/three/space/SpaceHUD.tsx src/components/three/space/ShellHUD.tsx src/components/three/space/SpaceExperience.tsx src/components/three/space/SpacePageShell.tsx && npm run build</automated>
  </verify>
  <done>Contact links + mailto real (X omitted) and styled via .space-links a (inherit color, underline — no browser-default blue); project cards are /projects/[id] anchors; hero has working flyTo CTAs; PAGES glass dropdown in both HUDs with 10 plain <a href> links; touchmove updates the pointer ref (passive, window-level, publishes --space-touch-x) in both hosts; max-width-640px media block keeps HUD + panels inside 375px; tsc + eslint + build all green.</done>
</task>

<task type="auto">
  <name>Task 3: Playwright smoke — desktop + mobile + both-theme assertions against prod build</name>
  <files>C:\Users\USAMA~1.JAV\AppData\Local\Temp\claude\C--Users-Usama-Javed\f6c04630-64d7-4165-91c9-bbf7953edde1\scratchpad\pw-record\space-ux-smoke.mjs</files>
  <action>
Author `space-ux-smoke.mjs` in the scratchpad pw-record dir following the existing `space-pages-smoke.mjs` pattern (import { chromium } from "playwright" resolved from the scratchpad node_modules, record(PASS/FAIL) helper, `page.bringToFront()` before interactions). waitForDive = waitForSelector(".space-hud-topbar") + ~3500ms loader settle — NOT bare `canvas`: the classic homepage unconditionally renders Hero3D's own 2D `<canvas>`, so canvas presence/absence cannot distinguish modes on `/`; the HUD topbar hook from Task 2E is the reliable space-mode marker. Server prep (run these, do not embed in the script): stop any server on 3005, `rm -rf .next`, `npm run build`, then `PORT=3005 npm run start` in background; run with `BASE_URL=http://localhost:3005`.

Cookie injection where space mode is needed: `context.addCookies([{ name: "space-mode", value: "on", url: "http://localhost:3005" }])`. Scroll to a section before clicking it: `page.evaluate((a) => window.scrollTo(0, a * (document.documentElement.scrollHeight - window.innerHeight)), anchor)` then wait ~2s for the eased camera to arrive (opacity gate needs op > 0.5 for pointer-events).

**Desktop context (default viewport) assertions:**
1. CLASSIC UNAFFECTED + LAUNCHER: fresh context (no cookie) → `/`: Navigation `<nav>` present, Footer present, launcher button (`aria-label="Enter Space Mode"`) visible with boundingBox.y in roughly 130–230 (top-36 = 144px — near top, NOT bottom: also assert y < viewportHeight/2), contains an `svg` (rocket) and text "Space Mode". No geometric-overlap assertion needed — the slot (top-36 right-4, below Navigation h-16 and below VisitorTracker's top-20 toast) is documented in Task 1; VisitorTracker may show simultaneously without collision.
2. LAUNCHER ENTERS: click launcher → wait for reload → `.space-hud-topbar` appears (space HUD chrome = space mode on; do NOT use canvas as the signal).
3. PROJECT CARD NAV: with cookie on `/`, scroll to anchor 0.6, wait, click `a.space-proj-card >> nth=0` (force:true if needed) → URL matches `/projects/` and waitForDive passes (target rendered as dive).
4. CONTACT LINKS: with cookie on `/`, scroll to anchor 1.0, wait, assert `a[href="https://github.com/hellofromusama"]` and `a[href="https://www.linkedin.com/in/hellofromusama/"]` exist and the CTA `a[href="mailto:hellofromusama@gmail.com"]` exists; assert page text does NOT contain a standalone "· X".
5. HERO CTA: with cookie on `/` at scrollY 0, click button "View My Work", wait ~2.5s, assert `window.scrollY > 0.3 * max` (camera flying toward projects).
6. PAGES MENU CROSS-NAV: with cookie on `/`, click the PAGES trigger (aria-haspopup), click the Services `<a>` → URL ends `/services` and waitForDive passes (HUD chrome present = dive, cookie survived).
7. BOTH-THEME LAUNCHER (CLAUDE.md both-theme smoke requirement): fresh context (no cookie) → `/`: `page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"))`, wait ~300ms, assert the launcher is still visible AND its computed `background-color` is not transparent/unset (`getComputedStyle(el).backgroundColor !== "rgba(0, 0, 0, 0)"` and non-empty) — proves var(--bg-elevated) resolves under the light theme. Note in the SUMMARY that any deeper light-theme visual checks (contrast/legibility of the rocket + glow) remain MANUAL owner items.

**Mobile context (`viewport: {width:375, height:812}, hasTouch: true, isMobile: true`):**
8. LAUNCHER MOBILE: no cookie, `/`: launcher visible, boundingBox fully inside 375px width, height >= 36.
9. HUD NO OVERFLOW: with cookie, `/`, after loader: `page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)` is true AND the `.space-hud-nav` boundingBox right edge <= 375.
10. TOUCH PARALLAX: with cookie on `/`: read `getComputedStyle(document.documentElement).getPropertyValue("--space-touch-x")` (baseline, likely empty), then `await page.touchscreen.tap(60, 400)` + dispatch a touchmove sequence — simplest reliable path: `page.evaluate` dispatching `new TouchEvent` is flaky, so use `page.touchscreen` taps at x=40 then x=340 with waits; after each, read `--space-touch-x` and assert the two readings differ and are parseable floats of opposite-ish sign (x=40 → negative, x=340 → positive). If touchstart alone doesn't set it (handler covers touchstart + touchmove, so it should), fall back to CDP `Input.dispatchTouchEvent` touchMove; as last resort screenshot-diff is NOT needed — the CSS var is the designed assertion.
11. CLASSIC MOBILE: no cookie `/`: nav + footer present, `.space-hud-topbar` count = 0, AND `--space-scroll` on documentElement is empty/unset (`getComputedStyle(document.documentElement).getPropertyValue("--space-scroll").trim() === ""`). Do NOT assert canvas absence — the classic Hero3D renders its own 2D `<canvas>` on `/`, so that assertion would always fail.

Print a PASS/FAIL summary and `process.exit(failures ? 1 : 0)`. Run it; ALL checks must PASS. If a check fails, fix the source (Tasks 1-2 files) and re-run — do not weaken assertions. Kill the :3005 server when done. Do NOT add playwright to the repo package.json.
  </action>
  <verify>
    <automated>node "C:\Users\USAMA~1.JAV\AppData\Local\Temp\claude\C--Users-Usama-Javed\f6c04630-64d7-4165-91c9-bbf7953edde1\scratchpad\pw-record\space-ux-smoke.mjs" (with BASE_URL=http://localhost:3005 against the fresh prod build) exits 0 with all PASS lines</automated>
  </verify>
  <done>Smoke exits 0: launcher top (top-36 slot) + rocket + enters space (HUD-chrome signal, not canvas); project card → /projects/<id> dive; contact hrefs correct (no X); hero CTA scrolls; PAGES → /services dive; launcher theme-correct under data-theme="light"; 375px launcher visible + HUD contained + --space-touch-x responds to touch; classic mode intact via HUD-absence + --space-scroll-unset (NOT canvas absence) on desktop and mobile.</done>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` exit 0 (strict build is enforced — no new type errors).
- `npx eslint` on all touched src files exit 0.
- `npm run build` exit 0 (strict lint+types in build; all routes incl. 12 /projects/* prerender).
- `space-ux-smoke.mjs` exit 0 against a fresh prod build on :3005 (desktop + 375x812 mobile contexts), including the light-theme launcher assertion (CLAUDE.md both-theme requirement; deeper light-theme visual checks flagged MANUAL in SUMMARY).
- Content verbatim check: only new copy is "View My Work", "Get In Touch" (exist on classic homepage), the PAGES menu labels, and the corrected email address text; all section body text, skills, project grid* fields, TeamSection untouched.
</verification>

<success_criteria>
- All 6 diagnosis items closed: (1) top rocket launcher, (2) real contact links + correct mailto with X omitted, (3) project cards navigate to dives, (4) hero flyTo CTAs, (5) PAGES cross-page menu in both HUDs, (6) mobile responsive HUD/panels + window-level touch parallax.
- Zero regressions: classic mode chrome intact (VisitorTracker untouched at its top-20 slot), /space section-anchor nav intact, CameraRig math untouched, native scrolling never preventDefault'd, no new dependencies.
- Reduced-motion: every new CSS animation killed under prefers-reduced-motion.
</success_criteria>

<output>
After completion, create `.planning/quick/260703-fse-space-mode-ux-round-top-spaceship-launch/260703-fse-SUMMARY.md`
</output>
