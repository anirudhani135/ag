
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DeveloperSettings = () => {
  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Developer Settings</h2>

        {/* API Keys */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">API Keys</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value="••••••••••••••••"
                readOnly
              />
            </div>
            <Button variant="outline" className="bg-background text-foreground">Generate New Key</Button>
          </div>
        </Card>

        {/* Webhook Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Webhook Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-domain.com/webhook"
              />
            </div>
            <Button className="bg-primary text-primary-foreground">Save Webhook</Button>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6">
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
