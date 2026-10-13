import { expect, test, type Page } from "@playwright/test";

/** Written out by hand: the suite is an independent oracle of the copy and of the hero demo. */
const headings = ["Como funciona", "O que tem dentro", "Quer ver o WaHub atendendo o seu WhatsApp?"];
const stepTitles = [
  "O cliente chama no WhatsApp da empresa",
  "O assistente de IA atende na hora",
  "O lead entra no funil já organizado",
];
const featureTitles = [
  "Uma caixa de entrada para o time todo.",
  "Assistente de IA que qualifica.",
  "Funil de vendas.",
  "Ninguém fica sem resposta.",
  "Aprende com as suas conversas.",
  "Retome conversas paradas.",
  "Você não troca de número.",
];
const chatFinalFrame = [
  "Oi! Vocês fazem óculos de grau?",
  "Oi, Ricardo! Sou o assistente da Ótica Lumen. Fazemos, sim.",
  "Você já tem a receita do oftalmologista?",
  "Tenho. Passo o dia todo no computador.",
  "Então vale a lente com filtro de luz azul. Posso pedir a um vendedor para separar armações para você?",
  "Pode, sim!",
];
const leadCardText = ["Lead qualificado", "Ricardo Almeida", "Vendedor assume"];

const leadCard = (page: Page) => page.getByTestId("wahub-lead-card");
const opacityOf = (page: Page) => leadCard(page).evaluate((el) => getComputedStyle(el).opacity);

test.describe("/br/wahub", () => {
  test("raw HTML has every heading, step, feature title, the final chat frame and the lead card", async ({
    request,
    isMobile,
  }) => {
    test.skip(!isMobile, "HTML is viewport-independent: run once");
    const html = await (await request.get("/br/wahub")).text();
    for (const text of [...headings, ...stepTitles, ...featureTitles, ...chatFinalFrame, ...leadCardText]) {
      expect(html, text).toContain(text);
    }
    expect(html).not.toMatch(/desde|1\/10|Quanto custa/);
  });

  test("with reduced motion the lead card is visible at once", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/br/wahub", { waitUntil: "networkidle" });
    await expect(leadCard(page)).toHaveAttribute("data-state", "shown");
    expect(await opacityOf(page)).toBe("1");
  });

  test("the lead card pops out once the chat has played", async ({ page }) => {
    await page.goto("/br/wahub", { waitUntil: "networkidle" });
    await page.locator("[data-wahub-hero-visual]").evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect(leadCard(page)).toHaveAttribute("data-state", "hidden");
    await expect(leadCard(page)).toHaveAttribute("data-state", "shown", { timeout: 15_000 });
    await expect.poll(() => opacityOf(page)).toBe("1");
  });

  test("every screenshot loads after scrolling, and the tour tabs swap the screen", async ({ page }) => {
    await page.goto("/br/wahub", { waitUntil: "networkidle" });
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= height; y += 400) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(60);
    }
    await page.waitForLoadState("networkidle");
    const broken = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLImageElement>("main img"))
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src),
    );
    expect(broken).toEqual([]);
    expect(await page.locator("main img").count()).toBeGreaterThanOrEqual(4);

    const funil = page.getByRole("tab", { name: "Funil" });
    await funil.click();
    await expect(funil).toHaveAttribute("aria-selected", "true");
    const pipeline = page.getByAltText("Funil de vendas do WaHub com os negócios em colunas (dados fictícios)");
    await expect(pipeline).toBeVisible();
    await expect.poll(() => pipeline.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  });

  test("at 360 px the hero fits: nothing crosses the edge and the green button is in the first screen", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "360 px layout");
    await page.goto("/br/wahub", { waitUntil: "networkidle" });
    await expect(page.locator('a[data-placement="hero"]')).toBeInViewport({ ratio: 1 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
    const wide = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-wahub-hero-visual], [data-wahub-hero-visual] *"))
        .filter((el) => !el.closest("[aria-hidden='true'][class*='blur']") && !el.className.toString().includes("blur"))
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.width > 0 && (r.left < -0.5 || r.right > 360.5))
        .map(({ el, r }) => `${el.tagName}.${el.className.toString().slice(0, 40)} ${Math.round(r.left)}…${Math.round(r.right)}`),
    );
    expect(wide).toEqual([]);
  });
});
