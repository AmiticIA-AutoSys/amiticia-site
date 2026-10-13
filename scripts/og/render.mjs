// Renders the link-preview images (public/og/br-*.jpg) with headless Playwright Chromium.
// One 1200×630 HTML template per page; the h1 and eyebrow come from the approved copy, so a
// copy change plus `npm run og` keeps the share image in step. JPEG ≤ 180 KB: WhatsApp drops
// larger preview images, so quality steps down until the file fits.
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { home } from "../../src/site/copy/br/home.ts";
import { wahub } from "../../src/site/copy/br/wahub.ts";
import { patricia } from "../../src/site/copy/br/patricia.ts";
import { homeTemplate, wahubTemplate, patriciaTemplate } from "./templates.mjs";

const root = process.cwd();
const outDir = path.join(root, "public", "og");
const MAX_BYTES = 180 * 1024;
const QUALITIES = [90, 86, 82, 78, 74, 70, 64, 58];

const dataUrl = async (file, mime) => `data:${mime};base64,${(await fs.readFile(path.join(root, file))).toString("base64")}`;

const assets = {
  fontUrl: await dataUrl("node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2", "font/woff2"),
  logoUrl: await dataUrl("src/site/assets/amiticia-logo.svg", "image/svg+xml"),
};
const shotUrl = await dataUrl("src/site/assets/wahub/inbox-1024.webp", "image/webp");

const pages = [
  {
    file: "br-home.jpg",
    html: homeTemplate({
      ...assets,
      h1: home.hero.title,
      eyebrow: home.hero.leadHighlight,
      chips: [
        { name: "WaHub", tint: "#6E6CF5" },
        { name: "Patrícia", tint: "#F2A477" },
      ],
    }),
  },
  { file: "br-wahub.jpg", html: wahubTemplate({ ...assets, shotUrl, h1: wahub.hero.title, eyebrow: wahub.hero.eyebrow }) },
  { file: "br-patricia.jpg", html: patriciaTemplate({ ...assets, h1: patricia.hero.title, eyebrow: patricia.hero.eyebrow }) },
];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const p of pages) {
    await page.setContent(p.html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    let buf;
    for (const quality of QUALITIES) {
      buf = await page.screenshot({ type: "jpeg", quality, clip: { x: 0, y: 0, width: 1200, height: 630 } });
      if (buf.length <= MAX_BYTES) break;
    }
    if (buf.length > MAX_BYTES) throw new Error(`${p.file}: ${buf.length} B exceeds ${MAX_BYTES} B at the lowest quality`);
    await fs.writeFile(path.join(outDir, p.file), buf);
    console.log(`og: ${p.file} ${(buf.length / 1024).toFixed(1)} KB`);
  }
} finally {
  await browser.close();
}
