'use client'
import PaginationMain from '@/components/shared/PaginationMain'
import { useAppointmentContext } from '@/context/AppointmentContext'
import useUserStore from '@/store/globalUserStore'
import { createClient } from '@/utils/supabase/client'
import { format, startOfToday } from 'date-fns'
import { FolderOpen, Loader2Icon, SquarePen } from 'lucide-react'
import React, { Suspense, useCallback, useEffect, useState } from 'react'

const AppointmentHistory = () => {
    const {contact} = useAppointmentContext()
    const { user } = useUserStore()
    const [bookings, setBookings] = useState<any[]>([])
    const [totalPages, setTotalPages] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [isError, setIsError] = useState<string>('')
    const [currentPage, setCurrentPage] = useState(1)
    const [size, setSize] = useState<{size:number|null,firstItem:string|null}>({size:null,firstItem:''})
    const limit = 10
    // const today = useCallback(()=>startOfToday().toISOString(),[]) 
  
    const fetchAppointments = async (page: number = 1) => {
      const supabase = createClient()
      try {
        setIsError('')
        setLoading(true)
        const offset = (page - 1) * limit
  
        let query = supabase
          .from('bookings')
          .select(
            '*', 
            { count: 'exact' }
          )
          .eq('createdBy', user?.id)
          .eq('participantEmail', contact?.email)
        //   .gte('appointmentDate', today)
          .range(offset, offset + limit - 1)
          
        const {data:first}= await query
        const { data, count, error } = await query.order('appointmentDate', { ascending: false })
        
        console.error(data, error)
        if (error) {
          console.error('Error fetching appointments:', error)
          setIsError('Failed to fetch appointments. Please try again later.')
          return
        }
  
        setBookings(data || [])
        setSize({size:count, firstItem: first && first[0]?.created_at})
        setTotalPages(Math.ceil((count || 0) / limit))
      } catch (error) {
        console.error('Server error:', error)
        setIsError('Server error occurred. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
  
    useEffect(() => {
      if (contact) {
        fetchAppointments(currentPage)
      }
    }, [contact,])
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page)
      fetchAppointments(page)
    }
  return (
    <section className='md:p-3 '>
        <div className="md:border md:rounded-lg bg-white flex-col h-full justify-between">
            <div className="">
                <header className=" w-full py-4 text-center border-b bg-baseBg font-medium">
                    Appointment History
                </header>

                <section className="flex flex-col gap-3 w-full min-h-screen p-3">
                    {loading ? (
                        <div className="flex justify-center w-full h-full text-basePrimary/50 py-20"><Loader2Icon className='animate-spin'/></div>
                    ) : isError ? (
                        <p className="text-center py-20 w-full text-red-500">{isError}</p>
                    ) : bookings.length ? (
                        <>
                        <div className="w-full text-center py-4 font">
                            Booked {size?.size} times since {size?.firstItem ? format(new Date(size?.firstItem), 'dd MMMM, yyyy') : null}
                        </div>
                        {bookings.map((item, idx) => {
                            const { appointmentDate, appointmentName, appointmentTimeStr, appointmentLinkId } = item

                            return (
                            <div key={idx} className="flex justify-between gap-3 border-b pb-3">
                                <div className="flex gap-3 items-center">
                                    <div className="rounded-md text-center overflow-hidden border shrink-0 w-24">
                                        <div className="p-1 w-full bg-baseBg text-sm shrink-0 overflow-clip">
                                            {format(new Date(appointmentDate), 'MMMM')}
                                        </div>
                                        <div className="p-2 border-t text-base font-semibold">
                                            {format(new Date(appointmentDate), 'd')}
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <p className="font-medium">{appointmentName}</p>
                                        <p>{appointmentTimeStr}</p>
                                        <p className='text-[12px]'>{appointmentLinkId?.locationDetails || 'No location details'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-center shrink-0">
                                    <div className="flex p-2 rounded-full bg-purple-100 border text-basePrimary/60">
                                        <SquarePen size={16}/>
                                    </div>
                                    <div className="flex p-2 rounded-full bg-purple-100 border text-basePrimary/60">
                                        <FolderOpen size={16}/>
                                    </div>
                                </div>
                            </div>
                            )
                        })}
                        <div className="flex justify-center py-2">
                            <PaginationMain
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                        </>
                    ) : (
                    <div className="h-96 w-full flex flex-col gap-2 justify-center items-center">
                        <FolderOpen size={40} className='text-purple-100'/>
                        <p className="text-center text-slate-500">No Appointments</p>
                    </div>
                    )}
                </section>
            </div>
        </div>
    </section>
  )
}

export default AppointmentHistory