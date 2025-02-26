import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DeveloperSettings = () => {
  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen space-y-8 p-8 pt-16 pb-16">
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
                >
                  Copy
                </Button>
              </div>
            </div>
            <Button 
              variant="secondary"
              className="bg-primary/10 hover:bg-primary/20 text-primary"
            >
              Generate New Key
            </Button>
          </div>
        </Card>

        {/* Webhook Settings */}
        <Card className="p-8 bg-card shadow-md">
          <h3 className="text-xl font-semibold mb-6">Webhook Settings</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-domain.com/webhook"
                className="w-full bg-background border-input"
              />
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6"
            >
              Save Webhook
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
