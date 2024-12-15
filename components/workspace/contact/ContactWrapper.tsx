'use client'
import { useAppointmentContext } from '@/context/AppointmentContext'
import React from 'react'

const ContactWrapper = ({
  children,
  contactItems,
}: {
  children: React.ReactNode
  contactItems: React.ReactNode
}) => {
  const { isOpen } = useAppointmentContext()

  return (
    <section className="md:grid-cols-4 min-h-screen grid sticky top-0 md:divide-x">
      {/* Contact Items Section */}
      <div
        className={` w-full md:col-span-1 md:relative md:h-screen md:overflow-auto hide-scrollbar p-4 md:px-2   transition-all ${
          isOpen
            ? 'max-md:animate-slide-out-left  max-md:pointer-events-none max-h-screen overflow-hidden'
            : 'max-md:animate-slide-in-right  '
        }`}
      >
        {contactItems}
      </div>

      {/* Children Section */}
      <div
        className={`max-md:absolute max-md:inset-0 w-full md:col-span-3 md:relative h-full transition-all 
          ${
          isOpen
            ? 'max-md:animate-slide-in-right  '
            : 'max-md:animate-slide-out-left max-md:pointer-events-none max-h-screen overflow-auto hide-scrollbar'
        }`}
      >
        {children}
      </div>
    </section>
  )
}

export default ContactWrapper
