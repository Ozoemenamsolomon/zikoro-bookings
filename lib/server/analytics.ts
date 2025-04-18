import { createClient } from "@/utils/supabase/server"
import { endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear, subMonths, subWeeks, subYears } from "date-fns";
import { getUserData } from ".";
import { Booking } from "@/types/appointments";
import { createADMINClient } from "@/utils/supabase/no-caching";

interface FetchBookingsResult {
  curList:Booking[], prevList:Booking[],
  error: string | null;
  count: number;
}

export const fetchAnalytics = async (
 {type='weekly',userId, workspaceId}: {type?: string, userId?:string, workspaceId:string} 
): Promise<FetchBookingsResult> => {
    const supabase = createADMINClient()
    if ( !workspaceId ) {
      console.error(" ANALYTICS ERROR: workspaceId missing")
      throw new Error('workspaceId is missing');
    }
    try {
      let currentStart, currentEnd, previousStart, previousEnd, id;

      if (type === 'weekly') {
        currentStart = startOfWeek(new Date()).toISOString();
        currentEnd = endOfWeek(new Date()).toISOString();
        previousStart = startOfWeek(subWeeks(new Date(), 1)).toISOString();
        previousEnd = endOfWeek(subWeeks(new Date(), 1)).toISOString();
      } else if (type  === 'monthly') {
        currentStart = startOfMonth(new Date()).toISOString();
        currentEnd = endOfMonth(new Date()).toISOString();
        previousStart = startOfMonth(subMonths(new Date(), 1)).toISOString();
        previousEnd = endOfMonth(subMonths(new Date(), 1)).toISOString();
      } else if (type  === 'yearly') {
        currentStart = startOfYear(new Date()).toISOString();
        currentEnd = endOfYear(new Date()).toISOString();
        previousStart = startOfYear(subYears(new Date(), 1)).toISOString();
        previousEnd = endOfYear(subYears(new Date(), 1)).toISOString();
      } else {
        throw new Error('Invalid type specified');
      }

    const { data: curList, error: curErr } = await supabase
      .from('bookings')
      .select('*, appointmentLinkId(id,appointmentName,brandColour,amount, locationDetails)')
      .eq("workspaceId", workspaceId)
      .gte('appointmentDate', currentStart)
      .lte('appointmentDate', currentEnd)
      // .order("appointmentDate", { ascending: true })

    if (curErr) {
      throw curErr
    }

    const { data: prevList, error: prevErr } = await supabase
      .from('bookings')
      .select('*, appointmentLinkId(id,appointmentName,brandColour,amount, locationDetails)')
      .eq("workspaceId", workspaceId)
      .gte('appointmentDate', previousStart)
      .lte('appointmentDate', previousEnd);
      // .order("appointmentDate", { ascending: true })

    if (prevErr) {
      throw prevErr
    }

    // console.log({ curList, prevList, prevErr, curErr});
    return { curList, prevList, error: null, count:0 };

  } catch (error) {
    console.error('Bookings Analytics error:', error);
    return { curList:[], prevList:[],  error: 'Error occured while fetching data',  count: 0 } 
  }
};

