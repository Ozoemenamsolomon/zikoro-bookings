
import ContactLayout from '@/components/workspace/contact';
import ContactNotes from '@/components/workspace/contact/ContactNotes';
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';
import { fetchContacts } from '@/lib/server/contacts'
import React from 'react'

const ContactNotesPage = async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
  const {data,count,error} = await fetchContacts()
  return ( 
    <ContactLayout count={count}  data={data} searchquery={s} >
        <ContactSubLayout>
            <ContactNotes/>
        </ContactSubLayout>
    </ContactLayout>
  )
}

export default ContactNotesPage