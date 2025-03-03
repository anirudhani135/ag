
import { Info } from 'lucide-react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';

export const ApiIntegrationsHeader = () => {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">API & Integrations</h2>
          <div className="flex items-center mt-1">
            <p className="text-muted-foreground">
              Manage your API keys, webhooks, and integration resources
            </p>
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="inline-flex items-center ml-2">
                  <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 text-sm" align="start">
                <p>
                  Use API keys to access the AgentVerse API and integrate your agents with external systems.
                  Webhooks allow your systems to receive real-time updates about agent events.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </div>
  );
};
