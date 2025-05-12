'use client'

import { useSupabaseRealtime } from '@/hooks/services/useSupabaseRealtime'
import { getPermissionsFromSubscription } from '@/lib/server/subscriptions'
import useUserStore from '@/store/globalUserStore'
import { Organization } from '@/types'
import { useEffect, useState } from 'react'
import CreateWorkSpace from './workspace/CreateWorkSpace'

const WorkspaceLoader = ({ workspace, workspaces }:{
    workspace:Organization,  workspaces:Organization[]  }) => {
  
    const  {user, setUser,  setCurrentWorkSpace, setWorkSpaces, setSubscritionPlan} = useUserStore()
  
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

 
    useSupabaseRealtime({
      table:'organizationTeamMembers_Bookings', 
      // filter: {filter: `workspaceAlias=eq.`}, 
      onChange:(payload) => {
      console.log({payload})
      // const { eventType, new: newRecord, old: oldRecord } = payload;npm run dev
      
  
      // if (eventType === 'INSERT') {
      //   setMessages((prev) => [...prev, newRecord]);
      // }
  
      // if (eventType === 'UPDATE') {
      //   setMessages((prev) =>
      //     prev.map((msg) => (msg.id === newRecord.id ? newRecord : msg))
      //   );
      // }
  
      // if (eventType === 'DELETE') {
      //   setMessages((prev) => prev.filter((msg) => msg.id !== oldRecord.id));
      // }
    }
  });
  

    
  // console.log({subscriptionPlan, currentWorkSpace})
  return (
    <>
            <CreateWorkSpace />

    </>
  )
}

export default WorkspaceLoader