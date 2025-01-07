import { AppointmentLink, } from "@/types/appointments";
import { createClient } from "@/utils/supabase/server"
import { getUserData } from ".";
import { randomInt } from "crypto";
import { createADMINClient } from "../../utils/supabase/no-caching";

interface FetchContactsResult {
  data: AppointmentLink[] | null;
  error: string | null;
  count: number;
  // workspaceId?:string;
}

export const fetchSchedules = async (
  workspaceAlias:string, userId?:string, start:number|string = 0, end:number|string = 19,
): Promise<FetchContactsResult> => {
    const supabase = createADMINClient()

    let id 
    if(userId){
      id = userId
    } else {
      const {user} = await getUserData()
      id = user?.id
    }

  try {
    let query = supabase
      .from('appointmentLinks')
      .select('*', { count: 'exact' }) 
      .eq('createdBy', id)
      .eq('workspaceId', workspaceAlias)
      .range(Number(start), Number(end))
      .order('created_at', {ascending: false} )
      // .neq("id", randomInt(1000000000))
    // const {count } = await supabase
    //   .from('bookings') 
    //   .select('*', { count: 'exact' } )
    //   .eq('createdBy', id)

    const { data, count, error } = await query;
    // console.log({workspaceAlias, data, count, error, id });

    if (error) {
      console.error('Error fetching schedules:', error);
      return { data: null, error: error.message, count: 0 };
    }

    return { data, error: null, count: count ?? 0 };
  } catch (error) {
    console.error('schedules: Server error:', error);
    return { data: null, error: 'Server error', count: 0 };
  }

};

export const fetchSchedule = async (
  alias: string
) => {
    const supabase = createADMINClient()

    try {
    const { data, error }  = await supabase
      .from('appointmentLinks')
      .select('*, createdBy(id, userEmail,organization,firstName,lastName,phoneNumber)') 
      .eq('appointmentAlias', alias)
      .single()

    // console.error({ data, error, alias });
    return { data, error: error?.message};
  } catch (error) {
    console.error('AppointmentLink Server error:', error);
    return { data: null, error: 'Server error'};
  }
};