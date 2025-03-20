
import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ApiIntegrationsHeader } from '@/components/developer/api-integrations/ApiIntegrationsHeader';
import { ApiIntegrationsContent } from '@/components/developer/api-integrations/ApiIntegrationsContent';
import { useToast } from '@/components/ui/use-toast';
import { ApiKey, Webhook } from '@/components/developer/api-integrations/types';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type ApiTabState = 'api-keys' | 'webhooks' | 'documentation';

const ApiIntegrations = () => {
  const [activeTab, setActiveTab] = useState<ApiTabState>('api-keys');
  const { toast } = useToast();

  // Fetch data with React Query for better caching and performance
  const { 
    data: apiKeysData,
    isLoading: isLoadingKeys, 
    refetch: refetchApiKeys
  } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async (): Promise<ApiKey[]> => {
      // This would be a real API call in production
      // Simulated data for now
      return [
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
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const { 
    data: webhooksData,
    isLoading: isLoadingWebhooks,
    refetch: refetchWebhooks
  } = useQuery({
    queryKey: ['webhooks'],
    queryFn: async (): Promise<Webhook[]> => {
      // This would be a real API call in production
      // Simulated data for now
      return [
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
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Use mutations for write operations
  const generateApiKeyMutation = useMutation({
    mutationFn: async (description: string) => {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: `key_${Date.now()}`, key: `sk_${Math.random().toString(36).substring(2, 15)}` };
    },
    onSuccess: () => {
      refetchApiKeys();
      toast({
        title: 'API Key Generated',
        description: 'Your new API key has been created successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to generate API key. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const addWebhookMutation = useMutation({
    mutationFn: async (webhookData: Partial<Webhook>) => {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: `wh_${Date.now()}`, ...webhookData };
    },
    onSuccess: () => {
      refetchWebhooks();
      toast({
        title: 'Webhook Added',
        description: 'Your new webhook has been added successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add webhook. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const handleGenerateApiKey = useCallback(() => {
    generateApiKeyMutation.mutate('New API Key');
  }, [generateApiKeyMutation]);

  const handleAddWebhook = useCallback(() => {
    addWebhookMutation.mutate({
      url: 'https://example.com/new-webhook',
      events: ['agent.created'],
      status: 'active'
    });
  }, [addWebhookMutation]);

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6 animate-fade-in">
        <ApiIntegrationsHeader />
        <ApiIntegrationsContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          apiKeys={apiKeysData || []}
          webhooks={webhooksData || []}
          isLoadingKeys={isLoadingKeys || generateApiKeyMutation.isPending}
          isLoadingWebhooks={isLoadingWebhooks || addWebhookMutation.isPending}
          onGenerateApiKey={handleGenerateApiKey}
          onAddWebhook={handleAddWebhook}
        />
      </div>
    </DashboardLayout>
  );
};

export default ApiIntegrations;
