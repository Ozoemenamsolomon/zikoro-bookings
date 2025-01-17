import CreateAppointments from '@/components/workspace/create'
import { fetchTeamMembers } from '@/lib/server/workspace'
import { BookingTeamMember } from '@/types'
import React from 'react'

const CreateAppointmentsPage = async ({params}:{
  params:{workspaceAlias:string}
}) => {
     
    const {data,error,} = await fetchTeamMembers(params?.workspaceAlias!)
    const teams = data?.map((team:BookingTeamMember)=> {
      return {
      label: `${team.userId?.firstName} ${team.userId?.lastName}`,
      value: `${team.email}`
    }})
       
  return (
    <CreateAppointments teams={teams || []} />
  )
}

export default CreateAppointmentsPage