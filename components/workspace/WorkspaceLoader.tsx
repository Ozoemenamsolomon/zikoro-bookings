'use client'

import { useSupabaseRealtime } from '@/hooks/services/useSupabaseRealtime'
import { getPermissionsFromSubscription } from '@/lib/server/subscriptions'
import useUserStore from '@/store/globalUserStore'
import { Organization } from '@/types'
import { useEffect, useState } from 'react'

const WorkspaceLoader = ({ workspace, workspaces }:{
    workspace:Organization,  workspaces:Organization[]  }) => {
  
      const  {user, setUser,  setCurrentWorkSpace, setWorkSpaces, setSubscritionPlan} = useUserStore()
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

    type Message = {
        eventType: 'INSERT' | 'UPDATE' | 'DELETE';
        schema: 'public';
        table: 'messages';
        record: any   // new data
        old_record: any // old data (for updates/deletes)
    };
    const [messages, setMessages] = useState<Message[]>([]);
    useSupabaseRealtime<Message>('organizationTeamMembers_Bookings', (payload) => {
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
    });
  

    
  // console.log({subscriptionPlan, currentWorkSpace})
  return null
}

export default WorkspaceLoader