// Saves the phone and desktop screenshots of the market pages served by the local production
// container. Run through `npm run shots`, which starts the container and sets E2E_PORT.
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { DEFAULT_PORT, parseShotArgs, shotPlan } from "./plan.mjs";

const outDir = path.join(process.cwd(), "shots");
const port = Number(process.env.E2E_PORT || DEFAULT_PORT);

let selection;
try {
  selection = parseShotArgs(process.argv.slice(2));
} catch (e) {
  console.error(`shots: ${e.message}`);
  process.exit(2);
}
const plan = shotPlan(selection);
if (selection.dryRun) {
  for (const t of plan) console.log(`${t.host}${t.path}  ${t.viewport.width}x${t.viewport.height}  ${t.files.top}  ${t.files.full}`);
  process.exit(0);
}

/**
 * Scroll-reveal sections stay invisible until they cross the viewport: walk the page top to bottom,
 * let lazy images load, return to the top and let the animations finish, so the full-page shot has no blank band.
 */
const revealEverything = async (page) => {
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = Math.max(200, Math.floor(window.innerHeight / 2));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await wait(150);
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
    await wait(400);
    await Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((r) => (img.onload = img.onerror = r)))));
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(800);
};

await fs.mkdir(outDir, { recursive: true });
// Same trick as playwright.config.ts: both production hostnames reach the one local container.
const hostRules = [...new Set(plan.map((t) => t.host))].map((h) => `MAP ${h} 127.0.0.1:${port}`).join(", ");
const browser = await chromium.launch({ args: [`--host-resolver-rules=${hostRules}`] });
try {
  for (const t of plan) {
    const url = `http://${t.host}${t.path}`;
    const page = await browser.newPage({ viewport: t.viewport, deviceScaleFactor: 2, isMobile: t.device === "phone", hasTouch: t.device === "phone" });
    const response = await page.goto(url, { waitUntil: "networkidle" });
    // A redirect would mean the shot shows another market's page than the one in its file name.
    if (response?.status() !== 200 || new URL(page.url()).pathname.replace(/\/$/, "") !== t.path.replace(/\/$/, "")) {
      throw new Error(`${url} answered ${response?.status()} at ${page.url()}`);
    }
    await page.waitForTimeout(800); // the hero's entrance animation
    await page.screenshot({ path: path.join(outDir, t.files.top) });
    await revealEverything(page);
    await page.screenshot({ path: path.join(outDir, t.files.full), fullPage: true });
    console.log(`shots: ${t.files.top}  ${t.files.full}`);
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(`shots: ${plan.length * 2} images in ${outDir}`);
