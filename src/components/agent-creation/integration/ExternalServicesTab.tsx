
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ExternalServicesList } from "./ExternalServicesList";
import { ExternalServicesComingSoon } from "./ExternalServicesComingSoon";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const ExternalServicesTab = () => {
  const [showBeta, setShowBeta] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { toast } = useToast();

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );

    toast({
      title: prev.includes(serviceId) ? "Service removed" : "Service added",
      description: `${serviceId} has been ${prev.includes(serviceId) ? "removed from" : "added to"} your integration.`,
      variant: "default"
    });
  };

  const handleSaveServices = () => {
    toast({
      title: "Services configuration saved",
      description: `${selectedServices.length} external services have been configured.`,
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-base font-medium">External Services</h3>
            <p className="text-sm text-muted-foreground">
              Connect your agent with third-party services and APIs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="show-beta" className="text-sm font-medium cursor-pointer">
              Show Beta Services
            </Label>
            <Switch 
              id="show-beta" 
              checked={showBeta} 
              onCheckedChange={setShowBeta} 
            />
          </div>
        </div>
        
        <div className="mt-2 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <p>Some services may require additional setup or API keys</p>
        </div>
      </div>

      {showBeta ? (
        <>
          <ExternalServicesList 
            onServiceToggle={handleServiceToggle}
            selectedServices={selectedServices}
          />
          
          <Button 
            onClick={handleSaveServices} 
            className="mt-4"
            disabled={selectedServices.length === 0}
          >
            Save Service Configuration
          </Button>
        </>
      ) : (
        <ExternalServicesComingSoon />
      )}
    </div>
  );
};
