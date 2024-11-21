import ContactLayout from '@/components/workspace/contact';
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';
import React from 'react'

const ContactAnalyticsPage = async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
  return ( 
    <ContactLayout searchquery={s} >
        <ContactSubLayout>
            <main className='text-4xl font-bold p-8'>Contact Analytics</main>
        </ContactSubLayout>
    </ContactLayout>
  )
}

export default ContactAnalyticsPage