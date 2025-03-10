
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
import { initSampleData } from "@/utils/dataInit";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

// Optimize the query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));

// User Dashboard Pages
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

// Developer Dashboard Pages
const DeveloperOverview = lazy(() => import("./pages/developer/Overview"));
const AgentManagement = lazy(() => import("./pages/developer/AgentManagement"));
const Revenue = lazy(() => import("./pages/developer/Revenue"));
const DeveloperAnalytics = lazy(() => import("./pages/developer/Analytics"));
const DeveloperReviews = lazy(() => import("./pages/developer/Reviews"));
const DeveloperSupport = lazy(() => import("./pages/developer/Support"));
const DeveloperSettings = lazy(() => import("./pages/developer/Settings"));
const ApiIntegrations = lazy(() => import("./pages/developer/ApiIntegrations"));
const AgentCreation = lazy(() => import("./pages/agent-creation/Index"));
const Marketplace = lazy(() => import("./pages/marketplace/Index"));
const DeveloperTransactions = lazy(() => import("./pages/developer/Transactions"));
const DeveloperMonitoring = lazy(() => import("./pages/developer/Monitoring"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const AppContent = () => {
  useEffect(() => {
    // Initialize sample data on app load
    initSampleData().catch(console.error);
  }, []);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/verify" element={<VerifyEmail />} />

        {/* Direct access to agent creation for development */}
        <Route path="/agent-creation" element={<AgentCreation />} />
        <Route path="/developer/agents/create" element={
          <DashboardLayout type="developer">
            <AgentCreation />
          </DashboardLayout>
        } />

        {/* User Dashboard Routes */}
        <Route path="/user" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<WithRoleProtection allowedRoles={["buyer"]} />}>
            <Route index element={
              <DashboardLayout type="user">
                <UserDashboard />
              </DashboardLayout>
            } />
          </Route>
          <Route path="credits" element={<WithRoleProtection allowedRoles={["buyer"]} />}>
            <Route index element={
              <DashboardLayout type="user">
                <Credits />
              </DashboardLayout>
            } />
          </Route>
          <Route path="settings" element={<WithRoleProtection allowedRoles={["buyer"]} />}>
            <Route index element={
              <DashboardLayout type="user">
                <Settings />
              </DashboardLayout>
            } />
          </Route>
          <Route path="usage" element={<WithRoleProtection allowedRoles={["buyer"]} />}>
            <Route index element={
              <DashboardLayout type="user">
                <UsageHistory />
              </DashboardLayout>
            } />
          </Route>
          <Route path="saved" element={<WithRoleProtection allowedRoles={["buyer"]} />}>
            <Route index element={
              <DashboardLayout type="user">
                <SavedAgents />
              </DashboardLayout>
            } />
          </Route>
          <Route path="analytics" element={<WithRoleProtection allowedRoles={["buyer"]} />}>
            <Route index element={
              <DashboardLayout type="user">
                <UserAnalytics />
              </DashboardLayout>
            } />
          </Route>
          <Route path="agents" element={<WithRoleProtection allowedRoles={["buyer"]} />}>
            <Route index element={
              <DashboardLayout type="user">
                <UserAgents />
              </DashboardLayout>
            } />
          </Route>
          <Route path="notifications" element={<WithRoleProtection allowedRoles={["buyer"]} />}>
            <Route index element={
              <DashboardLayout type="user">
                <UserNotifications />
              </DashboardLayout>
            } />
          </Route>
          <Route path="reviews" element={<WithRoleProtection allowedRoles={["buyer"]} />}>
            <Route index element={
              <DashboardLayout type="user">
                <Reviews />
              </DashboardLayout>
            } />
          </Route>
          <Route path="support" element={<WithRoleProtection allowedRoles={["buyer"]} />}>
            <Route index element={
              <DashboardLayout type="user">
                <Support />
              </DashboardLayout>
            } />
          </Route>
        </Route>

        {/* Developer Dashboard Routes */}
        <Route path="/developer" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<WithRoleProtection allowedRoles={["developer"]} />}>
            <Route index element={
              <DashboardLayout type="developer">
                <DeveloperOverview />
              </DashboardLayout>
            } />
          </Route>
          <Route path="agents" element={<WithRoleProtection allowedRoles={["developer"]} />}>
            <Route index element={
              <DashboardLayout type="developer">
                <AgentManagement />
              </DashboardLayout>
            } />
          </Route>
          <Route path="revenue" element={<WithRoleProtection allowedRoles={["developer"]} />}>
            <Route index element={
              <DashboardLayout type="developer">
                <Revenue />
              </DashboardLayout>
            } />
          </Route>
          <Route path="api" element={<WithRoleProtection allowedRoles={["developer"]} />}>
            <Route index element={
              <DashboardLayout type="developer">
                <ApiIntegrations />
              </DashboardLayout>
            } />
          </Route>
          <Route path="analytics" element={<WithRoleProtection allowedRoles={["developer"]} />}>
            <Route index element={
              <DashboardLayout type="developer">
                <DeveloperAnalytics />
              </DashboardLayout>
            } />
          </Route>
          <Route path="reviews" element={<WithRoleProtection allowedRoles={["developer"]} />}>
            <Route index element={
              <DashboardLayout type="developer">
                <DeveloperReviews />
              </DashboardLayout>
            } />
          </Route>
          <Route path="support" element={<WithRoleProtection allowedRoles={["developer"]} />}>
            <Route index element={
              <DashboardLayout type="developer">
                <DeveloperSupport />
              </DashboardLayout>
            } />
          </Route>
          <Route path="settings" element={<WithRoleProtection allowedRoles={["developer"]} />}>
            <Route index element={
              <DashboardLayout type="developer">
                <DeveloperSettings />
              </DashboardLayout>
            } />
          </Route>
          <Route path="transactions" element={<WithRoleProtection allowedRoles={["developer"]} />}>
            <Route index element={
              <DashboardLayout type="developer">
                <DeveloperTransactions />
              </DashboardLayout>
            } />
          </Route>
          <Route path="monitoring" element={<WithRoleProtection allowedRoles={["developer"]} />}>
            <Route index element={
              <DashboardLayout type="developer">
                <DeveloperMonitoring />
              </DashboardLayout>
            } />
          </Route>
        </Route>

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
    <TooltipProvider>
      <FeatureTourProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </FeatureTourProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
