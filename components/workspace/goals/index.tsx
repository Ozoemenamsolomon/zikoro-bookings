import { Button } from '@/components/ui/button'
import React from 'react'
import GoalCard from './GoalCard'
import EmptyGoal from './EmptyGoal'
import Link from 'next/link'
import { urls } from '@/constants'

const Goals = () => {
    // loading, error states ...
    // fetch goals
    // when contact changes effect hook.
    // pagination fetch goals
  return (
    <section className='bg-white sm:p-3 '>
        {
            true ? 
            <EmptyGoal/>
            :
        <section className="bg-baseBg sm:border sm:rounded-md sm:p-3 py-6 min-h-screen w-full space-y-6">
            <header className="flex justify-end">
                <Link href={urls.contactsGoalsCreate}>
                <Button className='bg-basePrimary'>New Goal</Button>
                </Link>
            </header>

            <div className="space-y-6">
                {/* loading state */}
                {
                    [...Array(5)].map((_,i)=>
                    <GoalCard key={_} />)
                }
            </div>
        </section>
        }
    </section>
  )
}

export default Goals