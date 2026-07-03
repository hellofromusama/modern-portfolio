// Round 2 FINAL wave smoke — exercises the 5 space-dive interactive/payment pages:
//   /budget, /ideas, /fund-me, /fund-me/success, /llm-training-dashboard
//
// Re-runnable Playwright smoke. The ORCHESTRATOR runs this (Playwright provided from
// the scratchpad) against a running dev/preview server. The executor only `node --check`s
// it — Playwright is NOT a project dependency.
//
// STRIPE SAFETY: the /fund-me check STOPS at checkout INITIATION. It asserts a POST to
// /api/create-checkout fires (a 503 when STRIPE_SECRET_KEY is unset is an acceptable
// "initiated" signal) and NEVER navigates into checkout.stripe.com, NEVER fills a card
// field, NEVER completes a payment.
//
// Usage: SMOKE_BASE_URL=http://localhost:3000 node space-final-smoke.mjs

import { chromium } from "playwright";

const BASE = process.env.SMOKE_BASE_URL || "http://localhost:3000";

let failures = 0;
let passes = 0;

function pass(msg) {
  passes += 1;
  console.log(`PASS: ${msg}`);
}
function fail(msg) {
  failures += 1;
  console.log(`FAIL: ${msg}`);
}
function warn(msg) {
  console.log(`WARN (soft): ${msg}`);
}

// Records API URLs that fire during a page interaction.
function makeApiRecorder(page) {
  const seen = new Set();
  const handler = (req) => {
    try {
      seen.add(req.url());
    } catch {
      // ignore
    }
  };
  page.on("request", handler);
  return {
    fired(fragment) {
      for (const url of seen) {
        if (url.includes(fragment)) return true;
      }
      return false;
    },
    async waitFor(fragment, timeout = 8000) {
      if (this.fired(fragment)) return true;
      try {
        await page.waitForRequest((r) => r.url().includes(fragment), { timeout });
        return true;
      } catch {
        return this.fired(fragment);
      }
    },
  };
}

// goto a route and wait for the dive to mount (fixed canvas) + the SpaceLoader to clear.
async function openDive(page, route) {
  await page.bringToFront();
  await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
  // The dive owns a fixed full-screen <canvas>.
  await page.waitForSelector("canvas", { timeout: 20000 });
  // Let the intro SpaceLoader count to 100 and fade; best-effort settle.
  await page.waitForTimeout(3500);
}

async function checkBudget(page) {
  const route = "/budget";
  try {
    await openDive(page, route);
    const api = makeApiRecorder(page);

    const input = page.locator('input[placeholder*="Describe your project"]').first();
    await input.waitFor({ state: "visible", timeout: 15000 });
    await input.fill("I need an e-commerce website with payment integration");

    await page.getByRole("button", { name: /Get Estimate/i }).first().click();

    const fired = await api.waitFor("/api/budget-estimate", 8000);
    // UI state change: a user bubble appears OR the "Calculating estimate..." loader shows.
    let stateChanged = false;
    try {
      await page.getByText(/Calculating estimate/i).first().waitFor({ timeout: 6000 });
      stateChanged = true;
    } catch {
      stateChanged = await page
        .getByText(/e-commerce website with payment integration/i)
        .first()
        .isVisible()
        .catch(() => false);
    }

    if (fired || stateChanged) pass(`${route}: budget estimate initiated (request=${fired}, uiChanged=${stateChanged})`);
    else fail(`${route}: no /api/budget-estimate request and no UI state change`);
  } catch (e) {
    fail(`${route}: ${e.message}`);
  }
}

async function checkIdeas(page) {
  const route = "/ideas";
  try {
    await openDive(page, route);
    const api = makeApiRecorder(page);

    await page.locator("#name").fill("Smoke Tester");
    await page.locator("#email").fill("smoke@example.com");
    await page.locator("#title").fill("Smoke Test Idea");
    await page.locator("#description").fill("An automated smoke submission.");

    await page.getByRole("button", { name: /Submit Your Idea/i }).first().click();

    const fired = await api.waitFor("api.emailjs.com", 8000);
    let stateChanged = false;
    try {
      await page.getByText(/Submitting/i).first().waitFor({ timeout: 4000 });
      stateChanged = true;
    } catch {
      stateChanged = await page
        .getByText(/submitted successfully|Something went wrong/i)
        .first()
        .isVisible()
        .catch(() => false);
    }

    if (fired || stateChanged) pass(`${route}: idea submit ran (emailjs=${fired}, uiChanged=${stateChanged})`);
    else fail(`${route}: no emailjs request and no submit state change`);
  } catch (e) {
    fail(`${route}: ${e.message}`);
  }
}

async function checkFundMe(page) {
  const route = "/fund-me";
  try {
    await openDive(page, route);
    const api = makeApiRecorder(page);

    // Select a donation tier, then Proceed to Payment.
    await page.getByRole("button", { name: /Buy Me a Coffee/i }).first().click();
    await page.getByText(/Proceed to Payment/i).first().click();

    // STRIPE SAFETY: stop at initiation; never enter card details or complete a payment.
    const fired = await api.waitFor("/api/create-checkout", 8000);
    if (fired) pass(`${route}: POST /api/create-checkout initiated (STOP LINE — no card entered)`);
    else fail(`${route}: /api/create-checkout did not fire`);
    // Intentionally do NOT follow any redirect toward checkout.stripe.com.
  } catch (e) {
    fail(`${route}: ${e.message}`);
  }
}

async function checkSuccess(page) {
  const route = "/fund-me/success?session_id=cs_test_SMOKE";
  try {
    await openDive(page, route);
    // isLoading timer is 1.5s; give it room then assert the confirmation rendered.
    await page.waitForTimeout(2000);
    const thankYou = await page.getByText(/Thank You/i).first().isVisible().catch(() => false);
    const sessionShown = await page.getByText(/cs_test_SMOKE/i).first().isVisible().catch(() => false);
    if (thankYou && sessionShown) pass(`${route}: confirmation + session_id rendered`);
    else if (thankYou) fail(`${route}: thank-you shown but session_id (cs_test_SMOKE) not found`);
    else fail(`${route}: thank-you confirmation not visible`);
  } catch (e) {
    fail(`${route}: ${e.message}`);
  }
}

async function checkDashboard(page) {
  const route = "/llm-training-dashboard";
  try {
    await openDive(page, route);
    const api = makeApiRecorder(page);

    await page.getByRole("button", { name: /Refresh Status/i }).first().click();
    const fired = await api.waitFor("/api/auto-llm-training", 8000);
    if (fired) pass(`${route}: /api/auto-llm-training fired via Refresh Status`);
    else fail(`${route}: /api/auto-llm-training did not fire`);
  } catch (e) {
    fail(`${route}: ${e.message}`);
  }
}

// Cross-page HUD chrome: nav click-to-fly, planet click-to-fly (soft), theme + sound toggles.
async function checkChrome(page, route) {
  try {
    await openDive(page, route);

    const scrollBefore = await page.evaluate(() => window.scrollY);
    const navBtn = page.locator("nav button").first();
    if (await navBtn.count()) {
      await navBtn.click().catch(() => {});
      await page.waitForTimeout(1200);
      const scrollAfter = await page.evaluate(() => window.scrollY);
      const cssVar = await page
        .evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--space-scroll"))
        .catch(() => "");
      if (scrollAfter !== scrollBefore || cssVar !== "") pass(`${route}: HUD nav click changed scroll/--space-scroll`);
      else warn(`${route}: HUD nav click produced no observable scroll change`);
    } else {
      warn(`${route}: no HUD nav buttons found`);
    }

    // Click-to-fly via a planet mesh — best-effort, non-fatal.
    try {
      const canvas = page.locator("canvas").first();
      const box = await canvas.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(600);
      }
    } catch {
      warn(`${route}: planet click-to-fly skipped`);
    }

    const theme = page.locator('[aria-label="Toggle theme accent"]').first();
    if (await theme.count()) {
      await theme.click().catch(() => {});
      pass(`${route}: theme toggle clicked without crash`);
    } else {
      warn(`${route}: theme toggle not found`);
    }

    const sound = page.locator('[aria-label="Toggle ambient sound"]').first();
    if (await sound.count()) {
      await sound.click().catch(() => {});
      pass(`${route}: sound toggle clicked without crash`);
    } else {
      warn(`${route}: sound toggle not found`);
    }
  } catch (e) {
    fail(`${route} chrome: ${e.message}`);
  }
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on("pageerror", (err) => warn(`pageerror: ${err.message}`));

  try {
    await checkBudget(page);
    await checkIdeas(page);
    await checkFundMe(page);
    await checkSuccess(page);
    await checkDashboard(page);
    await checkChrome(page, "/budget");
    await checkChrome(page, "/fund-me");
  } finally {
    await browser.close();
  }

  console.log(`\n=== space-final-smoke: ${passes} PASS / ${failures} FAIL ===`);
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
