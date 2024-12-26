import SchedulesLinks from '@/components/workspace/schedule'
import { fetchSchedules } from '@/lib/server/schedules'
import React from 'react'

export const revalidate = 0;

const SchedulesPage = async ({searchParams}:{
  searchParams:string}) => {
    const {data,count,error} = await fetchSchedules()

  return (
    <SchedulesLinks schedules={data} count={count} error={error} />
  )
}

export default SchedulesPage

 