
import React, { Suspense } from 'react'
import { AppointmentLink } from '@/types/appointments'
import { Loader2 } from 'lucide-react'
import Schedules from './Schedules'

const SchedulesLinks = ({schedules, count, error}:{
    schedules:AppointmentLink[] |null, count:number, error:string|null
}) => {

  return (
    <main className='w-full'>
        <h4 className='text-xl font-semibold'>My Schedules</h4>
        <Suspense fallback={<section className='py-40 flex justify-center'><Loader2 className='animate-spin text-basePrimary/50'/></section>}>
            <Schedules schedules={schedules} error={error} count={count}/>
        </Suspense>
    </main>
  )
}

export default SchedulesLinks