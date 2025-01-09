import Appointments from '@/components/workspace/appointents/Appointments';
import { fetchAppointments } from '@/lib/server/appointments';
import React from 'react'

const AppointmentsPage = async ({
    searchParams ,  params,

  }: {
    searchParams: { date: string };  params: { workspaceAlias?:string },

  }) => {
    const workspaceAlias = (await params).workspaceAlias
    const {data,count,error} = await fetchAppointments({workspaceId:workspaceAlias!, date:searchParams?.date})
    // console.log({data,count,error, searchParams})
    return ( 
      <Appointments groupedBookingData={data} fetchedcount={count} fetchError={error} dateHash={searchParams?.date}/>
      );
  };
  
export default AppointmentsPage