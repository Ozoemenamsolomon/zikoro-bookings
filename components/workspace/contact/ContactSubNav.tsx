'use client'

import React from 'react'
import { contactNavSub } from './constants'
import Link from 'next/link';
import { useAppointmentContext } from '@/context/AppointmentContext';
import { urls } from '@/constants';

const ContactSubNav = () => {
    const {contact,activePath, setActivePath} = useAppointmentContext()
  return (
    <div className="w-full flex overflow-auto no-scrollbar gap-1 items-center px-6 py-3 border-b border-slate-200   sticky top-0 bg-white z-20">
        {contactNavSub.map(({ label, link }) => (
            <Link
            href={`${urls.contacts}/${contact?.id}/${link}`}
            onClick={()=>setActivePath(link)}
            key={label}
            className={`px-3 py-1 rounded text-nowrap  hover:ring-1 hover:ring-gray-200 duration-300 ${
              activePath === link ? "bg-blue-600 text-white" : ""
            }`}
            >
            {label}
            </Link>
        ))}
    </div>
  )
}

export default ContactSubNav