
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
// Import real AuthProvider
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FeatureTourProvider } from "@/components/feature-tours/FeatureTourProvider";
import { CacheProvider } from "@/context/CacheContext";
import { initSampleData } from "@/utils/dataInit";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

// Configure QueryClient with improved caching and performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, 
      gcTime: 10 * 60 * 1000, 
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Lazy load pages with better error handling
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));

// User pages
const UserDashboard = lazy(() => import("./pages/dashboard/Overview"));
const Credits = lazy(() => import("./pages/dashboard/Credits"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const UsageHistory = lazy(() => import("./pages/dashboard/UsageHistory"));
const SavedAgents = lazy(() => import("./pages/dashboard/SavedAgents"));
const UserAnalytics = lazy(() => import("./pages/dashboard/Analytics"));
const UserAgents = lazy(() => import("./pages/dashboard/Agents"));
const UserNotifications = lazy(() => import("./pages/dashboard/Notifications"));
const Reviews = lazy(() => import("@/components/user-reviews/UserReviews"));
const Support = lazy(() => import("./components/user-support/UserSupport"));

// Developer pages
const DeveloperOverview = lazy(() => import("./pages/developer/Overview"));
const AgentManagement = lazy(() => import("./pages/developer/AgentManagement"));
const AgentTesting = lazy(() => import("./pages/developer/AgentTesting"));
const Revenue = lazy(() => import("./pages/developer/Revenue"));
const DeveloperAnalytics = lazy(() => import("./pages/developer/Analytics"));
const DeveloperReviews = lazy(() => import("./pages/developer/Reviews"));
const DeveloperSupport = lazy(() => import("./pages/developer/Support"));
const DeveloperSettings = lazy(() => import("./pages/developer/Settings"));
const ApiIntegrations = lazy(() => import("./pages/developer/ApiIntegrations"));
const ExternalSourceDeployment = lazy(() => import("./pages/external-source-deployment/Index"));
const Marketplace = lazy(() => import("./pages/marketplace/Index"));
const DeveloperTransactions = lazy(() => import("./pages/developer/Transactions"));
const DeveloperMonitoring = lazy(() => import("./pages/developer/Monitoring"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Service worker registration function
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

const AppContent = () => {
  useEffect(() => {
    initSampleData().catch(console.error);
    registerServiceWorker().catch(console.error);
  }, []);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Auth routes - No layout */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/verify" element={<VerifyEmail />} />

        {/* Protected user routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/user">
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="credits" element={<Credits />} />
            <Route path="settings" element={<Settings />} />
            <Route path="usage" element={<UsageHistory />} />
            <Route path="saved" element={<SavedAgents />} />
            <Route path="analytics" element={<UserAnalytics />} />
            <Route path="agents" element={<UserAgents />} />
            <Route path="notifications" element={<UserNotifications />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="support" element={<Support />} />
          </Route>
        </Route>

        {/* Protected developer routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/developer">
            <Route path="dashboard" element={<DeveloperOverview />} />
            <Route path="agents" element={<AgentManagement />} />
            <Route path="agents/:agentId/testing" element={<AgentTesting />} />
            <Route path="agents/create" element={<Navigate to="/agent-external-deployment" replace />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="api-integrations" element={<ApiIntegrations />} />
            <Route path="api" element={<Navigate to="/developer/api-integrations" replace />} />
            <Route path="analytics" element={<DeveloperAnalytics />} />
            <Route path="reviews" element={<DeveloperReviews />} />
            <Route path="support" element={<DeveloperSupport />} />
            <Route path="settings" element={<DeveloperSettings />} />
            <Route path="transactions" element={<DeveloperTransactions />} />
            <Route path="monitoring" element={<DeveloperMonitoring />} />
            <Route path="agents/external" element={<ExternalSourceDeployment />} />
          </Route>
          <Route path="/agent-external-deployment" element={<ExternalSourceDeployment />} />
        </Route>

        {/* Marketplace - publicly accessible */}
        <Route path="/marketplace" element={<Marketplace />} />

        {/* Redirects */}
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="/developer" element={<Navigate to="/developer/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CacheProvider queryClient={queryClient}>
      <TooltipProvider>
        <FeatureTourProvider>
          <Toaster />
          <Sonner />
          {/* Use our new AuthProvider */}
          <AuthProvider>
            <NotificationProvider>
              <AppContent />
            </NotificationProvider>
          </AuthProvider>
        </FeatureTourProvider>
      </TooltipProvider>
    </CacheProvider>
  </QueryClientProvider>
);

export default App;
