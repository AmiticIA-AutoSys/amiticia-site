import { expect, test, type Page } from "@playwright/test";
import { BR_HOST, IT_HOST, brUrl, getAs, waHref } from "./fixtures";

/** Written out by hand: the suite is an independent oracle of the copy and of the hero demo. */
const headings = ["Veja o WaHub atendendo, em 1min30", "Como funciona", "O que tem dentro", "Quer ver o WaHub atendendo o seu WhatsApp?"];
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
    const html = await (await getAs(request, BR_HOST, "/wahub")).text();
    for (const text of [...headings, ...stepTitles, ...featureTitles, ...chatFinalFrame, ...leadCardText]) {
      expect(html, text).toContain(text);
    }
    expect(html).not.toMatch(/desde|1\/10|Quanto custa/);
  });

  test("the demo video is in the raw HTML with its poster, and the file streams in ranges", async ({
    request,
    isMobile,
  }) => {
    test.skip(!isMobile, "HTML is viewport-independent: run once");
    const html = await (await getAs(request, BR_HOST, "/wahub")).text();
    expect(html).toMatch(/<video[^>]*\bcontrols\b/);
    expect(html).not.toMatch(/<video[^>]*\bautoplay\b/);
    expect(html).toMatch(/<video[^>]*poster="\/assets\/video-poster-720[^"]*\.webp"/);
    expect(html).toContain('<source src="/media/wahub-demo-pt-v1.mp4" type="video/mp4"');
    expect(html).toContain("Empresa fictícia. As telas e as respostas do assistente de IA são reais; a narração usa voz sintética.");

    const range = await getAs(request, BR_HOST, "/media/wahub-demo-pt-v1.mp4", { headers: { Range: "bytes=0-99" } });
    expect(range.status()).toBe(206);
    expect(range.headers()["content-type"]).toContain("video/mp4");
    expect(range.headers()["content-range"]).toMatch(/^bytes 0-99\/15076484$/);
    expect((await range.body()).length).toBe(100);
  });

  test("the Italian WaHub page has no video", async ({ request, isMobile }) => {
    test.skip(!isMobile, "HTML is viewport-independent: run once");
    const html = await (await getAs(request, IT_HOST, "/it/wahub")).text();
    expect(html).not.toContain("<video");
    expect(html).not.toContain("1min30");
  });

  test("?ref=magno puts the partner in every WhatsApp button, and nothing without it", async ({ page }) => {
    const plain = waHref("Olá! Vi o WaHub no site da AmiticIA e gostaria de saber mais.");
    await page.goto(brUrl("/wahub"), { waitUntil: "networkidle" });
    expect(await page.locator('a[href^="https://wa.me/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")))).toEqual(
      expect.arrayContaining([plain]),
    );
    await page.goto(brUrl("/wahub?ref=magno"), { waitUntil: "networkidle" });
    const referred = waHref("Olá! Vi o WaHub no site da AmiticIA e gostaria de saber mais. (indicação de Magno)");
    await expect(page.locator('a[data-placement="hero"]')).toHaveAttribute("href", referred);
    expect(referred).toContain("indica%C3%A7%C3%A3o%20de%20Magno");
    const hrefs = await page.locator('a[href^="https://wa.me/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThanOrEqual(4);
    expect(new Set(hrefs)).toEqual(new Set([referred]));
  });

  test("with reduced motion the lead card is visible at once", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(brUrl("/wahub"), { waitUntil: "networkidle" });
    await expect(leadCard(page)).toHaveAttribute("data-state", "shown");
    expect(await opacityOf(page)).toBe("1");
  });

  test("the lead card pops out once the chat has played", async ({ page }) => {
    await page.goto(brUrl("/wahub"), { waitUntil: "networkidle" });
    await page.locator("[data-wahub-hero-visual]").evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect(leadCard(page)).toHaveAttribute("data-state", "hidden");
    await expect(leadCard(page)).toHaveAttribute("data-state", "shown", { timeout: 15_000 });
    await expect.poll(() => opacityOf(page)).toBe("1");
  });

  test("every screenshot loads after scrolling, and the tour tabs swap the screen", async ({ page }) => {
    await page.goto(brUrl("/wahub"), { waitUntil: "networkidle" });
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

  test("the video section has no WhatsApp button until the video ends; then its end card does, alone on screen", async ({
    page,
    isMobile,
  }) => {
    await page.goto(brUrl("/wahub"), { waitUntil: "networkidle" });
    const section = page.locator("section#video");
    const videoCta = section.locator('a[data-placement="video"]');
    await expect(section.locator('a[href^="https://wa.me/"]')).toHaveCount(0);

    await section.locator("video").scrollIntoViewIfNeeded();
    await section.locator("video").dispatchEvent("ended");
    await expect(section.getByText("Quer isso no seu WhatsApp?")).toBeVisible();
    await videoCta.scrollIntoViewIfNeeded();
    await expect(videoCta).toBeInViewport({ ratio: 1 });
    await expect(videoCta).toHaveAttribute("href", waHref("Olá! Vi o WaHub no site da AmiticIA e gostaria de saber mais."));
    if (isMobile) await expect(page.locator('a[data-placement="sticky"]')).toBeHidden();

    await section.getByRole("button", { name: "Ver de novo" }).click();
    await expect(videoCta).toHaveCount(0);
  });

  test("at 360 px the hero fits: nothing crosses the edge and the green button is in the first screen", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "360 px layout");
    await page.goto(brUrl("/wahub"), { waitUntil: "networkidle" });
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
