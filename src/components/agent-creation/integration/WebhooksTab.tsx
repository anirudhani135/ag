import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const webhookSchema = z.object({
  enableWebhook: z.boolean().default(false),
  webhookUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
  webhookEvents: z.array(z.string()).default([]),
  authType: z.enum(["none", "basic", "bearer", "api_key"]).default("none"),
  authDetails: z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    token: z.string().optional(),
    headerName: z.string().optional(),
  }).optional(),
});

export type WebhookFormValues = z.infer<typeof webhookSchema>;

const webhookEvents = [
  { id: "message.created", label: "Message Created" },
  { id: "message.completed", label: "Message Completed" },
  { id: "agent.deployed", label: "Agent Deployed" },
  { id: "agent.updated", label: "Agent Updated" },
  { id: "error.occurred", label: "Error Occurred" },
];

interface WebhooksTabProps {
  initialData?: Partial<WebhookFormValues>;
  onSave: (data: WebhookFormValues) => void;
}

export const WebhooksTab = ({ initialData, onSave }: WebhooksTabProps) => {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const defaultValues: Partial<WebhookFormValues> = {
    enableWebhook: false,
    webhookEvents: [],
    authType: "none",
    ...initialData
  };

  const form = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchAuthType = form.watch("authType");
  const watchEnableWebhook = form.watch("enableWebhook");

  const handleSubmit = (data: WebhookFormValues) => {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  className="data-[state=checked]:bg-primary"
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
                      className="flex-shrink-0 bg-background hover:bg-muted/50 text-foreground"
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

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white"
          >
            Save Webhook Settings
          </Button>
        </div>
      </form>
    </Form>
  );
};
