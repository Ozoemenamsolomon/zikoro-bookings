'use client'
import React, { useState } from 'react'
import InviteTeams from './InviteTeams'
import {  BookingTeamsTable } from '@/types'
import DeleteMember from './DeleteMember'
import useUserStore from '@/store/globalUserStore'
import ResendInvite from './ResendInvite'
import UpdateMemberRole from './UpdateMemberRole'
import EmptyList from '../ui/EmptyList'
import { NoTeamsIcon, userRoles } from '@/constants'
import Link from 'next/link'

interface TeamsProps {
  teamMembers: BookingTeamsTable[]
  subscriptionMsg?:string,
  remaininTeams?:number,
  reactivateLink?:string,
}

const Teams = ({teamMembers}: TeamsProps) => {
  const {user, currentWorkSpace, subscriptionPlan} = useUserStore()
  const {isOnFreePlan, effectivePlan,  reactivateLink} = subscriptionPlan!

  const [teams, setTeams] = useState<BookingTeamsTable[]>(teamMembers||[])
  // console.log({teams})

  if (isOnFreePlan || effectivePlan==='Lite') {
        return (
          <main className="min-h-screen w-full flex justify-center items-center">
             <EmptyList
                icon={<NoTeamsIcon/>}
                text= {effectivePlan==='Lite' ? 
                  'You are on the Lite plan, upgrade to access team membership' :
                  'You are enjoying the freemium plan, upgrade to access team membership' }
                heading={ 'Oops! Access Limit is Exhausted'  }
                CTA={<Link href={reactivateLink} className='px-4 py-2 rounded-md text-white bg-basePrimary'>Upgrade plan</Link>}
                className='lg:h-[40em] '
              />
          </main>
        );
      }

  // if(teams.length<2){
  //   return <EmptyList
  //     icon={<NoTeamsIcon/>}
  //     text= {subscriptionMsg??'Invite your team members here to collaborate and manage your bookings together.'}
  //     heading={subscriptionMsg ? 'Oops! Access Limit is Exhausted' : 'No Team Members Added Yet'}
  //     CTA={
  //       subscriptionMsg && reactivateLink ?
  //         <Link href={reactivateLink} className='px-4 py-2 rounded-md text-white bg-basePrimary'>Upgrade plan</Link> 
  //         :
  //         <InviteTeams teams={teams} setTeams={setTeams} text={'Invite team members'} />}
  //     className='lg:h-[40em] '
  //   />
  // }

  return (
    <section className="sm:py-8 sm:px-8 space-y-5 max-sm:w-screen overflow-x-auto hide-scrollbar">
      {/* Invite Team Members Section */}
      {user?.workspaceRole===userRoles.owner? <div className="flex sm:justify-end gap-4 items-center w-full ">
        <p className="text-sm">Available limit - {subscriptionPlan?.remaininTeams}</p>
        <InviteTeams teams={teams} setTeams={setTeams} /> 
      </div>: null }

      {/* Team Members Table */}
      <section className="max-w-4xl mx-auto  hide-scrollbar overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-0">
            <tr>
              <th className="p-4 w-4/8">Name</th>
              <th className="p-4 w-2/8">Role</th>
              <th className="p-4 w-1/8">Status</th>
              <th className="p-4 w-1/8"> </th>
            </tr>
          </thead>
          <tbody>
            {teams?.map((member) => (
              <tr key={member?.id} className="border-t hover:bg-gray-50">
                <td className="p-4 w-5/8 flex gap-2 items-center">
                  
                  {
                    member?.userId?.profilePicture ? 
                    <img
                      src={member?.userId?.profilePicture}
                      alt={`${member?.userId?.firstName || 'profile pic'}'s profile`}
                      className="w-12 h-12 rounded-full object-cover"
                    /> :
                    <div className="w-12 h-12 bg-baseLight font-semibold text-lg flex items-center justify-center rounded-full object-cover">
                      { `${member?.userId?.firstName?.[0] ?? ''}${member?.userId?.lastName?.[0] ?? ''}`.toUpperCase() || 'NR'}
                    </div>
                  }

                  <div className="">{
                    member?.userId ?
                      <p className="max-sm:text-sm font-semibold leading-tight">
                        {`${member?.userId?.firstName ||''} ${member?.userId?.lastName||''}`}
                      </p> :
                    <p className=" leading-3">Not Registered</p>
                    }
                      <small className='text-gray-500'>{member?.userEmail}</small>
                  </div>
                </td>
                <td className="p-4 w-2/8 ">
                  <span className="flex gap-2 items-center capitalize">
                      {member?.userRole} 
                      { member?.userId?.id !== member?.workspaceAlias?.organizationOwnerId  ? <UpdateMemberRole 
                        member={member}
                        setTeams={setTeams}
                      />:null}
                    </span>
                </td>
                <td className="p-4 w-1/8">{member?.userId ? 'Active' : 'Pending'}</td>
                <td className="p-4 w-1/8  text-center flex items-center">
                  { member?.userId?.id !== currentWorkSpace?.organizationOwnerId  ? <DeleteMember id={member?.id} setTeams={setTeams}/>:null}
                  { member?.userId?.id !== currentWorkSpace?.organizationOwnerId ? <ResendInvite member={member} setTeams={setTeams}/>:null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  )
}

export default Teams
