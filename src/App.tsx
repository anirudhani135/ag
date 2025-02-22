
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }
          >
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
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="credits"
                  element={
                    <ProtectedRoute>
                      <Credits />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="usage"
                  element={
                    <ProtectedRoute>
                      <UsageHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="saved"
                  element={
                    <ProtectedRoute>
                      <SavedAgents />
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
                      <DeveloperOverview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="agents"
                  element={
                    <ProtectedRoute>
                      <AgentManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="revenue"
                  element={
                    <ProtectedRoute>
                      <Revenue />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <ProtectedRoute>
                      <DeveloperAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reviews"
                  element={
                    <ProtectedRoute>
                      <DeveloperReviews />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="support"
                  element={
                    <ProtectedRoute>
                      <DeveloperSupport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <DeveloperSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="agents/create"
                  element={
                    <ProtectedRoute>
                      <AgentCreation />
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
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
