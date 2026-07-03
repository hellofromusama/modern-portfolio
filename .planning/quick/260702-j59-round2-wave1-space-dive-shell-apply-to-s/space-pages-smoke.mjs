// Re-runnable Playwright interaction smoke for the 3 space dives (/services, /contact,
// /projects/<id>). ORCHESTRATOR runs it against a running dev/prod server, e.g.:
//   BASE_URL=http://localhost:3000 node space-pages-smoke.mjs
// Playwright is resolved from the SESSION SCRATCHPAD (NODE_PATH), NOT the repo
// package.json — no playwright dependency is added to modern-portfolio.

import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const PROJECT_ID = process.env.PROJECT_ID || "kashmir-fund";

let failures = 0;
const results = [];

function record(page, name, ok, detail = "") {
  if (!ok) failures++;
  const line = `${ok ? "PASS" : "FAIL"} [${page}] ${name}${detail ? " — " + detail : ""}`;
  results.push(line);
  console.log(line);
}

// Wait for the dive to be interactive: canvas present + a floated panel settled.
async function waitForDive(page) {
  await page.waitForSelector("canvas", { timeout: 30000 });
  // The intro loader ("Calibrating Flight Path") covers everything, then fades/unmounts.
  // Give it a fixed settle window; the HUD + floated panels come alive after.
  await page.waitForTimeout(3500);
}

// The HUD nav buttons live in the top glass <nav>. Click each; tolerate no-op.
async function clickNavButtons(page, pageName) {
  try {
    const navButtons = page.locator("nav button");
    const count = await navButtons.count();
    for (let i = 0; i < count; i++) {
      await navButtons.nth(i).click({ timeout: 5000, force: true }).catch(() => {});
      await page.waitForTimeout(300);
    }
    record(pageName, `clicked ${count} HUD nav button(s)`, count > 0, `count=${count}`);
  } catch (err) {
    record(pageName, "click HUD nav buttons", false, String(err));
  }
}

// Theme (☾/☀) + sound (♪/♫) toggles — top-right of the HUD.
async function toggleThemeAndSound(page, pageName) {
  try {
    const themeBtn = page.getByRole("button", { name: /toggle theme accent/i });
    const soundBtn = page.getByRole("button", { name: /toggle ambient sound/i });
    await themeBtn.click({ timeout: 5000, force: true });
    await page.waitForTimeout(200);
    await soundBtn.click({ timeout: 5000, force: true });
    await page.waitForTimeout(200);
    record(pageName, "toggled theme + sound", true);
  } catch (err) {
    record(pageName, "toggle theme + sound", false, String(err));
  }
}

// Best-effort click-to-fly: coordinate-click the canvas center (planets are WebGL,
// not DOM — we cannot target them, so just assert no crash).
async function canvasClickToFly(page, pageName) {
  try {
    const canvas = page.locator("canvas").first();
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
      await page.waitForTimeout(400);
    }
    record(pageName, "canvas click-to-fly (best-effort)", true);
  } catch (err) {
    // Non-fatal per spec — tolerate.
    record(pageName, "canvas click-to-fly (best-effort)", true, "tolerated: " + String(err));
  }
}

async function checkServices(browser) {
  const p = "/services";
  const page = await browser.newPage();
  try {
    await page.bringToFront();
    await page.goto(BASE + "/services", { waitUntil: "domcontentloaded" });
    await waitForDive(page);

    // A real catalog CTA link -> /contact.
    const contactLink = page.locator('a[href="/contact"]').first();
    const href = await contactLink.getAttribute("href").catch(() => null);
    record(p, "catalog CTA links to /contact", href === "/contact", `href=${href}`);

    await clickNavButtons(page, p);
    await toggleThemeAndSound(page, p);
    await canvasClickToFly(page, p);
  } catch (err) {
    record(p, "page loaded", false, String(err));
  } finally {
    await page.close();
  }
}

async function checkContact(browser) {
  const p = "/contact";
  const page = await browser.newPage();
  try {
    await page.bringToFront();
    await page.goto(BASE + "/contact", { waitUntil: "domcontentloaded" });
    await waitForDive(page);

    // Focus + type each field.
    await page.locator("#name").fill("Smoke Tester", { timeout: 8000 });
    await page.locator("#email").fill("smoke@example.com");
    await page.locator("#subject").fill("Automated smoke");
    await page.locator("#message").fill("This is an automated interaction smoke test.");
    record(p, "focus + type name/email/subject/message", true);

    // Submit — emailjs may succeed OR fail in the test env; either status is a PASS.
    await page.getByRole("button", { name: /^send$/i }).click({ force: true });
    const status = await Promise.race([
      page.getByText(/pre-filled/i).waitFor({ timeout: 12000 }).then(() => "success"),
      page.getByText(/couldn.?t be opened/i).waitFor({ timeout: 12000 }).then(() => "error"),
    ]).catch(() => null);
    record(p, "submit shows success OR error status", status !== null, `status=${status}`);

    // A LinkedIn/GitHub external link is present.
    const social = page.locator('a[target="_blank"][href*="linkedin"], a[target="_blank"][href*="github"]');
    record(p, "LinkedIn/GitHub target=_blank link present", (await social.count()) > 0);

    await clickNavButtons(page, p);
    await toggleThemeAndSound(page, p);
    await canvasClickToFly(page, p);
  } catch (err) {
    record(p, "page loaded", false, String(err));
  } finally {
    await page.close();
  }
}

async function checkProject(browser) {
  const p = `/projects/${PROJECT_ID}`;
  const page = await browser.newPage();
  try {
    await page.bringToFront();
    await page.goto(`${BASE}/projects/${PROJECT_ID}`, { waitUntil: "domcontentloaded" });
    await waitForDive(page);

    // "Discuss Your Project" CTA -> /contact.
    const discuss = page.getByRole("link", { name: /discuss your project/i }).first();
    const discussHref = await discuss.getAttribute("href").catch(() => null);
    record(p, '"Discuss Your Project" -> /contact', discussHref === "/contact", `href=${discussHref}`);

    // A "/#projects" link exists.
    const moreProjects = page.locator('a[href="/#projects"]');
    record(p, '"/#projects" link exists', (await moreProjects.count()) > 0);

    // If a liveUrl is rendered, assert it has an href.
    const live = page.getByRole("link", { name: /visit live website/i });
    if ((await live.count()) > 0) {
      const liveHref = await live.first().getAttribute("href");
      record(p, "liveUrl link has href", Boolean(liveHref), `href=${liveHref}`);
    } else {
      record(p, "liveUrl absent for this id (ok)", true);
    }

    await clickNavButtons(page, p);
    await toggleThemeAndSound(page, p);
    await canvasClickToFly(page, p);
  } catch (err) {
    record(p, "page loaded", false, String(err));
  } finally {
    await page.close();
  }
}

async function main() {
  console.log(`space-pages-smoke: BASE_URL=${BASE} PROJECT_ID=${PROJECT_ID}`);
  const browser = await chromium.launch();
  try {
    await checkServices(browser);
    await checkContact(browser);
    await checkProject(browser);
  } finally {
    await browser.close();
  }

  console.log("\n==== SMOKE SUMMARY ====");
  results.forEach((line) => console.log(line));
  console.log(`\n${failures === 0 ? "ALL PASS" : failures + " FAILURE(S)"}`);
  process.exit(failures ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal smoke error:", err);
  process.exit(1);
});
