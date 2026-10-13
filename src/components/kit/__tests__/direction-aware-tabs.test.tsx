// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";

import { DirectionAwareTabs } from "../cult/direction-aware-tabs";

describe("DirectionAwareTabs", () => {
  afterEach(() => {
    cleanup();
  });

  const tabs = [
    { id: 0, label: "Tab Alpha", content: <div>Alpha Content</div> },
    { id: 1, label: "Tab Beta", content: <div>Beta Content</div> },
    { id: 2, label: "Tab Gamma", content: <div>Gamma Content</div> },
  ];

  it("tablist and tab roles are present, aria-selected follows a click", () => {
    const handleChange = vi.fn();
    render(<DirectionAwareTabs tabs={tabs} onChange={handleChange} />);

    const tablist = screen.getByRole("tablist", { name: "Abas" });
    expect(tablist).toBeInTheDocument();

    const alphaTab = screen.getByRole("tab", { name: "Tab Alpha" });
    const betaTab = screen.getByRole("tab", { name: "Tab Beta" });
    const gammaTab = screen.getByRole("tab", { name: "Tab Gamma" });

    expect(alphaTab).toHaveAttribute("aria-selected", "true");
    expect(betaTab).toHaveAttribute("aria-selected", "false");
    expect(gammaTab).toHaveAttribute("aria-selected", "false");

    fireEvent.click(betaTab);

    expect(alphaTab).toHaveAttribute("aria-selected", "false");
    expect(betaTab).toHaveAttribute("aria-selected", "true");
    expect(gammaTab).toHaveAttribute("aria-selected", "false");
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it("keyboard navigation: ArrowRight / ArrowLeft wrap, Home / End go to edges", async () => {
    const user = userEvent.setup();
    render(<DirectionAwareTabs tabs={tabs} />);

    const alphaTab = screen.getByRole("tab", { name: "Tab Alpha" });
    const betaTab = screen.getByRole("tab", { name: "Tab Beta" });
    const gammaTab = screen.getByRole("tab", { name: "Tab Gamma" });

    // Focus first tab
    alphaTab.focus();
    expect(alphaTab).toHaveFocus();

    // ArrowRight -> Beta
    await user.keyboard("{ArrowRight}");
    expect(betaTab).toHaveFocus();
    expect(betaTab).toHaveAttribute("aria-selected", "true");

    // ArrowRight -> Gamma
    await user.keyboard("{ArrowRight}");
    expect(gammaTab).toHaveFocus();
    expect(gammaTab).toHaveAttribute("aria-selected", "true");

    // ArrowRight wrap -> Alpha
    await user.keyboard("{ArrowRight}");
    expect(alphaTab).toHaveFocus();
    expect(alphaTab).toHaveAttribute("aria-selected", "true");

    // ArrowLeft wrap -> Gamma
    await user.keyboard("{ArrowLeft}");
    expect(gammaTab).toHaveFocus();
    expect(gammaTab).toHaveAttribute("aria-selected", "true");

    // Home -> Alpha
    await user.keyboard("{Home}");
    expect(alphaTab).toHaveFocus();
    expect(alphaTab).toHaveAttribute("aria-selected", "true");

    // End -> Gamma
    await user.keyboard("{End}");
    expect(gammaTab).toHaveFocus();
    expect(gammaTab).toHaveAttribute("aria-selected", "true");
  });

  it("ariaLabel prop configures tablist label", () => {
    render(<DirectionAwareTabs tabs={tabs} ariaLabel="Navegação de abas" />);
    expect(
      screen.getByRole("tablist", { name: "Navegação de abas" })
    ).toBeInTheDocument();
  });

  it("generates unique ids per instance using useId", () => {
    const { container } = render(
      <div>
        <DirectionAwareTabs tabs={tabs} />
        <DirectionAwareTabs tabs={tabs} />
      </div>
    );

    const tablists = container.querySelectorAll('[role="tablist"]');
    expect(tablists).toHaveLength(2);

    const firstTabs = tablists[0].querySelectorAll('[role="tab"]');
    const secondTabs = tablists[1].querySelectorAll('[role="tab"]');

    expect(firstTabs[0].id).not.toBe(secondTabs[0].id);
    expect(firstTabs[0].getAttribute("aria-controls")).not.toBe(
      secondTabs[0].getAttribute("aria-controls")
    );
  });

  it("renderToString has no opacity:0, blur(, or height:0 in the first panel", () => {
    const html = renderToString(<DirectionAwareTabs tabs={tabs} />);
    expect(html).toContain("Alpha Content");
    expect(html).not.toContain("opacity:0");
    expect(html).not.toContain("blur(");
    expect(html).not.toContain("height:0");
  });
});
