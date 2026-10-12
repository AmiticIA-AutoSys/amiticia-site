import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSitePage } from "./page-context";
import { WhatsAppButton } from "./WhatsAppButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SiteMenu } from "./SiteMenu";
import { Logo } from "./Logo";

const navLinkClass =
  "inline-flex min-h-11 items-center gap-1 rounded-full px-3.5 text-[15px] font-medium text-muted-foreground transition-colors duration-[160ms] hover:text-foreground";

// VISUAL: skiper40 animated nav links + skiper41 progressive blur (kit) replace the plain links/blur.
export const SiteHeader = () => {
  const { market, copy } = useSitePage();
  const { nav, headerCta, whatsappIconLabel, homeLinkLabel, languageSwitcherLabel } = copy.common;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color] duration-[280ms]",
        scrolled
          ? "border-border/80 bg-background/75 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-background/0",
      )}
    >
      <div className="v2-container flex h-16 items-center justify-between gap-3 md:h-[72px]">
        <Link to={`/${market}`} aria-label={homeLinkLabel} className="-ml-1 inline-flex min-h-11 items-center rounded-lg px-1">
          <Logo />
        </Link>

        <nav aria-label={nav.label} className="hidden items-center gap-1 lg:flex">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className={cn(navLinkClass, "data-[state=open]:text-foreground")}>
              {nav.products.label}
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="site-v2 min-w-[200px] rounded-2xl border-border bg-popover p-1.5 text-popover-foreground"
            >
              {nav.products.items.map((item) => (
                <DropdownMenuItem key={item.to} asChild className="min-h-11 cursor-pointer rounded-xl px-3 text-[15px]">
                  <Link to={item.to}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {nav.links.map((item) => (
            <Link key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher market={market} label={languageSwitcherLabel} />
          <WhatsAppButton placement="header" className="hidden md:inline-flex">
            {headerCta}
          </WhatsAppButton>
          <WhatsAppButton placement="header" variant="icon" className="md:hidden">
            {whatsappIconLabel}
          </WhatsAppButton>
          <SiteMenu />
        </div>
      </div>
    </header>
  );
};
