import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SitePageProvider, useSitePage } from "./page-context";
import type { MarketId } from "../markets";

const Href = () => <a href={useSitePage().whatsappHref}>wa</a>;

const renderAt = (market: MarketId, search: string) => {
  window.history.replaceState(null, "", `/wahub${search}`);
  render(
    <SitePageProvider market={market} page="wahub">
      <Href />
    </SitePageProvider>,
  );
  return screen.getByRole("link").getAttribute("href");
};

afterEach(() => window.history.replaceState(null, "", "/"));

describe("?ref= attribution", () => {
  it("adds the partner to the BR WhatsApp message", () => {
    const href = renderAt("br", "?ref=magno");
    expect(href).toBe(
      `https://wa.me/5531986983745?text=${encodeURIComponent("Olá! Vi o WaHub no site da AmiticIA e gostaria de saber mais. (indicação de Magno)")}`,
    );
  });

  it("leaves the link unchanged without ref", () => {
    expect(renderAt("br", "")).toBe(
      `https://wa.me/5531986983745?text=${encodeURIComponent("Olá! Vi o WaHub no site da AmiticIA e gostaria de saber mais.")}`,
    );
  });

  it("leaves the link unchanged when ref has nothing usable", () => {
    expect(renderAt("br", "?ref=!!!")).not.toContain("indica");
  });

  it("leaves the Italian link unchanged", () => {
    expect(renderAt("it", "?ref=magno")).not.toContain("Magno");
  });
});
