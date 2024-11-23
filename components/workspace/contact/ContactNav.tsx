'use client'
import React, { useState } from 'react'
import { contactNav } from './constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { urls } from '@/constants';
import { useAppointmentContext } from '@/context/AppointmentContext';

const ContactNav = () => {
  const {contact,activePath, setActivePath} = useAppointmentContext()
  return (
    <div className="w-full sticky top-0 overflow-auto no-scrollbar flex gap-3 items-center px-6 py-3 border-b ">
        {contactNav.map(({ label, link }) => (
        <Link
            key={label}
            href={`${urls.contacts}/${contact?.email}/${link}?id=${contact?.id}&name=${contact?.firstName}`}
            onClick={()=>setActivePath(link)}
            className={`px-4 py-1 rounded   hover:border-gray-100 duration-300 ${
            link === activePath ? "text-basePrimary" : ""
            }`}
        >
            {label}
        </Link>
        ))}
    </div>
  )
}

export default ContactNav