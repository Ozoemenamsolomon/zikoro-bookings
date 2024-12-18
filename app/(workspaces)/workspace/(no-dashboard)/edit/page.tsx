import CreateAppointments from '@/components/workspace/create'
import { fetchSchedule } from '@/lib/server/schedules'
import { redirect } from 'next/navigation'
import React from 'react'

const EditAppointmentsPage = async ({searchParams}:{
  searchParams:{appointmentAlias?:string}
}) => {
  const appointmentAlias = (await searchParams).appointmentAlias
  if(!appointmentAlias) {
    redirect('/create')
  } 
  const {data,error } = await fetchSchedule(appointmentAlias!)
  return (
    <CreateAppointments appointment={{...data, createdBy:data?.createdBy?.id}} serverError={error} alias={appointmentAlias}/>
  )
}
export default EditAppointmentsPage