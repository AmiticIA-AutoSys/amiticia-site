import { expect, test, type Page } from "@playwright/test";
import { BR_HOST, IT_HOST, brUrl, getAs, itUrl } from "./fixtures";

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

test.describe("the hero lead on the Brazilian home", () => {
  const HIGHLIGHT = "Colocamos a inteligência artificial para trabalhar";
  const REST =
    " dentro da sua empresa: atendendo clientes no WhatsApp, lendo documentos e preenchendo planilhas. Do diagnóstico à operação rodando.";
  const TAGLINE = "Mais de 20 anos de software. IA desde 2006, bem antes do ChatGPT.";
  const DESCRIPTION_START = `${HIGHLIGHT} dentro da sua empresa`;
  const literal = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  test("says what the company does in the lead and in every description tag of the raw HTML", async ({ request, isMobile }) => {
    test.skip(!isMobile, "HTML is viewport-independent: run once");
    const html = await (await getAs(request, BR_HOST, "/")).text();
    // The highlight is a <span> inside the paragraph: the sentence crosses its closing tag.
    expect(html).toMatch(
      new RegExp(`<p class="v2-lead[^"]*"><span[^>]*>${literal(HIGHLIGHT)}</span>(?:<!-- -->)?${literal(REST)}</p>`),
    );
    expect(html).toContain(`>${TAGLINE}</p>`);
    for (const tag of ['name="description"', 'property="og:description"', 'name="twitter:description"']) {
      expect(html).toContain(`<meta ${tag} content="${DESCRIPTION_START}`);
    }
  });

  test("leaves nothing of the old first screen in the raw HTML", async ({ request, isMobile }) => {
    test.skip(!isMobile, "HTML is viewport-independent: run once");
    const html = await (await getAs(request, BR_HOST, "/")).text();
    for (const gone of ["que Escala", "Temos um produto pronto", "produtos prontos", "para sua dor"]) {
      expect(html).not.toContain(gone);
    }
    // "&" is served escaped in text and attributes: look for both spellings.
    expect(html).not.toMatch(/Data (&|&amp;) AI Ops/);
  });

  test("shows the lead, the line under it and the footer phrase once the page runs", async ({ page }) => {
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    const lead = page.locator("section p.v2-lead").first();
    await expect(lead).toHaveText(HIGHLIGHT + REST);
    await expect(lead.locator("xpath=following-sibling::*[1]")).toHaveText(TAGLINE);
    await expect(page.locator("footer").getByText("IA funcionando no seu negócio.", { exact: true })).toBeVisible();
  });
});

const SAIU_URL = "https://saiunodou.com.br";

/** The name is scoped to one place: the card, the header menu and the footer all carry it. */
const saiuCard = (page: Page) => page.locator("#produtos").getByRole("link", { name: /Saiu no DOU/ });
const wahubCard = (page: Page) => page.locator("#produtos").getByRole("link", { name: "Conhecer o WaHub" });

const expectNewTab = async (link: ReturnType<Page["locator"]>) => {
  await expect(link).toHaveAttribute("href", SAIU_URL);
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");
};

/** Both cards in view, reveal transition settled: a card mid-reveal is still shifted down. */
const settledBoxes = async (page: Page) => {
  await saiuCard(page).scrollIntoViewIfNeeded();
  let last = "";
  await expect
    .poll(async () => {
      const now = JSON.stringify([await wahubCard(page).boundingBox(), await saiuCard(page).boundingBox()]);
      const stable = now === last;
      last = now;
      return stable;
    })
    .toBe(true);
  const [wahub, saiu] = JSON.parse(last) as Array<{ x: number; y: number; width: number; height: number }>;
  return { wahub, saiu };
};

test.describe("Saiu no DOU on the Brazilian home", () => {
  test("is a full card with its approved text, opening its own site in a new tab", async ({ page }) => {
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    const card = saiuCard(page);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    await expect(card).toHaveAccessibleName("Conhecer o Saiu no DOU (abre em nova aba)");
    await expectNewTab(card);
    await expect(card.getByRole("heading", { level: 3 })).toHaveText("Busca pública e gratuita no Diário Oficial da União");
    await expect(card).toContainText("Portarias, editais, nomeações, aposentadorias e concursos");
    await expect(card.locator('a[href*="wa.me"]')).toHaveCount(0);
    expect(await page.locator("body").innerText()).not.toMatch(/patr[ií]cia/i);
  });

  test("its illustration is built in code, cyan, with fictional labels", async ({ page }) => {
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    const art = saiuCard(page).locator('[aria-hidden="true"]').first();
    await art.scrollIntoViewIfNeeded();
    for (const label of ["concurso público", "Seção 3", "Seção 2", "Portaria de nomeação", "Órgão Exemplo"]) {
      await expect(art).toContainText(label);
    }
  });

  test("on desktop the two cards sit side by side, WaHub left, same top, width and height", async ({ page, isMobile }) => {
    test.skip(isMobile, "two columns from md up");
    for (const width of [1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(brUrl("/"), { waitUntil: "networkidle" });
      const { wahub, saiu } = await settledBoxes(page);
      expect(wahub.x + wahub.width).toBeLessThanOrEqual(saiu.x);
      expect(Math.abs(wahub.y - saiu.y)).toBeLessThanOrEqual(1);
      expect(Math.abs(wahub.width - saiu.width)).toBeLessThanOrEqual(1);
      expect(Math.abs(wahub.height - saiu.height)).toBeLessThanOrEqual(1);
    }
  });

  test("on a phone the cards stack, WaHub first, with no horizontal scroll", async ({ page, isMobile }) => {
    test.skip(!isMobile, "one column below md");
    for (const width of [360, 390]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(brUrl("/"), { waitUntil: "networkidle" });
      const { wahub, saiu } = await settledBoxes(page);
      expect(wahub.y + wahub.height).toBeLessThanOrEqual(saiu.y);
      expect(Math.abs(wahub.width - saiu.width)).toBeLessThanOrEqual(1);
      expect(saiu.height).toBeGreaterThanOrEqual(44);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  });

  test("the Produtos menu lists WaHub, then Saiu no DOU in a new tab", async ({ page, isMobile }) => {
    test.skip(isMobile, "the header menu is desktop only");
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    await page.getByRole("banner").getByRole("button", { name: "Produtos" }).click();
    const items = page.getByRole("menuitem");
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toHaveAccessibleName("WaHub");
    await expect(items.nth(1)).toHaveAccessibleName("Saiu no DOU (abre em nova aba)");
    await expectNewTab(items.nth(1));
    expect((await items.nth(1).boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });

  test("the mobile menu lists WaHub, then Saiu no DOU in a new tab", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the sheet menu is mobile only");
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("link").nth(0)).toHaveAccessibleName("WaHub");
    const saiu = dialog.getByRole("link").nth(1);
    await expect(saiu).toHaveAccessibleName("Saiu no DOU (abre em nova aba)");
    await expectNewTab(saiu);
    expect((await saiu.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });

  test("the footer links to it in a new tab", async ({ page }) => {
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    const link = page.locator("footer").getByRole("link", { name: /Saiu no DOU/ });
    await expect(link).toHaveAccessibleName("Saiu no DOU (abre em nova aba)");
    await expectNewTab(link);
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });

  test("Italy shows none of it: card, menu or footer", async ({ page, isMobile }) => {
    for (const path of ["/it", "/it/wahub"]) {
      await page.goto(itUrl(path), { waitUntil: "networkidle" });
      await expect(page.getByRole("link", { name: /Saiu no DOU/ })).toHaveCount(0);
      await expect(page.locator(`a[href^="${SAIU_URL}"]`)).toHaveCount(0);
      if (isMobile) {
        await page.getByRole("button", { name: "Apri il menu" }).click();
        await expect(page.getByRole("dialog").getByRole("link", { name: "WaHub", exact: true })).toBeVisible();
        await expect(page.getByRole("dialog").getByText("Saiu no DOU")).toHaveCount(0);
      } else {
        await page.getByRole("banner").getByRole("button", { name: "Prodotti" }).click();
        await expect(page.getByRole("menuitem")).toHaveCount(1);
        await expect(page.getByRole("menuitem")).toHaveAccessibleName("WaHub");
      }
    }
  });

  test("Italy keeps its one full-width card", async ({ page, isMobile }) => {
    test.skip(isMobile, "two columns from md up");
    await page.goto(itUrl("/it"), { waitUntil: "networkidle" });
    const card = page.locator("#produtos").getByRole("link");
    await expect(card).toHaveCount(1);
    await card.scrollIntoViewIfNeeded();
    expect((await card.boundingBox())!.width).toBeGreaterThan(1000);
  });
});

test.describe("the first step of how we work", () => {
  test.skip(({ isMobile }) => !isMobile, "HTML is viewport-independent: run once");

  test('reads "Diagnóstico" on the Brazilian pages, never "Diagnóstico Rápido"', async ({ request }) => {
    const home = await (await getAs(request, BR_HOST, "/")).text();
    expect(home).toMatch(/<h4[^>]*>Diagnóstico<\/h4>/);
    for (const path of ["/", "/wahub"]) {
      expect(await (await getAs(request, BR_HOST, path)).text()).not.toContain("Diagnóstico Rápido");
    }
  });
});

test.describe("André's photo in Quem somos", () => {
  const photo = (page: Page) => page.locator("#quem-somos").getByRole("img", { name: "Foto de André" });

  test("is in the prerendered Brazilian HTML, captioned only with his name, its size reserved", async ({ request, isMobile }) => {
    test.skip(!isMobile, "HTML is viewport-independent: run once");
    const home = await (await getAs(request, BR_HOST, "/")).text();
    const img = home.match(/<img[^>]*alt="Foto de André"[^>]*>/)?.[0] ?? "";
    expect(img).toContain('width="540"');
    expect(img).toContain('height="675"');
    expect(img).toContain('loading="lazy"');
    expect(home).toMatch(/<figcaption[^>]*>André<\/figcaption>/);
  });

  test("loads as a real image with its caption", async ({ page }) => {
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    await photo(page).scrollIntoViewIfNeeded();
    await expect(photo(page)).toBeVisible();
    await expect
      .poll(() => photo(page).evaluate((img: HTMLImageElement) => (img.complete ? img.naturalWidth : 0)))
      .toBeGreaterThan(0);
    await expect(page.locator("#quem-somos figcaption")).toHaveText("André");
  });

  test("on desktop sits below the first tile, to the left of the other two", async ({ page, isMobile }) => {
    test.skip(isMobile, "two columns from sm up");
    const tile = (text: string) => page.locator("#quem-somos li").filter({ hasText: text }).boundingBox();
    const boxes = () => Promise.all(["André", "desenvolvendo software", "antes do hype", "alto desempenho"].map(tile));
    for (const width of [1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(brUrl("/"), { waitUntil: "networkidle" });
      await page.locator("#quem-somos").scrollIntoViewIfNeeded();
      // Wait for the reveal to settle: a tile mid-reveal is still shifted down.
      let last = "";
      await expect
        .poll(async () => {
          const now = JSON.stringify(await boxes());
          const stable = now === last;
          last = now;
          return stable;
        })
        .toBe(true);
      const [card, first, second, third] = JSON.parse(last) as Array<{ x: number; y: number; width: number; height: number }>;
      expect(card.y).toBeGreaterThanOrEqual(first.y + first.height);
      expect(card.x + card.width).toBeLessThanOrEqual(second.x);
      expect(Math.abs(card.y - second.y)).toBeLessThanOrEqual(1);
      expect(Math.abs(card.y + card.height - (third.y + third.height))).toBeLessThanOrEqual(1);
    }
  });

  test("on a phone stacks first, inside the viewport, with no horizontal scroll", async ({ page, isMobile }) => {
    test.skip(!isMobile, "one column below sm");
    for (const width of [360, 390]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(brUrl("/"), { waitUntil: "networkidle" });
      const card = page.locator("#quem-somos li").first();
      await expect(card.getByRole("img", { name: "Foto de André" })).toHaveCount(1);
      await card.scrollIntoViewIfNeeded();
      const box = await card.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  });

  test("Italy has no photo", async ({ page }) => {
    for (const path of ["/it", "/it/wahub"]) {
      await page.goto(itUrl(path), { waitUntil: "networkidle" });
      await expect(page.locator("#quem-somos img, #quem-somos figure")).toHaveCount(0);
      expect(await page.content()).not.toContain("andre-");
    }
  });
});
