
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import Home from './pages/Home';
import Agents from './pages/Agents';
import AgentDetails from './pages/AgentDetails';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminOverview from './pages/admin/Overview';
import AdminUsers from './pages/admin/Users';
import AdminAgents from './pages/admin/Agents';
import AdminCategories from './pages/admin/Categories';
import AdminTransactions from './pages/admin/Transactions';
import DeveloperOverview from './pages/developer/Overview';
import DeveloperAgents from './pages/developer/Agents';
import AgentManagement from './pages/developer/AgentManagement';
import Transactions from './pages/Transactions';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import MyAgents from './components/developer/MyAgents';

function App() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/:agentId" element={<AgentDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categoryId" element={<CategoryDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/agents" element={<AdminAgents />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          
          {/* Developer Routes */}
          <Route path="/developer" element={<DeveloperOverview />} />
          <Route path="/developer/agents" element={<DeveloperAgents />} />
          <Route path="/agent-management" element={<AgentManagement />} />
          <Route path="/my-agents" element={<MyAgents />} />
          
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />

          {/* Agent External Deployment */}
          <Route 
            path="/agent-external-deployment" 
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <React.lazy(() => import('./pages/agent-external-deployment')) />
              </Suspense>
            } 
          />
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
