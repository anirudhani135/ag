
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CreditBalance } from "@/components/user-dashboard/credits/CreditBalance";
import { Button } from "@/components/ui/button";
import { PurchaseHistory } from "@/components/user-dashboard/credits/PurchaseHistory";
import { CreditUsage } from "@/components/user-dashboard/credits/CreditUsage";
import { EnhancedTransactionsList } from "@/components/user-dashboard/credits/EnhancedTransactionsList";
import { CreditsPricingPlan } from "@/components/user-dashboard/credits/CreditsPricingPlan";
import { PlusCircle, Activity, Clock, CreditCard } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

const Credits = () => {
  const [activeTab, setActiveTab] = useState("transactions");

  return (
    <DashboardLayout type="user">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Credits & Transactions</h2>
            <p className="text-muted-foreground mt-1">
              Manage your credits, purchase history, and view transaction details
            </p>
          </div>
          <Button 
            variant="primary"
            size="lg"
            className="shadow-lg hover:shadow-blue-200/50"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Purchase Credits
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CreditBalance />
          <CreditUsage />
          <PurchaseHistory />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/20 p-1">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <CreditCard className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Activity className="h-4 w-4 mr-2" />
              Usage Breakdown
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Clock className="h-4 w-4 mr-2" />
              Pricing Plans
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            <EnhancedTransactionsList />
          </TabsContent>
          
          <TabsContent value="usage" className="space-y-4">
            <CreditUsage showDetailed={true} />
          </TabsContent>
          
          <TabsContent value="pricing" className="space-y-4">
            <CreditsPricingPlan />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Credits;
