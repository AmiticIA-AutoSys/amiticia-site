import { expect, test } from "@playwright/test";
import { brPages, waHref } from "./fixtures";

// The first screen must work without JavaScript (DESIGN.md rule 3) and link previews need
// the page's own head tags: check the HTML nginx serves, before any script runs.
test.describe("prerendered HTML (no JS)", () => {
  test.skip(({ isMobile }) => !isMobile, "HTML is viewport-independent: run once");

  const cases = [...brPages.map((p) => ({ ...p, url: p.path })), { ...brPages[0], url: "/br/" }];

  for (const p of cases) {
    test(`${p.url} ships title, og tags, h1 and its WhatsApp link`, async ({ request }) => {
      const res = await request.get(p.url, { maxRedirects: 0 });
      expect(res.status()).toBe(200);
      const html = await res.text();
      expect(html).toMatch(/<html lang="pt-BR"/);
      expect(html).toContain(`<title>${p.title}</title>`);
      expect(html).toContain(`<meta property="og:title" content="${p.title}" />`);
      expect(html).toMatch(/<meta property="og:image" content="https:\/\/amiticia\.cc\/og\/br-[a-z]+\.jpg" \/>/);
      expect(html).toContain('<meta property="og:image:width" content="1200" />');
      expect(html).toContain(`<link rel="canonical" href="https://amiticia.cc${p.path}" />`);
      expect(html).toMatch(new RegExp(`<h1[^>]*>${p.h1}</h1>`));
      expect(html).toContain(`href="${waHref(p.message)}"`);
    });
  }
});
