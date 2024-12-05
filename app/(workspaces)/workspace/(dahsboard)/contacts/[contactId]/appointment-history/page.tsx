import AppointmentHistory from '@/components/workspace/contact/AppointmentHistory';
import { urls } from '@/constants';
import { getUserData } from '@/lib/server';
import { fetchContact } from '@/lib/server/contacts';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react'

const ContactAppointmentHistory = async ({
  searchParams: { s },
  params: {contactId },
}: {
  searchParams: { s: string };
  params: { contactId: string };
}) => {
  const supabase = createClient()
  const {user} = await getUserData()
  let limit=10
  const {data:contact, error:contactErr} = await fetchContact(contactId)
  if(!contact) redirect(`${urls.contacts}/?notFound=The contact does not exist`)
  let query = supabase
          .from('bookings')
          .select(
            'id, created_at, appointmentDuration, appointmentDate, appointmentName, appointmentTimeStr, appointmentLinkId(locationDetails)', 
            { count: 'exact' }
          )
          .eq('createdBy', user?.id)
          .eq('participantEmail', contact?.email)
          .range(0, limit-1)

          const {data:initialData}= await query
          const { data, count, error } = await query.order('appointmentDate', { ascending: false })

  // console.log({
  //   contactId, // Original URI-encoded email
  //   decodedEmail, // Decoded email string
  //   d:{ data, count, first:initialData?.[0]?.created_at, error } 
  // });
  return ( 
      <AppointmentHistory  bookingsData={data} countSize={count!} initialItem={initialData?.[0]?.created_at} errorString={error?.message!}/>
  )
}

export default ContactAppointmentHistory 