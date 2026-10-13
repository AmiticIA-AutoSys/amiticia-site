import { expect, test, type Page } from "@playwright/test";
import { brPages } from "./fixtures";

test.skip(({ isMobile }) => !isMobile, "360 px checks");

/** Every visible link/button whose box crosses the 0…360 px band. */
const outOfBounds = (page: Page) =>
  page.evaluate(() => {
    const width = window.innerWidth;
    return Array.from(document.querySelectorAll<HTMLElement>("a, button"))
      .filter((el) => el.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true }))
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 1 && r.height > 1)
      .filter(({ r }) => r.left < -0.5 || r.right > width + 0.5)
      .map(({ el, r }) => `${el.tagName} "${el.textContent?.trim().slice(0, 40)}" ${Math.round(r.left)}…${Math.round(r.right)}`);
  });

/** A WhatsApp link that is on screen and not covered by anything at its centre. */
const reachableWhatsApp = (page: Page) =>
  page.evaluate(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]'))
      .filter((a) => {
        const r = a.getBoundingClientRect();
        if (r.width < 1 || r.top < 0 || r.bottom > vh || r.left < 0 || r.right > vw) return false;
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !!hit && a.contains(hit);
      })
      .map((a) => a.dataset.placement ?? a.textContent?.trim());
  });

for (const p of brPages) {
  test(`${p.path} fits 360 px: no horizontal overflow, every control inside the viewport`, async ({ page }) => {
    await page.goto(p.path, { waitUntil: "networkidle" });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(360);
    expect(await outOfBounds(page)).toEqual([]);
  });

  test(`${p.path} keeps a WhatsApp button reachable at the top, middle and bottom`, async ({ page }) => {
    await page.goto(p.path, { waitUntil: "networkidle" });
    for (const where of ["top", "middle", "bottom"] as const) {
      await page.evaluate((w) => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, w === "top" ? 0 : w === "middle" ? max / 2 : max);
      }, where);
      await page.waitForTimeout(350);
      expect(await reachableWhatsApp(page), `at ${where}`).not.toEqual([]);
    }
  });
}

test("the sticky bar steps aside while the hero button is fully on screen, and returns below it", async ({ page }) => {
  await page.goto("/br/wahub", { waitUntil: "networkidle" });
  const sticky = page.locator('a[data-placement="sticky"]');
  await expect(page.locator('a[data-placement="hero"]')).toBeInViewport({ ratio: 1 });
  await expect(sticky).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
  await expect(sticky).toBeVisible();
});
