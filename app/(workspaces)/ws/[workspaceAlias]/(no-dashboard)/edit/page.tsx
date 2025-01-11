import CreateAppointments from '@/components/workspace/create';
import { fetchSchedule } from '@/lib/server/schedules';
import { fetchTeamMembers } from '@/lib/server/workspace';
import { BookingTeamMember } from '@/types';
import { redirect } from 'next/navigation';
import React from 'react';

const EditAppointmentsPage = async ({ searchParams, params }: { 
  searchParams: { appointmentAlias?: string;  },
  params: { workspaceAlias?: string },
 }
) => {
  const appointmentAlias = searchParams?.appointmentAlias;
  const workspaceAlias = params?.workspaceAlias;

  if (!appointmentAlias) {
    redirect('/create');
  }

  try {
    // Fetch both schedule and team members concurrently
    const [scheduleResponse, teamMembersResponse] = await Promise.all([
      fetchSchedule(appointmentAlias),
      workspaceAlias ? fetchTeamMembers(workspaceAlias) : Promise.resolve({ data: [], error: null }), 
    ]);

    const { data: scheduleData, error: scheduleError } = scheduleResponse;
    const { data: teamMembersData, error: teamMembersError } = teamMembersResponse;

    // Transform team members data into the required format
    const teams = teamMembersData?.map((team: BookingTeamMember) => ({
      label: `${team.userId?.firstName || ''} ${team.userId?.lastName || ''}`,
      value: `${team.email || ''}`,
    })) || [];

    return (
      <CreateAppointments
        teams={teams}
        appointment={{ ...scheduleData, createdBy: scheduleData?.createdBy?.id }}
        serverError={scheduleError || teamMembersError || null}
        alias={appointmentAlias}
      />
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    redirect('/ws');
  }
};

export default EditAppointmentsPage;
