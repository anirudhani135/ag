
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CreditBalance } from "@/components/user-dashboard/credits/CreditBalance";
import { TransactionsList } from "@/components/developer/transactions/TransactionsList";

const Credits = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Credits & Transactions</h2>
          <p className="text-muted-foreground">
            Manage your credits and view transaction history
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CreditBalance />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Transactions</h3>
          <TransactionsList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Credits;
