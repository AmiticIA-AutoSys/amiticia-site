import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSitePage } from "./page-context";
import { WhatsAppButton } from "./WhatsAppButton";

/** In-page WhatsApp buttons that make the sticky bar redundant while fully on screen. */
const PAGE_CTAS = 'a[data-placement="hero"], a[data-placement="cta"]';

/**
 * Mobile only (< md): a full-width WhatsApp button pinned to the bottom, safe-area aware.
 * SiteLayout reserves its height at the end of the page so it never covers content.
 * It steps aside while the hero or closing button is fully visible, so the two never stack;
 * without JS (or IntersectionObserver) it simply stays.
 */
export const StickyWhatsAppBar = () => {
  const { stickyCta, page } = useSitePage();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = Array.from(document.querySelectorAll(PAGE_CTAS));
    if (targets.length === 0) return;
    const onScreen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.99) onScreen.add(e.target);
          else onScreen.delete(e.target);
        }
        setHidden(onScreen.size > 0);
      },
      { threshold: [0, 0.99, 1] },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [page]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/85 px-4 pb-[calc(12px+env(safe-area-inset-bottom,0px))] pt-3 backdrop-blur-xl md:hidden",
        "transition-[transform,opacity,visibility] duration-[280ms] ease-[cubic-bezier(.22,1,.36,1)]",
        hidden && "invisible translate-y-full opacity-0",
      )}
    >
      <WhatsAppButton placement="sticky" variant="bar">
        {stickyCta}
      </WhatsAppButton>
    </div>
  );
};
