/* eslint-disable react-refresh/only-export-components -- route table module: data plus route elements */
import type { ComponentType } from "react";
import { Route, Routes } from "react-router-dom";
import { homePath, liveMarkets, markets, type MarketId } from "./markets";
import { productPath, products, productsFor, type ProductId } from "./products";
import type { PageId } from "./copy/types";
import { copyFor, fillProduct } from "./copy";
import { ogImageFor, type PageMeta } from "./meta";
import { SitePageProvider } from "./layout/page-context";
import { SiteLayout } from "./layout/SiteLayout";
import { HomePage } from "./pages/home/HomePage";
import { WahubPage } from "./pages/wahub/WahubPage";
import { PatriciaPage } from "./pages/patricia/PatriciaPage";
import { UnavailablePage } from "./pages/unavailable/UnavailablePage";

export interface SiteRoute {
  path: string;
  market: MarketId;
  page: PageId;
  Page: ComponentType;
  meta: PageMeta;
}

const pageComponents: Record<Exclude<PageId, "unavailable">, ComponentType> = {
  home: HomePage,
  wahub: WahubPage,
  patricia: PatriciaPage,
};

const metaOf = (market: MarketId, page: PageId, path: string, product?: ProductId): PageMeta => {
  const fill = (s: string) => (product ? fillProduct(s, products[product].name) : s);
  const { title, description } = copyFor(market)[page].meta;
  return {
    title: fill(title),
    description: fill(description),
    path,
    origin: markets[market].origin,
    ogImage: ogImageFor(market, page),
    ogImageAlt: fill(title),
    lang: markets[market].lang,
    ogLocale: markets[market].ogLocale,
    ...(page === "unavailable" && { noindex: true }),
  };
};

const route = (market: MarketId, page: Exclude<PageId, "unavailable">, path: string): SiteRoute => ({
  path,
  market,
  page,
  Page: pageComponents[page],
  meta: metaOf(market, page, path),
});

/** A product's path in a market that does not sell it: says so and links to that market's home. */
const unavailableRoute = (market: MarketId, product: ProductId): SiteRoute => {
  const path = productPath(market, product);
  return {
    path,
    market,
    page: "unavailable",
    Page: () => <UnavailablePage productId={product} />,
    meta: metaOf(market, "unavailable", path, product),
  };
};

/**
 * The single list of market routes: used by the app router and by the prerender. Every product
 * path exists in every live market, so swapping the market prefix never leads to a 404.
 */
export const siteRoutes: SiteRoute[] = liveMarkets().flatMap((m) => {
  const sold = productsFor(m.id).map((p) => p.id);
  return [
    route(m.id, "home", homePath(m.id)),
    ...(Object.keys(products) as ProductId[]).map((id) =>
      sold.includes(id) ? route(m.id, id, productPath(m.id, id)) : unavailableRoute(m.id, id),
    ),
  ];
});

export const prerenderPaths: string[] = siteRoutes.map((r) => r.path);

/**
 * Where the prerender writes a page, relative to dist/: <market>/<path within the market>/index.html.
 * Brazil's clean URLs (/, /wahub) land in dist/br/, so nginx can serve them on amiticia.com.br without
 * the /br prefix ever being visible, and dist/index.html stays the SPA shell.
 */
export const prerenderFile = (r: Pick<SiteRoute, "market" | "path">): string => {
  const within = r.path.slice(markets[r.market].basePath.length).replace(/^\/+|\/+$/g, "");
  return [r.market, within, "index.html"].filter(Boolean).join("/");
};

/** Meta for a path (trailing slash tolerated), or undefined when it is not a market route. */
export const metaFor = (path: string): PageMeta | undefined => {
  const clean = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return siteRoutes.find((r) => r.path === clean)?.meta;
};

const element = (r: SiteRoute) => (
  <SitePageProvider market={r.market} page={r.page} path={r.path}>
    <SiteLayout meta={r.meta}>
      <r.Page />
    </SiteLayout>
  </SitePageProvider>
);

/** <Route> elements for every market page, to place inside the app's <Routes>. */
export const siteRouteElements = siteRoutes.map((r) => <Route key={r.path} path={r.path} element={element(r)} />);

/** Market routes on their own (tests). */
export const SiteRoutes = () => <Routes>{siteRouteElements}</Routes>;
