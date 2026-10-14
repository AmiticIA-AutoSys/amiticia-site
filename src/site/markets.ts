/**
 * Market registry. A market is a domain plus a path prefix (amiticia.com.br with none, amiticia.cc/it,
 * amiticia.cc/en) with its own language, WhatsApp number and copy. Adding a market is a data change here plus a copy folder;
 * only markets with `live: true` get routes, links and language-switcher entries.
 */
export type MarketId = "br" | "it" | "en";

export interface Market {
  id: MarketId;
  /** BCP 47 tag written to <html lang>. */
  lang: string;
  /** Open Graph locale, e.g. pt_BR. */
  ogLocale: string;
  /** Public origin of the market: canonical and og URLs, and the language switcher, use it. */
  origin: string;
  /** Path prefix of the market's pages on its origin: "" for Brazil, "/it", "/en". */
  basePath: string;
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
    origin: "https://amiticia.com.br",
    basePath: "",
    label: "Português",
    whatsappNumber: "5531986983745",
    live: true,
  },
  it: {
    id: "it",
    lang: "it-IT",
    ogLocale: "it_IT",
    origin: "https://amiticia.cc",
    basePath: "/it",
    label: "Italiano",
    whatsappNumber: "393926044070",
    live: true,
  },
  en: {
    id: "en",
    lang: "en",
    ogLocale: "en_US",
    origin: "https://amiticia.cc",
    basePath: "/en",
    label: "English",
    whatsappNumber: "",
    live: false,
  },
};

/** Path of a market's home: its base path, or "/" for a market without one. */
export const homePath = (market: MarketId): string => markets[market].basePath || "/";

/** Path of a product page in a market, e.g. /wahub (br) or /it/wahub. */
export const productPath = (market: MarketId, product: string): string => `${markets[market].basePath}/${product}`;

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
