
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SettingsSection = 'profile' | 'payment' | 'notifications' | 'api' | 'team' | 'security';

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
  const updateNotificationPreferences = async (preferences: Record<string, boolean>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          preferences,
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

  // API keys
  const generateApiKey = async (description: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate a random API key (in a real app, use a more secure method)
      const apiKey = 'sk_' + Array(40)
        .fill(0)
        .map(() => Math.round(Math.random() * 35).toString(36))
        .join('');

      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          key: apiKey,
          description,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

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
          email,
          role,
          status: 'invited',
          created_at: new Date().toISOString()
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

  // Security settings
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

      // Update other security settings
      const { error } = await supabase
        .from('security_settings')
        .upsert({
          user_id: user.id,
          two_factor_enabled: securityData.twoFactorEnabled,
          session_timeout: securityData.sessionTimeout,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

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

  return {
    activeTab,
    setActiveTab,
    isLoading,
    updateProfile,
    updatePaymentMethod,
    updateNotificationPreferences,
    generateApiKey,
    addTeamMember,
    updateSecuritySettings
  };
}
