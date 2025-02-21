
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UsageRecord {
  id: string;
  agent_id: string;
  views: number;
  unique_views: number;
  date: string;
  created_at: string;
}

const UsageHistory = () => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: usageHistory, isLoading } = useQuery({
    queryKey: ['usage-history', sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .order('date', { ascending: sortOrder === 'asc' })
        .limit(50);

      if (error) throw error;
      return data as UsageRecord[];
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Usage History</h2>
            <p className="text-muted-foreground">Track your agent usage over time</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2"
          >
            Sort by Date
            {sortOrder === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
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
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {new Date(record.date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <div className="flex gap-4 mt-1">
                          <p className="text-sm text-muted-foreground">
                            Views: {record.views}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Unique Views: {record.unique_views}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!usageHistory?.length && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No usage history available</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UsageHistory;
