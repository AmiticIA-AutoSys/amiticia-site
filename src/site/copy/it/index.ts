import type { MarketCopy } from "../types";
import { common } from "./common";
import { home } from "./home";
import { wahub } from "./wahub";
import { unavailable } from "./unavailable";

/** No Patrícia: it is not sold in Italy (/it/patricia shows the not-available page). */
export const itCopy: MarketCopy = { common, home, wahub, unavailable };
