
import ContactLayout from '@/components/workspace/contact';
import ContactNotes from '@/components/workspace/contact/notes/ContactNotes';
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';
import { fetchContacts, fetchNotes } from '@/lib/server/contacts';
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

  const [{data,count,error} , {data:notes,count:noteCount,error:noteErr}  ] = await Promise.all([
      fetchContacts(workspaceAlias),
      fetchNotes({ contactId, workspaceId: workspaceAlias })
    ]);
  
  return ( 
    <ContactLayout contactId={contactId} searchquery={s} data={data} count={count}>
      <ContactSubLayout> 
          <ContactNotes notes={notes} count={noteCount} error={noteErr} contactId={contactId}/>
      </ContactSubLayout>
  </ContactLayout>
  )
}

export default ContactNotesPage