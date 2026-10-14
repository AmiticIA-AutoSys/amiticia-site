import { routerFuture } from "../../router-future";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { brCopy } from "../../copy/br";
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
