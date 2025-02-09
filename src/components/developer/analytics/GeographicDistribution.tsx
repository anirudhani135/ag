
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/shared/metrics/MetricCard";
import { Globe, Map, Navigation, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const GeographicDistribution = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['geographic-distribution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_metrics')
        .select('ip_address')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Geographic Distribution</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Regions"
          value="12"
          icon={<Globe className="w-6 h-6" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Top Region"
          value="North America"
          icon={<Map className="w-6 h-6" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Active Locations"
          value={metrics?.length || 0}
          icon={<Navigation className="w-6 h-6" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Global Users"
          value="1.2k"
          icon={<Users className="w-6 h-6" />}
          isLoading={isLoading}
        />
      </div>

      <div className="mt-6 bg-muted/20 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          Interactive map visualization coming soon
        </p>
      </div>
    </Card>
  );
};
