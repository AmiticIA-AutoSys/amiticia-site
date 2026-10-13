// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";
import { render, screen, cleanup, act } from "@testing-library/react";

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

import { LiveChat, type ChatMessage } from "../originkit/live-chat";

describe("LiveChat", () => {
  const originalIntersectionObserver = window.IntersectionObserver;

  beforeEach(() => {
    mockReducedMotion.mockReturnValue(false);
    window.IntersectionObserver = vi.fn().mockImplementation((cb) => {
      return {
        observe: vi.fn().mockImplementation(() => {
          // Immediately simulate intersecting in tests
          cb([{ isIntersecting: true }]);
        }),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    }) as unknown as typeof window.IntersectionObserver;
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    window.IntersectionObserver = originalIntersectionObserver;
  });

  const messages: ChatMessage[] = [
    { text: "First message from them", sender: "them" },
    { text: "Second message from me", sender: "me" },
    { text: "Third message from them", sender: "them" },
  ];

  it("renderToString output contains every message text (final frame) and data-phase=\"ssr\"", () => {
    mockReducedMotion.mockReturnValue(false);
    const html = renderToString(<LiveChat messages={messages} />);
    messages.forEach((msg) => {
      expect(html).toContain(msg.text);
    });
    expect(html).toContain('data-phase="ssr"');
    expect(html).toContain("kit-live-chat-fallback");
  });

  it("with reduced motion, a client render shows every message, data-phase=\"final\", and no typing indicator", () => {
    mockReducedMotion.mockReturnValue(true);
    const { container } = render(<LiveChat messages={messages} />);

    messages.forEach((msg) => {
      expect(screen.getByText(msg.text)).toBeInTheDocument();
    });

    const root = container.querySelector("[data-live-chat]");
    expect(root).toHaveAttribute("data-phase", "final");
    expect(container.querySelector('[role="status"]')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/typing/i)).not.toBeInTheDocument();
  });

  it("play={false} shows every message and sets data-phase=\"final\"", () => {
    mockReducedMotion.mockReturnValue(false);
    const { container } = render(<LiveChat messages={messages} play={false} />);

    messages.forEach((msg) => {
      expect(screen.getByText(msg.text)).toBeInTheDocument();
    });
    const root = container.querySelector("[data-live-chat]");
    expect(root).toHaveAttribute("data-phase", "final");
  });

  it("after mount with play=true and intersecting observer, phase becomes \"live\"", () => {
    vi.useFakeTimers();
    const { container } = render(<LiveChat messages={messages} play={true} />);
    const root = container.querySelector("[data-live-chat]");
    expect(root).toHaveAttribute("data-phase", "live");
  });

  it("after playback completes, re-rendering with new inline onComplete and new-but-equal messages does NOT restart playback, onComplete fired once", async () => {
    vi.useFakeTimers();
    const onComplete1 = vi.fn();
    const { rerender } = render(
      <LiveChat
        messages={[{ text: "Hi", sender: "me" }]}
        staggerSeconds={0.1}
        onComplete={onComplete1}
      />
    );

    // Fast-forward through playback
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onComplete1).toHaveBeenCalledTimes(1);

    // Re-render with new inline function and equal messages array
    const onComplete2 = vi.fn();
    rerender(
      <LiveChat
        messages={[{ text: "Hi", sender: "me" }]}
        staggerSeconds={0.1}
        onComplete={onComplete2}
      />
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    // Should NOT have restarted playback
    expect(onComplete1).toHaveBeenCalledTimes(1);
    expect(onComplete2).not.toHaveBeenCalled();
  });

  it("typing indicator has aria-hidden=\"true\", no role=\"status\", no English aria-label, and dots use motion-safe:animate-bounce", () => {
    vi.useFakeTimers();
    const { container } = render(
      <LiveChat
        messages={[{ text: "Hello", sender: "them" }]}
        showTyping={true}
        staggerSeconds={2}
      />
    );

    const typingContainer = container.querySelector('[aria-hidden="true"] .motion-safe\\:animate-bounce');
    expect(typingContainer).toBeInTheDocument();
    expect(container.querySelector('[role="status"]')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/typing/i)).not.toBeInTheDocument();
  });

  it("renders header and footer when provided", () => {
    render(
      <LiveChat
        messages={messages}
        play={false}
        header={<div data-testid="chat-header">Contact Bar</div>}
        footer={<div data-testid="chat-footer">Input Bar</div>}
      />
    );

    expect(screen.getByTestId("chat-header")).toBeInTheDocument();
    expect(screen.getByTestId("chat-footer")).toBeInTheDocument();
  });
});
