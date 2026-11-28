import { describe, expect, it } from "vitest";
import { parseShotArgs, shotFile, shotPlan } from "../../scripts/shots/plan.mjs";
import { siteRoutes } from "./routes";

const all = parseShotArgs([]);

describe("npm run shots: arguments", () => {
  it("captures every market, page and device when nothing narrows it", () => {
    expect(all).toEqual({ market: ["br", "it"], page: ["home", "wahub"], device: ["phone", "desktop"], dryRun: false });
  });

  it("narrows by market, page and device, comma-separated", () => {
    expect(parseShotArgs(["--market", "br", "--page", "home"])).toMatchObject({ market: ["br"], page: ["home"], device: ["phone", "desktop"] });
    expect(parseShotArgs(["--page=home,wahub", "--device=phone"])).toMatchObject({ page: ["home", "wahub"], device: ["phone"] });
  });

  it("fails on a value or an option it does not know, naming the choices", () => {
    expect(() => parseShotArgs(["--market", "en"])).toThrow(/Unknown market "en" \(use br, it\)/);
    expect(() => parseShotArgs(["--page", "patricia"])).toThrow(/Unknown page "patricia"/);
    expect(() => parseShotArgs(["--viewport", "phone"])).toThrow(/Options: --market/);
    expect(() => parseShotArgs(["home"])).toThrow(/Options: --market/);
  });
});

describe("npm run shots: plan", () => {
  const plan = shotPlan(all);

  it("loads each page once per market and device, giving a top and a full-page image", () => {
    expect(plan).toHaveLength(8);
    expect(shotPlan(parseShotArgs(["--market", "br", "--page", "home"])).map((t) => t.files)).toEqual([
      { top: "br-home-phone-top.png", full: "br-home-phone-full.png" },
      { top: "br-home-desktop-top.png", full: "br-home-desktop-full.png" },
    ]);
  });

  it("names every image after its market, page, device and part, with no repeats", () => {
    const files = plan.flatMap((t) => Object.values(t.files));
    expect(new Set(files).size).toBe(files.length);
    expect(shotFile({ market: "it", page: "wahub", device: "desktop" }, "full")).toBe("it-wahub-desktop-full.png");
  });

  it("opens Brazil on amiticia.com.br without a prefix and Italy on amiticia.cc/it", () => {
    const where = (market: string, page: string) => plan.find((t) => t.market === market && t.page === page && t.device === "phone");
    expect([where("br", "home").host, where("br", "home").path]).toEqual(["amiticia.com.br", "/"]);
    expect([where("br", "wahub").host, where("br", "wahub").path]).toEqual(["amiticia.com.br", "/wahub"]);
    expect([where("it", "home").host, where("it", "home").path]).toEqual(["amiticia.cc", "/it"]);
    expect([where("it", "wahub").host, where("it", "wahub").path]).toEqual(["amiticia.cc", "/it/wahub"]);
  });

  it("uses a 390×844 phone and a 1280×900 desktop", () => {
    expect(plan.find((t) => t.device === "phone").viewport).toEqual({ width: 390, height: 844 });
    expect(plan.find((t) => t.device === "desktop").viewport).toEqual({ width: 1280, height: 900 });
  });

  it("covers exactly the pages the site serves, so a new page cannot miss its screenshots", () => {
    const served = siteRoutes.filter((r) => r.page !== "unavailable").map((r) => `${r.market} ${r.path}`);
    const shot = plan.filter((t) => t.device === "phone").map((t) => `${t.market} ${t.path}`);
    expect(shot.sort()).toEqual(served.sort());
  });
});
