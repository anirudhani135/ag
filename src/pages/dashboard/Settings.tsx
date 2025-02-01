import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { User, Settings as SettingsIcon, Bell } from 'lucide-react';

interface Profile {
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  notification_settings: {
    email_notifications: boolean;
    push_notifications: boolean;
  } | null;
}

export const Settings = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: Partial<Profile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your profile settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      updateProfile.mutate(profile);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={profile?.name || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev!, name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Company</label>
                <Input
                  value={profile?.company || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev!, company: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Website</label>
                <Input
                  value={profile?.website || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev!, website: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Button
                  type="button"
                  variant={profile?.notification_settings?.email_notifications ? "default" : "outline"}
                  onClick={() => setProfile(prev => ({
                    ...prev!,
                    notification_settings: {
                      ...prev!.notification_settings!,
                      email_notifications: !prev!.notification_settings?.email_notifications
                    }
                  }))}
                >
                  {profile?.notification_settings?.email_notifications ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
                <Button
                  type="button"
                  variant={profile?.notification_settings?.push_notifications ? "default" : "outline"}
                  onClick={() => setProfile(prev => ({
                    ...prev!,
                    notification_settings: {
                      ...prev!.notification_settings!,
                      push_notifications: !prev!.notification_settings?.push_notifications
                    }
                  }))}
                >
                  {profile?.notification_settings?.push_notifications ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};