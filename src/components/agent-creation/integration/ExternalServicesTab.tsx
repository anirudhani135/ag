
import { Button } from "@/components/ui/button";
import { ExternalServicesList } from "./ExternalServicesList";
import { ExternalServicesComingSoon } from "./ExternalServicesComingSoon";

export const ExternalServicesTab = () => {
  return (
    <div className="space-y-6">
      <ExternalServicesComingSoon />
      <ExternalServicesList />
      <div className="pt-4">
        <Button type="button" disabled className="w-full md:w-auto">
          External Services Coming Soon
        </Button>
      </div>
    </div>
  );
};
