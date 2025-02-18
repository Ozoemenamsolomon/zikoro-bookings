import Appointments from '@/components/workspace/appointents/Appointments';
import { fetchAppointments } from '@/lib/server/appointments';
import { BookingsQuery } from '@/types/appointments';
import React from 'react';

export const COUNTLIMIT = 20;
export const dynamic = 'force-dynamic';

const AppointmentsPage = async ({
  searchParams,
  params,
}: {
  searchParams: BookingsQuery;
  params: { workspaceAlias?: string };
}) => {
  const {
    page,
    date,
    search,
    appointmentDate,
    appointmentName,
    teamMember,
    status,
    type,
  } = await searchParams;

  // Check if any of the listed fields exist
  const hasFilters = date || search || appointmentDate || appointmentName || teamMember || status;

  const searchQuery: BookingsQuery = {
    page: Number(page) || 1,
    type: !hasFilters ? type || 'upcoming-appointments' : null, // ✅ Do not set default if filters exist
    date: date || null,
    search: search?.length ? search : null,
    appointmentDate: appointmentDate || null,
    appointmentName: appointmentName || null,
    teamMember: teamMember || null,
    status: status?.length ? status : null,
  };

  const workspaceAlias = (await params).workspaceAlias;

  // Fetch appointments
  const { data, count, error, querySize } = await fetchAppointments({
    workspaceId: workspaceAlias!,
    searchQuery,
  });

  console.log({ data, count, error, searchParams, querySize });

  return (
    <Appointments
      groupedBookingData={data}
      fetchedcount={count}
      fetchError={error}
      searchQuery={searchQuery}
    />
  );
};

export default AppointmentsPage;
