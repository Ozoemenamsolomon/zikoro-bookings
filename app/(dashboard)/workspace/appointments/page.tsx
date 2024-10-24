import Appointments from '@/components/workspace/appointents/Appointments';
import { fetchAppointments } from '@/lib/server/appointments';
import React from 'react'

const AppointmentsPage = async ({
    searchParams ,
  }: {
    searchParams: { date: string };
  }) => {
    const {data,count,error} = await fetchAppointments({date:searchParams?.date})
    // console.log({data,count,error, searchParams})
    return ( 
      <Appointments groupedBookingData={data} fetchedcount={count} fetchError={error} dateHash={searchParams?.date}/>
      );
  };
  
export default AppointmentsPage