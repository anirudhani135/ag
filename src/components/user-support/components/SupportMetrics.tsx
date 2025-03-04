
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BadgeHelp, Clock, CheckCircle } from 'lucide-react';

interface SupportTicket {
  id: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

export const SupportMetrics = () => {
  const { data: metrics } = useQuery({
    queryKey: ['support-metrics'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('support_tickets')
        .select('id, status')
        .eq('user_id', user.data.user?.id);

      if (error) throw error;
      const tickets = data as SupportTicket[];

      const openTickets = tickets?.filter(t => t.status === 'open').length || 0;
      const resolvedTickets = tickets?.filter(t => t.status === 'resolved').length || 0;
      const totalTickets = tickets?.length || 0;

      return { openTickets, resolvedTickets, totalTickets };
    },
  });

  const items = [
    {
      label: 'Open Tickets',
      value: metrics?.openTickets ?? 0,
      icon: BadgeHelp,
      color: 'text-orange-500',
    },
    {
      label: 'In Progress',
      value: (metrics?.totalTickets ?? 0) - (metrics?.openTickets ?? 0) - (metrics?.resolvedTickets ?? 0),
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      label: 'Resolved',
      value: metrics?.resolvedTickets ?? 0,
      icon: CheckCircle,
      color: 'text-green-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card 
          key={item.label}
          className="p-6 hover:bg-accent/5 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
            <item.icon className={`h-8 w-8 ${item.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
};
