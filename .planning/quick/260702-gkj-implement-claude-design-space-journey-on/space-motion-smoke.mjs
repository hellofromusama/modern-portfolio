// space-motion-smoke.mjs — re-runnable Playwright motion smoke for /space.
//
// WHAT IT PROVES (against a RUNNING server): the loader fades, scroll drives the
// camera dive (--space-scroll rises ~0 -> ~1), the 6 floated <Html> panels render
// REAL content (Hero "Usama Javed" + a project gridTitle + a skills group + team
// names), click/nav-to-fly changes --space-scroll, and the theme toggle swaps the
// HUD accent. Saves >=3 scroll screenshots + 1 post-theme screenshot.
//
// RUN COMMAND (the ORCHESTRATOR runs this — the executor only authors + node --check):
//   1. Start a server first, e.g.  npm run build && npm run start   (or npm run dev)
//   2. Then, from the scratchpad Playwright harness dir (so `playwright` resolves):
//        cd "C:/Users/USAMA~1.JAV/AppData/Local/Temp/claude/C--Users-Usama-Javed/f6c04630-64d7-4165-91c9-bbf7953edde1/scratchpad/pw-record"
//        node "C:/Users/Usama.Javed/Desktop/modern-portfolio/.planning/quick/260702-gkj-implement-claude-design-space-journey-on/space-motion-smoke.mjs"
//      OR set NODE_PATH and run from anywhere:
//        NODE_PATH="C:/Users/USAMA~1.JAV/AppData/Local/Temp/claude/C--Users-Usama-Javed/f6c04630-64d7-4165-91c9-bbf7953edde1/scratchpad/pw-record/node_modules" \
//          node "<abs path to this script>"
//
// ENV:
//   BASE_URL   default http://localhost:3000
//   OUT_DIR    default this script's own directory (the quick task dir)
//
// CONTRACT: prints `SMOKE PASS` + exit 0 on success; `SMOKE FAIL: <reason>` + exit 1
// on any failed assertion. Uses the SESSION SCRATCHPAD Playwright — the repo
// package.json gains NO dependency (Karpathy: additive, dependency-clean).

import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUT_DIR = process.env.OUT_DIR || dirname(fileURLToPath(import.meta.url));

const shot = (page, name) => page.screenshot({ path: join(OUT_DIR, name) });
const readScroll = (page) =>
  page.evaluate(
    () =>
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--space-scroll")
      ) || 0
  );
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fail(msg) {
  console.log(`SMOKE FAIL: ${msg}`);
  process.exitCode = 1;
}

async function run() {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    // BEAT the visibility gate — the experience pauses its frameloop when hidden.
    await page.bringToFront();

    await page.goto(`${BASE_URL}/space`, { waitUntil: "networkidle" });
    await page.waitForSelector("canvas", { timeout: 20000 });
    // Let the loader (~1.5s) count to 100 and fade out.
    await sleep(2600);

    // ---- CAMERA DIVE: scroll must raise --space-scroll ~0 -> ~1 ----
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(500);
    const top = await readScroll(page);
    await shot(page, "space-smoke-1-top.png");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await sleep(900);
    await shot(page, "space-smoke-2-mid.png");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(1400); // let the eased t catch up
    const bottom = await readScroll(page);
    await shot(page, "space-smoke-3-bottom.png");

    if (!(bottom > top + 0.3 && bottom > 0.6)) {
      fail(`scroll did not drive the dive (top=${top.toFixed(3)}, bottom=${bottom.toFixed(3)})`);
    } else {
      console.log(`camera dive OK: --space-scroll ${top.toFixed(3)} -> ${bottom.toFixed(3)}`);
    }

    // ---- REAL CONTENT: the floated panels must show real text ----
    const body = await page.evaluate(() => document.body.innerText);
    const required = [
      "Usama Javed", // Hero
      "MCP NetSuite-Ollama Bridge", // a project gridTitle (projects.ts)
      "AI Protocols & Agents", // a skills group title (skills.ts)
      "Abdullah Shaukat", // a TeamSection member name
    ];
    const missing = required.filter((s) => !body.includes(s));
    if (missing.length) {
      fail(`missing real content: ${missing.join(" | ")}`);
    } else {
      console.log("real content OK: Hero + project + skills group + team name present");
    }

    // ---- CLICK/NAV-TO-FLY: nav changes --space-scroll ----
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(700);
    const before = await readScroll(page);
    // Click the "Projects" HUD nav link (button text match).
    const navBtn = page.getByRole("button", { name: "Projects" });
    if ((await navBtn.count()) > 0) {
      await navBtn.first().click();
    } else {
      // Fallback: click the canvas center (a planet) to fly.
      await page.locator("canvas").click({ position: { x: 720, y: 450 } });
    }
    await sleep(1500);
    const after = await readScroll(page);
    if (Math.abs(after - before) < 0.05) {
      fail(`click/nav did not fly (before=${before.toFixed(3)}, after=${after.toFixed(3)})`);
    } else {
      console.log(`click-to-fly OK: --space-scroll ${before.toFixed(3)} -> ${after.toFixed(3)}`);
    }

    // ---- THEME TOGGLE: HUD accent swaps ----
    const accentBefore = await page.evaluate(
      () => getComputedStyle(document.querySelector('[style*="--hud-accent"]')).getPropertyValue("--hud-accent").trim()
    );
    const themeBtn = page.getByRole("button", { name: "Toggle theme accent" });
    if ((await themeBtn.count()) > 0) {
      await themeBtn.first().click();
      await sleep(400);
      const accentAfter = await page.evaluate(
        () => getComputedStyle(document.querySelector('[style*="--hud-accent"]')).getPropertyValue("--hud-accent").trim()
      );
      await shot(page, "space-smoke-4-theme.png");
      if (accentBefore === accentAfter) {
        fail(`theme toggle did not swap accent (stayed ${accentBefore})`);
      } else {
        console.log(`theme toggle OK: --hud-accent ${accentBefore} -> ${accentAfter}`);
      }
    } else {
      fail("theme toggle button not found");
    }

    if (process.exitCode === 1) return;
    console.log(
      "SMOKE PASS — camera dive + real content (Hero/project/skills/team) + click-to-fly + theme swap"
    );
  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.log(`SMOKE FAIL: ${e && e.stack ? e.stack : e}`);
  process.exit(1);
});
