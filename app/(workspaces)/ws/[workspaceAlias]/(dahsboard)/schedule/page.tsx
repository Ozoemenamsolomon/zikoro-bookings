import SchedulesLinks from '@/components/workspace/schedule'
import { fetchSchedules } from '@/lib/server/schedules'
import React from 'react'

export const revalidate = 0;

const SchedulesPage = async ({searchParams,params}:{
  searchParams:string
  params:{workspaceAlias:string}
}) => {
  const workspaceAlias =( await params).workspaceAlias
    const {data,count,error} = await fetchSchedules(workspaceAlias)

  return (
    <SchedulesLinks schedules={data} count={count} error={error} />
  )
}

export default SchedulesPage

 