# 03 Token Usage Audit — faint / ghost / muted (Strategy A + B)

Resolves Research Open Question 1: which `--text-faint` / `--text-ghost` / `--text-muted`
usages are **information-bearing** (must read at WCAG AA, ratio >= 4.5) versus **decorative**
(divider / ghost numeral / icon / large display — may stay below 4.5 under Strategy A).

This document drives **Plan 03-01**'s per-usage relabels and the single `globals.css`
token-value nudges. Re-run `node scripts/contrast-check.mjs` after 03-01 to confirm.

---

## 1. Summary counts (src/ only, CSS definitions excluded)

| Token            | src usages | CSS defs | Current DARK value (ratio over #0a0a0f) | Current LIGHT value (ratio over #f8fafc) |
| ---------------- | ---------- | -------- | --------------------------------------- | ---------------------------------------- |
| `--text-faint`   | 34         | 2        | `rgba(255,255,255,0.2)` ≈ **1.77 FAIL** | `#94a3b8` ≈ **2.99 FAIL**                |
| `--text-ghost`   | 5          | 2        | `rgba(255,255,255,0.15)` ≈ **1.49**     | `#cbd5e1` ≈ **1.49** (decorative)        |
| `--text-muted`   | 81         | 2        | `rgba(255,255,255,0.3)` ≈ **2.92 FAIL** | `#64748b` ≈ **4.55 PASS**                |

**Headline finding:** Both `--text-muted` (dark) and `--text-faint` (both themes) currently
**fail AA** at their token-definition level. The cheapest, highest-leverage fixes are two
**globals.css value nudges** (not per-file edits):

1. **dark `--text-muted`**: `rgba(255,255,255,0.3)` → `rgba(255,255,255,0.45)` (2.92 → **4.50 PASS**).
   This single nudge fixes ALL 81 muted usages in dark theme with **zero per-file changes**.
2. **`--text-faint`**: dark stays low (decorative contract) **but** every *information-bearing*
   faint usage must be **promoted to `--text-muted`** per the table in §2. Light `--text-faint`
   token is also re-pointed `#94a3b8` → `#64748b` (2.99 → **4.55 PASS**) to cover any faint
   usage left un-promoted and to make the decorative/info split safe in light theme.

Strategy: **A (keep decorative tokens low)** + **B (promote info-bearing usages a tier)**.

---

## 2. Per-usage decision table — `--text-faint` (the high-risk tier)

Legend — **action**: `PROMOTE→muted` (relabel usage to `var(--text-muted)`), `KEEP` (decorative,
stays faint under Strategy A).

| file:line                                         | text it colors                          | role        | action       |
| ------------------------------------------------- | --------------------------------------- | ----------- | ------------ |
| `components/Hero3D.tsx:67`                         | "8+ years building enterprise…" caption | TEXT        | PROMOTE→muted |
| `components/Hero3D.tsx:95`                         | stat label (10px uppercase "Projects")  | TEXT        | PROMOTE→muted |
| `components/Hero3D.tsx:105`                        | "Scroll" indicator label                | decorative  | KEEP          |
| `components/Hero3D.tsx:106`                        | gradient divider (background, not text) | decorative  | KEEP          |
| `components/Footer.tsx:18`                         | footer intro paragraph                  | TEXT        | PROMOTE→muted |
| `components/Footer.tsx:35`                         | footer nav links                        | TEXT        | PROMOTE→muted |
| `components/Footer.tsx:47`                         | footer contact list                     | TEXT        | PROMOTE→muted |
| `components/Footer.tsx:73`                         | footer link                             | TEXT        | PROMOTE→muted |
| `components/Footer.tsx:86`                         | copyright line                          | TEXT        | PROMOTE→muted |
| `components/FAQ.tsx:107`                           | FAQ helper text                         | TEXT        | PROMOTE→muted |
| `components/LastUpdated.tsx:11`                    | freshness timestamp text                | TEXT        | PROMOTE→muted |
| `components/TeamSection.tsx:123`                   | inactive social icon (toggled w/ blue)  | decorative  | KEEP          |
| `components/TeamSection.tsx:132/137/142`           | social link icons (twitter/li/github)   | decorative  | KEEP          |
| `components/TeamSection.tsx:183`                   | member role caption                     | TEXT        | PROMOTE→muted |
| `app/page.tsx:234`                                 | 10px uppercase section label            | TEXT        | PROMOTE→muted |
| `app/page.tsx:237`                                 | "↗" arrow glyph                         | decorative  | KEEP          |
| `app/page.tsx:302`                                 | CTA supporting paragraph                | TEXT        | PROMOTE→muted |
| `app/page.tsx:336/338`                             | hover-toggled link (faint↔hover color)  | TEXT        | PROMOTE→muted |
| `app/fund-me/page.tsx:172`                         | globe section description               | TEXT        | PROMOTE→muted |
| `app/fund-me/page.tsx:183`                         | "Drag to explore" hint label            | decorative  | KEEP          |
| `app/fund-me/page.tsx:205`                         | stat label (10px uppercase)             | TEXT        | PROMOTE→muted |
| `app/fund-me/page.tsx:252`                         | "AUD" currency suffix                   | TEXT        | PROMOTE→muted |
| `app/fund-me/page.tsx:254`                         | donation option description             | TEXT        | PROMOTE→muted |
| `app/fund-me/page.tsx:315`                         | info/notice box body text               | TEXT        | PROMOTE→muted |
| `app/fund-me/page.tsx:354`                         | secure-payment fine print               | TEXT        | PROMOTE→muted |
| `app/ideas/page.tsx:199`                           | section description                     | TEXT        | PROMOTE→muted |
| `app/ideas/page.tsx:240`                           | stat label (10px uppercase)             | TEXT        | PROMOTE→muted |
| `app/ideas/page.tsx:302`                           | category description (11px)             | TEXT        | PROMOTE→muted |
| `app/developer-australia/page.tsx:167`             | page footer text                        | TEXT        | PROMOTE→muted |
| `app/blog/best-developer-perth/page.tsx:327`       | article footer text                     | TEXT        | PROMOTE→muted |
| `app/blog/ai-developer-perth/page.tsx:144`         | article footer text                     | TEXT        | PROMOTE→muted |

**`--text-faint` tally:** 34 usages → **24 PROMOTE→muted** (information-bearing) /
**10 KEEP** (decorative: scroll label, gradient divider, social/arrow glyphs, drag hint).

---

## 3. Per-usage decision table — `--text-ghost` (5 usages)

| file:line                       | text it colors                          | role       | action       |
| ------------------------------- | --------------------------------------- | ---------- | ------------ |
| `components/Footer.tsx:87`      | "Perth, Australia" tagline              | TEXT       | PROMOTE→muted |
| `components/TeamSection.tsx:116`| inactive tab label (toggles w/ primary) | decorative | KEEP          |
| `components/TeamSection.tsx:179`| 4xl ghost initial/numeral (display)     | decorative | KEEP          |
| `app/team/page.tsx:121`         | 3xl ghost initial/numeral (display)     | decorative | KEEP          |
| `app/team/page.tsx:125`         | member role caption (text-sm)           | TEXT       | PROMOTE→muted |

**`--text-ghost` tally:** 5 usages → **2 PROMOTE→muted** / **3 KEEP** (large display numerals +
toggled tab label remain under the documented decorative contract).

---

## 4. `--text-muted` (81 usages) — value-fix, no per-file relabels

`--text-muted` is the canonical "secondary body" tier and is used pervasively (81 usages across
13 files: ideas 16, page 11, Navigation 9, blog×2 16, fund-me 6, developer-australia 6, FAQ 5,
Footer 3, TeamSection 2, Hero3D 2, team 2, InteractiveButton 1).

- **Light theme:** already `#64748b` ≈ **4.55 PASS** — no change.
- **Dark theme:** currently `rgba(255,255,255,0.3)` ≈ **2.92 FAIL** → nudge to
  `rgba(255,255,255,0.45)` ≈ **4.50 PASS**. **One-line globals.css fix corrects all 81 usages.**

No per-file muted relabels are required.

---

## 5. Decorative-token contract (Strategy A — documented, not asserted >= 4.5)

These remain below 4.5 by design; the contrast script prints them as `DECORATIVE`:

- `--text-faint` (dark, white@0.2) — only for KEPT decorative usages in §2.
- `--text-ghost` (both themes) — large display numerals + toggled labels (§3 KEEPs).
- `--text-tertiary` (dark, white@0.4, ratio 3.77) — large/heading use only.

---

## 6. Action list for Plan 03-01 (exhaustive)

**A. globals.css token-value nudges (2 edits, fixes the majority):**
1. dark `--text-muted`: `rgba(255,255,255,0.3)` → `rgba(255,255,255,0.45)`.
2. light `--text-faint`: `#94a3b8` → `#64748b` (safety net for any un-promoted faint).
   (Plus the accent-as-text light promotions tracked in 03-01: `--accent-blue/violet/emerald`.)

**B. Per-usage faint→muted promotions (24 usages):** every row marked `PROMOTE→muted` in §2.

**C. Per-usage ghost→muted promotions (2 usages):** `Footer.tsx:87`, `team/page.tsx:125` (§3).

**D. Keep-as-is (Strategy A, 13 usages):** all `KEEP` rows in §2 and §3 — decorative, documented.

**Verification gate for 03-01:** `node scripts/contrast-check.mjs` exits 0, and a grep confirms
no information-bearing `var(--text-faint)` / `var(--text-ghost)` remain at the §2/§3 PROMOTE lines.
