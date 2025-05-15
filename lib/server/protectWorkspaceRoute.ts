'use server'

import { getUserData } from '@/lib/server'
import { createWorkspaceFromScratch, fetchWorkspaces } from '@/lib/server/workspace'
import { redirect } from 'next/navigation'
import { Organization } from '@/types'

export async function protectWorkspaceRoute(workspaceAlias: string): Promise<{ workspace: Organization | null, workspaces: Organization[] | null }> {
  // console.log('========',{workspaceAlias})
  const { user } = await getUserData()

  if (!user) {
    redirect('/login?msg=Please log in to continue')
  }

  const { data: workspaces } = await fetchWorkspaces(user.id)
  // console.log({workspaces, workspaceAlias})

  // fallback for page not found
  if (!workspaces || workspaces.length === 0) {
    return { workspace: null, workspaces: null }
  }

  const currentWorkspace = workspaces.find(wk => wk.organizationAlias === workspaceAlias)
  // console.log({currentWorkspace, workspaceAlias})

  // Redirect if user is removed from the workspace or fallback for workspaceAias does not exist
  if (!currentWorkspace) {
    const defaultWorkspace = workspaces.find(wk => wk.organizationOwnerId === user.id)
        // fallback for old users witout default workspace
        if(!defaultWorkspace?.organizationAlias){
          const {data} = await createWorkspaceFromScratch(user)
          redirect(`/ws/${data?.organizationAlias}/schedule?msg=You could not gain access to the workspace`)
      }
    redirect(`/ws/${defaultWorkspace?.organizationAlias}/schedule?msg=Access denied. It looks like you've been removed from the workspace or the link you followed is broken`)
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
    redirect(`/ws/${defaultWorkspace?.organizationAlias}/schedule?msg=This team's subscription is not active. To continue using the workspace, please renew or upgrade your plan.`)
  }

  return { workspace: currentWorkspace, workspaces }
}
