
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
import { useToast } from "@/components/ui/use-toast";
import { User, CreditCard, Bell, Key, Shield, Plus, Save, HelpCircle, Users, Globe, Database } from "lucide-react";

const DeveloperSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
      variant: "default",
    });
  };

  const handleSavePayment = () => {
    toast({
      title: "Payment information updated",
      description: "Your payment details have been saved successfully.",
      variant: "default",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been saved successfully.",
      variant: "default",
    });
  };

  const handleGenerateApiKey = () => {
    toast({
      title: "New API key generated",
      description: "Your new API key has been generated. Keep it secure!",
      variant: "default",
    });
  };

  const handleSaveTeamMember = () => {
    toast({
      title: "Team member added",
      description: "The new team member has been added successfully.",
      variant: "default",
    });
  };

  const handleSaveSecuritySettings = () => {
    toast({
      title: "Security settings updated",
      description: "Your security settings have been updated successfully.",
      variant: "default",
    });
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

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 h-auto p-1">
            <TabsTrigger value="profile" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Payment</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Key className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Alex Johnson" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="alex@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue="TechInnovate" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://techinnovate.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    defaultValue="AI developer specializing in conversational agents and natural language processing."
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
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
                    <Input id="cardName" defaultValue="Alex Johnson" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" defaultValue="•••• •••• •••• 4242" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" defaultValue="12/25" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" defaultValue="•••" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePayment}>Save Payment Method</Button>
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
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Agent Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when your agents receive updates or reviews
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Revenue Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for significant revenue changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive marketing and promotional information
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotifications}>Save Preferences</Button>
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
                <div className="space-y-2">
                  <Label>Current API Key</Label>
                  <div className="flex items-center">
                    <Input
                      value="sk_live_7h4j5k6l7j8k9l0j1k2l3k4j5k6l7j8k"
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" className="ml-2">
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This key grants full access to your account. Keep it secure!
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>API Usage</Label>
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Current Month</span>
                      <Badge variant="outline">1,243 / 10,000</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: "12.4%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      12.4% of your monthly API calls used
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Webhooks</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://your-app.com/webhooks"
                      className="flex-1"
                    />
                    <Button variant="outline">Set URL</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleGenerateApiKey}>Generate New API Key</Button>
              </CardFooter>
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
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Alex Johnson (You)</p>
                        <p className="text-sm text-muted-foreground">alex@example.com</p>
                      </div>
                      <Badge>Owner</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sarah Adams</p>
                        <p className="text-sm text-muted-foreground">sarah@example.com</p>
                      </div>
                      <Badge variant="outline">Developer</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Add Team Member</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="md:col-span-1">
                        <Input placeholder="Email Address" />
                      </div>
                      <div className="md:col-span-1">
                        <Select defaultValue="developer">
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
                        <Button className="w-full" onClick={handleSaveTeamMember}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
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
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="space-y-2">
                  <Label>Change Password</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Input type="password" placeholder="Current Password" />
                    <Input type="password" placeholder="New Password" />
                    <Input type="password" placeholder="Confirm New Password" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after period of inactivity
                    </p>
                  </div>
                  <Select defaultValue="60">
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
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSecuritySettings}>Save Security Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperSettings;
