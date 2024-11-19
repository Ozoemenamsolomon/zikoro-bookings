import React, { Suspense } from 'react'
import GoalCard from './GoalCard'
import { fetchGoalsByGoalId } from '@/lib/server/goals'
import { redirect } from 'next/navigation'
import { urls } from '@/constants'

const Goal =async({goalId}:{goalId:string}) => {
    const {goal, error} = await fetchGoalsByGoalId(goalId)
    if (!goal ) redirect(urls.contactsGoals)
  return (
    <Suspense>
      <GoalCard goal={goal} goalId={goalId} />
    </Suspense>
  )
}

export default Goal