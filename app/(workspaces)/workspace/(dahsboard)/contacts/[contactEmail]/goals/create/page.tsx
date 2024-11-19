import BackToGoalsBtn from '@/components/workspace/goals/BackToGoalsBtn'
import GoalsForm from '@/components/workspace/goals/GoalsForm'

import React from 'react'

const CreateNewGoal = () => {
  return (
    <section className='bg-white sm:p-3 min-h-96'>
        <header className="flex justify-between gap-3 pb-3 border-b w-full">
            <BackToGoalsBtn/>
            <h3 className="font-bold text-xl">New Goal</h3>
            <div></div>
        </header>
        <GoalsForm/>
    </section>
  )
}

export default CreateNewGoal