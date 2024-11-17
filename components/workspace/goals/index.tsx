import { Button } from '@/components/ui/button'
import React, { Suspense } from 'react'
import GoalCard from './GoalCard'
import EmptyGoal from './EmptyGoal'
import Link from 'next/link'
import { urls } from '@/constants'
import { Goal } from '@/types/goal'
import { Loader2Icon } from 'lucide-react'

const Goals = ({data,count,error}:{
    data:Goal[]|null, count:number,error:string|null
}) => {
    // loading, error states ...
    // fetch goals
    // when contact changes effect hook.
    // pagination fetch goals
  return (
    <section className='bg-white sm:p-3 '>
        {
            count===0 ? 
            <EmptyGoal/>
            :
        <section className="bg-baseBg sm:border sm:rounded-md sm:p-3 py-6 min-h-screen w-full space-y-6">
            <header className="flex justify-end">
                <Link href={urls.contactsGoalsCreate}>
                <Button className='bg-basePrimary'>New Goal</Button>
                </Link>
            </header>

            <Suspense fallback={
                <div className='h-screen pt-32 flex justify-center'><Loader2Icon className='animate-spin'/></div>
            }>
                <div className="space-y-6">
                    {/* loading state */}
                    {
                        data?.map((goal,i)=>
                            <div key={i} className='bg-white  hover:shadow duration-300 border rounded-md p-3 relative '><GoalCard  goal={goal} /></div>
                    )
                    }
                </div>
            </Suspense>
            
        </section>
        }
    </section>
  )
}

export default Goals