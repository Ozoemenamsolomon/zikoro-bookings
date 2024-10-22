'use client'

import React from 'react'
import SelectDuration from './SelectDuration'
import { EarningsBarChart } from './EarningsBarChart'
import { useGetBookingsAnalytics } from '@/hooks/services/appointments'
import { Booking } from '@/types/appointments'

const SectionFive = ({curList, prevList, typeParam}:{curList:Booking[]|null, prevList:Booking[]|null, typeParam?:string}) => {
  const {type, handleSetType,isLoading,error, current,previous,} = useGetBookingsAnalytics(({curList, prevList, typeParam}))

  return (
    <section className="w-full bg-white border rounded-lg p-6 ">
      <div className="p-6 ">
        <div className="space-y-">
          <h4 className="text-lg font-semibold">Earnings</h4>
          <p className="">Showing total earnings comparison for the selected period.
          </p>
        </div>
        <div className="flex w-full pt-2 justify-end gap-4 items-center">
          <p className="">Sort</p>
          <SelectDuration type={type} setType ={handleSetType} />
        </div>
      </div>
      <div className="p-0 sm:p-4">
      <div className=" border bg-baseBg rounded-lg  p-0 md:p-4 lg:p-8 ">
            <EarningsBarChart type={type} isLoading={isLoading} error={error} current={current} previous={previous}/>
        </div>
    </div>
</section>
  )
}

export default SectionFive