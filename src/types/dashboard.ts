
export interface DashboardMetrics {
  // Common metrics
  id: string;
  created_at: string;
  
  // User metrics
  total_interactions?: number;
  active_agents?: number;
  last_usage?: string;
  
  // Developer metrics
  revenue?: number;
  unique_views?: number;
  conversion_rate?: number;
  agent_count?: number;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  credit_balance: number;
  avatar_url: string | null;
  role: 'buyer' | 'developer';
  last_active: string | null;
}
