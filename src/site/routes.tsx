/* eslint-disable react-refresh/only-export-components -- route table module: data plus route elements */
import type { ComponentType } from "react";
import { Route, Routes } from "react-router-dom";
import { liveMarkets, markets, type MarketId } from "./markets";
import { productPath, productsFor } from "./products";
import type { PageId } from "./copy/types";
import { copyFor } from "./copy";
import { ogImageFor, type PageMeta } from "./meta";
import { SitePageProvider } from "./layout/page-context";
import { SiteLayout } from "./layout/SiteLayout";
import { HomePage } from "./pages/home/HomePage";
import { WahubPage } from "./pages/wahub/WahubPage";
import { PatriciaPage } from "./pages/patricia/PatriciaPage";

export interface SiteRoute {
  path: string;
  market: MarketId;
  page: PageId;
  Page: ComponentType;
  meta: PageMeta;
}

const pageComponents: Record<PageId, ComponentType> = {
  home: HomePage,
  wahub: WahubPage,
  patricia: PatriciaPage,
};

const metaOf = (market: MarketId, page: PageId, path: string): PageMeta => {
  const { title, description } = copyFor(market)[page].meta;
  return {
    title,
    description,
    path,
    ogImage: ogImageFor(market, page),
    ogImageAlt: title,
    lang: markets[market].lang,
    ogLocale: markets[market].ogLocale,
  };
};

const route = (market: MarketId, page: PageId, path: string): SiteRoute => ({
  path,
  market,
  page,
  Page: pageComponents[page],
  meta: metaOf(market, page, path),
});

/** The single list of market routes: used by the app router and by the prerender. */
export const siteRoutes: SiteRoute[] = liveMarkets().flatMap((m) => [
  route(m.id, "home", `/${m.id}`),
  ...productsFor(m.id).map((p) => route(m.id, p.id, productPath(m.id, p.id))),
]);

export const prerenderPaths: string[] = siteRoutes.map((r) => r.path);

/** Meta for a path (trailing slash tolerated), or undefined when it is not a market route. */
export const metaFor = (path: string): PageMeta | undefined => {
  const clean = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return siteRoutes.find((r) => r.path === clean)?.meta;
};

const element = (r: SiteRoute) => (
  <SitePageProvider market={r.market} page={r.page}>
    <SiteLayout meta={r.meta}>
      <r.Page />
    </SiteLayout>
  </SitePageProvider>
);

/** <Route> elements for every market page, to place inside the app's <Routes>. */
export const siteRouteElements = siteRoutes.map((r) => <Route key={r.path} path={r.path} element={element(r)} />);

/** Market routes on their own (tests). */
export const SiteRoutes = () => <Routes>{siteRouteElements}</Routes>;
