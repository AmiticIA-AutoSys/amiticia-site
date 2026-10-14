import { expect, test } from "@playwright/test";
import { BR_HOST, brUrl, getAs } from "./fixtures";

/** Section headings of the /br copy, written out by hand (HTML-escaped as nginx serves them). */
const sectionHeadings = [
  "Nossos produtos",
  "O que você ganha",
  "Projetos sob medida",
  "Stack &amp; Infra que não te deixa na mão",
  "Como trabalhamos",
  "Engenharia de verdade por trás da IA",
  "Para quem é",
  "Vamos começar?",
];

test.describe("/br home", () => {
  test("the prerendered HTML carries every section heading", async ({ request, isMobile }) => {
    test.skip(!isMobile, "HTML is viewport-independent: run once");
    const html = await (await getAs(request, BR_HOST, "/")).text();
    for (const heading of sectionHeadings) {
      expect(html).toMatch(new RegExp(`<h[23][^>]*>${heading.replace(/[?]/g, "\\$&")}</h[23]>`));
    }
  });

  test("with reduced motion the hero chat shows its last line and both result cards", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    const art = page.locator("[data-hero-illustration]");
    await expect(art.getByText("Fazemos sim, Ricardo!", { exact: false })).toBeVisible();
    await expect(art.getByText("Quero entender como funciona a separação", { exact: false })).toBeVisible();
    await expect(art.getByText("Lead qualificado")).toBeVisible();
    await expect(art.getByText("Caso organizado")).toBeVisible();
  });

  test("at 360 px nothing overflows and the first screen shows h1, lead and the green button", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "360 px first screen");
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport({ ratio: 1 });
    await expect(page.locator("section p.v2-lead").first()).toBeInViewport();
    await expect(page.locator('a[data-placement="hero"]')).toBeInViewport({ ratio: 1 });
  });

  test("the sticky bar steps aside while the closing button is fully on screen", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the sticky bar is mobile only");
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    const cta = page.locator('a[data-placement="cta"]');
    await cta.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -120));
    await expect(cta).toBeInViewport({ ratio: 1 });
    await expect(page.locator('a[data-placement="sticky"]')).toBeHidden();
  });
});
