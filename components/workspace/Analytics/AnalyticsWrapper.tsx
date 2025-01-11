'use client'
import { useGetBookingsAnalytics } from '@/hooks/services/appointments'
import { Booking } from '@/types/appointments'
import React from 'react'
import SelectDuration from './SelectDuration'
import { useAnalyticsContext } from '@/context/AnalyticsContext'

const AnalyticsWrapper = ({children}:{children:React.ReactNode}) => {
    const {type, handleSetType} = useAnalyticsContext()
  return (
    <header className='w-full space-y-2'>
        <div className="flex w-full justify-end gap-4 items-center">
            <p className="">Sort</p>
            <SelectDuration type={type} setType ={handleSetType} />
        </div>

        {children}
    </header>
  )
}

export default AnalyticsWrapper