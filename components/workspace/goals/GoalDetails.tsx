
import React from 'react'
import KeyResultList from './KeyResultList'
import Goal from './Goal'
import AddKeyResult from './AddKeyResult'
import EditGoalBtn from './EditGoalBtn'
import BackToGoalsBtn from './BackToGoalsBtn'
import { fetchGoalsByGoalId } from '@/lib/server/goals'
import { redirect } from 'next/navigation'

const GoalDetails = async ({params}:{params:{workspaceAlias:string,goalId:string, contactId:string }}) => {
  
  const {goalId, workspaceAlias ,contactId} = await params
  const {goal, error} = await fetchGoalsByGoalId(goalId)

  if (!goal ) redirect(`/ws/${workspaceAlias}/contacts/${contactId} `)

  return (
    <section className='bg-white '>
        <section className="bg-baseBg  py-6   sm:p-6 min-h-screen w-full space-y-6">
            
            <header className="flex justify-between gap-3 pb-3 border-b w-full">
                <BackToGoalsBtn/>
                <h3 className="font-bold text-xl">Goal</h3>
                <EditGoalBtn goalId={goalId}/>
            </header>

            <Goal goal={goal} goalId={goalId}/>

            <KeyResultList goalId={goalId}/>

            <AddKeyResult  goal={goal} isActive={true} mode='edit' />
        </section>
    </section>
  )
}

export default GoalDetails