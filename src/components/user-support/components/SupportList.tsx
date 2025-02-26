
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  resolved_at: string | null;
}

interface SupportListProps {
  searchQuery: string;
}

const SupportList = ({ searchQuery }: SupportListProps) => {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['support-tickets', searchQuery],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      let query = supabase
        .from('support_tickets')
        .select('id, subject, description, status, created_at, resolved_at')
        .eq('user_id', user.data.user?.id)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('subject', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SupportTicket[];
    },
  });

  if (isLoading) return <LoadingSpinner />;

  if (!tickets?.length) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>No support tickets found</p>
          <p className="text-sm mt-2">Create a new ticket to get help</p>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-orange-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Recent Tickets</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{ticket.subject}</h4>
                <Badge
                  variant="secondary"
                  className={cn(
                    "capitalize",
                    getStatusColor(ticket.status)
                  )}
                >
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {ticket.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>
                  Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                </span>
                {ticket.resolved_at && (
                  <span>
                    • Resolved {formatDistanceToNow(new Date(ticket.resolved_at), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default SupportList;
