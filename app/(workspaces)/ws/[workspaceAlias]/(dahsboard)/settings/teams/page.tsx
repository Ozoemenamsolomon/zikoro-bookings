import Teams from '@/components/workspace/Settings/Teams'
import { fetchTeamMembers } from '@/lib/server/workspace'
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

  const {data,error} = await fetchTeamMembers(workspaceAlias!)
  return (
    <Teams teamMembers={data||[]}/>  )
}

export default TeamsSettingsPage