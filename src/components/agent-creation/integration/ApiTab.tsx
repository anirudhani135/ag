
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
}"
            className="min-h-[150px] font-mono text-sm"
          />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full md:w-auto">
            Save API Settings
          </Button>
        </div>
      </form>
    </Form>
  );
};
