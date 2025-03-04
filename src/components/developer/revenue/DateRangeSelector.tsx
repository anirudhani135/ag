
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export interface DateRangeSelectorProps {
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  dateRange: { from: Date; to: Date };
}

export const DateRangeSelector = ({ onDateRangeChange, dateRange }: DateRangeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const newRange = { ...dateRange };
    
    if (!newRange.from || (newRange.from && newRange.to)) {
      // If no from date is set or both dates are set, start a new range
      newRange.from = date;
      newRange.to = date;
    } else {
      // If only from date is set, set the to date
      const from = newRange.from;
      if (date < from) {
        newRange.from = date;
      } else {
        newRange.to = date;
        setIsOpen(false);
      }
    }
    
    onDateRangeChange(newRange);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarIcon className="h-4 w-4 mr-2" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          selected={{
            from: dateRange.from,
            to: dateRange.to,
          }}
          onSelect={(range) => {
            if (range?.from) {
              onDateRangeChange({
                from: range.from,
                to: range.to || range.from,
              });
              if (range.to) {
                setIsOpen(false);
              }
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};
