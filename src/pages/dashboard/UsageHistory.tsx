import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from 'lucide-react';

interface UsageRecord {
  id: string;
  agent_id: string;
  views: number;
  unique_views: number;
  date: string;
  created_at: string;
}

const UsageHistory = () => {
  const { data: usageHistory, isLoading } = useQuery({
    queryKey: ['usage-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .order('date', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as UsageRecord[];
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Usage History</h2>
          <p className="text-muted-foreground">Track your agent usage over time</p>
        </div>

        <Card className="p-6">
          <ScrollArea className="h-[600px] w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading usage history...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {usageHistory?.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">
                          Views: {record.views} | Unique Views: {record.unique_views}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UsageHistory;