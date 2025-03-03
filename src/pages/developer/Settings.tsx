
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";

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

  const handleGenerateNewKey = () => {
    toast({
      title: "Coming Soon",
      description: "API key generation will be available soon",
    });
  };

  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen space-y-8 p-8 pt-20 pb-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Developer Settings</h2>
          <p className="mt-2 text-muted-foreground">Manage your developer account settings</p>
        </div>

        {/* API Keys */}
        <Card className="p-8 bg-card shadow-md">
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
                  className="bg-gray-50"
                />
                <Button 
                  variant="outline" 
                  className="bg-white hover:bg-gray-100 text-gray-700 border-gray-200"
                  onClick={handleCopyApiKey}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {isCopied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleGenerateNewKey}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Generate New Key
            </Button>
          </div>
        </Card>

        {/* Webhook Settings */}
        <Card className="p-8 bg-card shadow-md">
          <h3 className="text-xl font-semibold mb-6">Webhook Settings</h3>
          <p className="text-muted-foreground mb-4">
            Webhook settings moved to API & Integrations. Please visit the API & Integrations page to manage your webhooks.
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => window.location.href = "/developer/api"}
          >
            Go to API & Integrations
          </Button>
        </Card>

        {/* Profile Settings */}
        <Card className="p-8 bg-card shadow-md">
          <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Developer" 
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="john@example.com" 
                className="bg-background"
              />
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => toast({
                title: "Coming Soon",
                description: "Profile updates will be available soon",
              })}
            >
              Save Profile
            </Button>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-8 bg-card shadow-md">
          <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
          <p className="text-muted-foreground">
            Notification settings coming soon...
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperSettings;
