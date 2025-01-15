'use client'

import { urls } from '@/constants'
import { useAppointmentContext } from '@/context/AppointmentContext'
import Link from 'next/link'
import React from 'react'

const GetStarted = () => {
    const {getWsUrl} = useAppointmentContext()
  return (
    <Link
        href={getWsUrl(urls.schedule)}
        className=" text-white font-semibold [@media(max-width:320px)]:text-[12px] text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-[64px] rounded-lg"
    >
        Get Started For Free!
    </Link>  )
}

export default GetStarted