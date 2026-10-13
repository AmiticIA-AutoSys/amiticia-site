import { useMemo } from "react";
import { BrowserWindow } from "@/components/kit/cult/mock-browser-window";
import { DirectionAwareTabs, type Tab } from "@/components/kit/cult/direction-aware-tabs";
import type { WahubCopy } from "../../../copy/types";
import { shotsFor, type Shot } from "../screenshots";
import type { MarketId } from "../../../markets";
import { wahubDemoFor } from "../demo";

/** The app's own background colour, so a short screen continues seamlessly inside the frame. */
const APP_BG = "#040613";

interface TourScreen {
  /** Full screen at sm and up. */
  wide: Shot;
  /** Legible crop for phones (< 640 px). */
  narrow: Shot;
  /** Rendered width of the phone crop, for `sizes`. */
  narrowSizes: string;
  /** How the wide screen sits in the 16:10 frame: inbox fills it, short screens hang from the top. */
  wideFit: string;
  alt: string;
}

const TourImage = ({ wide, narrow, narrowSizes, wideFit, alt }: TourScreen) => (
  <div
    className="relative aspect-[4/5] w-full overflow-hidden rounded-[12px] sm:aspect-[16/10]"
    style={{ backgroundColor: APP_BG }}
  >
    <picture>
      <source
        media="(max-width: 639px)"
        srcSet={narrow.srcSet}
        sizes={narrowSizes}
        width={narrow.width}
        height={narrow.height}
      />
      <img
        src={wide.src}
        srcSet={wide.srcSet}
        sizes="(min-width: 1264px) 1100px, calc(100vw - 72px)"
        width={wide.width}
        height={wide.height}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover object-left-top ${wideFit}`}
      />
    </picture>
  </div>
);

/**
 * Product tour at the top of "O que tem dentro": a browser window with the real screens behind
 * "Conversas / Funil / Leads". Each viewport downloads one image per tab, lazily.
 */
export const ProductTour = ({ market, alts }: { market: MarketId; alts: WahubCopy["screenshots"] }) => {
  const shots = shotsFor(market);
  const { tourTabs } = wahubDemoFor(market);
  const tabs = useMemo<Tab[]>(
    () => [
      {
        id: 0,
        label: tourTabs.inbox,
        content: (
          <TourImage wide={shots.inbox} narrow={shots.thread} narrowSizes="calc(100vw - 52px)" wideFit="" alt={alts.inbox} />
        ),
      },
      {
        id: 1,
        label: tourTabs.pipeline,
        content: (
          // Phones: the funnel's first columns at a legible scale (cover crops to the left).
          <TourImage
            wide={shots.pipeline}
            narrow={shots.pipeline}
            narrowSizes="900px"
            wideFit="sm:h-auto sm:[mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
            alt={alts.pipeline}
          />
        ),
      },
      {
        id: 2,
        label: tourTabs.leads,
        content: (
          <TourImage
            wide={shots.leads}
            narrow={shots.list}
            narrowSizes="calc(100vw - 52px)"
            wideFit="sm:h-auto"
            alt={alts.leads}
          />
        ),
      },
    ],
    [alts, shots, tourTabs],
  );

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] top-[12%] h-[80%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--wahub) / 0.22), hsl(var(--wahub-2) / 0.08) 60%, transparent)" }}
      />
      <BrowserWindow
        variant="chrome"
        url={tourTabs.url}
        className="relative h-auto max-w-none rounded-[20px] bg-surface shadow-[var(--hairline),0_40px_100px_-40px_hsl(var(--wahub)/0.55)]"
      >
        <DirectionAwareTabs
          tabs={tabs}
          ariaLabel={tourTabs.label}
          className="mt-3 sm:mt-4"
        />
        <div className="h-1.5 sm:h-2" />
      </BrowserWindow>
    </div>
  );
};
