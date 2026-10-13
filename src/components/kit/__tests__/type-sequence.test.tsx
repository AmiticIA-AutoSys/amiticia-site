// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderToString } from "react-dom/server";
import { render, cleanup } from "@testing-library/react";

vi.mock("motion/react", async (orig) => ({
  ...(await orig<typeof import("motion/react")>()),
  useReducedMotion: () => true,
}));

import { TypeSequence } from "../originkit/type-sequence";

describe("TypeSequence with reduced motion", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renderToString contains words[0]", () => {
    const html = renderToString(
      <TypeSequence words={["FirstWord", "SecondWord"]} />
    );
    expect(html).toContain("FirstWord");
  });

  it("with reduced motion, after 5 s of fake timers the visible text is still words[0]", () => {
    const { container } = render(
      <TypeSequence words={["InitialWord", "AlternativeWord"]} />
    );

    const visibleSpan = container.querySelector('[data-slot="visible-text"]');
    // Initial visible text is words[0]
    expect(visibleSpan).toHaveTextContent("InitialWord");

    // Advance by 5000ms
    vi.advanceTimersByTime(5000);

    // Visible text is still words[0] and has not switched to AlternativeWord
    expect(visibleSpan).toHaveTextContent("InitialWord");
    expect(visibleSpan).not.toHaveTextContent("AlternativeWord");
  });
});
