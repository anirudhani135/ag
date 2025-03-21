
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { WithRoleProtection } from "@/components/auth/WithRoleProtection";
import { FeatureTourProvider } from "@/components/feature-tours/FeatureTourProvider";
import { CacheProvider } from "@/context/CacheContext";
import { initSampleData } from "@/utils/dataInit";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UserOnboarding } from "@/components/onboarding/UserOnboarding";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

// Configure QueryClient with improved caching and performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes (increased from 1)
      gcTime: 10 * 60 * 1000, // 10 minutes (increased from 5)
      retry: 2, // Increased retry attempts
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

const DeveloperOverview = lazy(() => import("./pages/developer/Overview"));
const AgentManagement = lazy(() => import("./pages/developer/AgentManagement"));
const AgentTesting = lazy(() => import("./pages/developer/AgentTesting"));
const Revenue = lazy(() => import("./pages/developer/Revenue"));
const DeveloperAnalytics = lazy(() => import("./pages/developer/Analytics"));
const DeveloperReviews = lazy(() => import("./pages/developer/Reviews"));
const DeveloperSupport = lazy(() => import("./pages/developer/Support"));
const DeveloperSettings = lazy(() => import("./pages/developer/Settings"));
const ApiIntegrations = lazy(() => import("./pages/developer/ApiIntegrations"));
const AgentCreation = lazy(() => import("./pages/agent-creation/Index"));
const ExternalSourceDeployment = lazy(() => import("./pages/external-source-deployment/Index"));
const AgentDetailView = lazy(() => import("./pages/agent-detail/index"));
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

        <Route path="/agent-creation" element={<Navigate to="/agent-external-deployment" replace />} />

        {/* Developer routes - Apply developer layout consistently */}
        <Route path="/agent-external-deployment" element={<ProtectedRoute />}>
          <Route path="" element={<WithRoleProtection allowedRoles={["developer"]} />}>
            <Route index element={
              <DashboardLayout type="developer">
                <ExternalSourceDeployment />
              </DashboardLayout>
            } />
          </Route>
        </Route>

        {/* User routes - Apply user layout consistently */}
        <Route path="/user" element={<ProtectedRoute />}>
          <Route element={<WithRoleProtection allowedRoles={["buyer"]} />}>
            <Route path="dashboard" element={
              <DashboardLayout type="user">
                <UserDashboard />
              </DashboardLayout>
            } />
            <Route path="credits" element={
              <DashboardLayout type="user">
                <Credits />
              </DashboardLayout>
            } />
            <Route path="settings" element={
              <DashboardLayout type="user">
                <Settings />
              </DashboardLayout>
            } />
            <Route path="usage" element={
              <DashboardLayout type="user">
                <UsageHistory />
              </DashboardLayout>
            } />
            <Route path="saved" element={
              <DashboardLayout type="user">
                <SavedAgents />
              </DashboardLayout>
            } />
            <Route path="analytics" element={
              <DashboardLayout type="user">
                <UserAnalytics />
              </DashboardLayout>
            } />
            <Route path="agents" element={
              <DashboardLayout type="user">
                <UserAgents />
              </DashboardLayout>
            } />
            <Route path="notifications" element={
              <DashboardLayout type="user">
                <UserNotifications />
              </DashboardLayout>
            } />
            <Route path="reviews" element={
              <DashboardLayout type="user">
                <Reviews />
              </DashboardLayout>
            } />
            <Route path="support" element={
              <DashboardLayout type="user">
                <Support />
              </DashboardLayout>
            } />
          </Route>
        </Route>

        {/* Developer routes - Apply developer layout consistently */}
        <Route path="/developer" element={<ProtectedRoute />}>
          <Route element={<WithRoleProtection allowedRoles={["developer"]} />}>
            <Route path="dashboard" element={
              <DashboardLayout type="developer">
                <DeveloperOverview />
              </DashboardLayout>
            } />
            <Route path="agents" element={
              <DashboardLayout type="developer">
                <AgentManagement />
              </DashboardLayout>
            } />
            <Route path="agents/:agentId/testing" element={
              <DashboardLayout type="developer">
                <AgentTesting />
              </DashboardLayout>
            } />
            <Route path="agents/create" element={<Navigate to="/agent-external-deployment" replace />} />
            <Route path="revenue" element={
              <DashboardLayout type="developer">
                <Revenue />
              </DashboardLayout>
            } />
            <Route path="api-integrations" element={
              <DashboardLayout type="developer">
                <ApiIntegrations />
              </DashboardLayout>
            } />
            <Route path="api" element={<Navigate to="/developer/api-integrations" replace />} />
            <Route path="analytics" element={
              <DashboardLayout type="developer">
                <DeveloperAnalytics />
              </DashboardLayout>
            } />
            <Route path="reviews" element={
              <DashboardLayout type="developer">
                <DeveloperReviews />
              </DashboardLayout>
            } />
            <Route path="support" element={
              <DashboardLayout type="developer">
                <DeveloperSupport />
              </DashboardLayout>
            } />
            <Route path="settings" element={
              <DashboardLayout type="developer">
                <DeveloperSettings />
              </DashboardLayout>
            } />
            <Route path="transactions" element={
              <DashboardLayout type="developer">
                <DeveloperTransactions />
              </DashboardLayout>
            } />
            <Route path="monitoring" element={
              <DashboardLayout type="developer">
                <DeveloperMonitoring />
              </DashboardLayout>
            } />
            <Route path="agents/external" element={
              <DashboardLayout type="developer">
                <ExternalSourceDeployment />
              </DashboardLayout>
            } />
          </Route>
        </Route>

        {/* Marketplace routes */}
        <Route path="/marketplace" element={<ProtectedRoute />}>
          <Route index element={
            <DashboardLayout type="user">
              <Marketplace />
            </DashboardLayout>
          } />
        </Route>

        {/* Redirects */}
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="/developer" element={<Navigate to="/developer/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
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
          <AuthProvider>
            <NotificationProvider>
              <AppContent />
              <UserOnboarding />
            </NotificationProvider>
          </AuthProvider>
        </FeatureTourProvider>
      </TooltipProvider>
    </CacheProvider>
  </QueryClientProvider>
);

export default App;
