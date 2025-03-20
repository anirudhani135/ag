
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useNotificationPreferences, NotificationPrefsData } from "@/hooks/useNotificationPreferences";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const NotificationPreferencesSection = () => {
  const { toast } = useToast();
  const { data: notificationPrefs, isLoading, refetch } = useNotificationPreferences();
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPrefsData | null>(null);

  // Update local state when API data is loaded
  useEffect(() => {
    if (notificationPrefs) {
      setPreferences(notificationPrefs);
    }
  }, [notificationPrefs]);

  const handleToggle = (key: keyof NotificationPrefsData) => {
    if (!preferences) return;
    
    // Update local state immediately for responsive UI
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
    
    // Also save the change immediately for better UX
    savePreference(key, !preferences[key]);
  };

  const savePreference = async (key: keyof NotificationPrefsData, value: boolean) => {
    try {
      const authResult = await supabase.auth.getUser();
      const user = authResult.data.user;
      
      if (!user) {
        toast({
          title: "Error",
          description: "You need to be logged in to save preferences",
          variant: "destructive",
        });
        return;
      }

      // Show a toast notification that the preference is being saved
      toast.promise(
        supabase
          .from('notification_preferences')
          .upsert({
            user_id: user.id,
            [key]: value,
            updated_at: new Date().toISOString()
          }),
        {
          loading: `Updating ${key.replace('_', ' ')}...`,
          success: `${key.replace('_', ' ')} preference updated`,
          error: `Failed to update ${key.replace('_', ' ')}`
        }
      );
    } catch (error) {
      console.error(`Error saving ${key} preference:`, error);
      toast({
        title: "Error",
        description: `Failed to save ${key.replace('_', ' ')} preference`,
        variant: "destructive",
      });
    }
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;

    setIsSaving(true);
    try {
      const authResult = await supabase.auth.getUser();
      const user = authResult.data.user;
      
      if (!user) {
        toast({
          title: "Error",
          description: "You need to be logged in to save preferences",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: preferences.email_notifications,
          push_notifications: preferences.push_notifications,
          marketing_emails: preferences.marketing_emails,
          deployment_alerts: preferences.deployment_alerts,
          billing_alerts: preferences.billing_alerts,
          performance_reports: preferences.performance_reports,
          security_alerts: preferences.security_alerts,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;

      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated",
      });
      
      refetch();
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const notificationOptions = [
    { key: 'email_notifications', label: 'Email Notifications' },
    { key: 'push_notifications', label: 'Push Notifications' },
    { key: 'marketing_emails', label: 'Marketing Emails' },
    { key: 'deployment_alerts', label: 'Deployment Alerts' },
    { key: 'billing_alerts', label: 'Billing Alerts' },
    { key: 'performance_reports', label: 'Performance Reports' },
    { key: 'security_alerts', label: 'Security Alerts' }
  ] as const;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage how you receive notifications from the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {notificationOptions.map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex flex-row items-center justify-between"
                  >
                    <Label htmlFor={key} className="flex-1">
                      {label}
                    </Label>
                    <Switch
                      id={key}
                      checked={preferences?.[key] || false}
                      onCheckedChange={() => handleToggle(key)}
                      aria-label={`Toggle ${label}`}
                    />
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSavePreferences}
                disabled={isSaving || isLoading || !preferences}
                className="w-full sm:w-auto"
              >
                {isSaving ? "Saving..." : "Save All Preferences"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
