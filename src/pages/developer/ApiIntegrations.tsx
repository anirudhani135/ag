
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ApiIntegrationsHeader } from '@/components/developer/api-integrations/ApiIntegrationsHeader';
import { ApiIntegrationsContent } from '@/components/developer/api-integrations/ApiIntegrationsContent';
import { toast } from '@/components/ui/use-toast';
import { ApiKey, Webhook } from '@/components/developer/api-integrations/types';

const ApiIntegrations = () => {
  const [activeTab, setActiveTab] = useState<'api-keys' | 'webhooks' | 'documentation'>('api-keys');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for API keys
  const mockApiKeys: ApiKey[] = [
    {
      id: 'key_1',
      key: 'sk_live_51NxgLkFVl2AEf60WF4AEFwaXMNg',
      created_at: '2023-09-15T14:23:10Z',
      description: 'Production API Key'
    },
    {
      id: 'key_2',
      key: 'sk_test_51NxgLkFVl2AEf60WX7YtKOeMlGy',
      created_at: '2023-09-10T09:15:22Z',
      description: 'Test API Key'
    }
  ];

  // Mock data for webhooks
  const mockWebhooks: Webhook[] = [
    {
      id: 'wh_1',
      url: 'https://example.com/webhook',
      events: ['agent.deployed', 'agent.updated'],
      created_at: '2023-09-12T11:45:30Z',
      status: 'active'
    },
    {
      id: 'wh_2',
      url: 'https://myapp.io/notifications',
      events: ['agent.error'],
      created_at: '2023-09-08T16:20:15Z',
      status: 'inactive'
    }
  ];

  const handleGenerateApiKey = async () => {
    setIsLoading(true);
    try {
      // This would normally be an API call to generate a new key
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: 'API Key Generated',
          description: 'Your new API key has been created successfully.',
        });
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to generate API key. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddWebhook = async () => {
    setIsLoading(true);
    try {
      // This would normally be an API call to create a new webhook
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: 'Webhook Added',
          description: 'Your new webhook has been added successfully.',
        });
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to add webhook. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <ApiIntegrationsHeader />
        <ApiIntegrationsContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          apiKeys={mockApiKeys}
          webhooks={mockWebhooks}
          isLoadingKeys={isLoading}
          isLoadingWebhooks={isLoading}
          onGenerateApiKey={handleGenerateApiKey}
          onAddWebhook={handleAddWebhook}
        />
      </div>
    </DashboardLayout>
  );
};

export default ApiIntegrations;
