import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import WithRoleProtection from "@/components/auth/WithRoleProtection";
import { UserSupport } from "@/components/user-support/UserSupport";

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
const UserSupport = lazy(() => import("./pages/dashboard/Support"));

// Developer Dashboard Pages
const DeveloperOverview = lazy(() => import("./pages/developer/Overview"));
const AgentManagement = lazy(() => import("./pages/developer/AgentManagement"));
const Revenue = lazy(() => import("./pages/developer/Revenue"));
const DeveloperAnalytics = lazy(() => import("./pages/developer/Analytics"));
const DeveloperReviews = lazy(() => import("./pages/developer/Reviews"));
const DeveloperSupport = lazy(() => import("./pages/developer/Support"));
const DeveloperSettings = lazy(() => import("./pages/developer/Settings"));
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/verify" element={<VerifyEmail />} />

              {/* User Dashboard Routes */}
              <Route path="/user">
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["buyer"]}>
                        <UserDashboard />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="credits"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["buyer"]}>
                        <Credits />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["buyer"]}>
                        <Settings />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="usage"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["buyer"]}>
                        <UsageHistory />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="saved"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["buyer"]}>
                        <SavedAgents />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["buyer"]}>
                        <UserAnalytics />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="agents"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["buyer"]}>
                        <UserAgents />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["buyer"]}>
                        <UserNotifications />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="support"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["buyer"]}>
                        <UserSupport />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Developer Dashboard Routes */}
              <Route path="/developer">
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["developer"]}>
                        <DeveloperOverview />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="agents"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["developer"]}>
                        <AgentManagement />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="revenue"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["developer"]}>
                        <Revenue />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["developer"]}>
                        <DeveloperAnalytics />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reviews"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["developer"]}>
                        <DeveloperReviews />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="support"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["developer"]}>
                        <DeveloperSupport />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["developer"]}>
                        <DeveloperSettings />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="agents/create"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["developer"]}>
                        <AgentCreation />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="transactions"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["developer"]}>
                        <DeveloperTransactions />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="monitoring"
                  element={
                    <ProtectedRoute>
                      <WithRoleProtection allowedRoles={["developer"]}>
                        <DeveloperMonitoring />
                      </WithRoleProtection>
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />

              {/* Redirects */}
              <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
              <Route path="/developer" element={<Navigate to="/developer/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
