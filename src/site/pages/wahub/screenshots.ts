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
export const shots = {
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
