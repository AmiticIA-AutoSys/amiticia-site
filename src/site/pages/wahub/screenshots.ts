import inbox640 from "../../assets/wahub/inbox-640.webp";
import inbox1024 from "../../assets/wahub/inbox-1024.webp";
import inbox1600 from "../../assets/wahub/inbox-1600.webp";
import pipeline640 from "../../assets/wahub/pipeline-640.webp";
import pipeline1024 from "../../assets/wahub/pipeline-1024.webp";
import pipeline1600 from "../../assets/wahub/pipeline-1600.webp";
import leads640 from "../../assets/wahub/leads-640.webp";
import leads1024 from "../../assets/wahub/leads-1024.webp";
import leads1600 from "../../assets/wahub/leads-1600.webp";
import thread470 from "../../assets/wahub/thread-470.webp";
import thread940 from "../../assets/wahub/thread-940.webp";
import panel284 from "../../assets/wahub/panel-284.webp";
import panel568 from "../../assets/wahub/panel-568.webp";
import list376 from "../../assets/wahub/list-376.webp";
import list752 from "../../assets/wahub/list-752.webp";
import itInbox640 from "../../assets/wahub/it/inbox-640.webp";
import itInbox1024 from "../../assets/wahub/it/inbox-1024.webp";
import itInbox1600 from "../../assets/wahub/it/inbox-1600.webp";
import itPipeline640 from "../../assets/wahub/it/pipeline-640.webp";
import itPipeline1024 from "../../assets/wahub/it/pipeline-1024.webp";
import itPipeline1600 from "../../assets/wahub/it/pipeline-1600.webp";
import itLeads640 from "../../assets/wahub/it/leads-640.webp";
import itLeads1024 from "../../assets/wahub/it/leads-1024.webp";
import itLeads1600 from "../../assets/wahub/it/leads-1600.webp";
import itThread470 from "../../assets/wahub/it/thread-470.webp";
import itThread940 from "../../assets/wahub/it/thread-940.webp";
import itPanel284 from "../../assets/wahub/it/panel-284.webp";
import itPanel568 from "../../assets/wahub/it/panel-568.webp";
import itList376 from "../../assets/wahub/it/list-376.webp";
import itList752 from "../../assets/wahub/it/list-752.webp";
import { forMarket, type MarketId } from "../../markets";

export interface Shot {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

/** `src` is the middle size for the full screens, the 1x size for the two-size crops. */
const shot = (sources: Array<[string, number]>, ratio: number): Shot => ({
  src: sources[Math.min(1, sources.length - 2)][0],
  srcSet: sources.map(([s, w]) => `${s} ${w}w`).join(", "),
  width: sources[1][1],
  height: Math.round(sources[Math.min(1, sources.length - 2)][1] * ratio),
});

/** Real WaHub screenshots, demo tenant with fictitious data (DESIGN.md "Imagery"). */
const brShots = {
  inbox: shot(
    [
      [inbox640, 640],
      [inbox1024, 1024],
      [inbox1600, 1600],
    ],
    778 / 1024,
  ),
  pipeline: shot(
    [
      [pipeline640, 640],
      [pipeline1024, 1024],
      [pipeline1600, 1600],
    ],
    432 / 1024,
  ),
  leads: shot(
    [
      [leads640, 640],
      [leads1024, 1024],
      [leads1600, 1600],
    ],
    259 / 1024,
  ),
  /** Crops (1x / 2x): the open conversation, the lead panel, the conversation list. */
  thread: shot(
    [
      [thread470, 470],
      [thread940, 940],
    ],
    712 / 470,
  ),
  panel: shot(
    [
      [panel284, 284],
      [panel568, 568],
    ],
    712 / 284,
  ),
  list: shot(
    [
      [list376, 376],
      [list752, 752],
    ],
    712 / 376,
  ),
};

/** The same screens from the Italian demo tenant (Ottica Lumen). */
const itShots: typeof brShots = {
  inbox: shot(
    [
      [itInbox640, 640],
      [itInbox1024, 1024],
      [itInbox1600, 1600],
    ],
    778 / 1024,
  ),
  pipeline: shot(
    [
      [itPipeline640, 640],
      [itPipeline1024, 1024],
      [itPipeline1600, 1600],
    ],
    432 / 1024,
  ),
  leads: shot(
    [
      [itLeads640, 640],
      [itLeads1024, 1024],
      [itLeads1600, 1600],
    ],
    259 / 1024,
  ),
  /** Crops (1x / 2x): the open conversation, the lead panel, the conversation list. */
  thread: shot(
    [
      [itThread470, 470],
      [itThread940, 940],
    ],
    712 / 470,
  ),
  panel: shot(
    [
      [itPanel284, 284],
      [itPanel568, 568],
    ],
    712 / 284,
  ),
  list: shot(
    [
      [itList376, 376],
      [itList752, 752],
    ],
    712 / 376,
  ),
};

export type Shots = typeof brShots;

/** Real WaHub screenshots of the market's demo tenant (fictitious data, DESIGN.md "Imagery"). */
export const shotsFor = (market: MarketId): Shots => forMarket({ br: brShots, it: itShots }, market, "WaHub screenshots");
