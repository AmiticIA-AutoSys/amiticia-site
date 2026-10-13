import { expect, test } from "@playwright/test";

// HTML names the hashed bundles, so it is never cached; static files from public/ are cached for
// an hour (link-preview crawlers and phones re-fetch images rarely); hashed assets are immutable.
test.describe("Cache-Control", () => {
  test.skip(({ isMobile }) => !isMobile, "headers are viewport-independent: run once");

  const NO_CACHE = "no-cache, no-store, must-revalidate";

  for (const url of ["/", "/br", "/br/", "/br/wahub", "/br/patricia", "/index.html", "/some/spa/route"]) {
    test(`${url} is never cached`, async ({ request }) => {
      const res = await request.get(url);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("text/html");
      expect(res.headers()["cache-control"]).toBe(NO_CACHE);
    });
  }

  test("a hashed /assets/ bundle is immutable for a year", async ({ request }) => {
    const html = await (await request.get("/br")).text();
    const src = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
    expect(src, "the /br page references a hashed script").toBeTruthy();
    const res = await request.get(src!);
    expect(res.status()).toBe(200);
    expect(res.headers()["cache-control"]).toContain("public, immutable");
    expect(res.headers()["cache-control"]).toContain("max-age=31536000");
  });

  for (const url of ["/og/br-home.jpg", "/og/br-wahub.jpg", "/og/br-patricia.jpg", "/og/it-home.jpg", "/og/it-wahub.jpg", "/robots.txt", "/og-image.png"]) {
    test(`${url} is cached for an hour`, async ({ request }) => {
      const res = await request.get(url);
      expect(res.status()).toBe(200);
      expect(res.headers()["cache-control"]).toBe("public, max-age=3600");
    });
  }

  test("share images are JPEGs that WhatsApp accepts (<= 180 KB)", async ({ request }) => {
    for (const name of ["br-home", "br-wahub", "br-patricia"]) {
      const res = await request.get(`/og/${name}.jpg`);
      expect(res.headers()["content-type"]).toBe("image/jpeg");
      expect((await res.body()).length).toBeLessThanOrEqual(180 * 1024);
    }
  });
});
