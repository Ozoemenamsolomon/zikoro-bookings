'use client'

import { urls } from '@/constants'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const BackToGoalsBtn = () => {
  const {contact,getWsUrl} = useAppointmentContext()

  return (
    <Link href={getWsUrl(`${urls.contacts}/${contact?.id}/goals`)} className='bg-white border flex justify-center items-center h-8 w-8 rounded-full'>
        <ArrowLeft size={18}/>
    </Link >  )
}

export default BackToGoalsBtn