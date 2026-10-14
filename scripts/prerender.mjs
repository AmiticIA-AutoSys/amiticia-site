// Build-time prerender of the market pages (/, /wahub, /patricia on amiticia.com.br; /it… on amiticia.cc).
// Runs after `vite build` (client → dist/) and `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
// For each path: render the app, put the HTML in #root, swap the head block between
// <!--app-head-start--> and <!--app-head-end--> for the page's own meta, set <html lang>,
// preload the latin font and, when configured, add the Umami script. Writes dist/<market>/<path within the market>/index.html.
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const fail = (msg) => {
  console.error(`prerender: ${msg}`);
  process.exit(1);
};

const entry = (await fs.readdir(ssrDir)).find((f) => /^entry-server\.(m?js)$/.test(f));
if (!entry) fail(`no entry-server bundle in ${ssrDir}`);
const { render, siteRoutes, prerenderFile, metaFor, headHtml } = await import(pathToFileURL(path.join(ssrDir, entry)).href);

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
const HEAD_BLOCK = /<!--app-head-start-->[\s\S]*?<!--app-head-end-->/;
const ROOT = '<div id="root"></div>';
if (!HEAD_BLOCK.test(template)) fail("index.html lacks the <!--app-head-start--> … <!--app-head-end--> markers");
if (!template.includes(ROOT)) fail(`index.html lacks ${ROOT}`);

const assets = await fs.readdir(path.join(dist, "assets"));
const font = assets.find((f) => /^plus-jakarta-sans-latin-wght-normal-.*\.woff2$/.test(f));
if (!font) fail("latin Plus Jakarta Sans woff2 not found in dist/assets");

// SITE_NOINDEX=1 marks every page noindex (preview stacks). Canonical/og origins come from the market registry.
const noindex = process.env.SITE_NOINDEX === "1";

const escapeAttr = (v) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const { UMAMI_SCRIPT_URL, UMAMI_WEBSITE_ID } = process.env;
const umami =
  UMAMI_SCRIPT_URL && UMAMI_WEBSITE_ID
    ? `<script id="umami-script" defer src="${escapeAttr(UMAMI_SCRIPT_URL)}" data-website-id="${escapeAttr(UMAMI_WEBSITE_ID)}" data-auto-track="false"></script>`
    : "";

for (const route of siteRoutes) {
  const url = route.path;
  const meta = metaFor(url);
  if (!meta) fail(`no meta for ${url}`);
  const appHtml = render(url);
  if (!appHtml.includes("<h1")) fail(`${url} rendered without an <h1>`);

  const head = [
    headHtml(meta, { noindex }),
    `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />`,
    umami,
  ]
    .filter(Boolean)
    .join("\n    ");

  const html = template
    .replace(HEAD_BLOCK, () => `<!--app-head-start-->\n    ${head}\n    <!--app-head-end-->`)
    .replace(/<html lang="[^"]*"/, `<html lang="${meta.lang}"`)
    .replace(ROOT, () => `<div id="root">${appHtml}</div>`);

  // dist/<market>/<path within the market>/index.html; dist/index.html (the SPA shell) is never touched.
  const file = path.join(dist, prerenderFile(route));
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
  console.log(`prerender: ${url} → ${path.relative(root, file)} (${Buffer.byteLength(html)} B)`);
}

await fs.rm(ssrDir, { recursive: true, force: true });
