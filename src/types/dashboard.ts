
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

export interface DashboardMetrics {
  creditBalance: number;
  activeAgents: number;
  monthlyUsage: number;
  averageRating: number;
  lastLoginDate: string;
  userName: string;
  unreadNotifications: number;
  recentActivity: UserActivity[];
}

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
