
import { type LucideIcon } from "lucide-react";

export interface DashboardStats {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  change?: number;
  status?: 'success' | 'warning' | 'error';
}

export interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  agentName: string;
  metadata?: Record<string, any>;
  status?: 'success' | 'warning' | 'error';
}

export interface BaseDashboardMetrics {
  userName: string;
  lastLoginDate: string;
  averageRating: number;
  unreadNotifications: number;
  recentActivity: UserActivity[];
}

export interface UserDashboardMetrics extends BaseDashboardMetrics {
  creditBalance: number;
  activeAgents: number;
  monthlyUsage: number;
}

export interface DeveloperDashboardMetrics extends BaseDashboardMetrics {
  availableBalance: number;
  publishedAgents: number;
  monthlyRevenue: number;
}

export type DashboardMetrics = UserDashboardMetrics | DeveloperDashboardMetrics;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface UserActivityFeedProps {
  activities?: UserActivity[];
  isLoading?: boolean;
  error?: Error | null;
}
