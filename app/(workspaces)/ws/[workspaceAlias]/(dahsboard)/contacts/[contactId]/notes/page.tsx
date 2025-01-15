
import ContactLayout from '@/components/workspace/contact';
import ContactNotes from '@/components/workspace/contact/ContactNotes';
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';
import { fetchContacts } from '@/lib/server/contacts';
import { unstable_noStore } from 'next/cache';
import React from 'react'

const ContactNotesPage = async ({
  params: { contactId, workspaceAlias },
  searchParams: { s },
}: {
  params: { contactId: string, workspaceAlias:string; };
  searchParams: { s: string };
}) => {
 
  unstable_noStore();
    const {data,count,error} = await fetchContacts()
  
  return ( 
    <ContactLayout contactId={contactId} searchquery={s} data={data} count={count}>
      <ContactSubLayout> 
          <ContactNotes/>
      </ContactSubLayout>
  </ContactLayout>
  )
}

export default ContactNotesPage