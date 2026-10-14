import { expect, test } from "@playwright/test";
import { BR_HOST, IT_HOST, brUrl, getAs, itUrl, urlOf } from "./fixtures";

const BR = "https://amiticia.com.br";
const CC = "https://amiticia.cc";

const redirect = async (
  request: Parameters<typeof getAs>[0],
  host: string,
  path: string,
) => {
  const res = await getAs(request, host, path, { maxRedirects: 0 });
  return { status: res.status(), location: res.headers()["location"] };
};

// Proof that the suite really reaches each hostname: if the mechanism sent the wrong host, these
// would fail, because the two domains answer `/` differently (200 Brazilian home vs 302).
test.describe("the suite reaches both hostnames", () => {
  test.skip(({ isMobile }) => !isMobile, "headers are viewport-independent: run once");

  test("request: Host amiticia.com.br gets the Brazilian home, Host amiticia.cc gets the redirect", async ({ request }) => {
    const br = await getAs(request, BR_HOST, "/", { maxRedirects: 0 });
    expect(br.status()).toBe(200);
    const cc = await getAs(request, IT_HOST, "/", { maxRedirects: 0 });
    expect(cc.status()).toBe(302);
  });

  test("browser: amiticia.com.br/ stays on / and shows the Brazilian h1; amiticia.cc/ goes to /it", async ({ page }) => {
    await page.goto(brUrl("/"), { waitUntil: "networkidle" });
    expect(new URL(page.url()).host).toBe(BR_HOST);
    expect(new URL(page.url()).pathname).toBe("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Inteligência e Automação que Escala");
    await page.goto(itUrl("/"), { waitUntil: "networkidle" });
    expect(new URL(page.url()).host).toBe(IT_HOST);
    expect(new URL(page.url()).pathname).toBe("/it");
  });

  test("the wrong host is observable: amiticia.cc/wahub is not the Brazilian page", async ({ request }) => {
    expect((await redirect(request, IT_HOST, "/wahub")).status).toBe(301);
    expect((await getAs(request, BR_HOST, "/wahub")).status()).toBe(200);
  });
});

test.describe("amiticia.com.br", () => {
  test.skip(({ isMobile }) => !isMobile, "headers are viewport-independent: run once");

  for (const path of ["/", "/wahub", "/wahub/", "/patricia"]) {
    test(`${path} answers 200 without a redirect`, async ({ request }) => {
      const res = await getAs(request, BR_HOST, path, { maxRedirects: 0 });
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("text/html");
    });
  }

  const redirects: Array<[string, string]> = [
    ["/br", `${BR}/`],
    ["/br/", `${BR}/`],
    ["/br/wahub", `${BR}/wahub`],
    ["/br/wahub?utm_source=ad", `${BR}/wahub?utm_source=ad`],
    ["/it", `${CC}/it`],
    ["/it/wahub", `${CC}/it/wahub`],
    ["/k", `${CC}/k`],
    ["/k/data/x", `${CC}/k/data/x`],
    ["/k/api/x", `${CC}/k/api/x`],
    ["/k/api/x?q=1", `${CC}/k/api/x?q=1`],
  ];
  for (const host of [BR_HOST, `www.${BR_HOST}`]) {
    for (const [path, location] of redirects) {
      test(`${host}${path} → 301 ${location}`, async ({ request }) => {
        expect(await redirect(request, host, path)).toEqual({ status: 301, location });
      });
    }
  }

  test("the knowledge area is never served here: no BasicAuth-less /k, no token-injecting proxy", async ({ request }) => {
    for (const path of ["/k", "/k/data/x", "/k/api/x"]) {
      const res = await getAs(request, BR_HOST, path, { maxRedirects: 0 });
      expect(res.status()).toBe(301);
      expect(await res.text()).not.toContain('<div id="root">');
    }
  });
});

test.describe("amiticia.cc", () => {
  test.skip(({ isMobile }) => !isMobile, "headers are viewport-independent: run once");

  for (const path of ["/it", "/it/wahub", "/it/patricia"]) {
    test(`${path} answers 200`, async ({ request }) => {
      expect((await getAs(request, IT_HOST, path, { maxRedirects: 0 })).status()).toBe(200);
    });
  }

  const redirects: Array<[string, string]> = [
    ["/br", `${BR}/`],
    ["/br/wahub", `${BR}/wahub`],
    ["/br/patricia", `${BR}/patricia`],
    ["/br/wahub?utm_source=ad", `${BR}/wahub?utm_source=ad`],
    ["/wahub", `${BR}/wahub`],
    ["/patricia", `${BR}/patricia`],
  ];
  for (const [path, location] of redirects) {
    test(`${path} → 301 ${location}`, async ({ request }) => {
      expect(await redirect(request, IT_HOST, path)).toEqual({ status: 301, location });
    });
  }
});

// AC13: the language switcher opens the same page on the other domain.
test.describe("language switcher", () => {
  const cases: Array<[string, string, string, string]> = [
    [BR_HOST, "/wahub", "Italiano", `${CC}/it/wahub`],
    [BR_HOST, "/", "Italiano", `${CC}/it`],
    [BR_HOST, "/patricia", "Italiano", `${CC}/it/patricia`],
    [IT_HOST, "/it/wahub", "Português", `${BR}/wahub`],
    [IT_HOST, "/it", "Português", `${BR}/`],
  ];
  for (const [host, path, name, href] of cases) {
    test(`${host}${path} offers ${name} at ${href}`, async ({ page }) => {
      await page.goto(urlOf(host, path), { waitUntil: "networkidle" });
      const link = page.getByRole("link", { name, exact: true }).first();
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("hreflang", /./);
    });
  }
});
