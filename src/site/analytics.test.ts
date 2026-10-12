import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __resetAnalyticsForTests, trackPageview, trackWhatsAppClick } from "./analytics";

type Track = ReturnType<typeof vi.fn>;

const installUmami = (): Track => {
  const track = vi.fn();
  window.umami = { track };
  return track;
};

beforeEach(() => {
  __resetAnalyticsForTests();
  delete window.umami;
  document.getElementById("umami-script")?.remove();
});

afterEach(() => {
  delete window.umami;
});

describe("analytics", () => {
  it("sends a whatsapp-click event with market, page and placement", () => {
    const track = installUmami();
    trackWhatsAppClick({ market: "br", page: "wahub", placement: "hero" });
    expect(track).toHaveBeenCalledWith("whatsapp-click", {
      market: "br",
      page: "wahub",
      placement: "hero",
    });
  });

  it("does not throw when umami is absent", () => {
    expect(() => trackWhatsAppClick({ market: "br", page: "home", placement: "header" })).not.toThrow();
    expect(() => trackPageview()).not.toThrow();
  });

  it("queues events made before the script loads and flushes them when it loads", () => {
    const script = document.createElement("script");
    script.id = "umami-script";
    document.head.appendChild(script);

    trackPageview();
    trackWhatsAppClick({ market: "br", page: "patricia", placement: "sticky" });

    const track = installUmami();
    expect(track).not.toHaveBeenCalled();
    script.dispatchEvent(new Event("load"));

    expect(track).toHaveBeenCalledTimes(2);
    expect(track.mock.calls[0][0]).toBeTypeOf("function");
    expect(track.mock.calls[1]).toEqual([
      "whatsapp-click",
      { market: "br", page: "patricia", placement: "sticky" },
    ]);
  });

  it("flushes the queue on the next call once umami is present", () => {
    trackWhatsAppClick({ market: "br", page: "home", placement: "hero" });
    const track = installUmami();
    trackWhatsAppClick({ market: "br", page: "home", placement: "cta" });
    expect(track.mock.calls.map((c) => c[1].placement)).toEqual(["hero", "cta"]);
  });

  it("records the pageview with the path at the time of the call", () => {
    window.history.pushState({}, "", "/br/wahub");
    trackPageview();
    window.history.pushState({}, "", "/br");
    const track = installUmami();
    trackPageview();
    const first = track.mock.calls[0][0] as (p: Record<string, unknown>) => Record<string, unknown>;
    expect(first({ website: "x" })).toMatchObject({ website: "x", url: "/br/wahub" });
  });
});
