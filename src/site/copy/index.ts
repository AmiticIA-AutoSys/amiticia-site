import type { MarketId } from "../markets";
import type { MarketCopy } from "./types";
import { brCopy } from "./br";
import { itCopy } from "./it";

const copies: Partial<Record<MarketId, MarketCopy>> = { br: brCopy, it: itCopy };

/** The copy of a market. Throws for a market without copy, so a missing translation fails the build. */
export const copyFor = (market: MarketId): MarketCopy => {
  const copy = copies[market];
  if (!copy) throw new Error(`No copy for market "${market}"`);
  return copy;
};

/** Fills a pending claim's template, or returns null while its value is unconfirmed. */
export const fillClaim = (claim: { value: string | null; template: string }): string | null =>
  claim.value === null ? null : claim.template.replace("{value}", claim.value);

/** Puts a product's name into a not-available page string ("{product} non è disponibile…"). */
export const fillProduct = (text: string, product: string): string => text.split("{product}").join(product);
