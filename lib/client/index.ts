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
  discount: number = 15,
  selectedType: SubscriptionType = 'Monthly',
  selectedCurrency: CurrencyOption = { label: 'USD', value: 1 },
  selectedPlan: PlanOption = { label: 'Free', value: 0 }
): CostResult {
  const baseAmount = selectedPlan.value;

  // No cost for Free plan
  if (baseAmount === 0) {
    return {
      base: 0,
      discount: 0,
      discountValue: 0,
      actualPrice: 0,
      total: 0,
      currency: selectedCurrency.label,
    };
  }

  const isYearly = selectedType === 'Yearly';
  const discountRate = isYearly ? discount/100 : 0;

  const actualPrice = isYearly ? baseAmount * 12 : baseAmount;
  const discountValue = actualPrice * discountRate;
  const discountedPrice = actualPrice - discountValue;

  const conversionRate = selectedCurrency.value;
  const total = discountedPrice * conversionRate;

  return {
    base: baseAmount * conversionRate,
    discount: discountRate,
    discountValue: discountValue * conversionRate,
    actualPrice: actualPrice * conversionRate,
    total,
    currency: selectedCurrency.label,
  };
}
