import { createClient } from "@/utils/supabase/server"
import { getUserData } from ".";
import { Goal, KeyResult } from "@/types/goal";

interface FetchContactsResult {
  data: Goal[] | null;
  error: string | null;
  count: number
}

export const fetchGoalsByUserId = async (
  q?: string
): Promise<FetchContactsResult> => {
    const supabase = createClient()
    const {user} = await getUserData()
  try {
    let query = supabase
      .from('goals')
      .select('*', { count: 'exact' }) 
      .eq('createdBy', user?.id)
    //   .or('status.is.null,status.neq.ARCHIVED')
      .order('created_at', {ascending: false} ); 

    // TODO: function to format goals with progress metric

    const { data, count, error } = await query;
// console.log({ data, count, error })
    if (error) {
      console.error('Error fetching goals:', error);
      return { data: null, error: error.message, count: 0 };
    }

    return { data, error: null, count: count ?? 0 };
  } catch (error) {
    console.error('Server error:', error);
    return { data: null, error: 'Server error', count: 0 };
  }
};


export const fetchGoalsByGoalId = async (
    goalId: string
  ): Promise<{goal:Goal|null,error:string|null}> => {
      const supabase = createClient()
    try {
      const { data, error}  = await supabase
        .from('goals')
        .select('*') 
        .eq('id', goalId)
        .single()

      if (error) {
        console.error('Error fetching goals! check your network', error);
        return { goal: null, error: error?.message };
      }
      return { goal:data, error: null,};
    } catch (error) {
      console.error('Server error:', error);
      return { goal: null, error: 'Server error, check your network' };
    }
  };

  export const fetchKeyResultsByGoalId = async (
    goalId: string
  ): Promise<{keyResults:KeyResult[]|null, error:string|null}> => {
      const supabase = createClient()
    try {
    const { data, error }  = await supabase
        .from('keyResults')
        .select('*') 
        .eq('goalId', goalId)
        .order('created_at', {ascending: false} ); 
  
  // console.log({ data, error })
      if (error) {
        console.error('Error fetching keyresults, check your network:', error);
        return { keyResults: null, error: error?.message};
      }
  
      return { keyResults:data, error: null,};
    } catch (error) {
      console.error('Server error:', error);
      return { keyResults: null, error: 'Server error, check your network' };
    }
  };
