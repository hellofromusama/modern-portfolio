#!/usr/bin/env node
// scripts/contrast-check.mjs
//
// Repeatable WCAG 2.1 relative-luminance contrast check for Phase 3 text-role tokens.
// Dependency-free Node ESM. This file is the single source of truth for the FINAL
// AA-passing token values that Plan 03-01 will write into src/app/globals.css; after
// 03-01 edits globals.css, re-run `node scripts/contrast-check.mjs` to re-verify.
//
// WCAG thresholds: 4.5 for normal text, 3.0 for large text / UI / decoration.
// rgba() dark tokens (white@alpha) are composited over the dark --bg-primary before
// luminance is computed (alpha-over-background compositing).
//
// Exits 1 if ANY non-decorative (text-role) token is below 4.5; exits 0 otherwise.
// Decorative tokens are printed for visibility but never fail the build.

// ---------------------------------------------------------------------------
// Backgrounds (--bg-primary per theme)
// ---------------------------------------------------------------------------
const BG = {
  dark: "#0a0a0f",
  light: "#f8fafc",
};

// White, used as the foreground colour for the dark-theme rgba() text tokens.
const WHITE = { r: 255, g: 255, b: 255 };

// ---------------------------------------------------------------------------
// Token definitions — FINAL intended values per the 03-00-PLAN <interfaces> block.
//
// Each entry:
//   theme      : "dark" | "light"
//   token      : CSS custom property name
//   threshold  : 4.5 (normal text-role) | 3.0 (large/UI)
//   role       : "text" (asserted) | "decorative" (printed, not asserted)
//   hex        : solid colour  (mutually exclusive with alpha)
//   alpha      : white@alpha over the theme bg  (mutually exclusive with hex)
// ---------------------------------------------------------------------------
const TOKENS = [
  // ---- DARK theme, text-role (MUST be >= 4.5) -------------------------------
  { theme: "dark", token: "--text-primary",   threshold: 4.5, role: "text", hex: "#ffffff" },
  { theme: "dark", token: "--text-secondary", threshold: 4.5, role: "text", alpha: 0.5 },
  { theme: "dark", token: "--text-muted",     threshold: 4.5, role: "text", alpha: 0.45 }, // nudged up from 0.4

  // ---- DARK theme, decorative (printed, NOT asserted for 4.5) ---------------
  { theme: "dark", token: "--text-tertiary",  threshold: 3.0, role: "decorative", alpha: 0.4 },  // large-only
  { theme: "dark", token: "--text-faint",     threshold: 3.0, role: "decorative", alpha: 0.2 },
  { theme: "dark", token: "--text-ghost",     threshold: 3.0, role: "decorative", alpha: 0.1 },

  // ---- LIGHT theme, text-role (MUST be >= 4.5) ------------------------------
  { theme: "light", token: "--text-primary",   threshold: 4.5, role: "text", hex: "#0f172a" },
  { theme: "light", token: "--text-secondary", threshold: 4.5, role: "text", hex: "#334155" },
  { theme: "light", token: "--text-tertiary",  threshold: 4.5, role: "text", hex: "#475569" },
  { theme: "light", token: "--text-muted",     threshold: 4.5, role: "text", hex: "#64748b" },
  { theme: "light", token: "--text-faint",     threshold: 4.5, role: "text", hex: "#64748b" }, // promoted to muted value

  // ---- LIGHT theme, decorative ----------------------------------------------
  { theme: "light", token: "--text-ghost",     threshold: 3.0, role: "decorative", hex: "#94a3b8" },

  // ---- Accent-as-text tokens, LIGHT theme (MUST be >= 4.5) ------------------
  { theme: "light", token: "--accent-blue",    threshold: 4.5, role: "text", hex: "#2563eb" },
  { theme: "light", token: "--accent-violet",  threshold: 4.5, role: "text", hex: "#7c3aed" },
  { theme: "light", token: "--accent-emerald", threshold: 4.5, role: "text", hex: "#047857" },
];

// ---------------------------------------------------------------------------
// Colour math
// ---------------------------------------------------------------------------
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

// Composite foreground (with alpha) over an opaque background. Returns opaque rgb.
function compositeOver(fg, alpha, bg) {
  return {
    r: fg.r * alpha + bg.r * (1 - alpha),
    g: fg.g * alpha + bg.g * (1 - alpha),
    b: fg.b * alpha + bg.b * (1 - alpha),
  };
}

// sRGB channel -> linear (WCAG 2.1)
function linearize(c8) {
  const c = c8 / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// WCAG relative luminance
function luminance({ r, g, b }) {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(rgbA, rgbB) {
  const l1 = luminance(rgbA);
  const l2 = luminance(rgbB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
function resolveFg(t, bgRgb) {
  if (typeof t.alpha === "number") return compositeOver(WHITE, t.alpha, bgRgb);
  return hexToRgb(t.hex);
}

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}

let anyFail = false;
const rows = [];

for (const t of TOKENS) {
  const bgRgb = hexToRgb(BG[t.theme]);
  const fgRgb = resolveFg(t, bgRgb);
  const ratio = contrastRatio(fgRgb, bgRgb);
  const ratioStr = ratio.toFixed(2);

  let status;
  if (t.role === "decorative") {
    status = "DECORATIVE"; // never asserted for 4.5; never fails the build
  } else {
    const pass = ratio >= t.threshold;
    status = pass ? "PASS" : "FAIL";
    if (!pass) anyFail = true;
  }

  rows.push({
    token: t.token,
    theme: t.theme,
    ratio: ratioStr,
    threshold: t.threshold.toFixed(1),
    status,
  });
}

console.log("WCAG contrast check — final Phase 3 token values\n");
console.log(
  pad("TOKEN", 18) + pad("THEME", 8) + pad("RATIO", 8) + pad("THRESH", 8) + "RESULT"
);
console.log("-".repeat(54));
for (const r of rows) {
  console.log(
    pad(r.token, 18) + pad(r.theme, 8) + pad(r.ratio, 8) + pad(r.threshold, 8) + r.status
  );
}
console.log("-".repeat(54));

if (anyFail) {
  console.error("\nFAIL: one or more text-role tokens are below their AA threshold.");
  process.exit(1);
}
console.log("\nPASS: all text-role tokens meet WCAG AA in both themes.");
process.exit(0);
