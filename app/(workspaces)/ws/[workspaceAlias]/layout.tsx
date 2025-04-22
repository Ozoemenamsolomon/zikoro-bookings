 
import WorkspaceAlert from '@/components/workspace/WorkspaceAlert';
import { userRoles } from '@/constants';
import { getUserData } from '@/lib/server';
import { createSubsription, getPermissionsFromSubscription } from '@/lib/server/subscriptions';
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
    // const {user,error:err} = await getUserData()
    
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
    console.log({teamMember,error, role:userRoles.owner})

    // if user is not found as a team member, it means the user has been removed, so we rturn to default
    if(!workspace || error){
        const {data, error} = await supabase
            .from('organization')
            .select('id, organizationAlias, organizationOwner, organizationOwnerId, created_at')
            .eq('organizationOwner', user?.email)

    console.log({orgs:data ,error,  })
        
    if(data){
          const alias = await handleIfBefore(data,user)
          // if created_at is isbefore April 1 2025
          if(alias){
            redirect(`/ws/${alias}/schedule?msg=You are no longer a member of the workspace`)
          } else {
            redirect(`/ws/${data[data.length-1]?.organizationAlias}/schedule?msg=You are no longer a member of the workspace`)
          }
        } else {
          redirect(`/ws?msg=Your workspace was not found. Create a new workspace`)
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
                redirect(`/ws/${data[data?.length-1]?.organizationAlias}/schedule?msg=You could not gain access to the workspace`)
            }
    }}

    return (
        <>
            <WorkspaceAlert/>
            {children}
        </>
        );
  }

import { isBefore, parseISO,  formatISO, addMonths  } from 'date-fns'
import { createWorkspace } from '@/lib/server/workspace';
import { generateSlugg } from '@/lib/generateSlug';

async function handleIfBefore(org:any[], user:any) {
  const targetDate = parseISO('2025-04-01T20:19:33.393695+00:00')
  const createdDate = parseISO(org?.[org.length-1]?.created_at)

  if (isBefore(createdDate, targetDate)) {
    const {user} = await getUserData()

    // Current date-time
    const now = new Date()

    const workspaceData = {
      organizationName: 'Beta Workspace',
      organizationOwner: user?.userEmail,
      subscriptionPlan: 'Free',
      organizationLogo: '',
      organizationAlias: generateSlugg('Beta Workspace'),
      organizationOwnerId: user?.id,
      subscritionStartDate: formatISO(now), // current date-time
      subscriptionEndDate: formatISO(addMonths(now, 1)), // 1 month from now
      subscriptionExpiryDate: formatISO(addMonths(now, 1)), // same as endDate
      organizationType: 'Private',
    }

    const userData = {
      userId:user?.id,
      userRole: 'owner',
      userEmail: user?.userEmail,
    }

    const subscriptionPlan = {
      userId: user?.id,
      subscriptionType: 'Free',
      amountPaid: 0,
      startDate: formatISO(now),
      expirationDate: formatISO(addMonths(now, 1)),
      discountCode: '',
      monthYear: 'Monthly',
    }

    const {data,error} = await createWorkspace({workspaceData, userData})
    console.log({data,error})
    if(data) {
      const {data:plan,error:err}  = await createSubsription({...subscriptionPlan, workspaceAlias: data?.organizationAlias!})
      console.log({plan,err})

      console.log('Created before target date — task performed.')
      return data?.organizationAlias!
    }
  }

  return null
}
