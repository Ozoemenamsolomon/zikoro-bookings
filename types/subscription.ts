import { TUser } from "./user";

export interface ISubscription {
  id: number;
  created_at: string;
  userId: number;
  organizationId: number;
  subscriptionType: string;
  amountPayed: number;
  startDate: string;
  expirationDate: string;
  discountCode: string;
  discountValue: number;
  currency: string;
  monthYear: string;
  user: TUser;
  planPrice: number;
  organizationAlias: string;
}

export interface ZikoroDiscount {
  id: number;
  created_at: string; // ISO timestamp string
  discountCode: string | null;
  validUntil: string | null; // ISO timestamp string (could be null)
  discountAmount: number | null;
  discountPercentage: number | null;
}
