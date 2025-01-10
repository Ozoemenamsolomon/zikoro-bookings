import { User } from "./appointments";

export interface BookingWorkSpace {
  id?: string; // UUID represented as a string
  created_at?: string; // ISO timestamp string
  workspaceName?: string | null; // Optional text field
  workspaceOwner?: bigint | null; // Optional bigint, represented as number in TypeScript
  subscriptionPlan?: string | null; // Optional text field
  subscriptionEndDate?: string | null; // Optional date represented as ISO string
  workspaceLogo?: string ; // Optional text field
  workspaceAlias: string ; // Optional text field
  workspaceDescription?: string | null; // Optional text field
}

 
export interface BookingTeams {
  id: number; // bigint represented as number in TypeScript
  created_at: string; // ISO timestamp string
  workspaceId?: string | null; // Optional UUID represented as string
  userId?: number | null; // Optional bigint represented as number
  role?: string | null; // Optional text field
  email?: string | null; // Optional text field
}

export interface BookingTeamMember {
  id: number; // bigint represented as number in TypeScript
  created_at: string; // ISO timestamp string
  workspaceId?: BookingWorkSpace ; // Optional UUID represented as string
  userId?: User | null; // Optional bigint represented as number
  role?: string | null; // Optional text field
  email?: string | null; // Optional text field
}

export interface BookingTeamsTable {
  id: number; // bigint represented as number in TypeScript
  created_at: string; // ISO timestamp string
  workspaceId?: BookingWorkSpace; // Optional UUID represented as string
  userId?: User | null; // Optional bigint represented as number
  role?: string | null; // Optional text field
  email?: string | null; // Optional text field
}

 export interface CredentialTokenBalance {
  id: number
  created_at: string // ISO timestamp (e.g., "2024-06-27T12:34:56Z")
  workspaceId?: number | null
  tokenId?: number | null
  lastActivity?: string | null
  lastactivityQty?: number | null
  availableBalance?: number | null
  lastactivityUserId?: number | null
}

// export interface TOrganization {
//   id: number;
//   created_at: string;
//   organizationName: string;
//   organizationSlug: string;
//   subscriptionPlan: string;
//   subscritionStartDate: string;
//   subscriptionEndDate: string;
//   organizationOwner: string;
//   organizationAlias: string;
//   BillingAddress: string;
//   TaxID: string;
//   payoutAccountDetails: IPayoutAccountDetails | null;
//   organizationOwnerId: number;
//   organizationType: string;
//   organizationLogo: string;
//   favicon: string;
//   country: string;
//   eventPhoneNumber: string;
//   eventWhatsApp: string;
//   eventContactEmail: string;
//   x: string;
//   linkedIn: string;
//   instagram: string;
//   facebook: string;
//   subDomain: string;
//   certificateAsset: TCertificateAsset;
//   teamMembers: TOrganizationTeamMember[];
// }
