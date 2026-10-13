// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

const { mockReducedMotion } = vi.hoisted(() => ({
  mockReducedMotion: vi.fn().mockReturnValue(false),
}));

vi.mock("motion/react", async (orig) => {
  const actual = await orig<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => mockReducedMotion(),
  };
});

import { TextureOverlay } from "../cult/texture-overlay";
import { SquigglyArrow } from "../cult/squiggle-arrow";
import { BrowserWindow } from "../cult/mock-browser-window";
import { DirectionAwareTabs } from "../cult/direction-aware-tabs";
import { IPhone17ProMax } from "../cult/iphone-frame";
import { HaloBadge } from "../cult/halo-badge";
import {
  Link000,
  Link001,
  Link002,
  Link003,
  Link004,
  Link005,
} from "../skiper/animated-links";
import { ProgressiveBlur } from "../skiper/progressive-blur";
import { GlowBorder } from "../originkit/glow-border";
import { LiveChat } from "../originkit/live-chat";
import { TypeSequence } from "../originkit/type-sequence";

describe("SSR renderToString", () => {
  const getComponents = () => [
    { name: "TextureOverlay", el: <TextureOverlay texture="dots" /> },
    { name: "SquigglyArrow", el: <SquigglyArrow /> },
    { name: "BrowserWindow", el: <BrowserWindow><div>content</div></BrowserWindow> },
    {
      name: "DirectionAwareTabs",
      el: (
        <DirectionAwareTabs
          tabs={[{ id: 0, label: "Tab 1", content: <div>Panel 1</div> }]}
        />
      ),
    },
    { name: "IPhone17ProMax", el: <IPhone17ProMax><div>screen</div></IPhone17ProMax> },
    { name: "HaloBadge", el: <HaloBadge>Badge</HaloBadge> },
    {
      name: "Link000",
      el: (
        <MemoryRouter>
          <Link000 href="/test">Link000</Link000>
        </MemoryRouter>
      ),
    },
    {
      name: "Link001",
      el: (
        <MemoryRouter>
          <Link001 href="/test">Link001</Link001>
        </MemoryRouter>
      ),
    },
    {
      name: "Link002",
      el: (
        <MemoryRouter>
          <Link002 href="/test">Link002</Link002>
        </MemoryRouter>
      ),
    },
    {
      name: "Link003",
      el: (
        <MemoryRouter>
          <Link003 href="/test">Link003</Link003>
        </MemoryRouter>
      ),
    },
    {
      name: "Link004",
      el: (
        <MemoryRouter>
          <Link004 href="/test">Link004</Link004>
        </MemoryRouter>
      ),
    },
    {
      name: "Link005",
      el: (
        <MemoryRouter>
          <Link005 href="/test">Link005</Link005>
        </MemoryRouter>
      ),
    },
    { name: "ProgressiveBlur", el: <ProgressiveBlur /> },
    { name: "GlowBorder", el: <GlowBorder><div>card</div></GlowBorder> },
    {
      name: "LiveChat",
      el: <LiveChat messages={[{ text: "Hello", sender: "me" }]} />,
    },
    { name: "TypeSequence", el: <TypeSequence words={["Hello", "World"]} /> },
  ];

  getComponents().forEach(({ name, el }) => {
    it(`renders ${name} without throwing and without next/ or undefined classes`, () => {
      mockReducedMotion.mockReturnValue(false);
      let html = "";
      expect(() => {
        html = renderToString(el);
      }).not.toThrow();

      expect(html).not.toContain("next/");
      expect(html).not.toMatch(/class="[^"]*\bundefined\b[^"]*"/);
    });

    it(`renders ${name} with identical markup regardless of useReducedMotion value`, () => {
      mockReducedMotion.mockReturnValue(false);
      const htmlNormal = renderToString(el);

      mockReducedMotion.mockReturnValue(true);
      const htmlReduced = renderToString(el);

      expect(htmlNormal).toBe(htmlReduced);
    });
  });

  it("DirectionAwareTabs SSR has no opacity:0, no blur(, and no height:0 in the first panel", () => {
    mockReducedMotion.mockReturnValue(false);
    const html = renderToString(
      <DirectionAwareTabs
        tabs={[{ id: 0, label: "Tab 1", content: <div>Panel Content</div> }]}
      />
    );
    expect(html).toContain("Panel Content");
    expect(html).not.toContain("opacity:0");
    expect(html).not.toContain("blur(");
    expect(html).not.toContain("height:0");
  });

  it("LiveChat SSR markup has data-phase=\"ssr\" and renders every message text", () => {
    mockReducedMotion.mockReturnValue(false);
    const html = renderToString(
      <LiveChat
        messages={[
          { text: "Msg 1", sender: "me" },
          { text: "Msg 2", sender: "them" },
        ]}
      />
    );
    expect(html).toContain('data-phase="ssr"');
    expect(html).toContain("Msg 1");
    expect(html).toContain("Msg 2");
  });
});
