'use client'

import { urls } from '@/constants'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const BackToGoalDetailsBtn = ({goalId}:{goalId:number}) => {
  const {contact} = useAppointmentContext()

  return (
    <Link href={`${urls.contacts}/${contact?.id}/goals/details/${goalId}/`} className='bg-white border flex justify-center items-center h-8 w-8 rounded-full'>
        <ArrowLeft size={18}/>
    </Link >  )
}

export default BackToGoalDetailsBtn