import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { siteRouteElements } from "./site/routes";
import { routerFuture } from "./site/router-future";

// Legacy pages are never prerendered: load them on demand so the market pages stay light.
const Index = lazy(() => import("./pages/Index"));
const Knowledge = lazy(() => import("./pages/Knowledge"));

const queryClient = new QueryClient();

/** Providers and routes, without a router: the browser wraps it in BrowserRouter, the prerender in StaticRouter. */
export const AppShell = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/k" element={<Knowledge />} />
          <Route path="/k/article/:articleSlug" element={<Knowledge />} />
          <Route path="/k/:slug" element={<Knowledge />} />
          {siteRouteElements}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => (
  <BrowserRouter future={routerFuture}>
    <AppShell />
  </BrowserRouter>
);

export default App;
