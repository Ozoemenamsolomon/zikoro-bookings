'use server'

import { createClient } from "@/utils/supabase/server";
import { getUserData } from ".";
import { BookingsCurrencyConverter, BookingTeamInput, BookingTeamMember, BookingTeams, Organization, OrganizationInput } from "@/types";
import { User } from "@/types/appointments";
import { generateSlugg } from "../generateSlug";
import { createADMINClient } from "@/utils/supabase/no-caching";
import { addMonths } from "date-fns";
 
type ResultProp = {
  data: Organization[] | null;
  error: string | null;
  count: number;
};

export const fetchWorkspaces = async (
  userId?: string,
  start: number | string = 0,
  end: number | string = 19
): Promise<ResultProp> => {
  const supabase = createClient();

  // Resolve user ID
  const id = userId ?? (await getUserData())?.user?.id;
  if (!id) {
    console.error('No user ID found.');
    return { data: null, error: 'User ID is required', count: 0 };
  }

  try {
    // Fetch organization/workspaces directly owned by the user
    const { data: workspaces, count: workspaceCount, error: workspaceError } = await supabase
      .from('organization')
      .select('*', { count: 'exact' })
      .eq('organizationOwnerId', id)
      .order('created_at', { ascending: false });

    if (workspaceError) {
      console.error('Error fetching organization:', workspaceError);
      return { data: null, error: workspaceError.message, count: 0 };
    }

    // Fetch workspaces that the user belongs to using organizationTeamMembers_Bookings
    const { data: teamWorkspaces, error: teamError } = await supabase
      .from('organizationTeamMembers_Bookings')
      .select(
        'id, workspaceAlias(*)',
        { count: 'exact' }
      )
      .eq('userId', id)
      .order('created_at', { ascending: false });

    if (teamError) {
      console.error('Error fetching organizationTeamMembers_Bookings:', teamError);
      return { data: null, error: teamError.message, count: 0 };
    }

    // Extract workspaceAlias properly (ensure it's an array of Organization objects)
    const teamWorkspaceOrganizations: Organization[] = (teamWorkspaces || [])
      .flatMap((teamWorkspace) => teamWorkspace.workspaceAlias)
      .filter((workspace)  => workspace !== null);

    // Combine both workspaces and remove duplicates by `id`
    const combinedWorkspaces: Organization[] = [
      ...(workspaces || []),
      ...teamWorkspaceOrganizations
    ].filter(
      (workspace, index, self) =>
        self.findIndex((w) => w.id === workspace.id) === index
    );
console.log({combinedWorkspaces})
    return { 
      data: combinedWorkspaces, 
      error: null, 
      count: combinedWorkspaces.length 
    };
  } catch (error) {
    console.error('Server error fetching workspaces:', error);
    return { data: null, error: 'Server error', count: 0 };
  }
};

// .select('id,organizationAlias,created_at,organizationName,subscriptionPlan,subscritionStartDate,subscriptionEndDate, organizationOwner,organizationOwnerId,BillingAddress,TaxID,payoutAccountDetails,organizationType,organizationLogo,country')
export const fetchWorkspace = async (
  alias: string
) => {
    const supabase = createClient()

    try {
    const { data, error }  = await supabase
      .from('organization')
      .select('*') 
      .eq('organizationAlias', alias)
      .single()
 
    console.error({ data, error });
    return { data, error: error?.message};
  } catch (error) {
    console.error('AppointmentLink Server error:', error);
    return { data: null, error: 'Server error'};
  }
};


export const updateBookingTeamUserId = async (
  userId: string, email:string, workspaceAlias:string
) => {
    const supabase = createClient()

    try {
    const { data, error }  = await supabase
      .from('organizationTeamMembers_Bookings')
      .update({'userId': userId}) 
      .eq('workspaceAlias', workspaceAlias)
      .eq('userEmail', email)
      .select('*, workspaceAlias(*)')
      .single()

    return { data, error: error?.message};
  } catch (error) {
    console.error('organizationTeamMembers_Bookings Server error:', error);
    return { data: null, error: 'Server error'};
  }
};

export async function checkUserExists(email: string): Promise<User|null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('userEmail', email)
    .single();
    // console.log({ data, error })
  if (error) {
    console.error('Error checking user existence:', error);
  }

  return data 
}

export const assignMyWorkspace = async (
  userId: string, email:string, organization:string, name:string, organizationType?:string,phoneNumber?:string,country?:string
) => {
    const supabase = createClient()

// and assign a default workspace = 'myworkspace'
    try {
    const { data, error }  = await supabase
      .from('organization')
      .insert({
        organizationName: organization||'My Workspace',
        organizationOwner: name||'',
        organizationOwnerId: userId,
        subscriptionPlan: 'Free',
        subscritionStartDate: new Date(),
        subscriptionEndDate: addMonths(new Date(), 1),
        subscriptionExpiryDate: addMonths(new Date(), 1),
        organizationLogo: '',
        organizationAlias: generateSlugg(organization||'My Workspace'),
        organizationType: organizationType||'',
        country:country||'',
        eventPhoneNumber:phoneNumber||'',
      }) 
      .select('*')
      .single()

      if(error) console.log('Error creating workspace: ', error)
    
        // add user as admin to the default workspace team members
        let newTeam, newTeamError
        if(data) {
          const {data:newTeamMember, error}= await supabase
          .from('organizationTeamMembers_Bookings')
          .insert({
            workspaceAlias: data?.organizationAlias,
            userId,
            userRole:'ADMIN',
            userEmail:email,
          })
          .select('*, workspaceAlias(*)')
    
          if(error) {
            newTeamError='Error occured while adding user to workspace team.'
            console.log('Error adding team member to workspace: ', error)
          }
          newTeam=newTeamMember
        }

    console.log({data, error:error?.message||null, newTeam, newTeamError})

    return {data, error:error?.message||null, newTeam, newTeamError}
  } catch (error) {
    console.error('organization Server error:', error);
    return { data: null, error: 'Server error'};
  }
};

export const createWorkspace = async (body:{
  workspaceData:OrganizationInput, userData:BookingTeamInput
}) => {
  // body.workspaceData, body.userData
  const supabase = createClient()
  try {
    const {data,error}= await supabase
    .from('organization')
    .insert(body.workspaceData)
    .select('*')
    .single()
    
    if(error) console.log('Error creating workspace: ', error)
    
    // add user as admin to the default workspace team members
    let newTeam, newTeamError
    if(data) {
      const {data:newTeamMemebr,errors} = await upsertTeamMembers({...body.userData, workspaceAlias: data?.organizationAlias, userRole:'owner'})
      console.log({newTeamMemebr, errors})

      if(Object.values(errors).some((item)=>item!==null)) {
        newTeamError='Error occured while adding user to workspace team.'
        console.log('Error adding team member to workspace: ', errors)
      }
      newTeam=newTeamMemebr
    }

    // console.log({data, error, newTeam, newTeamError})

    return {data, error:error?.message||null, newTeam, newTeamError}
  } catch (error) {
    console.error('CREATING WORKSPACE ERROR: ', error)
    return {data:null, error:'Server error! Check your network'}
  }
}

export async function upsertTeamMembers(data: any) {
  const supabase = createClient();

  try {
    const [engagementRes, credentialsRes, membersRes, bookingsRes] = await Promise.all([
      supabase.from("organizationTeamMembers_Engagement").upsert([data]),
      supabase.from("organizationTeamMembers_Credentials").upsert([data]),
      supabase.from("organizationTeamMembers").upsert([data]),
      supabase.from("organizationTeamMembers_Bookings").upsert([data]).select().single(),
    ]);

    // if(engagementRes.error||credentialsRes.error||membersRes.error||bookingsRes.error){
    //   return {
    //     data:null,
    //     errors: {
    //       engagement: engagementRes.error?.message || null,
    //       credentials: credentialsRes.error?.message || null,
    //       members: membersRes.error?.message || null,
    //       bookings: bookingsRes.error?.message || null,
    //     },
    //   }
    // }

    // console.log({engagementRes,credentialsRes, membersRes,bookingsRes})

    return {
      data: bookingsRes.data,
      errors: {
        engagement: engagementRes.error?.message || null,
        credentials: credentialsRes.error?.message || null,
        members: membersRes.error?.message || null,
        bookings: bookingsRes.error?.message || null,
      },
    };
  } catch (error) {
    console.error("Error in upserting team members:", error);
    return {
      data: null,
      errors: { general: "An unexpected error occurred" },
    };
  }
}

export const createWorkspaceTeamMember = async (
  body:any
) => {
    const supabase = createClient()

    try {
    const { data, error }  = await supabase
      .from('organizationTeamMembers_Bookings')
      .insert(body) 
      .select("*, workspaceAlias(organizationAlias,organizationName,organizationOwner,organizationOwnerId), userId(profilePicture,id,firstName,lastName,userEmail)")
      .single()

      return { data, error: error?.message};
  } catch (error) {
    console.error('organizationTeamMembers_Bookings Server error:', error);
    return { data: null, error: 'Server error'};
  }
};


export const fetchTeamMembers = async (workspaceAlias: string) => {
  const supabase = createADMINClient();

  try {
    const { data, error } = await supabase
      .from("organizationTeamMembers_Bookings")
      .select(
        `
        *,
        workspaceAlias(organizationAlias,organizationName,organizationOwner,organizationOwnerId), 
        userId(profilePicture,id,firstName,lastName,userEmail) 
      `
      )
      .eq("workspaceAlias", workspaceAlias) 
      // .not("userId", "is", null) // Correctly skip users with null userId
      .order("created_at", { ascending: false }); // Order by creation date

    if (error) {
      console.error("Error fetching team members:", error);
      return { data: null, error: error.message || "Failed to fetch team members" };
    }

    // console.log("Fetched team members:", data);
    return { data, error: null };
  } catch (error: any) {
    console.error("Server error in fetchTeamMembers:", error);
    return { data: null, error: "Server error" };
  }
};

export const fetchOneTeamMember = async (workspaceAlias: string, userEmail:string):Promise<{data:BookingTeamMember|null, error:string|null}> => {
  const supabase = createADMINClient();

  try {
    const { data, error } = await supabase
      .from("organizationTeamMembers_Bookings")
      .select(
        `
        *,
        workspaceAlias(organizationAlias,organizationName,organizationOwner,organizationOwnerId), 
        userId(profilePicture,id,firstName,lastName,userEmail) 
      `
      )
      .eq("workspaceAlias", workspaceAlias) 
      .eq("userEmail", userEmail)
      .single()

    if (error) {
      console.error("Error fetching team members:", error);
      return { data: null, error: error.message || "Failed to fetch team members" };
    }

    console.log("Fetched team member:", data);
    return { data, error: null };
  } catch (error: any) {
    console.error("Server error in fetchTeamMembers:", error);
    return { data: null, error: "Server error" };
  }
};


export const fetchActiveTeamMembers = async (workspaceAlias: string) => {
  const supabase = createADMINClient();

  try {
    const { data, error } = await supabase
      .from("organizationTeamMembers_Bookings")
      .select(
        `
        *,
        workspaceAlias(organizationAlias,organizationName,organizationOwner,organizationOwnerId), 
        userId(profilePicture,id,firstName,lastName,userEmail) 
      `
      )
      .eq("workspaceAlias", workspaceAlias) 
      .not("userId", "is", null) // Correctly skip users with null userId
      .order("created_at", { ascending: false }); // Order by creation date

    if (error) {
      console.error("Error fetching team members:", error);
      return { data: null, error: error.message || "Failed to fetch team members" };
    }
 
    return { data, error: null };
  } catch (error: any) {
    console.error("Server error in fetchTeamMembers:", error);
    return { data: null, error: "Server error" };
  }
};

export const fetchCurrencies = async ():Promise<{data:BookingsCurrencyConverter[], error:string|null}> => {
  const supabase = createClient();
  try {
  const { data, error } = await supabase
    .from("bookingsCurrencyConverter")
    .select("*");
 
  if (error) {
    console.error("Error currencies:", error);
    return { data: [], error: error.message || "Failed to fetch team members" };
  }

  return { data:data||[], error: null };
} catch (error: any) {
  console.error("Server error in fetchTeamMembers:", error);
  return { data: [], error: "Server error" };
}

}


export const updateWorkspace = async (wkspace:any) => {
  const supabase = createClient()
  return await supabase
    .from('organization')
    .update(wkspace)
    .eq('organizationAlias', wkspace.organizationAlias)
    .select()
    .single()
}