# Codebase Concerns

**Analysis Date:** 2026-06-10

**Context for upcoming milestone:** Improve every component's UI to world-class quality while ADDING AI content. Owner directive: REMOVE NOTHING. All "flagged" items below are documentation, not deletion recommendations.

## Tech Debt

**Oversized files (refactor candidates when touching for UI work):**
- Issue: Several pages/components exceed 400 lines, mixing data, layout, and logic. UI upgrades will be risky without splitting concerns (extract data arrays, JSON-LD, and sub-sections into modules — keep all content).
- Files (line counts):
  - `src/app/layout.tsx` (689) — metadata + 7 inline `application/ld+json` blocks
  - `src/app/expertise/page.tsx` (642)
  - `src/app/ideas/page.tsx` (623)
  - `src/app/api/budget-estimate/route.ts` (500) — prompt text, fallback copy, and 3 provider clients in one file
  - `src/components/InteractiveGlobe.tsx` (480)
  - `src/components/AnimatedIcons.tsx` (477)
  - `src/app/api/ai-training/route.ts` (461)
  - `src/app/page.tsx` (421), `src/app/fund-me/page.tsx` (407), `src/app/api/auto-llm-training/route.ts` (407)
- Impact: High merge-conflict surface; hard to restyle without breaking SEO schema or copy.
- Fix approach: Extract content constants (stats, project arrays, JSON-LD objects) into `src/data/` or co-located `*.content.ts` files; restyle the now-thin components. Zero content removal.

**Build-time safety disabled:**
- Issue: `next.config.ts` sets `typescript: { ignoreBuildErrors: true }` and `eslint: { ignoreDuringBuilds: true }`.
- Files: `next.config.ts`
- Impact: Type errors and lint violations ship to production silently. Example latent error it masks: `src/app/api/create-checkout/route.ts` passes `apiVersion: '2024-06-20'` to `stripe` v18, which type-pins a newer API version literal — this would fail a strict build. `src/app/test-apis/page.tsx` uses `any` and unused catch vars.
- Fix approach: During the UI milestone, run `npx tsc --noEmit` and `npm run lint` locally as a gate even though builds ignore them; re-enable flags once errors are burned down.

**Deprecated/incorrect image config:**
- Issue: `images.domains: ['usamajaved.com']` — (a) `domains` is deprecated in favor of `remotePatterns` in Next 15, (b) the live domain is `www.usamajaved.com.au`, so the allowed domain doesn't match the site.
- Files: `next.config.ts`
- Impact: Remote images from the real domain would fail `next/image` optimization; build warnings.
- Fix approach: Switch to `remotePatterns` with the correct host when touching config.

**Viewport/themeColor in `metadata` export:**
- Issue: `viewport`, `themeColor`, and `colorScheme` are declared inside `export const metadata` in `src/app/layout.tsx`. Next.js 15 requires these in a separate `export const viewport` and emits build warnings per page.
- Files: `src/app/layout.tsx` (lines ~39–50)
- Impact: Noisy builds; future Next major may hard-error.
- Fix approach: Move to a `viewport` export during layout restyle.

**Hardcoded production URLs and identity strings:**
- Issue: `https://www.usamajaved.com.au` and `hellofromusama@gmail.com` are hardcoded in many files instead of a single config/env source.
- Files: `src/app/api/create-checkout/route.ts` (success/cancel URLs), `src/app/api/send-email/route.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/layout.tsx`, multiple pages.
- Impact: Preview deployments redirect to production after Stripe checkout; domain changes require shotgun edits.
- Fix approach: Centralize in `src/config/site.ts` reading `NEXT_PUBLIC_SITE_URL`.

**Version skew in tooling:**
- Issue: `eslint-config-next` pinned at `15.5.4` while `next` is `^15.5.12` (lockfile resolves next@15.5.12). `@types/node` is `^20` (Node 20 LTS reaches end of maintenance April 2026).
- Files: `package.json`, `package-lock.json`
- Impact: Minor rule drift; types may lag runtime on Vercel's Node 22 default.
- Fix approach: Align versions when bumping Next.

## Known Bugs

**IdeaNetworkCanvas DPR coordinate mismatch:**
- Symptoms: On high-DPI screens (devicePixelRatio > 1), nodes initialize spread over device-pixel space (`canvas.width/height`) but are drawn in CSS-pixel space, so many nodes start off-screen and drift in over time; the network looks sparse on first paint, especially mobile.
- Files: `src/components/IdeaNetworkCanvas.tsx` — `init()` uses `canvas.width/height` (lines 29–33, 117) while `draw()` uses `getBoundingClientRect()` CSS dimensions (lines 140–142).
- Trigger: Load `/ideas` on any retina/mobile display.
- Workaround: None in code. Fix: pass CSS dimensions into `init()`.

**InteractiveGlobe per-path strokeStyle overwrite:**
- Symptoms: In `drawLine()`, `ctx.strokeStyle` is reassigned per segment inside a single `beginPath()`/`stroke()` pair; only the last assignment applies to the whole path, so the intended per-segment back-face alpha fade does not render as designed.
- Files: `src/components/InteractiveGlobe.tsx` (lines 235–263)
- Trigger: Always; visually subtle.
- Workaround: Stroke per segment or bucket segments by alpha when reworking the component.

**`test-apis` stale-closure result merging:**
- Symptoms: `setResults({ ...results, budget: data })` spreads a stale `results` value; rapid sequential tests can drop earlier results.
- Files: `src/app/test-apis/page.tsx` (lines ~28–40)
- Trigger: Click multiple test buttons quickly.
- Workaround: Use functional `setResults(prev => ...)`.

## Security Considerations

**No hardcoded secrets found in repo (verified):**
- Greps for `sk-`, `sk_live`, `pk_live`, `AIza`, `Bearer`, and `api_key=` literals across `src/` returned nothing. All keys flow through `process.env.*` (`OPENAI_API_KEY`, `GROK_API_KEY`, `HUGGINGFACE_API_KEY`, `GOOGLE_AI_API_KEY`, `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `EMAIL_USER`, `EMAIL_PASS`).
- `.env.local` exists locally and is git-ignored (`git check-ignore` confirms); no `.env*` file has ever been committed (`git log --all -- .env*` is empty).
- `public/usamajaved-indexnow-key-2026.txt` is committed — this is intentional and required by the IndexNow protocol (the key must be publicly served). Not a leak.
- Exception worth knowing: `src/app/contact/page.tsx:30` and `src/app/ideas/page.tsx:34` hardcode the EmailJS public key `5eLu74wM2kSgwd6fT` plus service/template IDs. EmailJS public keys are client-side by design, but anyone can reuse them to burn the EmailJS quota. Recommendation: move to `NEXT_PUBLIC_EMAILJS_*` env vars and enable EmailJS domain allowlisting.

**`/api/test-openai` — unauthenticated paid-API proxy that leaks key prefix:**
- Risk: Public GET endpoint calls OpenAI chat completions on every request (cost abuse via curl loop) and returns `keyUsed: process.env.OPENAI_API_KEY.substring(0, 10) + '...'` — leaking the first 10 characters of the secret key, plus raw OpenAI error bodies.
- Files: `src/app/api/test-openai/route.ts` (line 38), consumed by `src/app/test-apis/page.tsx`
- Current mitigation: `/test-apis` is disallowed in `src/app/robots.ts`, but the API route itself is not blocked and robots.txt is not access control.
- Recommendations: Gate behind an admin token or `NODE_ENV !== 'production'` check; remove the `keyUsed` field. Keep the route (owner wants nothing removed) — just guard it.

**Unauthenticated, unrate-limited AI endpoints (cost abuse surface):**
- Risk: `/api/budget-estimate` (POST) fans out to OpenAI → Grok → HuggingFace per request with no rate limiting, captcha, or auth. `/api/auto-llm-training` and `/api/schedule-training` are POST-able by anyone and are auto-triggered from every visitor's browser by `src/components/VisitorTracker.tsx` (lines 77–100). A bot crawl or hostile script equals direct API spend.
- Files: `src/app/api/budget-estimate/route.ts`, `src/app/api/auto-llm-training/route.ts`, `src/app/api/schedule-training/route.ts`, `src/components/VisitorTracker.tsx`
- Current mitigation: Training routes are gated by `AI_TRAINING_ENABLED === 'true'` env flag; budget route falls back to canned responses when keys are absent.
- Recommendations: Add per-IP rate limiting (e.g. Upstash Ratelimit or Vercel WAF rules), require a shared secret header for the training routes, and consider moving the visitor-triggered training calls server-side (cron) instead of client fan-out.

**`/api/send-email` — HTML injection and spam relay:**
- Risk: `name`, `email`, `subject`, `message` are interpolated raw into the HTML email body (line 22–41) — HTML/script injection into the email, header-adjacent abuse via `subject`, and no rate limiting means the endpoint can be used to flood the inbox. Fallback credentials `EMAIL_USER || 'hellofromusama@gmail.com'` / `EMAIL_PASS || 'your_app_password_here'` mean missing env vars fail at SMTP time with confusing errors.
- Files: `src/app/api/send-email/route.ts`
- Current mitigation: None (no validation, no sanitization, no rate limit).
- Recommendations: Escape user input before HTML interpolation, validate payload shape, rate-limit, and fail fast when `EMAIL_PASS` is unset.

**`dangerouslyAllowSVG: true` in image config:**
- Risk: SVG processing via the image optimizer.
- Files: `next.config.ts`
- Current mitigation: Strict `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` and `contentDispositionType: 'attachment'` — adequately mitigated. No action needed; do not loosen the CSP during UI work.

## Performance Bottlenecks

**Shared problem across all four animation components — no off-screen pause, no `prefers-reduced-motion`:**
- Problem: `Hero3DScene`, `InteractiveGlobe`, and `IdeaNetworkCanvas` run `requestAnimationFrame` loops forever once mounted, even when scrolled out of view. None of the three checks `prefers-reduced-motion` (only `src/components/ScrollReveal.tsx` lines 33–34/274 and `src/app/globals.css` line 134 respect it). RAF cleanup itself is correct in all three (`cancelAnimationFrame` in effect teardown — no leaks found), and listeners are removed properly.
- Files: `src/components/Hero3DScene.tsx`, `src/components/InteractiveGlobe.tsx`, `src/components/IdeaNetworkCanvas.tsx`, `src/components/Hero3D.tsx`
- Cause: No `IntersectionObserver` gating; no motion-preference branch.
- Improvement path: Wrap each render loop with an IntersectionObserver pause and render a static frame when `prefers-reduced-motion: reduce`. This is the single highest-leverage perf+a11y fix for the milestone.

**`Hero3DScene` per-frame allocation and uncapped DPR:**
- Problem: Every frame creates a `createLinearGradient` per icosahedron edge (30) and `createRadialGradient` per vertex (12), draws a full-viewport dot grid (O(width×height/3600) arcs), and runs an O(n²) loop over 100 particles (~4,950 distance checks). DPR is uncapped (`window.devicePixelRatio || 1`) — a dpr-3 phone renders 9x the pixels of dpr-1.
- Files: `src/components/Hero3DScene.tsx` (lines 15, 92–106, 159–173, 200–245)
- Cause: Gradient objects are not cacheable as written; no mobile budget.
- Improvement path: Cap dpr at 2 (as `IdeaNetworkCanvas.tsx:113` already does), precompute gradients or use flat rgba strokes, reduce particle count on small viewports. Particles also initialize against a hardcoded 1600x1000 space (lines 32–33) regardless of viewport.

**`InteractiveGlobe` per-frame gradient churn:**
- Problem: Each frame builds 2 background radial gradients + up to ~30 per-dot glow radial gradients + 1 sphere-shade gradient, and strokes hundreds of short arc segments individually with `beginPath`/`stroke` per segment (lines 401–426). DPR is uncapped (line 210).
- Files: `src/components/InteractiveGlobe.tsx`
- Improvement path: Cache static gradients per resize, batch arc segments, cap dpr. Pointer handlers write to refs only (cheap) — keep that pattern.

**`IdeaNetworkCanvas` O(n²) with per-pair gradient creation:**
- Problem: ~80 nodes → up to ~3,160 pair distance checks per frame, with `createLinearGradient` allocated per qualifying idea-connection per frame (lines 216–219).
- Files: `src/components/IdeaNetworkCanvas.tsx`
- Improvement path: Spatial grid or precomputed neighbor lists (an initial neighbor list is already built in `init()` lines 83–99 but then ignored — the draw loop re-derives connections by brute force at line 198).

**Window-level `mousemove` listener always active:**
- Problem: `src/components/Hero3D.tsx` (lines 22–29) attaches `window.mousemove` even on touch devices where it never fires usefully; `Hero3DScene` lerps mouse every frame regardless.
- Improvement path: Use `pointermove` with a coarse-pointer media-query bail-out.

**`unoptimized`/`<img>` audit not run:** team photos live in `public/team/` — verify they go through `next/image` during the UI pass.

## Fragile Areas

**`src/app/layout.tsx` (689 lines):**
- Why fragile: Global metadata, 3 font loaders, 7 inline JSON-LD structured-data blocks, and the root shell all live in one file. Any UI change here risks corrupting SEO schema that the SEO strategy depends on.
- Safe modification: Extract JSON-LD objects to a typed constants file and snapshot-render them; validate with Google's Rich Results test after changes.
- Test coverage: None (no test framework in repo at all — see Test Coverage Gaps).

**The SEO/AI-training content web (KEEP, but tread carefully):**
- Files: Root markdown docs (`CLAUDE_TRAINING_DATA.md`, `GEMINI_TRAINING_DATA.md`, `GROK_TRAINING_DATA.md`, `MANUAL_TRAINING_DATA.md`, `QUICK_TRAINING_ALL_AI.md`, `LLM-MANUAL-SUBMISSION-GUIDE.md`, `IMMEDIATE_SEO_ACTIONS.md`, `SEO_IMPLEMENTATION_SUMMARY.md`, `AUSTRALIAN_DIRECTORY_SUBMISSIONS.md`, `BING_WEBMASTER_SETUP.md`, `GOOGLE_BUSINESS_PROFILE_SETUP.md`, `GOOGLE_SEARCH_CONSOLE_SETUP.md`, `STRIPE_SETUP_GUIDE.md`, `FUND_ME_WIDGET_FEATURES.md`), `usama-javed-perth-developer.llm`, `public/llms*.txt`, `public/ai*.{txt,md,json}`, `public/*seo*.json`, `data/query-scenarios.json`.
- Routes/pages that look experimental but are live: `src/app/api/ai-training/route.ts`, `src/app/api/ai-verification/route.ts`, `src/app/api/australia-seo/route.ts`, `src/app/api/auto-llm-training/route.ts`, `src/app/api/schedule-training/route.ts`, `src/app/api/test-free-llm/route.ts`, `src/app/api/test-openai/route.ts`, `src/app/api/indexnow/route.ts`, `src/app/api/llms/route.ts`, `src/app/test-apis/page.tsx`, `src/app/llm-training-dashboard/page.tsx`.
- Why fragile: Cross-references between these files, `next.config.ts` headers/rewrites (`/.llms` → `/api/llms`), `robots.ts`, and `sitemap.ts` form an interdependent SEO system. Renaming or moving any public file breaks served URLs that may already be indexed.
- Safe modification: Treat all `public/` filenames and route paths as frozen contracts. Add new content alongside; never rename. Owner directive: do NOT delete any of these even though several (`test-apis`, `test-openai`, `test-free-llm`, `llm-training-dashboard`) appear experimental — guard them with auth instead (see Security).

**`VisitorTracker` / `VisitorCounter` localStorage analytics:**
- Files: `src/components/VisitorTracker.tsx`, `src/components/VisitorCounter.tsx`
- Why fragile: `JSON.parse(existingData)` with no try/catch (`VisitorTracker.tsx:29`) — corrupted localStorage throws and the effect dies silently; also triggers paid-API fan-out (see Security). Counter is per-browser, not real analytics.
- Safe modification: Wrap parses in try/catch; keep visual behavior identical.

**Stripe checkout flow:**
- Files: `src/app/api/create-checkout/route.ts`, `src/components/FundMeWidget.tsx`, `src/app/fund-me/page.tsx`, `src/app/fund-me/success/page.tsx`
- Why fragile: Pinned `apiVersion: '2024-06-20'` against `stripe` v18 (type mismatch masked by `ignoreBuildErrors`); success/cancel URLs hardcoded to production; no webhook verification route exists (success page trusts `session_id` query param without server-side verification).
- Safe modification: Don't touch the apiVersion casually; test checkout in Stripe test mode after any fund-me UI change.

## Scaling Limits

**Serverless statelessness assumptions hold:** No filesystem writes detected in any API route (`grep fs./writeFile` clean); `logSubmission()` in `src/app/api/auto-llm-training/route.ts:306` only console-logs ("In a real app, you'd save this to a database"). Nothing breaks on Vercel's read-only filesystem.

**API spend scales linearly with traffic:** Because `VisitorTracker` triggers training routes from the client, AI API cost scales with visitor count when `AI_TRAINING_ENABLED=true`. Limit: budget, not infrastructure. Path: server-side cron (Vercel Cron) instead of visitor-triggered fan-out.

## Dependencies at Risk

**Next.js `^15.5.12` — deployability status:**
- Risk: Vercel blocks deployments of Next.js versions affected by the December 2025 critical React Server Components vulnerability (patched in the 15.5.7+ line for Next 15). The lockfile pins `next@15.5.12`, which is at/above the patched releases, so a deploy should NOT be blocked today.
- Caveats: (a) the caret range `^15.5.12` means a fresh `npm install` without the lockfile could resolve differently — always deploy with `package-lock.json` committed (it is); (b) verify against Vercel's current advisory list at deploy time (`npx next --version` and the Vercel dashboard security banner) since new CVEs post-date this analysis; (c) `node_modules` is not currently installed locally — run `npm ci` before any local build verification.
- Files: `package.json` (line 15), `package-lock.json`
- Migration plan: If a bump is needed, stay on latest 15.5.x patch first (lowest risk), then evaluate Next 16 separately — do not couple a major upgrade to the UI milestone.

**`stripe` v18 + hardcoded `apiVersion`:** see Fragile Areas. Bumping stripe requires re-checking the pinned API version string.

**`@emailjs/browser` + `nodemailer` dual email paths:** Contact flow uses client-side EmailJS (`src/app/contact/page.tsx`) while `/api/send-email` uses Gmail SMTP via nodemailer — two parallel email systems with separate failure modes and credentials. Neither is at immediate risk, but know both exist before restyling the contact form.

**React 19.2.4:** current and fine with Next 15.5.

## Missing Critical Features

**No rate limiting / abuse protection anywhere:**
- Problem: Every API route is open POST/GET with no throttling.
- Blocks: Safe operation of the AI endpoints at scale; see Security.

**No error boundary / not-found / loading UX:**
- Problem: No `error.tsx`, `global-error.tsx`, or `not-found.tsx` found under `src/app/`. A render error in any client component (e.g. a canvas component) white-screens the page.
- Blocks: "World-class UI" credibility — add these during the milestone.

**No Stripe webhook handler:**
- Problem: Payment confirmation relies on the success-page redirect only; no `/api/stripe-webhook` to verify `checkout.session.completed`.
- Blocks: Reliable donation records.

**Accessibility baseline missing:**
- Problem: Only 10 total `aria-*`/`role=`/`alt=` occurrences across the entire `src/` tree. Specific gaps:
  - All three canvases (`Hero3DScene.tsx`, `InteractiveGlobe.tsx`, `IdeaNetworkCanvas.tsx`) lack `aria-hidden="true"` or `role="img"` + label — screen readers hit unlabeled `<canvas>` elements.
  - `InteractiveGlobe` is drag-only (pointer events, `touchAction: none`) with no keyboard alternative and no focusability.
  - `VisitorTracker` toast (`VisitorTracker.tsx:134`) appears/disappears without `aria-live`, and leans on emoji with no text alternatives.
  - Decorative animated elements (`animate-ping` status dot in `Hero3D.tsx:46–49`, scroll indicator) lack `aria-hidden`.
  - Heavy reliance on low-contrast tokens (`--text-faint`, 10–11px tracking-wide uppercase labels in `Hero3D.tsx:95,105`) — likely WCAG AA contrast failures; audit during restyle.
  - No skip-to-content link in `src/app/layout.tsx`.
  - `prefers-reduced-motion` honored only in `ScrollReveal.tsx` and `globals.css:134`, not in any canvas component.
- Blocks: WCAG conformance; this is the largest gap between current state and "world-class UI."

## Test Coverage Gaps

**Entire codebase is untested:**
- What's not tested: Everything — no test framework, no test files, no `test` script in `package.json` (scripts are only `dev`/`build`/`start`/`lint`).
- Files: `package.json` (lines 5–10)
- Risk: The UI overhaul milestone will touch every component with zero regression safety net; combined with `ignoreBuildErrors: true`, the only gate before production is a successful `next build`.
- Priority: High — at minimum add `npx tsc --noEmit` to CI and smoke-test the build (`npm ci && npm run build`) before every deploy; consider Playwright smoke tests for `/`, `/contact`, `/fund-me`, `/budget` during the milestone.

---

*Concerns audit: 2026-06-10*
