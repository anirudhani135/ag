import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, Bell, Key, Shield, Plus, Copy, HelpCircle, Users, Globe, Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ApiKey {
  id: string;
  description: string;
  key: string;
  created_at: string;
}

interface TeamMember {
  id: string;
  email: string;
  role: string;
  status: string;
}

const DeveloperSettings = () => {
  const { toast } = useToast();
  const {
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
  } = useSettings();

  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    company: "TechInnovate",
    website: "https://techinnovate.com",
    bio: "AI developer specializing in conversational agents and natural language processing."
  });

  const [paymentData, setPaymentData] = useState({
    cardName: "Alex Johnson",
    cardNumber: "•••• •••• •••• 4242",
    expiryDate: "12/25",
    cvv: "•••"
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    agentUpdates: true,
    revenueAlerts: true,
    marketingUpdates: false
  });

  const [newTeamMemberData, setNewTeamMemberData] = useState({
    email: "",
    role: "developer"
  });

  const [securityData, setSecurityData] = useState({
    twoFactorEnabled: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    sessionTimeout: "60"
  });

  const [newApiKeyDescription, setNewApiKeyDescription] = useState("");
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (userData && !isLoadingUser) {
    if (profileData.name !== userData.name && userData.name) {
      setProfileData(prev => ({
        ...prev,
        name: userData.name || prev.name,
        email: userData.email || prev.email,
        company: userData.company || prev.company,
        website: userData.website || prev.website,
        bio: userData.bio || prev.bio
      }));
    }
  }

  const { data: apiKeys, isLoading: isLoadingApiKeys } = useQuery({
    queryKey: ['api-keys'],
    queryFn: getApiKeys
  });

  const { data: teamMembers, isLoading: isLoadingTeamMembers } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map((member: any) => ({
        id: member.id,
        email: member.user_id,
        role: member.role,
        status: 'active'
      })) as TeamMember[];
    }
  });

  const { data: securitySettings, isLoading: isLoadingSecuritySettings } = useQuery({
    queryKey: ['security-settings'],
    queryFn: getSecuritySettings
  });

  if (securitySettings && !isLoadingSecuritySettings) {
    if (securityData.twoFactorEnabled !== securitySettings.two_factor_enabled) {
      setSecurityData(prev => ({
        ...prev,
        twoFactorEnabled: securitySettings.two_factor_enabled,
        sessionTimeout: securitySettings.session_timeout
      }));
    }
  }

  const { data: notificationPrefs, isLoading: isLoadingNotificationPrefs } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  if (notificationPrefs && !isLoadingNotificationPrefs) {
    if ((notificationPrefs.preferences && typeof notificationPrefs.preferences === 'object') || 
        (notificationPrefs.email_notifications !== undefined)) {
      
      const prefsObj = notificationPrefs.preferences ? 
        (typeof notificationPrefs.preferences === 'object' ? notificationPrefs.preferences : {}) : 
        {
          emailNotifications: notificationPrefs.email_notifications || false,
          agentUpdates: true,
          revenueAlerts: true,
          marketingUpdates: false
        };
      
      if (notificationPreferences.emailNotifications !== (prefsObj.emailNotifications ?? notificationPrefs.email_notifications)) {
        setNotificationPreferences(prev => ({
          ...prev,
          emailNotifications: prefsObj.emailNotifications ?? notificationPrefs.email_notifications ?? prev.emailNotifications,
          agentUpdates: prefsObj.agentUpdates ?? prev.agentUpdates,
          revenueAlerts: prefsObj.revenueAlerts ?? prev.revenueAlerts,
          marketingUpdates: prefsObj.marketingUpdates ?? prev.marketingUpdates
        }));
      }
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPaymentData(prev => ({ ...prev, [id]: value }));
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotificationPreferences(prev => ({ ...prev, [key]: checked }));
  };

  const handleTeamMemberChange = (key: string, value: string) => {
    setNewTeamMemberData(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSecurityData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveProfile = () => {
    updateProfile(profileData);
  };

  const handleSavePayment = () => {
    updatePaymentMethod(paymentData);
  };

  const handleSaveNotifications = () => {
    updateNotificationPreferences(notificationPreferences);
  };

  const handleGenerateApiKey = async () => {
    if (!newApiKeyDescription) {
      toast({
        title: "Description required",
        description: "Please provide a description for the API key.",
        variant: "destructive"
      });
      return;
    }

    const apiKey = await generateApiKey(newApiKeyDescription);
    if (apiKey) {
      setGeneratedApiKey(apiKey);
      setNewApiKeyDescription("");
    }
  };

  const handleSaveTeamMember = () => {
    if (!newTeamMemberData.email) {
      toast({
        title: "Email required",
        description: "Please provide an email address for the team member.",
        variant: "destructive"
      });
      return;
    }

    addTeamMember(newTeamMemberData.email, newTeamMemberData.role);
    setNewTeamMemberData({ email: "", role: "developer" });
  };

  const handleSaveSecuritySettings = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive"
      });
      return;
    }

    updateSecuritySettings(securityData);
    setSecurityData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 h-auto p-1">
            <TabsTrigger value="profile" className="flex items-center data-[state=active]:text-primary-foreground bg-slate-50">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center data-[state=active]:text-primary-foreground bg-slate-100">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Payment</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center data-[state=active]:text-primary-foreground bg-slate-100">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center data-[state=active]:text-primary-foreground bg-slate-100">
              <Key className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center data-[state=active]:text-primary-foreground bg-slate-100">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center data-[state=active]:text-primary-foreground bg-slate-100">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your developer profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingUser ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={profileData.name} 
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={profileData.email} 
                          onChange={handleProfileChange}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input 
                          id="company" 
                          value={profileData.company} 
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          value={profileData.website} 
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={profileData.bio} 
                        onChange={handleProfileChange}
                        rows={4} 
                      />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isLoading || isLoadingUser}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input 
                      id="cardName" 
                      value={paymentData.cardName} 
                      onChange={handlePaymentChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      value={paymentData.cardNumber} 
                      onChange={handlePaymentChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input 
                      id="expiryDate" 
                      value={paymentData.expiryDate} 
                      onChange={handlePaymentChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv" 
                      value={paymentData.cvv} 
                      onChange={handlePaymentChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSavePayment}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Payment Method"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingNotificationPrefs ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications for important updates
                        </p>
                      </div>
                      <Switch 
                        checked={notificationPreferences.emailNotifications} 
                        onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Agent Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when your agents receive updates or reviews
                        </p>
                      </div>
                      <Switch 
                        checked={notificationPreferences.agentUpdates} 
                        onCheckedChange={(checked) => handleNotificationChange('agentUpdates', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Revenue Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications for significant revenue changes
                        </p>
                      </div>
                      <Switch 
                        checked={notificationPreferences.revenueAlerts} 
                        onCheckedChange={(checked) => handleNotificationChange('revenueAlerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Marketing Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive marketing and promotional information
                        </p>
                      </div>
                      <Switch 
                        checked={notificationPreferences.marketingUpdates} 
                        onCheckedChange={(checked) => handleNotificationChange('marketingUpdates', checked)}
                      />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveNotifications}
                  disabled={isLoading || isLoadingNotificationPrefs}
                >
                  {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for integrating with the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedApiKey && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">New API Key Created</h4>
                    <p className="text-sm text-yellow-800 mb-2">
                      Please copy your API key now. For security reasons, it won't be shown again.
                    </p>
                    <div className="flex items-center">
                      <Input value={generatedApiKey} readOnly className="font-mono text-sm bg-white" />
                      <Button 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => copyToClipboard(generatedApiKey, 'new-key')}
                      >
                        {copiedKeyId === 'new-key' ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Generate New API Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="API Key Description" 
                      value={newApiKeyDescription}
                      onChange={(e) => setNewApiKeyDescription(e.target.value)}
                      className="flex-1" 
                    />
                    <Button 
                      variant="secondary"
                      onClick={handleGenerateApiKey}
                      disabled={isLoading || !newApiKeyDescription}
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Your API Keys</Label>
                  {isLoadingApiKeys ? (
                    <div className="space-y-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : apiKeys && apiKeys.length > 0 ? (
                    <div className="space-y-2">
                      {apiKeys.map((key: ApiKey) => (
                        <div key={key.id} className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">{key.description}</span>
                            <Badge variant="outline">{new Date(key.created_at).toLocaleDateString()}</Badge>
                          </div>
                          <div className="flex items-center">
                            <code className="bg-muted p-1 rounded text-xs flex-1 truncate">
                              {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(key.key, key.id)}
                              className="ml-2"
                            >
                              {copiedKeyId === key.id ? 'Copied!' : 'Copy'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md text-muted-foreground">
                      No API keys found. Generate your first API key to get started.
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>API Usage</Label>
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Current Month</span>
                      <Badge variant="outline">1,243 / 10,000</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "12.4%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      12.4% of your monthly API calls used
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Add and manage team members who can access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingTeamMembers ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{profileData.name} (You)</p>
                          <p className="text-sm text-muted-foreground">{profileData.email}</p>
                        </div>
                        <Badge className="rounded-md bg-slate-300">Owner</Badge>
                      </div>
                    </div>
                    
                    {teamMembers && teamMembers.map((member: TeamMember) => (
                      <div key={member.id} className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{member.email}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.status === 'invited' ? 'Invitation sent' : 'Active'}
                            </p>
                          </div>
                          <Badge variant="outline">{member.role}</Badge>
                        </div>
                      </div>
                    ))}

                    <div className="space-y-2">
                      <Label>Add Team Member</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="md:col-span-1">
                          <Input 
                            placeholder="Email Address" 
                            value={newTeamMemberData.email}
                            onChange={(e) => handleTeamMemberChange('email', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-1">
                          <Select 
                            value={newTeamMemberData.role}
                            onValueChange={(value) => handleTeamMemberChange('role', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="developer">Developer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-1">
                          <Button 
                            className="w-full" 
                            onClick={handleSaveTeamMember}
                            disabled={isLoading || !newTeamMemberData.email}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {isLoading ? "Adding..." : "Add"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingSecuritySettings ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch 
                        checked={securityData.twoFactorEnabled}
                        onCheckedChange={(checked) => setSecurityData(prev => ({ ...prev, twoFactorEnabled: checked }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Change Password</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <Input 
                          type="password" 
                          placeholder="Current Password" 
                          id="currentPassword"
                          value={securityData.currentPassword}
                          onChange={handleSecurityChange}
                        />
                        <Input 
                          type="password" 
                          placeholder="New Password" 
                          id="newPassword"
                          value={securityData.newPassword}
                          onChange={handleSecurityChange}
                        />
                        <Input 
                          type="password" 
                          placeholder="Confirm New Password" 
                          id="confirmPassword"
                          value={securityData.confirmPassword}
                          onChange={handleSecurityChange}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Session Timeout</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically log out after period of inactivity
                        </p>
                      </div>
                      <Select 
                        value={securityData.sessionTimeout}
                        onValueChange={(value) => setSecurityData(prev => ({ ...prev, sessionTimeout: value }))}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                          <SelectItem value="720">12 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveSecuritySettings}
                  disabled={isLoading || isLoadingSecuritySettings}
                >
                  {isLoading ? "Saving..." : "Save Security Settings"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperSettings;

