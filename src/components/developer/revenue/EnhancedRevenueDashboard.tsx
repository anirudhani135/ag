
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DateRangeSelector } from "@/components/developer/revenue/DateRangeSelector";
import { EnhancedRevenueMetrics } from "@/components/developer/revenue/EnhancedRevenueMetrics";
import { TransactionList } from "@/components/developer/revenue/TransactionList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, BarChart2, LineChart, PieChart, Users, Calendar } from "lucide-react";
import { addDays, subDays, subMonths, format } from "date-fns";

export const EnhancedRevenueDashboard = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const [activeTab, setActiveTab] = useState("overview");

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };

  const handleQuickRange = (range: string) => {
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
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">Revenue Analytics Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Track your earnings and analyze revenue streams
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <DateRangeSelector
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickRange("today")}
            className="text-xs"
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickRange("yesterday")}
            className="text-xs"
          >
            Yesterday
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickRange("last7")}
            className="text-xs"
          >
            Last 7 Days
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickRange("last30")}
            className="text-xs"
          >
            Last 30 Days
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickRange("thisMonth")}
            className="text-xs"
          >
            This Month
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickRange("lastMonth")}
            className="text-xs"
          >
            Last Month
          </Button>
        </div>

        <EnhancedRevenueMetrics startDate={dateRange.from} endDate={dateRange.to} />
      </Card>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <BarChart2 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <Users className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="trends">
              <LineChart className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="breakdown">
              <PieChart className="h-4 w-4 mr-2" />
              Breakdown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Revenue Overview</h4>
                <div className="aspect-[2/1] bg-muted/30 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Revenue chart visualization</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList startDate={dateRange.from} endDate={dateRange.to} />
          </TabsContent>

          <TabsContent value="trends">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Revenue Trends</h4>
                <div className="aspect-[2/1] bg-muted/30 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Revenue trends chart</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="breakdown">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Revenue by Category</h4>
                <div className="aspect-square bg-muted/30 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Category distribution</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Revenue by Agent</h4>
                <div className="aspect-square bg-muted/30 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Agent distribution</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
