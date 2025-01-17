import Analytics from '@/components/workspace/Analytics'
import { AnalyticsProvider } from '@/context/AnalyticsContext'
import { fetchAnalytics } from '@/lib/server/analytics'
import React from 'react'

const AnalyticsPage = async ({searchParams,params}:{
    searchParams:{type?:string},
    params: { workspaceAlias?:string },
}) => {
  const workspaceAlias = (await params).workspaceAlias!
  const type = (await searchParams).type!
  const { curList, prevList, } = await fetchAnalytics({type, workspaceId:workspaceAlias})
  return (
    <AnalyticsProvider typeParam={type} curList={curList} prevList={prevList} >
      <Analytics />
    </AnalyticsProvider>
  )
}

export default AnalyticsPage