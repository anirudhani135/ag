
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
import { Skeleton } from "@/components/ui/skeleton";

export const RevenueInsightsPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Insights</CardTitle>
        <CardDescription>
          Performance metrics and targets for your current billing period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance">
          <TabsList className="mb-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="targets">Targets</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Monthly Growth</div>
                <div className="text-2xl font-bold flex items-center">
                  24.5% <ArrowUpRight className="ml-1 text-green-500 h-4 w-4" />
                </div>
                <Progress value={24.5} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Revenue Retention</div>
                <div className="text-2xl font-bold">94.2%</div>
                <Progress value={94.2} className="h-2" />
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-sm font-medium mb-2">Top Performing Agents</div>
              <div className="space-y-2">
                {["AI Assistant", "Data Analyzer", "Code Generator"].map((name, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span>{name}</span>
                    <span className="font-medium">${(1250 - i * 325).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="targets">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Monthly Target</div>
                <div className="flex justify-between">
                  <span className="text-2xl font-bold">$8,500</span>
                  <span className="text-sm text-muted-foreground self-end">$5,243 / $8,500</span>
                </div>
                <Progress value={61.7} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Quarterly Target</div>
                <div className="flex justify-between">
                  <span className="text-2xl font-bold">$25,000</span>
                  <span className="text-sm text-muted-foreground self-end">$17,982 / $25,000</span>
                </div>
                <Progress value={71.9} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Annual Target</div>
                <div className="flex justify-between">
                  <span className="text-2xl font-bold">$120,000</span>
                  <span className="text-sm text-muted-foreground self-end">$73,500 / $120,000</span>
                </div>
                <Progress value={61.25} className="h-2" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">vs. Previous Month</div>
                  <div className="text-xl font-bold text-green-600">+12.8%</div>
                  <div className="text-xs text-muted-foreground">$5,243 vs $4,649</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">vs. Same Month Last Year</div>
                  <div className="text-xl font-bold text-green-600">+64.2%</div>
                  <div className="text-xs text-muted-foreground">$5,243 vs $3,193</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">Performance by Category</div>
                <div className="space-y-2">
                  {[
                    { name: "Productivity", change: "+23.5%" },
                    { name: "Data Analysis", change: "+18.2%" },
                    { name: "Customer Service", change: "+7.4%" },
                  ].map((category, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span>{category.name}</span>
                      <span className="font-medium text-green-600">{category.change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
