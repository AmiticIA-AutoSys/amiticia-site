import {
  BellRing,
  Bot,
  Inbox,
  RefreshCcw,
  Smartphone,
  Sparkles,
  SquareKanban,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WahubCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { LeadIn } from "../../../layout/blocks";
import type { MarketId } from "../../../markets";
import { shotsFor, type Shots } from "../screenshots";
import { ProductTour } from "./ProductTour";

const APP_BG = "#040613";

interface Crop {
  /** Which of the market's screenshots (screenshots.ts). */
  shot: keyof Shots;
  sizes: string;
  /** Placement of the image inside the crop window (phones vary it from the tour above). */
  img: string;
  /** Size of the crop window. */
  frame: string;
}

interface Tile {
  icon: LucideIcon;
  /** Grid placement from lg (3 columns). */
  place: string;
  crop?: Crop;
  /** Slim horizontal card (the last one spans the row). */
  banner?: boolean;
  /** Wide card with the text beside the crop from lg. */
  side?: boolean;
}

/**
 * One entry per copy item, in copy order (DOM and phone order = reading order); the lg grid
 * places them: two wide screenshot cards, one tall, four small icon cards and a closing banner.
 */
const tiles: Tile[] = [
  {
    icon: Inbox,
    place: "lg:col-span-2 lg:col-start-1 lg:row-start-1",
    side: true,
    // The conversation list (owner, status, history per conversation): the tour shows the thread.
    crop: {
      shot: "list",
      sizes: "376px",
      img: "left-1/2 top-0 h-auto w-full max-w-[376px] -translate-x-1/2",
      frame: "h-[280px] w-full max-w-[376px] self-center lg:mt-0 lg:h-[300px] lg:w-[376px] lg:shrink-0 lg:self-end",
    },
  },
  {
    icon: Bot,
    place: "lg:col-start-3 lg:row-span-2 lg:row-start-1",
    crop: {
      shot: "panel",
      sizes: "(min-width: 1024px) 284px, 284px",
      img: "inset-0 h-full w-full object-cover object-[50%_0%]",
      frame: "h-[300px] lg:h-full lg:min-h-[340px]",
    },
  },
  {
    icon: SquareKanban,
    place: "lg:col-span-2 lg:col-start-1 lg:row-start-3",
    crop: {
      shot: "pipeline",
      sizes: "(min-width: 1024px) 900px, 900px",
      img: "inset-0 h-full w-full object-cover object-[60%_0%] lg:object-[0%_0%]",
      frame: "h-[300px] md:h-[260px]",
    },
  },
  { icon: BellRing, place: "lg:col-start-1 lg:row-start-2" },
  { icon: Sparkles, place: "lg:col-start-2 lg:row-start-2" },
  { icon: RefreshCcw, place: "lg:col-start-3 lg:row-start-3" },
  { icon: Smartphone, place: "lg:col-span-3 lg:row-start-4", banner: true },
];

const IconTile = ({ icon: Icon }: { icon: LucideIcon }) => (
  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-wahub/30 bg-wahub/[0.12]">
    <Icon className="h-5 w-5 text-[hsl(243_100%_82%)]" aria-hidden="true" />
  </span>
);

const CropFrame = ({ crop, shots }: { crop: Crop; shots: Shots }) => (
  <div
    className={cn("relative mt-6 overflow-hidden rounded-t-[14px] border border-b-0 border-border", crop.frame)}
    style={{ backgroundColor: APP_BG }}
  >
    <img
      src={shots[crop.shot].src}
      srcSet={shots[crop.shot].srcSet}
      sizes={crop.sizes}
      width={shots[crop.shot].width}
      height={shots[crop.shot].height}
      alt=""
      loading="lazy"
      decoding="async"
      className={cn("absolute max-w-none", crop.img)}
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent"
    />
  </div>
);

export const WahubFeatures = ({
  market,
  copy,
  alts,
}: {
  market: MarketId;
  copy: WahubCopy["features"];
  alts: WahubCopy["screenshots"];
}) => (
  <Section className="border-t border-border/60">
    <Reveal>
      <h2 className="v2-h2">{copy.title}</h2>
    </Reveal>
    <Reveal className="mt-10 md:mt-14">
      <ProductTour market={market} alts={alts} />
    </Reveal>
    <ul className="mt-10 grid gap-4 md:mt-14 md:grid-flow-dense md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {copy.items.map((item, i) => {
        const tile = tiles[i] ?? { icon: Sparkles, place: "" };
        return (
          <Reveal
            as="li"
            key={item.title}
            delay={(i % 3) * 60}
            className={cn(
              "group flex flex-col overflow-hidden rounded-[20px] border border-border bg-surface shadow-[var(--hairline)] transition-colors duration-[280ms] hover:border-wahub/45",
              tile.crop ? "px-6 pt-6 md:px-7 md:pt-7" : "p-6 md:p-7",
              tile.crop && i !== 1 && "md:col-span-2",
              tile.banner && "md:col-span-2 md:flex-row md:items-center md:gap-5",
              tile.side && "lg:flex-row lg:gap-10",
              tile.place,
            )}
          >
            <div className={cn(tile.banner && "contents", tile.side && "lg:max-w-[340px] lg:pb-7")}>
              <IconTile icon={tile.icon} />
              <p className={cn("mt-5 text-muted-foreground", tile.banner && "md:mt-0")}>
                <LeadIn {...item} />
              </p>
            </div>
            {tile.crop && <CropFrame crop={tile.crop} shots={shotsFor(market)} />}
          </Reveal>
        );
      })}
    </ul>
  </Section>
);
