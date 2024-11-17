import { urls } from '@/constants'
import { ArrowLeft, PenLine } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import KeyResultList from './KeyResultList'
import Goal from './Goal'
import AddKeyResult from './AddKeyResult'

const GoalDetails = ({goalId}:{goalId:string}) => {
  return (
    <section className='bg-white sm:p-3 '>
        <section className="bg-baseBg sm:border sm:rounded-md sm:p-3 py-6 min-h-screen w-full space-y-6">
            
            <header className="flex justify-between gap-3 pb-3 border-b w-full">
                <Link href={urls.contactsGoals} className='bg-white border flex justify-center items-center h-8 w-8 rounded-full'>
                  <ArrowLeft size={18}/>
                </Link >
                <h3 className="font-bold text-xl">Goal</h3>
                <Link href={`${urls.contactsGoalsEdit}/${goalId}`} type="button" className='flex gap-1 items-center text-sm'>
                  <PenLine size={16}/>
                  Edit
                </Link >
            </header>

            <Goal goalId={goalId}/>

            <KeyResultList goalId={goalId}/>

            <AddKeyResult isActive={true} mode='edit' />
        </section>
    </section>
  )
}

export default GoalDetails