import { Booking, BookingNote, BookingsQuery, } from "@/types/appointments";
import { createADMINClient } from "@/utils/supabase/no-caching";
import { endOfMonth,  startOfMonth, startOfToday,  } from "date-fns";
import { limit } from "@/constants";
import { settings } from "../settings";

export interface GroupedBookings {
  [date: string]: Booking[];
}

interface FetchBookingsResult {
  data: GroupedBookings | null;
  error: string | null;
  count: number;
  querySize:number
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
   payload?: {workspaceId:string, searchQuery: BookingsQuery,  userId?: string, } 
): Promise<FetchBookingsResult> => {

    const param = payload?.searchQuery

    const supabase = createADMINClient()
    if(!payload?.workspaceId){
      console.error('APPOINTMENT BOOKINGS: workspaceAlias is missing')
    }
    
    let today = startOfToday().toISOString()

  try {
    let query = supabase
      .from("bookings")
      .select(`*, appointmentLinkId(*, createdBy(id, userEmail,organization,firstName,lastName,phoneNumber))`, { count: 'exact' })
      .eq("workspaceAlias", payload?.workspaceId)

      const {count} = await query

      if (param?.search) {
        query = query.or(
          `appointmentName.ilike.%${param.search}%,appointmentType.ilike.%${param.search}%,bookingStatus.ilike.%${param.search}%,firstName.ilike.%${param.search}%,lastName.ilike.%${param.search}%,participantEmail.ilike.%${param.search}%,phone.ilike.%${param.search}%`
        );
      }

      // filters data within the range of selected date's start of month and end of month
      if (param?.date){
        query.gte('appointmentDate', startOfMonth(new Date(param?.date!)).toISOString())
             .lte('appointmentDate', endOfMonth(new Date(param?.date!)).toISOString())                   
      }

      if (param?.type==='past-appointments'){
        query.lt('appointmentDate', today)
      }

      if (param?.type==='upcoming-appointments'){
        query.gte('appointmentDate', today)
      }

      if (param?.from && param?.to){
        const from =  new Date(param?.from).toISOString()
        const to =  new Date(param?.to).toISOString()
        query.gte('appointmentDate', from)
        query.lte('appointmentDate', to)
      }

      if (param?.appointmentName) {
        let appointmentName = JSON.parse(param.appointmentName); // Parse input array
        const searchConditions = appointmentName.map((name:string) => `appointmentName.ilike.%${name}%`);
        
        query.or(searchConditions.join(","));
      }

      if (param?.status){
        let statusList = JSON.parse(param.status); // Parse input array
        const searchConditions = statusList.map((status:string) => `bookingStatus.ilike.%${status}%`);
        
        query.or(searchConditions.join(","))
      }

      if (param?.teamMember) {
        let teamMembersList = JSON.parse(param.teamMember); // Parse input array

        query.ilike("teamMembers::text", `%${teamMembersList}%`);
      }
      
      // if (param?.teamMember) {
      //   query.contains("teamMembers", [param.teamMember]); // Works for JSONB array filtering
      // }
      // if (param?.teamMember) {
      //   query.filter("teamMembers::jsonb", "@>", JSON.stringify([param.teamMember]));
      // }
      
      // Pagination handling
      const start = param?.page ? (param?.page - 1) * settings.countLimit : 0;
      const limit = start + settings.countLimit || 20; 

      query = query.range(start, start + limit - 1); // Supabase uses 0-based indexes

      const { data, count:querySize, error } = await query.order('appointmentDate', {ascending:false});

    if (error) {
      console.error('Error fetching appointments:', error, param);
      return { data: null, error: error.message, count: 0, querySize:0 };
    }

    return { data:groupBookingsByDate(data), error: null, count: count ?? 0,  querySize: querySize??0 };

  } catch (error) {
    console.error('Server error:', error);
    return { data: null, error: 'Server error', count: 0 , querySize:0};
  }

};

export const fetchAppointmentNames = async (
  workspaceId: string, 
  userId?: string
): Promise<{
  data: { appointmentName: string; businessName: string | null }[] | null;
  error: string | null;
  count: number | null;
}> => {
  const supabase = createADMINClient();

  if (!workspaceId) {
    console.error('APPOINTMENT BOOKINGS: workspaceAlias is missing');
    return { data: null, error: 'Workspace ID is required', count: 0 };
  }

  try {
    let { data, error, count } = await supabase
      .from("bookings")
      .select(`appointmentName, appointmentLinkId(businessName)`, { count: 'exact' })
      .eq("workspaceAlias", workspaceId);
// console.log({ data, error, count })
    if (error) {
      console.error('APPOINTMENT NAMES:', error);
      return { data: null, error: error.message, count: 0 };
    }

    // Ensure data exists and map correctly
    const formattedData = (data || []).map(item => ({
      appointmentName: item.appointmentName,
      businessName: item.appointmentLinkId?.businessName || null, // Handle array case
    }));

    // Use Map to filter unique values based on appointmentName
    const uniqueNames = Array.from(
      new Map(formattedData.map(item => [item.appointmentName, item])).values()
    );

    return { data: uniqueNames, error: null, count };
  } catch (err) {
    console.error('Error fetching appointments:', err);
    return { data: null, error: 'Error fetching appointments', count: 0 };
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
      //TODO: .eq("workspaceId", payload?.workspaceId)
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
   workspaceId:string;
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
   workspaceId,
 }: FetchAppointmentHistoryParams): Promise<FetchAppointmentHistoryResult> {
  const supabase = createADMINClient()

   try {
     // Initial query
     let query = supabase
       .from("bookings")
       .select(
         "id, created_at, appointmentDuration, appointmentDate, appointmentName, appointmentTimeStr, appointmentLinkId(locationDetails)",
         { count: "exact" }
       )
      .eq("workspaceAlias", workspaceId)
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
 
 export const fetchBookingNotes = async (bookingId:string): Promise<{data:BookingNote[]|null, error:string|null,  count:number|null}> => {
  const supabase = createADMINClient()
    try {
    const { data, error, count } = await supabase
      .from("bookingNote")
      // .select("*", {count:'exact'})
      .select("*, createdBy(id, userEmail, organization, firstName, lastName, phoneNumber)", {count:'exact'})
      .eq("bookingId", bookingId)
      .order('created_at', { ascending: false });

      console.log({ data, error,});
      if (error) {
        console.error('Error fetching bookings:', error);
        return { data: null, error: error.message,count:null };
      }
      return { data, error: null, count };
    } catch (error) {
      console.error('Server error:', error);
      return { data: null, error: 'Server error', count:null };
    }
};
