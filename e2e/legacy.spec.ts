import { expect, test } from "@playwright/test";

// The live site keeps serving the legacy pages until Flavio and André validate /br.
test.describe("legacy pages are untouched", () => {
  test("/ still shows the old hero and navigation", async ({ page, isMobile }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Inteligência e Automação que Escala");
    if (!isMobile) {
      const header = page.locator("header");
      for (const item of ["Quem somos", "WaHub", "Patrícia", "Como trabalhamos", "Para quem é"]) {
        await expect(header.getByText(item, { exact: true })).toBeVisible();
      }
    }
  });

  test("/k answers 200 with the app root", async ({ request }) => {
    const res = await request.get("/k");
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain('<div id="root"></div>');
  });

  test("/ looks exactly as before at 1440 px", async ({ page, isMobile }) => {
    test.skip(isMobile, "baseline taken at 1440 px");
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    // Baseline captured from the v2-br build before any v2 change.
    await expect(page).toHaveScreenshot("legacy-home-1440.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.001,
    });
  });
});
