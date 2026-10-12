import inbox640 from "../../assets/wahub/inbox-640.webp";
import inbox1024 from "../../assets/wahub/inbox-1024.webp";
import inbox1600 from "../../assets/wahub/inbox-1600.webp";
import pipeline640 from "../../assets/wahub/pipeline-640.webp";
import pipeline1024 from "../../assets/wahub/pipeline-1024.webp";
import pipeline1600 from "../../assets/wahub/pipeline-1600.webp";
import leads640 from "../../assets/wahub/leads-640.webp";
import leads1024 from "../../assets/wahub/leads-1024.webp";
import leads1600 from "../../assets/wahub/leads-1600.webp";

export interface Shot {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

const shot = (sources: Array<[string, number]>, ratio: number): Shot => ({
  src: sources[1][0],
  srcSet: sources.map(([s, w]) => `${s} ${w}w`).join(", "),
  width: sources[1][1],
  height: Math.round(sources[1][1] * ratio),
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
};
