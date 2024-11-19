'use client'

import { urls } from '@/constants'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { PenLine } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const EditGoalBtn = ({text='Edit',goalId}:{text?:string, goalId:string}) => {
  const {contact} = useAppointmentContext()

  return (
    <Link href={`${urls.contacts}/${contact?.email}/goals/edit/${goalId}?id=${contact?.id}&name=${contact?.firstName}`} className='flex gap-1 text-sm items-center'>
      <p>{text}</p> <PenLine size={18} />
    </Link>
  )
}

export default EditGoalBtn