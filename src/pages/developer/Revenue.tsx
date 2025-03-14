
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EnhancedRevenueDashboard } from "@/components/developer/revenue/EnhancedRevenueDashboard";
import { RevenueInsightsPanel } from "@/components/developer/revenue/RevenueInsightsPanel";
import { Button } from "@/components/ui/button";
import { InfoCircle, Download, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Revenue = () => {
  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Revenue Analytics</h2>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                Track your earnings and analyze revenue streams
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <HelpCircle className="h-4 w-4" />
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
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <InfoCircle className="h-4 w-4" />
              <span>How to Increase Revenue</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span>Export PDF Report</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnhancedRevenueDashboard />
          </div>
          <div className="lg:col-span-1">
            <RevenueInsightsPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Revenue;
