import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { trackWhatsAppClick, type WhatsAppPlacement } from "../analytics";
import { useSitePage } from "./page-context";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

type Variant = "pill" | "icon" | "bar";

interface WhatsAppButtonProps {
  placement: WhatsAppPlacement;
  variant?: Variant;
  /** pill only: "lg" for hero and CTA bands. */
  size?: "md" | "lg";
  /** Visible label (pill, bar). For the icon variant it becomes the accessible name. */
  children: ReactNode;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2.5 font-semibold bg-whatsapp text-whatsapp-foreground " +
  "transition-[transform,background-color,box-shadow] duration-[160ms] ease-[cubic-bezier(.22,1,.36,1)] " +
  "hover:bg-[hsl(142_70%_55%)] active:scale-[0.98] shadow-[0_8px_24px_-8px_hsl(var(--whatsapp)/0.55)]";

const variants: Record<Variant, string> = {
  pill: "rounded-full px-5 min-h-11 text-[15px]",
  icon: "rounded-full h-11 w-11 shrink-0",
  bar: "w-full rounded-[14px] min-h-[52px] px-5 text-base",
};

/**
 * The only way the v2 pages open WhatsApp: green, with the glyph and dark text (DESIGN.md
 * rule 2), the page's own pre-filled message, and a tracked click.
 */
export const WhatsAppButton = ({ placement, variant = "pill", size = "md", children, className }: WhatsAppButtonProps) => {
  const { market, page, whatsappHref, copy } = useSitePage();
  const isIcon = variant === "icon";
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      data-placement={placement}
      onClick={() => trackWhatsAppClick({ market, page, placement })}
      className={cn(base, variants[variant], variant === "pill" && size === "lg" && "min-h-[52px] px-7 text-base", className)}
    >
      <WhatsAppGlyph className={isIcon ? "h-[22px] w-[22px]" : "h-5 w-5 shrink-0"} />
      {isIcon ? (
        <span className="sr-only">
          {children} {copy.common.opensInNewTab}
        </span>
      ) : (
        <>
          <span>{children}</span>
          <span className="sr-only"> {copy.common.opensInNewTab}</span>
        </>
      )}
    </a>
  );
};
