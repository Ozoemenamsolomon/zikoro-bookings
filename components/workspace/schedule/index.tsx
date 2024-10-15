
import React, { Suspense } from 'react'
import LinksCard from './LinksCard'
import Empty from './Empty'
import { AppointmentLink } from '@/types/appointments'
import { Loader2 } from 'lucide-react'

const SchedulesLinks = ({schedules, error}:{
    schedules:AppointmentLink[] |null, count:number, error:string|null
}) => {
    
  return (
    <main className='w-full'>
        <h4 className='text-xl font-semibold'>My Schedules</h4>
        <Suspense fallback={<section className='py-40 flex justify-center'><Loader2 className='animate-spin text-basePrimary/50'/></section>}>
            {
                error ?
                <div className='py-10 mx-auto px-6'>{error}</div>
                :
                !schedules?.length  ?
                <Empty/>
                :
                <section className="pt-8 grid max-[420px]:px-10  min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 min-[1700px]:grid-cols-5  gap-6">
                    {
                        schedules?.map((item,idx)=>{
                            return (
                                <LinksCard key={idx} data={item}/>
                            )
                        })
                    }
                </section>
            }
        </Suspense>
        
    </main>
  )
}

export default SchedulesLinks