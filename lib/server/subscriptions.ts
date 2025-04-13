'use server'

import { createClient } from "@/utils/supabase/server";
import { getUserData } from ".";
import { BookingsCurrencyConverter, BookingTeamInput, BookingTeamMember, BookingTeams, Organization, OrganizationInput, SubscriptionBooking, SubscriptionPlanInfo } from "@/types";
import { User } from "@/types/appointments";
import { generateSlugg } from "../generateSlug";
import { createADMINClient } from "@/utils/supabase/no-caching";
import { subscriptionPlansValue } from "@/constants";

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


export const fetchSubscriptionPlan = async (workspaceId:string):Promise<{data:SubscriptionBooking|null,error:string|null}> => {
    const supabase = createClient()
    try {
        const { data, error } = await supabase
            .from('subscriptionBookings')
            .select()
            .eq('workspaceAlias',workspaceId)
            .single()

        console.log({ data, error })
        if (error) {
            console.error('Error fetching a subscriptionplan: ', error);
            return { data: null, error: error.message };
        }
        return { data, error:null };
    } catch (error) {
        console.log('FETCHING SUBSCRIPTION UNHANDLED ERROR: ', error)
        return { data:null, error:'An error occurred while processing the request' };
    }
}

import { addMonths, differenceInCalendarMonths,parseISO, isBefore,differenceInCalendarDays   } from "date-fns";

export async function getPermissionsFromSubscription(
  organization: Organization, isbooking?:boolean,
): Promise<SubscriptionPlanInfo> {
    const now = new Date();
    const subscriptionPlan = organization.subscriptionPlan || "Free";
  
    const endDate = organization.subscriptionEndDate ? parseISO(organization.subscriptionEndDate) : null;
    const startDate = organization.subscritionStartDate ? parseISO(organization.subscritionStartDate) : null;
  
    const isExpired = !endDate || isBefore(endDate, now);
    const validDaysRemaining = isExpired ? 0 : differenceInCalendarDays(endDate, now);
    const daysSinceExpiration = isExpired && endDate ? differenceInCalendarDays(now, endDate) : null;
  
    let effectivePlan: "Free" | "Lite" | "Professional" | "Enterprise" = isExpired ? "Free" : subscriptionPlan;

    const planStatus: "active" | "expired" | "free" = isExpired
    ? daysSinceExpiration !== null && daysSinceExpiration > 0
      ? "expired"
      : "free"
    : "active";

    let displayMessage = "";

    if (planStatus === "expired") {
        displayMessage =
        daysSinceExpiration && daysSinceExpiration < 30
            ? `Your previous ${subscriptionPlan} plan expired ${daysSinceExpiration} day(s) ago. Reactivate now to keep your data and regain access to premium features.`
            : `You're on the FREE plan. Upgrade anytime to access more features.`;
    } else if (planStatus === "active") {
        displayMessage = `Your ${subscriptionPlan} plan is active and will expire in ${validDaysRemaining} day(s).`;
    } else {
        displayMessage = `You're on the FREE plan. Upgrade anytime to access more features.`;
    }

    const shouldShowRenewPrompt = planStatus === "expired" && (daysSinceExpiration || 0) < 30;
  
    const workspaceAlias = organization.organizationAlias!

    const plan = subscriptionPlansValue.find((p) => p.label === effectivePlan);
    if (!plan) throw new Error("Invalid plan type");

    let bookingsCount = 0;

  // Only fetch count if we have both start and end dates (if checking for booking)
    if (startDate && endDate && isbooking) {
    // How many months have passed since startDate up to now?
    const monthsSinceStart = differenceInCalendarMonths(now, startDate);

    // Get the start and end of the current month period based on subscription start
    const currentPeriodStart = addMonths(startDate, monthsSinceStart);
    const nextPeriodStart = addMonths(startDate, monthsSinceStart + 1);

    // Ensure we're within subscription period
    if (isBefore(currentPeriodStart, endDate)) {
        bookingsCount = await fetchBookingsLimitCount(
        currentPeriodStart.toISOString(),
        nextPeriodStart.toISOString(),
        workspaceAlias
        );
    } else {
        bookingsCount = 0;
    }
    }

  const { maxBookingsPerMonth, smsNotification, teamMembers } = plan.features;
    // if you don't want to do total lockout then when returning to freemium, you have to update the organization table to free with the start date and en date ... this will help to track the usage ...
    const totalPlanDays = startDate && endDate ? differenceInCalendarDays(endDate, startDate) : 0;
    const daysLeftPercentage = totalPlanDays ? (validDaysRemaining / totalPlanDays) * 100 : 0;
    const showTrialEndingSoonPrompt = planStatus === "active" && validDaysRemaining <= 5;
    const isOnFreePlan = effectivePlan === "Free";
    const reactivateLink = `/ws/${workspaceAlias}/settings/workspace`;

    return {
        bookingLimit: isExpired ? 0 : maxBookingsPerMonth,
        bookingsCount,
        activeBooking: bookingsCount < maxBookingsPerMonth,
        smsEnabled: smsNotification,
        teamLimit: teamMembers,
        isExpired,
        effectivePlan: effectivePlan as SubscriptionPlanInfo["effectivePlan"],
        validDaysRemaining,
        daysSinceExpiration,
        displayMessage,
        planStatus,
        shouldShowRenewPrompt,
        isOnFreePlan,
        daysLeftPercentage,
        showTrialEndingSoonPrompt,
        reactivateLink,
        subscriptionEndDate: endDate?.toISOString()!
    };
    
}

// Fetch bookings count in date range
const fetchBookingsLimitCount = async (startDate: string, endDate: string, workspaceAlias:string) => {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("bookings")
    .select("id", { count: "exact" })
    .eq('workspaceAlias', workspaceAlias)
    .gte("created_at", startDate)
    .lt("created_at", endDate);
console.log({ count, error })
  if (error) {
    console.error("Failed to fetch bookings count:", error);
    return 0;
  }

  return count || 0;
};

// TODO:
// {permissions.shouldShowRenewPrompt && (
//     <Callout
//       title="Plan Expired"
//       message={permissions.displayMessage}
//       actionLabel="Renew Plan"
//       actionHref={permissions.reactivateLink}
//     />
//   )}
  
//   {permissions.showTrialEndingSoonPrompt && (
//     <Banner>
//       {`Your ${permissions.effectivePlan} plan expires in ${permissions.validDaysRemaining} day(s). Upgrade now to keep premium features.`}
//     </Banner>
//   )}
  
//   <ProgressBar percentage={permissions.daysLeftPercentage} />
  