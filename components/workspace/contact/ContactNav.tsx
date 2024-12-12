'use client'
import React from 'react'
import { contactNav } from './constants'
import Link from 'next/link'
import { urls } from '@/constants';
import { useAppointmentContext } from '@/context/AppointmentContext';
import { Button } from '@/components/ui/button';
import { Outline } from 'styled-icons/boxicons-regular';
import { ChevronRight } from 'lucide-react';

const ContactNav = () => {
  const {contact,activePath,isOpen, setIsOpen, setActivePath} = useAppointmentContext()
  return (
    <div className="w-full sticky top-0 overflow-auto no-scrollbar flex gap-3 items-center px-4 md:px-6 py-3 border-b ">

        <button id='toggle button' aria-label='toggle button' onClick={()=>setIsOpen(cur=>!cur)} 
        className='md:hidden h-8 w-8 flex justify-center items-center border rounded-md text-gray-500 hover:bg-purple-50 duration-300' >
          <ChevronRight size={24} className={`${isOpen ? 'rotate-0':'rotate-180'} transform transition-all duration-300`}/>
        </button>

        {contactNav.map(({ label, link }) => (
        <Link
            key={label}
            href={`${urls.contacts}/${contact?.id}/${link}`}
            onClick={()=>setActivePath(link)}
            className={`px-4 py-1 rounded hover:ring hover:ring-gray-100 duration-300 ${
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