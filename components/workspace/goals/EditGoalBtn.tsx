'use client'

import { urls } from '@/constants'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { PenLine } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const EditGoalBtn = ({text='Edit',goalId}:{text?:string, goalId:string}) => {
  const {contact,getWsUrl} = useAppointmentContext()

  return (
    <Link href={getWsUrl(`${urls.contacts}/${contact?.id}/goals/edit/${goalId}`)} className='flex gap-1 text-sm items-center'>
      <p>{text}</p> <PenLine size={18} />
    </Link>
  )
}

export default EditGoalBtn