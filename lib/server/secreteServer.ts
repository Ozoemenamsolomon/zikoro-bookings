import 'server-only'

import { createSecreteClient } from "@/utils/supabase/secrete-client";

export const fetchScheduleX = async (
  alias: string
) => {
    const supabase = createSecreteClient()

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

export const fetchWorkspaceX = async (
  alias: string
) => {
    const supabase = createSecreteClient()

    try {
    const { data, error }  = await supabase
      .from('organization')
      .select('*') 
      .eq('organizationAlias', alias)
      .single()
 
    console.error({ data, error });
    return { data, error: error?.message};
  } catch (error) {
    console.error('AppointmentLink Server error:', error);
    return { data: null, error: 'Server error'};
  }
};
