---
phase: quick-260703-jyh
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/Navigation.tsx
  - src/components/three/space/SpaceHUD.tsx
  - src/components/three/space/ShellHUD.tsx
  - src/components/three/space/space-dom.css
autonomous: true
requirements: [LOGO-MORPH-01]
must_haves:
  truths:
    - "Classic mode: at scrollY=0 the top-left nav logo reads 'Usama Javed'; after scrolling past 20px it smoothly collapses to 'UJ' (letters after the initials shrink away, not a hard swap); scrolling back to top expands it again — bidirectional and repeatable"
    - "Space mode (/ with cookie AND ShellHUD pages like /services): the top-left gradient logo shows the full 'Usama Javed' wordmark at dive start and collapses to gradient 'UJ' once --space-scroll passes ~0.04; expands again on scroll back"
    - "prefers-reduced-motion users get an opacity crossfade only (no width animation) — both expanded and collapsed states still reachable in both modes"
    - "Screen readers always hear 'Usama Javed — home' on the classic logo link regardless of visual collapse state"
    - "The classic nav row, the .space-hud-topbar layout, and the PAGES menu are not broken; at 375px the expanded wordmark fits on one line with no horizontal overflow"
    - "SSR HTML for / contains the full wordmark (expanded state is the server-rendered state — no flash, SEO intact)"
  artifacts:
    - path: "src/components/Navigation.tsx"
      provides: "Segmented logo Link (U / sama&nbsp; / J / aved) with scrolled-driven inline-style collapse + aria-label"
      contains: "aria-label=\"Usama Javed — home\""
    - path: "src/components/three/space/SpaceHUD.tsx"
      provides: "Segmented gradient wordmark + rAF-loop class toggle via ref (no per-frame React state)"
      contains: "space-logo-collapsed"
    - path: "src/components/three/space/ShellHUD.tsx"
      provides: "Same segmented wordmark + rAF class toggle as SpaceHUD"
      contains: "space-logo-collapsed"
    - path: "src/components/three/space/space-dom.css"
      provides: "Shared .space-logo-seg / .space-logo-collapsed collapse transitions + reduced-motion override + 640px font cap"
      contains: ".space-logo-seg"
  key_links:
    - from: "src/components/Navigation.tsx"
      to: "scrolled state (window.scrollY > 20)"
      via: "inline style maxWidth/opacity on the two collapse spans"
      pattern: "scrolled \\?"
    - from: "src/components/three/space/SpaceHUD.tsx"
      to: "--space-scroll CSS var"
      via: "existing rAF tick toggling classList on logoBlockRef (hysteresis 0.05/0.03)"
      pattern: "classList\\.(add|remove|toggle)"
    - from: "src/components/three/space/space-dom.css"
      to: "SpaceHUD/ShellHUD markup"
      via: ".space-logo-collapsed .space-logo-seg { max-width: 0 }"
      pattern: "space-logo-collapsed"
---

<objective>
Anthropic-style scroll logo morph: the top-left logo reads "Usama Javed" at the top of the page and smoothly collapses to "UJ" as the user scrolls (like anthropic.com's Anthropic → A\ morph) — in BOTH classic mode (Navigation.tsx) and space mode (SpaceHUD + ShellHUD). Bidirectional, repeatable, reduced-motion-safe, SSR-correct.

Purpose: signature polish detail the owner explicitly requested, modeled on anthropic.com.
Output: modified Navigation.tsx, SpaceHUD.tsx, ShellHUD.tsx, space-dom.css + a passing Playwright smoke script (scratchpad, not repo).
</objective>

<context>

Branch: fix/space-mode-ux (work directly on it — SpaceHUD/ShellHUD were just modified by task 260703-fse: PAGES menu, .space-hud-topbar hooks, touch parallax; read CURRENT file state before editing).

Working state facts (verified during planning):
- `Navigation.tsx` line ~161: logo Link renders literal `UJ`, className includes `text-sm font-semibold tracking-wide font-[family-name:var(--font-space-grotesk)]` + focusRing; `scrolled` state = `window.scrollY > 20` already exists (line 32); `useReducedMotion` already imported as `reduceMotion`; `EASE_SIGNATURE = [0.16,1,0.3,1]` from `@/lib/motion`.
- `SpaceHUD.tsx` / `ShellHUD.tsx` top-left block (both files, near-identical): a flex div containing (a) gradient "UJ" span (inline styles: DISPLAY font, 700, 1.4rem, `linear-gradient(90deg, #60a5fa, #a78bfa)` + backgroundClip text + transparent fill) and (b) `.space-hud-sub` stacked mono label "Usama Javed<br/>Creative Dev". Both HUDs have an existing rAF `tick()` reading `--space-scroll` into `t` — DOM writes go through refs, never React state.
- `space-dom.css` (src/components/three/space/): shared stylesheet both HUD pages load; has a `@media (max-width: 640px)` block using `!important` to beat inline HUD styles; `.space-hud-sub` is `display: none !important` on mobile.
- Prod server may already be running on :3005 from task 260703-fse. Tailwind v4 no longer scans `.planning/` (`@source not` fix, commit f90e739).
- No test framework in repo; verification = tsc + eslint + build + scratchpad Playwright smoke (pattern: task 260703-fse's space-ux-smoke.mjs).

CONSTRAINTS (hard):
- No new npm deps in the repo (Playwright goes in the scratchpad only).
- Only touch: Navigation.tsx, SpaceHUD.tsx, ShellHUD.tsx, space-dom.css, and the scratchpad smoke script. Do NOT touch globals.css, VisitorTracker, SpaceModeLauncher, SpacePagesMenu, or anything else.
- Content verbatim: the only text involved is "Usama Javed"/"UJ", both already exist on the site.

<interfaces>
Existing contracts the executor uses directly — no exploration needed:

From src/components/Navigation.tsx:
```tsx
const [scrolled, setScrolled] = useState(false);            // window.scrollY > 20
const reduceMotion = useReducedMotion();                     // motion/react
const focusRing = 'focus-visible:outline-none ...';          // applied to the Link already
// Current logo (replace its children + add aria-label; keep className/style):
<Link href="/" className={`text-sm font-semibold tracking-wide font-[family-name:var(--font-space-grotesk)] rounded-md ${focusRing}`} style={{ color: 'var(--text-primary)' }}>UJ</Link>
```

From src/lib/motion.ts:
```ts
export const EASE_SIGNATURE = [0.16, 1, 0.3, 1] as const;   // CSS string form: cubic-bezier(0.16, 1, 0.3, 1)
```

From SpaceHUD.tsx / ShellHUD.tsx (identical pattern in both):
```tsx
// Existing rAF loop — add the logo class toggle INSIDE tick(), after `t` is read:
const tick = () => {
  const t = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--space-scroll")) || 0;
  // ... gauge/percent/nav writes via refs ...
};
// Top-left block to rework:
<div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
  <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "1.4rem", background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>UJ</span>
  <span className="space-hud-sub" style={{...}}>Usama Javed<br/>Creative Dev</span>
</div>
```
</interfaces>

</context>

<tasks>

<task type="auto">
  <name>Task 1: Classic mode — Navigation.tsx logo morph</name>
  <files>src/components/Navigation.tsx</files>
  <action>
Replace the logo Link's children (currently literal `UJ`) with four segments and add `aria-label="Usama Javed — home"` to the Link (keep the Link's existing className, style, href, focusRing untouched):

```tsx
<Link href="/" aria-label="Usama Javed — home" className={/* unchanged */} style={{ color: 'var(--text-primary)' }}>
  <span aria-hidden="true" style={{ whiteSpace: 'nowrap' }}>
    U
    <span style={segStyle}>sama&nbsp;</span>
    J
    <span style={segStyle}>aved</span>
  </span>
</Link>
```

CRITICAL spacing rule: the space between "sama" and "J" must be a `&nbsp;` INSIDE the first collapse span (`sama&nbsp;`). Two failure modes to avoid: (a) a normal trailing space inside an inline-block gets trimmed by whitespace processing → expanded state would read "UsamaJaved"; (b) a leading space in the always-visible "J" segment would survive collapse → collapsed state would read "U J" instead of "UJ".

`segStyle` — computed inline (uses existing `scrolled` + `reduceMotion` state, no new state, no new deps):

```tsx
const segStyle: React.CSSProperties = {
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  verticalAlign: 'bottom',            // inline-block + overflow:hidden shifts baseline; bottom-align keeps glyphs level with the inline U/J
  maxWidth: scrolled ? 0 : '4em',     // 4em safely exceeds each segment's natural width at text-sm
  opacity: scrolled ? 0 : 1,
  transition: reduceMotion
    ? 'opacity 0.3s ease'                                                             // reduced motion: crossfade only, width snaps
    : 'max-width 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',             // EASE_SIGNATURE as CSS string
};
```

Why this approach (per design requirements: pick the one that renders "Usama Javed" server-side): `scrolled` initializes `false`, so SSR HTML contains the full wordmark — no flash, SEO-visible. Pure CSS transition on inline styles = no motion/react animation needed for this element, no new CSS file (globals.css is out of scope). The morph is bidirectional automatically because `scrolled` flips both ways at the existing 20px threshold — exactly how anthropic.com triggers it.

Do NOT change: the nav's mounted fade, mobile menu, focus trap, desktop links, ThemeToggle, InteractiveButton. The logo is left-aligned in a justify-between row, so collapsing only shrinks it leftward — no layout shift for the rest of the row.
  </action>
  <verify>
    <automated>npx tsc --noEmit && npx eslint src/components/Navigation.tsx</automated>
  </verify>
  <done>tsc + eslint exit 0. Navigation.tsx logo Link has aria-label="Usama Javed — home"; children are U + collapsible "sama&nbsp;" + J + collapsible "aved"; collapse spans' maxWidth/opacity driven by `scrolled`; reduced-motion branch transitions opacity only. Full Playwright proof deferred to Task 3.</done>
</task>

<task type="auto">
  <name>Task 2: Space mode — SpaceHUD + ShellHUD wordmark morph + shared CSS</name>
  <files>src/components/three/space/SpaceHUD.tsx, src/components/three/space/ShellHUD.tsx, src/components/three/space/space-dom.css</files>
  <action>
Apply the IDENTICAL change to both HUDs (they are deliberate near-copies — keep them in sync):

**1. Markup — rework the top-left block minimally.** Add a ref to the left container div and segment the gradient span:

```tsx
const logoBlockRef = useRef<HTMLDivElement>(null);
...
<div ref={logoBlockRef} className="space-logo-block" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
  <span aria-label="Usama Javed" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "1.4rem", whiteSpace: "nowrap" }} className="space-logo">
    <span aria-hidden="true">
      <span className="space-logo-grad">U</span>
      <span className="space-logo-grad space-logo-seg">sama&nbsp;</span>
      <span className="space-logo-grad">J</span>
      <span className="space-logo-grad space-logo-seg">aved</span>
    </span>
  </span>
  <span className="space-hud-sub" style={{ /* unchanged existing inline styles */ }}>
    Usama Javed<br />Creative Dev
  </span>
</div>
```

Gradient decision (locked): apply the gradient PER SEGMENT via `.space-logo-grad` in CSS, NOT on the parent — `background-clip: text` through inline-block overflow-hidden descendants is unreliable across engines; per-segment gradients restart the blue→violet ramp but are visually indistinguishable at 1.4rem. Remove the old inline gradient styles from the parent span (they move to `.space-logo-grad`). Same `&nbsp;` spacing rule as Task 1.

**2. rAF toggle — inside the EXISTING `tick()` in both HUDs**, after `t` is read, add (NO React state, NO new rAF loop):

```tsx
// Logo morph: collapse once the dive progresses. Hysteresis (0.05 in / 0.03 out)
// prevents class flicker while the eased var hovers at the boundary.
const logoEl = logoBlockRef.current;
if (logoEl) {
  if (t > 0.05) logoEl.classList.add("space-logo-collapsed");
  else if (t < 0.03) logoEl.classList.remove("space-logo-collapsed");
}
```

**3. space-dom.css — append a shared block** (both HUD surfaces already load this sheet):

```css
/* ---- Scroll logo morph: "Usama Javed" -> "UJ" as the dive progresses.
   Class toggled by the HUD rAF loops (hysteresis 0.05/0.03); server-rendered
   state = expanded (no class). ---- */
.space-logo-grad {
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.space-logo-seg {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
  max-width: 5em;
  opacity: 1;
  transition: max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}
.space-logo-collapsed .space-logo-seg {
  max-width: 0;
  opacity: 0;
}
/* While the wordmark is expanded, the stacked "Usama Javed / Creative Dev" label
   is redundant — fade it out (opacity only: no layout shift). It fades back in
   once the wordmark collapses to UJ. */
.space-logo-block .space-hud-sub {
  transition: opacity 0.35s ease;
  opacity: 0;
}
.space-logo-block.space-logo-collapsed .space-hud-sub {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .space-logo-seg {
    transition: opacity 0.35s ease; /* crossfade only — width snaps, both states reachable */
  }
}
```

And inside the EXISTING `@media (max-width: 640px)` block (where `.space-hud-sub` is already `display: none !important`), add a font cap so the expanded wordmark cannot crowd the 375px topbar (`!important` beats the inline 1.4rem, consistent with the block's established pattern):

```css
  .space-logo {
    font-size: 1.05rem !important;
  }
```

Do NOT touch: SpacePagesMenu, the glass nav, the FLIGHT gauge, sound/theme/Classic buttons, the touch parallax, or any other part of the rAF loop. The topbar stays `display:flex justify-between` — the left block growing/shrinking must not move the PAGES menu cluster off-screen (verified in Task 3 at 375px).
  </action>
  <verify>
    <automated>npx tsc --noEmit && npx eslint src/components/three/space/SpaceHUD.tsx src/components/three/space/ShellHUD.tsx</automated>
  </verify>
  <done>tsc + eslint exit 0. Both HUDs render the segmented gradient wordmark (expanded by default, no per-frame React state), toggle `space-logo-collapsed` on the ref'd block inside the existing rAF tick with 0.05/0.03 hysteresis; space-dom.css carries the shared seg/collapse/sub-label/reduced-motion rules + the 640px font cap.</done>
</task>

<task type="auto">
  <name>Task 3: Build gate + Playwright smoke (both modes, reduced motion, mobile) + leave server running</name>
  <files>{scratchpad}/logo-morph-smoke.mjs (scratchpad only — NOT the repo)</files>
  <action>
**1. Rebuild + restart the :3005 prod server.**
- Find any existing listener with EXACT port matching (last time a loose `grep :3005` matched ports 30050-30059 and killed an unrelated PID — do not repeat): PowerShell `Get-NetTCPConnection -LocalPort 3005 -State Listen | Select OwningProcess` (or `netstat -ano | findstr ":3005 "` with the trailing space), verify the PID is a node process serving this repo before killing it.
- `npm run build` (strict lint+types are enforced in-build since Phase 6 — this doubles as the full gate; must exit 0 with all routes incl. 12 /projects/* prerendering).
- Restart: `npx next start -p 3005` in the background.

**2. Smoke script** — write `logo-morph-smoke.mjs` in the session scratchpad directory, same pattern as 260703-fse's space-ux-smoke.mjs (plain node script, playwright import, PASS/FAIL lines, exit non-zero on any fail). Playwright install: reuse the previous task's scratchpad `node_modules/playwright` + chromium if still present; otherwise `npm init -y && npm i playwright && npx playwright install chromium` in the scratchpad. Never install Playwright in the repo.

Normalization helper (the wordmark contains ` `): `const norm = (s) => (s ?? "").replace(/ /g, " ").replace(/\s+/g, " ").trim();`
Space mode entry: set cookie `space-mode=on; path=/` on localhost:3005 context before navigation (same mechanism 260703-fse used — the launcher just sets this cookie and reloads).
For collapse-state waits use `page.waitForTimeout(700)` after scrolling (transitions are 0.45-0.5s), or poll offsetWidth.

Checks (each = one PASS/FAIL line):
1. **Classic expanded (SSR + top):** goto `/`, at scrollY=0 the logo link (`nav a[href="/"]` first, or `a[aria-label^="Usama Javed"]`) has norm(textContent) === "Usama Javed". Also fetch raw HTML (`(await page.context().request.get('http://localhost:3005/')).text()`) and assert it contains `aria-label="Usama Javed` (SSR state = wordmark).
2. **Classic collapse:** `window.scrollTo(0, 400)`, wait → both collapse spans inside the logo have `offsetWidth < 4` (evaluate on the two inner inline-block spans; identify them as the logo link's spans with computed `overflow: hidden`) AND computed opacity ≈ 0 → visible text reads "UJ".
3. **Classic re-expand:** `window.scrollTo(0, 0)`, wait → both collapse spans `offsetWidth > 10`, opacity 1.
4. **aria-label intact:** logo link `getAttribute('aria-label') === 'Usama Javed — home'` (after the scroll cycle).
5. **Space mode / expanded at dive start:** new context with space-mode cookie, goto `/`, wait for `.space-hud-topbar`; at scrollY=0 the `.space-logo-block` does NOT have class `space-logo-collapsed` and norm of the logo span text === "Usama Javed".
6. **Space mode / collapsed at 30%:** scroll to `0.3 * (scrollHeight - innerHeight)`, wait ~1s (eased var catches up) → `.space-logo-block` HAS class `space-logo-collapsed` and each `.space-logo-seg` offsetWidth < 4.
7. **ShellHUD page:** same context, goto `/services`, wait for `.space-hud-topbar`; expanded at top, then scroll to 30% → collapsed class applied.
8. **Reduced motion:** fresh context with `reducedMotion: 'reduce'` (context option) or `page.emulateMedia({ reducedMotion: 'reduce' })`. Classic `/`: scroll to 400 → collapse spans reach opacity 0 (crossfade state reachable); scroll back → opacity 1. Space `/` (with cookie): scroll to 30% → `space-logo-collapsed` class applied. (No width-animation assertion needed — just both states reachable.)
9. **Mobile 375px classic:** viewport 375x667, goto `/` → logo link boundingBox height < 30 (single line, no wrap) and its right edge clears the hamburger (no overlap: logo box.x + box.width < hamburger box.x).
10. **Mobile 375px space:** viewport 375x667 + cookie, goto `/`, at scrollY=0 (wordmark expanded) → `document.documentElement.scrollWidth <= 375` (no horizontal overflow — the 1.05rem cap holds).

**3. Run it** (`node logo-morph-smoke.mjs` from the scratchpad) against :3005. All checks must PASS. On failure: fix source (Tasks 1-2 files only), rebuild, restart :3005, rerun.

**4. Commit** the four source files on fix/space-mode-ux via gsd-tools commit: `feat(quick-260703-jyh): anthropic-style scroll logo morph (Usama Javed -> UJ) in classic + space mode`.

**5. LEAVE the prod server RUNNING on http://localhost:3005** — the owner tests manually after.
  </action>
  <verify>
    <automated>node {scratchpad}/logo-morph-smoke.mjs</automated>
  </verify>
  <done>npm run build exit 0 (strict). Smoke 10/10 PASS against the fresh prod build on :3005. Source committed on fix/space-mode-ux. Server left running on :3005 for the owner's manual pass.</done>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` exit 0; `npx eslint` exit 0 on the three touched TSX files.
- `npm run build` exit 0 (strict lint+types enforced in-build).
- Playwright smoke 10/10: classic expand/collapse/re-expand + aria-label + SSR wordmark; space-mode / and /services expand→collapse via `space-logo-collapsed`; reduced-motion crossfade states reachable in both modes; 375px single-line classic logo + no space-mode horizontal overflow.
- Manual (owner, server left on :3005): visual smoothness of the morph in both modes, gradient continuity on the segmented space wordmark, sub-label crossfade taste.
</verification>

<success_criteria>
- Top-left logo reads "Usama Javed" at page top and smoothly collapses to "UJ" on scroll — bidirectional, repeatable — in classic mode AND space mode (homepage HUD + ShellHUD pages).
- SSR HTML carries the full wordmark; screen readers always get "Usama Javed — home" / "Usama Javed".
- Reduced motion = opacity crossfade only; both states reachable.
- No layout regressions: nav row, .space-hud-topbar, PAGES menu, 375px fit all intact.
- Zero new repo deps; only the four allowed source files touched.
</success_criteria>

<output>
After completion, create `.planning/quick/260703-jyh-anthropic-style-scroll-logo-morph-usama-/260703-jyh-SUMMARY.md`
</output>
