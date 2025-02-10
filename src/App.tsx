
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const DashboardOverview = lazy(() => import("./pages/dashboard/Overview"));
const Credits = lazy(() => import("./pages/dashboard/Credits"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const UsageHistory = lazy(() => import("./pages/dashboard/UsageHistory"));
const SavedAgents = lazy(() => import("./pages/dashboard/SavedAgents"));
const DeveloperOverview = lazy(() => import("./pages/developer/Overview"));
const AgentManagement = lazy(() => import("./pages/developer/AgentManagement"));
const Analytics = lazy(() => import("./pages/developer/Analytics"));
const DeveloperSettings = lazy(() => import("./pages/developer/Settings"));
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
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/verify" element={<VerifyEmail />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardOverview />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/credits" element={
                <ProtectedRoute>
                  <Credits />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/usage" element={
                <ProtectedRoute>
                  <UsageHistory />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/saved" element={
                <ProtectedRoute>
                  <SavedAgents />
                </ProtectedRoute>
              } />
              <Route path="/developer" element={
                <ProtectedRoute>
                  <DeveloperOverview />
                </ProtectedRoute>
              } />
              <Route path="/developer/agents" element={
                <ProtectedRoute>
                  <AgentManagement />
                </ProtectedRoute>
              } />
              <Route path="/developer/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/developer/settings" element={
                <ProtectedRoute>
                  <DeveloperSettings />
                </ProtectedRoute>
              } />
              <Route path="/marketplace" element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
