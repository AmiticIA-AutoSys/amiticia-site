import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { brCopy } from "../../../copy/br";
import { wahubDemoFor } from "../demo";
import { ProductTour } from "./ProductTour";

const { tourTabs } = wahubDemoFor("br");

const alts = brCopy.wahub.screenshots;

const panelOf = (tab: HTMLElement) => {
  const id = tab.getAttribute("aria-controls");
  const panel = id ? document.getElementById(id) : null;
  if (!panel) throw new Error(`no tabpanel for ${tab.textContent}`);
  return panel;
};

describe("WaHub product tour", () => {
  it("opens on Conversas with the inbox screenshot", () => {
    render(<ProductTour market="br" alts={alts} />);
    const tab = screen.getByRole("tab", { name: tourTabs.inbox });
    expect(tab).toHaveAttribute("aria-selected", "true");
    const img = within(panelOf(tab)).getByAltText(alts.inbox);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("width");
    expect(img).toHaveAttribute("height");
    expect(img.getAttribute("srcset")).toMatch(/640w.*1024w.*1600w/);
  });

  it("switches the visible screenshot with the tabs and keeps aria-selected right", () => {
    render(<ProductTour market="br" alts={alts} />);
    const inbox = screen.getByRole("tab", { name: tourTabs.inbox });
    const pipeline = screen.getByRole("tab", { name: tourTabs.pipeline });
    const leads = screen.getByRole("tab", { name: tourTabs.leads });

    fireEvent.click(pipeline);
    expect(pipeline).toHaveAttribute("aria-selected", "true");
    expect(inbox).toHaveAttribute("aria-selected", "false");
    expect(within(panelOf(pipeline)).getByAltText(alts.pipeline)).toBeInTheDocument();

    fireEvent.click(leads);
    expect(leads).toHaveAttribute("aria-selected", "true");
    expect(pipeline).toHaveAttribute("aria-selected", "false");
    expect(within(panelOf(leads)).getByAltText(alts.leads)).toBeInTheDocument();
  });

  it("serves a legible crop below 640 px through <picture> sources", () => {
    render(<ProductTour market="br" alts={alts} />);
    const tab = screen.getByRole("tab", { name: tourTabs.inbox });
    const source = panelOf(tab).querySelector("picture > source");
    expect(source).toHaveAttribute("media", "(max-width: 639px)");
    expect(source?.getAttribute("srcset")).toMatch(/thread-470.*470w.*thread-940.*940w/);
  });
});
