
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ApiKey {
  id: string;
  name: string;
  created_at: string;
  last_used?: string;
  key: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  permissions: Record<string, any>; // Using Record<string, any> to avoid deep type instantiation
  added_at: string;
  status: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface NotificationPrefsData {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  deployment_alerts: boolean;
  billing_alerts: boolean;
  performance_reports: boolean;
  security_alerts: boolean;
}

export const useSettings = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoadingApiKeys, setIsLoadingApiKeys] = useState(true);

  // Simulate loading API keys
  useEffect(() => {
    const fetchApiKeys = async () => {
      // This would normally fetch from an API or database
      setTimeout(() => {
        const mockKeys: ApiKey[] = [
          {
            id: "1",
            name: "Development Key",
            created_at: "2023-01-15T00:00:00Z",
            last_used: "2023-06-20T00:00:00Z",
            key: "sk_live_123456789012345678901234",
          },
          {
            id: "2",
            name: "Production Key",
            created_at: "2023-03-10T00:00:00Z",
            key: "sk_live_abcdefghijklmnopqrstuvwx",
          },
        ];
        setApiKeys(mockKeys);
        setIsLoadingApiKeys(false);
      }, 1000);
    };

    fetchApiKeys();
  }, []);

  return {
    apiKeys,
    isLoadingApiKeys
  };
};
