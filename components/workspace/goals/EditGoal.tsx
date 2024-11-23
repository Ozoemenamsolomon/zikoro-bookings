import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense } from 'react'
import GoalsForm from './GoalsForm'
import { urls } from '@/constants'
import SaveGoalBtn from './SaveGoalBtn'
import Loading from '@/components/shared/Loader'
import { fetchGoalsByGoalId } from '@/lib/server/goals'
import KeyResultList from './KeyResultList'
import BackToGoalsBtn from './BackToGoalsBtn'

const EditGoal = async ({goalId}:{goalId:string}) => {
    const {goal,error} = await fetchGoalsByGoalId(goalId)
  return (
    <section className='bg-white sm:p-3 min-h-96'>
            <header className="flex justify-between gap-3 pb-3 border-b w-full">
                <BackToGoalsBtn/>
                <h3 className="font-bold text-xl">Edit Goal</h3>
                <SaveGoalBtn/>
            </header>
            <Suspense fallback={
                <div className='w-full pt-28 flex justify-center h-screen'><Loading/></div>
            }>
                <GoalsForm goal={goal!} mode='edit'>
                    <KeyResultList goalId={goalId!} />
                </GoalsForm>
            </Suspense>
        </section>
  )
}

export default EditGoal