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

  const { plan: { remaininTeams, isOnFreePlan } } = await getPermissionsFromSubscription(organization);
console.log({isOnFreePlan,remaininTeams})
  if (remaininTeams && remaininTeams < 1) {
    return (
      <main className="min-h-screen w-full flex justify-center items-center">
         <Teams teamMembers={[]} subscriptionMsg={
          isOnFreePlan ? 
          'You are enjoying the freemium plan, upgrade to add team members' :
          'Tou have exhausted the limit for team membership this month, upgrade to add more members.'
         }/>
      </main>
    );
  }
  
  const {data,error} = await fetchTeamMembers(workspaceAlias!)
  return (
    <Teams teamMembers={data||[]}/>  )
}

export default TeamsSettingsPage