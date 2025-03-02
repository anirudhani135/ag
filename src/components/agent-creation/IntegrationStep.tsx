
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe, Share2, Key, RefreshCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const integrationSchema = z.object({
  enableWebhook: z.boolean().default(false),
  webhookUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
  webhookEvents: z.array(z.string()).default([]),
  apiKey: z.string().optional(),
  enableRateLimit: z.boolean().default(true),
  rateLimitPerMinute: z.number().min(1).max(1000).default(60),
  authType: z.enum(["none", "basic", "bearer", "api_key"]).default("none"),
  authDetails: z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    token: z.string().optional(),
    headerName: z.string().optional(),
  }).optional(),
});

type IntegrationFormValues = z.infer<typeof integrationSchema>;

interface IntegrationStepProps {
  onSave: (data: IntegrationFormValues) => void;
  initialData?: Partial<IntegrationFormValues>;
}

const webhookEvents = [
  { id: "message.created", label: "Message Created" },
  { id: "message.completed", label: "Message Completed" },
  { id: "agent.deployed", label: "Agent Deployed" },
  { id: "agent.updated", label: "Agent Updated" },
  { id: "error.occurred", label: "Error Occurred" },
];

export const IntegrationStep = ({ onSave, initialData }: IntegrationStepProps) => {
  const [selectedTab, setSelectedTab] = useState("webhooks");
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const defaultValues: Partial<IntegrationFormValues> = {
    enableWebhook: false,
    webhookEvents: [],
    enableRateLimit: true,
    rateLimitPerMinute: 60,
    authType: "none",
    ...initialData
  };

  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchAuthType = form.watch("authType");
  const watchEnableWebhook = form.watch("enableWebhook");

  const handleSubmit = (data: IntegrationFormValues) => {
    onSave(data);
  };

  const testWebhook = () => {
    const webhookUrl = form.getValues("webhookUrl");
    
    // Simulate testing webhook
    setTestResult(null);
    setTimeout(() => {
      if (webhookUrl) {
        setTestResult({
          success: true,
          message: "Successfully connected to webhook endpoint!"
        });
      } else {
        setTestResult({
          success: false,
          message: "Webhook URL is required for testing."
        });
      }
    }, 1500);
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <TabsContent value="webhooks" className="space-y-6">
                <FormField
                  control={form.control}
                  name="enableWebhook"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Webhooks</FormLabel>
                        <FormDescription>
                          Send event notifications to your systems
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchEnableWebhook && (
                  <>
                    <FormField
                      control={form.control}
                      name="webhookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Webhook URL</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input {...field} placeholder="https://example.com/webhook" />
                            </FormControl>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={testWebhook}
                              className="flex-shrink-0"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Test
                            </Button>
                          </div>
                          <FormMessage />
                          {testResult && (
                            <div className={`mt-2 text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                              {testResult.message}
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <Label className="text-base">Webhook Events</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Select which events should trigger webhook notifications
                      </p>
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="webhookEvents"
                          render={() => (
                            <FormItem>
                              {webhookEvents.map((event) => (
                                <FormField
                                  key={event.id}
                                  control={form.control}
                                  name="webhookEvents"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={event.id}
                                        className="flex flex-row items-start space-x-3 space-y-0 p-2 rounded-md hover:bg-muted/30"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(event.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, event.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== event.id
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          {event.label}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="authType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Authentication Type</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select authentication type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Authentication</SelectItem>
                              <SelectItem value="basic">Basic Auth</SelectItem>
                              <SelectItem value="bearer">Bearer Token</SelectItem>
                              <SelectItem value="api_key">API Key</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select how your webhook endpoint authenticates requests
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchAuthType === "basic" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="authDetails.username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="authDetails.password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {watchAuthType === "bearer" && (
                      <FormField
                        control={form.control}
                        name="authDetails.token"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bearer Token</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {watchAuthType === "api_key" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="authDetails.headerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Header Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="X-API-Key" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="authDetails.token"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Key</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="api" className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-md mb-4 border border-blue-100">
                  <p className="text-blue-800 text-sm">
                    Your agent will be accessible via API once deployed. Configure API-specific settings here.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="Enter API key if you have one already" />
                      </FormControl>
                      <FormDescription>
                        Leave blank to generate a new API key during deployment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableRateLimit"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Rate Limiting</FormLabel>
                        <FormDescription>
                          Restrict API usage to prevent abuse
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("enableRateLimit") && (
                  <FormField
                    control={form.control}
                    name="rateLimitPerMinute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate Limit (requests per minute)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of API requests allowed per minute
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="space-y-3">
                  <h4 className="text-base font-medium">API Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Add custom documentation for your API endpoints
                  </p>
                  <Textarea 
                    placeholder="# Example API Usage
POST /api/v1/agents/{agent_id}/chat
Content-Type: application/json

{
  \"message\": \"Hello, agent!\"
}
"
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>
              </TabsContent>

              <TabsContent value="external" className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-md mb-4 border border-amber-100">
                  <p className="text-amber-800 text-sm">
                    External service integration is coming soon. This will allow your agent to connect with third-party services.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base font-medium">Coming Soon</h4>
                  <p className="text-sm text-muted-foreground">
                    Support for integrating with external services like:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Database connectors</li>
                    <li>Third-party APIs</li>
                    <li>External AI services</li>
                    <li>Authentication providers</li>
                    <li>Storage solutions</li>
                  </ul>
                </div>
              </TabsContent>

              <div className="pt-4">
                <Button type="submit" className="w-full md:w-auto">
                  Save Integration Settings
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </div>
    </Card>
  );
};
