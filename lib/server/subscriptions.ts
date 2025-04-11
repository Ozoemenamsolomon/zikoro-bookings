'use server'

import { createClient } from "@/utils/supabase/server";
import { getUserData } from ".";
import { BookingsCurrencyConverter, BookingTeamInput, BookingTeamMember, BookingTeams, Organization, OrganizationInput, SubscriptionBooking } from "@/types";
import { User } from "@/types/appointments";
import { generateSlugg } from "../generateSlug";
import { createADMINClient } from "@/utils/supabase/no-caching";

export const createSubsription = async (plan:SubscriptionBooking) => {
    const supabase = createClient()
    try {
        const { data, error } = await supabase
            .from('subscriptionBookings')
            .insert(plan)
            .select()
            .single()
        console.log({ data, error })
        if (error) {
            console.error('Error inserting subscriptionplan: ', error);
            return { data: null, error: error.message };
        }
        return { data, error:null };
    } catch (error) {
        console.log('INSERTING SUBSCRIPTION UNHANDLED ERROR: ', error)
        return { data:null, error:'An error occurred while processing the request' };
    }
}