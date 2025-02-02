'use client'

import React from 'react'
import SelectDuration from './SelectDuration'
import { BookingsChart } from './BookingsChart'

import { getTypeLabel } from '@/lib'
import { useAnalyticsContext } from '@/context/AnalyticsContext'

const SectionThree = ()  => {
  const {type, handleSetType, isLoading, error, current, previous,} = useAnalyticsContext()

  return (
    <section className="w-full bg-white border rounded-lg ">
      <div className="p-6 ">
        <div className="space-y-">
          <h4 className="text-lg font-semibold">Bookings</h4>
          <p className="">Showing total bookings this {getTypeLabel(type)}</p>
        </div>
        {/* <div className="flex w-full pt-2 justify-end gap-4 items-center">
          <p className="">Sort</p>
          <SelectDuration type={type} setType ={handleSetType} />
        </div> */}
      </div>
    <div className="p-0 sm:p-4">
        <div className=" border bg-baseBg rounded-lg  p-0 md:p-4 lg:p-8 ">
            <BookingsChart type={type} isLoading={isLoading} error={error} current={current} previous={previous}/>
        </div>
    </div>
</section>
  )
}

export default SectionThree