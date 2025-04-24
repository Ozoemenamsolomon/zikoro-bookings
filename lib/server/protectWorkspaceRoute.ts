'use server'

import { getUserData } from '@/lib/server'
import { createWorkspaceFromScratch, fetchWorkspaces } from '@/lib/server/workspace'
import { redirect } from 'next/navigation'
import { Organization } from '@/types'

export async function protectWorkspaceRoute(workspaceAlias: string): Promise<{ workspace: Organization | null, workspaces: Organization[] | null }> {
  const { user } = await getUserData()

  if (!user) {
    redirect('/login?msg=Please log in to continue')
  }

  const { data: workspaces } = await fetchWorkspaces(user.id)

  // fallback for page not found
  if (!workspaces || workspaces.length === 0) {
    return { workspace: null, workspaces: null }
  }

  const currentWorkspace = workspaces.find(wk => wk.organizationAlias === workspaceAlias)

  // Redirect if user is removed from the workspace or fallback for workspaceAias does not exist
  if (!currentWorkspace) {
    const defaultWorkspace = workspaces.find(wk => wk.organizationOwnerId === user.id)
        // fallback for old users witout default workspace
        if(!defaultWorkspace?.organizationAlias){
          const {data} = await createWorkspaceFromScratch(user)
          redirect(`/ws/${data?.organizationAlias}/schedule?msg=You could not gain access to the workspace`)
      }
    redirect(`/ws/${defaultWorkspace?.organizationAlias}/schedule?msg=You no longer have access to the workspace`)
  }

  const isOwner = currentWorkspace.organizationOwnerId === user.id
  const isLimitedPlan = ['Free', 'Lite'].includes(currentWorkspace?.subscriptionPlan!)

  // free/lite plan does not permit team membership
  if (!isOwner && isLimitedPlan) {
    const defaultWorkspace = workspaces.find(wk => wk.organizationOwnerId === user.id)
    // fallback for old users witout default workspace
    if(!defaultWorkspace?.organizationAlias){
      const {data} = await createWorkspaceFromScratch(user)
      redirect(`/ws/${data?.organizationAlias}/schedule?msg=You could not gain access to the workspace`)
  }
    redirect(`/ws/${defaultWorkspace?.organizationAlias}/schedule?msg=You could not gain access to the workspace`)
  }

  return { workspace: currentWorkspace, workspaces }
}


//   // Check membership
//   const { data: teamMember, error } = await supabase
//     .from("organizationTeamMembers_Bookings")
//     .select(`id,userRole, workspaceAlias(*)`)
//     .eq("workspaceAlias", workspaceAlias)
//     .eq("userEmail", user.email)
//     .single<{
//       id: number;
//       userRole: 'owner' | 'editor' | 'collaborator';
//       workspaceAlias: Organization;
//     }>();

//   const workspace: Organization | null = teamMember?.workspaceAlias || null;
//   let userWorkspaces: Organization[] = []

//   if (!workspace || error) {
//     const { data, error: orgError } = await supabase
//       .from('organization')
//       .select('*')
//       .eq('organizationOwner', user.email)
//       .order('created_at', { ascending: false });

//     if (data?.length) {
//       userWorkspaces = data;
//       const alias = await handleIfBefore(data, user);
//       redirect(`/ws/${alias || data[0]?.organizationAlias}/schedule?msg=You are no longer a member of the workspace`);
//     } else {
//       redirect(`/ws?msg=Your workspace was not found. Create a new workspace`);
//     }
//   }

//   // Deny access for non-owner users on free/lite workspaces
//   if (teamMember?.userRole !== userRoles.owner || workspace.subscriptionPlan === 'Lite') {

//       const { data } = await supabase
//         .from('organization')
//         .select('*')
//         .eq('organizationOwner', user.email)
//         .order('created_at', { ascending: false });

//       if (data?.length) {
//         userWorkspaces = data;
//         redirect(`/ws/${data[0]?.organizationAlias}/schedule?msg=You could not gain access to the workspace`);
      
//     }
//   }

  // Return if valid access



