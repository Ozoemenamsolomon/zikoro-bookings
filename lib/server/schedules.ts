import { AppointmentLink, } from "@/types/appointments";
import { createClient } from "@/utils/supabase/server"
import { getUserData } from ".";

interface FetchContactsResult {
  data: AppointmentLink[] | null;
  error: string | null;
  count: number;
}

export const fetchSchedules = async (
  q?: string
): Promise<FetchContactsResult> => {
    const supabase = createClient()
    const {user} = await getUserData()

  try {
    let query = supabase
      .from('appointmentLinks')
      .select('*', { count: 'exact' }) 
      .eq('createdBy', user?.id)
      .range(0, 19)
      .order('created_at', {ascending: false} ); 

    const { data, count, error } = await query;
    // console.error({user, data, count, error });

    if (error) {
      console.error('Error fetching contacts:', error);
      return { data: null, error: error.message, count: 0 };
    }

    return { data, error: null, count: count ?? 0 };
  } catch (error) {
    console.error('Server error:', error);
    return { data: null, error: 'Server error', count: 0 };
  }

};

export const fetchSchedule = async (
  alias: string
) => {
    const supabase = createClient()
    const {user} = await getUserData()

    try {
    const { data, error }  = await supabase
      .from('appointmentLinks')
      .select('*') 
      .eq('createdBy', user?.id)
      .eq('id', alias)
      .single()

    console.error({ data, error });
    return { data, error: error?.message};
  } catch (error) {
    console.error('AppointmentLink Server error:', error);
    return { data: null, error: 'Server error'};
  }
};