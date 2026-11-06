import { expect, test } from "@playwright/test";
import { BR_HOST, IT_HOST, brUrl, getAs } from "./fixtures";

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

  test("with reduced motion the hero shows the chat's last line and the lead card, and only that flow", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    const art = page.locator("[data-hero-illustration]");
    await expect(art.getByText("Fazemos sim, Ricardo!", { exact: false })).toBeVisible();
    await expect(art.getByText("Lead qualificado")).toBeVisible();
    await expect(art.getByText("Quero entender como funciona a separação", { exact: false })).toHaveCount(0);
    await expect(art.getByText("Caso organizado")).toHaveCount(0);
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

// The retired product is gone from what a crawler or a link preview reads, and Saiu no DOU stays Brazilian.
test.describe("raw HTML of the market pages", () => {
  test.skip(({ isMobile }) => !isMobile, "HTML is viewport-independent: run once");

  const pages: Array<[string, string]> = [
    [BR_HOST, "/"],
    [BR_HOST, "/wahub"],
    [IT_HOST, "/it"],
    [IT_HOST, "/it/wahub"],
  ];
  for (const [host, path] of pages) {
    test(`${host}${path} never names the retired product`, async ({ request }) => {
      const res = await getAs(request, host, path, { maxRedirects: 0 });
      expect(res.status()).toBe(200);
      expect(await res.text()).not.toMatch(/patr[ií]cia/i);
    });
  }

  for (const path of ["/it", "/it/wahub"]) {
    test(`${IT_HOST}${path} does not mention Saiu no DOU`, async ({ request }) => {
      const html = await (await getAs(request, IT_HOST, path)).text();
      expect(html).not.toContain("Saiu no DOU");
      expect(html).not.toContain("saiunodou.com.br");
    });
  }
});

test.describe("Saiu no DOU on the Brazilian home", () => {
  test("shows its approved text as visible body text", async ({ page }) => {
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    const link = page.getByRole("link", { name: /Saiu no DOU/ });
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "https://saiunodou.com.br");
    await expect(link).toHaveAttribute("target", "_blank");
    const body = await page.locator("body").innerText();
    expect(body).toContain("Saiu no DOU");
    expect(body).toContain("Busca pública e gratuita no Diário Oficial da União.");
    expect(body).toContain("saiunodou.com.br");
    expect(body).not.toMatch(/patr[ií]cia/i);
  });

  test("stays quiet: less than half the height of the WaHub card, and still a real tap target", async ({ page }) => {
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    const row = page.getByRole("link", { name: /Saiu no DOU/ });
    const card = page.getByRole("link", { name: "Conhecer o WaHub" });
    await row.scrollIntoViewIfNeeded();
    const rowBox = await row.boundingBox();
    const cardBox = await card.boundingBox();
    expect(rowBox).not.toBeNull();
    expect(cardBox).not.toBeNull();
    expect(rowBox!.height).toBeLessThan(cardBox!.height / 2);
    expect(rowBox!.height).toBeGreaterThanOrEqual(44);
  });
});
