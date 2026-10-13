import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { sitePages } from "./fixtures";

test.skip(({ isMobile }) => !isMobile, "axe runs on the mobile layout");

for (const p of sitePages) {
  test(`${p.path} has no serious or critical axe violations`, async ({ page }) => {
    // Reduced motion shows every reveal at once, so axe sees all content at full opacity.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(p.path, { waitUntil: "networkidle" });
    const { violations } = await new AxeBuilder({ page }).analyze();
    const severe = violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
    expect(severe).toEqual([]);
  });
}
