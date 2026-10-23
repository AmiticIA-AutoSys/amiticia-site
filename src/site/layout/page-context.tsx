import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MarketId } from "../markets";
import type { MarketCopy, PageId } from "../copy/types";
import { copyFor } from "../copy";
import { whatsappHrefFor } from "../whatsapp";
import { fillReferral } from "../referral";

export interface SitePage {
  market: MarketId;
  page: PageId;
  /** This page's path, e.g. /br/wahub (the language switcher links to the same page elsewhere). */
  path?: string;
  copy: MarketCopy;
  /** wa.me link with this page's pre-filled message; every WhatsApp button on the page uses it. */
  whatsappHref: string;
  /** Label of the mobile sticky bar on this page. */
  stickyCta: string;
}

const SitePageContext = createContext<SitePage | null>(null);

export const SitePageProvider = ({
  market,
  page,
  path,
  children,
}: {
  market: MarketId;
  page: PageId;
  path?: string;
  children: ReactNode;
}) => {
  // Read after mount, so the prerendered HTML and the first client render stay identical.
  const [ref, setRef] = useState<string | null>(null);
  useEffect(() => {
    setRef(new URLSearchParams(window.location.search).get("ref"));
  }, []);
  const value = useMemo<SitePage>(() => {
    const copy = copyFor(market);
    return {
      market,
      page,
      path,
      copy,
      whatsappHref: whatsappHrefFor(market, page, fillReferral(copy.common.referral, ref)),
      stickyCta: copy[page].stickyCta,
    };
  }, [market, page, path, ref]);
  return <SitePageContext.Provider value={value}>{children}</SitePageContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSitePage = (): SitePage => {
  const value = useContext(SitePageContext);
  if (!value) throw new Error("useSitePage must be used inside <SitePageProvider>");
  return value;
};
