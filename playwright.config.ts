import { defineConfig } from "@playwright/test";

/**
 * E2E against the real Docker image (nginx + prerendered dist). Run through
 * `npm run e2e`, which builds and starts the container and sets E2E_BASE_URL.
 */
const baseURL = process.env.E2E_BASE_URL;
if (!baseURL) throw new Error("E2E_BASE_URL is not set — run `npm run e2e`");

// One container answers for both production hostnames, picking the market from the Host header.
// Browsers reach them through Chromium's resolver (amiticia.com.br and amiticia.cc → the container,
// whatever the port in the URL); `request` calls send an explicit Host header (e2e/fixtures.ts getAs).
// e2e/domains.spec.ts proves both mechanisms deliver the right host: it fails when pointed at the wrong one.
const { port } = new URL(baseURL);
const hostRules = ["amiticia.com.br", "www.amiticia.com.br", "amiticia.cc", "www.amiticia.cc"]
  .map((h) => `MAP ${h} 127.0.0.1:${port}`)
  .join(", ");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    browserName: "chromium",
    launchOptions: { args: [`--host-resolver-rules=${hostRules}`] },
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "mobile",
      use: { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
    },
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 900 } },
    },
  ],
});
