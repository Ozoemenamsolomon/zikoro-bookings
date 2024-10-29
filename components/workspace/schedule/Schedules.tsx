'use client'

import { AppointmentLink } from '@/types/appointments'
import React from 'react'
import LinksCard from './LinksCard'
import Empty from './Empty'
import PaginationMain from '@/components/shared/PaginationMain'

import { Loader2 } from 'lucide-react'
import { useGetSchedules } from '@/hooks/services/appointments'
import EmptyList from '../ui/EmptyList'

const Schedules = ({schedules, count, error}:{
    schedules:AppointmentLink[] |null, count:number, error:string|null
}) => {

  const {handlePageChange, totalPages, loading, currentPage, scheduleList, isError } = useGetSchedules({schedules, count, error})

  return (
    <>
    {
        loading ? (
            <div className="flex justify-center w-full text-basePrimary/50 py-28"><Loader2  className='animate-spin'/></div>
          ) :
        isError ?
        <div className='py-10 w-full px-6 text-center '>{isError}</div>
        :
        !count  ?
        <Empty/>
        : !schedules?.length ?
        <EmptyList className='h-screen'/>
        :
        <>
        <section className="py-8 min-h-screen  ">
            <div className="grid max-[420px]:px-10  min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 min-[1700px]:grid-cols-5  gap-6">
                {
                    scheduleList?.map((item,idx)=>{
                        return (
                            <LinksCard key={idx} data={item}/>
                        )
                    })
                }
            </div>
        </section>
        <div className="flex justify-center  border-t">
            <PaginationMain
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
        </div>
        </>
    }
    </>
  )
}

export default Schedules