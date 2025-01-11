
import ContactLayout from '@/components/workspace/contact'
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';
import { fetchContacts } from '@/lib/server/contacts';
import { unstable_noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import React from 'react'

const Favorites = async ({
  params: { contactId, workspaceAlias },
  searchParams: { s },
}: {
  params: { contactId: string, workspaceAlias:string; };
  searchParams: { s: string };
}) => {
 
  unstable_noStore();
  const {data,count,error} = await fetchContacts()  
    if(!data) {
      console.error("Error fetching goals:", error);
      redirect(`/ws`)
    }

  return ( 
    <ContactLayout contactId={contactId} searchquery={s} data={data} count={count}>
      <ContactSubLayout>
        <main className='text-4xl font-bold p-8'>Favorite Contact</main>
      </ContactSubLayout>
    </ContactLayout>
  )
}
  
export default Favorites