
import { Key, Webhook, BookOpen, Copy, RefreshCcw, Trash2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface ApiKey {
  id: string;
  key: string;
  created_at: string;
  last_used?: string;
  status: 'active' | 'revoked';
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  created_at: string;
  status: 'active' | 'inactive';
}

interface ApiIntegrationsContentProps {
  activeTab: 'api-keys' | 'webhooks' | 'documentation';
  setActiveTab: (tab: 'api-keys' | 'webhooks' | 'documentation') => void;
  apiKeys: ApiKey[];
  webhooks: Webhook[];
  isLoadingKeys: boolean;
  isLoadingWebhooks: boolean;
  onGenerateApiKey: () => void;
  onAddWebhook: () => void;
}

export const ApiIntegrationsContent = ({
  activeTab,
  setActiveTab,
  apiKeys,
  webhooks,
  isLoadingKeys,
  isLoadingWebhooks,
  onGenerateApiKey,
  onAddWebhook
}: ApiIntegrationsContentProps) => {
  const { toast } = useToast();
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedWebhookUrl, setCopiedWebhookUrl] = useState<string | null>(null);

  const handleCopyApiKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to clipboard",
    });
  };

  const handleCopyWebhookUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedWebhookUrl(id);
    setTimeout(() => setCopiedWebhookUrl(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Webhook URL has been copied to clipboard",
    });
  };

  const handleRevokeApiKey = (id: string) => {
    toast({
      title: "Coming Soon",
      description: "API key revocation will be available soon.",
    });
  };

  const handleDeleteWebhook = (id: string) => {
    toast({
      title: "Coming Soon",
      description: "Webhook deletion will be available soon.",
    });
  };

  return (
    <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
      <div className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-2">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Documentation
          </TabsTrigger>
        </TabsList>
      </div>

      {/* API Keys Tab Content */}
      <TabsContent value="api-keys" className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={onGenerateApiKey} className="bg-primary-gradient">
            Generate New API Key
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Manage your API keys for accessing the AgentVerse API
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingKeys ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-9 rounded-lg" />
                      <Skeleton className="h-9 w-9 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : apiKeys.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2 mb-4 md:mb-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Key ID:</span>
                          <span>{apiKey.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Value:</span>
                          <code className="bg-gray-100 p-1 rounded text-sm">
                            {apiKey.key.slice(0, 5)}...{apiKey.key.slice(-5)}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleCopyApiKey(apiKey.key, apiKey.id)}
                          >
                            {copiedKeyId === apiKey.id ? 
                              <CheckCircle className="h-4 w-4 text-green-500" /> : 
                              <Copy className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Created:</span>
                          <span>{new Date(apiKey.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          <Badge variant={apiKey.status === 'active' ? 'default' : 'destructive'}>
                            {apiKey.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRevokeApiKey(apiKey.id)}
                          className="flex items-center gap-1"
                        >
                          <RefreshCcw className="h-3 w-3" />
                          Regenerate
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleRevokeApiKey(apiKey.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-10">
                <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No API Keys Found</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any API keys yet. Generate one to get started.
                </p>
                <Button onClick={onGenerateApiKey} className="bg-primary-gradient">
                  Generate New API Key
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/20 p-4 text-sm text-muted-foreground">
            <p>API keys give full access to your agent resources. Keep them secure!</p>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Webhooks Tab Content */}
      <TabsContent value="webhooks" className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={onAddWebhook} className="bg-primary-gradient">
            Add New Webhook
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Webhooks</CardTitle>
            <CardDescription>
              Configure webhooks to receive notifications for agent events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingWebhooks ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-9 rounded-lg" />
                      <Skeleton className="h-9 w-9 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : webhooks.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2 mb-4 md:mb-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">URL:</span>
                          <code className="bg-gray-100 p-1 rounded text-sm truncate max-w-[250px]">
                            {webhook.url}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleCopyWebhookUrl(webhook.url, webhook.id)}
                          >
                            {copiedWebhookUrl === webhook.id ? 
                              <CheckCircle className="h-4 w-4 text-green-500" /> : 
                              <Copy className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Events:</span>
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.map((event, idx) => (
                              <Badge key={idx} variant="outline">{event}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Created:</span>
                          <span>{new Date(webhook.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          <Badge variant={webhook.status === 'active' ? 'default' : 'destructive'}>
                            {webhook.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toast({
                            title: "Coming Soon",
                            description: "Webhook editing will be available soon.",
                          })}
                          className="flex items-center gap-1"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-10">
                <Webhook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Webhooks Found</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any webhooks configured yet. Add one to get started.
                </p>
                <Button onClick={onAddWebhook} className="bg-primary-gradient">
                  Add New Webhook
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/20 p-4 text-sm text-muted-foreground">
            <p>Webhooks allow your systems to receive real-time notifications about agent events.</p>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Documentation Tab Content */}
      <TabsContent value="documentation" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>
              Learn how to integrate with the AgentVerse API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Documentation Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                Detailed API documentation and integration guides are being developed.
              </p>
              <div className="bg-muted p-6 rounded-lg max-w-2xl mx-auto text-left">
                <h4 className="text-base font-semibold mb-4">Quick Start Guide</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium">1. Generate an API Key</h5>
                    <p className="text-sm text-muted-foreground">
                      Create an API key from the API Keys tab to authenticate your requests.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium">2. Make API Requests</h5>
                    <p className="text-sm text-muted-foreground">
                      Use your API key in the Authorization header:
                    </p>
                    <pre className="bg-black text-green-400 p-3 rounded-md text-xs mt-2 overflow-x-auto">
                      {`curl https://api.agentverse.com/v1/agents \
  -H "Authorization: Bearer YOUR_API_KEY"`}
                    </pre>
                  </div>
                  <div>
                    <h5 className="font-medium">3. Set Up Webhooks (Optional)</h5>
                    <p className="text-sm text-muted-foreground">
                      Configure webhooks to receive real-time notifications about your agents.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/20 p-4 text-sm text-muted-foreground">
            <p>Full documentation and SDKs will be available soon.</p>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
