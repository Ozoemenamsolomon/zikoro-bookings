import { createClient } from "@/utils/supabase/server"
import { getUserData } from ".";
import { Booking } from "@/types/appointments";
import { subMonths, addMonths, isValid, startOfWeek, endOfWeek, format } from 'date-fns';

interface FetchBookingsResult {
  data:Booking[] | null, 
  error: string | null;
  count: number;
}

export const fetchCalendar = async (
 {view, userId}: {view?:string, userId?:string} 
): Promise<FetchBookingsResult> => {
    const supabase = createClient()

    let id;
    try {
      if(userId){
        id = userId
      } else {
        const {user} = await getUserData()
        id = user?.id
      }

      const { data, error, count } = await supabase
      .from('bookings')
      .select('*, appointmentLinkId(*, createdBy(userEmail, organization, firstName, lastName, phoneNumber))', { count: 'exact' })
      .eq("createdBy", id)
      // .order("appointmentDate", { ascending: true })

      // console.log('TESTING', { data,error,count});
    return {data, error:error?.message || null, count:0 };

  } catch (error) {
    console.error('Calendar Analytics error:', error);
    return {data:null, error: 'Error occured while fetching data',  count: 0 } 
  }
};

export function formatAppointmentsByMonth(data: Booking[]): Record<string, Booking[]> {
  // Group appointments by date for monthly view
  const formatted = data.reduce((acc, appointment) => {
    const date = new Date(appointment.appointmentDate as string).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, Booking[]>);

  return formatted;
}

export function formatAppointmentsByWeek(data: Booking[]): Record<string, Record<number, Booking[]>> {
  //TODO: Group appointments by day and 5mins interval for weekly view
  const formatted = data.reduce((acc, appointment) => {
    const date = new Date(appointment.appointmentDate as string);
    const day = date.toDateString();
    const hour = new Date(`${day} ${appointment.appointmentTime}`).getHours();
    if (!acc[day]) acc[day] = {};
    if (!acc[day][hour]) acc[day][hour] = [];
    acc[day][hour].push(appointment);
    return acc;
  }, {} as Record<string, Record<number, Booking[]>>);

  return formatted;
}

export async function fetchCalendarData(date: Date | string, viewingType: 'month' | 'week', userId?:string) {
  // Validate the viewing type and default to 'month' if invalid
  const viewing = viewingType === 'month' || viewingType === 'week' ? viewingType : 'month';

  // Parse and validate the provided date
  const parsedDate = new Date(date);
  const formattedDate = isValid(parsedDate) ? parsedDate : new Date();
  
  // Compute startRangeDate and endRangeDate
  const startRangeDate = subMonths(formattedDate, 2);
  const endRangeDate = addMonths(formattedDate, 2);
  
  const dateDisplay = (viewing === 'week') 
  ? `${format(startOfWeek(formattedDate), 'MMM d')} - ${format(endOfWeek(formattedDate), 'd, yyyy')}` 
  : format(formattedDate, 'MMMM yyyy');

  const supabase = createClient()

  let id;
    try {
      if(userId){
        id = userId
      } else {
        const {user} = await getUserData()
        id = user?.id
      }

  const { data, error } = await supabase
    .from('bookings') 
    .select('*, appointmentLinkId(*, createdBy(userEmail, organization, firstName, lastName, phoneNumber))', { count: 'exact' })
    .eq("createdBy", id)
    .gte('appointmentDate', startRangeDate.toISOString().split('T')[0])
    .lte('appointmentDate', endRangeDate.toISOString().split('T')[0]);
  
  const {count } = await supabase
    .from('bookings') 
    .select('*', { count: 'exact' } )
    .eq("createdBy", id)

  // Error handling
  if (error) {
    console.error(`Error fetching appointments from ${startRangeDate} to ${endRangeDate}:`, error);
    return {
      data: null,
      startRangeDate,
      endRangeDate,
      date: formattedDate,
      count,
      error:error?.message,
      dateDisplay,
    };
  }
  // Format the data based on the viewing type
  const formattedData = viewing === 'month'
    ? formatAppointmentsByMonth(data || {})
    : formatAppointmentsByWeek(data || {});

  console.log({ formattedData, startRangeDate, endRangeDate, date: formattedDate , count, dateDisplay, id});

  // Return the formatted data and range details
  return {
    data: formattedData,
    startRangeDate,
    endRangeDate,
    date: formattedDate,
    count,
    error: null, 
    dateDisplay,
  }
} catch (error){
    console.error(`Error fetching appointments from ${startRangeDate} to ${endRangeDate}:`, error);
    return {
      data: null,
      startRangeDate,
      endRangeDate,
      date: formattedDate,
      count:0,
      error: `Error fetching appointments from ${startRangeDate} to ${endRangeDate}`,
      dateDisplay,
    };
}
}


