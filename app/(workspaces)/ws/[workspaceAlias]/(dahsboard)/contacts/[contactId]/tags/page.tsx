
import ContactLayout from '@/components/workspace/contact'
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';
import { fetchContacts } from '@/lib/server/contacts';
import { unstable_noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import React from 'react'

const Tags = async ({
  params: { contactId, workspaceAlias },
  searchParams: { s },
}: {
  params: { contactId: string, workspaceAlias:string; };
  searchParams: { s: string };
}) => {
 
  unstable_noStore();
    const {data,count,error} = await fetchContacts(workspaceAlias)
 
  return ( 
    <ContactLayout contactId={contactId} searchquery={s} data={data} count={count}>
      <ContactSubLayout>
          <main className='text-4xl font-bold p-8'>Contact Tags</main>
      </ContactSubLayout>
    </ContactLayout>
    )
  }

export default Tags