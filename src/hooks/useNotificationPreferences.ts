
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      try {
        const authResult = await supabase.auth.getUser();
        const user = authResult.data.user;
        
        if (!user) return null;

        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching notification preferences:", error);
          return null;
        }
        
        if (!data) return null;
        
        // Transform the database data to match our interface
        const preferences: NotificationPrefsData = {
          user_id: data.user_id,
          email_notifications: data.email_notifications || false,
          push_notifications: data.push_notifications || false,
          // Set default values for the missing fields
          marketing_emails: data.marketing_emails || false,
          deployment_alerts: data.deployment_alerts || false,
          billing_alerts: data.billing_alerts || false,
          performance_reports: data.performance_reports || false,
          security_alerts: data.security_alerts || false
        };
        
        return preferences;
      } catch (error) {
        console.error("Error in notification preferences query:", error);
        return null;
      }
    }
  });
};
