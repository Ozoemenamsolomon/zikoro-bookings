'use client'

import { Button } from '@/components/ui/button'
import { urls } from '@/constants'
import { useAppointmentContext } from '@/context/AppointmentContext'
import Link from 'next/link'
import React from 'react'

const AddNewGoalBtn = ({text='Add Goal'}:{text?:string}) => {
  const {contact} = useAppointmentContext()

  return (
    <Link href={`${urls.contacts}/${contact?.id}/goals/create`}><Button className='bg-basePrimary'>{text}</Button>
        </Link>
  )
}

export default AddNewGoalBtn