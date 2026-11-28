// What `npm run shots` captures and what it names the files: pure, so a test can hold it.
// Hosts and paths come from the market registry; the pages are listed here and a test checks the
// list against the real route table, so a new page cannot slip past the screenshots.
import { parseArgs } from "node:util";
import { homePath, markets, productPath } from "../../src/site/markets.ts";

export const DEFAULT_PORT = 4395;
export const PAGES = ["home", "wahub"];
/** Phone and desktop widths from the PR evidence rule; both shot at deviceScaleFactor 2. */
export const DEVICES = {
  phone: { width: 390, height: 844 },
  desktop: { width: 1280, height: 900 },
};

export const marketIds = () =>
  Object.values(markets)
    .filter((m) => m.live)
    .map((m) => m.id);

/** The path of a page in a market: "/" or "/it" for the home, "/wahub" or "/it/wahub" for a product. */
export const pagePath = (market, page) => (page === "home" ? homePath(market) : productPath(market, page));

const choices = { market: marketIds(), page: PAGES, device: Object.keys(DEVICES) };

/** `--market br --page home,wahub --device phone` → the values to capture; an option left out means all. */
export const parseShotArgs = (argv) => {
  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      options: {
        market: { type: "string" },
        page: { type: "string" },
        device: { type: "string" },
        "dry-run": { type: "boolean" },
      },
      strict: true,
      allowPositionals: false,
    }));
  } catch (e) {
    throw new Error(`${e.message}. Options: --market ${choices.market.join("|")}, --page ${PAGES.join("|")}, --device ${choices.device.join("|")}`);
  }
  const selection = { dryRun: Boolean(values["dry-run"]) };
  for (const [name, allowed] of Object.entries(choices)) {
    const given = values[name]?.split(",").map((s) => s.trim());
    for (const v of given ?? []) {
      if (!allowed.includes(v)) throw new Error(`Unknown ${name} "${v}" (use ${allowed.join(", ")})`);
    }
    selection[name] = given ?? allowed;
  }
  return selection;
};

/** `br-home-phone-top.png`: market, page, device, then the part of the page it shows. */
export const shotFile = ({ market, page, device }, kind) => `${market}-${page}-${device}-${kind}.png`;

/** One entry per page load: the top of the page and the full page both come from it. */
export const shotPlan = ({ market, page, device }) =>
  market.flatMap((m) =>
    page.flatMap((p) =>
      device.map((d) => {
        const target = { market: m, page: p, device: d };
        return {
          ...target,
          host: new URL(markets[m].origin).host,
          path: pagePath(m, p),
          viewport: DEVICES[d],
          files: { top: shotFile(target, "top"), full: shotFile(target, "full") },
        };
      }),
    ),
  );
