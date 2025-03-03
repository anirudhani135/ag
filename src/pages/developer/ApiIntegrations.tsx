
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ApiIntegrationsHeader } from '@/components/developer/api-integrations/ApiIntegrationsHeader';
import { ApiIntegrationsContent } from '@/components/developer/api-integrations/ApiIntegrationsContent';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const ApiIntegrations = () => {
  const [activeTab, setActiveTab] = useState<'api-keys' | 'webhooks' | 'documentation'>('api-keys');

  // Fetch API keys
  const { data: apiKeys, isLoading: isLoadingKeys, refetch: refetchApiKeys } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        const { data, error } = await supabase
          .from('api_keys')
          .select('*')
          .eq('developer_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching API keys:', error);
        toast({
          title: 'Error',
          description: 'Failed to load API keys. Please try again.',
          variant: 'destructive',
        });
        return [];
      }
    },
  });

  // Fetch webhooks
  const { data: webhooks, isLoading: isLoadingWebhooks, refetch: refetchWebhooks } = useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        const { data, error } = await supabase
          .from('webhooks')
          .select('*')
          .eq('developer_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching webhooks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load webhooks. Please try again.',
          variant: 'destructive',
        });
        return [];
      }
    },
  });

  const handleGenerateApiKey = async () => {
    // Placeholder for API key generation
    toast({
      title: 'Coming Soon',
      description: 'API key generation will be available soon.',
    });
  };

  const handleAddWebhook = async () => {
    // Placeholder for webhook creation
    toast({
      title: 'Coming Soon',
      description: 'Webhook creation will be available soon.',
    });
  };

  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <ApiIntegrationsHeader />
        <ApiIntegrationsContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          apiKeys={apiKeys || []}
          webhooks={webhooks || []}
          isLoadingKeys={isLoadingKeys}
          isLoadingWebhooks={isLoadingWebhooks}
          onGenerateApiKey={handleGenerateApiKey}
          onAddWebhook={handleAddWebhook}
        />
      </div>
    </DashboardLayout>
  );
};

export default ApiIntegrations;
