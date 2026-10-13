import { describe, expect, it } from "vitest";
import { headHtml, ogImageFor, type PageMeta } from "./meta";

const meta: PageMeta = {
  title: "WaHub",
  description: "Descrição",
  path: "/br/wahub",
  ogImage: "/og/br-wahub.jpg",
  ogImageAlt: "Texto alternativo",
  lang: "pt-BR",
  ogLocale: "pt_BR",
};

describe("headHtml", () => {
  it("builds absolute URLs on amiticia.cc by default and does not set robots", () => {
    const html = headHtml(meta);
    expect(html).toContain('<link rel="canonical" href="https://amiticia.cc/br/wahub" />');
    expect(html).toContain('<meta property="og:url" content="https://amiticia.cc/br/wahub" />');
    expect(html).toContain('<meta property="og:image" content="https://amiticia.cc/og/br-wahub.jpg" />');
    expect(html).not.toContain('name="robots"');
  });

  it("builds absolute URLs from the given site URL, tolerating a trailing slash", () => {
    const html = headHtml(meta, { siteUrl: "https://abc-def.trycloudflare.com/" });
    expect(html).toContain('<link rel="canonical" href="https://abc-def.trycloudflare.com/br/wahub" />');
    expect(html).toContain('<meta property="og:image" content="https://abc-def.trycloudflare.com/og/br-wahub.jpg" />');
    expect(html).toContain('<meta name="twitter:image" content="https://abc-def.trycloudflare.com/og/br-wahub.jpg" />');
    expect(html).not.toContain("amiticia.cc");
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
