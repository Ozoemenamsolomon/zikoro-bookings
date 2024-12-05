import React, { Suspense } from 'react'
import GoalCard from './GoalCard'
 
import { Goal as GoalType } from '@/types/goal'

const Goal =async({goal,goalId}:{goal:GoalType, goalId:string}) => {
  return (
    <Suspense>
      <GoalCard goal={goal} goalId={goalId} />
    </Suspense>
  )
}

export default Goal