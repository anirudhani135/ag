import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy loaded components
const Index = lazy(() => import("./pages/Index"));
const DashboardOverview = lazy(() => import("./pages/dashboard/Overview"));
const Credits = lazy(() => import("./pages/dashboard/Credits"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const UsageHistory = lazy(() => import("./pages/dashboard/UsageHistory"));
const DeveloperOverview = lazy(() => import("./pages/developer/Overview"));
const AgentManagement = lazy(() => import("./pages/developer/AgentManagement"));
const Analytics = lazy(() => import("./pages/developer/Analytics"));
const DeveloperSettings = lazy(() => import("./pages/developer/Settings"));
const Marketplace = lazy(() => import("./pages/marketplace/Index"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/dashboard/credits" element={<Credits />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/usage" element={<UsageHistory />} />
            <Route path="/developer" element={<DeveloperOverview />} />
            <Route path="/developer/agents" element={<AgentManagement />} />
            <Route path="/developer/analytics" element={<Analytics />} />
            <Route path="/developer/settings" element={<DeveloperSettings />} />
            <Route path="/marketplace" element={<Marketplace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;