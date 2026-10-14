import { routerFuture } from "./router-future";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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

describe("/it/patricia", () => {
  it("says Patrícia is not available in Italy and links to the /it home", () => {
    renderAt("/it/patricia");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Patrícia non è ancora disponibile in Italia");
    expect(screen.getByRole("link", { name: "Vai alla home" })).toHaveAttribute("href", "/it");
  });
});

describe("Brazilian pages", () => {
  it("offer Italiano, which opens the same page on amiticia.cc/it", () => {
    renderAt("/patricia");
    expect(screen.getByRole("link", { name: "Italiano" })).toHaveAttribute("href", "https://amiticia.cc/it/patricia");
  });
});

describe("Brazilian links carry no /br prefix", () => {
  for (const path of ["/", "/wahub", "/patricia"]) {
    it(`${path}: no link points at a /br path; menu and anchors use clean paths`, () => {
      renderAt(path);
      const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href") ?? "");
      expect(hrefs.filter((h) => /^\/br(\/|#|$)/.test(h))).toEqual([]);
      expect(hrefs).toContain("/wahub");
      expect(hrefs).toContain("/#sob-medida");
    });
  }
});
