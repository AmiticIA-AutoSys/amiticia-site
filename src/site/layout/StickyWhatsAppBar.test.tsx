import { routerFuture } from "../router-future";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SitePageProvider } from "./page-context";
import { StickyWhatsAppBar } from "./StickyWhatsAppBar";

/** A fake IntersectionObserver: the test decides what is on screen. */
class FakeIO {
  static last: FakeIO;
  targets = new Set<Element>();
  constructor(readonly cb: IntersectionObserverCallback) {
    FakeIO.last = this;
  }
  observe(t: Element) {
    this.targets.add(t);
  }
  unobserve() {}
  disconnect() {
    this.targets.clear();
  }
  show(t: Element, ratio: number) {
    this.cb([{ target: t, intersectionRatio: ratio } as IntersectionObserverEntry], this as never);
  }
}

const renderBar = () =>
  render(
    <MemoryRouter initialEntries={["/wahub"]} future={routerFuture}>
      <SitePageProvider market="br" page="wahub">
        <StickyWhatsAppBar />
      </SitePageProvider>
    </MemoryRouter>,
  );

const bar = (container: HTMLElement) => container.firstElementChild as HTMLElement;

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("StickyWhatsAppBar", () => {
  it("steps aside for a page button that appears after load, like the video's end card", async () => {
    vi.stubGlobal("IntersectionObserver", FakeIO);
    const { container } = renderBar();
    expect(bar(container)).not.toHaveClass("invisible");

    const late = document.createElement("a");
    late.dataset.placement = "video";
    await act(async () => {
      document.body.append(late);
      await Promise.resolve(); // let the MutationObserver deliver
    });
    expect(FakeIO.last.targets.has(late)).toBe(true);

    act(() => FakeIO.last.show(late, 1));
    expect(bar(container)).toHaveClass("invisible");

    await act(async () => {
      late.remove();
      await Promise.resolve();
    });
    expect(bar(container)).not.toHaveClass("invisible");
  });
});
