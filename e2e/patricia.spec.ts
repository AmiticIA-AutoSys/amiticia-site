import { expect, test } from "@playwright/test";

// Expected values written out by hand: an independent oracle of the copy and the demo case.
const HEADINGS = [
  "A primeira conversa, organizada para o advogado",
  "O problema",
  "Como funciona",
  "Quando há risco.",
  "O que ela nunca faz",
  "Quer a Patrícia no seu escritório?",
];
const NEVER = "Não dá consultoria jurídica, não define estratégia, não promete resultado e não decide quem tem razão.";
const CASE = [
  "Cliente, ex-marido e dois filhos",
  "Separados há dois meses, sem acordo",
  "Dúvidas sobre a separação",
  "Apartamento financiado",
];

test.describe("/br/patricia", () => {
  test("raw HTML carries every heading, every word of the 'nunca' sentence and the complete case", async ({
    request,
    isMobile,
  }) => {
    test.skip(!isMobile, "HTML is viewport-independent: run once");
    const html = await (await request.get("/br/patricia")).text();
    for (const h of HEADINGS) expect(html).toMatch(new RegExp(`<h[123][^>]*>${h.replace(/[.?]/g, "\\$&")}</h[123]>`));
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    for (const word of NEVER.split(" ")) expect(text).toContain(word);
    for (const value of CASE) expect(html).toContain(value);
  });

  test("with reduced motion the case card is complete at once", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/br/patricia", { waitUntil: "networkidle" });
    const card = page.locator("[data-briefing]");
    await expect(card).toHaveAttribute("data-phase", "done");
    for (const value of [...CASE, "Resposta pronta", "Enviar", "Editar"]) {
      const el = card.getByText(value, { exact: true });
      await expect(el).toBeVisible();
      expect(await el.evaluate((n) => Number(getComputedStyle(n).opacity))).toBe(1);
    }
  });

  test("the chat plays once and then the case card assembles", async ({ page }) => {
    await page.goto("/br/patricia", { waitUntil: "networkidle" });
    const card = page.locator("[data-briefing]");
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveAttribute("data-phase", "done", { timeout: 15_000 });
    await expect(card.getByText("Apartamento financiado", { exact: true })).toBeVisible();
  });

  test("at 360 px nothing overflows, the illustration fits and the green button is in the first screen", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "360 px check");
    await page.goto("/br/patricia", { waitUntil: "networkidle" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
    const box = await page.locator("[data-briefing]").boundingBox();
    expect(box!.width).toBeLessThanOrEqual(360);
    await expect(page.locator('a[data-placement="hero"]')).toBeInViewport({ ratio: 1 });
  });

  test("the visible text makes no usage claim", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/br/patricia", { waitUntil: "networkidle" });
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/atendidos|em uso|em produção|depoimento|clientes satisfeitos|\d+\s*(escritórios|casos)/i);
  });
});
