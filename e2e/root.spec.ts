import { expect, test } from "@playwright/test";

// The bare domain opens a market picked from the browser language, never the legacy landing:
// the first Italian or Portuguese entry in Accept-Language wins; anything else goes to /it, the
// main audience, until /en exists. GPS and IP never count.
test.describe("bare domain /", () => {
  test.skip(({ isMobile }) => !isMobile, "headers are viewport-independent: run once");

  const cases: Array<[string, string | undefined, string]> = [
    ["Italian browser", "it-IT,it;q=0.9,en;q=0.8", "/it"],
    ["Brazilian browser", "pt-BR,pt;q=0.9,en-US;q=0.8", "/br"],
    ["Portuguese (Portugal) browser", "pt-PT", "/br"],
    ["English first, Italian next", "en-US,en;q=0.9,it;q=0.8,pt;q=0.7", "/it"],
    ["English first, Portuguese next", "en-US,en;q=0.9,pt-BR;q=0.8,it;q=0.7", "/br"],
    ["upper-case tag", "IT-it", "/it"],
    ["a tag that merely contains pt/it does not count", "en-IT,pt;q=0.5", "/br"],
    ["other language", "de-DE,de;q=0.9", "/it"],
    ["no Accept-Language", undefined, "/it"],
  ];

  for (const [name, lang, target] of cases) {
    test(`${name} → ${target}`, async ({ request }) => {
      const res = await request.get("/", {
        maxRedirects: 0,
        headers: lang === undefined ? {} : { "Accept-Language": lang },
      });
      expect(res.status()).toBe(302);
      expect(res.headers()["location"]).toBe(target);
    });
  }

  test("the redirect varies by language and is never cached", async ({ request }) => {
    const res = await request.get("/", { maxRedirects: 0 });
    expect(res.headers()["vary"]).toBe("Accept-Language");
    expect(res.headers()["cache-control"]).toBe("no-store");
  });

  test("a browser opening / lands on the Italian home, not the legacy landing", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    expect(new URL(page.url()).pathname).toBe("/it");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Intelligenza e Automazione che Scalano");
  });
});
