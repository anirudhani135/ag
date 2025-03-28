
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import TransactionList from "@/components/user-dashboard/credits/EnhancedTransactionsList";

export default function Transactions() {
  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            View and manage your transaction history
          </p>
        </div>
        
        <TransactionList />
      </div>
    </DashboardLayout>
  );
}
