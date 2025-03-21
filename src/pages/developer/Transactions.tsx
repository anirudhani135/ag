
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionList } from "@/components/user-dashboard/credits/EnhancedTransactionsList";

const Transactions = () => {
  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          View and manage your transaction history
        </p>
        
        <Card className="shadow-sm">
          <CardHeader className="bg-gradient-to-r from-white to-blue-50/50 pb-4">
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <TransactionList />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
