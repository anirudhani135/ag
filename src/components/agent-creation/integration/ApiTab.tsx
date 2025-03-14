
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormGuidance } from "../FormGuidance";
import { Info, Shield, Key } from "lucide-react";

const apiSchema = z.object({
  apiKey: z.string().optional(),
  enableRateLimit: z.boolean().default(true),
  rateLimitPerMinute: z.number().min(1).max(1000).default(60),
});

export type ApiFormValues = z.infer<typeof apiSchema>;

interface ApiTabProps {
  initialData?: Partial<ApiFormValues>;
  onSave: (data: ApiFormValues) => void;
}

export const ApiTab = ({ initialData, onSave }: ApiTabProps) => {
  const defaultValues: Partial<ApiFormValues> = {
    enableRateLimit: true,
    rateLimitPerMinute: 60,
    ...initialData
  };

  const form = useForm<ApiFormValues>({
    resolver: zodResolver(apiSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = (data: ApiFormValues) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md mb-4 border border-blue-100 dark:border-blue-900">
          <div className="flex gap-2">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">API Access Information</p>
              <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
                Your agent will be accessible via API once deployed. API keys provide secure access to your agent's functionality.
              </p>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>API Key</FormLabel>
                <FormGuidance
                  fieldName="API Key"
                  title="API Key Configuration"
                  description="Provide an API key if you have one already, or leave it blank to generate a new one."
                  bestPractices={[
                    "Use a unique key for each agent",
                    "Store keys securely and never expose them in client-side code",
                    "Rotate keys periodically for enhanced security"
                  ]}
                />
              </div>
              <FormControl>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    {...field} 
                    type="password" 
                    className="pl-9"
                    placeholder="Enter API key or leave blank to generate one automatically" 
                  />
                </div>
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
                <div className="flex items-center">
                  <FormLabel className="text-base">Enable Rate Limiting</FormLabel>
                  <FormGuidance
                    fieldName="Rate Limiting"
                    title="Rate Limiting"
                    description="Restricts the number of API requests that can be made in a given time period to prevent abuse."
                    bestPractices={[
                      "Set reasonable limits based on expected usage",
                      "Consider separate limits for different endpoints",
                      "Implement exponential backoff in your client applications"
                    ]}
                  />
                </div>
                <FormDescription>
                  Restrict API usage to prevent abuse and control costs
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
                <div className="flex items-center">
                  <FormLabel>Rate Limit (requests per minute)</FormLabel>
                  <FormGuidance
                    fieldName="Rate Limit Value"
                    title="Rate Limit Configuration"
                    description="Maximum number of API requests allowed per minute."
                    examples={[
                      "60 (1 request per second)",
                      "300 (5 requests per second)",
                      "600 (10 requests per second)"
                    ]}
                  />
                </div>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    max="1000"
                    placeholder="e.g., 60"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Recommended: 60 requests per minute for most use cases
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Alert className="bg-muted">
          <Info className="h-4 w-4" />
          <AlertTitle>API Documentation</AlertTitle>
          <AlertDescription>
            Add custom documentation for your API endpoints to help developers integrate with your agent
          </AlertDescription>
        </Alert>

        <Textarea 
          placeholder={`# Example API Usage
POST /api/v1/agents/{agent_id}/chat
Content-Type: application/json

{
  "message": "Hello, agent!"
}

# Response Format
{
  "id": "msg_123",
  "response": "Hello! How can I assist you today?",
  "created_at": "2023-09-15T14:23:10Z"
}`}
          className="min-h-[200px] font-mono text-sm"
        />

        <div className="pt-4">
          <Button type="submit" className="w-full md:w-auto">
            Save API Settings
          </Button>
        </div>
      </form>
    </Form>
  );
};
