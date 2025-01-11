import ContactLayout from '@/components/workspace/contact'
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout'
import BackToGoalsBtn from '@/components/workspace/goals/BackToGoalsBtn'
import GoalsForm from '@/components/workspace/goals/GoalsForm'
import SaveGoalBtn from '@/components/workspace/goals/SaveGoalBtn'
import { fetchContacts } from '@/lib/server/contacts'
import { fetchTeamMembers } from '@/lib/server/workspace'
import { unstable_noStore } from 'next/cache'
import { redirect } from 'next/navigation'

import React from 'react'

const CreateNewGoal = async ({
  params: { contactId,workspaceAlias },
  searchParams: { s },
}: {
  searchParams: { s: string };
  params: { contactId: string, workspaceAlias:string };
}) => {
  // Disable caching
  // unstable_noStore();
  // const {data,count,error} = await fetchContacts()
  // if(!data) {
  //   console.error("Error fetching goals:", error);
  //   redirect(`/ws`)
  // }
    
  return (
    // <ContactLayout contactId={contactId} searchquery={s} data={data} count={count}>
    //   <ContactSubLayout>
        <section className='bg-white sm:p-3 min-h-96'>
            <header className="flex justify-between gap-3 pb-3 border-b w-full">
                <BackToGoalsBtn/>
                <h3 className="font-bold text-xl">New Goal</h3>
                {/* <div></div> */}
                <SaveGoalBtn mode='create'/>
            </header>
            <GoalsForm/>
        </section>
    //   </ContactSubLayout>
    // </ContactLayout>
  )
}

export default CreateNewGoal