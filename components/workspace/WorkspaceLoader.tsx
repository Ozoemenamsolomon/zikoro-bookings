'use client'

import { getPermissionsFromSubscription } from '@/lib/server/subscriptions'
import useUserStore from '@/store/globalUserStore'
import { Organization } from '@/types'
import { useEffect } from 'react'

const WorkspaceLoader = ({ workspace, workspaces }:{
    workspace:Organization,  workspaces:Organization[]  }) => {
  
      const  {user, setUser,  setCurrentWorkSpace, setWorkSpaces,setSubscritionPlan} = useUserStore()
    // global function to update the subscription,added to Sidebar as an object, this will prevent effects of propdrilling which affects children components as parent onMounts...
  
    useEffect(() => {
      const update = async () => {
        const {plan,updatedWorkspace} = await getPermissionsFromSubscription(workspace, true, true)
        setCurrentWorkSpace(updatedWorkspace||workspace)
        setSubscritionPlan(plan)
        setUser({...user!, workspaceRole: workspace?.userRole! || ''})
        setWorkSpaces(workspaces||[])
      }
  
      update()
    }, [])
 
  // console.log({subscriptionPlan, currentWorkSpace})
  return null
}

export default WorkspaceLoader