import { routerFuture } from "./router-future";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteRoutes } from "./routes";
import { brCopy } from "./copy/br";
import { whatsappHrefFor } from "./whatsapp";
import { trackWhatsAppClick } from "./analytics";

vi.mock("./analytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./analytics")>()),
  trackWhatsAppClick: vi.fn(),
  trackPageview: vi.fn(),
}));

const tracked = vi.mocked(trackWhatsAppClick);

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]} future={routerFuture}>
      <SiteRoutes />
    </MemoryRouter>,
  );

const waLinks = () =>
  screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("https://wa.me/"));

beforeEach(() => {
  tracked.mockClear();
});

describe.each([
  ["/br", "home", ["header", "hero", "sticky", "cta"]],
  ["/br/wahub", "wahub", ["header", "hero", "sticky", "cta"]],
  ["/br/patricia", "patricia", ["header", "hero", "sticky", "cta"]],
] as const)("WhatsApp buttons on %s", (path, page, placements) => {
  it("all open the page's own message", () => {
    renderAt(path);
    const links = waLinks();
    expect(links.length).toBeGreaterThanOrEqual(placements.length);
    for (const a of links) expect(a).toHaveAttribute("href", whatsappHrefFor("br", page));
  });

  it("each click is tracked with the page and its placement", () => {
    renderAt(path);
    for (const a of waLinks()) fireEvent.click(a);
    const seen = tracked.mock.calls.map(([e]) => e);
    expect(seen.every((e) => e.market === "br" && e.page === page)).toBe(true);
    expect(new Set(seen.map((e) => e.placement))).toEqual(new Set(placements));
    expect(seen).toHaveLength(waLinks().length);
  });

  it("the mobile menu button is tracked as 'menu'", () => {
    renderAt(path);
    fireEvent.click(screen.getByRole("button", { name: brCopy.common.menu.open }));
    const dialog = screen.getByRole("dialog");
    const link = within(dialog)
      .getAllByRole("link")
      .find((a) => a.getAttribute("href")?.startsWith("https://wa.me/"));
    expect(link).toBeDefined();
    fireEvent.click(link!);
    expect(tracked).toHaveBeenCalledWith({ market: "br", page, placement: "menu" });
  });
});
