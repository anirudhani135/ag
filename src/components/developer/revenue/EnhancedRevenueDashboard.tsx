
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DateRangeSelector } from "@/components/developer/revenue/DateRangeSelector";
import { EnhancedRevenueMetrics } from "@/components/developer/revenue/EnhancedRevenueMetrics";
import { TransactionsList } from "@/components/developer/revenue/TransactionList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, BarChart2, LineChart, PieChart, Users } from "lucide-react";
import { subMonths, subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, lazy } from "react";

// Define the quick range options to reduce redundancy
const quickRanges = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" }
];

export const EnhancedRevenueDashboard = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setIsLoading(true);
    setDateRange(range);
    // Simulate loading state for better UX
    setTimeout(() => setIsLoading(false), 300);
  };

  // Simplified quick range handler
  const handleQuickRange = (range: string) => {
    setIsLoading(true);
    const now = new Date();
    
    switch (range) {
      case "today":
        setDateRange({ from: now, to: now });
        break;
      case "yesterday":
        const yesterday = subDays(now, 1);
        setDateRange({ from: yesterday, to: yesterday });
        break;
      case "last7":
        setDateRange({ from: subDays(now, 6), to: now });
        break;
      case "last30":
        setDateRange({ from: subDays(now, 29), to: now });
        break;
      case "thisMonth":
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        setDateRange({ from: firstOfMonth, to: now });
        break;
      case "lastMonth":
        const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        setDateRange({ from: firstOfLastMonth, to: lastOfLastMonth });
        break;
      default:
        break;
    }
    
    // Simulate loading state for better UX
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold">Revenue Dashboard</h3>
            <p className="text-xs text-muted-foreground">
              Track earnings and revenue streams
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <DateRangeSelector
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
            <Button variant="outline" size="sm" className="h-7">
              <Download className="h-3 w-3 mr-1" />
              <span className="text-xs">Export</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {quickRanges.map((item) => (
            <Button 
              key={item.value}
              variant="outline" 
              size="sm" 
              onClick={() => handleQuickRange(item.value)}
              className="text-xs h-6"
            >
              {item.label}
            </Button>
          ))}
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        }>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array(4).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <EnhancedRevenueMetrics startDate={dateRange.from} endDate={dateRange.to} />
          )}
        </Suspense>
      </Card>

      <Card className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 h-8">
            <TabsTrigger value="overview" className="text-xs h-7">
              <BarChart2 className="h-3 w-3 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs h-7">
              <Users className="h-3 w-3 mr-1" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-xs h-7">
              <LineChart className="h-3 w-3 mr-1" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="text-xs h-7">
              <PieChart className="h-3 w-3 mr-1" />
              Breakdown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-medium mb-1">Revenue Overview</h4>
                <div className="aspect-[2/1] bg-muted/30 rounded-md flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Revenue chart visualization</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <TransactionsList />
            </Suspense>
          </TabsContent>

          <TabsContent value="trends">
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-medium mb-1">Revenue Trends</h4>
                <div className="aspect-[2/1] bg-muted/30 rounded-md flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Revenue trends chart</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="breakdown">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium mb-1">Revenue by Category</h4>
                <div className="aspect-square bg-muted/30 rounded-md flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Category distribution</p>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-medium mb-1">Revenue by Agent</h4>
                <div className="aspect-square bg-muted/30 rounded-md flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Agent distribution</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
