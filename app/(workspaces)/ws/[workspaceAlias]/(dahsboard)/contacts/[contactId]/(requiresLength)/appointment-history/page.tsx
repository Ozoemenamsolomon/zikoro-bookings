import ContactLayout from '@/components/workspace/contact';
import AppointmentHistory from '@/components/workspace/contact/AppointmentHistory';
import ContactSubLayout from '@/components/workspace/contact/ContactSubLayout';

import { fetchAppointmentHistory } from '@/lib/server/appointments';
import { fetchContact, fetchContacts } from '@/lib/server/contacts';
import { unstable_noStore } from 'next/cache';

import { redirect } from 'next/navigation';
import React from 'react'

const ContactAppointmentHistory = async ({
  params: { contactId, workspaceAlias },
  searchParams: { s },
}: {
  params: { contactId: string, workspaceAlias:string; };
  searchParams: { s: string };
}) => {
  unstable_noStore();

  const {data:contact, } = await fetchContact(contactId)
  if(!contact) {
    redirect(`/ws?msg=page not found`)
  }
  
  const { initialData, data, count, error} = await fetchAppointmentHistory({contactEmail:contact.email!})
 
  return ( 
    // <ContactLayout contactId={contactId} searchquery={s} data={contacts} count={size}>
    //   <ContactSubLayout>
        <AppointmentHistory  bookingsData={data} countSize={count!} initialItem={initialData?.[0]?.created_at} errorString={error!}/>
    //   </ContactSubLayout>
    // </ContactLayout>
  )
}

export default ContactAppointmentHistory 