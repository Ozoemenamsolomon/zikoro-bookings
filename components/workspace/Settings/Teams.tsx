'use client'
import React, { useState } from 'react'
import InviteTeams from './InviteTeams'
import {  BookingTeamsTable } from '@/types'
import DeleteMember from './DeleteMember'

interface TeamsProps {
  teamMembers: BookingTeamsTable[]
}

const Teams = ({ teamMembers }: TeamsProps) => {
  const [teams, setTeams] = useState<BookingTeamsTable[]>(teamMembers||[])
  return (
    <section className="sm:py-8 sm:px-8 space-y-5">
      {/* Invite Team Members Section */}
      <div className="flex justify-end w-full ">
        <InviteTeams />
      </div>

      {/* Team Members Table */}
      <section className="max-w-4xl mx-auto  hide-scrollbar overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-0">
            <tr>
              <th className="p-4 w-4/8">Name</th>
              <th className="p-4 w-2/8">Role</th>
              <th className="p-4 w-1/8"> Status</th>
              <th className="p-4 w-1/8"> </th>
            </tr>
          </thead>
          <tbody>
            {teams?.map((member) => (
              <tr key={member.id} className="border-t hover:bg-gray-50">
                <td className="p-4 w-5/8 flex gap-2 items-center">
                  
                  {
                    member.userId?.profilePicture ? 
                    <img
                      src={member.userId?.profilePicture}
                      alt={`${member?.userId?.firstName || 'profile pic'}'s profile`}
                      className="w-12 h-12 rounded-full object-cover"
                    /> :
                    <div className="w-12 h-12 bg-baseLight font-semibold text-lg flex items-center justify-center rounded-full object-cover">
                      { `${member?.userId?.firstName?.[0] ?? ''}${member?.userId?.lastName?.[0] ?? ''}`.toUpperCase() || 'NA'}
                    </div>
                  }

                  <div className="">
                    <p className="max-sm:text-sm font-semibold leading-tight">{member?.userId?.firstName||''  + ' ' + member?.userId?.lastName||''}</p>
                    <small className='text-gray-500'>{member?.userId?.userEmail||'' }</small>
                  </div>
                </td>
                <td className="p-4 w-2/8">{member?.role}</td>
                <td className="p-4 w-1/8">{member?.userId ? 'Active' : 'Pending'}</td>
                <td className="p-4 w-1/8  text-center">
                   <DeleteMember id={member?.id} setTeams={setTeams}/>
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
