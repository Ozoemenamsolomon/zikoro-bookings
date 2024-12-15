import CreateAppointments from '@/components/workspace/create'
import { fetchSchedule } from '@/lib/server/schedules'
import { redirect } from 'next/navigation'
import React from 'react'

const EditAppointmentsPage = async ({searchParams:{appointmentAlias}}:{
  searchParams:{appointmentAlias?:string}
}) => {
  if(!appointmentAlias) {
    redirect('/create')
  } 
  const {data,error } = await fetchSchedule(appointmentAlias!)
  return (
    <CreateAppointments appointment={{...data, createdBy:data?.createdBy?.id}} serverError={error} alias={appointmentAlias}/>
  )
}
export default EditAppointmentsPage