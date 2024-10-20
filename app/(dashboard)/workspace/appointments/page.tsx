import Appointments from '@/components/workspace/appointents/Appointments';
import { fetchAppointments } from '@/lib/server/appointments';
import React from 'react'

const AppointmentsPage = async ({
    searchParams: { s },
  }: {
    searchParams: { s: string };
  }) => {
    const {data,count,error} = await fetchAppointments()
    // console.log({data,count,error})
    return ( 
      // <Appointments data={data} searchquery={s} />
      <Appointments groupedBookingData={data} fetchedcount={count} fetchError={error} />
      );
  };
  
export default AppointmentsPage