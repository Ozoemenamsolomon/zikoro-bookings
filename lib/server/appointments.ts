import { Booking, BookingsContact } from "@/types/appointments";
import { createClient } from "@/utils/supabase/server"
import { getUserData } from ".";
import { startOfToday } from "date-fns";

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
 payload?: {userId?: string, date?: string, type?: string} 
): Promise<FetchBookingsResult> => {
    const supabase = createClient()

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
      .order("appointmentDate", { ascending: true })

      if(payload?.type==='past-appointments'){
        query.lt('appointmentDate', today)
      } else {
        query.gte('appointmentDate', today)
      }

    // If 'q' is provided, add additional filtering
    // if (date) {
    //   query = query.eq('category', date); 
    // }

    const { data, count, error } = await query;
    // console.error({ data, count, error });

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

