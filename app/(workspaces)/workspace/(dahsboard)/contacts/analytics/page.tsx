import ContactLayout from '@/components/workspace/contact';
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';
import { fetchContacts } from '@/lib/server/contacts'
import React from 'react'

const ContactAnalyticsPage = async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
  const {data,count,error} = await fetchContacts()
  return ( 
    <ContactLayout data={data} searchquery={s} >
        <ContactSubLayout>
            <main className='text-4xl font-bold p-8'>Contact Analytics</main>
        </ContactSubLayout>
    </ContactLayout>
  )
}

export default ContactAnalyticsPage