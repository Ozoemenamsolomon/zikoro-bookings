'use client'

import SelectDuration from './SelectDuration'
import TotalBookings from './TotalBookings'
import TotalRevenue from './TotalRevenue'
import TotalCustomers from './TotalCustomers'
import UpcomingAppointments from './UpcomingAppt'
import CanceledAppointments from './CanceledAppt'
import RescheduledAppointments from './RescheduledAppt'
import { useGetBookingsAnalytics } from '@/hooks/services/appointments'
import { Booking,  } from '@/types/appointments'

export interface SectionOneProps {
  isLoading: boolean;
  type:string;
  error: string | null;
  getBookings?: () => void;
  current: Booking[];
  previous: Booking[];
}

const SectionOne = ({curList, prevList, typeParam}:{curList:Booking[]|null, prevList:Booking[]|null, typeParam?:string}) => {

  const {type, handleSetType, isLoading, error, current, previous,} = useGetBookingsAnalytics({curList, prevList, typeParam})

  return (
    <div className="grid h-ful p-4 py-8 space-y-4 rounded-lg bg-white border">

    <header className="flex w-full justify-end gap-4 items-center">
        <p className="">Sort</p>
        <SelectDuration type={type} setType ={handleSetType} />
    </header>

    <section className="grid xs:grid-cols-2 md:grid-cols-3  gap-4 xl:grid-cols-2 text-center">
        <TotalBookings type={type} isLoading={isLoading} error={error} current={current} previous={previous}/>
        <TotalRevenue type={type} isLoading={isLoading} error={error}  current={current} previous={previous}/>
        <TotalCustomers type={type} isLoading={isLoading} error={error}  current={current} previous={previous}/>
        <UpcomingAppointments type={type} isLoading={isLoading} error={error} current={current} previous={previous}/>
        <CanceledAppointments  type={type} isLoading={isLoading} error={error} current={current} previous={previous}/> 
        <RescheduledAppointments  type={type} isLoading={isLoading} error={error}  current={current} previous={previous}/>
    </section>
</div>
  )
}

export default SectionOne