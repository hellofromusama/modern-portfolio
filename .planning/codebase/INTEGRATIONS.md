# External Integrations

**Analysis Date:** 2026-06-10

## APIs & External Services

**Payments — Stripe:**
- `src/app/api/create-checkout/route.ts` - POST creates a Stripe Checkout Session (AUD, one-time payment, min $1)
  - SDK/Client: `stripe` 18.5.0 (server-side), API version pinned `2024-06-20`
  - Auth: `STRIPE_SECRET_KEY` (gracefully returns 503 if missing/placeholder)
  - Success/cancel URLs **hardcoded** to `https://www.usamajaved.com.au/fund-me/success` and `/fund-me?canceled=true`
  - Consumer: `src/app/fund-me/page.tsx` calls `fetch('/api/create-checkout')` then redirects to `session.url`
  - `src/components/FundMeWidget.tsx` is navigation-only (routes to `/fund-me`); does not touch Stripe
  - `@stripe/stripe-js` 7.9.0 is installed but unused (no `loadStripe` anywhere)
  - **No Stripe webhook handler exists** - payment confirmation relies solely on the success redirect
  - Setup doc: `STRIPE_SETUP_GUIDE.md`

**Email — two parallel systems:**
1. EmailJS (client-side):
   - Used in `src/app/contact/page.tsx` (lines 30-52) and `src/app/ideas/page.tsx` (lines 34-76)
   - Public key `5eLu74wM2kSgwd6fT`, service `service_gk2ggy2`, templates `template_f6wbh0a` (contact) and `template_k0jvdur` (auto-reply) - all **hardcoded in client code** (public by EmailJS design, but not configurable via env)
2. Nodemailer / Gmail SMTP (server-side):
   - `src/app/api/send-email/route.ts` - POST sends contact form email via `service: 'gmail'`
   - Auth: `EMAIL_USER` (fallback: `hellofromusama@gmail.com`), `EMAIL_PASS` (fallback is a placeholder string - route fails without real app password)
   - Recipient hardcoded: `hellofromusama@gmail.com`

**AI Provider APIs (LLM "training"/chat routes):**
- `src/app/api/auto-llm-training/route.ts` (408 lines) - submits daily scenario batches from `data/query-scenarios.json` to:
  - OpenAI `api.openai.com/v1/chat/completions` - `OPENAI_API_KEY`
  - Grok/xAI `api.x.ai` - `GROK_API_KEY`
  - HuggingFace `huggingface.co` inference - `HUGGINGFACE_API_KEY`
  - Google `generativelanguage.googleapis.com` - `GOOGLE_AI_API_KEY`
  - Anthropic - `ANTHROPIC_API_KEY` referenced but stubbed ("API key not configured" mock)
  - Master switch: `AI_TRAINING_ENABLED === 'true'`
- `src/app/api/ai-training/route.ts` - fire-and-forget background submission of an inline training dataset to the same providers
- `src/app/api/schedule-training/route.ts` - daily scheduler gate (`AI_TRAINING_ENABLED`, `AUTO_SUBMIT_DAILY`, `SUBMISSION_INTERVAL_HOURS`); self-calls `/api/auto-llm-training` using `NEXT_PUBLIC_SITE_URL` (fallback `http://localhost:3000`)
- `src/app/api/budget-estimate/route.ts` - AI chat fallback chain: OpenAI → Grok → HuggingFace → mock Claude; consumed by `src/app/budget/page.tsx`
- `src/app/api/test-openai/route.ts` - smoke test calling `gpt-3.5-turbo`
- `src/app/api/test-free-llm/route.ts` - connectivity test against `httpbin.org/json` and HuggingFace `gpt2`
- Test UI: `src/app/test-apis/page.tsx`; dashboard: `src/app/llm-training-dashboard/page.tsx`
- **Client-side trigger:** `src/components/VisitorTracker.tsx` fires `fetch('/api/schedule-training')` and `fetch('/api/auto-llm-training')` from visitors' browsers (lines 79, 92)

**Search Engine Indexing — IndexNow:**
- `src/app/api/indexnow/route.ts` - POST submits ~20 hardcoded URLs to `https://api.indexnow.org/indexnow` (Bing/Copilot)
- Auth: `INDEXNOW_KEY` (fallback `usamajaved-indexnow-key-2026`); key verification file: `public/usamajaved-indexnow-key-2026.txt`

**SEO/AI-discovery endpoints (no external calls, served content):**
- `src/app/api/llms/route.ts` - markdown profile for LLMs; rewrite `/.llms` → `/api/llms` in `next.config.ts`
- `src/app/api/australia-seo/route.ts` - Schema.org JSON-LD graph (note: uses older `usamajaved.com` domain)
- `src/app/api/ai-verification/route.ts` - structured profile JSON for AI verification
- Static AI files in `public/`: `llms.txt`, `llms-full.txt`, `llms-ctx.txt`, `llms-ctx-full.txt`, `llms.json`, `ai.txt`, `ai-context.md`, `ai-training-dataset.txt`, `feed.xml`, `humans.txt`, `manifest.json`, `sitemap-australia.xml` - custom Content-Type/Cache headers set in `next.config.ts`
- Dynamic: `src/app/robots.ts`, `src/app/sitemap.ts`

## Data Storage

**Databases:**
- None. No ORM, no DB client. "Visitor counting" uses `localStorage` only (`src/components/VisitorCounter.tsx`, `src/components/VisitorTracker.tsx`)

**File Storage:**
- Local/static only (`public/`)

**Caching:**
- HTTP cache headers via `next.config.ts`; no external cache service

## Authentication & Identity

**Auth Provider:**
- None. Site is fully public; API routes are unauthenticated (including the LLM-training and email routes)

## Monitoring & Observability

**Error Tracking:**
- None (console.error only; stripped in production by `compiler.removeConsole`)

**Analytics:**
- Google Analytics (gtag.js via `next/script`, lazyOnload): `src/components/GoogleAnalytics.tsx`
  - **Currently dormant** - component is defined but not rendered in `src/app/layout.tsx` or any page; no GA measurement ID exists in the codebase

## CI/CD & Deployment

**Hosting:**
- Vercel Edge Network (per `README.md`)

**CI Pipeline:**
- None. `.github/` contains only Copilot/Codacy instruction files, no workflows

## Environment Configuration

**Required env vars (all read in API routes; none committed):**
- `STRIPE_SECRET_KEY` - Stripe checkout (`src/app/api/create-checkout/route.ts`)
- `EMAIL_USER`, `EMAIL_PASS` - Gmail SMTP (`src/app/api/send-email/route.ts`)
- `OPENAI_API_KEY`, `GROK_API_KEY`, `HUGGINGFACE_API_KEY`, `GOOGLE_AI_API_KEY`, `ANTHROPIC_API_KEY` - AI routes
- `AI_TRAINING_ENABLED`, `AUTO_SUBMIT_DAILY`, `SUBMISSION_INTERVAL_HOURS` - training scheduler flags
- `INDEXNOW_KEY` - IndexNow submissions
- `NEXT_PUBLIC_SITE_URL` - self-referencing fetch in `src/app/api/schedule-training/route.ts`

**Secrets location:**
- No `.env*` files in repo (expected to live in Vercel project settings). EmailJS IDs and the IndexNow key are hardcoded (both are public-by-design values)

## Webhooks & Callbacks

**Incoming:**
- None. Notably no Stripe webhook endpoint (no `checkout.session.completed` handling)

**Outgoing:**
- IndexNow ping to `api.indexnow.org` (`src/app/api/indexnow/route.ts`)
- AI-provider submissions from training routes (OpenAI, xAI, HuggingFace, Google)
- Stripe redirect callbacks: success/cancel URLs on `usamajaved.com.au`

## Third-Party Scripts

- `https://www.googletagmanager.com/gtag/js` (only if `GoogleAnalytics` gets mounted - currently unused)
- No other external `<script>` tags; all JSON-LD structured data is inline in `src/app/layout.tsx`

## Notes for the UI Upgrade Milestone

- Adding `framer-motion`/`motion` or `three` introduces no integration conflicts; nothing external depends on the current canvas implementations (`src/components/Hero3DScene.tsx` is self-contained)
- Preserve the `next.config.ts` headers/rewrites block untouched - the entire AI-SEO infrastructure (llms.txt family, feed.xml, IndexNow key file) depends on it
- Any redesign of `src/app/contact/page.tsx` or `src/app/ideas/page.tsx` must keep the EmailJS service/template IDs (or migrate both forms to `/api/send-email` deliberately)
- `src/app/fund-me/page.tsx` is the only Stripe consumer; keep the `/api/create-checkout` request contract (`{ amount, label, message }`)

---

*Integration audit: 2026-06-10*
