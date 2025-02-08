
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertOctagon, CheckCircle2, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database } from "@/integrations/supabase/types";

type Incident = Database['public']['Tables']['health_incidents']['Row'];

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'text-red-500';
    case 'high':
      return 'text-orange-500';
    case 'medium':
      return 'text-yellow-500';
    default:
      return 'text-green-500';
  }
};

export const IncidentTracker = () => {
  const { data: incidents, isLoading } = useQuery({
    queryKey: ['developer', 'incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_incidents')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as Incident[];
    }
  });

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Recent Incidents</h3>
        <AlertOctagon className="w-5 h-5 text-muted-foreground" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
        </div>
      ) : incidents?.length ? (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <Alert 
              key={incident.id}
              variant={incident.resolved_at ? 'default' : 'destructive'}
            >
              <AlertTitle className="flex items-center gap-2">
                {incident.incident_type}
                <span className={`ml-2 ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </span>
              </AlertTitle>
              <AlertDescription>
                <p className="mt-2">{incident.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(incident.started_at).toLocaleString()}
                  </div>
                  {incident.resolved_at && (
                    <div className="flex items-center gap-1 text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      Resolved
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground p-4">
          No recent incidents
        </div>
      )}
    </Card>
  );
};
