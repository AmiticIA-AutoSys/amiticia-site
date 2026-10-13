/**
 * Market registry. A market is a URL prefix (/br, /it, /en) with its own language,
 * WhatsApp number and copy. Adding a market is a data change here plus a copy folder;
 * only markets with `live: true` get routes, links and language-switcher entries.
 */
export type MarketId = "br" | "it" | "en";

export interface Market {
  id: MarketId;
  /** BCP 47 tag written to <html lang>. */
  lang: string;
  /** Open Graph locale, e.g. pt_BR. */
  ogLocale: string;
  /** Short label shown in the language switcher. */
  label: string;
  /** International format, digits only, as wa.me expects. */
  whatsappNumber: string;
  live: boolean;
}

export const markets: Record<MarketId, Market> = {
  br: {
    id: "br",
    lang: "pt-BR",
    ogLocale: "pt_BR",
    label: "Português",
    whatsappNumber: "5531986983745",
    live: true,
  },
  it: {
    id: "it",
    lang: "it-IT",
    ogLocale: "it_IT",
    label: "Italiano",
    whatsappNumber: "393926044070",
    live: true,
  },
  en: {
    id: "en",
    lang: "en",
    ogLocale: "en_US",
    label: "English",
    whatsappNumber: "",
    live: false,
  },
};

export const liveMarkets = (): Market[] => Object.values(markets).filter((m) => m.live);

/** Markets a visitor on `current` could switch to. Empty while only one market is live. */
export const alternateMarkets = (current: MarketId): Market[] =>
  liveMarkets().filter((m) => m.id !== current);

/** The entry of `market` in a per-market table (demo data, screenshots). Throws when it is missing. */
export const forMarket = <T>(table: Partial<Record<MarketId, T>>, market: MarketId, what: string): T => {
  const value = table[market];
  if (value === undefined) throw new Error(`No ${what} for market "${market}"`);
  return value;
};
