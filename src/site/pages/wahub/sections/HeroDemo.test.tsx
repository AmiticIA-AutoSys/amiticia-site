import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { wahubDemoFor } from "../demo";

const { mockReducedMotion } = vi.hoisted(() => ({ mockReducedMotion: vi.fn().mockReturnValue(false) }));

vi.mock("motion/react", async (orig) => {
  const actual = await orig<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => mockReducedMotion() };
});

import { HeroDemo } from "./HeroDemo";

const { heroChat, heroLead } = wahubDemoFor("br");

const leadCard = () => screen.getByTestId("wahub-lead-card");

describe("WaHub hero demo (phone chat → lead card)", () => {
  const originalIO = window.IntersectionObserver;

  beforeEach(() => {
    mockReducedMotion.mockReturnValue(false);
    window.IntersectionObserver = vi.fn().mockImplementation((cb) => ({
      observe: vi.fn().mockImplementation(() => cb([{ isIntersecting: true }])),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })) as unknown as typeof window.IntersectionObserver;
  });

  afterEach(() => {
    vi.useRealTimers();
    window.IntersectionObserver = originalIO;
  });

  it("server HTML carries the final chat frame and the lead card", () => {
    const html = renderToString(<HeroDemo market="br" />);
    for (const m of heroChat.messages) expect(html).toContain(m.text);
    expect(html).toContain(heroLead.badge);
    expect(html).toContain(heroLead.name);
  });

  it("keeps the lead card hidden while the chat plays and shows it once the chat completes", () => {
    vi.useFakeTimers();
    render(<HeroDemo market="br" />);
    expect(leadCard()).toHaveAttribute("data-state", "hidden");
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(leadCard()).toHaveAttribute("data-state", "hidden");
    act(() => {
      vi.advanceTimersByTime(20000);
    });
    expect(leadCard()).toHaveAttribute("data-state", "shown");
  });

  it("with reduced motion shows the final frame and the lead card at once", () => {
    mockReducedMotion.mockReturnValue(true);
    render(<HeroDemo market="br" />);
    for (const m of heroChat.messages) expect(screen.getByText(m.text)).toBeInTheDocument();
    expect(leadCard()).toHaveAttribute("data-state", "shown");
  });
});
