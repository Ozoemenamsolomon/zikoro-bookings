"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Props interface for DatePicker
interface DatePickerProps {
  label?: string
  error?: string
  name: string
  value?: Date | string
  onChange: (date: Date | undefined, field?:string) => void
  disabled?: boolean
  isRequired?: boolean
  placeholder?: string
  className?: string
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  name,
  error,
  value,
  onChange,
  disabled = false,
  isRequired = false,
  placeholder = "Pick a date",
  className,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )

  const handleDateChange = (date: Date | undefined) => {
    // setSelectedDate(date)
    onChange(date)
  }

  return (
    <div className=" w-full">
      {label && (
        <label htmlFor={name} className="block text-sm mb-1 font-">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full items-center h-12 py-2 px-4 justify-start text-left font-normal focus:ring-1 focus:ring-purple-200 focus:outline-none",
              !value && "text-muted-foreground",className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value
              ? format(new Date(value), "PPP")
              : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={handleDateChange}
            initialFocus
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>

      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  )
}
