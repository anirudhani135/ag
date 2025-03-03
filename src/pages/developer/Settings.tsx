
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Save, Key, User, CreditCard, Shield, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DeveloperSettings = () => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyApiKey = () => {
    // This would copy the API key to clipboard in a real implementation
    navigator.clipboard.writeText("••••••••••••••••");
    setIsCopied(true);
    toast({
      title: "API Key Copied",
      description: "API key has been copied to clipboard",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Saved",
      description: "Your profile information has been updated",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated",
    });
  };

  const handleSaveBilling = () => {
    toast({
      title: "Billing Information Saved",
      description: "Your billing information has been updated",
    });
  };

  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen p-6 pt-20 pb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Developer Settings</h2>
          <p className="mt-2 text-muted-foreground">Manage your developer account settings</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="profile" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Developer" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input id="company" placeholder="Acme Inc." className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" placeholder="Tell us about yourself" className="bg-background" />
                </div>
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-primary hover:bg-primary/90 text-white mt-2"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">API Keys</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type="password"
                      value="••••••••••••••••"
                      readOnly
                      className="bg-muted/30 font-mono"
                    />
                    <Button 
                      variant="outline" 
                      className="bg-white hover:bg-muted/50 text-foreground border-border"
                      onClick={handleCopyApiKey}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {isCopied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Keep this key secure. Do not share it in public repositories or client-side code.
                  </p>
                </div>
                
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white mt-2"
                  onClick={() => toast({
                    title: "New API Key Generated",
                    description: "Your new API key has been generated successfully"
                  })}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Generate New Key
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select
                    id="paymentMethod"
                    className="w-full bg-background border border-input rounded-md h-10 px-3"
                  >
                    <option value="paypal">PayPal</option>
                    <option value="creditCard">Credit Card</option>
                    <option value="bankTransfer">Bank Transfer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID/VAT Number (optional)</Label>
                  <Input id="taxId" placeholder="Enter your Tax ID" className="bg-background" />
                </div>
                <Button 
                  onClick={handleSaveBilling}
                  className="bg-primary hover:bg-primary/90 text-white mt-2"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Billing Information
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4 max-w-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Agent Updates</h4>
                    <p className="text-sm text-muted-foreground">Updates about your agents</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Payment Notifications</h4>
                    <p className="text-sm text-muted-foreground">Updates about payments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <Button 
                  onClick={handleSaveNotifications}
                  className="bg-primary hover:bg-primary/90 text-white mt-2"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div className="space-y-4 max-w-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Password</h4>
                  <Button variant="outline" className="w-full">Change Password</Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Sessions</h4>
                  <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                    Sign Out All Devices
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperSettings;
