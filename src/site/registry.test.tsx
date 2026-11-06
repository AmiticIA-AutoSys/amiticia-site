import { routerFuture } from "./router-future";
import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { alternateMarkets, homePath, liveMarkets, markets, productPath } from "./markets";
import { productsFor } from "./products";
import { metaFor, prerenderFile, prerenderPaths, siteRoutes } from "./routes";
import { LanguageSwitcher } from "./layout/LanguageSwitcher";

describe("market and product registry", () => {
  it("has br and it live, en not yet", () => {
    expect(liveMarkets().map((m) => m.id)).toEqual(["br", "it"]);
    expect(markets.br.lang).toBe("pt-BR");
    expect(markets.it.lang).toBe("it-IT");
  });

  it("gives each market its own origin and path prefix: Brazil has none", () => {
    expect(markets.br).toMatchObject({ origin: "https://amiticia.com.br", basePath: "" });
    expect(markets.it).toMatchObject({ origin: "https://amiticia.cc", basePath: "/it" });
    expect(markets.en).toMatchObject({ origin: "https://amiticia.cc", basePath: "/en" });
  });

  it("builds route paths only from the registry helpers", () => {
    expect(homePath("br")).toBe("/");
    expect(homePath("it")).toBe("/it");
    expect(productPath("br", "wahub")).toBe("/wahub");
    expect(productPath("it", "wahub")).toBe("/it/wahub");
  });

  it("lists only WaHub under /br", () => {
    expect(productsFor("br").map((p) => p.name)).toEqual(["WaHub"]);
  });

  it("lists only WaHub under /it", () => {
    expect(productsFor("it").map((p) => p.name)).toEqual(["WaHub"]);
  });

  it("lists nothing for a market that is not live", () => {
    expect(productsFor("en")).toEqual([]);
  });

  it("prerenders each live market's home and its product pages", () => {
    expect(prerenderPaths).toEqual(["/", "/wahub", "/it", "/it/wahub"]);
  });

  it("writes each page to dist/<market>/<path within the market>/index.html, never over the SPA shell", () => {
    expect(siteRoutes.map(prerenderFile)).toEqual([
      "br/index.html",
      "br/wahub/index.html",
      "it/index.html",
      "it/wahub/index.html",
    ]);
    expect(siteRoutes.map(prerenderFile)).not.toContain("index.html");
  });

  it("leaves the market pages indexable", () => {
    expect(metaFor("/it/wahub")?.noindex).toBeFalsy();
  });
});

describe("LanguageSwitcher", () => {
  it("lists the other live markets", () => {
    expect(alternateMarkets("br").map((m) => m.id)).toEqual(["it"]);
    expect(alternateMarkets("it").map((m) => m.id)).toEqual(["br"]);
  });

  it("renders nothing when there is no other market", () => {
    const { container } = render(
      <MemoryRouter future={routerFuture}>
        <LanguageSwitcher market="br" alternates={[]} />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  const switcherHref = (market: "br" | "it", path: string | undefined, name: string) => {
    render(
      <MemoryRouter future={routerFuture}>
        <LanguageSwitcher market={market} path={path} label="Idioma" />
      </MemoryRouter>,
    );
    return screen.getByRole("link", { name });
  };

  it("links to the same page on the other market's domain (absolute URL)", () => {
    expect(switcherHref("br", "/wahub", "Italiano")).toHaveAttribute("href", "https://amiticia.cc/it/wahub");
  });

  it("maps the Brazilian home to the Italian one", () => {
    cleanup();
    expect(switcherHref("br", "/", "Italiano")).toHaveAttribute("href", "https://amiticia.cc/it");
  });

  it("maps Italian pages to clean Brazilian URLs", () => {
    expect(switcherHref("it", "/it/wahub", "Português")).toHaveAttribute("href", "https://amiticia.com.br/wahub");
    cleanup();
    expect(switcherHref("it", "/it", "Português")).toHaveAttribute("href", "https://amiticia.com.br/");
  });

  it("keeps hreflang on the switcher link", () => {
    expect(switcherHref("br", "/wahub", "Italiano")).toHaveAttribute("hreflang", "it-IT");
  });

  it("links to the other market's home when the page is unknown", () => {
    render(
      <MemoryRouter future={routerFuture}>
        <LanguageSwitcher market="it" label="Lingua" />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Português" })).toHaveAttribute("href", "https://amiticia.com.br/");
  });
});
