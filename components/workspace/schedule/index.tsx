
import React, { Suspense } from 'react'
import { AppointmentLink } from '@/types/appointments'
import Schedules from './Schedules'
import Loading from '@/components/shared/Loader'

const SchedulesLinks = ({schedules, count, error}:{
    schedules:AppointmentLink[] |null, count:number, error:string|null
}) => {

  return (
    <main className='w-full'>
        <h4 className='text-xl font-semibold'>My Schedules</h4>
        <Suspense fallback={<section className='py-40 flex justify-center'><Loading/></section>}>
            <Schedules schedules={schedules} error={error} count={count}/>
        </Suspense>
    </main>
  )
}

export default SchedulesLinks