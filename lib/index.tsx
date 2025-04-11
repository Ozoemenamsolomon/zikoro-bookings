export * from "./utils";
export * from "./useClickOutside";
export * from "./client";
export * from "./client/bookingsAnalytics";
export * from "./client/bookingsCalender";
export * from "./settings";
import { Organization, SubscriptionPlanInfo } from "@/types";
import { differenceInCalendarDays, isAfter, isBefore, parseISO } from 'date-fns';

export const getInitials = (firstName?: string|null, lastName?: string|null): string => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };
  
export function getSubscriptionStatus(org: Organization): SubscriptionPlanInfo {
    const { subscriptionPlan, subscriptionEndDate } = org;
  
    const now = new Date();
  
    // If there's no plan or it's expired with no known end date, treat as FREE
    if (!subscriptionPlan || !subscriptionEndDate) {
      return {
        plan: 'FREE',
        validDaysRemaining: 0,
        subscriptionEndDate: null,
        isExpired: false,
        displayMessage: 'You are currently on the FREE plan. Upgrade to unlock premium features.',
        daysSinceExpiration: null,
      };
    }
  
    const endDate = parseISO(subscriptionEndDate);
    const isExpired = isBefore(endDate, now);
    const validDaysRemaining = isExpired ? 0 : differenceInCalendarDays(endDate, now);
    const daysSinceExpiration = isExpired ? differenceInCalendarDays(now, endDate) : null;
  
    let plan = subscriptionPlan;
    let displayMessage = '';
  
    if (isExpired) {
      plan = 'FREE';
      displayMessage =
        daysSinceExpiration && daysSinceExpiration < 30
          ? `Your previous plan expired ${daysSinceExpiration} day(s) ago. Reactivate now to keep your data and regain access to premium features.`
          : `You're on the FREE plan. Upgrade anytime to access more features.`;
    } else {
      displayMessage = `Your ${subscriptionPlan} plan is active and will expire in ${validDaysRemaining} day(s).`;
    }
  
    return {
      plan,
      validDaysRemaining,
      subscriptionEndDate,
      isExpired,
      displayMessage,
      daysSinceExpiration,
    };
  }
  