
import { APIMetrics } from "./APIMetrics";
import { APILatencyChart } from "./APILatencyChart";
import { RequestsChart } from "./RequestsChart";

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <APIMetrics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <APILatencyChart />
        <RequestsChart />
      </div>
    </div>
  );
};
