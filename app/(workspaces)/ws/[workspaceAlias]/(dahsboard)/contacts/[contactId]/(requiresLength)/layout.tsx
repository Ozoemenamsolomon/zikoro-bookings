import ContactLayout from '@/components/workspace/contact';
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';
import { GoalProvider } from '@/context/GoalContext'
import { fetchContacts } from '@/lib/server/contacts';
import { redirect } from 'next/navigation';
import React from 'react'

const layout = async ({
  params ,
  children,
}: {
  children:React.ReactNode,
  params: { contactId: string, workspaceAlias:string; };
}) => {

  const workspaceAlias = (await params).workspaceAlias
  const contactId = (await params).contactId

  const {data,count,error} = await fetchContacts(workspaceAlias)
  if(!data) {
    console.error("Error fetching goals:", error);
    redirect(`/ws`)
  }

  return ( 
    <ContactLayout contactId={contactId}  data={data} count={count}>
      <ContactSubLayout>
      <GoalProvider>
      <main className="max-w-4x mx-auto">
        {children}
      </main>
    </GoalProvider>
    </ContactSubLayout>
    </ContactLayout>
  )
}

export default layout