
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SettingsSection = 'profile' | 'payment' | 'notifications' | 'api' | 'team' | 'security';

// Define interfaces for our data structures - make sure they're exported
export interface ApiKey {
  id: string;
  description: string;
  key: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  email: string;
  role: string;
  status: string;
}

export interface SecuritySetting {
  user_id: string;
  two_factor_enabled: boolean;
  session_timeout: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  agentUpdates: boolean;
  revenueAlerts: boolean;
  marketingUpdates: boolean;
}

// Define the shape of the notification data from the database
export interface NotificationPrefsData {
  id: string;
  user_id: string;
  email_notifications: boolean;
  notification_types: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  push_notifications?: boolean;
}

export function useSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsSection>('profile');
  const { toast } = useToast();

  // Profile settings
  const updateProfile = async (profileData: any) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          company: profileData.company,
          website: profileData.website,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Payment settings
  const updatePaymentMethod = async (paymentData: any) => {
    setIsLoading(true);
    try {
      // In a real app, this would integrate with a payment processor like Stripe
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Payment information updated",
        description: "Your payment details have been saved successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Notification preferences
  const updateNotificationPreferences = async (preferences: NotificationPreferences) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create notification_types object for database storage
      const notification_types = {
        agent_updates: preferences.agentUpdates,
        revenue_alerts: preferences.revenueAlerts,
        marketing_updates: preferences.marketingUpdates
      };

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: preferences.emailNotifications,
          notification_types,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Notification preferences updated",
        description: "Your notification preferences have been saved successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // API keys - using local storage for demo instead of database
  const generateApiKey = async (description: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate a random API key (in a real app, use a more secure method)
      const apiKey = 'sk_' + Array(40)
        .fill(0)
        .map(() => Math.round(Math.random() * 35).toString(36))
        .join('');

      // Store in local storage for the demo (in a real app, this would be in a database)
      const existingKeysString = localStorage.getItem('api_keys') || '[]';
      const existingKeys = JSON.parse(existingKeysString) as ApiKey[];
      
      const newKey: ApiKey = {
        id: Math.random().toString(36).substring(2, 11),
        key: apiKey,
        description,
        created_at: new Date().toISOString()
      };

      localStorage.setItem('api_keys', JSON.stringify([...existingKeys, newKey]));

      toast({
        title: "New API key generated",
        description: "Your new API key has been generated. Keep it secure!",
        variant: "default"
      });
      
      return apiKey;
    } catch (error) {
      console.error("Error generating API key:", error);
      toast({
        title: "Error",
        description: "Failed to generate API key. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get API keys from local storage
  const getApiKeys = async (): Promise<ApiKey[]> => {
    // We'll simulate a delay to mimic a network request
    await new Promise(resolve => setTimeout(resolve, 300));
    const existingKeysString = localStorage.getItem('api_keys') || '[]';
    return JSON.parse(existingKeysString) as ApiKey[];
  };

  // Team management
  const addTeamMember = async (email: string, role: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // In a real app, this would send an invitation email
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: user.id, // Using user ID as team ID for simplicity
          user_id: email, // Storing email as user_id for simplicity
          role,
          permissions: { canEdit: role === 'admin' || role === 'developer' },
          added_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Team member added",
        description: "The new team member has been invited successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error adding team member:", error);
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Security settings - using local storage for demo
  const updateSecuritySettings = async (securityData: any) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update password if provided
      if (securityData.currentPassword && securityData.newPassword) {
        const { error } = await supabase.auth.updateUser({
          password: securityData.newPassword
        });
        
        if (error) throw error;
      }

      // Store other security settings in local storage for the demo
      const securitySettings: SecuritySetting = {
        user_id: user.id,
        two_factor_enabled: securityData.twoFactorEnabled,
        session_timeout: securityData.sessionTimeout
      };

      localStorage.setItem('security_settings', JSON.stringify(securitySettings));

      toast({
        title: "Security settings updated",
        description: "Your security settings have been updated successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating security settings:", error);
      toast({
        title: "Error",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get security settings from local storage
  const getSecuritySettings = async (): Promise<SecuritySetting | null> => {
    // We'll simulate a delay to mimic a network request
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const settingsString = localStorage.getItem('security_settings');
    if (!settingsString) return null;
    
    const settings = JSON.parse(settingsString) as SecuritySetting;
    if (settings.user_id !== user.id) return null;
    
    return settings;
  };

  return {
    activeTab,
    setActiveTab,
    isLoading,
    updateProfile,
    updatePaymentMethod,
    updateNotificationPreferences,
    generateApiKey,
    getApiKeys,
    addTeamMember,
    updateSecuritySettings,
    getSecuritySettings
  };
}
