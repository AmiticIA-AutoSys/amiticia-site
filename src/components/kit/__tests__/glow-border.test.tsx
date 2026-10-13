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

import { GlowBorder } from "../originkit/glow-border";

describe("GlowBorder", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders its children", () => {
    render(
      <GlowBorder>
        <span data-testid="child">Glowing Card Content</span>
      </GlowBorder>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Glowing Card Content")).toBeInTheDocument();
  });

  it("outer element has data-glow-border and does not have overflow-hidden", () => {
    const { container } = render(
      <GlowBorder>
        <span>Content</span>
      </GlowBorder>
    );

    const outer = container.querySelector("[data-glow-border]");
    expect(outer).toBeInTheDocument();
    expect(outer?.className).not.toContain("overflow-hidden");
  });

  it("glow layer is present when glow > 0 and absent when glow = 0", () => {
    const { container: cWithGlow } = render(
      <GlowBorder glow={0.5}>
        <span>With Glow</span>
      </GlowBorder>
    );
    expect(cWithGlow.querySelector('[data-glow-blur="true"]')).toBeInTheDocument();

    const { container: cNoGlow } = render(
      <GlowBorder glow={0}>
        <span>No Glow</span>
      </GlowBorder>
    );
    expect(cNoGlow.querySelector('[data-glow-blur="true"]')).not.toBeInTheDocument();
  });

  it("contains @property --kit-glow-angle and reduced-motion CSS in style", () => {
    const { container } = render(
      <GlowBorder>
        <span>Content</span>
      </GlowBorder>
    );

    const styleEl = container.querySelector("style");
    expect(styleEl).toBeInTheDocument();
    expect(styleEl?.textContent).toContain("@property --kit-glow-angle");
    expect(styleEl?.textContent).toContain("kit-glow-spin");
    expect(styleEl?.textContent).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("markup is identical regardless of useReducedMotion value", () => {
    mockReducedMotion.mockReturnValue(false);
    const htmlNormal = renderToString(
      <GlowBorder glow={0.35}>
        <span>Card</span>
      </GlowBorder>
    );

    mockReducedMotion.mockReturnValue(true);
    const htmlReduced = renderToString(
      <GlowBorder glow={0.35}>
        <span>Card</span>
      </GlowBorder>
    );

    expect(htmlNormal).toBe(htmlReduced);
  });
});
