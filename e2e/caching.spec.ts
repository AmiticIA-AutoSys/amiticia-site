import { expect, test } from "@playwright/test";
import { BR_HOST, IT_HOST, getAs } from "./fixtures";

// HTML names the hashed bundles, so it is never cached; static files from public/ are cached for
// an hour (link-preview crawlers and phones re-fetch images rarely); hashed assets are immutable.
test.describe("Cache-Control", () => {
  test.skip(({ isMobile }) => !isMobile, "headers are viewport-independent: run once");

  const NO_CACHE = "no-cache, no-store, must-revalidate";

  const htmlPages: Array<[string, string]> = [
    [BR_HOST, "/"],
    [BR_HOST, "/wahub"],
    [BR_HOST, "/wahub/"],
    [BR_HOST, "/patricia"],
    [BR_HOST, "/index.html"],
    [BR_HOST, "/some/spa/route"],
    [IT_HOST, "/it"],
    [IT_HOST, "/it/"],
    [IT_HOST, "/it/wahub"],
    [IT_HOST, "/it/patricia"],
    [IT_HOST, "/index.html"],
    [IT_HOST, "/some/spa/route"],
  ];
  for (const [host, url] of htmlPages) {
    test(`${host}${url} is never cached`, async ({ request }) => {
      const res = await getAs(request, host, url);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("text/html");
      expect(res.headers()["cache-control"]).toBe(NO_CACHE);
    });
  }

  test("a hashed /assets/ bundle is immutable for a year", async ({ request }) => {
    for (const [host, page] of [[BR_HOST, "/"], [IT_HOST, "/it"]]) {
      const html = await (await getAs(request, host, page)).text();
      const src = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
      expect(src, `${host}${page} references a hashed script`).toBeTruthy();
      const res = await getAs(request, host, src!);
      expect(res.status()).toBe(200);
      expect(res.headers()["cache-control"]).toContain("public, immutable");
      expect(res.headers()["cache-control"]).toContain("max-age=31536000");
    }
  });

  for (const url of ["/og/br-home.jpg", "/og/br-wahub.jpg", "/og/br-patricia.jpg", "/og/it-home.jpg", "/og/it-wahub.jpg", "/robots.txt", "/og-image.png"]) {
    for (const host of [BR_HOST, IT_HOST]) {
      test(`${host}${url} is cached for an hour`, async ({ request }) => {
        const res = await getAs(request, host, url);
        expect(res.status()).toBe(200);
        expect(res.headers()["cache-control"]).toBe("public, max-age=3600");
      });
    }
  }

  test("share images are JPEGs that WhatsApp accepts (<= 180 KB)", async ({ request }) => {
    for (const name of ["br-home", "br-wahub", "br-patricia"]) {
      const res = await request.get(`/og/${name}.jpg`);
      expect(res.headers()["content-type"]).toBe("image/jpeg");
      expect((await res.body()).length).toBeLessThanOrEqual(180 * 1024);
    }
  });
});
