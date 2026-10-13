import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { siteRouteElements } from "./site/routes";
import { routerFuture } from "./site/router-future";

// Legacy pages and their providers are never prerendered: load them on demand so the market
// pages stay light. LegacyLayout wraps them in the providers only they use.
const LegacyLayout = lazy(() => import("./legacy/LegacyLayout"));
const Index = lazy(() => import("./pages/Index"));
const Knowledge = lazy(() => import("./pages/Knowledge"));
const NotFound = lazy(() => import("./pages/NotFound"));

/** Routes, without a router: the browser wraps it in BrowserRouter, the prerender in StaticRouter. */
export const AppShell = () => (
  <Suspense fallback={null}>
    <Routes>
      {siteRouteElements}
      <Route element={<LegacyLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/k" element={<Knowledge />} />
        <Route path="/k/article/:articleSlug" element={<Knowledge />} />
        <Route path="/k/:slug" element={<Knowledge />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Suspense>
);

const App = () => (
  <BrowserRouter future={routerFuture}>
    <AppShell />
  </BrowserRouter>
);

export default App;
