
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useSettings, ApiKey } from "@/hooks/useSettings";
import { TeamSection } from "@/components/settings/TeamSection";
import { ApiKeysSection } from "@/components/settings/ApiKeysSection";
import { NotificationPreferencesSection } from "@/components/settings/NotificationPreferencesSection";
import { supabase } from "@/integrations/supabase/client";

const DeveloperSettings = () => {
  const { toast } = useToast();
  const { apiKeys, isLoadingApiKeys } = useSettings();
  const [activeTab, setActiveTab] = useState("account");
  
  // Profile state
  const [name, setName] = useState("John Developer");
  const [email, setEmail] = useState("john@example.com");
  const [company, setCompany] = useState("Dev Company");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    setIsEditingProfile(true);
    try {
      // Here would be the actual profile update logic
      setTimeout(() => {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
        setIsEditingProfile(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      setIsEditingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      // Here would be the actual password change logic
      setTimeout(() => {
        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsChangingPassword(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
      setIsChangingPassword(false);
    }
  };

  const handleCreateApiKey = async (name: string) => {
    // Implementation for creating API key would go here
    console.log(`Creating API key: ${name}`);
    // This would normally call an API or database function
  };

  const handleRevokeApiKey = async (id: string) => {
    // Implementation for revoking API key would go here
    console.log(`Revoking API key: ${id}`);
    // This would normally call an API or database function
  };

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                    onClick={handleUpdateProfile}
                    disabled={isEditingProfile}
                  >
                    {isEditingProfile ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Two-factor authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <Switch
                    checked={isTwoFactorEnabled}
                    onCheckedChange={setIsTwoFactorEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team">
            <TeamSection />
          </TabsContent>
          
          <TabsContent value="api-keys">
            <ApiKeysSection 
              apiKeys={apiKeys} 
              isLoading={isLoadingApiKeys}
              onCreateKey={handleCreateApiKey}
              onRevokeKey={handleRevokeApiKey}
            />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationPreferencesSection />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperSettings;
