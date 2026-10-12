import { cn } from "@/lib/utils";
import type { Shot } from "../screenshots";

interface ScreenshotProps {
  shot: Shot;
  alt: string;
  sizes: string;
  /** Above the fold: load eagerly. */
  eager?: boolean;
  className?: string;
}

// VISUAL: Cult mock-browser-window frames these screenshots (kit).
export const Screenshot = ({ shot, alt, sizes, eager, className }: ScreenshotProps) => (
  <figure
    className={cn(
      "overflow-hidden rounded-[20px] border border-border bg-surface-raised p-1.5 shadow-[0_30px_80px_-30px_hsl(var(--wahub)/0.45)] md:p-2",
      className,
    )}
  >
    <img
      src={shot.src}
      srcSet={shot.srcSet}
      sizes={sizes}
      width={shot.width}
      height={shot.height}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="block h-auto w-full rounded-[14px]"
    />
  </figure>
);
