import { routerFuture } from "./router-future";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { itCopy } from "./copy/it";
import { SiteRoutes } from "./routes";

const IT_NUMBER = "393926044070";

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]} future={routerFuture}>
      <SiteRoutes />
    </MemoryRouter>,
  );

const waLinks = () =>
  screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("https://wa.me/"));

describe("/it home", () => {
  it("is in Italian, offers only WaHub and has the Soluzioni su misura section", () => {
    renderAt("/it");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Intelligenza e Automazione che Scalano");
    const products = screen.getByRole("region", { name: "Il nostro prodotto" });
    expect(within(products).getAllByRole("link").map((l) => l.getAttribute("href"))).toEqual(["/it/wahub"]);
    expect(screen.getByRole("heading", { name: "Soluzioni su misura" })).toBeInTheDocument();
    expect(screen.queryByText(/Patrícia/)).toBeNull();
  });

  it("does not show Saiu no DOU, which is a Brazilian product", () => {
    const { container } = renderAt("/it");
    expect(container.textContent).not.toContain("Saiu no DOU");
    expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).not.toContain("https://saiunodou.com.br");
  });

  it.each(["/it", "/it/wahub"])("%s has no Saiu no DOU in the menu or the footer", (path) => {
    renderAt(path);
    expect(within(screen.getByRole("contentinfo")).queryByText(/Saiu no DOU/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: itCopy.common.menu.open }));
    expect(within(screen.getByRole("dialog")).queryByText(/Saiu no DOU/)).toBeNull();
    expect(itCopy.common.nav.products.items).toEqual([{ label: "WaHub", to: "/it/wahub" }]);
  });

  it("stays one full-width product card", () => {
    renderAt("/it");
    const products = screen.getByRole("region", { name: "Il nostro prodotto" });
    expect(within(products).getByRole("link").parentElement).toHaveClass("md:col-span-2");
  });

  it("sends every WhatsApp button to the Italian number", () => {
    renderAt("/it");
    const links = waLinks();
    expect(links.length).toBeGreaterThan(0);
    for (const a of links) expect(a.getAttribute("href")).toContain(`https://wa.me/${IT_NUMBER}?text=`);
  });

  it("offers Português, which opens the same page on amiticia.com.br", () => {
    renderAt("/it");
    expect(screen.getByRole("link", { name: "Português" })).toHaveAttribute("href", "https://amiticia.com.br/");
  });
});

describe("/it/wahub", () => {
  it("shows the Italian demo and the Italian screenshots", () => {
    const { container } = renderAt("/it/wahub");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Tutto il tuo team risponde sullo stesso numero WhatsApp",
    );
    expect(screen.getAllByText("Riccardo Esposito").length).toBeGreaterThan(0);
    const srcs = [...container.querySelectorAll("img[srcset]")].map((i) => i.getAttribute("srcset") ?? "");
    expect(srcs.length).toBeGreaterThan(0);
    for (const s of srcs) expect(s).toContain("/wahub/it/");
  });

  it("shows the cost comparison ratified for Italy", () => {
    renderAt("/it/wahub");
    expect(screen.getByText("Costa meno di 1/10 di un dipendente.")).toBeInTheDocument();
  });

  it("switches language to amiticia.com.br/wahub", () => {
    renderAt("/it/wahub");
    expect(screen.getByRole("link", { name: "Português" })).toHaveAttribute("href", "https://amiticia.com.br/wahub");
  });
});

describe("Brazilian pages", () => {
  it("offer Italiano, which opens the same page on amiticia.cc/it", () => {
    renderAt("/wahub");
    expect(screen.getByRole("link", { name: "Italiano" })).toHaveAttribute("href", "https://amiticia.cc/it/wahub");
  });
});

describe("Brazilian links carry no /br prefix", () => {
  for (const path of ["/", "/wahub"]) {
    it(`${path}: no link points at a /br path; menu and anchors use clean paths`, () => {
      renderAt(path);
      const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href") ?? "");
      expect(hrefs.filter((h) => /^\/br(\/|#|$)/.test(h))).toEqual([]);
      expect(hrefs).toContain("/wahub");
      expect(hrefs).toContain("/#sob-medida");
    });
  }
});
