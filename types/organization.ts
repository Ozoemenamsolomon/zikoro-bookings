import { User } from "./appointments";

export interface Organization {
  id: number;
  created_at: string; // ISO timestamp
  organizationAlias?: string | null;
  organizationName: string;
  subscriptionPlan?: "Free" | "Lite" | "Professional" | "Enterprise" | null;
  subscritionStartDate?: string | null; // Date as string (ISO format)
  subscriptionEndDate?: string | null; // Date as string (ISO format)
  organizationOwner?: string | null;
  userRole?: string | null;


  BillingAddress?: string | null;
  TaxID?: string | null;
  payoutAccountDetails?: Record<string, any> | null; // JSON object
  organizationOwnerId?: number | null;
  organizationType?: string | null;
  organizationLogo?: string | null;
  country?: string | null;
  eventPhoneNumber?: string | null;
  eventWhatsApp?: string | null;
  eventContactEmail?: string | null;
  x?: string | null;
  linkedIn?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  certificateAsset?: Record<string, any> | null; // JSON object
  tiktok?: string | null;
  teamMembers?: Record<string, any> | null; // JSON object
  favicon?: string | null;
  subDomain?: string | null;
  subscriptionExpiryDate?: string | null; // Date as string (ISO format)
  socialLinks?: Record<string, any> | null; // JSON object
}
export interface OrganizationInput {
  organizationAlias: string;
  organizationName: string;
  organizationOwner: string;
  organizationOwnerId: bigint | number | string;  
  organizationLogo?: string | null;
  organizationType?: string | null;
  country?: string|null;
  subscriptionPlan?: 'FREE' | string|null; // Default is 'FREE', but allows other values
  subscriptionEndDate?: string | null; // Date in string format or null
  subscritionStartDate?: string|null;
  BillingAddress?: string | null;
  TaxID?: string | null;
  payoutAccountDetails?: Record<string, any> | null; // JSON object
  
  currency?:string;
  discountValue?: number | null;
  planPrice?: number | null;
  amountPaid?: number | null;

}

export interface BookingTeams {
  id: number;
  created_at: string; // ISO timestamp
  userId?: number | null;
  userRole?: string | null;
  userEmail?: string | null;
  workspaceAlias?: string | null;
}

export interface BookingTeamInput {
  userId?: number | null;
  userRole?: string | null;
  userEmail?: string | null;
  workspaceAlias?: string | null;
}

export interface BookingTeamMember {
  id: number; // bigint represented as number in TypeScript
  created_at: string; // ISO timestamp string
  workspaceAlias?: Organization ; // Optional UUID represented as string
  userId?: User | null; // Optional bigint represented as number
  userRole?: string | null; // Optional text field
  userEmail?: string | null; // Optional text field
}

export interface BookingTeamsTable {
  id: number; // bigint represented as number in TypeScript
  created_at: string; // ISO timestamp string
  workspaceAlias?: Organization; // Optional UUID represented as string
  userId?: User | null; // Optional bigint represented as number
  userRole?: string | null; // Optional text field
  userEmail?: string | null; // Optional text field
}

 export interface BookenTokenBalance {
  id: number
  created_at: string // ISO timestamp (e.g., "2024-06-27T12:34:56Z")
  workspaceId?: number | null
  tokenId?: number | null
  lastActivity?: string | null
  lastactivityQty?: number | null
  availableBalance?: number | null
  lastactivityUserId?: number | null
}
export interface BookingsCurrencyConverter {
  id: number; // bigint
  created_at: string; // timestamp with time zone (ISO string format)
  currency: string  
  amount: number 
}

export interface SubscriptionBooking {
  id?: number;
  created_at?: string; 
  userId?: number | null;
  subscriptionType?: string | null;
  amountPaid?: number | null;
  startDate?: string | null; // ISO timestamp format
  expirationDate?: string | null; // ISO timestamp format
  discountCode?: string | null;
  discountValue?: number | null;
  currency?: string | null;
  monthYear?: string | null;
  planPrice?: number | null;
  workspaceAlias?: string | null;
}

// used in the layout sidebar header ui
  export interface SubscriptionPlanInfo {
    bookingLimit: number;
    smsEnabled: boolean;
    teamLimit: number;
    bookingsCount: number;
    activeBooking: boolean;
    isExpired: boolean;
    effectivePlan: "Free" | "Lite" | "Professional" | "Enterprise";
    validDaysRemaining: number;
    daysSinceExpiration: number | null;
    displayMessage: string;
    planStatus: "active" | "expired" | "free";
    shouldShowRenewPrompt: boolean;
    isOnFreePlan: boolean;
    daysLeftPercentage:number,
    showTrialEndingSoonPrompt:boolean,
    reactivateLink:string,
    subscriptionEndDate:string|null,
    remaininBookings?:number,
    remaininTeams?:number,
}