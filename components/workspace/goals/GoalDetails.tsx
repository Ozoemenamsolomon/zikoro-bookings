
import React from 'react'
import KeyResultList from './KeyResultList'
import Goal from './Goal'
import AddKeyResult from './AddKeyResult'
import EditGoalBtn from './EditGoalBtn'
import BackToGoalsBtn from './BackToGoalsBtn'
import { fetchGoalsByGoalId } from '@/lib/server/goals'
import { redirect } from 'next/navigation'
import { urls } from '@/constants'

const GoalDetails = async ({goalId}:{goalId:string}) => {
  const {goal, error} = await fetchGoalsByGoalId(goalId)
  if (!goal ) redirect(urls.contactsGoals)
  return (
    <section className='bg-white sm:p-3 '>
        <section className="bg-baseBg sm:border sm:rounded-md sm:p-3 py-6 min-h-screen w-full space-y-6">
            
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