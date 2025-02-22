
'use client'

import { DateRangePicker } from '@/components/shared/DateRangePicker'
import { Button } from '@/components/ui/button'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { BookingsQuery } from '@/types/appointments'
import { Search } from 'lucide-react'
import React , {  Dispatch, SetStateAction, useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
 
interface CalendarProps {
    isDayDisabled?:(day:Date)=>boolean,
    value?: DateRange|undefined
    onChange: (date: DateRange | undefined, field?:string) => void
    disabled?: boolean
    className?: string
}

const FitlerByDate:React.FC<CalendarProps> = ({ disabled,isDayDisabled, onChange, value}) => {
    const {dateRange, setDateRange} = useAppointmentContext()
 
  return (
    <div className="flex items-end gap-2">
    <DateRangePicker 
      value={dateRange}
      onChange={setDateRange}
      className='border-none outline-none bg-transparent px-0 hover:bg-transparent h-6'
      placeholder='Appointment date'
    />
    {dateRange?.from && dateRange?.to ? <Button onClick={()=>onChange(dateRange)} variant={'outline'} className='h-8 w-8 rounded-full border border-gray-300 bg-white text-blue-600 flex justify-center items-center '><Search size={14}/></Button> : null}
    </div>
  )
}

export default FitlerByDate
