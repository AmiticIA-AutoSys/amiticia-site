import { describe, expect, it } from "vitest";
import { headHtml, ogImageFor, type PageMeta } from "./meta";

const meta: PageMeta = {
  title: "WaHub",
  description: "Descrição",
  path: "/wahub",
  origin: "https://amiticia.com.br",
  ogImage: "/og/br-wahub.jpg",
  ogImageAlt: "Texto alternativo",
  lang: "pt-BR",
  ogLocale: "pt_BR",
};

describe("headHtml", () => {
  it("builds absolute URLs on the market's own origin and does not set robots", () => {
    const html = headHtml(meta);
    expect(html).toContain('<link rel="canonical" href="https://amiticia.com.br/wahub" />');
    expect(html).toContain('<meta property="og:url" content="https://amiticia.com.br/wahub" />');
    expect(html).toContain('<meta property="og:image" content="https://amiticia.com.br/og/br-wahub.jpg" />');
    expect(html).toContain('<meta name="twitter:image" content="https://amiticia.com.br/og/br-wahub.jpg" />');
    expect(html).not.toContain("amiticia.cc");
    expect(html).not.toContain('name="robots"');
  });

  it("uses amiticia.cc for the Italian pages", () => {
    const html = headHtml({ ...meta, path: "/it/wahub", origin: "https://amiticia.cc", ogImage: "/og/it-wahub.jpg" });
    expect(html).toContain('<link rel="canonical" href="https://amiticia.cc/it/wahub" />');
    expect(html).toContain('<meta property="og:image" content="https://amiticia.cc/og/it-wahub.jpg" />');
  });

  it("writes the Brazilian home canonical with a trailing slash only", () => {
    expect(headHtml({ ...meta, path: "/" })).toContain('<link rel="canonical" href="https://amiticia.com.br/" />');
  });

  it("adds noindex, nofollow when asked", () => {
    expect(headHtml(meta, { noindex: true })).toContain('<meta name="robots" content="noindex, nofollow" />');
  });

  it("describes the share image for link previews", () => {
    const html = headHtml(meta);
    expect(html).toContain('<meta property="og:image:width" content="1200" />');
    expect(html).toContain('<meta property="og:image:height" content="630" />');
    expect(html).toContain('<meta property="og:image:type" content="image/jpeg" />');
    expect(html).toContain('<meta property="og:image:alt" content="Texto alternativo" />');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
  });
});

describe("ogImageFor", () => {
  it("names one image per market page", () => {
    expect(ogImageFor("br", "home")).toBe("/og/br-home.jpg");
    expect(ogImageFor("br", "wahub")).toBe("/og/br-wahub.jpg");
    expect(ogImageFor("br", "patricia")).toBe("/og/br-patricia.jpg");
  });
});
