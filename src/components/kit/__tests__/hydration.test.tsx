// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { act } from "@testing-library/react";

import { GlowBorder } from "../originkit/glow-border";
import { LiveChat } from "../originkit/live-chat";

// Prerendered pages hydrate the server HTML. A <style> is raw text in HTML, so its CSS must be
// written unescaped, and the client must find exactly the markup the server wrote.
const cases: Array<[string, () => React.ReactElement]> = [
  ["GlowBorder", () => <GlowBorder><p>Fale conosco</p></GlowBorder>],
  [
    "LiveChat",
    () => (
      <LiveChat
        messages={[
          { sender: "them", text: "Oi, tudo bem?", time: "10:00" },
          { sender: "me", text: "Tudo! Como posso ajudar?", time: "10:01" },
        ]}
      />
    ),
  ],
];

beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({
    matches: false, media: query, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  window.IntersectionObserver ??= class {
    observe() {} unobserve() {} disconnect() {} takeRecords() { return []; }
  } as unknown as typeof window.IntersectionObserver;
});

describe.each(cases)("%s", (_name, make) => {
  it("writes its inline CSS unescaped", () => {
    const html = renderToString(make());
    const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
    expect(css.length).toBeGreaterThan(0);
    expect(css).not.toMatch(/&(quot|#x27|#39|lt|gt|amp);/);
  });

  it("hydrates its server HTML without a mismatch", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(make());
    document.body.appendChild(container);
    const recoverable: unknown[] = [];
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    await act(async () => {
      hydrateRoot(container, make(), { onRecoverableError: (e) => recoverable.push(e) });
    });
    const mismatches = consoleError.mock.calls.filter((args) => /hydrat|did not match|server/i.test(String(args[0])));
    consoleError.mockRestore();
    container.remove();
    expect(recoverable).toEqual([]);
    expect(mismatches).toEqual([]);
  });
});
