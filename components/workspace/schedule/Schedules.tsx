'use client'

import { AppointmentLink } from '@/types/appointments'
import React, { useState } from 'react'
import LinksCard from './LinksCard'
import Empty from './Empty'
import PaginationMain from '@/components/shared/PaginationMain'
import { createClient } from '@/utils/supabase/client'
import useUserStore from '@/store/globalUserStore'
import { Loader2 } from 'lucide-react'

const Schedules = ({schedules, count, error}:{
    schedules:AppointmentLink[] |null, count:number, error:string|null
}) => {
    const {user} = useUserStore()
    const [isError, setIsError] = useState(error)
    const [shedulesList, setScheduleList] = useState(schedules)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)

    const limit = 20

    const [totalPages, setTotalPages] = useState<number>(Math.ceil((count || 0) / limit))

    const fetchAppointments = async (page: number = 1) => {
        const supabase = createClient()
        try {
          setIsError('')
          setLoading(true)
          const offset = (page - 1) * limit
    
          let query = supabase
          .from('appointmentLinks')
          .select('*', { count: 'exact' }) 
          .eq('createdBy', user?.id)
          .range(offset, offset + limit - 1)
          .order('created_at', {ascending: false} ); 
    
          const { data, count, error } = await query
    
          if (error) {
            console.error('Error fetching appointments:', error)
            setIsError('Failed to fetch appointments. Please try again later.')
            return
          }
    
          setScheduleList(data || [])
          setTotalPages(Math.ceil((count || 0) / limit))
        } catch (error) {
          console.error('Server error:', error)
          setIsError('Server error occurred. Please try again later.')
        } finally {
          setLoading(false)
        }
      }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        fetchAppointments(page)
      }

  return (
    <>
    {
        loading ? (
            <div className="flex justify-center w-full text-basePrimary/50 py-28"><Loader2  className='animate-spin'/></div>
          ) :
        isError ?
        <div className='py-10 w-full px-6 text-center '>{isError}</div>
        :
        !schedules?.length  ?
        <Empty/>
        :
        <>
        <section className="py-8 min-h-screen  ">
            <div className="grid max-[420px]:px-10  min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 min-[1700px]:grid-cols-5  gap-6">
                {
                    shedulesList?.map((item,idx)=>{
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