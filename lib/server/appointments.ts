import { Booking, } from "@/types/appointments";
import { createADMINClient } from "@/utils/supabase/no-caching";
import { getUserData } from ".";
import { endOfMonth, startOfDay, startOfMonth, startOfToday, startOfWeek } from "date-fns";
import { limit } from "@/constants";

export interface GroupedBookings {
  [date: string]: Booking[];
}

interface FetchBookingsResult {
  data: GroupedBookings | null;
  error: string | null;
  count: number;
}

const groupBookingsByDate = (bookings: Booking[]): GroupedBookings => {
  return Array.isArray(bookings) ? bookings?.reduce((acc: GroupedBookings, booking: Booking) => {
    const date = booking.appointmentDate;
    if (date) {
      const dateString =
        typeof date === "string" ? date : date.toISOString().split("T")[0];
      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(booking);
    }
    return acc;
  }, {})
  : {};
};

export const fetchAppointments = async (
   payload?: {workspaceId:string, userId?: string, date?: string, type?: string} 
): Promise<FetchBookingsResult> => {
    const supabase = createADMINClient()
    if(!payload?.workspaceId){
      console.error('APPOINTMENT BOOKINGS: workspaceId is missing')
    }
    let id 
    if(payload?.userId){
      id = payload?.userId
    } else {
      const {user} = await getUserData()
      id = user?.id
    }
    let today = startOfToday().toISOString()
  try {
    let query = supabase
      .from("bookings")
      .select(`*, appointmentLinkId(*, createdBy(id, userEmail,organization,firstName,lastName,phoneNumber))`, { count: 'exact' })
      .eq("createdBy", id)
      .eq("workspaceId", payload?.workspaceId)
      .order("appointmentDate", { ascending: true })

      const {count} = await query

      if (payload?.date && !payload?.type){
        query.gte('appointmentDate', startOfMonth(new Date(payload?.date!)).toISOString())
             .lte('appointmentDate', endOfMonth(new Date(payload?.date!)).toISOString())                   
      } else if (payload?.type==='past-appointments'){
        query.lt('appointmentDate', today)
      } else {
        query.gte('appointmentDate', today)
      }

    const { data, error } = await query;
    // console.log({date: startOfWeek(new Date(payload?.date!)).toISOString(), data, }, 'REFETCHING')

    if (error) {
      console.error('Error fetching appointments:', error);
      return { data: null, error: error.message, count: 0 };
    }

    return { data:groupBookingsByDate(data), error: null, count: count ?? 0 };

  } catch (error) {
    console.error('Server error:', error);
    return { data: null, error: 'Server error', count: 0 };
  }

};

export const fetchBookings = async (
  {appointmentDate, appointmentLinkId}:{appointmentDate:string, appointmentLinkId:string} 
 ): Promise<{data:Booking[]|null, error:string|null}> => {
     const supabase = createADMINClient()
   try {
    const { data, error, status } = await supabase
      .from("bookings")
      .select("*")
      .eq("appointmentDate", appointmentDate)
      .eq("appointmentLinkId", appointmentLinkId)
      .neq("bookingStatus", 'CANCELLED')
      .order('created_at', { ascending: false });

      // console.log({ data, error,status, appointmentDate, appointmentLinkId });
     if (error) {
       console.error('Error fetching bookings:', error);
       return { data: null, error: error.message, };
     }
     return { data, error: null };
   } catch (error) {
     console.error('Server error:', error);
     return { data: null, error: 'Server error',  };
   }
 };
 

 type FetchAppointmentHistoryParams = {
   userId?: string;
   contactEmail: string;
 };
 
 type FetchAppointmentHistoryResult = {
   initialData: Booking[] | null;
   data: Booking[] | null;
   count: number | null;
   error: string | null;
 };
 
 export async function fetchAppointmentHistory({
   userId,
   contactEmail,
 }: FetchAppointmentHistoryParams): Promise<FetchAppointmentHistoryResult> {
  const supabase = createADMINClient()

  let id 
  if(userId){
    id = userId
  } else {
    const {user} = await getUserData()
    id = user?.id
  }

   try {
     // Initial query
     let query = supabase
       .from("bookings")
       .select(
         "id, created_at, appointmentDuration, appointmentDate, appointmentName, appointmentTimeStr, appointmentLinkId(locationDetails)",
         { count: "exact" }
       )
       .eq("createdBy", id)
       .eq("participantEmail", contactEmail)
       .range(0, limit - 1);
 
     // Fetch initial data
     const { data: initialData, error: initialError } = await query;
     if (initialError) throw new Error(initialError.message);
 
     // Fetch ordered data
     const { data, count, error } = await query.order("appointmentDate", { ascending: false });
     if (error) throw new Error(error.message);
 
     return { initialData, data, count, error: null };
   } catch (err: any) {
     console.error("Error fetching bookings:", err.message);
     return { initialData: null, data: null, count: null, error: err.message };
   }
 }
 
 
