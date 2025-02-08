
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { addDays, format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from "date-fns";

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onRangeChange: (start: Date, end: Date) => void;
}

const presets = [
  { label: 'Today', getDates: () => [startOfDay(new Date()), endOfDay(new Date())] },
  { label: 'Last 7 Days', getDates: () => [addDays(new Date(), -7), new Date()] },
  { label: 'This Week', getDates: () => [startOfWeek(new Date()), endOfWeek(new Date())] },
  { label: 'This Month', getDates: () => [startOfMonth(new Date()), endOfMonth(new Date())] },
  { label: 'This Quarter', getDates: () => [startOfQuarter(new Date()), endOfQuarter(new Date())] },
];

export const DateRangeSelector = ({ startDate, endDate, onRangeChange }: DateRangeSelectorProps) => {
  const handlePresetClick = (preset: typeof presets[0]) => {
    const [start, end] = preset.getDates();
    onRangeChange(start, end);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick(preset)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[260px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(startDate, "LLL dd, y")} - {format(endDate, "LLL dd, y")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: startDate,
              to: endDate,
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onRangeChange(range.from, range.to);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
