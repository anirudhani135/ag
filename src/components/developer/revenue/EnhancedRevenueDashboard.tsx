
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DateRangeSelector } from "./DateRangeSelector";
import { EnhancedRevenueMetrics } from "./EnhancedRevenueMetrics";
import { TransactionList } from "./TransactionList";
import { startOfDay, endOfDay } from "date-fns";

export const EnhancedRevenueDashboard = () => {
  const [dateRange, setDateRange] = useState({
    start: startOfDay(new Date()),
    end: endOfDay(new Date())
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <DateRangeSelector
          startDate={dateRange.start}
          endDate={dateRange.end}
          onRangeChange={(start, end) => setDateRange({ start, end })}
        />
      </Card>

      <EnhancedRevenueMetrics
        startDate={dateRange.start}
        endDate={dateRange.end}
      />

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Transaction History</h3>
        <TransactionList
          startDate={dateRange.start}
          endDate={dateRange.end}
        />
      </Card>
    </div>
  );
};
