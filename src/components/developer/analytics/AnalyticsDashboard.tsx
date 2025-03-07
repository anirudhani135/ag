
import { useEffect } from "react";
import { APIMetrics } from "./APIMetrics";
import { APILatencyChart } from "./APILatencyChart";
import { RequestsChart } from "./RequestsChart";
import { useFeatureTour } from "@/components/feature-tours/FeatureTourProvider";
import { FeatureTourDisplay } from "@/components/feature-tours/FeatureTourDisplay";

export const AnalyticsDashboard = () => {
  const { startTour } = useFeatureTour();

  useEffect(() => {
    // Add analytics class for tour targeting
    const container = document.querySelector('.analytics-dashboard');
    if (container) {
      container.classList.add('analytics-section');
    }
  }, []);

  return (
    <div className="space-y-6 analytics-dashboard">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      </div>
      
      <APIMetrics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <APILatencyChart />
        <RequestsChart />
      </div>
      
      <FeatureTourDisplay />
    </div>
  );
};
