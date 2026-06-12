# Feature Research

**Domain:** Elite developer / AI-engineer portfolio (Awwwards/FWA-tier, 2025–2026)
**Researched:** 2026-06-12
**Confidence:** MEDIUM-HIGH (WebSearch-driven, cross-verified across design-authority + accessibility-standards sources; no Context7 — this is a design/UX domain, not a library API domain)

---

## Framing: What Separates Jaw-Dropping from Merely Good

A "merely good" portfolio is clean, responsive, has projects and a contact form. A **jaw-dropping** one wins on three axes simultaneously:

1. **A signature hero moment** — one bespoke, performant, on-brand visual that says "this person can build things others can't" within 3 seconds (the Core Value in PROJECT.md).
2. **Proof over claims** — case studies that quantify impact (before/after metrics, architecture, trade-offs) instead of feature lists. For an AI engineer, this means *production* systems with observability/traces, not notebook demos.
3. **Restraint as craft** — every animation has intent, respects `prefers-reduced-motion`, pauses off-screen, and never fights the user (no scroll-jacking, no gratuitous preloaders). The 2025/2026 signal of seniority is *knowing what NOT to animate*. Data point: thoughtful micro-interactions show ~22% higher engagement, but excessive animation correlates with ~15% higher bounce.

The bar is not "more motion" in the abstract — it is *higher-fidelity, intentional* motion. This reconciles with the owner's "more polish and motion, not less" mandate: the win is replacing hand-rolled Canvas 2D with crisp WebGL/`motion`-driven moments that are demonstrably *more* controlled and accessible, not noisier.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Missing any of these and the "world best UI" claim collapses. They earn no praise but are penalized when absent.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Distinct, intentional hero moment | First 3s decide the impression; the whole Core Value rides on this | HIGH | Already exists (Hero3D/canvas). Table stakes is *having* one; differentiation is *quality*. Upgrade to WebGL or refined `motion` choreography. |
| `prefers-reduced-motion` honored everywhere | WCAG 2.2 (C39); OS-level setting must produce equivalent reduced experience | MEDIUM | Decorative motion → removed/static; status motion (loaders) → static text/icon. Already a PROJECT.md hard constraint. Non-negotiable for the accessibility claim. |
| Animations pause off-screen + on idle | Perf + battery on mobile; mobile is first-class per constraints | MEDIUM | `IntersectionObserver` gating of rAF loops. Existing IdeaNetworkCanvas/Globe must be wrapped. |
| Mobile-first responsive (incl. case-study pages) | Most recruiters/clients open portfolios on phones during breaks | MEDIUM | Test on real devices; case-study pages especially must reflow, load <2s. |
| Full keyboard navigation + visible focus states | Accessibility floor; expected of a "senior" dev | MEDIUM | All interactive elements (theme toggle, nav, cards, buttons) keyboard-reachable with visible focus ring. |
| Fast load / good Core Web Vitals | A heavy "stunning" site that janks reads as *junior* | HIGH | LCP/INP/CLS budgets. WebGL must be code-split + lazy. Hero cannot block. |
| Clear nav + persistent contact path | Visitors must reach "hire me" in one move | LOW | Already present (nav, contact, fund-me). |
| Project list → detail pages | Baseline portfolio structure | LOW | Already exists (projects/[id]); upgrade is in *content depth*, not existence. |
| Theme toggle (light/dark) persisted | Now an expected courtesy | LOW | Already exists (data-theme + CSS vars). Persist choice; respect `prefers-color-scheme` default. |
| Coherent design system (type scale, spacing, color tokens) | Consistency is the difference between "designed" and "assembled" | MEDIUM | CSS custom-property tokens already in place; tighten into a documented scale. |
| SEO / metadata / social cards | Discoverability; AI-engineer credibility | LOW | Already strong (sitemap, JSON-LD, IndexNow). Extend to new AI pages. |
| Accessible color contrast (WCAG AA) | Both themes must pass | LOW | Verify both `data-theme` palettes hit AA. |

### Differentiators (Competitive Advantage — What Makes Visitors Remember It)

These are where the portfolio *competes*. All align with Core Value: "stunned in 3s, understands full-stack AND production AI engineer."

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Signature WebGL hero (three + R3F v9) | Elevates the existing canvas hero from "nice" to Awwwards-tier; the memorable 3s | HIGH | React 19 → R3F v9 only. Must lazy-load, fall back gracefully, and have a static/reduced-motion path. The single highest-leverage upgrade. |
| AI Engineering Experience section w/ production narrative | Directly proves the "production AI engineer" half of the Core Value — the rarest, most differentiating content | MEDIUM | ESIA MCP server story (Ollama↔NetSuite OAuth/RESTlet; v1→v2 LangGraph multi-step + chunking; 250-record batching, leads-vs-customers prompts, pagination). This is the standout content asset. |
| Case studies as Problem → Architecture → Trade-offs → Impact | Quantified, narrative case studies convert far better than thumbnail grids; demonstrates senior judgment | MEDIUM | PSR / Challenge-Process-Outcome framing. Include before/after metrics, "why I chose X over Y." Apply to AI projects especially. |
| Architecture diagrams for AI systems | Visual proof of system thinking; differentiates engineer-who-ships from prompt-tinkerer | MEDIUM | Diagram MCP bridge, RAG pipeline, agent orchestration. Static SVG is enough; animated reveal optional. |
| Observability / trace screenshots for AI projects | The 2026 production-readiness signal: traces, token counts, latency, cost per step | LOW-MED | Langfuse/LangSmith-style trace screenshots prove "production," not "prototype." High credibility-per-effort. |
| Smooth page transitions (View Transitions API) | Cohesive, app-like feel between routes; an Interop-2025 focus area | MEDIUM | `document.startViewTransition` / cross-document VT. Progressive enhancement — degrades cleanly where unsupported. Must respect reduced-motion. |
| Tasteful micro-interactions (magnetic buttons, hover/cursor feedback, scroll-reveal) | The texture that reads as "crafted"; ties the whole experience together | MEDIUM | Already have ScrollReveal/InteractiveButton — upgrade fidelity via `motion` v12. Keep subtle; intent over spectacle. |
| Live/embedded demo or short Loom walkthrough per flagship AI project | "Show it working" beats describing it; 90s video is the 2026 standard for AI capstones | LOW-MED | Embedded video or a constrained live demo. For agent projects, a recorded trace/run is gold. |
| Custom branded cursor / signature interaction motif | A recognizable brand element across the site (use sparingly) | MEDIUM | Trend-positive for 2025 but easy to overdo — one tasteful motif, desktop-only, never blocking. |
| Centralized content data source feeding pages + JSON-LD + sitemap | Not user-visible but *enables* consistency at scale — the thing that lets new AI content land without 4-way drift | MEDIUM | PROJECT.md's #1 maintenance risk; underpins quality of everything above. |
| Visible "production fixes / lessons learned" detail | Honest engineering depth (batching, pagination, prompt fixes) signals seniority more than a polished happy-path | LOW | The ESIA v1→v2 fixes are exactly this — surface them, don't hide them. |

### Anti-Features (Commonly Requested, Often Problematic)

These seem impressive but actively hurt elite portfolios. Documenting to prevent scope creep and to protect the "world best UI" claim.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Scroll-jacking / hijacked scroll | "Cinematic," controls pacing | NN/g + Webflow flag it: removes user control, feels manipulative, breaks assistive tech, disorients. A top reason "stunning" sites feel bad to use. | Scroll-*triggered* reveals on native scroll. User keeps scroll control. |
| Long mandatory preloader / intro animation | "Premium" reveal, hides load | Forces a wait on a fast connection; recruiters bounce; pure friction. Reads as vanity, not craft. | Render content progressively; if any loader, make it sub-second + skippable, and a static fallback under reduced-motion. |
| Percentage skill bars ("React 85%") | Quick visual of competence | Meaningless/unverifiable; reads as junior; what does 85% mean? Widely mocked in senior hiring circles. | Group skills by domain (e.g., AI: MCP/RAG/LangGraph) tied to *where used in real projects*. Proof, not bars. |
| Gratuitous/maximal animation everywhere | "More motion = more impressive" | ~15% higher bounce; janks on mobile; buries content; the opposite of senior restraint. Conflicts with the perf constraint. | Intentional motion with hierarchy; animate to direct attention, not decorate. Reduced-motion + off-screen pause mandatory. |
| Autoplaying audio / sound-on by default | "Immersive" | Hostile; instant-close trigger; accessibility violation. | If any sound, opt-in toggle, off by default. |
| Heavy parallax stacked deep | "Depth," trendy | Janky on mobile, motion-sickness trigger, perf cost; dated when overused. | One subtle parallax layer max; gate behind reduced-motion. |
| Removing/replacing existing pages or SEO assets | "Cleaner rebuild" | PROJECT.md: prior from-scratch rebuild was rejected + rolled back; destroys SEO equity. Owner mandate: additive only. | Enhance in place; centralize content without deleting entries. |
| Horizon Digital / interview-prep content | "More portfolio depth" | PROJECT.md out-of-scope: private, reputational risk. | Omit entirely from anything public. |
| Fake/inflated AI metrics | Make projects look bigger | Easily disproven; destroys credibility with the exact technical audience being targeted. | Real numbers from the ESIA work (250-record batches, real fixes); "validated learning" framing where no hard metric exists. |
| Blocking 3D on low-end devices with no fallback | "Show off WebGL" | Excludes mobile/low-GPU visitors — the majority on phones. Breaks mobile-first constraint. | Capability-detect; serve static hero image / reduced scene; lazy-load WebGL behind it. |

---

## Feature Dependencies

```
Centralized content data source
    └──enables──> AI Engineering Experience section
    └──enables──> AI case studies (Problem→Arch→Trade-offs→Impact)
    └──feeds────> JSON-LD + sitemap consistency (no 4-way drift)

prefers-reduced-motion + off-screen-pause infrastructure
    └──required-by──> WebGL signature hero
    └──required-by──> View Transitions page transitions
    └──required-by──> micro-interactions (magnetic/cursor)
    └──required-by──> existing canvas (Globe, IdeaNetwork) upgrades

Design-system token tightening (type/spacing/color)
    └──enables──> coherent upgrade of all 17 components
    └──enables──> case-study page polish

R3F v9 / motion v12 adoption (React 19 compat verified)
    └──required-by──> WebGL hero
    └──enhances────> micro-interactions fidelity

AI case study content
    └──enhanced-by──> architecture diagrams
    └──enhanced-by──> observability/trace screenshots
    └──enhanced-by──> Loom/live demo per flagship project

Custom cursor / signature motif ──conflicts(if overdone)──> "restraint as craft"
Maximal animation ──conflicts──> Core Web Vitals / mobile-first
```

### Dependency Notes

- **Centralized content source is the spine:** the AI section, AI case studies, JSON-LD, and sitemap all consume it. It is PROJECT.md's #1 maintenance risk and must land early (or alongside) the AI content, or the same 4-way duplication is recreated with more entries.
- **Reduced-motion + off-screen-pause is a cross-cutting prerequisite,** not a feature. Every new motion feature (WebGL hero, View Transitions, micro-interactions) depends on it. Build the gating utility once; reuse everywhere.
- **R3F v9 / motion v12 must be React-19-verified before the hero upgrade** (PROJECT.md constraint). This is a hard gate on the highest-leverage differentiator.
- **Diagrams, traces, and demos *enhance* case studies** — they're cheap, high-credibility add-ons, not standalone features. Sequence them right after the case-study narrative exists.
- **Custom cursor and maximal animation are conflict risks** against the "restraint as craft" thesis and the perf constraint — cap them deliberately.

---

## MVP Definition

(Framed as milestone scope ordering, since this is an enhancement milestone on a live site.)

### Launch With (v1 — core of the "world-class upgrade")

- [ ] Reduced-motion + off-screen-pause utility, applied to all existing + new motion — *the accessibility/perf claim depends on it; cross-cutting prerequisite*
- [ ] Centralized content data source — *unblocks AI content without recreating 4-way drift*
- [ ] AI Engineering Experience section (ESIA MCP narrative) — *proves the rarest half of Core Value*
- [ ] 5 new AI projects appended as proper case studies (Problem→Arch→Trade-offs→Impact) — *the differentiating content*
- [ ] Signature hero upgrade (WebGL via R3F v9, with static/reduced fallback) — *the memorable 3 seconds*
- [ ] Design-system token tightening + component visual upgrade pass — *coherence across all 17 components*
- [ ] Verify both themes pass WCAG AA + full keyboard nav — *the accessibility floor*

### Add After Validation (v1.x)

- [ ] View Transitions API page transitions — *adds app-like cohesion once routes/content stable*
- [ ] Architecture diagrams + observability/trace screenshots on flagship AI projects — *credibility multipliers; add once narrative exists*
- [ ] Refined micro-interactions (magnetic buttons, cursor feedback) via motion v12 — *texture pass after structure is solid*

### Future Consideration (v2+)

- [ ] Embedded live demo / Loom walkthrough per flagship AI project — *high value but content-production heavy; defer until projects are written up*
- [ ] Custom branded cursor / signature motif — *trend-positive but easy to overdo; only if it earns its place without hurting restraint/perf*

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Reduced-motion + off-screen-pause utility | HIGH | MEDIUM | P1 |
| Centralized content data source | HIGH (enabling) | MEDIUM | P1 |
| AI Engineering Experience section | HIGH | MEDIUM | P1 |
| AI projects as full case studies (×5) | HIGH | MEDIUM | P1 |
| Signature WebGL hero (R3F v9) | HIGH | HIGH | P1 |
| Design-system tokens + component polish | HIGH | MEDIUM | P1 |
| WCAG AA both themes + keyboard nav | HIGH (gate) | LOW-MED | P1 |
| Architecture diagrams (AI systems) | MEDIUM-HIGH | MEDIUM | P2 |
| Observability/trace screenshots | MEDIUM-HIGH | LOW | P2 |
| View Transitions page transitions | MEDIUM | MEDIUM | P2 |
| Refined micro-interactions (motion v12) | MEDIUM | MEDIUM | P2 |
| Loom/live demo per project | MEDIUM | MEDIUM-HIGH | P3 |
| Custom branded cursor / motif | LOW-MEDIUM | MEDIUM | P3 |

**Priority key:** P1 must have for this milestone · P2 should have, add when possible · P3 nice to have, future.

---

## Competitor Feature Analysis

| Feature | Awwwards/FWA design-led portfolios | Top AI-engineer portfolios | Our Approach |
|---------|-------------------------------------|-----------------------------|--------------|
| Hero | Bespoke WebGL/Three.js + GSAP signature moment | Often plain — text + headshot | Bespoke WebGL hero (rare in AI space) → stands out on *both* fronts |
| Project presentation | Cinematic case studies, heavy motion | GitHub README + Loom + trace screenshot | Hybrid: cinematic case-study UX + AI production rigor (arch + traces) |
| Motion philosophy | Sometimes over-animates / scroll-jacks | Minimal | Intentional motion + strict reduced-motion → craft *and* accessibility |
| AI production proof | Rarely present | README + trace + 90s video | Architecture diagrams + real ESIA fixes + traces = senior production signal |
| Skills display | Visual but sometimes gimmicky | Plain tag lists | Domain-grouped, project-anchored (no percentage bars) |
| Transitions | View Transitions / barba-style | Usually none | View Transitions API, progressively enhanced + reduced-motion safe |

**Strategic gap exploited:** design-led portfolios rarely prove production AI depth; AI portfolios rarely look stunning. This portfolio's win is doing *both* — Awwwards-tier craft applied to genuine production-AI evidence.

---

## Sources

- Awwwards — Portfolio & Developer winners (technique/stack signals): https://www.awwwards.com/websites/winner_category_portfolio/ , https://www.awwwards.com/websites/developer/ (MEDIUM — inspiration index, not deep breakdowns)
- NN/g — Scrolljacking 101: https://www.nngroup.com/articles/scrolljacking-101/ (HIGH — authority on the anti-pattern)
- Webflow Accessibility Checklist — Avoid scrolljacking: https://webflow.com/accessibility/checklist/task/avoid-scrolljacking (HIGH)
- W3C WAI WCAG 2.2 C39 — prefers-reduced-motion technique: https://www.w3.org/WAI/WCAG22/Techniques/css/C39 (HIGH — standards)
- Pope Tech — Accessible animation & movement (2025): https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/ (MEDIUM-HIGH)
- prefers-reduced-motion.com: https://www.prefers-reduced-motion.com/ (MEDIUM)
- MDN — View Transition API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API (HIGH)
- Chrome for Developers — What's new in view transitions (2025): https://developer.chrome.com/blog/view-transitions-in-2025 (HIGH — Interop 2025 focus)
- Portfolio case-study structure (PSR / Problem→Process→Results, metrics): https://influenceflow.io/resources/portfolio-case-study-examples-complete-guide-with-real-world-samples/ , https://blog.opendoorscareers.com/p/how-to-write-a-strong-case-study-for-your-portfolio-in-2025-a14b (MEDIUM)
- Micro-interactions & motion trends + engagement/bounce data: https://www.noboringdesign.com/blog/examples-of-micro-interactions-in-web-design , https://webflow.com/blog/microinteractions , https://dev.to/watzon/25-web-design-trends-to-watch-in-2025-e83 (MEDIUM — figures are indicative, single-sourced)
- RAG/MCP/Agentic architecture patterns 2026: https://aetherlink.ai/en/blog/rag-mcp-and-agentic-ai-architecture-patterns-for-2026 (MEDIUM)
- AI capstone showcasing standard (README + 90s Loom + trace screenshot): https://maven.com/alexey-grigorev/from-rag-to-agents (MEDIUM)
- AI agent observability / traces as production signal (2026): https://atlan.com/know/ai-agent-observability/ , https://www.digitalapplied.com/blog/ai-agent-observability-2026-tracing-monitoring-stack-guide (MEDIUM-HIGH)

---
*Feature research for: elite developer / AI-engineer portfolio*
*Researched: 2026-06-12*
