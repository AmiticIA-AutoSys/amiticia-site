import { routerFuture } from "../../router-future";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { brCopy } from "../../copy/br";
import { SitePageProvider } from "../../layout/page-context";
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
  it("makes each product card one link, named by its call to action, to the product page", () => {
    renderHome();
    const section = screen.getByRole("region", { name: "Nossos produtos" });
    const links = within(section).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual(["/wahub", "/patricia"]);
    expect(within(section).getByRole("link", { name: "Conhecer o WaHub" })).toHaveAttribute("href", "/wahub");
    expect(within(section).getByRole("link", { name: "Conhecer a Patrícia" })).toHaveAttribute("href", "/patricia");
  });
});

describe("home hero illustration", () => {
  it("is hidden from assistive technology, so its demo text is not announced", () => {
    renderHome();
    const hero = screen.getByRole("heading", { level: 1 }).closest("section")!;
    const illustration = hero.querySelector("[data-hero-illustration]");
    expect(illustration).not.toBeNull();
    expect(illustration).toHaveAttribute("aria-hidden", "true");
    for (const text of ["Lead qualificado", "Caso organizado"]) {
      const el = within(hero).getByText(text);
      expect(el.closest('[aria-hidden="true"]')).toBe(illustration);
    }
    // The only heading in the hero is the h1: the cards' titles are not headings.
    expect(within(hero).getAllByRole("heading").map((h) => h.tagName)).toEqual(["H1"]);
  });
});
