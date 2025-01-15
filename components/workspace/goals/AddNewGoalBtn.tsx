'use client'

import { Button } from '@/components/ui/button'
import { urls } from '@/constants'
import { useAppointmentContext } from '@/context/AppointmentContext'
import Link from 'next/link'
import React from 'react'

const AddNewGoalBtn = ({text='Add Goal'}:{text?:string}) => {
  const {contact, getWsUrl} = useAppointmentContext()

  return (
    <Link href={getWsUrl(`${urls.contacts}/${contact?.id}/goals/create`)}>
      <Button className='bg-basePrimary'>{text}</Button>
    </Link>
  )
}

export default AddNewGoalBtn