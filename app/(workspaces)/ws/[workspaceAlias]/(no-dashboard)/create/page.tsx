import CreateAppointments from '@/components/workspace/create'
import { fetchActiveTeamMembers, fetchTeamMembers } from '@/lib/server/workspace'
import { BookingTeamMember } from '@/types'
import React from 'react'

const CreateAppointmentsPage =  () => {
  return (
    <CreateAppointments  />
  )
}

export default CreateAppointmentsPage