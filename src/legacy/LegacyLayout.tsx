import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

/**
 * Providers the legacy pages (/, /k/*, 404) rely on. Loaded on demand as a layout route so the
 * market pages (/br…) never download react-query, tooltips or the toasters.
 */
const LegacyLayout = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Outlet />
    </TooltipProvider>
  </QueryClientProvider>
);

export default LegacyLayout;
