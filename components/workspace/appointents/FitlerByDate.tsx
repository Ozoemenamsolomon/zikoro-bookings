
'use client'

import { DropMenu } from '@/components/shared/DropMenu'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as Icon } from 'lucide-react'

import React , {  useState } from 'react'
 
interface CalendarProps {
    isDayDisabled?:(day:Date)=>boolean,
    value?: Date
    onChange: (date: Date | undefined, field?:string) => void
    disabled?: boolean
    className?: string
}

const FitlerByDate:React.FC<CalendarProps> = ({ disabled,isDayDisabled, onChange, value}) => {

    const [date, setDate] = React.useState<Date | undefined>(value || new Date())
    const handleSelect = (selected:Date|undefined) => {
        setDate(selected)
        onChange(selected)
    }

  return (
    <DropMenu
        trigerBtn={
            <button className="flex gap-2 items-center">
                <Icon size={16} />
                <small>Appointment date</small>
            </button>
        }
        className=''
    >
        <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            className="rounded-md border shadow"
        />
    </DropMenu>
  )
}

export default FitlerByDate
