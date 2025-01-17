
import ContactLayout from '@/components/workspace/contact';
import ContactNotes from '@/components/workspace/contact/ContactNotes';
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';
import { fetchContacts } from '@/lib/server/contacts';
import { unstable_noStore } from 'next/cache';
import React from 'react'

const ContactNotesPage = async ({
  params ,
  searchParams ,
}: {
   params: { contactId: string, workspaceAlias:string; };
  searchParams: { s: string };
}) => {

  const workspaceAlias = (await params).workspaceAlias
  const contactId = (await params).contactId
  const s = (await searchParams).s

  unstable_noStore();
    const {data,count,error} = await fetchContacts(workspaceAlias)
  
  return ( 
    <ContactLayout contactId={contactId} searchquery={s} data={data} count={count}>
      <ContactSubLayout> 
          <ContactNotes/>
      </ContactSubLayout>
  </ContactLayout>
  )
}

export default ContactNotesPage