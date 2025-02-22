
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Transactions = () => {
  return (
    <DashboardLayout type="developer">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          View and manage your transaction history
        </p>
        {/* Transactions list will be implemented here */}
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
