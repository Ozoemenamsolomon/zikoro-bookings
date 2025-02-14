'use client'

import React from 'react'
import SelectDuration from './SelectDuration'
import { TopClients } from './TopClientsTable'
 
import { getTypeLabel } from '@/lib'
import { useAnalyticsContext } from '@/context/AnalyticsContext'

const SectionFour =  ()  => {
  const {type, handleSetType, isLoading, error, current, previous,} = useAnalyticsContext()

  return (
    <section className="p-8 max-sm:px-4 rounded-lg bg-white border">
        <div className="">
        <h4 className="text-lg font-semibold">Top Clients</h4>
        <p>Your top participants this {getTypeLabel(type)}</p>
        </div>
        {/* <div className="flex w-full pt-2 justify-end gap-4 items-center">
            <p className="">Sort</p>
            <SelectDuration type={type} setType ={handleSetType} />
            </div> */}

        <div className="mt-8 mx-auto max-w-2xl bg-zikoroBlue/5 border  rounded-lg ">
            <div className=" bg-white rounded-lg overflow-hidden w-fulll pb-8">
                <TopClients type={type} isLoading={isLoading} error={error} current={current} previous={previous}/>
            </div>
        </div>
    </section>
  )
}

export default SectionFour