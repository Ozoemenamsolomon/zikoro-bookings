import Teams from '@/components/workspace/Settings/Teams'
import EmptyList from '@/components/workspace/ui/EmptyList';
import { NoTeamsIcon } from '@/constants';
import { getPermissionsFromSubscription } from '@/lib/server/subscriptions';
import { fetchTeamMembers, fetchWorkspace } from '@/lib/server/workspace'
import { redirect } from 'next/navigation';
import React from 'react'

const TeamsSettingsPage = async ({
  searchParams ,  params: { workspaceAlias },
}: {
  searchParams: { date: string };  
  params: { workspaceAlias?:string },
}) => {

  if(!workspaceAlias){
    redirect('/ws')
  }
  const { data: organization, error: orgError } = await fetchWorkspace(workspaceAlias);

  if (orgError || !organization) {
    return (
      <main className="flex flex-col pt-20 items-center gap-2 justify-center w-full max-w-sm">
        <EmptyList
          icon={<NoTeamsIcon/>}
          heading='Error from the server'
          text='Verify your network, and refresh the page, else consult support@dnonnysltd.com'
        />
      </main>
    );
  }

  const { plan: { remaininTeams, isOnFreePlan, effectivePlan, reactivateLink } } = await getPermissionsFromSubscription(organization,false,true);
console.log({isOnFreePlan,remaininTeams,  })
  if (isOnFreePlan || effectivePlan==='Lite') {
    // if (isOnFreePlan  ) {
    return (
      <main className="min-h-screen w-full flex justify-center items-center">
         <Teams remaininTeams={remaininTeams} teamMembers={[]} reactivateLink={reactivateLink}
            subscriptionMsg={
              effectivePlan==='Lite' ? 
              'You are on the Lite plan, upgrade to access team membership' :
              'You are enjoying the freemium plan, upgrade to access team membership'  
            }
         />
      </main>
    );
  }
  
  const {data,error} = await fetchTeamMembers(workspaceAlias!)
  return (
    <Teams teamMembers={data||[]} remaininTeams={remaininTeams} reactivateLink={reactivateLink}/>  )
}

export default TeamsSettingsPage