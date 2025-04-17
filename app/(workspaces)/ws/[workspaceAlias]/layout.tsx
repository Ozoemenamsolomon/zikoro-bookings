 
import WorkspaceAlert from '@/components/workspace/WorkspaceAlert';
import { userRoles } from '@/constants';
import { getPermissionsFromSubscription } from '@/lib/server/subscriptions';
import { Organization } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react'

// SAFE GUARDING DYNAMIC PAGES FROM USERS WHO HAVE LOST ACCESS TO A WORKSPACE
export default async function  WorkspaceLayout({
    params,
    children,
  }: {
    params: { workspaceAlias: string };
    children: React.ReactNode;
  }) {
    const workspaceAlias = (await params).workspaceAlias
    
    const supabase = createClient()

    const {
        data: { user },
      } = await supabase.auth.getUser();
    
      if (!user) {
        redirect('/login?msg=Please log in to continue');
      }

    // Check if user is still a team member
    const {data:teamMember, error} = await supabase
        .from("organizationTeamMembers_Bookings")
        .select(`id,userRole, workspaceAlias(*)`)
        .eq("workspaceAlias", workspaceAlias) 
        .eq("userEmail", user?.email) 
        .single<{
            id: number;
            userRole: 'owner' | 'editor' | 'collaborator';
            workspaceAlias: Organization;
          }>()

    const workspace:Organization|null = teamMember?.workspaceAlias || null

    // if user is not found as a team member, it means the user has been removed, so we rturn to default
    if(!workspace || error){
        const {data, error} = await supabase
            .from('organization')
            .select('id,organizationAlias')
            .eq('organizationOwner', user?.email)
        
        console.log('User was not found as member of this space, so return to user default space')
        if(data){
            redirect(`/ws/${data[data.length-1].organizationAlias}/schedule?msg=You could not gain access to the workspace`)
        }
    }
    
    // if user is not owner and it's free/lite workspace deny access and return to user's own workspcae
    if(teamMember?.userRole !== userRoles.owner && workspace) {
        const {plan:{effectivePlan, isOnFreePlan},} = await getPermissionsFromSubscription(workspace!)

        if(isOnFreePlan||effectivePlan==='Lite') {
            const {data, error} = await supabase
                .from('organization')
                .select('id,organizationAlias')
                .eq('organizationOwner', user?.email)
            
            if(data){
                redirect(`/ws/${data[data.length-1].organizationAlias}/schedule?msg=You could not gain access to the workspace`)
            }
    }}

    return (
        <>
            <WorkspaceAlert/>
            {children}
        </>
        );
  }



// User clicks workspace.

// Layout canUserAccessWorkspace(userEmail, workspaceAlias) runs.

// If allowed, render children.

// If denied, redirect to last accessible workspace.

// Sidebar pre-disables inaccessible workspaces based on team membership + plan.