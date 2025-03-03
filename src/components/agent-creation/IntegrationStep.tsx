
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, Key, Globe } from "lucide-react";
import { WebhooksTab } from "./integration/WebhooksTab";
import { ApiTab } from "./integration/ApiTab";
import { ExternalServicesTab } from "./integration/ExternalServicesTab";
import { IntegrationFormValues, WebhookTabData, ApiTabData } from "./integration/types";

interface IntegrationStepProps {
  onSave: (data: IntegrationFormValues) => void;
  initialData?: Partial<IntegrationFormValues>;
}

export const IntegrationStep = ({ onSave, initialData }: IntegrationStepProps) => {
  const [selectedTab, setSelectedTab] = useState("webhooks");

  // Handle saving data from individual tabs
  const handleWebhookSave = (data: WebhookTabData) => {
    onSave({
      ...initialData as IntegrationFormValues,
      ...data
    });
  };

  const handleApiSave = (data: ApiTabData) => {
    onSave({
      ...initialData as IntegrationFormValues,
      ...data
    });
  };

  // Extract data for individual tabs
  const webhookTabData: Partial<WebhookTabData> = {
    enableWebhook: initialData?.enableWebhook ?? false,
    webhookUrl: initialData?.webhookUrl,
    webhookEvents: initialData?.webhookEvents ?? [],
    authType: initialData?.authType ?? "none",
    authDetails: initialData?.authDetails,
  };

  const apiTabData: Partial<ApiTabData> = {
    apiKey: initialData?.apiKey,
    enableRateLimit: initialData?.enableRateLimit ?? true,
    rateLimitPerMinute: initialData?.rateLimitPerMinute ?? 60,
  };

  return (
    <Card className="bg-white shadow-lg rounded-xl overflow-hidden border-0">
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Integration Options</h3>
          <p className="text-muted-foreground">
            Configure how your agent interacts with external services and systems.
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 gap-4 bg-muted/30 p-1">
            <TabsTrigger value="webhooks" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Share2 className="h-4 w-4 mr-2" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Key className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger value="external" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Globe className="h-4 w-4 mr-2" />
              External Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webhooks" className="space-y-6">
            <WebhooksTab 
              initialData={webhookTabData} 
              onSave={handleWebhookSave} 
            />
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <ApiTab 
              initialData={apiTabData} 
              onSave={handleApiSave} 
            />
          </TabsContent>

          <TabsContent value="external" className="space-y-6">
            <ExternalServicesTab />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
