import ContactLayout from '@/components/workspace/contact';
import AppointmentHistory from '@/components/workspace/contact/AppointmentHistory';
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';
import { fetchContacts } from '@/lib/server/contacts'
import React from 'react'

const ContactAppointmentHistory = async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
  const {data,count,error} = await fetchContacts()
  return ( 
    <ContactLayout count={count} data={data} searchquery={s} >
        <ContactSubLayout>
            <AppointmentHistory />
        </ContactSubLayout>
    </ContactLayout>
  )
}

export default ContactAppointmentHistory 