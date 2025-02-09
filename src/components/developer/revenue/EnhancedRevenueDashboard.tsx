
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EnhancedRevenueMetrics } from "./EnhancedRevenueMetrics";
import { TransactionList } from "./TransactionList";
import { startOfDay, endOfDay } from "date-fns";
import { DateRangePicker } from "@/components/shared/filters/DateRangePicker";
import { DateRange } from "react-day-picker";

export const EnhancedRevenueDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(new Date()),
    to: endOfDay(new Date())
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Revenue Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor your revenue metrics and transaction history
          </p>
        </div>
        <DateRangePicker
          date={dateRange}
          onChange={(range) => {
            if (range?.from && range?.to) {
              setDateRange({
                from: startOfDay(range.from),
                to: endOfDay(range.to)
              });
            }
          }}
        />
      </div>

      <EnhancedRevenueMetrics
        startDate={dateRange.from!}
        endDate={dateRange.to!}
      />

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Transaction History</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your recent transactions
            </p>
          </div>
        </div>
        <TransactionList
          startDate={dateRange.from!}
          endDate={dateRange.to!}
        />
      </Card>
    </div>
  );
};
