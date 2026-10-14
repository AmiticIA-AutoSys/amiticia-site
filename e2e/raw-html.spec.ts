import { expect, test } from "@playwright/test";
import { BR_HOST, IT_HOST, brPages, getAs, sitePages, waHref } from "./fixtures";

// The first screen must work without JavaScript (DESIGN.md rule 3) and link previews need
// the page's own head tags: check the HTML nginx serves, before any script runs.
test.describe("prerendered HTML (no JS)", () => {
  test.skip(({ isMobile }) => !isMobile, "HTML is viewport-independent: run once");

  const cases = [
    ...sitePages.map((p) => ({ ...p, request: p.path })),
    { ...brPages[1], request: "/wahub/" },
  ];

  for (const p of cases) {
    test(`${p.host}${p.request} ships title, og tags, h1 and its WhatsApp link`, async ({ request }) => {
      const res = await getAs(request, p.host, p.request, { maxRedirects: 0 });
      expect(res.status()).toBe(200);
      const html = await res.text();
      expect(html).toContain(`<html lang="${p.lang}"`);
      expect(html).toContain(`<title>${p.title}</title>`);
      expect(html).toContain(`<meta property="og:title" content="${p.title}" />`);
      expect(html).toMatch(
        new RegExp(`<meta property="og:image" content="${p.origin.replace(/\./g, "\\.")}/og/(br|it)-[a-z]+\\.jpg" />`),
      );
      expect(html).toContain('<meta property="og:image:width" content="1200" />');
      expect(html).toContain(`<link rel="canonical" href="${p.origin}${p.path}" />`);
      expect(html).toMatch(new RegExp(`<h1[^>]*>${p.h1}</h1>`));
      expect(html).toContain(`href="${waHref(p.message, p.number)}"`);
    });
  }

  // AC12: each market's share image lives on that market's own origin.
  test("amiticia.com.br/wahub names its own origin for canonical and og:image", async ({ request }) => {
    const html = await (await getAs(request, BR_HOST, "/wahub")).text();
    expect(html).toContain('<link rel="canonical" href="https://amiticia.com.br/wahub" />');
    expect(html).toContain('<meta property="og:image" content="https://amiticia.com.br/og/br-wahub.jpg" />');
    expect(html).not.toMatch(/<(meta|link)[^>]*(content|href)="https:\/\/amiticia\.cc/);
  });

  test("the Brazilian home canonical is https://amiticia.com.br/", async ({ request }) => {
    const html = await (await getAs(request, BR_HOST, "/")).text();
    expect(html).toContain('<link rel="canonical" href="https://amiticia.com.br/" />');
  });

  test("amiticia.cc/it/wahub names amiticia.cc for canonical and og:image", async ({ request }) => {
    const html = await (await getAs(request, IT_HOST, "/it/wahub")).text();
    expect(html).toContain('<link rel="canonical" href="https://amiticia.cc/it/wahub" />');
    expect(html).toContain('<meta property="og:image" content="https://amiticia.cc/og/it-wahub.jpg" />');
  });

  // AC6: www behaves exactly like the apex, canonical still pointing at the apex.
  test("www.amiticia.com.br serves the same Brazilian home, canonical on the apex", async ({ request }) => {
    const res = await getAs(request, `www.${BR_HOST}`, "/", { maxRedirects: 0 });
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('<link rel="canonical" href="https://amiticia.com.br/" />');
    expect(html).toMatch(/<h1[^>]*>Inteligência e Automação que Escala<\/h1>/);
  });

  // A <style> is raw text: escaped CSS (&quot;…) breaks the selectors and fails hydration (#418).
  for (const p of sitePages) {
    test(`${p.host}${p.path} writes its inline CSS unescaped`, async ({ request }) => {
      const html = await (await getAs(request, p.host, p.path)).text();
      for (const css of html.match(/<style[^>]*>[\s\S]*?<\/style>/g) ?? []) {
        expect(css).not.toMatch(/&(quot|#x27|#39|lt|gt|amp);/);
      }
    });
  }

  test("/it/patricia stays out of search engines in every build", async ({ request }) => {
    const html = await (await getAs(request, IT_HOST, "/it/patricia")).text();
    expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(html).toContain('<meta property="og:image" content="https://amiticia.cc/og/it-home.jpg" />');
  });

  test("/it/wahub is indexable in the production build", async ({ request }) => {
    expect(await (await getAs(request, IT_HOST, "/it/wahub")).text()).not.toContain('name="robots"');
  });
});
