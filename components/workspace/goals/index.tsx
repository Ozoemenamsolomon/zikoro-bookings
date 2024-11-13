import { Button } from '@/components/ui/button'
import React from 'react'
import GoalCard from './GoalCard'
import EmptyGoal from './EmptyGoal'

const Goals = () => {
    // loading, error states ...
    // fetch goals
    // when contact changes effect hook.
    // pagination fetch goals
  return (
    <section className='bg-white sm:p-3 '>
        <section className="bg-baseBg sm:border sm:rounded-md sm:p-3 py-6 min-h-screen w-full space-y-6">
            <header className="flex justify-end">
                <Button className='bg-basePrimary'>New Goal</Button>
            </header>

            <div className="space-y-6">
                {/* loading state */}
                {
                    true ? 
                    <EmptyGoal/>
                    :
                    [...Array(5)].map((_,i)=>
                    <GoalCard key={_} />)
                }
            </div>
        </section>
    </section>
  )
}

export default Goals