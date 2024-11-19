
import ContactLayout from '@/components/workspace/contact';
import ContactNotes from '@/components/workspace/contact/ContactNotes';
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';
import React from 'react'

const ContactNotesPage = async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
  return ( 
    <ContactLayout searchquery={s} >
        <ContactSubLayout>
            <ContactNotes/>
        </ContactSubLayout>
    </ContactLayout>
  )
}

export default ContactNotesPage