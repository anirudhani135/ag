
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BadgeHelp, Clock, CheckCircle, UserClock, ScanSearch } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SupportTicket {
  id: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export const SupportMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['support-metrics'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('support_tickets')
        .select('id, status, created_at, updated_at')
        .eq('user_id', user.data.user?.id);

      if (error) throw error;
      const tickets = data as SupportTicket[];

      const openTickets = tickets?.filter(t => t.status === 'open').length || 0;
      const inProgressTickets = tickets?.filter(t => t.status === 'in_progress').length || 0;
      const resolvedTickets = tickets?.filter(t => t.status === 'resolved').length || 0;
      const closedTickets = tickets?.filter(t => t.status === 'closed').length || 0;
      const totalTickets = tickets?.length || 0;
      
      // Calculate average response time (simulation)
      const avgResponseTime = tickets && tickets.length > 0 ? '24 hours' : 'N/A';
      
      // Calculate satisfaction rate (simulation)
      const satisfactionRate = '95%';

      return { 
        openTickets, 
        inProgressTickets,
        resolvedTickets, 
        closedTickets,
        totalTickets,
        avgResponseTime,
        satisfactionRate
      };
    },
  });

  const items = [
    {
      label: 'Open Tickets',
      value: metrics?.openTickets ?? 0,
      icon: BadgeHelp,
      color: 'text-orange-500 bg-orange-500/10',
      description: 'Awaiting response'
    },
    {
      label: 'In Progress',
      value: metrics?.inProgressTickets ?? 0,
      icon: Clock,
      color: 'text-blue-500 bg-blue-500/10',
      description: 'Being worked on'
    },
    {
      label: 'Resolved',
      value: metrics?.resolvedTickets ?? 0,
      icon: CheckCircle,
      color: 'text-green-500 bg-green-500/10',
      description: 'Successfully resolved'
    },
    {
      label: 'Response Time',
      value: metrics?.avgResponseTime ?? 'N/A',
      icon: UserClock,
      color: 'text-purple-500 bg-purple-500/10',
      description: 'Average time to first response'
    },
    {
      label: 'Satisfaction',
      value: metrics?.satisfactionRate ?? 'N/A',
      icon: ScanSearch,
      color: 'text-pink-500 bg-pink-500/10',
      description: 'Overall satisfaction rate'
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <Card 
          key={item.label}
          className="p-4 hover:bg-accent/5 transition-colors shadow-sm border"
        >
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
              </div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
