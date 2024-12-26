import { createClient } from "@/utils/supabase/server";
import { getUserData } from ".";
import { BookingWorkSpace } from "@/types";

interface ResultProp {
  data: BookingWorkSpace[] | null;
  error: string | null;
  count: number;
}

export const fetchWorkspaces = async (
  userId?:string, start:number|string = 0, end:number|string = 19
): Promise<ResultProp> => {
    const supabase = createClient()

    let id 
    if(userId){
      id = userId
    } else {
      const {user} = await getUserData()
      id = user?.id
    }

  try {
    let query = supabase
      .from('bookingWorkSpace')
      .select('*', { count: 'exact' }) 
      .eq('workspaceOwner', id)
      .range(Number(start), Number(end))
      .order('created_at', {ascending: false} )

    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching bookingWorkSpace:', error);
      return { data: null, error: error.message, count: 0 };
    }

    return { data, error: null, count: count ?? 0 };
  } catch (error) {
    console.error('Booking Work Space: Server error:', error);
    return { data: null, error: 'Server error', count: 0 };
  }

};

export const fetchWorkspace = async (
  alias: string
) => {
    const supabase = createClient()

    try {
    const { data, error }  = await supabase
      .from('bookingWorkSpace')
      .select('*') 
      .eq('workspaceAlias', alias)
      .single()

    console.error({ data, error });
    return { data, error: error?.message};
  } catch (error) {
    console.error('AppointmentLink Server error:', error);
    return { data: null, error: 'Server error'};
  }
};