// Space Mode toggle smoke test (ORCHESTRATOR-run via a scratchpad Playwright install).
//
// Proves the cookie-driven classic<->space SSR switch on 3 gated routes + the homepage,
// AND that the global root-layout launcher enters space mode on a NAV-LESS classic route.
//
// The executor validates this file with `node --check` ONLY — it never installs
// playwright and playwright is NOT added to package.json. Run it later against a live
// server:  BASE_URL=http://localhost:3000 node space-mode-toggle-smoke.mjs
//
// Assertions per route:
//   (a) DEFAULT  (fresh context, NO cookie)      -> CLASSIC: no <canvas>, no --space-scroll
//   (b) COOKIE   (space-mode=on, reload same url) -> DIVE:    <canvas> exists AND --space-scroll present (SSR read the cookie)
//   (c) CLEARED  (cookie removed, reload)          -> CLASSIC again: no <canvas>
// Plus a LAUNCHER check on the nav-less /services classic page: the floating launcher is
// present, and clicking it transitions the page into DIVE without relying on page nav.

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ROUTES = ["/services", "/contact", "/projects/kashmir-fund", "/"];

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

// --space-scroll is set on <html> by the space engine's CameraRig once the dive mounts.
async function hasSpaceScroll(page) {
  return page.evaluate(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--space-scroll");
    return v != null && v.trim() !== "";
  });
}

async function hasCanvas(page) {
  return (await page.locator("canvas").count()) > 0;
}

// Wait up to `timeout` for the dive to hydrate (ssr:false chunk + CameraRig var).
async function waitForDive(page, timeout = 15000) {
  try {
    await page.waitForFunction(
      () => {
        const hasCanvasEl = document.querySelector("canvas") != null;
        const v = getComputedStyle(document.documentElement).getPropertyValue("--space-scroll");
        return hasCanvasEl && v != null && v.trim() !== "";
      },
      { timeout }
    );
    return true;
  } catch {
    return false;
  }
}

async function run() {
  const browser = await chromium.launch();

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`;
    const cookieUrl = new URL(BASE_URL);

    // (a) DEFAULT -> CLASSIC
    {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: "networkidle" });
      const canvas = await hasCanvas(page);
      const spaceVar = await hasSpaceScroll(page);
      record(`${route} (a) default=classic`, !canvas && !spaceVar, `canvas=${canvas} spaceScroll=${spaceVar}`);
      await ctx.close();
    }

    // (b) COOKIE -> DIVE (SSR reads the cookie on first load)
    {
      const ctx = await browser.newContext();
      await ctx.addCookies([
        { name: "space-mode", value: "on", domain: cookieUrl.hostname, path: "/" },
      ]);
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: "networkidle" });
      const dive = await waitForDive(page);
      record(`${route} (b) cookie=dive`, dive, `canvas+spaceScroll=${dive}`);
      await ctx.close();
    }

    // (c) CLEARED -> CLASSIC again
    {
      const ctx = await browser.newContext();
      await ctx.addCookies([
        { name: "space-mode", value: "on", domain: cookieUrl.hostname, path: "/" },
      ]);
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: "networkidle" });
      await ctx.clearCookies();
      await page.goto(url, { waitUntil: "networkidle" });
      const canvas = await hasCanvas(page);
      record(`${route} (c) cleared=classic`, !canvas, `canvas=${canvas}`);
      await ctx.close();
    }
  }

  // LAUNCHER check on the nav-less /services classic page.
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/services`, { waitUntil: "networkidle" });
    const launcher = page.getByRole("button", { name: /Enter Space Mode/i });
    let visible = false;
    try {
      await launcher.waitFor({ state: "visible", timeout: 10000 });
      visible = true;
    } catch {
      visible = false;
    }
    record("/services launcher present (nav-less classic)", visible, `visible=${visible}`);

    if (visible) {
      await launcher.click();
      const dive = await waitForDive(page);
      record("/services launcher click -> dive", dive, `canvas+spaceScroll=${dive}`);
    } else {
      record("/services launcher click -> dive", false, "launcher not visible, skipped click");
    }
    await ctx.close();
  }

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length > 0) {
    console.error(`FAILED: ${failed.map((f) => f.name).join(", ")}`);
    process.exit(1);
  }
  process.exit(0);
}

run().catch((err) => {
  console.error("Smoke run crashed:", err);
  process.exit(1);
});
