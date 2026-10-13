// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import {
  Link000,
  Link001,
  Link002,
  Link003,
  Link004,
  Link005,
} from "../skiper/animated-links";

describe("animated-links", () => {
  afterEach(() => {
    cleanup();
  });
  const links = [
    { name: "Link000", Component: Link000 },
    { name: "Link001", Component: Link001 },
    { name: "Link002", Component: Link002 },
    { name: "Link003", Component: Link003 },
    { name: "Link004", Component: Link004 },
    { name: "Link005", Component: Link005 },
  ];

  links.forEach(({ name, Component }) => {
    describe(name, () => {
      it("renders an <a href=\"/br/wahub\"> through the router and renders children", () => {
        render(
          <MemoryRouter>
            <Component href="/br/wahub">Test Child</Component>
          </MemoryRouter>
        );

        const linkEl = screen.getByRole("link", { name: /test child/i });
        expect(linkEl).toBeInTheDocument();
        expect(linkEl).toHaveAttribute("href", "/br/wahub");
      });

      it("renders a plain <a> with external href and renders children", () => {
        render(<Component href="https://wa.me/1">External WA</Component>);

        const linkEl = screen.getByRole("link", { name: /external wa/i });
        expect(linkEl).toBeInTheDocument();
        expect(linkEl).toHaveAttribute("href", "https://wa.me/1");
      });
    });
  });
});
