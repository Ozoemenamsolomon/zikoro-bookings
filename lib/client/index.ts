import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { settings } from "../settings";

const supabase = createClient()

// SIGNIN A USER
export const signin = async(email:string,password:string) => {
  return await supabase.auth
      .signInWithPassword({
        email,
        password,
      })
}

// fetch all data
export const fetchAllData = async (table: string, orderBy?: string, start:number=0, end:number=settings.countLimit, selectOptions:string=`*`, ): Promise<{ data: any[]; error: PostgrestError | null; count:number | null }> => {

  const fetchTableSize = supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

  const fetchData = supabase
      .from(table)
      .select(selectOptions)
      .range(start - 1, end - 1)
      .order(orderBy||'created_at', { ascending: false });
  
  const [dataResult, countResult] = await Promise.all([fetchData, fetchTableSize]);

  const { count } = countResult;
  const { data, error } = dataResult;

  return { data: data || [], error, count };
};

import { addMonths, addYears, formatISO } from 'date-fns';
import { YEARLY_DISCOUNT_RATE } from '@/constants'
 

export function calculateSubscriptionEndDate(
  startDate: string,
  planType: string
): string {
  const start = new Date(startDate);

  if (isNaN(start.getTime())) {
    throw new Error('Invalid start date');
  }

  const endDate =
    planType === 'Monthly'
      ? addMonths(start, 1)
      : planType === 'Yearly'
      ? addYears(start, 1)
      : start;

  return formatISO(endDate); // returns ISO 8601 string
}

type CurrencyOption = { label: string; value: number };
type PlanOption = { label: string; value: number; features?: any };
type SubscriptionType = string;

interface CostResult {
  base: number;
  discount: number;        // discount rate (e.g., 0.15)
  discountValue: number;   // actual amount discounted
  actualPrice: number;     // original full price before discount
  total: number;           // final price after discount
  currency: string;
}

export function calculateSubscriptionCost(
  discount: number, // percent (0–100)
  selectedType: SubscriptionType = 'Monthly',
  selectedCurrency: CurrencyOption = { label: 'USD', value: 1 },
  selectedPlan: PlanOption = { label: 'Free', value: 0 },
  discountAmount?: number // optional fixed amount
): CostResult {
  const baseMonthly = selectedPlan.value;
  const isYearly = selectedType === 'Yearly';
  const conversionRate = selectedCurrency.value;
  // Free plan — no cost
  if (baseMonthly === 0) {
    return {
      base: 0,
      discount: 0,
      discountValue: 0,
      actualPrice: 0,
      total: 0,
      currency: selectedCurrency.label,
    };
  }

  // Step 1: Calculate actual (pre-discount) price
  let actualPrice = isYearly ? baseMonthly * 12 : baseMonthly;

  // Step 2: Apply yearly discount rate if applicable
  if (isYearly) {
    const yearlyDiscountValue = actualPrice * YEARLY_DISCOUNT_RATE;
    actualPrice -= yearlyDiscountValue;
  }

  // Step 3: Apply user discount
  let discountRate = 0;
  let discountValue = 0;

  if (discount > 0) {
    discountRate = discount / 100;
    discountValue = actualPrice * discountRate;
  } else if (discountAmount && discountAmount > 0) {
    discountValue = discountAmount;
    discountRate = discountAmount / actualPrice;
  }

  const discountedPrice = Math.max(actualPrice - discountValue, 0);
  const total = discountedPrice * conversionRate;

  return {
    base: baseMonthly * conversionRate,
    discount: discountRate,
    discountValue: discountValue * conversionRate,
    actualPrice: actualPrice * conversionRate,
    total,
    currency: selectedCurrency.label,
  };
}
