import { routerFuture } from "./router-future";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { alternateMarkets, liveMarkets, markets } from "./markets";
import { productsFor } from "./products";
import { prerenderPaths } from "./routes";
import { LanguageSwitcher } from "./layout/LanguageSwitcher";

describe("market and product registry", () => {
  it("has br as the only live market today", () => {
    expect(liveMarkets().map((m) => m.id)).toEqual(["br"]);
    expect(markets.br.lang).toBe("pt-BR");
  });

  it("lists WaHub and Patrícia under /br", () => {
    expect(productsFor("br").map((p) => p.name)).toEqual(["WaHub", "Patrícia"]);
  });

  it("lists nothing for a market that is not live", () => {
    expect(productsFor("it")).toEqual([]);
  });

  it("prerenders the br home and one page per product", () => {
    expect(prerenderPaths).toEqual(["/br", "/br/wahub", "/br/patricia"]);
  });
});

describe("LanguageSwitcher", () => {
  it("renders nothing while br is the only live market", () => {
    expect(alternateMarkets("br")).toEqual([]);
    const { container } = render(
      <MemoryRouter future={routerFuture}>
        <LanguageSwitcher market="br" />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("links to the other live markets once they exist", () => {
    render(
      <MemoryRouter future={routerFuture}>
        <LanguageSwitcher market="br" alternates={[markets.it]} label="Idioma" />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Italiano" })).toHaveAttribute("href", "/it");
  });
});
