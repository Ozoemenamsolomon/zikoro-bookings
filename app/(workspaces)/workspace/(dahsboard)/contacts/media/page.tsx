
import ContactLayout from '@/components/workspace/contact';
import ContactMedia from '@/components/workspace/contact/ContactMedia';
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';
import { fetchContacts } from '@/lib/server/contacts'
import React from 'react'

const ContactMediaPage =async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
  const {data,count,error} = await fetchContacts()
  return ( 
    <ContactLayout data={data} searchquery={s} >
        <ContactSubLayout>
            <ContactMedia />
        </ContactSubLayout>
    </ContactLayout>
  )
}

export default ContactMediaPage