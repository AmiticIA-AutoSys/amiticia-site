import { expect, test, type Page } from "@playwright/test";
import { sitePages } from "./fixtures";

const scrollThrough = async (page: Page) => {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(40);
  }
};

test.describe("with JavaScript", () => {
  for (const p of sitePages) {
    test(`${p.path} hydrates with no console errors or hydration warnings`, async ({ page }) => {
      const problems: string[] = [];
      page.on("console", (msg) => {
        const text = msg.text();
        if (msg.type() === "error" || /hydrat|did not match|server rendered/i.test(text)) {
          problems.push(`${msg.type()}: ${text}`);
        }
      });
      page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));

      await page.goto(p.path, { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1);
      await scrollThrough(page);
      await page.waitForLoadState("networkidle");
      expect(problems).toEqual([]);
    });

    test(`${p.path} links only inside its market, except the language switcher`, async ({ page }) => {
      await page.goto(p.path);
      const own = p.path.split("/")[1];
      const offenders = await page.evaluate(
        (market) =>
          Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]:not([hreflang])"))
            .map((a) => new URL(a.href, location.href))
            .filter((u) => u.origin === location.origin && /^\/(br|it|en)(\/|$)/.test(u.pathname))
            .filter((u) => !u.pathname.startsWith(`/${market}`))
            .map((u) => u.pathname),
        own,
      );
      expect(offenders).toEqual([]);
    });
  }
});
