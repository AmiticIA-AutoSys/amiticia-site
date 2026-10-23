import type { MarketId } from "./markets";
import { markets } from "./markets";
import type { PageId } from "./copy/types";
import { copyFor } from "./copy";

/** https://wa.me/<number>?text=<encoded text> — opens a chat with the text pre-filled. */
export const whatsappHref = (number: string, text: string): string =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

/** The link every WhatsApp button on `page` of `market` uses. */
export const whatsappHrefFor = (market: MarketId, page: PageId, referral?: string | null): string => {
  const message = copyFor(market)[page].whatsappMessage;
  return whatsappHref(markets[market].whatsappNumber, referral ? `${message} ${referral}` : message);
};
