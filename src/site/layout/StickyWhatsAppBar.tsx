import { useSitePage } from "./page-context";
import { WhatsAppButton } from "./WhatsAppButton";

/**
 * Mobile only (< md): a full-width WhatsApp button pinned to the bottom, safe-area aware.
 * SiteLayout reserves its height at the end of the page so it never covers content.
 */
export const StickyWhatsAppBar = () => {
  const { stickyCta } = useSitePage();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/85 px-4 pb-[calc(12px+env(safe-area-inset-bottom,0px))] pt-3 backdrop-blur-xl md:hidden">
      <WhatsAppButton placement="sticky" variant="bar">
        {stickyCta}
      </WhatsAppButton>
    </div>
  );
};
