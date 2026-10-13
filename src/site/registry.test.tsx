import { routerFuture } from "./router-future";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { alternateMarkets, liveMarkets, markets } from "./markets";
import { productsFor } from "./products";
import { metaFor, prerenderPaths, siteRoutes } from "./routes";
import { LanguageSwitcher } from "./layout/LanguageSwitcher";

describe("market and product registry", () => {
  it("has br and it live, en not yet", () => {
    expect(liveMarkets().map((m) => m.id)).toEqual(["br", "it"]);
    expect(markets.br.lang).toBe("pt-BR");
    expect(markets.it.lang).toBe("it-IT");
  });

  it("lists WaHub and Patrícia under /br", () => {
    expect(productsFor("br").map((p) => p.name)).toEqual(["WaHub", "Patrícia"]);
  });

  it("lists only WaHub under /it", () => {
    expect(productsFor("it").map((p) => p.name)).toEqual(["WaHub"]);
  });

  it("lists nothing for a market that is not live", () => {
    expect(productsFor("en")).toEqual([]);
  });

  it("prerenders each live market's home, its product pages and a not-available page for the rest", () => {
    expect(prerenderPaths).toEqual(["/br", "/br/wahub", "/br/patricia", "/it", "/it/wahub", "/it/patricia"]);
    expect(siteRoutes.find((r) => r.path === "/it/patricia")?.page).toBe("unavailable");
  });

  it("keeps a not-available page out of search engines", () => {
    expect(metaFor("/it/patricia")?.noindex).toBe(true);
    expect(metaFor("/it/patricia")?.title).toMatch(/Patrícia/);
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

  it("links to the same page in the other market", () => {
    render(
      <MemoryRouter future={routerFuture}>
        <LanguageSwitcher market="br" path="/br/wahub" label="Idioma" />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Italiano" })).toHaveAttribute("href", "/it/wahub");
  });

  it("links to the other market's home when the page is unknown", () => {
    render(
      <MemoryRouter future={routerFuture}>
        <LanguageSwitcher market="it" label="Lingua" />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Português" })).toHaveAttribute("href", "/br");
  });
});
