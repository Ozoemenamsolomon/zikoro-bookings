import ContactLayout from '@/components/workspace/contact'
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout'
import GoalsForm from '@/components/workspace/goals/GoalsForm'
import { urls } from '@/constants'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CreateNewGoal = () => {
  return (
    <ContactLayout data={[]} count={0} >
      <ContactSubLayout>
        <section className='bg-white sm:p-3 min-h-96'>
            <header className="flex justify-between gap-3 pb-3 border-b w-full">
                <Link href={urls.contactsGoals} className='bg-white border flex justify-center items-center h-8 w-8 rounded-full'>
                    <ArrowLeft size={18}/>
                </Link >
                <h3 className="font-bold text-xl">New Goal</h3>
                <div></div>
            </header>
            <GoalsForm/>
        </section>
      </ContactSubLayout>
    </ContactLayout>
  )
}

export default CreateNewGoal