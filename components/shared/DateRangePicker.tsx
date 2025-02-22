"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  placeholder?:string,
  className?:string,
}

export function DateRangePicker({ 
    value, 
    onChange,
    placeholder="Pick a date range",
    className,
}: DateRangePickerProps) {
  const handleChange = (newDate: DateRange | undefined) => {
    onChange(newDate);
    // console.log({newDate})
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(`px-4 flex gap-2 items-center`,className)}
        >
          <CalendarIcon className=" h-4 w-4" />
          { 
            value?.from ? 
            <small className="font-medium">
              { value.to ? 
                `${format(value.from, "dd/MM/yyy")} - ${format(value.to, "dd/MM/yyy")}`
                : 
                format(value.from, "dd/MM/yyy")
              }
            </small> : <small>{placeholder}</small>
          } 
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={value}
          onSelect={handleChange}
          initialFocus
          numberOfMonths={1} // select 2 to Show two months side by side
        />
      </PopoverContent>
    </Popover>
  );
}
