'use server'

import { createClient } from "@/utils/supabase/server";
import { getUserData } from ".";
import { BookingWorkSpace } from "@/types";
import { User } from "@/types/appointments";
import { generateSlugg } from "../generateSlug";
import { createADMINClient } from "@/utils/supabase/no-caching";
 
type ResultProp = {
  data: BookingWorkSpace[] | null;
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
    // Fetch workspaces directly owned by the user
    const { data: workspaces, count: workspaceCount, error: workspaceError } = await supabase
      .from('bookingWorkSpace')
      .select('*', { count: 'exact' })
      .eq('workspaceOwner', id)
      .order('created_at', { ascending: false })

    if (workspaceError) {
      console.error('Error fetching bookingWorkSpace:', workspaceError);
      return { data: null, error: workspaceError.message, count: 0 };
    }

    // Fetch workspaces that user belong to using the bookingTeams table.
    const { data: teamWorkspaces, error: teamError } = await supabase
      .from('bookingTeams')
      .select('id, workspaceId(*)', { count: 'exact' })
      .eq('userId', id)
      .order('created_at', { ascending: false });

    if (teamError) {
      console.error('Error fetching bookingTeams:', teamError);
      return { data: null, error: teamError.message, count: 0 };
    }

    // Combine both workspaces and remove duplicates by `id`
    const combinedWorkspaces: BookingWorkSpace[] = [
      ...(workspaces || []),
      ...(teamWorkspaces || []).map((teamWorkspace) => teamWorkspace.workspaceId),
    ].filter(
      (workspace, index, self) => 
        self.findIndex((w) => w.id === workspace.id) === index
    );

    // console.log({combinedWorkspaces, workspaces, teamWorkspaces })
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

export const fetchWorkspace = async (
  alias: string
) => {
    const supabase = createClient()

    try {
    const { data, error }  = await supabase
      .from('bookingWorkSpace')
      .select('*') 
      .eq('workspaceAlias', alias)
      .single()
// TODO: consider getting user team membership role
    console.error({ data, error });
    return { data, error: error?.message};
  } catch (error) {
    console.error('AppointmentLink Server error:', error);
    return { data: null, error: 'Server error'};
  }
};

export const createWorkspaceTeamMember = async (
  body:any
) => {
    const supabase = createClient()

    try {
    const { data, error }  = await supabase
      .from('bookingTeams')
      .insert(body) 
      .select('*, workspaceId(*)')
      .single()

    return { data, error: error?.message};
  } catch (error) {
    console.error('bookingTeams Server error:', error);
    return { data: null, error: 'Server error'};
  }
};

export const updateBookingTeamUserId = async (
  userId: string, email:string, workspaceId:string
) => {
    const supabase = createClient()

    try {
    const { data, error }  = await supabase
      .from('bookingTeams')
      .update({'userId': userId}) 
      .eq('workspaceId', workspaceId)
      .eq('email', email)
      .select('*, workspaceId(*)')
      .single()

    return { data, error: error?.message};
  } catch (error) {
    console.error('bookingTeams Server error:', error);
    return { data: null, error: 'Server error'};
  }
};

// Mock database check function (replace with real implementation)
export async function checkUserExists(email: string): Promise<User|null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('userEmail', email)
    .single();
    console.log({ data, error })
  if (error) {
    console.error('Error checking user existence:', error);
  }

  return data 
}
export const assignMyWorkspace = async (
  userId: string, email:string, organization:string
) => {
    const supabase = createClient()

// and assign a default workspace = 'myworkspace'
    try {
    const { data, error }  = await supabase
      .from('bookingWorkSpace')
      .insert({
        workspaceName: organization||'My Workspace',
        workspaceOwner: userId,
        subscriptionPlan: 'FREE',
        subscriptionEndDate:null,
        workspaceLogo: '',
        workspaceAlias: generateSlugg(organization||'My Workspace'),
        workspaceDescription: 'Default workpsace',
      }) 
      .select('*')
      .single()

      if(error) console.log('Error creating workspace: ', error)
    
        // add user as admin to the default workspace team members
        let newTeam, newTeamError
        if(data) {
          const {data:newTeamMember, error}= await supabase
          .from('bookingTeams')
          .insert({
            workspaceId: data?.workspaceAlias,
            userId,
            role:'ADMIN',
            email,
          })
          .select('*, workspaceId(*)')
    
          if(error) {
            newTeamError='Error occured while adding user to workspace team.'
            console.log('Error adding team member to workspace: ', error)
          }
          newTeam=newTeamMember
        }

    console.log({data, error:error?.message||null, newTeam, newTeamError})

    return {data, error:error?.message||null, newTeam, newTeamError}
  } catch (error) {
    console.error('bookingWorkSpace Server error:', error);
    return { data: null, error: 'Server error'};
  }
};

export const createWorkspace = async (body:any) => {
  // body.workspaceData, body.userData
  const supabase = createClient()
  try {
    const {data,error}= await supabase
    .from('bookingWorkSpace')
    .insert(body.workspaceData)
    .select('*')
    .single()
    
    if(error) console.log('Error creating workspace: ', error)
    
    // add user as admin to the default workspace team members
    let newTeam, newTeamError
    if(data) {
      const {data:newTeamMemebr,error}= await supabase
      .from('bookingTeams')
      .insert({...body.userData, workspaceId: data?.workspaceAlias,})
      .select('*, workspaceId(*)')

      if(error) {
        newTeamError='Error occured while adding user to workspace team.'
        console.log('Error adding team member to workspace: ', error)
      }
      newTeam=newTeamMemebr
    }

    console.log({data, error, newTeam, newTeamError})

    return {data, error:error?.message||null, newTeam, newTeamError}
  } catch (error) {
    console.error('CREATING WORKSPACE ERROR: ', error)
    return {data:null, error:'Server error! Check your network'}
  }
}


export const fetchTeamMembers = async (workspaceAlias: string) => {
  const supabase = createADMINClient();

  try {
    const { data, error } = await supabase
      .from("bookingTeams")
      .select(
        `
        *,
        workspaceId (
          workspaceOwner,
          workspaceAlias
        ),
        userId (*)
      `
      )
      .eq("workspaceId", workspaceAlias) // Match workspaceAlias
      .not("userId", "is", null) // Correctly skip users with null userId
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
