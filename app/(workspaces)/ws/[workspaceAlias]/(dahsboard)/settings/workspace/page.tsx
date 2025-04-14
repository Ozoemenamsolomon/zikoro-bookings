// app/(dashboard)/organization/[workspaceAlias]/analytics/page.tsx
import WorkspaceAnalytics from '@/components/workspace/workspace/WorkspaceAnalytics'
import { getPermissionsFromSubscription } from '@/lib/server/subscriptions';
import { fetchWorkspace } from '@/lib/server/workspace';
import { redirect } from 'next/navigation';
import React from 'react'
 
 const WorkspaceAnlyticsPage = async ({
   searchParams ,  params: { workspaceAlias },
 }: {
   searchParams: { date: string };  
   params: { workspaceAlias?:string },
 }) => {
 
   if(!workspaceAlias){
     redirect('/ws')
   }
   
   const {data,error} = await fetchWorkspace(workspaceAlias!)
 
   const  res = await getPermissionsFromSubscription(data!, true)
 
   return (
     <WorkspaceAnalytics permissions={res.plan} />
   )
 }
 
 export default WorkspaceAnlyticsPage

// ## 🎯 Why this is a **UX-optimized, upgrade-conversion-oriented layout**

// - **Clear Plan Status**: Current plan, status badge, and expiry notice.
// - **Progressive Feedback**: Usage progress bars and limits visually reinforce value.
// - **Urgency Prompts**: Warnings for nearing expiry and post-expiry CTAs.
// - **Feature Visibility**: Show unlocked/locked features based on plan.
// - **Historical Usage (Chart)**: Monthly chart shows engagement trends — makes value tangible.
// - **Call to Action**: Polite, visible upgrade prompts when necessary.
// - **Consistency & Clarity**: Uniform cards and predictable layouts make it scannable.

// ## 📈 Bonus Enhancements (Optional)

// - 📊 **Pie Chart** of booking limit vs used  
// - 📅 **Timeline view**: milestones for plan start, expiry, over-usage.
// - 📉 Display **downgrade risk prediction** based on low engagement.
// - 📣 Offer **limited-time discounts or bonuses** if expired recently.
