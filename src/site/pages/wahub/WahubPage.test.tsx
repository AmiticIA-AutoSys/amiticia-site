import { routerFuture } from "../../router-future";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { brCopy } from "../../copy/br";
import { itCopy } from "../../copy/it";
import type { WahubCopy } from "../../copy/types";
import { SitePageProvider } from "../../layout/page-context";
import { WahubPage } from "./WahubPage";

const renderWahub = (copy: WahubCopy) =>
  render(
    <MemoryRouter initialEntries={["/wahub"]} future={routerFuture}>
      <SitePageProvider market="br" page="wahub">
        <WahubPage copy={copy} />
      </SitePageProvider>
    </MemoryRouter>,
  );

describe("WaHub pending claims", () => {
  it("shows neither the 'desde' proof nor the 1/10 comparison while both are null", () => {
    expect(brCopy.wahub.liveSince.value).toBeNull();
    expect(brCopy.wahub.costComparison.value).toBeNull();
    renderWahub(brCopy.wahub);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(brCopy.wahub.hero.title);
    expect(document.body).not.toHaveTextContent(/desde/i);
    expect(document.body).not.toHaveTextContent("1/10");
    expect(screen.queryByRole("heading", { name: "Quanto custa" })).not.toBeInTheDocument();
  });

  it("shows both lines once the values are confirmed", () => {
    renderWahub({
      ...brCopy.wahub,
      liveSince: { ...brCopy.wahub.liveSince, value: "março de 2026" },
      costComparison: { ...brCopy.wahub.costComparison, value: "1/10" },
    });
    expect(
      screen.getByText(
        "O assistente de IA do WaHub está testado e em uso numa empresa de serviços no Brasil desde março de 2026.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Quanto custa" })).toBeInTheDocument();
    expect(screen.getByText("Custa menos de 1/10 de um funcionário.")).toBeInTheDocument();
  });
});

describe("WaHub demo video", () => {
  it("renders the video section right after the hero in Portuguese", () => {
    const { container } = renderWahub(brCopy.wahub);
    expect(screen.getByRole("heading", { level: 2, name: "Veja o WaHub atendendo, em 1min30" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Empresa fictícia. As telas e as respostas do assistente de IA são reais; a narração usa voz sintética.",
      ),
    ).toBeInTheDocument();
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("controls");
    expect(video).not.toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("preload", "metadata");
    expect(video).toHaveAttribute("aria-label", "Vídeo: o WaHub atendendo um cliente no WhatsApp, 1min30");
    expect(video?.getAttribute("poster")).toMatch(/\.webp/);
    expect(video?.querySelector("source")).toHaveAttribute("src", "/media/wahub-demo-pt-v1.mp4");
    expect(video?.querySelector("source")).toHaveAttribute("type", "video/mp4");
    const section = container.querySelector("section#video");
    expect(section?.previousElementSibling?.querySelector("h1")).not.toBeNull();
    expect(section?.querySelector('a[data-placement="cta"]')).toHaveTextContent("Falar sobre o WaHub");
  });

  it("renders no video section while the market has none", () => {
    const { container } = renderWahub({ ...brCopy.wahub, video: null });
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("#video")).toBeNull();
  });

  it("the Italian copy has no video", () => {
    expect(itCopy.wahub.video).toBeNull();
  });
});
