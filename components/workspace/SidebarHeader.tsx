import { urls, userRoles } from '@/constants'
import { useAppointmentContext } from '@/context/AppointmentContext'

import { getPermissionsFromSubscription } from '@/lib/server/subscriptions'
import { fetchOneTeamMember } from '@/lib/server/workspace'
import useUserStore from '@/store/globalUserStore'
import { Organization } from '@/types'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'

const SidebarHeader = () => {
    const  {user, setUser, currentWorkSpace, setCurrentWorkSpace, setWorkSpaces,workspaces, setSubscritionPlan, subscriptionPlan} = useUserStore()
    const {getWsUrl, } = useAppointmentContext()
  // global function to update the subscription,added to Sidebar as an object, this will prevent effects of propdrilling which affects children components as parent onMounts...
    useEffect(()=>{
      const fetchPlan = async () => {
        if(currentWorkSpace){
          const {plan,updatedWorkspace} = await getPermissionsFromSubscription(currentWorkSpace,true,true)
          // console.log({plan})
          setSubscritionPlan(plan)
          if(updatedWorkspace){
            setCurrentWorkSpace(updatedWorkspace)
            const updatedWorkspaces = workspaces.map((item) =>
              item.id === updatedWorkspace.id ? updatedWorkspace : item
            );
            setWorkSpaces(updatedWorkspaces);
          }
      }
      }
      fetchPlan()

      const updateRole = async () => {
        if(user) {
          if(currentWorkSpace?.organizationOwnerId!==user?.id){
            const {data, error} = await fetchOneTeamMember(currentWorkSpace?.organizationAlias!, user?.userEmail!)
            setUser({...user!, workspaceRole: data?.userRole! || userRoles.collaborator})
          } else {
            setUser({...user!, workspaceRole: userRoles.owner})
          }
        }
      }
      updateRole()
    },[user?.id, currentWorkSpace])
// console.log({subscriptionPlan, currentWorkSpace})
  return (
    <>
        <div className="flex gap-4 items-center w-full pb-2">
          <div className=" h-14 w-14 flex-shrink-0 rounded-full flex justify-center items-center bg-baseLight" 
          >
            <div className="h-12 w-12 flex-shrink-0 " 
            >
              {
                user?.profilePicture ?
                <Image src={user?.profilePicture } alt='profile-image' width={300} height={300} className='h-full w-full rounded-full object-cover'/>
                :
                <div className="h-full w-full  bg-basePrimary rounded-full"></div>
              }
            </div>
          </div>
          <div>
            <p className="text-ash leading-tight">Hello,</p>
            <p className="text-base font-medium">{user?.firstName}</p>
            <small className='uppercase'>{user?.workspaceRole}</small>
          </div>
        </div>

        <div className="border border-purple-500 rounded-xl p-2 text-center w-full space-y-1">
            <p className="text-ash  text-[12px]"> {subscriptionPlan?.displayMessage}</p>
            <Link href={subscriptionPlan?.reactivateLink!} className='py-2 text-center w-full border border-purple-500 rounded-md flex justify-center'>View Details</Link>
        </div>

        <div className="border rounded-xl p-2 text-center w-full space-y-1">
          <h5 className="text-base font-medium">Get Started</h5>
          <p className="text-ash pb-1 text-[12px]">Creating and managing your schedules couldn’t be easier.</p>

          <Link href={getWsUrl(urls.create)} className='flex justify-between gap-6 items-center py-2 px-5 text-white rounded-md'
          style={{background: `linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)`
          }}
          >
            <p className="text- font-medium">Create</p>
            <Plus size={16} />
          </Link>
        </div>
    </>
  )
}

export default SidebarHeader