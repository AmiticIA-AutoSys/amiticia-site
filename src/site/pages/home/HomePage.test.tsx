import { routerFuture } from "../../router-future";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { brCopy } from "../../copy/br";
import { SitePageProvider } from "../../layout/page-context";
import { SiteRoutes } from "../../routes";
import { HomePage } from "./HomePage";

const renderHome = () =>
  render(
    <MemoryRouter initialEntries={["/"]} future={routerFuture}>
      <SitePageProvider market="br" page="home">
        <HomePage copy={brCopy.home} />
      </SitePageProvider>
    </MemoryRouter>,
  );

describe("home products section", () => {
  const productsSection = () => screen.getByRole("region", { name: "Nossos produtos" });

  it("has exactly two links: the WaHub card and the Saiu no DOU row", () => {
    renderHome();
    const links = within(productsSection()).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual(["/wahub", "https://saiunodou.com.br"]);
    expect(within(productsSection()).getByRole("link", { name: "Conhecer o WaHub" })).toHaveAttribute("href", "/wahub");
  });

  it("shows Saiu no DOU as one quiet link that opens the site in a new tab", () => {
    renderHome();
    const link = within(productsSection()).getByRole("link", { name: /Saiu no DOU/ });
    expect(link).toHaveAttribute("href", "https://saiunodou.com.br");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent("Busca pública e gratuita no Diário Oficial da União.");
    expect(link).toHaveTextContent("saiunodou.com.br");
    expect(link).toHaveTextContent("(abre em nova aba)");
    // Quiet by construction: a row of text, never a product card with its own heading.
    expect(within(link).queryByRole("heading")).toBeNull();
  });

  it("offers no WhatsApp link inside the section", () => {
    renderHome();
    const hrefs = within(productsSection()).getAllByRole("link").map((l) => l.getAttribute("href") ?? "");
    expect(hrefs.filter((h) => h.includes("wa.me"))).toEqual([]);
  });
});

describe("home hero illustration", () => {
  it("is hidden from assistive technology, so its demo text is not announced", () => {
    renderHome();
    const hero = screen.getByRole("heading", { level: 1 }).closest("section")!;
    const illustration = hero.querySelector("[data-hero-illustration]");
    expect(illustration).not.toBeNull();
    expect(illustration).toHaveAttribute("aria-hidden", "true");
    const el = within(hero).getByText("Lead qualificado");
    expect(el.closest('[aria-hidden="true"]')).toBe(illustration);
    // The only heading in the hero is the h1: the cards' titles are not headings.
    expect(within(hero).getAllByRole("heading").map((h) => h.tagName)).toEqual(["H1"]);
  });

  it("shows only the WaHub flow, not the retired case-briefing flow", () => {
    renderHome();
    const hero = screen.getByRole("heading", { level: 1 }).closest("section")!;
    expect(within(hero).queryByText("Caso organizado")).toBeNull();
  });
});

describe("the retired product", () => {
  it("appears nowhere on the rendered home, header and footer included", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]} future={routerFuture}>
        <SiteRoutes />
      </MemoryRouter>,
    );
    expect(container.textContent).not.toMatch(/patr[ií]cia/i);
    expect(container.innerHTML).not.toMatch(/patr[ií]cia/i);
  });
});
