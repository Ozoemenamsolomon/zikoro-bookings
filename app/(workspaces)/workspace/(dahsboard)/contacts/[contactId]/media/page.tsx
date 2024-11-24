
import ContactMedia from '@/components/workspace/contact/ContactMedia';
import React from 'react'

const ContactMediaPage =async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
  return ( 
    <ContactMedia />
  )
}

export default ContactMediaPage