import AppointmentHistory from '@/components/workspace/contact/AppointmentHistory';
import { getUserData } from '@/lib/server';
import { createClient } from '@/utils/supabase/server';
import React from 'react'

const ContactAppointmentHistory = async ({
  searchParams: { s },
  params: {contactEmail },
}: {
  searchParams: { s: string };
  params: { contactEmail: string };
}) => {
  const supabase = createClient()
  const {user} = await getUserData()
  const decodedEmail = decodeURIComponent(contactEmail);
  let limit=10
  let query = supabase
          .from('bookings')
          .select(
            'id, created_at, appointmentDuration, appointmentDate, appointmentName, appointmentTimeStr, appointmentLinkId(locationDetails)', 
            { count: 'exact' }
          )
          .eq('createdBy', user?.id)
          .eq('participantEmail', decodedEmail)
          .range(0, limit-1)

          const {data:initialData}= await query
          const { data, count, error } = await query.order('appointmentDate', { ascending: false })

  // console.log({
  //   contactEmail, // Original URI-encoded email
  //   decodedEmail, // Decoded email string
  //   d:{ data, count, first:initialData?.[0]?.created_at, error } 
  // });
  return ( 
      <AppointmentHistory  bookingsData={data} countSize={count!} initialItem={initialData?.[0]?.created_at} errorString={error?.message!}/>
  )
}

export default ContactAppointmentHistory 