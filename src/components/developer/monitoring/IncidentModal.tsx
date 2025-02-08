
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

type Incident = Database['public']['Tables']['health_incidents']['Row'];

interface IncidentModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentModal = ({ incident, isOpen, onClose }: IncidentModalProps) => {
  const [resolutionNotes, setResolutionNotes] = useState(incident?.resolution_notes || '');
  const { toast } = useToast();

  const handleResolveIncident = async () => {
    if (!incident) return;

    const { error } = await supabase
      .from('health_incidents')
      .update({
        resolved_at: new Date().toISOString(),
        resolution_notes: resolutionNotes
      })
      .eq('id', incident.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to resolve incident",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Incident resolved successfully"
    });
    onClose();
  };

  if (!incident) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Incident Details</DialogTitle>
          <DialogDescription>
            Review and manage incident information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Type</h4>
            <p className="text-sm">{incident.incident_type}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Severity</h4>
            <p className="text-sm">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                'bg-yellow-100 text-yellow-800'}`}>
                {incident.severity}
              </span>
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm">{incident.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Started At</h4>
            <p className="text-sm">
              {new Date(incident.started_at || '').toLocaleString()}
            </p>
          </div>

          {!incident.resolved_at && (
            <div>
              <h4 className="text-sm font-medium mb-1">Resolution Notes</h4>
              <Textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Enter resolution notes..."
                className="h-32"
              />
            </div>
          )}

          {incident.resolved_at ? (
            <div>
              <h4 className="text-sm font-medium mb-1">Resolution</h4>
              <p className="text-sm">{incident.resolution_notes}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Resolved at: {new Date(incident.resolved_at).toLocaleString()}
              </p>
            </div>
          ) : (
            <Button
              onClick={handleResolveIncident}
              className="w-full"
              disabled={!resolutionNotes.trim()}
            >
              Resolve Incident
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
