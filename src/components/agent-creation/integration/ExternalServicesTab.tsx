
import { Button } from "@/components/ui/button";

export const ExternalServicesTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 p-4 rounded-md mb-4 border border-amber-100">
        <p className="text-amber-800 text-sm">
          External service integration is coming soon. This will allow your agent to connect with third-party services.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-base font-medium">Coming Soon</h4>
        <p className="text-sm text-muted-foreground">
          Support for integrating with external services like:
        </p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>Database connectors</li>
          <li>Third-party APIs</li>
          <li>External AI services</li>
          <li>Authentication providers</li>
          <li>Storage solutions</li>
        </ul>
      </div>

      <div className="pt-4">
        <Button type="button" disabled className="w-full md:w-auto">
          External Services Coming Soon
        </Button>
      </div>
    </div>
  );
};
