import type { MarketId } from "./markets";
import { markets, productPath as marketProductPath } from "./markets";

export type ProductId = "wahub" | "patricia";

export interface Product {
  id: ProductId;
  name: string;
  /** Markets where the product has a page. A page only renders if the market is live too. */
  markets: MarketId[];
  /** Where existing customers sign in, when the product has a web app. */
  loginUrl?: string;
}

export const products: Record<ProductId, Product> = {
  wahub: {
    id: "wahub",
    name: "WaHub",
    markets: ["br", "it"],
    loginUrl: "https://wahub.amiticia.cc",
  },
  patricia: {
    id: "patricia",
    name: "Patrícia",
    markets: ["br"],
  },
};

/** Products that have a page in this market (empty for a market that is not live). */
export const productsFor = (market: MarketId): Product[] =>
  markets[market].live ? Object.values(products).filter((p) => p.markets.includes(market)) : [];

export const productPath = (market: MarketId, product: ProductId): string => marketProductPath(market, product);
