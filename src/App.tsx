
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import DeveloperOverview from './pages/developer/Overview';
import AgentManagement from './pages/developer/AgentManagement';
import MyAgents from './components/developer/MyAgents';

// Import the agents file with the correct casing
import DeveloperAgents from './pages/developer/agents';

// Lazy load the external deployment page
const ExternalDeploymentPage = lazy(() => import('./pages/agent-external-deployment'));

function App() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          
          {/* Developer Routes */}
          <Route path="/developer" element={<DeveloperOverview />} />
          <Route path="/developer/agents" element={<DeveloperAgents />} />
          <Route path="/agent-management" element={<AgentManagement />} />
          <Route path="/my-agents" element={<MyAgents />} />
          
          <Route path="*" element={<div>Not Found</div>} />

          {/* Agent External Deployment */}
          <Route 
            path="/agent-external-deployment" 
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ExternalDeploymentPage />
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
