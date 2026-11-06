import { readFileSync } from "node:fs";
import { routerFuture } from "../../router-future";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
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

  const saiuCard = () =>
    within(productsSection()).getByRole("link", { name: "Conhecer o Saiu no DOU (abre em nova aba)" });

  it("has exactly two cards, WaHub first, each one a single link", () => {
    renderHome();
    const links = within(productsSection()).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual(["/wahub", "https://saiunodou.com.br"]);
    expect(within(productsSection()).getAllByRole("heading", { level: 3 })).toHaveLength(2);
  });

  it("keeps the WaHub card inside the site, in the same tab", () => {
    renderHome();
    const wahub = within(productsSection()).getByRole("link", { name: "Conhecer o WaHub" });
    expect(wahub).toHaveAttribute("href", "/wahub");
    expect(wahub).not.toHaveAttribute("target");
  });

  it("makes the whole Saiu no DOU card open its own site in a new tab", () => {
    renderHome();
    const card = saiuCard();
    expect(card).toHaveAttribute("href", "https://saiunodou.com.br");
    expect(card).toHaveAttribute("target", "_blank");
    expect(card).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("gives Saiu no DOU the same anatomy as WaHub: name, title, description and call to action", () => {
    renderHome();
    const card = saiuCard();
    expect(within(card).getByText("Saiu no DOU")).toBeInTheDocument();
    expect(
      within(card).getByRole("heading", { level: 3, name: "Busca pública e gratuita no Diário Oficial da União" }),
    ).toBeInTheDocument();
    expect(card).toHaveAccessibleDescription(
      "Busca pública e gratuita no Diário Oficial da União Portarias, editais, nomeações, aposentadorias e concursos: cada resultado leva à publicação oficial no DOU.",
    );
    expect(card).toHaveTextContent("Conhecer o Saiu no DOU");
  });

  it("draws the Saiu no DOU search as a decorative illustration with fictional labels", () => {
    renderHome();
    const illustration = saiuCard().querySelector('[aria-hidden="true"]');
    expect(illustration).not.toBeNull();
    for (const label of ["concurso público", "Seção 3", "Seção 2", "Portaria de nomeação", "Órgão Exemplo"]) {
      expect(illustration).toHaveTextContent(label);
    }
    expect(illustration).toHaveTextContent("Edital de concurso público");
    // Hidden from assistive technology: only the call to action names the card.
    expect(within(saiuCard()).queryByText("Portaria de nomeação")).toBeInTheDocument();
    expect(saiuCard()).not.toHaveAccessibleName(expect.stringContaining("Portaria"));
  });

  it("offers no WhatsApp link inside the section", () => {
    renderHome();
    const hrefs = within(productsSection()).getAllByRole("link").map((l) => l.getAttribute("href") ?? "");
    expect(hrefs.filter((h) => h.includes("wa.me"))).toEqual([]);
  });
});

describe("Saiu no DOU in the site navigation", () => {
  const renderSite = () =>
    render(
      <MemoryRouter initialEntries={["/"]} future={routerFuture}>
        <SiteRoutes />
      </MemoryRouter>,
    );

  const expectNewTabLink = (link: HTMLElement) => {
    expect(link).toHaveAttribute("href", "https://saiunodou.com.br");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  };

  it("is in the footer, and says it opens in a new tab", () => {
    renderSite();
    const footer = screen.getByRole("contentinfo");
    expectNewTabLink(within(footer).getByRole("link", { name: "Saiu no DOU (abre em nova aba)" }));
    expect(within(footer).getByRole("link", { name: "WaHub" })).toHaveAttribute("href", "/wahub");
  });

  it("follows WaHub in the mobile menu, and says it opens in a new tab", () => {
    renderSite();
    fireEvent.click(screen.getByRole("button", { name: brCopy.common.menu.open }));
    const links = within(screen.getByRole("dialog")).getAllByRole("link");
    const names = links.map((a) => a.textContent ?? "");
    expect(names.indexOf("Saiu no DOU (abre em nova aba)")).toBe(names.indexOf("WaHub") + 1);
    expectNewTabLink(links[names.indexOf("Saiu no DOU (abre em nova aba)")]);
  });

  it("follows WaHub in the header's product list, as an external entry", () => {
    expect(brCopy.common.nav.products.items).toEqual([
      { label: "WaHub", to: "/wahub" },
      { label: "Saiu no DOU", to: "https://saiunodou.com.br", external: true },
    ]);
  });
});

describe("how we work", () => {
  it('calls the first step "Diagnóstico", no longer "Diagnóstico Rápido"', () => {
    const { container } = renderHome();
    expect(screen.getByRole("heading", { level: 4, name: "Diagnóstico" })).toBeInTheDocument();
    expect(container.textContent).not.toContain("Diagnóstico Rápido");
  });
});

describe("home hero lead", () => {
  it("speaks of one ready-made product, as Andre approved", () => {
    renderHome();
    const lead = screen.getByRole("heading", { level: 1 }).closest("section")!.querySelector("p.v2-lead");
    expect(lead).toHaveTextContent("Temos um produto pronto que coloca a IA para atender no WhatsApp da sua empresa");
    expect(lead).not.toHaveTextContent("produtos prontos");
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

describe("home Quem somos photo", () => {
  const about = () => document.getElementById("quem-somos") as HTMLElement;
  const photo = () => within(about()).getByRole("img", { name: "Foto de André" });

  it("shows André's photo, captioned with his name and nothing else", () => {
    renderHome();
    expect(photo().closest("figure")?.querySelector("figcaption")?.textContent).toBe("André");
  });

  it("describes him as neither founder nor owner", () => {
    renderHome();
    expect(about().textContent).not.toMatch(/fundador|fundou|founder|dono|propriet|s[oó]cio|CEO/i);
  });

  it("reserves its space, loads lazily and offers both sizes", () => {
    renderHome();
    expect(photo()).toHaveAttribute("width", "540");
    expect(photo()).toHaveAttribute("height", "675");
    expect(photo()).toHaveAttribute("loading", "lazy");
    expect(photo().getAttribute("srcset")).toMatch(/270w.*540w/);
    expect(photo().getAttribute("sizes")).toBeTruthy();
  });

  it("shares the highlight tiles' card: same radius, border and surface", () => {
    renderHome();
    const card = photo().closest("li") as HTMLElement;
    const tile = within(about()).getByText("antes do hype").closest("li") as HTMLElement;
    for (const name of ["rounded-[20px]", "border", "border-border", "bg-surface"]) {
      expect(card).toHaveClass(name);
      expect(tile).toHaveClass(name);
    }
  });

  it.each(["andre-270.webp", "andre-540.webp"])("%s is a small WebP with no metadata", (name) => {
    const bytes = readFileSync(`src/site/assets/${name}`);
    expect(bytes.subarray(0, 4).toString("latin1")).toBe("RIFF");
    expect(bytes.subarray(8, 12).toString("latin1")).toBe("WEBP");
    expect(bytes.includes("EXIF")).toBe(false);
    expect(bytes.includes("XMP ")).toBe(false);
    expect(bytes.length).toBeLessThanOrEqual(60 * 1024);
  });
});
