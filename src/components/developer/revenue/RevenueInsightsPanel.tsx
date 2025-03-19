
import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/shared/metrics/MetricCard";
import { DollarSign, TrendingUp, ArrowUpRight, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Memoize component to prevent unnecessary re-renders
export const RevenueInsightsPanel = memo(() => {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Revenue Insights</CardTitle>
        <CardDescription className="text-xs">
          Performance metrics and targets for your current billing period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="space-y-3">
          <TabsList className="mb-2 h-8 w-full">
            <TabsTrigger value="performance" className="text-xs h-6">Performance</TabsTrigger>
            <TabsTrigger value="targets" className="text-xs h-6">Targets</TabsTrigger>
            <TabsTrigger value="comparison" className="text-xs h-6">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-3 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="text-xs font-medium">Monthly Growth</div>
                <div className="text-lg font-bold flex items-center">
                  24.5% <ArrowUpRight className="ml-1 text-green-500 h-3.5 w-3.5" />
                </div>
                <Progress value={24.5} className="h-1.5" />
              </div>
              
              <div className="space-y-1.5">
                <div className="text-xs font-medium">Revenue Retention</div>
                <div className="text-lg font-bold">94.2%</div>
                <Progress value={94.2} className="h-1.5" />
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="text-xs font-medium mb-1.5">Top Performing Agents</div>
              <div className="space-y-1.5">
                {["AI Assistant", "Data Analyzer", "Code Generator"].map((name, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span>{name}</span>
                    <span className="font-medium">${(1250 - i * 325).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="targets" className="space-y-3 pt-0">
            <div className="space-y-1.5">
              <div className="text-xs font-medium">Monthly Target</div>
              <div className="flex justify-between">
                <span className="text-lg font-bold">$8,500</span>
                <span className="text-xs text-muted-foreground self-end">$5,243 / $8,500</span>
              </div>
              <Progress value={61.7} className="h-1.5" />
            </div>
            
            <div className="space-y-1.5">
              <div className="text-xs font-medium">Quarterly Target</div>
              <div className="flex justify-between">
                <span className="text-lg font-bold">$25,000</span>
                <span className="text-xs text-muted-foreground self-end">$17,982 / $25,000</span>
              </div>
              <Progress value={71.9} className="h-1.5" />
            </div>
            
            <div className="space-y-1.5">
              <div className="text-xs font-medium">Annual Target</div>
              <div className="flex justify-between">
                <span className="text-lg font-bold">$120,000</span>
                <span className="text-xs text-muted-foreground self-end">$73,500 / $120,000</span>
              </div>
              <Progress value={61.25} className="h-1.5" />
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-3 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-xs font-medium">vs. Previous Month</div>
                <div className="text-base font-bold text-green-600">+12.8%</div>
                <div className="text-[10px] text-muted-foreground">$5,243 vs $4,649</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs font-medium">vs. Same Month Last Year</div>
                <div className="text-base font-bold text-green-600">+64.2%</div>
                <div className="text-[10px] text-muted-foreground">$5,243 vs $3,193</div>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="text-xs font-medium mb-1.5">Performance by Category</div>
              <div className="space-y-1.5">
                {[
                  { name: "Productivity", change: "+23.5%" },
                  { name: "Data Analysis", change: "+18.2%" },
                  { name: "Customer Service", change: "+7.4%" },
                ].map((category, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span>{category.name}</span>
                    <span className="font-medium text-green-600">{category.change}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

RevenueInsightsPanel.displayName = 'RevenueInsightsPanel';
