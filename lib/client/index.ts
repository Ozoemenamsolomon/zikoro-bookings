
import { FormValues, PricingFactor } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { formatServicesByCategory } from "../formatServicesByCategory";
import { PostgrestError } from "@supabase/supabase-js";
import { settings } from "@/constants/settings";

const supabase = createClient()
export const supabaseClient = createClient()
// SIGNIN A USER
export const signin = async(email:string,password:string) => {
  return await supabase.auth
      .signInWithPassword({
        email,
        password,
      })
}

export const fetchServices = async () => {
  const { data, error } = await supabase.from("services").select("*");
  if (error) throw new Error(error.message);
  return formatServicesByCategory(data);
};

export const fetchServiceTypes = async () => {
  const { data, error } = await supabase.from("service_types").select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const fetchPricingFactors = async () => {
  const { data, error } = await supabase.from("pricing_factors").select("*");
  if (error) throw new Error(error.message);
  return data;
};


export const calculateCost = (
  serviceTypeId: number,
  formValues: FormValues,
  pricingFactors: PricingFactor[]
): number => {
  let total = 0;
  
  pricingFactors
    .filter(factor => factor.service_type_id === serviceTypeId)
    .forEach(factor => {
      const value = formValues[factor.factor_type.toLowerCase()] || 0;
      total += parseFloat(String(value)) * factor.base_unit_price;
    });
  
  return total;
};


// admin services

// Fetch service by ID
export const fetchServiceById = async (id: string) => {
  const { data, error } = await supabase.from("services").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
};

// Add service
export const addService = async (service:any) => {
  const { data, error } = await supabase.from("services").insert(service).select('id, created_at');
  if (error) throw error;
  return data;
};

// Update service
export const updateService = async (id: string, service: { service_name: string; base_price: number }) => {
  const { data, error } = await supabase.from("services").update(service).eq("id", id);
  if (error) throw error;
  return data;
};

// Delete service
export const deleteService = async (id: string) => {
  const { data, error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
  return data;
};

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

// Type for searchQuery, supporting both string and range queries
type SearchQueryType = {
  table: string;
  searchQuery: Record<string, any>;
  selectOptions?: string;
  orderBy?: string;
};

export const searchTable = async ({
  table,
  searchQuery,
  selectOptions = '*',
  orderBy = 'created_at',
}: SearchQueryType): Promise<{ data: any[]; error: PostgrestError | null }> => {
  try {
    let query = supabase
      .from(table)
      .select(selectOptions)
      .order(orderBy, { ascending: false });

    // Iterate through searchQuery to dynamically build the query
    for (const [key, value] of Object.entries(searchQuery)) {
      if (value !== undefined && value !== null) {
        // If the value is a string, we perform an ilike search
        if (typeof value === 'string') {
          console.log({key,value})
          query = query.ilike(key, `%${value}%`);
        } 
        // If the value is an object, check for operator and apply it
        else if (typeof value === 'object' && value.operator && value.value) {
          const baseKey = key.split('-')[0];

          // Handle various operators
          switch (value.operator) {
            case 'eq':
              query = query.eq(baseKey, value.value);
              break;
            case 'gte':
              query = query.gte(baseKey, value.value);
              break;
            case 'lte':
              query = query.lte(baseKey, value.value);
              break;
            default:
              console.warn(`Unsupported operator: ${value.operator}`);
          }
        }
      }
    }

    const { data, error } = await query;
    console.log({ data, error })
    return { data: data || [], error };
  } catch (error) {
    console.error('Error searching the table:', error);
    return { data: [], error: error as PostgrestError };
  }
};


export const searchOrders = async (searchQuery: any) => {
  const { searchText,column, startDate, endDate } = searchQuery;

  const query = {
    [column]: searchText,
    'created_at-gte': { operator: 'gte', value: startDate },
    'created_at-lte': { operator: 'lte', value: endDate },
  };

  const result = await searchTable({ table: 'orders', searchQuery: query });
  return result;
};

export const searchCustomers = async (searchQuery: any) => {
  const { searchText,column,   } = searchQuery;
  const query = {
    [column]: searchText,
  };
  const result = await searchTable({ table: 'customers', searchQuery: query });
  return result;
};


 