import CreateAppointments from '@/components/workspace/create'
import { fetchSchedule } from '@/lib/server/schedules'
import { redirect } from 'next/navigation'
import React from 'react'

const EditAppointmentsPage = async ({searchParams:{alias}}:{
  searchParams:{alias?:string}
}) => {
  if(!alias) {
    redirect('/create')
  } 
  const {data,error } = await fetchSchedule(alias!)
  return (
    <CreateAppointments appointment={data} serverError={error} alias={alias}/>
  )
}
export default EditAppointmentsPage