
import { memo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EnhancedRevenueDashboard } from "@/components/developer/revenue/EnhancedRevenueDashboard";
import { RevenueInsightsPanel } from "@/components/developer/revenue/RevenueInsightsPanel";
import { Button } from "@/components/ui/button";
import { Info, Download, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OptimizedSuspense } from "@/components/utils/OptimizedSuspense";

// Memoize the component to prevent unnecessary re-renders
const Revenue = memo(() => {
  // Button click handlers
  const handleHowToIncrease = () => {
    console.log('How to increase revenue clicked');
    // Add functionality here
  };
  
  const handleExportPDF = () => {
    console.log('Export PDF clicked');
    // Add functionality here
  };
  
  return (
    <DashboardLayout type="developer">
      <div className="space-y-3 max-w-full mx-auto mt-12"> {/* Increased top margin to avoid navbar overlap */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Revenue Analytics</h2>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-xs">
                Track your earnings and analyze revenue streams
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <HelpCircle className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Revenue analytics shows earnings from your agents over time. 
                    Use filters to analyze specific time periods and export data for reporting.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-start">
            <Button variant="outline" size="sm" className="gap-1 h-7" onClick={handleHowToIncrease}>
              <Info className="h-3 w-3" />
              <span className="text-xs">How to Increase Revenue</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1 h-7" onClick={handleExportPDF}>
              <Download className="h-3 w-3" />
              <span className="text-xs">Export PDF</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="lg:col-span-2">
            <OptimizedSuspense fallback={<div className="h-64 animate-pulse bg-muted rounded-md"/>} priority="high">
              <EnhancedRevenueDashboard />
            </OptimizedSuspense>
          </div>
          <div className="lg:col-span-1">
            <OptimizedSuspense fallback={<div className="h-64 animate-pulse bg-muted rounded-md"/>} priority="high">
              <RevenueInsightsPanel />
            </OptimizedSuspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
});

Revenue.displayName = 'Revenue';

export default Revenue;
