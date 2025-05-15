import { BookingNote, BookingsContact } from "@/types/appointments";
import { createClient } from "@/utils/supabase/server"
import { getUserData } from ".";
import { createADMINClient } from "@/utils/supabase/no-caching";

interface FetchContactsResult {
  data: BookingsContact[] | null;
  error: string | null;
  count: number;
}

export const fetchContacts = async (
  workspaceId:string,
  q?: string
): Promise<FetchContactsResult> => {
    const supabase = createADMINClient()
    const {user} = await getUserData()
  try {
    let query = supabase
      .from('bookingsContact')
      .select('*', { count: 'exact' }) 
      .eq('createdBy', user?.id)
      // .or('status.is.null,status.neq.ARCHIVED')
      .order('firstName', {ascending: false} ); 

    // If 'q' is provided, add additional filtering
    if (q) {
      query = query.eq('category', q); 
    }

    const { data, count, error } = await query;
    console.error({ data, count, error });

    if (error) {
      console.error('Error fetching contacts:', error);
      return { data: null, error: error.message, count: 0 };
    }

    return { data, error: null, count: count ?? 0 };
  } catch (error) {
    console.error('Server error:', error);
    return { data: null, error: 'Server error', count: 0 };
  }
};

export const fetchContact = async (
  contactId: string
): Promise<{data:BookingsContact|null, error: string | null;}> => {
    const supabase = createClient()
  try {
    const { data,  error } = await supabase
      .from('bookingsContact')
      .select('*') 
      .eq('id', contactId)
      // .or('status.is.null,status.neq.ARCHIVED')
      .single()

    // console.error({ data, error });
    return { data, error: error?.message||null, };
  } catch (error) {
    console.error('Server error:', error);
    return { data: null, error: 'Server error', };
  }
};


type FetchNotesParams = {
  bookingId?: string;
  contactId?: string;
  workspaceId?: string;
};

type FetchNotesResult = {
  data: BookingNote[] | null;
  error: string | null;
  count: number | null;
};

export const fetchNotes = async (
  param: FetchNotesParams
): Promise<FetchNotesResult> => {
  const supabase = createADMINClient();

  try {
    const query = supabase
      .from("bookingNote")
      .select("*, createdBy(id, userEmail, organization, firstName, lastName, phoneNumber)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (param.bookingId) {
      query.eq("bookingId", param.bookingId);
    } else if (param.contactId && param.workspaceId) {
      query.eq("bookingContactId", param.contactId).eq("workspaceId", param.workspaceId);
    } else {
      return { data: null, error: "Missing query parameters", count: null };
    }

    const { data, error, count } = await query;
console.log('FETCHING NOTES: ',  { data, error, count } )
    if (error) {
      console.error("Error fetching notes:", error.message);
      return { data: null, error: error.message, count: null };
    }

    return { data, error: null, count };
  } catch (err) {
    console.error("Server error:", err);
    return { data: null, error: "Server error", count: null };
  }
};
