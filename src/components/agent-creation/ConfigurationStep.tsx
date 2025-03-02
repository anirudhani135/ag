
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Info, Upload, Code, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const configSchema = z.object({
  model: z.string().min(1, "Please select a model"),
  maxTokens: z.number().min(1).max(8192),
  temperature: z.number().min(0).max(2),
  systemPrompt: z.string().min(10, "System prompt must be at least 10 characters"),
  apiEndpoint: z.string().optional(),
  enableLogging: z.boolean().default(true),
  enableMetrics: z.boolean().default(true),
  enableRateLimiting: z.boolean().default(false),
  requestsPerMinute: z.number().min(1).max(1000).optional(),
});

type ConfigFormValues = z.infer<typeof configSchema>;

interface ConfigurationStepProps {
  onSave: (data: ConfigFormValues) => void;
  initialData?: Partial<ConfigFormValues>;
}

export const ConfigurationStep = ({ onSave, initialData }: ConfigurationStepProps) => {
  const [selectedTab, setSelectedTab] = useState("models");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const defaultValues: Partial<ConfigFormValues> = {
    model: "gpt-4o",
    maxTokens: 4096,
    temperature: 0.7,
    systemPrompt: "You are a helpful AI assistant.",
    apiEndpoint: "",
    enableLogging: true,
    enableMetrics: true,
    enableRateLimiting: false,
    requestsPerMinute: 60,
    ...initialData
  };

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = (data: ConfigFormValues) => {
    onSave(data);
    toast({
      title: "Configuration saved",
      description: "Your agent configuration has been saved successfully.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Configuration imported",
        description: `Successfully imported configuration from ${file.name}`,
      });

      // Mock imported data
      form.reset({
        ...form.getValues(),
        systemPrompt: "Imported system prompt from file.",
      });
    }, 1500);
  };

  return (
    <Card className="bg-white shadow-lg rounded-xl overflow-hidden border-0">
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Agent Configuration</h3>
          <p className="text-muted-foreground">
            Configure your agent's capabilities, model settings, and runtime behavior.
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-4 bg-muted/30 p-1">
            <TabsTrigger value="models" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Settings className="h-4 w-4 mr-2" />
              Model
            </TabsTrigger>
            <TabsTrigger value="prompts" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Code className="h-4 w-4 mr-2" />
              Prompts
            </TabsTrigger>
            <TabsTrigger value="runtime" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Info className="h-4 w-4 mr-2" />
              Runtime
            </TabsTrigger>
            <TabsTrigger value="import" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <TabsContent value="models" className="space-y-6">
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <select
                        className="w-full border border-gray-300 rounded-md p-2"
                        {...field}
                      >
                        <option value="">Select a model</option>
                        <option value="gpt-4o">GPT-4o</option>
                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                        <option value="claude-3-opus">Claude 3 Opus</option>
                        <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                        <option value="claude-3-haiku">Claude 3 Haiku</option>
                        <option value="gemini-pro">Gemini Pro</option>
                        <option value="gemini-flash">Gemini Flash</option>
                      </select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="maxTokens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Tokens</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          Maximum number of tokens to generate
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            max="2"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Controls randomness (0-2)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="apiEndpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom API Endpoint (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://api.example.com/v1" />
                      </FormControl>
                      <FormDescription>
                        Enter a custom API endpoint if you're using a proxy
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="prompts" className="space-y-6">
                <FormField
                  control={form.control}
                  name="systemPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={8}
                          className="min-h-[200px] font-mono text-sm"
                          placeholder="You are a helpful AI assistant..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Define your agent's behavior and capabilities
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="runtime" className="space-y-6">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="enableLogging"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Logging</FormLabel>
                          <FormDescription>
                            Record all interactions for analysis
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

                  <FormField
                    control={form.control}
                    name="enableMetrics"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Metrics</FormLabel>
                          <FormDescription>
                            Collect performance and usage metrics
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

                  <FormField
                    control={form.control}
                    name="enableRateLimiting"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Rate Limiting</FormLabel>
                          <FormDescription>
                            Restrict requests per minute
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

                  {form.watch("enableRateLimiting") && (
                    <FormField
                      control={form.control}
                      name="requestsPerMinute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requests Per Minute</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of requests allowed per minute
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="import" className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Import Configuration</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Upload a JSON file containing your agent configuration
                  </p>
                  <div className="relative">
                    <Input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button disabled={isUploading} className="relative">
                      {isUploading ? "Uploading..." : "Select File"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <div className="pt-4">
                <Button type="submit" className="w-full md:w-auto">
                  Save Configuration
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </div>
    </Card>
  );
};
