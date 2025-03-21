
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Copy, Key, FileText } from 'lucide-react';
import { WebhookIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ApiKey, Webhook } from './types';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Format a key to display only the first and last 4 characters
  const formatKey = (key: string) => {
    return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <Tabs value={activeTab} onValueChange={value => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span>API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <WebhookIcon className="h-4 w-4" />
              <span>Webhooks</span>
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documentation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <CardTitle>API Keys</CardTitle>
              <Button onClick={onGenerateApiKey} disabled={isLoadingKeys} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {isLoadingKeys ? 'Generating...' : 'Generate API Key'}
              </Button>
            </div>
            {apiKeys.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No API keys found. Generate one to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map(apiKey => (
                  <Card key={apiKey.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
                        <div>
                          <div className="text-sm font-medium">Key</div>
                          <div className="flex items-center mt-1">
                            <code className="bg-muted p-1 rounded text-xs">{formatKey(apiKey.key)}</code>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="ml-2 h-6 w-6" 
                                    onClick={() => handleCopyToClipboard(apiKey.key, apiKey.id)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {copiedId === apiKey.id ? 'Copied!' : 'Copy to clipboard'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Created</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(apiKey.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Description</div>
                          <div className="text-sm text-muted-foreground">
                            {apiKey.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="webhooks" className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <CardTitle>Webhooks</CardTitle>
              <Button onClick={onAddWebhook} disabled={isLoadingWebhooks} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {isLoadingWebhooks ? 'Adding...' : 'Add Webhook'}
              </Button>
            </div>
            {webhooks.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No webhooks found. Add one to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map(webhook => (
                  <Card key={webhook.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
                        <div>
                          <div className="text-sm font-medium">URL</div>
                          <div className="flex items-center mt-1">
                            <div className="truncate max-w-xs text-sm">{webhook.url}</div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="ml-2 h-6 w-6" 
                                    onClick={() => handleCopyToClipboard(webhook.url, webhook.id)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {copiedId === webhook.id ? 'Copied!' : 'Copy to clipboard'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Events</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {webhook.events.map((event, index) => (
                              <Badge key={index} variant="secondary" className="bg-stone-400">{event}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Status</div>
                          <div className="mt-1">
                            <Badge variant={webhook.status === 'active' ? 'default' : 'outline'} className="bg-stone-400">
                              {webhook.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="documentation" className="pt-4">
            <CardTitle className="mb-4">API Quick Reference</CardTitle>
            <div className="prose max-w-none">
              <h4>Authentication</h4>
              <p>
                All API requests require an API key. Include your API key in the Authorization header:
              </p>
              <pre className="bg-muted p-4 rounded overflow-auto">
                <code>
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </pre>
              <h4>Common Endpoints</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <code className="bg-muted px-2 py-1 rounded mr-2 inline-block">/api/v1/agents</code>
                  <span>List all your agents</span>
                </li>
                <li className="flex items-start">
                  <code className="bg-muted px-2 py-1 rounded mr-2 inline-block">/api/v1/agents/{'{agent_id}'}</code>
                  <span>Get details for a specific agent</span>
                </li>
                <li className="flex items-start">
                  <code className="bg-muted px-2 py-1 rounded mr-2 inline-block">/api/v1/webhooks</code>
                  <span>Manage your webhooks</span>
                </li>
              </ul>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/developer/documentation'}
                  className="text-sm"
                >
                  View Full Documentation
                  <FileText className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};
