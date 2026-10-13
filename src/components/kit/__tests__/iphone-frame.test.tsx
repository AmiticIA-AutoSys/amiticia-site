// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { renderToString } from "react-dom/server";

const { mockReducedMotion } = vi.hoisted(() => ({
  mockReducedMotion: vi.fn().mockReturnValue(false),
}));

vi.mock("motion/react", async (orig) => ({
  ...(await orig<typeof import("motion/react")>()),
  useReducedMotion: () => mockReducedMotion(),
}));

import { IPhone17ProMax } from "../cult/iphone-frame";

describe("IPhone17ProMax", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders screen children and applies height and style", () => {
    const { container } = render(
      <IPhone17ProMax
        height="500px"
        style={{ transform: "scale(0.8)" }}
      >
        <div data-testid="screen-content">App Screen</div>
      </IPhone17ProMax>
    );

    expect(screen.getByTestId("screen-content")).toBeInTheDocument();
    const phoneContainer = container.querySelector('[style*="500px"]');
    expect(phoneContainer).toBeInTheDocument();
    expect(phoneContainer?.getAttribute("style")).toContain("transform: scale(0.8)");
  });

  it("default dynamic island content is empty and has no demo music/Spotify content", () => {
    const { container } = render(
      <IPhone17ProMax dynamicIslandSize="expanded">
        <div>App</div>
      </IPhone17ProMax>
    );

    expect(container.textContent).not.toContain("Spotify");
    expect(container.textContent).not.toContain("RY X");
    expect(container.textContent).not.toContain("Let You Go");
  });

  it("markup is identical regardless of useReducedMotion value", () => {
    mockReducedMotion.mockReturnValue(false);
    const htmlNormal = renderToString(
      <IPhone17ProMax>
        <div>Content</div>
      </IPhone17ProMax>
    );

    mockReducedMotion.mockReturnValue(true);
    const htmlReduced = renderToString(
      <IPhone17ProMax>
        <div>Content</div>
      </IPhone17ProMax>
    );

    expect(htmlNormal).toBe(htmlReduced);
  });

  it("dark theme renders white status bar classes and no bg-white on the screen", () => {
    const { container } = render(
      <IPhone17ProMax screenTheme="dark">
        <div data-testid="app">App</div>
      </IPhone17ProMax>
    );

    const screenElement = container.querySelector(".rounded-\\[49px\\]");
    expect(screenElement).toBeInTheDocument();
    expect(screenElement?.className).toContain("bg-neutral-950");
    expect(screenElement?.className).not.toContain("bg-white");

    const statusBar = screenElement?.querySelector('[aria-hidden="true"]');
    expect(statusBar?.className).toContain("text-white");
    expect(statusBar?.className).not.toContain("text-black");

    const signalBar = statusBar?.querySelector(".rounded-\\[1px\\]");
    expect(signalBar?.className).toContain("bg-white");
    expect(signalBar?.className).not.toContain("bg-black");

    const wifiIcon = statusBar?.querySelector("svg");
    expect(wifiIcon?.getAttribute("class")).toContain("text-white");
    expect(wifiIcon?.getAttribute("class")).not.toContain("text-black");
  });

  it("applies screenClassName to the screen element", () => {
    const { container } = render(
      <IPhone17ProMax screenClassName="custom-screen-class">
        <div>App</div>
      </IPhone17ProMax>
    );

    const screenElement = container.querySelector(".rounded-\\[49px\\]");
    expect(screenElement).toBeInTheDocument();
    expect(screenElement?.className).toContain("custom-screen-class");
  });

  it("without callbacks the screen has no cursor-pointer class", () => {
    const { container } = render(
      <IPhone17ProMax>
        <div>App</div>
      </IPhone17ProMax>
    );

    const screenElement = container.querySelector(".rounded-\\[49px\\]");
    expect(screenElement).toBeInTheDocument();
    expect(screenElement?.className).not.toContain("cursor-pointer");
  });

  it("with onScreenTap or onDynamicIslandTap the screen has cursor-pointer class", () => {
    const onScreenTap = vi.fn();
    const { container, rerender } = render(
      <IPhone17ProMax onScreenTap={onScreenTap}>
        <div>App</div>
      </IPhone17ProMax>
    );

    let screenElement = container.querySelector(".rounded-\\[49px\\]");
    expect(screenElement?.className).toContain("cursor-pointer");

    const onIslandTap = vi.fn();
    rerender(
      <IPhone17ProMax onDynamicIslandTap={onIslandTap}>
        <div>App</div>
      </IPhone17ProMax>
    );
    screenElement = container.querySelector(".rounded-\\[49px\\]");
    expect(screenElement?.className).toContain("cursor-pointer");
  });
});
